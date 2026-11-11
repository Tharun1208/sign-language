"""
SignAI backend entry point.

This file used to hold the entire service (4,400+ lines). It now does
only two things: build the app from the `signai` package and serve it.

Layout
------
signai/
    config.py             paths, limits, environment
    state.py              shared runtime state + MediaPipe handle
    storage.py            users.json / feedback.json persistence
    security.py           bearer token issuing and lookup
    utils.py              numeric formatting, per-class metrics, safe user
    services/inference.py model loading + the single predict pipeline
    blueprints/
        auth.py           /api/auth/*          -> login, register, settings
        recognition.py    /api/predict, /api/health -> live, image, dashboard
        video.py          /api/v1/videos/*    -> video-translation
        dictionary.py     /api/v1/dictionary   -> sign dictionary
        feedback.py       /api/v1/feedback     -> feedback page + modal
        sessions.py       sessions, history, speech contracts

Endpoints are grouped one module per front-end page, so a change to the
live-recognition UI only ever touches recognition.py.
"""

import os

from signai import create_app

app = create_app()


if __name__ == "__main__":

    port = int(os.getenv("PORT", "5000"))

    print()
    print("=" * 70)
    print("SIGN AI BACKEND")
    print("=" * 70)
    print(f"Server:  http://localhost:{port}")
    print(f"Health:  http://localhost:{port}/api/health")
    print(f"Docs:    http://localhost:{port}/")
    print("=" * 70)
    print()

    app.run(host="0.0.0.0", port=port, debug=False)