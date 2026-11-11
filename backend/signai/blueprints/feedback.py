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

    data = request.get_json(silent=True) or request.form.to_dict()

    correction = str(data.get("correction", "")).strip().upper()
    prediction = str(data.get("prediction", "")).strip().upper()

    if not correction and not prediction:
        return jsonify({
            "success": False,
            "message": "Provide the prediction or a correction.",
        }), 400

    if not bool(data.get("consent")):
        return jsonify({
            "success": False,
            "message": (
                "Consent is required before feedback can be reviewed "
                "for model development."
            ),
        }), 400

    record = security.current_auth(request)

    items = storage.load_feedback()

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

    items.insert(0, item)

    if not storage.save_feedback(items):
        return jsonify({"success": False, "message": "Unable to store feedback."}), 500

    return jsonify({
        "success": True,
        "message": "Feedback submitted for review.",
        "feedback": item,
    }), 201


@feedback_bp.route("", methods=["GET"])
@feedback_bp.route("/", methods=["GET"])
def list_items():

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

    data = request.get_json(silent=True) or {}

    items = storage.load_feedback()
    updated = None

    for item in items:
        if item.get("id") == feedback_id:
            item["review_status"] = data.get("status", "reviewed")
            item["reviewed_at"] = time.time()
            updated = item
            break

    if updated is None:
        return jsonify({"success": False, "message": "Feedback not found."}), 404

    if not storage.save_feedback(items):
        return jsonify({"success": False, "message": "Unable to update feedback."}), 500

    return jsonify({"success": True, "feedback": updated})