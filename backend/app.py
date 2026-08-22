import os
import time
import secrets
import gc
import sqlite3

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
# Render restarts will clear active sessions.
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
# AUTHENTICATION DATABASE
# ============================================================

AUTH_DB = os.path.join(
    BASE_DIR,
    "auth.db"
)


def get_auth_db():
    """
    Open the authentication SQLite database.
    """

    conn = sqlite3.connect(
        AUTH_DB
    )

    conn.row_factory = sqlite3.Row

    return conn


def init_auth_db():
    """
    Create the users table if it does not already exist.
    """

    try:

        conn = get_auth_db()

        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        conn.commit()

        conn.close()

        print()
        print("=" * 70)
        print("AUTHENTICATION DATABASE")
        print("=" * 70)
        print(
            f"Database: {AUTH_DB}"
        )
        print(
            "Status:   Ready"
        )
        print("=" * 70)
        print()

    except Exception as error:

        print()
        print("=" * 70)
        print("AUTHENTICATION DATABASE ERROR")
        print("=" * 70)
        print(
            "Error:",
            error
        )
        print("=" * 70)
        print()


# Initialize authentication database
init_auth_db()


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
    """
    Lazily initialize MediaPipe Hands.
    """

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

        print(
            "=" * 70
        )

        print()

    return hands


# ============================================================
# SAFE NUMBER
# ============================================================

def safe_number(
    value,
    default=None
):
    """
    Convert a value to float safely.
    """

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
    """
    Normalize accuracy values.

    Example:
        0.9363 -> 93.63
        93.63  -> 93.63
    """

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
    """
    Create a random application authentication token.
    """

    token = secrets.token_urlsafe(
        48
    )

    AUTH_TOKENS[token] = {
        "user": user,
        "created_at": time.time()
    }

    return token


# ============================================================
# EMAIL / PASSWORD REGISTER
#
# POST /api/auth/register
#
# Body:
#
# {
#     "fullName": "John Doe",
#     "email": "john@gmail.com",
#     "password": "123456",
#     "confirmPassword": "123456"
# }
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

                "success":
                    False,

                "message":
                    "Request body is missing."

            }), 400


        # ====================================================
        # GET DATA
        # ====================================================

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

                "success":
                    False,

                "message":
                    "Please enter your full name."

            }), 400


        if not email:

            return jsonify({

                "success":
                    False,

                "message":
                    "Please enter your email address."

            }), 400


        if "@" not in email or "." not in email:

            return jsonify({

                "success":
                    False,

                "message":
                    "Please enter a valid email address."

            }), 400


        if len(password) < 6:

            return jsonify({

                "success":
                    False,

                "message":
                    "Password must contain at least 6 characters."

            }), 400


        if password != confirm_password:

            return jsonify({

                "success":
                    False,

                "message":
                    "Passwords do not match."

            }), 400


        # ====================================================
        # OPEN DATABASE
        # ====================================================

        conn = get_auth_db()


        # ====================================================
        # CHECK EXISTING USER
        # ====================================================

        existing_user = conn.execute(
            """
            SELECT id
            FROM users
            WHERE email = ?
            """,
            (
                email,
            )
        ).fetchone()


        if existing_user:

            conn.close()

            return jsonify({

                "success":
                    False,

                "message":
                    "An account with this email already exists."

            }), 409


        # ====================================================
        # HASH PASSWORD
        # ====================================================

        password_hash = generate_password_hash(
            password
        )


        # ====================================================
        # INSERT USER
        # ====================================================

        cursor = conn.execute(
            """
            INSERT INTO users (
                full_name,
                email,
                password_hash
            )
            VALUES (?, ?, ?)
            """,
            (
                full_name,
                email,
                password_hash
            )
        )


        conn.commit()


        user_id = cursor.lastrowid


        conn.close()


        # ====================================================
        # LOG
        # ====================================================

        print()
        print("=" * 70)
        print("NEW USER REGISTERED")
        print("=" * 70)

        print(
            f"User ID:       {user_id}"
        )

        print(
            f"Name:          {full_name}"
        )

        print(
            f"Email:         {email}"
        )

        print(
            "Provider:      email"
        )

        print("=" * 70)
        print()


        # ====================================================
        # RESPONSE
        # ====================================================

        return jsonify({

            "success":
                True,

            "message":
                "Account created successfully.",

            "user": {

                "id":
                    str(user_id),

                "name":
                    full_name,

                "email":
                    email,

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

        }), 201


    except sqlite3.IntegrityError:

        return jsonify({

            "success":
                False,

            "message":
                "An account with this email already exists."

        }), 409


    except Exception as error:

        print()
        print(
            "Registration Error:",
            error
        )
        print()

        return jsonify({

            "success":
                False,

            "message":
                "Registration failed.",

            "error":
                str(error)

        }), 500


# ============================================================
# EMAIL / PASSWORD LOGIN
#
# POST /api/auth/login
#
# Body:
#
# {
#     "email": "john@gmail.com",
#     "password": "123456"
# }
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

                "success":
                    False,

                "message":
                    "Request body is missing."

            }), 400


        # ====================================================
        # GET DATA
        # ====================================================

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


        # ====================================================
        # VALIDATION
        # ====================================================

        if not email:

            return jsonify({

                "success":
                    False,

                "message":
                    "Please enter your email."

            }), 400


        if not password:

            return jsonify({

                "success":
                    False,

                "message":
                    "Please enter your password."

            }), 400


        # ====================================================
        # FIND USER
        # ====================================================

        conn = get_auth_db()


        user = conn.execute(
            """
            SELECT
                id,
                full_name,
                email,
                password_hash
            FROM users
            WHERE email = ?
            """,
            (
                email,
            )
        ).fetchone()


        conn.close()


        # ====================================================
        # USER NOT FOUND
        # ====================================================

        if user is None:

            return jsonify({

                "success":
                    False,

                "message":
                    "Invalid email or password."

            }), 401


        # ====================================================
        # CHECK PASSWORD
        # ====================================================

        password_valid = check_password_hash(
            user["password_hash"],
            password
        )


        if not password_valid:

            return jsonify({

                "success":
                    False,

                "message":
                    "Invalid email or password."

            }), 401


        # ====================================================
        # USER OBJECT
        # ====================================================

        user_data = {

            "id":
                str(
                    user["id"]
                ),

            "name":
                user["full_name"],

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


        # ====================================================
        # CREATE TOKEN
        # ====================================================

        app_token = create_auth_token(
            user_data
        )


        # ====================================================
        # LOG
        # ====================================================

        print()
        print("=" * 70)
        print("EMAIL LOGIN")
        print("=" * 70)

        print(
            f"Name:          {user['full_name']}"
        )

        print(
            f"Email:         {user['email']}"
        )

        print(
            "Authentication: Email / Password"
        )

        print("=" * 70)
        print()


        # ====================================================
        # RESPONSE
        # ====================================================

        return jsonify({

            "success":
                True,

            "message":
                "Login successful.",

            "token":
                app_token,

            "user":
                user_data

        }), 200


    except Exception as error:

        print()
        print(
            "Email Login Error:",
            error
        )
        print()

        return jsonify({

            "success":
                False,

            "message":
                "Login failed.",

            "error":
                str(error)

        }), 500


# ============================================================
# GOOGLE LOGIN
#
# POST /api/auth/google
#
# Body:
#
# {
#     "credential": "GOOGLE_ID_TOKEN"
# }
# ============================================================

@app.route(
    "/api/auth/google",
    methods=["POST"]
)
def google_login():

    try:

        if not GOOGLE_CLIENT_ID:

            print(
                "ERROR: GOOGLE_CLIENT_ID is missing."
            )

            return jsonify({

                "success":
                    False,

                "message":
                    "Google authentication is not configured on the server."

            }), 500


        data = request.get_json(
            silent=True
        )


        if not data:

            return jsonify({

                "success":
                    False,

                "message":
                    "Request body is missing."

            }), 400


        credential = data.get(
            "credential"
        )


        if not credential:

            return jsonify({

                "success":
                    False,

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

                "success":
                    False,

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

                "success":
                    False,

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


        # ====================================================
        # VALIDATION
        # ====================================================

        if not google_id:

            return jsonify({

                "success":
                    False,

                "message":
                    "Google account ID is missing."

            }), 400


        if not email:

            return jsonify({

                "success":
                    False,

                "message":
                    "Google account email is missing."

            }), 400


        if not email_verified:

            return jsonify({

                "success":
                    False,

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
        # USER OBJECT
        # ====================================================

        user = {

            "id":
                google_id,

            "googleId":
                google_id,

            "name":
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
                "google"

        }


        # ====================================================
        # CREATE TOKEN
        # ====================================================

        app_token = create_auth_token(
            user
        )


        # ====================================================
        # LOG
        # ====================================================

        print()
        print("=" * 70)
        print("GOOGLE LOGIN")
        print("=" * 70)

        print(
            f"Name:              {name}"
        )

        print(
            f"Email:             {email}"
        )

        print(
            f"Google ID:         {google_id}"
        )

        print(
            f"Email Verified:    {email_verified}"
        )

        print(
            "Authentication:    Google"
        )

        print("=" * 70)
        print()


        return jsonify({

            "success":
                True,

            "message":
                "Google login successful.",

            "token":
                app_token,

            "user":
                user

        }), 200


    except Exception as error:

        print(
            "Google Login Error:",
            error
        )

        return jsonify({

            "success":
                False,

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

            "success":
                False,

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

            "success":
                False,

            "message":
                "Invalid authorization token."

        }), 401


    auth_data = AUTH_TOKENS.get(
        token
    )


    if not auth_data:

        return jsonify({

            "success":
                False,

            "message":
                "Invalid or expired session."

        }), 401


    return jsonify({

        "success":
            True,

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

        "success":
            True,

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
            f"Model: {MODEL_PATH}"
        )

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

        # ====================================================
        # BGR -> RGB
        # ====================================================

        image_rgb = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB
        )


        # ====================================================
        # RESIZE IMAGE
        # ====================================================

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


        # ====================================================
        # MEDIAPIPE
        # ====================================================

        hands_detector = get_hands()


        results = hands_detector.process(
            image_rgb
        )


        if not results.multi_hand_landmarks:

            return None


        hand = results.multi_hand_landmarks[0]

        wrist = hand.landmark[0]


        features = []


        # ====================================================
        # 21 LANDMARKS
        # ====================================================

        for landmark in hand.landmark:

            x = landmark.x - wrist.x

            y = landmark.y - wrist.y

            z = landmark.z - wrist.z

            features.extend([
                x,
                y,
                z
            ])


        # ====================================================
        # NUMPY ARRAY
        # ====================================================

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


    # ========================================================
    # RECALL
    # ========================================================

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


    # ========================================================
    # SUPPORT
    # ========================================================

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


    # ========================================================
    # MODEL CHECK
    # ========================================================

    if not MODEL_LOADED:

        return {

            "success":
                False,

            "message":
                "AI model is not loaded."

        }, 500


    try:

        # ====================================================
        # LANDMARK EXTRACTION
        # ====================================================

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


        # ====================================================
        # FEATURE COUNT
        # ====================================================

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


        # ====================================================
        # SAVE HISTORY
        # ====================================================

        save_prediction(
            response
        )


        # ====================================================
        # LOG
        # ====================================================

        print()
        print("=" * 70)
        print("PREDICTION")
        print("=" * 70)

        print(
            f"Source:               {source}"
        )

        print(
            f"Predicted Sign:       {predicted_label}"
        )

        print(
            f"Confidence:           {confidence_percent:.2f}%"
        )


        if sign_accuracy_percent is not None:

            print(
                f"Sign Accuracy:        "
                f"{sign_accuracy_percent:.2f}%"
            )

        else:

            print(
                "Sign Accuracy:        N/A"
            )


        print(
            f"Processing Time:      "
            f"{processing_time_ms} ms"
        )

        print(
            "Model:                "
            "Random Forest Classifier"
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
#
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


        # ====================================================
        # LIMIT UPLOAD SIZE
        # ====================================================

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


        # ====================================================
        # DECODE IMAGE
        # ====================================================

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
#
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


        # ====================================================
        # LIMIT FRAME SIZE
        # ====================================================

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


        # ====================================================
        # DECODE FRAME
        # ====================================================

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
    "Auth Database:",
    AUTH_DB
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
    print("Email Auth Configured:")
    print(
        True
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