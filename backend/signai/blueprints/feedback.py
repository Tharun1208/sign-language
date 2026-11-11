"""
Feedback / correction queue.

Serves /feedback -> /api/v1/feedback (+ review action)

The front end posts unauthenticated corrections (the FeedbackModal is
reachable from the live camera), so submissions are open but every
item records which token, if any, produced it.
"""

import time
import uuid

from flask import Blueprint, jsonify, request

from .. import config, security, storage

feedback_bp = Blueprint("feedback", __name__, url_prefix="/api/v1/feedback")


@feedback_bp.route("", methods=["POST"])
@feedback_bp.route("/", methods=["POST"])
def submit():

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "A JSON request body is required.",
        }), 400

    correction = str(data.get("correction", "")).strip().upper()
    prediction = str(data.get("prediction", "")).strip().upper()

    if not correction and not prediction:
        return jsonify({
            "success": False,
            "message": "Provide the prediction or a correction.",
        }), 400

    if data.get("consent") is not True:
        return jsonify({
            "success": False,
            "message": (
                "Consent is required before feedback can be reviewed "
                "for model development."
            ),
        }), 400

    record = security.current_auth(request)

    item = {
        "id": uuid.uuid4().hex,
        "prediction": prediction,
        "correction": correction,
        "confidence_percent": data.get("confidence_percent"),
        "source": data.get("source", "unknown"),
        "notes": str(data.get("notes", "")).strip(),
        "language": data.get("language", "ISL"),
        "model_version": data.get("model_version", config.MODEL_VERSION),
        "consent": True,
        "review_status": "pending",
        "user_id": record["user"].get("id") if record else None,
        "created_at": time.time(),
    }

    if not storage.add_feedback(item):
        return jsonify({"success": False, "message": "Unable to store feedback."}), 500

    return jsonify({
        "success": True,
        "message": "Feedback submitted for review.",
        "feedback": item,
    }), 201


@feedback_bp.route("", methods=["GET"])
@feedback_bp.route("/", methods=["GET"])
def list_items():

    if not security.current_auth(request):
        return jsonify({
            "success": False,
            "message": "Authentication is required.",
        }), 401

    items = storage.load_feedback()

    status = (request.args.get("status") or "").strip().lower()

    if status:
        items = [
            item
            for item in items
            if str(item.get("review_status", "")).lower() == status
        ]

    items.sort(key=lambda item: item.get("created_at", 0), reverse=True)

    return jsonify({
        "success": True,
        "count": len(items),
        "feedback": items,
    })


@feedback_bp.route("/<feedback_id>/review", methods=["POST"])
def review(feedback_id):

    record = security.current_auth(request)
    if not security.is_feedback_moderator(record):
        return jsonify({
            "success": False,
            "message": "Moderator authorization is required.",
        }), 403

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "A JSON request body is required.",
        }), 400
    status = data.get("status", "reviewed")
    if not isinstance(status, str) or status not in {"pending", "reviewed", "rejected"}:
        return jsonify({
            "success": False,
            "message": "Status must be pending, reviewed or rejected.",
        }), 400

    updated = storage.update_feedback_status(
        feedback_id,
        status,
        time.time(),
    )
    if updated is None:
        return jsonify({"success": False, "message": "Feedback not found."}), 404

    return jsonify({"success": True, "feedback": updated})