"""Application factory: wires config, CORS, blueprints and the model."""

from flask import Flask, jsonify
from flask_cors import CORS

from . import config, state
from .blueprints import ALL_BLUEPRINTS
from .services import inference
from .storage import ensure_feedback_file, ensure_users_file, load_users


def create_app(load_model=True):

    app = Flask(__name__)

    app.config["MAX_CONTENT_LENGTH"] = config.MAX_CONTENT_LENGTH
    app.config["JSON_SORT_KEYS"] = False

    CORS(
        app,
        resources={r"/api/*": {"origins": config.CORS_ORIGINS}},
        methods=config.CORS_METHODS,
        allow_headers=config.CORS_HEADERS,
    )

    for blueprint in ALL_BLUEPRINTS:
        app.register_blueprint(blueprint)

    _register_root(app)

    ensure_users_file()
    ensure_feedback_file()

    from .storage import is_mongo_active

    print()
    print("=" * 70)
    print("STORAGE ENGINE")
    print("=" * 70)
    print(f"Engine:   {'MongoDB (' + config.MONGO_DB_NAME + ')' if is_mongo_active() else 'JSON File Fallback'}")
    print(f"URI:      {config.MONGO_URI if is_mongo_active() else config.USERS_FILE}")
    print(f"Users:    {len(load_users())}")
    print(f"Feedback: {config.FEEDBACK_FILE}")
    print("=" * 70)
    print()

    if load_model:
        inference.load_model()

    return app


def _register_root(app):

    @app.route("/", methods=["GET"])
    def root():
        from .storage import is_mongo_active
        return jsonify({
            "service": "SignAI Backend",
            "status": "running",
            "model_loaded": state.MODEL_LOADED,
            "google_auth_configured": bool(config.GOOGLE_CLIENT_ID),
            "email_auth_configured": True,
            "storage": "MongoDB" if is_mongo_active() else "users.json",
            "database": is_mongo_active(),
            "database_type": "MongoDB" if is_mongo_active() else "JSON file",
            "endpoints": {
                "health": "/api/health",
                "model_info": "/api/model-info",
                "register": "/api/auth/register",
                "login": "/api/auth/login",
                "google_login": "/api/auth/google",
                "current_user": "/api/auth/me",
                "logout": "/api/auth/logout",
                "profile": "/api/auth/profile",
                "predict": "/api/predict",
                "predict_frame": "/api/predict/frame",
                "predictions": "/api/predictions",
                "dictionary": "/api/v1/dictionary",
                "feedback": "/api/v1/feedback",
                "history": "/api/v1/history",
                "video_upload": "/api/v1/videos/upload",
                "recognition_session": "/api/v1/recognition/session",
                "groq_refine": "/api/groq/refine",
                "groq_status": "/api/groq/status",
            },
        })

    @app.errorhandler(413)
    def too_large(_error):
        return jsonify({
            "success": False,
            "message": "Upload exceeds the server limit (150 MB).",
        }), 413

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"success": False, "message": "Endpoint not found."}), 404

    @app.errorhandler(405)
    def method_not_allowed(_error):
        return jsonify({"success": False, "message": "Method not allowed."}), 405

    @app.errorhandler(500)
    def server_error(_error):
        return jsonify({"success": False, "message": "Internal server error."}), 500