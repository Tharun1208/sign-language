"""
Model loading + the single inference path used by every page.

Pipeline:  image -> MediaPipe landmarks -> wrist-centred, scale
normalised 63-vector -> Random Forest -> label + confidence + top 5.
"""

import gc
import time

import cv2
import joblib
import numpy as np

from .. import config, state
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

        labels = bundle.get("labels") or config.DEFAULT_LABELS
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
        print(f"Error: {error}")
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

        hand = results.multi_hand_landmarks[0]
        wrist = hand.landmark[0]

        raw_coords = [
            [lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z]
            for lm in hand.landmark
        ]

        coords = np.array(raw_coords, dtype=np.float32)

        max_radius = float(np.max(np.linalg.norm(coords, axis=1)))

        if max_radius <= 1e-6:
            return None

        features = (coords / max_radius).flatten()

        if features.shape[0] != 63:
            print(f"Invalid feature count: {features.shape[0]}")
            return None

        return features.reshape(1, -1)

    except Exception as error:
        print("Landmark extraction error:", error)
        return None


# ============================================================
# PREDICT
# ============================================================

def save_prediction(response):
    with state.PREDICTIONS_LOCK:
        state.PREDICTIONS.insert(0, response)

        if len(state.PREDICTIONS) > config.MAX_PREDICTIONS:
            state.PREDICTIONS = state.PREDICTIONS[: config.MAX_PREDICTIONS]


def process_prediction(image, source="image", save=True, verbose=True):
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
            save_prediction(response)

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
        print("Error:", error)
        print("=" * 70)
        print()

        return {
            "success": False,
            "message": "Prediction processing failed.",
            "error": str(error),
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