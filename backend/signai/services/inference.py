"""
Model loading + the single inference path used by every page.

Pipeline:  image -> MediaPipe landmarks -> model-compatible wrist-relative
63-vector -> Random Forest -> label + confidence + top 5.
"""

import gc
import time

import cv2
import joblib
import numpy as np

from .. import config, state
from ..features import (
    WRIST_CENTERED_SCALE_NORMALIZED,
    extract_landmark_features,
    model_feature_preprocessing,
)
from ..utils import format_accuracy, get_sign_metrics


# ============================================================
# LOAD
# ============================================================

def load_model():
    """Load the .pkl bundle into state. Returns True on success."""

    print()
    print("=" * 70)
    print("LOADING SIGN MODEL")
    print("=" * 70)
    print(f"Model path: {config.MODEL_PATH}")
    print()

    if not state_import_guard():
        return False

    try:
        bundle = joblib.load(config.MODEL_PATH)

        if not isinstance(bundle, dict):
            raise ValueError("Model file must contain a dictionary.")

        model = bundle.get("model")

        if model is None:
            raise ValueError("The model file does not contain a 'model' object.")

        feature_count = int(bundle.get("feature_count", 63))
        model_feature_count = getattr(model, "n_features_in_", feature_count)
        if feature_count != model_feature_count:
            raise ValueError("Model feature count does not match its bundle.")

        labels = bundle.get("labels") or config.DEFAULT_LABELS
        classes = getattr(model, "classes_", None)
        if classes is not None and set(map(str, classes)) != set(map(str, labels)):
            raise ValueError("Model classes do not match the bundle labels.")

        model_feature_preprocessing(bundle)

        performance = bundle.get("performance") or {}

        if not isinstance(performance, dict):
            performance = {}

        per_class = performance.get("per_class_metrics") \
            or bundle.get("per_class_metrics") \
            or {}

        if not isinstance(per_class, dict):
            per_class = {}

        metadata = bundle.get("metadata") or {}

        if not isinstance(metadata, dict):
            metadata = {}

        dataset = bundle.get("dataset") or {}

        if not isinstance(dataset, dict):
            dataset = {}

        # ---- commit to shared state only after everything validated ----
        state.MODEL_DATA = bundle
        state.MODEL = model
        state.LABELS = labels
        state.PERFORMANCE = performance
        state.PER_CLASS_METRICS = per_class
        state.MODEL_METADATA = metadata
        state.DATASET_INFO = dataset
        state.MODEL_LOADED = True

        print("MODEL LOADED SUCCESSFULLY")
        print("-" * 70)
        print(f"Model Type:     {type(model).__name__}")
        print(f"Feature Count:  {bundle.get('feature_count', 63)}")
        print(f"Labels:         {len(labels)}")
        print(f"Training:       {format_accuracy(performance.get('training_accuracy_percent'))}%")
        print(f"Validation:     {format_accuracy(performance.get('validation_accuracy_percent'))}%")
        print(f"Test:           {format_accuracy(performance.get('test_accuracy_percent'))}%")
        print(f"Per-class rows: {len(per_class)}")
        print("-" * 70)
        print()

        return True

    except Exception as error:
        state.MODEL_LOADED = False

        print()
        print("MODEL LOADING FAILED")
        print("-" * 70)
        print(f"Error: {type(error).__name__}")
        print("-" * 70)
        print()

        return False


def state_import_guard():
    import os

    if not os.path.exists(config.MODEL_PATH):
        print("ERROR: Model file not found.")
        state.MODEL_LOADED = False
        return False

    return True


# ============================================================
# LANDMARKS
# ============================================================

def extract_landmarks_from_image(image):
    """Return a (1, 63) feature matrix, or None when no usable hand."""

    if image is None:
        return None

    try:
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        height, width = image_rgb.shape[:2]
        longest = max(height, width)

        if longest > config.MAX_IMAGE_DIMENSION:

            scale = config.MAX_IMAGE_DIMENSION / longest

            image_rgb = cv2.resize(
                image_rgb,
                (
                    max(1, int(width * scale)),
                    max(1, int(height * scale)),
                ),
                interpolation=cv2.INTER_AREA,
            )

        with state.PREDICTION_LOCK:
            results = state.get_hands().process(image_rgb)

        if not results.multi_hand_landmarks:
            return None

        normalize_scale = (
            model_feature_preprocessing(state.MODEL_DATA)
            == WRIST_CENTERED_SCALE_NORMALIZED
        )
        features = extract_landmark_features(
            results.multi_hand_landmarks[0],
            normalize_scale=normalize_scale,
        )

        if features is None:
            return None

        if features.shape[0] != 63:
            print(f"Invalid feature count: {features.shape[0]}")
            return None

        return features.reshape(1, -1)

    except Exception as error:
        print("Landmark extraction failed:", type(error).__name__)
        return None


# ============================================================
# PREDICT
# ============================================================

def save_prediction(response, user_id=None):
    with state.PREDICTIONS_LOCK:
        saved = dict(response)
        saved["_user_id"] = str(user_id) if user_id else None
        state.PREDICTIONS.insert(0, saved)

        if len(state.PREDICTIONS) > config.MAX_PREDICTIONS:
            state.PREDICTIONS = state.PREDICTIONS[: config.MAX_PREDICTIONS]


def process_prediction(
    image,
    source="image",
    save=True,
    verbose=True,
    user_id=None,
):
    """Run the full pipeline. Returns (payload, http_status)."""

    started = time.perf_counter()

    if not state.MODEL_LOADED:
        return {"success": False, "message": "AI model is not loaded."}, 500

    try:
        features = extract_landmarks_from_image(image)

        if features is None:
            elapsed = round((time.perf_counter() - started) * 1000, 2)

            return {
                "success": False,
                "message": (
                    "No hand detected in the image. Please keep your hand "
                    "fully visible inside the camera frame."
                ),
                "processing_time_ms": elapsed,
            }, 400

        expected = int(state.MODEL_DATA.get("feature_count", 63))

        if features.shape[1] != expected:
            return {
                "success": False,
                "message": "Feature count mismatch.",
                "expected_features": expected,
                "received_features": int(features.shape[1]),
            }, 500

        predicted_label = str(state.MODEL.predict(features)[0]).strip().upper()

        confidence = 0.0
        probabilities = None

        if hasattr(state.MODEL, "predict_proba"):
            probabilities = state.MODEL.predict_proba(features)[0]

            class_names = [
                str(item).strip().upper()
                for item in getattr(state.MODEL, "classes_", [])
            ]

            if predicted_label in class_names:
                index = class_names.index(predicted_label)

                if index < len(probabilities):
                    confidence = float(probabilities[index])

        confidence = min(1.0, max(0.0, confidence))
        confidence_percent = round(confidence * 100, 2)

        # ---- top 5 classes ----
        top_predictions = []

        if probabilities is not None:
            try:
                pairs = [
                    {
                        "label": str(cls).strip().upper(),
                        "confidence": round(float(probabilities[idx]), 4),
                        "confidence_percent": round(float(probabilities[idx]) * 100, 2),
                    }
                    for idx, cls in enumerate(getattr(state.MODEL, "classes_", []))
                    if idx < len(probabilities)
                ]

                pairs.sort(key=lambda item: item["confidence"], reverse=True)
                top_predictions = pairs[:5]

            except Exception as error:
                print("Top predictions error:", error)

        if not top_predictions and predicted_label:
            top_predictions = [{
                "label": predicted_label,
                "confidence": round(confidence, 4),
                "confidence_percent": confidence_percent,
            }]

        sign = get_sign_metrics(predicted_label)

        elapsed = round((time.perf_counter() - started) * 1000, 2)

        response = {
            "success": True,
            "label": predicted_label,
            "predicted_label": predicted_label,
            "prediction": predicted_label,
            "confidence": round(confidence, 6),
            "confidence_percent": confidence_percent,
            "top_predictions": top_predictions,
            "sign_accuracy_percent": sign["sign_accuracy_percent"],
            "sign_accuracy": sign["sign_accuracy_percent"],
            "support": sign["support"],
            "processing_time_ms": elapsed,
            "model": "Random Forest Classifier",
            "model_name": "Random Forest Classifier",
            "feature_count": int(features.shape[1]),
            "source": source,
            "timestamp": time.time(),
        }

        if save:
            save_prediction(response, user_id=user_id)

        if verbose:
            print()
            print("=" * 70)
            print("PREDICTION")
            print("=" * 70)
            print(f"Source:          {source}")
            print(f"Predicted Sign:  {predicted_label}")
            print(f"Confidence:      {confidence_percent:.2f}%")
            print(f"Processing Time: {elapsed} ms")
            print("=" * 70)
            print()

        return response, 200

    except Exception as error:
        print()
        print("=" * 70)
        print("PREDICTION PROCESSING ERROR")
        print("=" * 70)
        print("Error:", type(error).__name__)
        print("=" * 70)
        print()

        return {
            "success": False,
            "message": "Prediction processing failed.",
        }, 500

    finally:
        try:
            del image
        except Exception:
            pass

        try:
            gc.collect()
        except Exception:
            pass


# ============================================================
# HEALTH PAYLOAD HELPERS
# ============================================================

def accuracy_summary():
    if not state.MODEL_LOADED:
        return None, None, None

    return (
        format_accuracy(state.PERFORMANCE.get("training_accuracy_percent")),
        format_accuracy(state.PERFORMANCE.get("validation_accuracy_percent")),
        format_accuracy(state.PERFORMANCE.get("test_accuracy_percent")),
    )