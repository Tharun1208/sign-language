"""
Groq LLM Blueprint.

Endpoints:
    POST /api/groq/refine          -> refine recognized signs/words into a sentence
    POST /api/refine-sentence      -> alias for /api/groq/refine
    GET  /api/groq/status          -> check Groq availability and active model
"""

from flask import Blueprint, jsonify, request

from ..services import groq_service

groq_bp = Blueprint("groq", __name__, url_prefix="/api")


@groq_bp.route("/groq/refine", methods=["POST"])
@groq_bp.route("/refine-sentence", methods=["POST"])
def refine():
    """
    Refine a sequence of recognized words or characters into a grammatically
    correct, natural sentence using Groq AI.

    Accepts JSON payload:
    {
        "text": "I NEED WATER",         # raw text or sentence
        "words": ["I", "NEED", "WATER"], # optional array of words/signs
        "model": "llama-3.3-70b-versatile" # optional override
    }
    """
    data = request.get_json(silent=True) or {}

    words = data.get("words")
    raw_text = data.get("text", "")
    model_override = data.get("model")

    # Use words array if provided, otherwise raw text
    input_payload = words if (words and isinstance(words, list)) else raw_text

    result = groq_service.refine_sentence(
        input_payload,
        model=model_override,
    )

    return jsonify(result), 200


@groq_bp.route("/groq/status", methods=["GET"])
def status():
    """Return Groq service status and configuration."""
    status_data = groq_service.get_groq_status()
    return jsonify({
        "success": True,
        **status_data,
    }), 200
