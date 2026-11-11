"""
Shared mutable runtime state.

Kept in one place so services and blueprints all read/write the same
objects instead of passing them around. Threads are guarded by locks.
"""

import threading

from . import config


# ============================================================
# AUTH
# ============================================================

# token -> {"user": {...}, "created_at": float}
AUTH_TOKENS = {}

AUTH_LOCK = threading.Lock()

USERS_LOCK = threading.Lock()
AUTH_ATTEMPTS = {}
AUTH_ATTEMPTS_LOCK = threading.Lock()


# ============================================================
# MODEL
# ============================================================

MODEL_DATA = None
MODEL = None

LABELS = []

PERFORMANCE = {}
PER_CLASS_METRICS = {}
MODEL_METADATA = {}
DATASET_INFO = {}

MODEL_LOADED = False


# ============================================================
# INFERENCE
# ============================================================

# MediaPipe Hands is a single shared instance, so inference is
# serialised when a background video job runs alongside live frames.
PREDICTION_LOCK = threading.Lock()

_HANDS = None


def get_hands():
    """Lazily build the shared MediaPipe Hands detector."""

    global _HANDS

    if _HANDS is None:

        import mediapipe as mp

        print()
        print("=" * 70)
        print("INITIALIZING MEDIAPIPE HANDS")
        print("=" * 70)

        _HANDS = mp.solutions.hands.Hands(
            static_image_mode=True,
            max_num_hands=1,
            model_complexity=0,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )

        print("MediaPipe Hands initialized.")
        print("=" * 70)
        print()

    return _HANDS


# ============================================================
# PREDICTION HISTORY
# ============================================================

PREDICTIONS = []

PREDICTIONS_LOCK = threading.Lock()


# ============================================================
# FEEDBACK
# ============================================================

FEEDBACK_LOCK = threading.Lock()


# ============================================================
# RECOGNITION SESSIONS / VIDEO JOBS
# ============================================================

RECOGNITION_SESSIONS = {}

VIDEO_JOBS = {}

VIDEO_LOCK = threading.Lock()
VIDEO_UPLOAD_ATTEMPTS = {}
VIDEO_UPLOAD_LOCK = threading.Lock()
VIDEO_SLOTS = threading.BoundedSemaphore(config.MAX_CONCURRENT_VIDEO_JOBS)


# ============================================================
# CONVENIENCE ALIASES
# ============================================================

MAX_PREDICTIONS = config.MAX_PREDICTIONS