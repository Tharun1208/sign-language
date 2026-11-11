"""
Auth endpoints.

Serves:
    /login, /register        -> /api/auth/register, /login, /google
    /settings (profile)      -> /api/auth/me, /logout, /profile
"""

import secrets
import time

from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from .. import config, security, state, storage
from ..utils import public_user

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def _validate_email(email):
    return "@" in email and "." in email


# ============================================================
# REGISTER
# ============================================================

@auth_bp.route("/register", methods=["POST"])
def register():

    try:
        data = request.get_json(silent=True)

        if not data:
            return jsonify({"success": False, "message": "Request body is missing."}), 400

        full_name = str(data.get("fullName", "")).strip()
        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", ""))
        confirm_password = str(data.get("confirmPassword", ""))

        if not full_name:
            return jsonify({"success": False, "message": "Please enter your full name."}), 400

        if not email:
            return jsonify({"success": False, "message": "Please enter your email address."}), 400

        if not _validate_email(email):
            return jsonify({"success": False, "message": "Please enter a valid email address."}), 400

        if len(password) < 6:
            return jsonify({"success": False, "message": "Password must contain at least 6 characters."}), 400

        if password != confirm_password:
            return jsonify({"success": False, "message": "Passwords do not match."}), 400

        if storage.find_user_by_email(email):
            return jsonify({"success": False, "message": "An account with this email already exists."}), 409

        user = {
            "id": secrets.token_hex(16),
            "fullName": full_name,
            "name": full_name,
            "email": email,
            "passwordHash": generate_password_hash(password),
            "phone": "",
            "age": "",
            "university": "",
            "bio": "",
            "picture": "",
            "profileImage": "",
            "image": "",
            "emailVerified": True,
            "provider": "email",
            "createdAt": time.time(),
        }

        users = storage.load_users()
        users.append(user)

        if not storage.save_users(users):
            return jsonify({"success": False, "message": "Unable to save your account."}), 500

        safe_user = public_user(user)

        # The front end persists a token straight after register, so issue one.
        token = security.create_auth_token(safe_user)

        print()
        print("=" * 70)
        print("NEW USER REGISTERED")
        print("=" * 70)
        print(f"User ID:  {user['id']}")
        print(f"Email:    {user['email']}")
        print("=" * 70)
        print()

        return jsonify({
            "success": True,
            "message": "Account created successfully.",
            "token": token,
            "user": safe_user,
        }), 201

    except Exception as error:
        print("Registration Error:", error)
        return jsonify({
            "success": False,
            "message": "Registration failed.",
            "error": str(error),
        }), 500


# ============================================================
# EMAIL / PASSWORD LOGIN
# ============================================================

@auth_bp.route("/login", methods=["POST"])
def email_login():

    try:
        data = request.get_json(silent=True)

        if not data:
            return jsonify({"success": False, "message": "Request body is missing."}), 400

        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", ""))

        if not email:
            return jsonify({"success": False, "message": "Please enter your email."}), 400

        if not password:
            return jsonify({"success": False, "message": "Please enter your password."}), 400

        user = storage.find_user_by_email(email)

        if user is None:
            return jsonify({"success": False, "message": "Invalid email or password."}), 401

        if not user.get("passwordHash"):
            return jsonify({
                "success": False,
                "message": "This account uses Google Sign-In. Please continue with Google.",
            }), 400

        if not check_password_hash(user["passwordHash"], password):
            return jsonify({"success": False, "message": "Invalid email or password."}), 401

        safe_user = public_user(user)
        token = security.create_auth_token(safe_user)

        print()
        print("=" * 70)
        print("EMAIL LOGIN")
        print("=" * 70)
        print(f"Email: {safe_user['email']}")
        print("=" * 70)
        print()

        return jsonify({
            "success": True,
            "message": "Login successful.",
            "token": token,
            "user": safe_user,
        }), 200

    except Exception as error:
        print("Email Login Error:", error)
        return jsonify({
            "success": False,
            "message": "Login failed.",
            "error": str(error),
        }), 500


# ============================================================
# GOOGLE LOGIN
# ============================================================

@auth_bp.route("/google", methods=["POST"])
def google_login():

    try:
        if not config.GOOGLE_CLIENT_ID:
            return jsonify({
                "success": False,
                "message": "Google authentication is not configured on the server.",
            }), 500

        data = request.get_json(silent=True)

        if not data:
            return jsonify({"success": False, "message": "Request body is missing."}), 400

        credential = data.get("credential")

        if not credential:
            return jsonify({"success": False, "message": "Google credential is required."}), 400

        from google.auth.transport import requests as google_requests
        from google.oauth2 import id_token

        try:
            google_user = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                config.GOOGLE_CLIENT_ID,
            )
        except ValueError as error:
            print("Google token verification failed:", error)
            return jsonify({
                "success": False,
                "message": "Invalid or expired Google credential.",
            }), 401

        issuer = google_user.get("iss")

        if issuer not in ("accounts.google.com", "https://accounts.google.com"):
            return jsonify({"success": False, "message": "Invalid Google token issuer."}), 401

        google_id = google_user.get("sub")
        email = (google_user.get("email") or "").strip().lower()
        name = google_user.get("name")
        picture = google_user.get("picture")
        email_verified = google_user.get("email_verified", False)
        given_name = google_user.get("given_name")
        family_name = google_user.get("family_name")

        if not google_id:
            return jsonify({"success": False, "message": "Google account ID is missing."}), 400

        if not email:
            return jsonify({"success": False, "message": "Google account email is missing."}), 400

        if not email_verified:
            return jsonify({"success": False, "message": "Your Google email address is not verified."}), 403

        if not name:
            name = (
                email.split("@")[0]
                .replace(".", " ")
                .replace("_", " ")
                .replace("-", " ")
                .title()
            )

        existing = storage.find_user_by_email(email)

        if existing:
            user = existing
            user.update({
                "name": name,
                "fullName": name,
                "googleId": google_id,
                "picture": picture or "",
                "profileImage": picture or "",
                "image": picture or "",
                "givenName": given_name or "",
                "familyName": family_name or "",
                "emailVerified": True,
                "provider": "google",
            })

            users = storage.load_users()

            for index, item in enumerate(users):
                if str(item.get("id")) == str(user.get("id")):
                    users[index] = user
                    break

            storage.save_users(users)

        else:
            user = {
                "id": google_id,
                "googleId": google_id,
                "name": name,
                "fullName": name,
                "email": email,
                "phone": "",
                "age": "",
                "university": "",
                "bio": "",
                "picture": picture or "",
                "profileImage": picture or "",
                "image": picture or "",
                "givenName": given_name or "",
                "familyName": family_name or "",
                "emailVerified": True,
                "provider": "google",
                "createdAt": time.time(),
            }

            users = storage.load_users()
            users.append(user)

            if not storage.save_users(users):
                return jsonify({"success": False, "message": "Unable to save Google account."}), 500

        safe_user = public_user(user)
        token = security.create_auth_token(safe_user)

        print()
        print("=" * 70)
        print("GOOGLE LOGIN")
        print("=" * 70)
        print(f"Email:     {email}")
        print(f"Google ID: {google_id}")
        print("=" * 70)
        print()

        return jsonify({
            "success": True,
            "message": "Google login successful.",
            "token": token,
            "user": safe_user,
        }), 200

    except Exception as error:
        print("Google Login Error:", error)
        return jsonify({
            "success": False,
            "message": "Google login failed.",
            "error": str(error),
        }), 500


# ============================================================
# CURRENT USER
# ============================================================

@auth_bp.route("/me", methods=["GET"])
def get_current_user():

    record = security.current_auth(request)

    if not record:
        return jsonify({
            "success": False,
            "message": "Invalid or expired session.",
        }), 401

    return jsonify({"success": True, "user": record["user"]}), 200


# ============================================================
# LOGOUT
# ============================================================

@auth_bp.route("/logout", methods=["POST"])
def logout():
    security.revoke_token(request)

    return jsonify({"success": True, "message": "Logged out successfully."}), 200


# ============================================================
# UPDATE PROFILE
# ============================================================

@auth_bp.route("/profile", methods=["PUT"])
def update_profile():
    """
    Update the signed-in user's profile.

    Only the bearer token identifies the target account. Body fields are
    treated as data, never as identity, so an `id` in the payload cannot
    be used to edit somebody else's record.
    """

    try:
        record = security.current_auth(request)

        if not record:
            return jsonify({
                "success": False,
                "message": "Invalid or expired session.",
            }), 401

        token = security.token_from_request(request)
        data = request.get_json(silent=True) or {}

        user_id = str(record["user"].get("id", ""))
        users = storage.load_users()

        target = None

        for entry in users:
            if str(entry.get("id", "")) == user_id:
                target = entry
                break

        if target is None:
            return jsonify({"success": False, "message": "User not found."}), 404

        if "name" in data:
            value = str(data["name"]).strip()
            target["name"] = value
            target["fullName"] = value
        elif "fullName" in data:
            value = str(data["fullName"]).strip()
            target["name"] = value
            target["fullName"] = value

        for field in ("phone", "age", "university", "bio"):
            if field in data:
                target[field] = str(data[field]).strip()

        if "profileImage" in data:
            target["profileImage"] = data["profileImage"]
            target["picture"] = data["profileImage"]
        elif "picture" in data:
            target["profileImage"] = data["picture"]
            target["picture"] = data["picture"]

        # Email changes are deliberately not accepted here: the login
        # record is keyed by email and changing it silently would let a
        # token take over another address.

        if not storage.save_users(users):
            return jsonify({"success": False, "message": "Unable to save profile."}), 500

        safe_user = public_user(target)
        security.refresh_token_user(token, safe_user)

        return jsonify({
            "success": True,
            "message": "Profile updated successfully.",
            "user": safe_user,
        }), 200

    except Exception as error:
        print("Update profile error:", error)
        return jsonify({
            "success": False,
            "message": "Failed to update profile.",
            "error": str(error),
        }), 500