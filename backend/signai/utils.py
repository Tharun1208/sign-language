"""Small numeric / formatting helpers shared across blueprints."""

from . import state


def safe_number(value, default=None):
    if value is None:
        return default

    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def format_accuracy(value):
    """Normalise an accuracy that may arrive as 0-1 or 0-100."""

    value = safe_number(value)

    if value is None:
        return None

    if 0 <= value <= 1:
        value *= 100

    return round(min(100, max(0, value)), 2)


def get_sign_metrics(label):
    """Per-class recall (as a percent) and support for one label."""

    result = {"sign_accuracy_percent": None, "support": None}

    if not label or not isinstance(state.PER_CLASS_METRICS, dict):
        return result

    metrics = (
        state.PER_CLASS_METRICS.get(label)
        or state.PER_CLASS_METRICS.get(label.lower())
        or state.PER_CLASS_METRICS.get(label.upper())
    )

    if not isinstance(metrics, dict):
        return result

    recall = safe_number(metrics.get("recall"))

    if recall is not None:
        if 0 <= recall <= 1:
            recall *= 100
        result["sign_accuracy_percent"] = round(min(100, max(0, recall)), 2)

    support = metrics.get("support")

    if support is not None:
        try:
            result["support"] = int(support)
        except (TypeError, ValueError):
            result["support"] = support

    return result


def public_user(user):
    """Strip password hashes and other private keys before responding."""

    if not isinstance(user, dict):
        return {}

    return {
        "id": str(user.get("id", "")),
        "name": user.get("name") or user.get("fullName") or "",
        "fullName": user.get("fullName") or user.get("name") or "",
        "email": user.get("email", ""),
        "phone": user.get("phone", ""),
        "age": user.get("age", ""),
        "university": user.get("university", ""),
        "bio": user.get("bio", ""),
        "picture": user.get("picture") or user.get("profileImage") or "",
        "profileImage": user.get("profileImage") or user.get("picture") or "",
        "image": user.get("image", ""),
        "emailVerified": bool(user.get("emailVerified", True)),
        "provider": user.get("provider", "email"),
    }