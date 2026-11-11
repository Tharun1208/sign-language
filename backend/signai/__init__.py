"""SignAI backend package.

The Flask application is assembled from blueprints, one module per
front-end page / concern:

    auth          -> /login, /register, /settings (profile)
    recognition   -> /live-recognition, /image-recognition, /dashboard
    video         -> /video-translation
    dictionary    -> /dictionary
    feedback      -> /feedback
    history       -> /dashboard, /analytics
"""

from .app_factory import create_app

__all__ = ["create_app"]