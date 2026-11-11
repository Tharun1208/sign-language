"""Bearer token issuing / lookup."""

import secrets
import time

from . import state


def create_auth_token(user):
    token = secrets.token_urlsafe(48)

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

    return state.AUTH_TOKENS.get(token)


def revoke_token(request):
    token = token_from_request(request)

    if token:
        state.AUTH_TOKENS.pop(token, None)


def refresh_token_user(token, user):
    """Keep the in-memory copy of the signed-in user current."""

    if token and token in state.AUTH_TOKENS:
        state.AUTH_TOKENS[token]["user"] = user