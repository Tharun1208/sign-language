"""
Central configuration for the SignAI backend.

Everything that was previously a module-level constant inside the
monolithic app.py now lives here, so each blueprint / service can
import paths and settings without circular dependencies.
"""

import os

from dotenv import load_dotenv

load_dotenv()


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "sign_model.pkl")

# ============================================================
# DATABASE & STORAGE
# ============================================================

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017").strip()

MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "signai").strip()

USERS_FILE = os.getenv(
    "USERS_FILE",
    os.path.join(BASE_DIR, "users.json"),
)

FEEDBACK_FILE = os.getenv(
    "FEEDBACK_FILE",
    os.path.join(os.path.dirname(USERS_FILE), "feedback.json"),
)

VIDEO_DIR = os.path.join(BASE_DIR, "uploads", "videos")


# ============================================================
# AUTHENTICATION
# ============================================================

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "").strip()


# ============================================================
# UPLOAD LIMITS
# ============================================================

MAX_CONTENT_LENGTH = 150 * 1024 * 1024  # 150 MB (whole request body)

MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024   # /api/predict
MAX_FRAME_UPLOAD_BYTES = 5 * 1024 * 1024    # /api/predict/frame

ALLOWED_VIDEO_EXTENSIONS = {"mp4", "webm", "mov", "m4v", "avi", "mkv"}


# ============================================================
# MODEL / INFERENCE
# ============================================================

MODEL_VERSION = "isl-baseline-1.0"

DEFAULT_LABELS = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

MAX_IMAGE_DIMENSION = 640  # landmarks were trained on <=640px sides

MAX_PREDICTIONS = 100


# ============================================================
# CORS
# ============================================================

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:5000",
    ).split(",")
    if origin.strip()
]

CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]

CORS_HEADERS = ["Content-Type", "Authorization"]


# ============================================================
# USER STORAGE
# ============================================================

USER_PUBLIC_FIELDS = (
    "id",
    "name",
    "email",
    "phone",
    "age",
    "university",
    "bio",
    "picture",
    "profileImage",
    "image",
    "emailVerified",
    "provider",
)


# ============================================================
# GROQ LLM CONFIGURATION
# ============================================================

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()

GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile").strip()

GROQ_TIMEOUT = float(os.getenv("GROQ_TIMEOUT", "10.0"))
