import io
import json
import os
import tempfile
import threading
import time
import unittest
import uuid
import warnings
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

import joblib
import numpy as np
from werkzeug.security import check_password_hash

from signai import config, security, state, storage
from signai.app_factory import create_app
from signai.blueprints import video
from signai.features import (
    WRIST_CENTERED,
    WRIST_CENTERED_SCALE_NORMALIZED,
    extract_landmark_features,
    model_feature_preprocessing,
)
from signai.services import inference


class BackendTestCase(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp_dir.cleanup)
        root = Path(self.temp_dir.name)

        for name, value in (
            ("USERS_FILE", str(root / "users.json")),
            ("FEEDBACK_FILE", str(root / "feedback.json")),
            ("LEGACY_USERS_FILE", str(root / "missing-users.json")),
            ("LEGACY_FEEDBACK_FILE", str(root / "missing-feedback.json")),
            ("MONGO_URI", ""),
            ("FEEDBACK_MODERATOR_EMAILS", set()),
            ("AUTH_RATE_LIMIT_ATTEMPTS", 10),
            ("AUTH_RATE_LIMIT_WINDOW_SECONDS", 900),
        ):
            patcher = patch.object(config, name, value)
            patcher.start()
            self.addCleanup(patcher.stop)

        storage._MONGO_CLIENT = None
        storage._MONGO_DB = None
        storage._MONGO_CONNECTED = False
        storage._LAST_MONGO_ATTEMPT = 0.0
        self.mongo_patcher = patch(
            "signai.storage.init_mongo",
            return_value=False,
        )
        self.mongo_patcher.start()
        self.addCleanup(self.mongo_patcher.stop)

        state.AUTH_TOKENS.clear()
        state.AUTH_ATTEMPTS.clear()
        state.PREDICTIONS.clear()
        state.FEEDBACK_LOCK = threading.Lock()
        state.VIDEO_JOBS.clear()
        state.VIDEO_UPLOAD_ATTEMPTS.clear()

        self.app = create_app(load_model=False)
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()

    def make_token(self, user_id, email, role=None):
        user = {"id": user_id, "email": email}
        if role:
            user["role"] = role
        return security.create_auth_token(user)

    def auth_headers(self, user_id="test-user", email="test@example.com", role=None):
        return {
            "Authorization": "Bearer " + self.make_token(user_id, email, role),
        }


class FeedbackAndAuthTests(BackendTestCase):
    def test_feedback_requires_json_boolean_consent(self):
        invalid_values = (False, "true", "True", 1, 0, None, [], {})
        for value in invalid_values:
            with self.subTest(consent=value):
                response = self.client.post(
                    "/api/v1/feedback",
                    json={"correction": "A", "consent": value},
                )
                self.assertEqual(response.status_code, 400)

        response = self.client.post(
            "/api/v1/feedback",
            json={"correction": "A", "consent": True},
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.get_json()["feedback"]["consent"])

    def test_feedback_listing_and_review_authorization(self):
        submitted = self.client.post(
            "/api/v1/feedback",
            json={"correction": "A", "consent": True},
        )
        feedback_id = submitted.get_json()["feedback"]["id"]

        self.assertEqual(
            self.client.get("/api/v1/feedback").status_code,
            401,
        )
        regular_headers = self.auth_headers()
        self.assertEqual(
            self.client.get(
                "/api/v1/feedback",
                headers=regular_headers,
            ).status_code,
            200,
        )
        self.assertEqual(
            self.client.post(
                f"/api/v1/feedback/{feedback_id}/review",
                json={"status": "reviewed"},
                headers=regular_headers,
            ).status_code,
            403,
        )

        with patch.object(config, "FEEDBACK_MODERATOR_EMAILS", {"mod@example.com"}):
            moderator_headers = self.auth_headers(
                user_id="moderator",
                email="mod@example.com",
            )
            invalid_status = self.client.post(
                f"/api/v1/feedback/{feedback_id}/review",
                json={"status": "anything"},
                headers=moderator_headers,
            )
            self.assertEqual(invalid_status.status_code, 400)

            approved = self.client.post(
                f"/api/v1/feedback/{feedback_id}/review",
                json={"status": "reviewed"},
                headers=moderator_headers,
            )
            self.assertEqual(approved.status_code, 200)
            self.assertEqual(
                approved.get_json()["feedback"]["review_status"],
                "reviewed",
            )

    def test_feedback_concurrent_writes_are_not_lost(self):
        count = 80

        def insert(index):
            return storage.add_feedback({
                "id": f"feedback-{index}",
                "correction": "A",
                "review_status": "pending",
            })

        with ThreadPoolExecutor(max_workers=12) as executor:
            results = list(executor.map(insert, range(count)))

        self.assertTrue(all(results))
        records = storage.load_feedback()
        self.assertEqual(len(records), count)
        self.assertEqual(len({record["id"] for record in records}), count)

    def test_feedback_falls_back_to_json_without_logging_uri(self):
        secret_uri = "mongodb://private-user:private-password@db.example.test"

        class FailingClient:
            def close(self):
                return None

        class FailingFeedback:
            def update_one(self, *_args, **_kwargs):
                return None

            def find(self, *_args, **_kwargs):
                return []

            def insert_one(self, *_args, **_kwargs):
                raise RuntimeError(secret_uri)

        storage._MONGO_CLIENT = FailingClient()
        storage._MONGO_DB = SimpleNamespace(feedback=FailingFeedback())
        storage._MONGO_CONNECTED = True

        with self.assertLogs("signai.storage", level="ERROR") as captured:
            saved = storage.add_feedback({
                "id": "fallback-record",
                "review_status": "pending",
            })

        self.assertTrue(saved)
        self.assertFalse(storage.is_mongo_active())
        self.assertNotIn(secret_uri, "\n".join(captured.output))
        self.assertEqual(
            [item["id"] for item in storage.load_feedback()],
            ["fallback-record"],
        )

    def test_registration_login_and_password_hash_verification(self):
        password = "test-password-123"
        registered = self.client.post(
            "/api/auth/register",
            json={
                "fullName": "Test User",
                "email": "new-user@example.test",
                "password": password,
                "confirmPassword": password,
            },
        )
        self.assertEqual(registered.status_code, 201)
        self.assertNotIn("passwordHash", registered.get_json()["user"])

        stored = storage.find_user_by_email("new-user@example.test")
        self.assertTrue(check_password_hash(stored["passwordHash"], password))
        self.assertFalse(stored["emailVerified"])

        logged_in = self.client.post(
            "/api/auth/login",
            json={"email": "new-user@example.test", "password": password},
        )
        self.assertEqual(logged_in.status_code, 200)
        self.assertIn("token", logged_in.get_json())

    def test_google_login_does_not_take_over_email_password_account(self):
        password_hash = "preserved-hash"
        storage.create_user({
            "id": "email-account",
            "email": "collision@example.test",
            "passwordHash": password_hash,
            "provider": "email",
        })
        claims = {
            "iss": "https://accounts.google.com",
            "sub": "google-account",
            "email": "collision@example.test",
            "email_verified": True,
            "name": "Test User",
        }

        with patch.object(config, "GOOGLE_CLIENT_ID", "client-id"), patch(
            "google.oauth2.id_token.verify_oauth2_token",
            return_value=claims,
        ):
            response = self.client.post(
                "/api/auth/google",
                json={"credential": "test-token"},
            )

        self.assertEqual(response.status_code, 409)
        self.assertEqual(
            storage.find_user_by_email("collision@example.test")["passwordHash"],
            password_hash,
        )

    def test_auth_token_expiration(self):
        token = self.make_token("expiring", "user@example.test")
        state.AUTH_TOKENS[token]["created_at"] = time.time() - 10
        with patch.object(config, "AUTH_TOKEN_TTL_SECONDS", 1):
            response = self.client.get(
                "/api/auth/me",
                headers={"Authorization": f"Bearer {token}"},
            )
        self.assertEqual(response.status_code, 401)
        self.assertNotIn(token, state.AUTH_TOKENS)

    def test_prediction_history_requires_auth_and_is_user_scoped(self):
        state.PREDICTIONS.extend([
            {"label": "A", "_user_id": "alice"},
            {"label": "B", "_user_id": "bob"},
        ])

        self.assertEqual(self.client.get("/api/predictions").status_code, 401)
        alice_headers = self.auth_headers("alice", "alice@example.test")
        response = self.client.get(
            "/api/predictions",
            headers=alice_headers,
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [item["label"] for item in response.get_json()["predictions"]],
            ["A"],
        )
        self.assertNotIn(
            "_user_id",
            response.get_json()["predictions"][0],
        )
        self.assertEqual(
            self.client.delete(
                "/api/predictions",
                headers=alice_headers,
            ).status_code,
            200,
        )
        self.assertEqual(
            [item["label"] for item in state.PREDICTIONS],
            ["B"],
        )


class VideoProtectionTests(BackendTestCase):
    def setUp(self):
        super().setUp()
        self.video_dir = Path(self.temp_dir.name) / "videos"
        video_dir_patcher = patch.object(config, "VIDEO_DIR", str(self.video_dir))
        video_dir_patcher.start()
        self.addCleanup(video_dir_patcher.stop)
        self.video_dir.mkdir()

    def post_video(self, filename, content):
        return self.client.post(
            "/api/v1/videos/upload",
            data={"video": (io.BytesIO(content), filename)},
            content_type="multipart/form-data",
        )

    def test_video_rejects_bad_container_and_oversized_upload(self):
        bad_container = self.post_video("sample.mp4", b"not a video")
        self.assertEqual(bad_container.status_code, 415)
        self.assertEqual(list(self.video_dir.iterdir()), [])

        with patch.object(config, "MAX_VIDEO_UPLOAD_BYTES", 10):
            oversized = self.post_video("sample.mp4", b"x" * 11)
        self.assertEqual(oversized.status_code, 413)
        self.assertEqual(list(self.video_dir.iterdir()), [])

    def test_video_rate_and_concurrency_limits(self):
        with patch.object(config, "VIDEO_UPLOAD_RATE_LIMIT", 1):
            first = self.post_video("bad.exe", b"data")
            second = self.post_video("bad.exe", b"data")
        self.assertEqual(first.status_code, 415)
        self.assertEqual(second.status_code, 429)

        state.VIDEO_UPLOAD_ATTEMPTS.clear()
        with patch.object(state, "VIDEO_SLOTS", threading.BoundedSemaphore(1)):
            self.assertTrue(state.VIDEO_SLOTS.acquire(blocking=False))
            blocked = self.post_video("sample.mp4", b"anything")
        self.assertEqual(blocked.status_code, 429)

    def test_video_upload_is_processed_and_source_file_removed(self):
        mp4 = b"\x00\x00\x00\x18ftypisom" + b"\x00" * 24

        class Capture:
            def isOpened(self):
                return True

            def read(self):
                return True, object()

            def get(self, prop):
                if prop == video.cv2.CAP_PROP_FPS:
                    return 25
                if prop == video.cv2.CAP_PROP_FRAME_COUNT:
                    return 25
                return 0

            def release(self):
                return None

        def process_inline(job_id, path, _threshold):
            with state.VIDEO_LOCK:
                state.VIDEO_JOBS[job_id]["status"] = "completed"
                state.VIDEO_JOBS[job_id]["updated_at"] = time.time()
            os.remove(path)
            state.VIDEO_SLOTS.release()

        class InlineThread:
            def __init__(self, target, args, daemon):
                self.target = target
                self.args = args

            def start(self):
                self.target(*self.args)

        with patch.object(state, "VIDEO_SLOTS", threading.BoundedSemaphore(2)), patch(
            "signai.blueprints.video.cv2.VideoCapture",
            return_value=Capture(),
        ), patch("signai.blueprints.video.process_video_job", process_inline), patch(
            "signai.blueprints.video.threading.Thread",
            InlineThread,
        ):
            response = self.post_video("../../my video.mp4", mp4)

        self.assertEqual(response.status_code, 202)
        job = response.get_json()["job"]
        self.assertEqual(job["status"], "completed")
        self.assertEqual(job["filename"], "my_video.mp4")
        self.assertFalse(any(self.video_dir.iterdir()))

    def test_expired_jobs_and_stale_upload_temps_are_cleaned(self):
        now = time.time()
        job_id = uuid.uuid4().hex
        old_video = self.video_dir / f"signai-{job_id}.mp4"
        old_video.write_bytes(b"video")
        state.VIDEO_JOBS[job_id] = {
            "id": job_id,
            "status": "completed",
            "updated_at": now - 20,
            "path": str(old_video),
        }
        stale_temp = self.video_dir / ".video-upload-abcd1234.tmp"
        stale_temp.write_bytes(b"partial")
        os.utime(stale_temp, (now - 20, now - 20))

        with patch.object(config, "VIDEO_JOB_RETENTION_SECONDS", 10), patch.object(
            config,
            "VIDEO_STALE_FILE_RETENTION_SECONDS",
            10,
        ):
            video._cleanup_expired_jobs(now)

        self.assertNotIn(job_id, state.VIDEO_JOBS)
        self.assertFalse(old_video.exists())
        self.assertFalse(stale_temp.exists())


class ModelCompatibilityTests(BackendTestCase):
    @staticmethod
    def make_hand():
        return SimpleNamespace(
            landmark=[
                SimpleNamespace(
                    x=index * 0.01,
                    y=index * 0.02,
                    z=-index * 0.005,
                )
                for index in range(21)
            ]
        )

    def test_shared_preprocessing_order_and_scale_modes(self):
        hand = self.make_hand()
        wrist_relative = extract_landmark_features(hand)
        self.assertEqual(wrist_relative.shape, (63,))
        np.testing.assert_allclose(
            wrist_relative[:6],
            [0.0, 0.0, 0.0, 0.01, 0.02, -0.005],
        )

        scaled = extract_landmark_features(hand, normalize_scale=True)
        self.assertEqual(scaled.shape, (63,))
        self.assertAlmostEqual(
            float(np.max(np.linalg.norm(scaled.reshape(21, 3), axis=1))),
            1.0,
            places=5,
        )
        self.assertEqual(
            model_feature_preprocessing({"metadata": {}}),
            WRIST_CENTERED,
        )
        self.assertEqual(
            model_feature_preprocessing({"scale_normalized": True}),
            WRIST_CENTERED_SCALE_NORMALIZED,
        )

    def test_existing_model_prediction_and_inference_pipeline(self):
        with warnings.catch_warnings():
            warnings.simplefilter("error")
            bundle = joblib.load(config.MODEL_PATH)

        model = bundle["model"]
        self.assertEqual(bundle["feature_count"], 63)
        self.assertEqual(model.n_features_in_, 63)
        self.assertEqual(set(map(str, model.classes_)), set(bundle["labels"]))
        self.assertEqual(model_feature_preprocessing(bundle), WRIST_CENTERED)

        prediction = model.predict(np.zeros((1, 63), dtype=np.float32))
        probabilities = model.predict_proba(np.zeros((1, 63), dtype=np.float32))
        self.assertIn(str(prediction[0]), bundle["labels"])
        self.assertEqual(probabilities.shape, (1, 26))
        self.assertTrue(np.isfinite(probabilities).all())

        class Hands:
            def process(self, _image):
                return SimpleNamespace(multi_hand_landmarks=[self_hand])

        self_hand = self.make_hand()
        original_model_data = state.MODEL_DATA
        original_model = state.MODEL
        original_loaded = state.MODEL_LOADED
        original_labels = state.LABELS
        try:
            state.MODEL_DATA = bundle
            state.MODEL = model
            state.MODEL_LOADED = True
            state.LABELS = bundle["labels"]
            with patch.object(state, "get_hands", return_value=Hands()):
                payload, status_code = inference.process_prediction(
                    np.zeros((16, 16, 3), dtype=np.uint8),
                    save=False,
                    verbose=False,
                )
        finally:
            state.MODEL_DATA = original_model_data
            state.MODEL = original_model
            state.MODEL_LOADED = original_loaded
            state.LABELS = original_labels

        self.assertEqual(status_code, 200)
        self.assertEqual(payload["feature_count"], 63)
        self.assertIn(payload["label"], bundle["labels"])


if __name__ == "__main__":
    unittest.main()
