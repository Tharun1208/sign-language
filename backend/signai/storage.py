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
import tempfile
import time
from contextlib import contextmanager
from typing import Any, Dict, List, Optional

from . import config, state

logger = logging.getLogger("signai.storage")

_MONGO_CLIENT = None
_MONGO_DB = None
_MONGO_CONNECTED = False
_LAST_MONGO_ATTEMPT = 0.0
_MONGO_RETRY_INTERVAL = 30.0


def _atomic_write_json(path: str, payload: Any) -> None:
    """Atomic write helper for fallback JSON files."""
    directory = os.path.dirname(path)
    if directory:
        os.makedirs(directory, exist_ok=True)

    temporary_file = None
    try:
        descriptor, temporary_file = tempfile.mkstemp(
            prefix=".signai-",
            suffix=".tmp",
            dir=directory or ".",
        )
        with os.fdopen(descriptor, "w", encoding="utf-8") as file:
            json.dump(payload, file, indent=2, ensure_ascii=False)
            file.flush()
            os.fsync(file.fileno())
        os.replace(temporary_file, path)
        if os.name != "nt":
            os.chmod(path, 0o600)
    finally:
        if temporary_file and os.path.exists(temporary_file):
            os.remove(temporary_file)


def _log_storage_error(level, message, error):
    """Log storage failures without exception text that may contain secrets."""
    logger.log(level, "%s (%s)", message, type(error).__name__)


@contextmanager
def _interprocess_file_lock(path):
    """Lock a JSON read-modify-write operation across threads and processes."""
    directory = os.path.dirname(path)
    if directory:
        os.makedirs(directory, exist_ok=True)

    with open(path + ".lock", "a+b") as lock_file:
        if os.name == "nt":
            import msvcrt

            lock_file.seek(0)
            if not lock_file.read(1):
                lock_file.write(b"0")
                lock_file.flush()
            lock_file.seek(0)
            msvcrt.locking(lock_file.fileno(), msvcrt.LK_LOCK, 1)
            try:
                yield
            finally:
                lock_file.seek(0)
                msvcrt.locking(lock_file.fileno(), msvcrt.LK_UNLCK, 1)
        else:
            import fcntl

            fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX)
            try:
                yield
            finally:
                fcntl.flock(lock_file.fileno(), fcntl.LOCK_UN)


def _users_file_lock():
    return _interprocess_file_lock(config.USERS_FILE)


def _read_users_file() -> List[Dict[str, Any]]:
    try:
        with open(config.USERS_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
        return data if isinstance(data, list) else []
    except FileNotFoundError:
        return []


def init_mongo() -> bool:
    """Initialize MongoDB connection and test connectivity."""
    global _MONGO_CLIENT, _MONGO_DB, _MONGO_CONNECTED, _LAST_MONGO_ATTEMPT

    if not config.MONGO_URI:
        _MONGO_CONNECTED = False
        return False

    now = time.monotonic()
    if now - _LAST_MONGO_ATTEMPT < _MONGO_RETRY_INTERVAL:
        return _MONGO_CONNECTED
    _LAST_MONGO_ATTEMPT = now

    try:
        if _MONGO_CLIENT is not None:
            _MONGO_CLIENT.close()
            _MONGO_CLIENT = None
            _MONGO_DB = None

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

        logger.info("Connected to MongoDB database %s", config.MONGO_DB_NAME)
        return True

    except Exception as exc:
        _log_storage_error(
            logging.WARNING,
            "MongoDB connection failed; using JSON file fallback",
            exc,
        )
        _MONGO_CONNECTED = False
        _MONGO_CLIENT = None
        _MONGO_DB = None
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

    if _MONGO_CLIENT is None or not _MONGO_CONNECTED:
        init_mongo()

    # Migrate the pre-runtime path only when the runtime store is absent.
    try:
        if not os.path.exists(config.USERS_FILE):
            source = config.LEGACY_USERS_FILE
            if source != config.USERS_FILE and os.path.exists(source):
                with open(source, "r", encoding="utf-8") as file:
                    data = json.load(file)
                if not isinstance(data, list):
                    raise ValueError("Legacy user store must contain a list")
                _atomic_write_json(config.USERS_FILE, data)
            else:
                _atomic_write_json(config.USERS_FILE, [])
    except Exception as err:
        _log_storage_error(
            logging.WARNING,
            "Could not initialize runtime user store",
            err,
        )

    # Auto-migrate from JSON into MongoDB if MongoDB is empty
    if _MONGO_CONNECTED and _MONGO_DB is not None:
        try:
            if os.path.exists(config.USERS_FILE):
                with open(config.USERS_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                if isinstance(data, list) and data:
                    for u in data:
                        if not isinstance(u, dict) or not u.get("id"):
                            raise ValueError("User record is missing its id")
                        _MONGO_DB.users.update_one(
                            {"id": u["id"]},
                            {"$setOnInsert": u},
                            upsert=True,
                        )
                    logger.info(f"Migrated {len(data)} user(s) from users.json into MongoDB")
        except Exception as mig_err:
            _log_storage_error(logging.WARNING, "User migration failed", mig_err)
            _set_mongo_disconnected()


def load_users() -> List[Dict[str, Any]]:
    """Load all users from MongoDB or fallback JSON."""
    ensure_users_file()

    if _MONGO_CONNECTED and _MONGO_DB is not None:
        try:
            cursor = _MONGO_DB.users.find({}, {"_id": 0})
            return list(cursor)
        except Exception as exc:
            _log_storage_error(
                logging.ERROR,
                "MongoDB user load failed; reading JSON fallback",
                exc,
            )
            _set_mongo_disconnected()

    # Fallback to JSON
    try:
        with open(config.USERS_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
        return data if isinstance(data, list) else []
    except Exception as err:
        _log_storage_error(logging.ERROR, "Loading users from JSON failed", err)
        return []


def save_users(users: List[Dict[str, Any]]) -> bool:
    """Save user list to MongoDB and mirror to JSON file."""
    with state.USERS_LOCK:
        mongo_success = False
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
                mongo_success = True
            except Exception as exc:
                _log_storage_error(logging.ERROR, "Saving users to MongoDB failed", exc)
                _set_mongo_disconnected()

        # Keep JSON backup updated
        try:
            with _users_file_lock():
                _atomic_write_json(config.USERS_FILE, users)
            file_success = True
        except Exception as err:
            _log_storage_error(logging.ERROR, "Writing users JSON fallback failed", err)
            file_success = False

        return mongo_success or file_success


def create_user(user: Dict[str, Any]) -> str:
    """Atomically create an account; return created, exists, or failed."""
    user_copy = dict(user)
    user_copy.pop("_id", None)

    with state.USERS_LOCK:
        if _MONGO_CONNECTED and _MONGO_DB is not None:
            try:
                _MONGO_DB.users.insert_one(user_copy)
            except Exception as exc:
                from pymongo.errors import DuplicateKeyError

                if isinstance(exc, DuplicateKeyError):
                    return "exists"
                _log_storage_error(
                    logging.ERROR,
                    "MongoDB account creation failed; using JSON fallback",
                    exc,
                )
                _set_mongo_disconnected()
            else:
                try:
                    users = list(_MONGO_DB.users.find({}, {"_id": 0}))
                    with _users_file_lock():
                        _atomic_write_json(config.USERS_FILE, users)
                except Exception as exc:
                    _log_storage_error(
                        logging.ERROR,
                        "MongoDB account was created, but the JSON mirror failed",
                        exc,
                    )
                return "created"

        try:
            with _users_file_lock():
                users = _read_users_file()
                email = str(user_copy.get("email", "")).strip().lower()
                user_id = str(user_copy.get("id", ""))
                if any(
                    str(existing.get("email", "")).strip().lower() == email
                    or str(existing.get("id", "")) == user_id
                    for existing in users
                ):
                    return "exists"
                users.append(user_copy)
                _atomic_write_json(config.USERS_FILE, users)
            return "created"
        except Exception as exc:
            _log_storage_error(logging.ERROR, "JSON account creation failed", exc)
            return "failed"


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
                _log_storage_error(
                    logging.ERROR,
                    "Saving one user to MongoDB failed",
                    exc,
                )
                _set_mongo_disconnected()

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
            _log_storage_error(logging.ERROR, "Updating users JSON fallback failed", err)
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
            _log_storage_error(logging.ERROR, "MongoDB email lookup failed", exc)
            _set_mongo_disconnected()

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
            _log_storage_error(logging.ERROR, "MongoDB user lookup failed", exc)
            _set_mongo_disconnected()

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

    if _MONGO_CLIENT is None or not _MONGO_CONNECTED:
        init_mongo()

    try:
        if not os.path.exists(config.FEEDBACK_FILE):
            source = config.LEGACY_FEEDBACK_FILE
            if source != config.FEEDBACK_FILE and os.path.exists(source):
                with open(source, "r", encoding="utf-8") as file:
                    data = json.load(file)
                if not isinstance(data, list):
                    raise ValueError("Legacy feedback store must contain a list")
                _atomic_write_json(config.FEEDBACK_FILE, data)
            else:
                _atomic_write_json(config.FEEDBACK_FILE, [])
    except Exception as err:
        _log_storage_error(
            logging.WARNING,
            "Could not initialize runtime feedback store",
            err,
        )

    # Merge fallback records without overwriting newer MongoDB records.
    if _MONGO_CONNECTED and _MONGO_DB is not None:
        try:
            if os.path.exists(config.FEEDBACK_FILE):
                with open(config.FEEDBACK_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                if isinstance(data, list) and data:
                    for item in data:
                        if not isinstance(item, dict) or not item.get("id"):
                            raise ValueError("Feedback record is missing its id")
                        _MONGO_DB.feedback.update_one(
                            {"id": item["id"]},
                            {"$setOnInsert": item},
                            upsert=True,
                        )
                    logger.info(f"Migrated {len(data)} feedback record(s) into MongoDB")
        except Exception as mig_err:
            _log_storage_error(
                logging.WARNING,
                "Feedback migration failed",
                mig_err,
            )
            _set_mongo_disconnected()


@contextmanager
def _feedback_file_lock():
    """Lock JSON read-modify-write operations across threads and processes."""
    with _interprocess_file_lock(config.FEEDBACK_FILE):
        yield


def _read_feedback_file() -> List[Dict[str, Any]]:
    try:
        with open(config.FEEDBACK_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
        return data if isinstance(data, list) else []
    except FileNotFoundError:
        return []


def _write_feedback_file(items: List[Dict[str, Any]]) -> bool:
    try:
        with _feedback_file_lock():
            _atomic_write_json(config.FEEDBACK_FILE, items)
        return True
    except Exception as err:
        _log_storage_error(logging.ERROR, "Writing feedback JSON fallback failed", err)
        return False


def _mirror_feedback_from_mongo() -> None:
    if not _MONGO_CONNECTED or _MONGO_DB is None:
        return
    try:
        items = list(_MONGO_DB.feedback.find({}, {"_id": 0}))
        if not _write_feedback_file(items):
            logger.error("Feedback was stored in MongoDB, but the JSON mirror could not be updated")
    except Exception as err:
        _log_storage_error(
            logging.ERROR,
            "Feedback was stored in MongoDB, but mirroring failed",
            err,
        )


def load_feedback() -> List[Dict[str, Any]]:
    """Load feedback records from MongoDB or fallback JSON."""
    ensure_feedback_file()

    with state.FEEDBACK_LOCK:
        if _MONGO_CONNECTED and _MONGO_DB is not None:
            try:
                cursor = _MONGO_DB.feedback.find({}, {"_id": 0})
                return list(cursor)
            except Exception as exc:
                _log_storage_error(logging.ERROR, "MongoDB feedback load failed", exc)
                _set_mongo_disconnected()

        try:
            with _feedback_file_lock():
                return _read_feedback_file()
        except Exception as err:
            _log_storage_error(logging.ERROR, "Loading feedback JSON failed", err)
            return []


def _set_mongo_disconnected() -> None:
    global _MONGO_CLIENT, _MONGO_DB, _MONGO_CONNECTED
    _MONGO_CONNECTED = False
    if _MONGO_CLIENT is not None:
        try:
            _MONGO_CLIENT.close()
        except Exception as error:
            _log_storage_error(
                logging.WARNING,
                "Closing MongoDB connection failed",
                error,
            )
        finally:
            _MONGO_CLIENT = None
            _MONGO_DB = None


def add_feedback(item: Dict[str, Any]) -> bool:
    """Atomically append feedback to MongoDB or the JSON fallback."""
    ensure_feedback_file()

    with state.FEEDBACK_LOCK:
        if _MONGO_CONNECTED and _MONGO_DB is not None:
            try:
                _MONGO_DB.feedback.insert_one(dict(item))
                _mirror_feedback_from_mongo()
                return True
            except Exception as exc:
                _log_storage_error(
                    logging.ERROR,
                    "MongoDB feedback insert failed; switching to JSON fallback",
                    exc,
                )
                _set_mongo_disconnected()

        try:
            with _feedback_file_lock():
                items = _read_feedback_file()
                items.insert(0, item)
                _atomic_write_json(config.FEEDBACK_FILE, items)
            return True
        except Exception as err:
            _log_storage_error(logging.ERROR, "Saving feedback JSON fallback failed", err)
            return False


def update_feedback_status(feedback_id: str, status: str, reviewed_at: float):
    """Atomically update a feedback record; return the updated record or None."""
    ensure_feedback_file()

    with state.FEEDBACK_LOCK:
        if _MONGO_CONNECTED and _MONGO_DB is not None:
            try:
                from pymongo import ReturnDocument

                updated = _MONGO_DB.feedback.find_one_and_update(
                    {"id": feedback_id},
                    {"$set": {
                        "review_status": status,
                        "reviewed_at": reviewed_at,
                    }},
                    projection={"_id": 0},
                    return_document=ReturnDocument.AFTER,
                )
                if updated:
                    _mirror_feedback_from_mongo()
                    return updated
                return None
            except Exception as exc:
                _log_storage_error(
                    logging.ERROR,
                    "MongoDB feedback update failed; switching to JSON fallback",
                    exc,
                )
                _set_mongo_disconnected()

        try:
            with _feedback_file_lock():
                items = _read_feedback_file()
                for item in items:
                    if item.get("id") == feedback_id:
                        item["review_status"] = status
                        item["reviewed_at"] = reviewed_at
                        _atomic_write_json(config.FEEDBACK_FILE, items)
                        return item
        except Exception as err:
            _log_storage_error(logging.ERROR, "Updating feedback JSON fallback failed", err)
        return None


def save_feedback(items: List[Dict[str, Any]]) -> bool:
    """Compatibility helper that mirrors a complete feedback snapshot."""
    ensure_feedback_file()

    with state.FEEDBACK_LOCK:
        mongo_success = False
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
                mongo_success = True
            except Exception as exc:
                _log_storage_error(logging.ERROR, "Saving feedback to MongoDB failed", exc)
                _set_mongo_disconnected()

        file_success = _write_feedback_file(items)

        return mongo_success or file_success
