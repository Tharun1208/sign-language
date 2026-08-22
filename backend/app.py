import os
import time
import secrets
import gc
import json
import threading

import cv2
import joblib
import numpy as np
import mediapipe as mp

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

# ============================================================
# GOOGLE AUTHENTICATION
# ============================================================

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# FLASK APP
# ============================================================

app = Flask(__name__)


# ============================================================
# CORS
# ============================================================

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    },
    methods=[
        "GET",
        "POST",
        "DELETE",
        "OPTIONS"
    ],
    allow_headers=[
        "Content-Type",
        "Authorization"
    ]
)


# ============================================================
# GOOGLE CONFIGURATION
# ============================================================

GOOGLE_CLIENT_ID = os.getenv(
    "GOOGLE_CLIENT_ID",
    ""
).strip()


# ============================================================
# APPLICATION AUTH TOKENS
#
# NOTE:
# These tokens are stored in memory.
# Restarting Render will clear active sessions.
# ============================================================

AUTH_TOKENS = {}


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "sign_model.pkl"
)


# ============================================================
# JSON USER STORAGE
#
# NO SQL DATABASE IS USED.
#
# Users are stored inside:
#
# users.json
#
# ============================================================

USERS_FILE = os.path.join(
    BASE_DIR,
    "users.json"
)


# Lock prevents simultaneous writes to users.json
USERS_LOCK = threading.Lock()


# ============================================================
# USER FILE HELPERS
# ============================================================

def ensure_users_file():
    """
    Create users.json if it does not exist.
    """

    try:

        if not os.path.exists(
            USERS_FILE
        ):

            with open(
                USERS_FILE,
                "w",
                encoding="utf-8"
            ) as file:

                json.dump(
                    [],
                    file,
                    indent=4
                )

    except Exception as error:

        print(
            "Unable to create users.json:",
            error
        )


def load_users():
    """
    Load users from users.json.
    """

    ensure_users_file()

    try:

        with open(
            USERS_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(
                file
            )

        if not isinstance(
            data,
            list
        ):

            return []

        return data

    except json.JSONDecodeError:

        print(
            "users.json contains invalid JSON. "
            "Starting with an empty user list."
        )

        return []

    except Exception as error:

        print(
            "Error loading users:",
            error
        )

        return []


def save_users(users):
    """
    Save users to users.json.
    """

    with USERS_LOCK:

        try:

            temporary_file = (
                USERS_FILE +
                ".tmp"
            )

            with open(
                temporary_file,
                "w",
                encoding="utf-8"
            ) as file:

                json.dump(
                    users,
                    file,
                    indent=4,
                    ensure_ascii=False
                )


            os.replace(
                temporary_file,
                USERS_FILE
            )


            return True

        except Exception as error:

            print(
                "Error saving users:",
                error
            )

            return False


def find_user_by_email(
    email
):
    """
    Find a user by email.
    """

    users = load_users()

    email = (
        str(email)
        .strip()
        .lower()
    )

    for user in users:

        if (
            str(
                user.get(
                    "email",
                    ""
                )
            )
            .strip()
            .lower()
            == email
        ):

            return user

    return None


def find_user_by_id(
    user_id
):
    """
    Find a user by ID.
    """

    users = load_users()

    for user in users:

        if str(
            user.get(
                "id",
                ""
            )
        ) == str(user_id):

            return user

    return None


# ============================================================
# INITIALIZE USER STORAGE
# ============================================================

ensure_users_file()


print()
print("=" * 70)
print("USER STORAGE")
print("=" * 70)
print(
    f"Storage: {USERS_FILE}"
)
print(
    f"Users:   {len(load_users())}"
)
print(
    "Database: None"
)
print("=" * 70)
print()


# ============================================================
# GLOBAL MODEL VARIABLES
# ============================================================

MODEL_DATA = None
MODEL = None

LABELS = []

PERFORMANCE = {}
PER_CLASS_METRICS = {}

MODEL_METADATA = {}
DATASET_INFO = {}

MODEL_LOADED = False


# ============================================================
# PREDICTION HISTORY
# ============================================================

PREDICTIONS = []

MAX_PREDICTIONS = 100


# ============================================================
# MEDIAPIPE
# ============================================================

mp_hands = mp.solutions.hands

hands = None


def get_hands():

    global hands

    if hands is None:

        print()
        print("=" * 70)
        print("INITIALIZING MEDIAPIPE HANDS")
        print("=" * 70)

        hands = mp_hands.Hands(
            static_image_mode=True,
            max_num_hands=1,
            model_complexity=0,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

        print(
            "MediaPipe Hands initialized."
        )

        print("=" * 70)
        print()

    return hands


# ============================================================
# SAFE NUMBER
# ============================================================

def safe_number(
    value,
    default=None
):

    if value is None:

        return default

    try:

        return float(
            value
        )

    except (
        TypeError,
        ValueError
    ):

        return default


# ============================================================
# FORMAT ACCURACY
# ============================================================

def format_accuracy(
    value
):

    value = safe_number(
        value
    )

    if value is None:

        return None

    if 0 <= value <= 1:

        value *= 100

    return round(
        min(
            100,
            max(
                0,
                value
            )
        ),
        2
    )


# ============================================================
# CREATE APPLICATION AUTH TOKEN
# ============================================================

def create_auth_token(
    user
):

    token = secrets.token_urlsafe(
        48
    )

    AUTH_TOKENS[token] = {

        "user":
            user,

        "created_at":
            time.time()

    }

    return token


# ============================================================
# REGISTER
#
# POST /api/auth/register
# ============================================================

@app.route(
    "/api/auth/register",
    methods=["POST"]
)
def register():

    try:

        data = request.get_json(
            silent=True
        )

        if not data:

            return jsonify({

                "success": False,

                "message":
                    "Request body is missing."

            }), 400


        full_name = str(
            data.get(
                "fullName",
                ""
            )
        ).strip()


        email = str(
            data.get(
                "email",
                ""
            )
        ).strip().lower()


        password = str(
            data.get(
                "password",
                ""
            )
        )


        confirm_password = str(
            data.get(
                "confirmPassword",
                ""
            )
        )


        # ====================================================
        # VALIDATION
        # ====================================================

        if not full_name:

            return jsonify({

                "success": False,

                "message":
                    "Please enter your full name."

            }), 400


        if not email:

            return jsonify({

                "success": False,

                "message":
                    "Please enter your email address."

            }), 400


        if (
            "@" not in email
            or
            "." not in email
        ):

            return jsonify({

                "success": False,

                "message":
                    "Please enter a valid email address."

            }), 400


        if len(password) < 6:

            return jsonify({

                "success": False,

                "message":
                    "Password must contain at least 6 characters."

            }), 400


        if password != confirm_password:

            return jsonify({

                "success": False,

                "message":
                    "Passwords do not match."

            }), 400


        # ====================================================
        # CHECK EXISTING USER
        # ====================================================

        existing_user = find_user_by_email(
            email
        )


        if existing_user:

            return jsonify({

                "success": False,

                "message":
                    "An account with this email already exists."

            }), 409


        # ====================================================
        # CREATE USER ID
        # ====================================================

        user_id = secrets.token_hex(
            16
        )


        # ====================================================
        # HASH PASSWORD
        # ====================================================

        password_hash = generate_password_hash(
            password
        )


        # ====================================================
        # CREATE USER
        # ====================================================

        user = {

            "id":
                user_id,

            "fullName":
                full_name,

            "name":
                full_name,

            "email":
                email,

            "passwordHash":
                password_hash,

            "phone":
                "",

            "age":
                "",

            "university":
                "",

            "picture":
                "",

            "profileImage":
                "",

            "image":
                "",

            "emailVerified":
                True,

            "provider":
                "email",

            "createdAt":
                time.time()

        }


        # ====================================================
        # SAVE USER
        # ====================================================

        users = load_users()

        users.append(
            user
        )


        if not save_users(
            users
        ):

            return jsonify({

                "success": False,

                "message":
                    "Unable to save your account."

            }), 500


        # ====================================================
        # RESPONSE USER
        #
        # DO NOT SEND PASSWORD HASH
        # ====================================================

        safe_user = {

            "id":
                user["id"],

            "name":
                user["name"],

            "email":
                user["email"],

            "phone":
                "",

            "age":
                "",

            "university":
                "",

            "picture":
                "",

            "profileImage":
                "",

            "image":
                "",

            "emailVerified":
                True,

            "provider":
                "email"

        }


        print()
        print("=" * 70)
        print("NEW USER REGISTERED")
        print("=" * 70)
        print(
            f"User ID:  {user['id']}"
        )
        print(
            f"Name:     {user['name']}"
        )
        print(
            f"Email:    {user['email']}"
        )
        print(
            "Provider: email"
        )
        print("=" * 70)
        print()


        return jsonify({

            "success": True,

            "message":
                "Account created successfully.",

            "user":
                safe_user

        }), 201


    except Exception as error:

        print(
            "Registration Error:",
            error
        )

        return jsonify({

            "success": False,

            "message":
                "Registration failed.",

            "error":
                str(error)

        }), 500


# ============================================================
# EMAIL / PASSWORD LOGIN
#
# POST /api/auth/login
# ============================================================

@app.route(
    "/api/auth/login",
    methods=["POST"]
)
def email_login():

    try:

        data = request.get_json(
            silent=True
        )

        if not data:

            return jsonify({

                "success": False,

                "message":
                    "Request body is missing."

            }), 400


        email = str(
            data.get(
                "email",
                ""
            )
        ).strip().lower()


        password = str(
            data.get(
                "password",
                ""
            )
        )


        if not email:

            return jsonify({

                "success": False,

                "message":
                    "Please enter your email."

            }), 400


        if not password:

            return jsonify({

                "success": False,

                "message":
                    "Please enter your password."

            }), 400


        # ====================================================
        # FIND USER
        # ====================================================

        user = find_user_by_email(
            email
        )


        if user is None:

            return jsonify({

                "success": False,

                "message":
                    "Invalid email or password."

            }), 401


        # ====================================================
        # GOOGLE ACCOUNT CHECK
        # ====================================================

        if not user.get(
            "passwordHash"
        ):

            return jsonify({

                "success": False,

                "message":
                    "This account uses Google Sign-In. "
                    "Please continue with Google."

            }), 400


        # ====================================================
        # CHECK PASSWORD
        # ====================================================

        password_valid = check_password_hash(
            user["passwordHash"],
            password
        )


        if not password_valid:

            return jsonify({

                "success": False,

                "message":
                    "Invalid email or password."

            }), 401


        # ====================================================
        # SAFE USER
        # ====================================================

        user_data = {

            "id":
                str(
                    user["id"]
                ),

            "name":
                user.get(
                    "name",
                    user.get(
                        "fullName",
                        ""
                    )
                ),

            "email":
                user["email"],

            "phone":
                user.get(
                    "phone",
                    ""
                ),

            "age":
                user.get(
                    "age",
                    ""
                ),

            "university":
                user.get(
                    "university",
                    ""
                ),

            "picture":
                user.get(
                    "picture",
                    ""
                ),

            "profileImage":
                user.get(
                    "profileImage",
                    ""
                ),

            "image":
                user.get(
                    "image",
                    ""
                ),

            "emailVerified":
                True,

            "provider":
                "email"

        }


        # ====================================================
        # CREATE TOKEN
        # ====================================================

        app_token = create_auth_token(
            user_data
        )


        print()
        print("=" * 70)
        print("EMAIL LOGIN")
        print("=" * 70)
        print(
            f"Name:  {user_data['name']}"
        )
        print(
            f"Email: {user_data['email']}"
        )
        print("=" * 70)
        print()


        return jsonify({

            "success": True,

            "message":
                "Login successful.",

            "token":
                app_token,

            "user":
                user_data

        }), 200


    except Exception as error:

        print(
            "Email Login Error:",
            error
        )

        return jsonify({

            "success": False,

            "message":
                "Login failed.",

            "error":
                str(error)

        }), 500


# ============================================================
# GOOGLE LOGIN
#
# POST /api/auth/google
# ============================================================

@app.route(
    "/api/auth/google",
    methods=["POST"]
)
def google_login():

    try:

        if not GOOGLE_CLIENT_ID:

            return jsonify({

                "success": False,

                "message":
                    "Google authentication is not configured on the server."

            }), 500


        data = request.get_json(
            silent=True
        )


        if not data:

            return jsonify({

                "success": False,

                "message":
                    "Request body is missing."

            }), 400


        credential = data.get(
            "credential"
        )


        if not credential:

            return jsonify({

                "success": False,

                "message":
                    "Google credential is required."

            }), 400


        # ====================================================
        # VERIFY GOOGLE TOKEN
        # ====================================================

        try:

            google_user = id_token.verify_oauth2_token(

                credential,

                google_requests.Request(),

                GOOGLE_CLIENT_ID

            )

        except ValueError as error:

            print(
                "Google token verification failed:",
                error
            )

            return jsonify({

                "success": False,

                "message":
                    "Invalid or expired Google credential."

            }), 401


        # ====================================================
        # VERIFY ISSUER
        # ====================================================

        issuer = google_user.get(
            "iss"
        )


        if issuer not in [
            "accounts.google.com",
            "https://accounts.google.com"
        ]:

            return jsonify({

                "success": False,

                "message":
                    "Invalid Google token issuer."

            }), 401


        # ====================================================
        # GOOGLE INFORMATION
        # ====================================================

        google_id = google_user.get(
            "sub"
        )

        email = google_user.get(
            "email"
        )

        name = google_user.get(
            "name"
        )

        picture = google_user.get(
            "picture"
        )

        email_verified = google_user.get(
            "email_verified",
            False
        )

        given_name = google_user.get(
            "given_name"
        )

        family_name = google_user.get(
            "family_name"
        )


        if not google_id:

            return jsonify({

                "success": False,

                "message":
                    "Google account ID is missing."

            }), 400


        if not email:

            return jsonify({

                "success": False,

                "message":
                    "Google account email is missing."

            }), 400


        if not email_verified:

            return jsonify({

                "success": False,

                "message":
                    "Your Google email address is not verified."

            }), 403


        # ====================================================
        # FALLBACK NAME
        # ====================================================

        if not name:

            name = (
                email
                .split("@")[0]
                .replace(".", " ")
                .replace("_", " ")
                .replace("-", " ")
                .title()
            )


        # ====================================================
        # FIND EXISTING USER
        # ====================================================

        existing_user = find_user_by_email(
            email
        )


        # ====================================================
        # CREATE / UPDATE USER
        # ====================================================

        if existing_user:

            user = existing_user

            user["name"] = name
            user["fullName"] = name
            user["googleId"] = google_id
            user["picture"] = picture or ""
            user["profileImage"] = picture or ""
            user["image"] = picture or ""
            user["givenName"] = given_name or ""
            user["familyName"] = family_name or ""
            user["emailVerified"] = True
            user["provider"] = "google"


            users = load_users()


            for index, item in enumerate(
                users
            ):

                if str(
                    item.get("id")
                ) == str(
                    user.get("id")
                ):

                    users[index] = user

                    break


            save_users(
                users
            )


        else:

            user = {

                "id":
                    google_id,

                "googleId":
                    google_id,

                "name":
                    name,

                "fullName":
                    name,

                "email":
                    email,

                "phone":
                    "",

                "age":
                    "",

                "university":
                    "",

                "picture":
                    picture or "",

                "profileImage":
                    picture or "",

                "image":
                    picture or "",

                "givenName":
                    given_name or "",

                "familyName":
                    family_name or "",

                "emailVerified":
                    True,

                "provider":
                    "google",

                "createdAt":
                    time.time()

            }


            users = load_users()

            users.append(
                user
            )


            if not save_users(
                users
            ):

                return jsonify({

                    "success": False,

                    "message":
                        "Unable to save Google account."

                }), 500


        # ====================================================
        # SAFE USER
        # ====================================================

        safe_user = {

            "id":
                str(
                    user["id"]
                ),

            "googleId":
                user.get(
                    "googleId",
                    google_id
                ),

            "name":
                user["name"],

            "email":
                user["email"],

            "phone":
                user.get(
                    "phone",
                    ""
                ),

            "age":
                user.get(
                    "age",
                    ""
                ),

            "university":
                user.get(
                    "university",
                    ""
                ),

            "picture":
                user.get(
                    "picture",
                    ""
                ),

            "profileImage":
                user.get(
                    "profileImage",
                    ""
                ),

            "image":
                user.get(
                    "image",
                    ""
                ),

            "givenName":
                user.get(
                    "givenName",
                    ""
                ),

            "familyName":
                user.get(
                    "familyName",
                    ""
                ),

            "emailVerified":
                True,

            "provider":
                "google"

        }


        # ====================================================
        # TOKEN
        # ====================================================

        app_token = create_auth_token(
            safe_user
        )


        print()
        print("=" * 70)
        print("GOOGLE LOGIN")
        print("=" * 70)
        print(
            f"Name:   {name}"
        )
        print(
            f"Email:  {email}"
        )
        print(
            f"Google ID: {google_id}"
        )
        print("=" * 70)
        print()


        return jsonify({

            "success": True,

            "message":
                "Google login successful.",

            "token":
                app_token,

            "user":
                safe_user

        }), 200


    except Exception as error:

        print(
            "Google Login Error:",
            error
        )

        return jsonify({

            "success": False,

            "message":
                "Google login failed.",

            "error":
                str(error)

        }), 500


# ============================================================
# CURRENT USER
#
# GET /api/auth/me
# ============================================================

@app.route(
    "/api/auth/me",
    methods=["GET"]
)
def get_current_user():

    authorization = request.headers.get(
        "Authorization",
        ""
    )


    if not authorization.startswith(
        "Bearer "
    ):

        return jsonify({

            "success": False,

            "message":
                "Authorization token is required."

        }), 401


    token = authorization.replace(
        "Bearer ",
        "",
        1
    ).strip()


    if not token:

        return jsonify({

            "success": False,

            "message":
                "Invalid authorization token."

        }), 401


    auth_data = AUTH_TOKENS.get(
        token
    )


    if not auth_data:

        return jsonify({

            "success": False,

            "message":
                "Invalid or expired session."

        }), 401


    return jsonify({

        "success": True,

        "user":
            auth_data["user"]

    }), 200


# ============================================================
# LOGOUT
#
# POST /api/auth/logout
# ============================================================

@app.route(
    "/api/auth/logout",
    methods=["POST"]
)
def logout():

    authorization = request.headers.get(
        "Authorization",
        ""
    )


    if authorization.startswith(
        "Bearer "
    ):

        token = authorization.replace(
            "Bearer ",
            "",
            1
        ).strip()


        AUTH_TOKENS.pop(
            token,
            None
        )


    return jsonify({

        "success": True,

        "message":
            "Logged out successfully."

    }), 200


# ============================================================
# LOAD MODEL
# ============================================================

def load_model():

    global MODEL_DATA
    global MODEL
    global LABELS
    global PERFORMANCE
    global PER_CLASS_METRICS
    global MODEL_METADATA
    global DATASET_INFO
    global MODEL_LOADED


    print()
    print("=" * 70)
    print("LOADING SIGN MODEL")
    print("=" * 70)
    print()

    print(
        "Model path:"
    )

    print(
        MODEL_PATH
    )

    print()


    if not os.path.exists(
        MODEL_PATH
    ):

        print(
            "ERROR: Model file not found."
        )

        MODEL_LOADED = False

        return False


    try:

        MODEL_DATA = joblib.load(
            MODEL_PATH
        )


        if not isinstance(
            MODEL_DATA,
            dict
        ):

            raise ValueError(
                "Model file must contain a dictionary."
            )


        # ====================================================
        # MODEL
        # ====================================================

        MODEL = MODEL_DATA.get(
            "model"
        )


        if MODEL is None:

            raise ValueError(
                "The model file does not contain a 'model' object."
            )


        # ====================================================
        # LABELS
        # ====================================================

        LABELS = MODEL_DATA.get(
            "labels",
            list(
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            )
        )


        if LABELS is None:

            LABELS = list(
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            )


        # ====================================================
        # PERFORMANCE
        # ====================================================

        PERFORMANCE = MODEL_DATA.get(
            "performance",
            {}
        )


        if not isinstance(
            PERFORMANCE,
            dict
        ):

            PERFORMANCE = {}


        # ====================================================
        # PER CLASS METRICS
        # ====================================================

        PER_CLASS_METRICS = PERFORMANCE.get(
            "per_class_metrics",
            {}
        )


        if not PER_CLASS_METRICS:

            PER_CLASS_METRICS = MODEL_DATA.get(
                "per_class_metrics",
                {}
            )


        if not isinstance(
            PER_CLASS_METRICS,
            dict
        ):

            PER_CLASS_METRICS = {}


        # ====================================================
        # METADATA
        # ====================================================

        MODEL_METADATA = MODEL_DATA.get(
            "metadata",
            {}
        )


        if not isinstance(
            MODEL_METADATA,
            dict
        ):

            MODEL_METADATA = {}


        # ====================================================
        # DATASET
        # ====================================================

        DATASET_INFO = MODEL_DATA.get(
            "dataset",
            {}
        )


        if not isinstance(
            DATASET_INFO,
            dict
        ):

            DATASET_INFO = {}


        MODEL_LOADED = True


        # ====================================================
        # ACCURACY
        # ====================================================

        training_accuracy = format_accuracy(
            PERFORMANCE.get(
                "training_accuracy_percent"
            )
        )


        validation_accuracy = format_accuracy(
            PERFORMANCE.get(
                "validation_accuracy_percent"
            )
        )


        test_accuracy = format_accuracy(
            PERFORMANCE.get(
                "test_accuracy_percent"
            )
        )


        # ====================================================
        # LOG
        # ====================================================

        print(
            "MODEL LOADED SUCCESSFULLY"
        )

        print("-" * 70)

        print(
            f"Model Type: {type(MODEL).__name__}"
        )

        print(
            f"Feature Count: "
            f"{MODEL_DATA.get('feature_count', 63)}"
        )

        print(
            f"Number of Labels: {len(LABELS)}"
        )

        print(
            f"Labels: {LABELS}"
        )

        print()

        print(
            f"Training Accuracy: "
            f"{training_accuracy if training_accuracy is not None else 'N/A'}%"
        )

        print(
            f"Validation Accuracy: "
            f"{validation_accuracy if validation_accuracy is not None else 'N/A'}%"
        )

        print(
            f"Overall Test Accuracy: "
            f"{test_accuracy if test_accuracy is not None else 'N/A'}%"
        )

        print(
            "Per-Class Metrics:",
            len(PER_CLASS_METRICS)
        )

        print("-" * 70)
        print()

        return True


    except Exception as error:

        MODEL_LOADED = False

        print()
        print(
            "MODEL LOADING FAILED"
        )

        print("-" * 70)

        print(
            f"Error: {error}"
        )

        print("-" * 70)
        print()

        return False


# ============================================================
# EXTRACT HAND LANDMARKS
#
# 21 landmarks × 3 coordinates = 63 features
# ============================================================

def extract_landmarks_from_image(
    image
):

    if image is None:

        return None


    try:

        image_rgb = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB
        )


        height, width = image_rgb.shape[:2]

        max_dimension = 640


        if max(
            height,
            width
        ) > max_dimension:

            scale = (
                max_dimension /
                max(
                    height,
                    width
                )
            )


            new_width = max(
                1,
                int(
                    width * scale
                )
            )


            new_height = max(
                1,
                int(
                    height * scale
                )
            )


            image_rgb = cv2.resize(
                image_rgb,
                (
                    new_width,
                    new_height
                ),
                interpolation=cv2.INTER_AREA
            )


        hands_detector = get_hands()


        results = hands_detector.process(
            image_rgb
        )


        if not results.multi_hand_landmarks:

            return None


        hand = results.multi_hand_landmarks[0]

        wrist = hand.landmark[0]


        features = []


        for landmark in hand.landmark:

            x = landmark.x - wrist.x

            y = landmark.y - wrist.y

            z = landmark.z - wrist.z

            features.extend([
                x,
                y,
                z
            ])


        features = np.asarray(
            features,
            dtype=np.float32
        )


        if len(features) != 63:

            print(
                f"Invalid feature count: {len(features)}"
            )

            return None


        return features.reshape(
            1,
            -1
        )


    except Exception as error:

        print(
            "Landmark extraction error:",
            error
        )

        return None


# ============================================================
# GET SIGN METRICS
# ============================================================

def get_sign_metrics(
    label
):

    result = {

        "sign_accuracy_percent":
            None,

        "support":
            None

    }


    if not label:

        return result


    if not isinstance(
        PER_CLASS_METRICS,
        dict
    ):

        return result


    metrics = PER_CLASS_METRICS.get(
        label
    )


    if metrics is None:

        metrics = PER_CLASS_METRICS.get(
            label.lower()
        )


    if metrics is None:

        metrics = PER_CLASS_METRICS.get(
            label.upper()
        )


    if not isinstance(
        metrics,
        dict
    ):

        return result


    recall = metrics.get(
        "recall"
    )


    if recall is not None:

        try:

            recall = float(
                recall
            )


            if 0 <= recall <= 1:

                recall *= 100


            recall = min(
                100,
                max(
                    0,
                    recall
                )
            )


            result[
                "sign_accuracy_percent"
            ] = round(
                recall,
                2
            )


        except (
            TypeError,
            ValueError
        ):

            pass


    support = metrics.get(
        "support"
    )


    if support is not None:

        try:

            result[
                "support"
            ] = int(
                support
            )

        except (
            TypeError,
            ValueError
        ):

            result[
                "support"
            ] = support


    return result


# ============================================================
# SAVE PREDICTION
# ============================================================

def save_prediction(
    prediction
):

    global PREDICTIONS


    PREDICTIONS.insert(
        0,
        prediction
    )


    if len(
        PREDICTIONS
    ) > MAX_PREDICTIONS:

        PREDICTIONS = PREDICTIONS[
            :MAX_PREDICTIONS
        ]


# ============================================================
# COMMON PREDICTION
# ============================================================

def process_prediction(
    image,
    source="image"
):

    start_time = time.perf_counter()


    if not MODEL_LOADED:

        return {

            "success":
                False,

            "message":
                "AI model is not loaded."

        }, 500


    try:

        features = extract_landmarks_from_image(
            image
        )


        if features is None:

            processing_time = (
                time.perf_counter()
                - start_time
            ) * 1000


            return {

                "success":
                    False,

                "message":
                    "No hand detected in the image. "
                    "Please keep your hand fully visible "
                    "inside the camera frame.",

                "processing_time_ms":
                    round(
                        processing_time,
                        2
                    )

            }, 400


        expected_features = MODEL_DATA.get(
            "feature_count",
            63
        )


        if features.shape[1] != expected_features:

            return {

                "success":
                    False,

                "message":
                    "Feature count mismatch.",

                "expected_features":
                    expected_features,

                "received_features":
                    features.shape[1]

            }, 500


        # ====================================================
        # MODEL PREDICTION
        # ====================================================

        prediction = MODEL.predict(
            features
        )


        predicted_label = str(
            prediction[0]
        ).strip().upper()


        # ====================================================
        # CONFIDENCE
        # ====================================================

        confidence = None


        if hasattr(
            MODEL,
            "predict_proba"
        ):

            probabilities = MODEL.predict_proba(
                features
            )[0]


            if hasattr(
                MODEL,
                "classes_"
            ):

                class_names = [

                    str(item)
                    .strip()
                    .upper()

                    for item in MODEL.classes_

                ]

            else:

                class_names = []


            if predicted_label in class_names:

                predicted_index = class_names.index(
                    predicted_label
                )


                if predicted_index < len(
                    probabilities
                ):

                    confidence = float(
                        probabilities[
                            predicted_index
                        ]
                    )


        if confidence is None:

            confidence = 0.0


        confidence = min(
            1.0,
            max(
                0.0,
                confidence
            )
        )


        confidence_percent = round(
            confidence * 100,
            2
        )


        # ====================================================
        # SIGN METRICS
        # ====================================================

        sign_metrics = get_sign_metrics(
            predicted_label
        )


        sign_accuracy_percent = (
            sign_metrics[
                "sign_accuracy_percent"
            ]
        )


        support = (
            sign_metrics[
                "support"
            ]
        )


        # ====================================================
        # PROCESSING TIME
        # ====================================================

        processing_time = (
            time.perf_counter()
            - start_time
        ) * 1000


        processing_time_ms = round(
            processing_time,
            2
        )


        # ====================================================
        # RESPONSE
        # ====================================================

        response = {

            "success":
                True,

            "label":
                predicted_label,

            "predicted_label":
                predicted_label,

            "prediction":
                predicted_label,

            "confidence":
                round(
                    confidence,
                    6
                ),

            "confidence_percent":
                confidence_percent,

            "sign_accuracy_percent":
                sign_accuracy_percent,

            "sign_accuracy":
                sign_accuracy_percent,

            "support":
                support,

            "processing_time_ms":
                processing_time_ms,

            "model":
                "Random Forest Classifier",

            "model_name":
                "Random Forest Classifier",

            "feature_count":
                int(
                    features.shape[1]
                ),

            "source":
                source,

            "timestamp":
                time.time()

        }


        save_prediction(
            response
        )


        print()
        print("=" * 70)
        print("PREDICTION")
        print("=" * 70)

        print(
            f"Source:          {source}"
        )

        print(
            f"Predicted Sign:  {predicted_label}"
        )

        print(
            f"Confidence:      {confidence_percent:.2f}%"
        )


        if sign_accuracy_percent is not None:

            print(
                f"Sign Accuracy:   "
                f"{sign_accuracy_percent:.2f}%"
            )

        else:

            print(
                "Sign Accuracy:   N/A"
            )


        print(
            f"Processing Time: "
            f"{processing_time_ms} ms"
        )

        print(
            "Model:           Random Forest Classifier"
        )

        print("=" * 70)
        print()


        return response, 200


    except Exception as error:

        print()
        print("=" * 70)
        print("PREDICTION PROCESSING ERROR")
        print("=" * 70)

        print(
            "Error:",
            error
        )

        print("=" * 70)
        print()


        return {

            "success":
                False,

            "message":
                "Prediction processing failed.",

            "error":
                str(error)

        }, 500


    finally:

        try:

            del image

        except Exception:

            pass


        try:

            gc.collect()

        except Exception:

            pass


# ============================================================
# HEALTH
#
# GET /api/health
# ============================================================

@app.route(
    "/api/health",
    methods=["GET"]
)
def health():

    training_accuracy = None
    validation_accuracy = None
    test_accuracy = None


    if MODEL_LOADED:

        training_accuracy = format_accuracy(
            PERFORMANCE.get(
                "training_accuracy_percent"
            )
        )


        validation_accuracy = format_accuracy(
            PERFORMANCE.get(
                "validation_accuracy_percent"
            )
        )


        test_accuracy = format_accuracy(
            PERFORMANCE.get(
                "test_accuracy_percent"
            )
        )


    return jsonify({

        "success":
            True,

        "status":
            "online",

        "service":
            "SignAI Backend",

        "model_loaded":
            MODEL_LOADED,

        "google_auth_configured":
            bool(
                GOOGLE_CLIENT_ID
            ),

        "email_auth_configured":
            True,

        "storage":
            "JSON file",

        "database":
            False,

        "model":
            "Random Forest Classifier",

        "model_type":
            type(MODEL).__name__
            if MODEL is not None
            else None,

        "feature_count":
            MODEL_DATA.get(
                "feature_count",
                63
            )
            if MODEL_LOADED and MODEL_DATA
            else 63,

        "labels":
            LABELS,

        "number_of_labels":
            len(LABELS),

        "training_accuracy_percent":
            training_accuracy,

        "validation_accuracy_percent":
            validation_accuracy,

        "test_accuracy_percent":
            test_accuracy,

        "prediction_endpoint":
            "/api/predict",

        "frame_endpoint":
            "/api/predict/frame",

        "google_login_endpoint":
            "/api/auth/google",

        "email_register_endpoint":
            "/api/auth/register",

        "email_login_endpoint":
            "/api/auth/login"

    })


# ============================================================
# MODEL INFO
#
# GET /api/model-info
# ============================================================

@app.route(
    "/api/model-info",
    methods=["GET"]
)
def model_info():

    if not MODEL_LOADED:

        return jsonify({

            "success":
                False,

            "model_loaded":
                False,

            "message":
                "Model is not loaded."

        }), 500


    return jsonify({

        "success":
            True,

        "model_loaded":
            True,

        "model":
            "Random Forest Classifier",

        "model_type":
            type(MODEL).__name__,

        "feature_count":
            MODEL_DATA.get(
                "feature_count",
                63
            ),

        "labels":
            LABELS,

        "number_of_labels":
            len(LABELS),

        "training_accuracy_percent":
            format_accuracy(
                PERFORMANCE.get(
                    "training_accuracy_percent"
                )
            ),

        "validation_accuracy_percent":
            format_accuracy(
                PERFORMANCE.get(
                    "validation_accuracy_percent"
                )
            ),

        "test_accuracy_percent":
            format_accuracy(
                PERFORMANCE.get(
                    "test_accuracy_percent"
                )
            ),

        "feature_description":
            MODEL_METADATA.get(
                "feature_description"
            ),

        "dataset":
            DATASET_INFO,

        "per_class_metrics":
            PER_CLASS_METRICS

    })


# ============================================================
# NORMAL IMAGE PREDICTION
#
# POST /api/predict
#
# FormData:
# image = image file
# ============================================================

@app.route(
    "/api/predict",
    methods=["POST"]
)
def predict():

    uploaded_file = (
        request.files.get("image")
        or
        request.files.get("file")
    )


    if uploaded_file is None:

        return jsonify({

            "success":
                False,

            "message":
                "No image uploaded. "
                "Use field name 'image'."

        }), 400


    try:

        file_bytes = uploaded_file.read()


        if not file_bytes:

            return jsonify({

                "success":
                    False,

                "message":
                    "Uploaded image is empty."

            }), 400


        max_upload_size = (
            10 * 1024 * 1024
        )


        if len(file_bytes) > max_upload_size:

            return jsonify({

                "success":
                    False,

                "message":
                    "Image is too large. Maximum size is 10 MB."

            }), 413


        image_array = np.frombuffer(
            file_bytes,
            dtype=np.uint8
        )


        image = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR
        )


        if image is None:

            return jsonify({

                "success":
                    False,

                "message":
                    "Unable to read the uploaded image."

            }), 400


        response, status_code = process_prediction(
            image,
            source="image"
        )


        return jsonify(
            response
        ), status_code


    except Exception as error:

        print(
            "Image prediction error:",
            error
        )


        return jsonify({

            "success":
                False,

            "message":
                "Prediction failed.",

            "error":
                str(error)

        }), 500


# ============================================================
# LIVE WEBCAM FRAME PREDICTION
#
# POST /api/predict/frame
#
# FormData:
# frame = image file
# ============================================================

@app.route(
    "/api/predict/frame",
    methods=["POST"]
)
def predict_frame():

    uploaded_file = (
        request.files.get("frame")
        or
        request.files.get("image")
        or
        request.files.get("file")
    )


    if uploaded_file is None:

        return jsonify({

            "success":
                False,

            "message":
                "No webcam frame uploaded. "
                "Use field name 'frame'."

        }), 400


    try:

        file_bytes = uploaded_file.read()


        if not file_bytes:

            return jsonify({

                "success":
                    False,

                "message":
                    "Webcam frame is empty."

            }), 400


        max_frame_size = (
            5 * 1024 * 1024
        )


        if len(file_bytes) > max_frame_size:

            return jsonify({

                "success":
                    False,

                "message":
                    "Webcam frame is too large."

            }), 413


        image_array = np.frombuffer(
            file_bytes,
            dtype=np.uint8
        )


        image = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR
        )


        if image is None:

            return jsonify({

                "success":
                    False,

                "message":
                    "Unable to decode webcam frame."

            }), 400


        response, status_code = process_prediction(
            image,
            source="webcam"
        )


        return jsonify(
            response
        ), status_code


    except Exception as error:

        print(
            "Live frame prediction error:",
            error
        )


        return jsonify({

            "success":
                False,

            "message":
                "Live prediction failed.",

            "error":
                str(error)

        }), 500


# ============================================================
# PREDICTION HISTORY
#
# GET /api/predictions
# ============================================================

@app.route(
    "/api/predictions",
    methods=["GET"]
)
def get_predictions():

    return jsonify({

        "success":
            True,

        "predictions":
            PREDICTIONS,

        "count":
            len(PREDICTIONS)

    })


# ============================================================
# CLEAR PREDICTION HISTORY
#
# DELETE /api/predictions
# ============================================================

@app.route(
    "/api/predictions",
    methods=["DELETE"]
)
def clear_predictions():

    global PREDICTIONS

    PREDICTIONS = []


    return jsonify({

        "success":
            True,

        "message":
            "Prediction history cleared."

    })


# ============================================================
# ROOT
#
# GET /
# ============================================================

@app.route(
    "/",
    methods=["GET"]
)
def root():

    return jsonify({

        "service":
            "SignAI Backend",

        "status":
            "running",

        "model_loaded":
            MODEL_LOADED,

        "google_auth_configured":
            bool(
                GOOGLE_CLIENT_ID
            ),

        "email_auth_configured":
            True,

        "storage":
            "users.json",

        "database":
            False,

        "endpoints": {

            "health":
                "/api/health",

            "model_info":
                "/api/model-info",

            "register":
                "/api/auth/register",

            "login":
                "/api/auth/login",

            "google_login":
                "/api/auth/google",

            "current_user":
                "/api/auth/me",

            "logout":
                "/api/auth/logout",

            "predict":
                "/api/predict",

            "predict_frame":
                "/api/predict/frame",

            "predictions":
                "/api/predictions"

        }

    })


# ============================================================
# STARTUP
# ============================================================

print()
print("=" * 70)
print("SIGN AI BACKEND STARTING")
print("=" * 70)
print()


print(
    "Model:",
    MODEL_PATH
)


print(
    "Google Auth:",
    bool(
        GOOGLE_CLIENT_ID
    )
)


print(
    "Email Auth:",
    True
)


print(
    "User Storage:",
    USERS_FILE
)


print(
    "Database:",
    "None"
)


print()


# ============================================================
# LOAD MODEL
# ============================================================

load_model()


# ============================================================
# LOCAL DEVELOPMENT
# ============================================================

if __name__ == "__main__":

    print()
    print("=" * 70)
    print("SIGN AI BACKEND")
    print("=" * 70)


    print()
    print("Server:")
    print(
        "http://localhost:5000"
    )


    print()
    print("Health:")
    print(
        "http://localhost:5000/api/health"
    )


    print()
    print("Model Info:")
    print(
        "http://localhost:5000/api/model-info"
    )


    print()
    print("Register:")
    print(
        "POST http://localhost:5000/api/auth/register"
    )


    print()
    print("Email Login:")
    print(
        "POST http://localhost:5000/api/auth/login"
    )


    print()
    print("Google Login:")
    print(
        "POST http://localhost:5000/api/auth/google"
    )


    print()
    print("Current User:")
    print(
        "GET http://localhost:5000/api/auth/me"
    )


    print()
    print("Logout:")
    print(
        "POST http://localhost:5000/api/auth/logout"
    )


    print()
    print("Normal Prediction:")
    print(
        "POST http://localhost:5000/api/predict"
    )


    print()
    print("Live Prediction:")
    print(
        "POST http://localhost:5000/api/predict/frame"
    )


    print()
    print("Prediction History:")
    print(
        "GET http://localhost:5000/api/predictions"
    )


    print()
    print("Model Loaded:")
    print(
        MODEL_LOADED
    )


    print()
    print("Google Auth Configured:")
    print(
        bool(
            GOOGLE_CLIENT_ID
        )
    )


    print()
    print("User Storage:")
    print(
        USERS_FILE
    )


    print()
    print("Database:")
    print(
        "None"
    )


    print()
    print("=" * 70)


    app.run(
        host="0.0.0.0",

        port=int(
            os.getenv(
                "PORT",
                "5000"
            )
        ),

        debug=False
    )