"""
Sign dictionary.

Serves /dictionary -> /api/v1/dictionary

Entries are generated from the model's label set so the dictionary and
the recogniser can never drift apart. Descriptions stay generic until
an ISL expert reviews the vocabulary (hence `verified: false`).
"""

import os
from flask import Blueprint, jsonify, request, send_from_directory

from .. import config, state

dictionary_bp = Blueprint("dictionary", __name__, url_prefix="/api/v1/dictionary")


def _build_entries():
    labels = sorted({str(label).upper() for label in state.LABELS})

    return [
        {
            "id": label,
            "label": label,
            "category": "Alphabet",
            "image_url": f"/dataset/letters/{label}.jpg",
            "description": f"Finger-spelled letter {label}.",
            "tip": (
                f"Hold the sign for {label} steady in front of the camera "
                "until live detection locks it into the transcript."
            ),
            "verified": False,
            "language": "ISL",
        }
        for label in labels
    ]


@dictionary_bp.route("/image/<letter>", methods=["GET"])
def get_letter_image(letter):
    letter_upper = str(letter).strip().upper()
    filename = f"{letter_upper}.jpg"
    letters_dir = os.path.join(config.BASE_DIR, "dataset", "Letters")
    if os.path.exists(os.path.join(letters_dir, filename)):
        return send_from_directory(letters_dir, filename)
    return jsonify({"success": False, "message": "Image not found"}), 404


@dictionary_bp.route("", methods=["GET"])
@dictionary_bp.route("/", methods=["GET"])
def list_entries():

    query = (request.args.get("search") or "").strip().lower()
    category = (request.args.get("category") or "").strip().lower()

    entries = _build_entries()

    if query:
        entries = [
            entry
            for entry in entries
            if query in entry["label"].lower()
            or query in entry["description"].lower()
        ]

    if category and category != "all":
        entries = [
            entry for entry in entries if entry["category"].lower() == category
        ]

    return jsonify({
        "success": True,
        "count": len(entries),
        "entries": entries,
        "categories": ["All", "Alphabet"],
        "language": "ISL",
        "verified": False,
    })