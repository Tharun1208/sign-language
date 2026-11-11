"""Shared MediaPipe landmark preprocessing for training and inference."""

import numpy as np


WRIST_CENTERED = "wrist_centered"
WRIST_CENTERED_SCALE_NORMALIZED = "wrist_centered_scale_normalized"


def extract_landmark_features(hand, normalize_scale=False):
    """Return the wrist-relative 63-feature vector for a MediaPipe hand."""
    landmarks = getattr(hand, "landmark", ())

    if len(landmarks) != 21:
        return None

    wrist = landmarks[0]
    coords = np.asarray(
        [
            [lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z]
            for lm in landmarks
        ],
        dtype=np.float32,
    )

    if not np.isfinite(coords).all():
        return None

    if normalize_scale:
        max_radius = float(np.max(np.linalg.norm(coords, axis=1)))
        if max_radius <= 1e-6:
            return None
        coords = coords / max_radius

    return coords.flatten()


def model_feature_preprocessing(bundle):
    """Return the preprocessing mode declared by a model bundle."""
    metadata = bundle.get("metadata") or {}
    if not isinstance(metadata, dict):
        metadata = {}
    mode = metadata.get("feature_preprocessing") or bundle.get(
        "feature_preprocessing"
    )

    if mode in (WRIST_CENTERED, WRIST_CENTERED_SCALE_NORMALIZED):
        return mode
    if mode is not None:
        raise ValueError("Unsupported model feature preprocessing mode")

    # Older scale-normalized bundles only declared this legacy flag.
    if bundle.get("scale_normalized") is True:
        return WRIST_CENTERED_SCALE_NORMALIZED

    # Bundles created by train_model.py used wrist-centred coordinates only.
    return WRIST_CENTERED
