"""Bearer token issuing / lookup."""

import secrets
import time

from . import config, state


def create_auth_token(user):
    token = secrets.token_urlsafe(48)

    with state.AUTH_LOCK:
        state.AUTH_TOKENS[token] = {
            "user": user,
            "created_at": time.time(),
        }

    return token


def token_from_request(request):
    """Pull a bare token out of an `Authorization: Bearer ...` header."""

    authorization = request.headers.get("Authorization", "")

    if not authorization.startswith("Bearer "):
        return ""

    return authorization.replace("Bearer ", "", 1).strip()


def current_auth(request):
    """Return the auth record for the request, or None."""

    token = token_from_request(request)

    if not token:
        return None

    with state.AUTH_LOCK:
        record = state.AUTH_TOKENS.get(token)

        if record and time.time() - record["created_at"] >= config.AUTH_TOKEN_TTL_SECONDS:
            state.AUTH_TOKENS.pop(token, None)
            return None

        return record


def revoke_token(request):
    token = token_from_request(request)

    if token:
        with state.AUTH_LOCK:
            state.AUTH_TOKENS.pop(token, None)


def refresh_token_user(token, user):
    """Keep the in-memory copy of the signed-in user current."""

    with state.AUTH_LOCK:
        if token and token in state.AUTH_TOKENS:
            state.AUTH_TOKENS[token]["user"] = user


def revoke_user_tokens(user_id):
    """Revoke every in-memory session belonging to a user."""
    with state.AUTH_LOCK:
        tokens = [
            token
            for token, record in state.AUTH_TOKENS.items()
            if str(record.get("user", {}).get("id", "")) == str(user_id)
        ]
        for token in tokens:
            state.AUTH_TOKENS.pop(token, None)


def is_feedback_moderator(record):
    """Authorize moderators from trusted account roles or server config."""
    if not record:
        return False

    user = record.get("user") or {}
    email = str(user.get("email", "")).strip().lower()
    role = str(user.get("role", "")).strip().lower()

    return (
        role in {"moderator", "admin"}
        or email in config.FEEDBACK_MODERATOR_EMAILS
    )