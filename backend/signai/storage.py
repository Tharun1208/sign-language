"""
MongoDB & JSON storage persistence engine for SignAI.

Primary backend is MongoDB (users and feedback collections).
If MongoDB is unavailable or fails to connect, automatically falls
back to local JSON files (users.json and feedback.json) so the
server never crashes.

On startup, automatically migrates existing JSON records into MongoDB.
"""

import json
import logging
import os
import re
from typing import Any, Dict, List, Optional

from . import config, state

logger = logging.getLogger("signai.storage")

_MONGO_CLIENT = None
_MONGO_DB = None
_MONGO_CONNECTED = False


def _atomic_write_json(path: str, payload: Any) -> None:
    """Atomic write helper for fallback JSON files."""
    directory = os.path.dirname(path)
    if directory:
        os.makedirs(directory, exist_ok=True)

    temporary_file = path + ".tmp"
    with open(temporary_file, "w", encoding="utf-8") as file:
        json.dump(payload, file, indent=2, ensure_ascii=False)
    os.replace(temporary_file, path)


def init_mongo() -> bool:
    """Initialize MongoDB connection and test connectivity."""
    global _MONGO_CLIENT, _MONGO_DB, _MONGO_CONNECTED

    if not config.MONGO_URI:
        _MONGO_CONNECTED = False
        return False

    try:
        from pymongo import MongoClient

        client = MongoClient(
            config.MONGO_URI,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
        )
        # Verify connection with a ping
        client.admin.command("ping")

        _MONGO_CLIENT = client
        _MONGO_DB = client[config.MONGO_DB_NAME]
        _MONGO_CONNECTED = True

        # Ensure indexes
        _MONGO_DB.users.create_index("email", unique=True, sparse=True)
        _MONGO_DB.users.create_index("id", unique=True, sparse=True)
        _MONGO_DB.feedback.create_index("id", unique=True, sparse=True)

        logger.info(f"Connected to MongoDB at {config.MONGO_URI}/{config.MONGO_DB_NAME}")
        return True

    except Exception as exc:
        logger.warning(f"MongoDB connection notice: {exc}. Using JSON file fallback.")
        _MONGO_CONNECTED = False
        return False


def is_mongo_active() -> bool:
    """Return whether MongoDB is currently active and reachable."""
    global _MONGO_CONNECTED
    return _MONGO_CONNECTED


def _clean_doc(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Clean MongoDB document by stripping internal `_id`."""
    if not doc:
        return None
    cleaned = dict(doc)
    cleaned.pop("_id", None)
    return cleaned


# ============================================================
# USERS STORAGE
# ============================================================

def ensure_users_file() -> None:
    """Ensure MongoDB connection or fallback file exists."""
    global _MONGO_CONNECTED

    if _MONGO_CLIENT is None:
        init_mongo()

    # Always ensure local json file exists as backup
    try:
        if not os.path.exists(config.USERS_FILE):
            _atomic_write_json(config.USERS_FILE, [])
    except Exception as err:
        logger.warning(f"Could not initialize users.json backup: {err}")

    # Auto-migrate from JSON into MongoDB if MongoDB is empty
    if _MONGO_CONNECTED and _MONGO_DB is not None:
        try:
            mongo_count = _MONGO_DB.users.count_documents({})
            if mongo_count == 0 and os.path.exists(config.USERS_FILE):
                with open(config.USERS_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                if isinstance(data, list) and data:
                    for u in data:
                        _MONGO_DB.users.update_one({"id": u["id"]}, {"$set": u}, upsert=True)
                    logger.info(f"Migrated {len(data)} user(s) from users.json into MongoDB")
        except Exception as mig_err:
            logger.warning(f"User migration notice: {mig_err}")


def load_users() -> List[Dict[str, Any]]:
    """Load all users from MongoDB or fallback JSON."""
    ensure_users_file()

    if _MONGO_CONNECTED and _MONGO_DB is not None:
        try:
            cursor = _MONGO_DB.users.find({}, {"_id": 0})
            return list(cursor)
        except Exception as exc:
            logger.error(f"MongoDB load_users error: {exc}. Reading JSON backup.")

    # Fallback to JSON
    try:
        with open(config.USERS_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
        return data if isinstance(data, list) else []
    except Exception as err:
        logger.error(f"Error loading users from JSON: {err}")
        return []


def save_users(users: List[Dict[str, Any]]) -> bool:
    """Save user list to MongoDB and mirror to JSON file."""
    with state.USERS_LOCK:
        success = True

        if _MONGO_CONNECTED and _MONGO_DB is not None:
            try:
                for u in users:
                    user_copy = dict(u)
                    user_copy.pop("_id", None)
                    _MONGO_DB.users.update_one(
                        {"id": user_copy["id"]},
                        {"$set": user_copy},
                        upsert=True,
                    )
            except Exception as exc:
                logger.error(f"MongoDB save_users error: {exc}")
                success = False

        # Keep JSON backup updated
        try:
            _atomic_write_json(config.USERS_FILE, users)
        except Exception as err:
            logger.error(f"Error writing backup users.json: {err}")

        return success


def save_single_user(user: Dict[str, Any]) -> bool:
    """Directly insert or update a single user in MongoDB."""
    with state.USERS_LOCK:
        user_copy = dict(user)
        user_copy.pop("_id", None)

        if _MONGO_CONNECTED and _MONGO_DB is not None:
            try:
                _MONGO_DB.users.update_one(
                    {"id": user_copy["id"]},
                    {"$set": user_copy},
                    upsert=True,
                )
            except Exception as exc:
                logger.error(f"MongoDB save_single_user error: {exc}")

        # Mirror in JSON
        try:
            all_users = load_users()
            idx = next((i for i, u in enumerate(all_users) if str(u.get("id")) == str(user_copy.get("id"))), -1)
            if idx >= 0:
                all_users[idx] = user_copy
            else:
                all_users.append(user_copy)
            _atomic_write_json(config.USERS_FILE, all_users)
            return True
        except Exception as err:
            logger.error(f"Error updating backup JSON: {err}")
            return False


def find_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Look up a user by email in MongoDB with case-insensitivity."""
    if not email:
        return None

    target = str(email).strip().lower()

    if _MONGO_CONNECTED and _MONGO_DB is not None:
        try:
            regex_query = {"$regex": f"^{re.escape(target)}$", "$options": "i"}
            user = _MONGO_DB.users.find_one({"email": regex_query}, {"_id": 0})
            if user:
                return user
        except Exception as exc:
            logger.error(f"MongoDB find_user_by_email error: {exc}")

    # Fallback lookup
    for user in load_users():
        if str(user.get("email", "")).strip().lower() == target:
            return user

    return None


def find_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    """Look up a user by unique ID in MongoDB."""
    if not user_id:
        return None

    target_id = str(user_id)

    if _MONGO_CONNECTED and _MONGO_DB is not None:
        try:
            user = _MONGO_DB.users.find_one({"id": target_id}, {"_id": 0})
            if user:
                return user
        except Exception as exc:
            logger.error(f"MongoDB find_user_by_id error: {exc}")

    # Fallback lookup
    for user in load_users():
        if str(user.get("id", "")) == target_id:
            return user

    return None


# ============================================================
# FEEDBACK STORAGE
# ============================================================

def ensure_feedback_file() -> None:
    """Ensure feedback collection and backup file exist."""
    global _MONGO_CONNECTED

    if _MONGO_CLIENT is None:
        init_mongo()

    try:
        if not os.path.exists(config.FEEDBACK_FILE):
            _atomic_write_json(config.FEEDBACK_FILE, [])
    except Exception as err:
        logger.warning(f"Could not initialize feedback.json: {err}")

    # Auto-migrate feedback into MongoDB if collection is empty
    if _MONGO_CONNECTED and _MONGO_DB is not None:
        try:
            fb_count = _MONGO_DB.feedback.count_documents({})
            if fb_count == 0 and os.path.exists(config.FEEDBACK_FILE):
                with open(config.FEEDBACK_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                if isinstance(data, list) and data:
                    for item in data:
                        _MONGO_DB.feedback.update_one({"id": item["id"]}, {"$set": item}, upsert=True)
                    logger.info(f"Migrated {len(data)} feedback record(s) into MongoDB")
        except Exception as mig_err:
            logger.warning(f"Feedback migration notice: {mig_err}")


def load_feedback() -> List[Dict[str, Any]]:
    """Load feedback records from MongoDB or fallback JSON."""
    ensure_feedback_file()

    with state.FEEDBACK_LOCK:
        if _MONGO_CONNECTED and _MONGO_DB is not None:
            try:
                cursor = _MONGO_DB.feedback.find({}, {"_id": 0})
                return list(cursor)
            except Exception as exc:
                logger.error(f"MongoDB load_feedback error: {exc}")

        try:
            with open(config.FEEDBACK_FILE, "r", encoding="utf-8") as file:
                data = json.load(file)
            return data if isinstance(data, list) else []
        except Exception as err:
            logger.error(f"Error loading feedback: {err}")
            return []


def save_feedback(items: List[Dict[str, Any]]) -> bool:
    """Save feedback items to MongoDB and backup JSON."""
    ensure_feedback_file()

    with state.FEEDBACK_LOCK:
        success = True

        if _MONGO_CONNECTED and _MONGO_DB is not None:
            try:
                for item in items:
                    item_copy = dict(item)
                    item_copy.pop("_id", None)
                    _MONGO_DB.feedback.update_one(
                        {"id": item_copy["id"]},
                        {"$set": item_copy},
                        upsert=True,
                    )
            except Exception as exc:
                logger.error(f"MongoDB save_feedback error: {exc}")
                success = False

        try:
            _atomic_write_json(config.FEEDBACK_FILE, items)
        except Exception as err:
            logger.error(f"Error saving feedback to JSON: {err}")

        return success
