"""
Recognition sessions, history and the speech contract.

Serves:
    /dashboard, /analytics  -> /api/v1/history
    /live-recognition       -> /api/v1/recognition/*
    /settings (voice)       -> /api/v1/translation/speech
"""

import logging
import time
import uuid

from flask import Blueprint, jsonify, request

from .. import config, security, state
from ..services import inference

sessions_bp = Blueprint("sessions", __name__, url_prefix="/api/v1/recognition")
history_bp = Blueprint("history", __name__, url_prefix="/api/v1")
speech_bp = Blueprint("speech", __name__, url_prefix="/api/v1/translation")
logger = logging.getLogger("signai.sessions")


# ============================================================
# POST /api/v1/recognition/session
# ============================================================

@sessions_bp.route("/session", methods=["POST"])
def create_session():

    data = request.get_json(silent=True) or {}
    session_id = uuid.uuid4().hex

    record = {
        "id": session_id,
        "language": data.get("language", "ISL"),
        "source": data.get("source", "live"),
        "started_at": time.time(),
    }

    state.RECOGNITION_SESSIONS[session_id] = record

    return jsonify({"success": True, "session": record}), 201


# ============================================================
# POST /api/v1/recognition/predict
# ============================================================

@sessions_bp.route("/predict", methods=["POST"])
def recognition_predict():

    import cv2
    import numpy as np

    uploaded_file = (
        request.files.get("frame")
        or request.files.get("image")
        or request.files.get("file")
    )

    if uploaded_file is None:
        return jsonify({
            "success": False,
            "message": "No frame uploaded. Use field name 'frame'.",
        }), 400

    try:
        file_bytes = uploaded_file.stream.read(config.MAX_FRAME_UPLOAD_BYTES + 1)
        if not file_bytes:
            return jsonify({
                "success": False,
                "message": "Uploaded frame is empty.",
            }), 400
        if len(file_bytes) > config.MAX_FRAME_UPLOAD_BYTES:
            return jsonify({
                "success": False,
                "message": "Uploaded frame exceeds the 5 MB limit.",
            }), 413

        image = cv2.imdecode(
            np.frombuffer(file_bytes, dtype=np.uint8),
            cv2.IMREAD_COLOR,
        )

        if image is None:
            return jsonify({
                "success": False,
                "message": "Unable to decode the uploaded frame.",
            }), 400

        try:
            threshold = float(request.form.get("threshold", 0.5))
        except (TypeError, ValueError):
            threshold = 0.5

        auth_record = security.current_auth(request)
        response, status_code = inference.process_prediction(
            image,
            source="recognition",
            save=True,
            verbose=False,
            user_id=auth_record["user"].get("id") if auth_record else None,
        )

        if status_code != 200 or not response.get("success"):
            return jsonify(response), status_code

        confidence = float(response.get("confidence", 0))

        response.update({
            "language": "ISL",
            "prediction": response.get("label"),
            "status": "recognized" if confidence >= threshold else "uncertain",
            "threshold": threshold,
            "model_version": config.MODEL_VERSION,
        })

        return jsonify(response), 200

    except Exception as error:
        logger.error("Recognition failed (%s)", type(error).__name__)
        return jsonify({
            "success": False,
            "message": "Recognition failed.",
        }), 500


# ============================================================
# GET /api/v1/history
# ============================================================

@history_bp.route("/history", methods=["GET"])
def history():

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

    items = [
        {
            "id": index,
            "prediction": item.get("label"),
            "confidence": item.get("confidence"),
            "confidence_percent": item.get("confidence_percent"),
            "source": item.get("source"),
            "timestamp": item.get("timestamp"),
            "model_version": config.MODEL_VERSION,
        }
        for index, item in enumerate(snapshot)
    ]

    return jsonify({"success": True, "count": len(items), "history": items})


# ============================================================
# POST /api/v1/translation/speech
#
# Actual synthesis happens client-side with the Web Speech API. This
# endpoint validates the text and returns the contract the UI expects.
# ============================================================

@speech_bp.route("/speech", methods=["POST"])
def speech():

    data = request.get_json(silent=True) or {}
    text = str(data.get("text", "")).strip()

    if not text:
        return jsonify({"success": False, "message": "No text supplied."}), 400

    return jsonify({
        "success": True,
        "text": text,
        "mode": "browser-tts",
        "message": "Use window.speechSynthesis in the client to play this text.",
    })


@speech_bp.route("/refine", methods=["POST"])
def refine_translation():
    """V1 translation refinement using Groq AI."""
    from ..services import groq_service

    data = request.get_json(silent=True) or {}
    words = data.get("words")
    raw_text = data.get("text", "")
    input_payload = words if (words and isinstance(words, list)) else raw_text

    result = groq_service.refine_sentence(
        input_payload,
        model=data.get("model"),
    )
    return jsonify(result), 200
