"""Blueprint exports."""

from .auth import auth_bp
from .dictionary import dictionary_bp
from .feedback import feedback_bp
from .groq_bp import groq_bp
from .recognition import recognition_bp
from .sessions import history_bp, sessions_bp, speech_bp
from .video import video_bp

ALL_BLUEPRINTS = (
    auth_bp,
    recognition_bp,
    groq_bp,
    video_bp,
    dictionary_bp,
    feedback_bp,
    sessions_bp,
    history_bp,
    speech_bp,
)

__all__ = ["ALL_BLUEPRINTS"]