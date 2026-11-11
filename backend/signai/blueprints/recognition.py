"""
Recognition endpoints.

Serves:
    /live-recognition      -> /api/predict/frame
    /image-recognition     -> /api/predict
    /dashboard             -> /api/health, /api/predictions
    /analytics             -> /api/model-info, /api/health
"""

import logging

from flask import Blueprint, jsonify, request

from .. import config, security, state
from ..services import inference

recognition_bp = Blueprint("recognition", __name__, url_prefix="/api")
logger = logging.getLogger("signai.recognition")


def _decode_upload(uploaded_file, max_bytes):
    """Read + decode an uploaded image. Returns (image, error_response)."""

    import cv2
    import numpy as np

    if uploaded_file is None:
        return None, ({"success": False, "message": "No image uploaded."}, 400)

    file_bytes = uploaded_file.read()

    if not file_bytes:
        return None, ({"success": False, "message": "Uploaded image is empty."}, 400)

    if len(file_bytes) > max_bytes:
        return None, ({
            "success": False,
            "message": f"Image is too large. Maximum size is {max_bytes // (1024 * 1024)} MB.",
        }, 413)

    image = cv2.imdecode(
        np.frombuffer(file_bytes, dtype=np.uint8),
        cv2.IMREAD_COLOR,
    )

    if image is None:
        return None, ({"success": False, "message": "Unable to read the uploaded image."}, 400)

    return image, None


# ============================================================
# HEALTH  (dashboard + analytics)
# ============================================================

@recognition_bp.route("/health", methods=["GET"])
def health():

    training, validation, test = inference.accuracy_summary()

    from ..storage import is_mongo_active

    return jsonify({
        "success": True,
        "status": "online",
        "service": "SignAI Backend",
        "model_loaded": state.MODEL_LOADED,
        "google_auth_configured": bool(config.GOOGLE_CLIENT_ID),
        "email_auth_configured": True,
        "storage": "MongoDB" if is_mongo_active() else "JSON file",
        "database": is_mongo_active(),
        "database_type": "MongoDB" if is_mongo_active() else "JSON file",
        "model": "Random Forest Classifier",
        "model_name": "Random Forest Classifier",
        "model_type": type(state.MODEL).__name__ if state.MODEL is not None else None,
        "feature_count": (
            state.MODEL_DATA.get("feature_count", 63)
            if state.MODEL_LOADED and state.MODEL_DATA
            else 63
        ),
        "labels": state.LABELS,
        "number_of_labels": len(state.LABELS),
        "training_accuracy_percent": training,
        "validation_accuracy_percent": validation,
        "test_accuracy_percent": test,
        "prediction_endpoint": "/api/predict",
        "frame_endpoint": "/api/predict/frame",
        "google_login_endpoint": "/api/auth/google",
        "email_register_endpoint": "/api/auth/register",
        "email_login_endpoint": "/api/auth/login",
        "groq_configured": bool(config.GROQ_API_KEY),
        "groq_model": config.GROQ_MODEL,
        "groq_refine_endpoint": "/api/groq/refine",
    })


# ============================================================
# MODEL INFO  (analytics page)
# ============================================================

@recognition_bp.route("/model-info", methods=["GET"])
def model_info():

    if not state.MODEL_LOADED:
        return jsonify({
            "success": False,
            "model_loaded": False,
            "message": "Model is not loaded.",
        }), 500

    training, validation, test = inference.accuracy_summary()

    return jsonify({
        "success": True,
        "model_loaded": True,
        "model": "Random Forest Classifier",
        "model_name": "Random Forest Classifier",
        "model_type": type(state.MODEL).__name__,
        "feature_count": state.MODEL_DATA.get("feature_count", 63),
        "labels": state.LABELS,
        "number_of_labels": len(state.LABELS),
        "training_accuracy_percent": training,
        "validation_accuracy_percent": validation,
        "test_accuracy_percent": test,
        "feature_description": state.MODEL_METADATA.get("feature_description"),
        "model_version": config.MODEL_VERSION,
        "metadata": state.MODEL_METADATA,
        "dataset": state.DATASET_INFO,
        "per_class_metrics": state.PER_CLASS_METRICS,
    })


# ============================================================
# IMAGE PREDICTION  (image-recognition page)
# ============================================================

@recognition_bp.route("/predict", methods=["POST"])
def predict():

    uploaded_file = request.files.get("image") or request.files.get("file")

    if uploaded_file is None:
        return jsonify({
            "success": False,
            "message": "No image uploaded. Use field name 'image'.",
        }), 400

    try:
        image, error = _decode_upload(uploaded_file, config.MAX_IMAGE_UPLOAD_BYTES)

        if error:
            payload, status = error
            return jsonify(payload), status

        record = security.current_auth(request)
        response, status_code = inference.process_prediction(
            image,
            source="image",
            user_id=record["user"].get("id") if record else None,
        )

        return jsonify(response), status_code

    except Exception as error:
        logger.error("Image prediction failed (%s)", type(error).__name__)
        return jsonify({
            "success": False,
            "message": "Prediction failed.",
        }), 500


# ============================================================
# LIVE FRAME PREDICTION  (live-recognition page)
# ============================================================

@recognition_bp.route("/predict/frame", methods=["POST"])
def predict_frame():

    uploaded_file = (
        request.files.get("frame")
        or request.files.get("image")
        or request.files.get("file")
    )

    if uploaded_file is None:
        return jsonify({
            "success": False,
            "message": "No webcam frame uploaded. Use field name 'frame'.",
        }), 400

    try:
        image, error = _decode_upload(uploaded_file, config.MAX_FRAME_UPLOAD_BYTES)

        if error:
            payload, status = error
            return jsonify(payload), status

        # Live frames are not persisted to history on every tick; the
        # dashboard stream reads /api/predictions from image / video runs.
        response, status_code = inference.process_prediction(
            image,
            source="webcam",
            save=False,
            verbose=False,
        )

        return jsonify(response), status_code

    except Exception as error:
        logger.error("Live frame prediction failed (%s)", type(error).__name__)
        return jsonify({
            "success": False,
            "message": "Live prediction failed.",
        }), 500


# ============================================================
# PREDICTION HISTORY  (dashboard, image-recognition)
# ============================================================

@recognition_bp.route("/predictions", methods=["GET"])
def get_predictions():

    record = security.current_auth(request)
    if not record:
        return jsonify({
            "success": False,
            "message": "Authentication is required.",
        }), 401

    user_id = str(record["user"].get("id", ""))
    with state.PREDICTIONS_LOCK:
        snapshot = [
            item
            for item in state.PREDICTIONS
            if item.get("_user_id") == user_id
        ]
    public_items = [
        {key: value for key, value in item.items() if key != "_user_id"}
        for item in snapshot
    ]

    return jsonify({
        "success": True,
        "predictions": public_items,
        "count": len(public_items),
    })


@recognition_bp.route("/predictions", methods=["DELETE"])
def clear_predictions():

    record = security.current_auth(request)
    if not record:
        return jsonify({
            "success": False,
            "message": "Authentication is required.",
        }), 401

    user_id = str(record["user"].get("id", ""))
    with state.PREDICTIONS_LOCK:
        state.PREDICTIONS = [
            item
            for item in state.PREDICTIONS
            if item.get("_user_id") != user_id
        ]

    return jsonify({
        "success": True,
        "message": "Prediction history cleared.",
    })