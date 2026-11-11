"""
Video translation endpoints.

Serves /video-translation -> /api/v1/videos/*

A background thread walks the video, samples one frame per second,
classifies each, and merges consecutive identical labels into segments.
"""

import os
import logging
import re
import tempfile
import threading
import time
import uuid

import cv2

from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename

from .. import config, state
from ..services import inference

video_bp = Blueprint("video", __name__, url_prefix="/api/v1/videos")
logger = logging.getLogger("signai.video")

_UPLOAD_TEMP_PATTERN = re.compile(r"^\.video-upload-[a-z0-9]+\.tmp$")
_JOB_FILE_PATTERN = re.compile(
    r"^signai-[0-9a-f]{32}\.(?:mp4|webm|mov|m4v|avi|mkv)$"
)


def _remove_file(path):
    if not path:
        return
    try:
        os.remove(path)
    except FileNotFoundError:
        pass
    except OSError as error:
        logger.warning("Video temporary file cleanup failed (%s)", type(error).__name__)


def _cleanup_expired_jobs(now=None):
    """Drop completed job metadata and remove its associated temporary video."""
    now = now or time.time()
    expired_paths = []

    with state.VIDEO_LOCK:
        expired_ids = [
            job_id
            for job_id, job in state.VIDEO_JOBS.items()
            if job.get("status") in {"completed", "failed"}
            and now - job.get("updated_at", now)
            >= config.VIDEO_JOB_RETENTION_SECONDS
        ]
        for job_id in expired_ids:
            job = state.VIDEO_JOBS.pop(job_id)
            if job.get("path"):
                expired_paths.append(job["path"])

    for path in expired_paths:
        _remove_file(path)

    try:
        for filename in os.listdir(config.VIDEO_DIR):
            is_stale_upload = _UPLOAD_TEMP_PATTERN.fullmatch(filename)
            is_orphaned_job = _JOB_FILE_PATTERN.fullmatch(filename)
            if not is_stale_upload and not is_orphaned_job:
                continue
            path = os.path.join(config.VIDEO_DIR, filename)
            retention = (
                config.VIDEO_STALE_FILE_RETENTION_SECONDS
                if is_stale_upload
                else config.VIDEO_JOB_RETENTION_SECONDS
            )
            if now - os.path.getmtime(path) >= retention:
                _remove_file(path)
    except FileNotFoundError:
        pass
    except OSError as error:
        logger.warning("Video cleanup scan failed (%s)", type(error).__name__)


def _rate_limit_upload():
    now = time.monotonic()
    cutoff = now - config.VIDEO_UPLOAD_RATE_WINDOW_SECONDS
    address = request.remote_addr or "unknown"

    with state.VIDEO_UPLOAD_LOCK:
        if len(state.VIDEO_UPLOAD_ATTEMPTS) > 1000:
            state.VIDEO_UPLOAD_ATTEMPTS = {
                client: values
                for client, values in state.VIDEO_UPLOAD_ATTEMPTS.items()
                if any(timestamp > cutoff for timestamp in values)
            }
        attempts = [
            timestamp
            for timestamp in state.VIDEO_UPLOAD_ATTEMPTS.get(address, [])
            if timestamp > cutoff
        ]
        if len(attempts) >= config.VIDEO_UPLOAD_RATE_LIMIT:
            state.VIDEO_UPLOAD_ATTEMPTS[address] = attempts
            return False

        attempts.append(now)
        state.VIDEO_UPLOAD_ATTEMPTS[address] = attempts
        return True


def _matches_video_container(path, extension):
    with open(path, "rb") as file:
        header = file.read(4096)

    if extension in {"mp4", "mov", "m4v"}:
        return len(header) >= 12 and header[4:8] == b"ftyp"
    if extension == "avi":
        return len(header) >= 12 and header[:4] == b"RIFF" and header[8:12] == b"AVI "
    if extension in {"webm", "mkv"}:
        if not header.startswith(b"\x1a\x45\xdf\xa3"):
            return False
        doc_type = b"webm" if extension == "webm" else b"matroska"
        return doc_type in header.lower()
    return False


def _validate_video_file(path, extension):
    if not _matches_video_container(path, extension):
        return "The uploaded file does not match its video format."

    capture = cv2.VideoCapture(path)
    try:
        if not capture.isOpened():
            return "The uploaded video is invalid or uses an unsupported codec."

        ok, _frame = capture.read()
        if not ok:
            return "The uploaded video contains no readable frames."

        fps = capture.get(cv2.CAP_PROP_FPS) or 0
        frame_count = capture.get(cv2.CAP_PROP_FRAME_COUNT) or 0
        if fps > 0 and frame_count > 0:
            duration = frame_count / fps
            if duration > config.MAX_VIDEO_DURATION_SECONDS:
                return (
                    "Video duration exceeds the "
                    f"{config.MAX_VIDEO_DURATION_SECONDS // 60}-minute limit."
                )
    finally:
        capture.release()

    return None


# ============================================================
# HELPERS
# ============================================================

def public_video_job(job):
    """Strip internal fields (filesystem path) before responding."""

    return {
        key: value
        for key, value in job.items()
        if key not in {"path", "lock"}
    }


def merge_video_samples(samples, threshold):
    """Collapse per-frame samples into segments of consecutive labels."""

    segments = []

    for sample in samples:

        current = segments[-1] if segments else None

        if current and current["label"] == sample["label"]:

            current["end"] = sample["timestamp"]

            if sample["confidence"] > current["confidence"]:
                current["confidence"] = sample["confidence"]
                current["confidence_percent"] = sample["confidence_percent"]

            current["samples"] += 1

        else:
            segments.append({
                "label": sample["label"],
                "start": sample["timestamp"],
                "end": sample["timestamp"],
                "confidence": sample["confidence"],
                "confidence_percent": sample["confidence_percent"],
                "samples": 1,
            })

    for segment in segments:
        segment["uncertain"] = segment["confidence"] < threshold

    return segments


# ============================================================
# WORKER
# ============================================================

def process_video_job(job_id, video_path, threshold):

    with state.VIDEO_LOCK:
        job = state.VIDEO_JOBS.get(job_id)

    if job is None:
        state.VIDEO_SLOTS.release()
        _remove_file(video_path)
        return

    capture = None

    try:
        job["status"] = "processing"
        job["started_at"] = time.time()

        capture = cv2.VideoCapture(video_path)

        if not capture.isOpened():
            raise ValueError(
                "Unable to open the uploaded video. The file may be "
                "corrupted or use an unsupported codec."
            )

        fps = capture.get(cv2.CAP_PROP_FPS) or 25.0

        if fps <= 0:
            fps = 25.0

        total_frames = int(capture.get(cv2.CAP_PROP_FRAME_COUNT) or 0)

        job["duration_seconds"] = (
            round(total_frames / fps, 2) if total_frames else None
        )
        if (
            job["duration_seconds"] is not None
            and job["duration_seconds"] > config.MAX_VIDEO_DURATION_SECONDS
        ):
            raise ValueError(
                "Video duration exceeds the "
                f"{config.MAX_VIDEO_DURATION_SECONDS // 60}-minute limit."
            )

        step = max(int(round(fps)), 1)  # one sample per second

        samples = []
        index = 0

        while True:

            ok, frame = capture.read()

            if not ok:
                break

            if index / fps >= config.MAX_VIDEO_DURATION_SECONDS:
                raise ValueError(
                    "Video duration exceeds the "
                    f"{config.MAX_VIDEO_DURATION_SECONDS // 60}-minute limit."
                )

            if index % step == 0:

                response, status_code = inference.process_prediction(
                    frame,
                    source="video",
                    save=False,
                    verbose=False,
                )

                if status_code == 200 and response.get("success"):
                    samples.append({
                        "label": response["label"],
                        "confidence": response["confidence"],
                        "confidence_percent": response["confidence_percent"],
                        "timestamp": round(index / fps, 2),
                    })

                if total_frames:
                    job["progress"] = min(
                        95,
                        round((index / total_frames) * 100, 1),
                    )

            index += 1

        segments = merge_video_samples(samples, threshold)

        job["sampled_frames"] = index
        job["recognized_frames"] = len(samples)
        job["segments"] = segments
        raw_transcript = " ".join(s["label"] for s in segments)
        job["transcript"] = raw_transcript
        job["uncertain_segments"] = sum(1 for s in segments if s["uncertain"])

        try:
            from ..services import groq_service
            refine_res = groq_service.refine_sentence(raw_transcript)
            job["refined_sentence"] = refine_res.get("refined_sentence") or raw_transcript
            job["ai_refined"] = refine_res.get("ai_generated", False)
        except Exception as groq_err:
            logger.warning(
                "Video sentence refinement failed (%s)",
                type(groq_err).__name__,
            )
            job["refined_sentence"] = raw_transcript
            job["ai_refined"] = False

        job["status"] = "completed"
        job["progress"] = 100
        job["completed_at"] = time.time()

    except Exception as error:
        if isinstance(error, ValueError):
            job["error"] = str(error)
        else:
            logger.error("Video processing failed (%s)", type(error).__name__)
            job["error"] = "Video processing failed."
        job["status"] = "failed"

    finally:
        job["updated_at"] = time.time()

        try:
            if capture is not None:
                capture.release()
        finally:
            _remove_file(video_path)
            state.VIDEO_SLOTS.release()


# ============================================================
# POST /api/v1/videos/upload
# ============================================================

@video_bp.route("/upload", methods=["POST"])
def upload():

    _cleanup_expired_jobs()
    if not _rate_limit_upload():
        return jsonify({
            "success": False,
            "message": "Too many video uploads. Try again later.",
        }), 429

    uploaded_file = request.files.get("video") or request.files.get("file")

    if uploaded_file is None:
        return jsonify({
            "success": False,
            "message": "No video uploaded. Use field name 'video'.",
        }), 400

    original_filename = (uploaded_file.filename or "video.mp4").replace("\\", "/")
    filename = secure_filename(original_filename.rsplit("/", 1)[-1])

    extension = (
        original_filename.rsplit(".", 1)[-1].lower()
        if "." in original_filename
        else ""
    )

    if extension not in config.ALLOWED_VIDEO_EXTENSIONS:
        return jsonify({
            "success": False,
            "message": "Unsupported video format. Use MP4, WebM, MOV, M4V, AVI or MKV.",
        }), 415

    if not state.VIDEO_SLOTS.acquire(blocking=False):
        return jsonify({
            "success": False,
            "message": "Video processing capacity is full. Try again later.",
        }), 429

    temporary_path = None
    video_path = None
    job_id = None
    slot_owned_by_worker = False
    try:
        os.makedirs(config.VIDEO_DIR, exist_ok=True)

        descriptor, temporary_path = tempfile.mkstemp(
            prefix=".video-upload-",
            suffix=".tmp",
            dir=config.VIDEO_DIR,
        )
        size_bytes = 0
        with os.fdopen(descriptor, "wb") as target:
            while True:
                chunk = uploaded_file.stream.read(1024 * 1024)
                if not chunk:
                    break
                size_bytes += len(chunk)
                if size_bytes > config.MAX_VIDEO_UPLOAD_BYTES:
                    return jsonify({
                        "success": False,
                        "message": "Video exceeds the 150 MB limit.",
                    }), 413
                target.write(chunk)

        if size_bytes == 0:
            return jsonify({
                "success": False,
                "message": "The uploaded video is empty.",
            }), 400

        validation_error = _validate_video_file(temporary_path, extension)
        if validation_error:
            return jsonify({
                "success": False,
                "message": validation_error,
            }), 415

        try:
            threshold = float(request.form.get("threshold", 0.5))
        except (TypeError, ValueError):
            threshold = 0.5

        threshold = min(1.0, max(0.0, threshold))

        job_id = uuid.uuid4().hex
        video_path = os.path.join(
            config.VIDEO_DIR,
            f"signai-{job_id}.{extension}",
        )
        os.replace(temporary_path, video_path)
        temporary_path = None

        job = {
            "id": job_id,
            "filename": filename or f"video.{extension}",
            "size_bytes": size_bytes,
            "status": "queued",
            "progress": 0,
            "threshold": threshold,
            "segments": [],
            "transcript": "",
            "model_version": config.MODEL_VERSION,
            "created_at": time.time(),
            "updated_at": time.time(),
            "path": video_path,
        }

        with state.VIDEO_LOCK:
            state.VIDEO_JOBS[job_id] = job

        worker = threading.Thread(
            target=process_video_job,
            args=(job_id, video_path, threshold),
            daemon=True,
        )
        worker.start()
        slot_owned_by_worker = True

        return jsonify({
            "success": True,
            "job_id": job_id,
            "job": public_video_job(job),
            "status_endpoint": f"/api/v1/videos/{job_id}/status",
            "transcript_endpoint": f"/api/v1/videos/{job_id}/transcript",
        }), 202

    except Exception as error:
        if job_id:
            with state.VIDEO_LOCK:
                state.VIDEO_JOBS.pop(job_id, None)
        logger.error("Video upload failed (%s)", type(error).__name__)
        return jsonify({
            "success": False,
            "message": "Video upload failed.",
        }), 500
    finally:
        _remove_file(temporary_path)
        if not slot_owned_by_worker:
            _remove_file(video_path)
            state.VIDEO_SLOTS.release()


# ============================================================
# GET /api/v1/videos/<job_id>/status
# ============================================================

@video_bp.route("/<job_id>/status", methods=["GET"])
def status(job_id):

    _cleanup_expired_jobs()
    with state.VIDEO_LOCK:
        job = state.VIDEO_JOBS.get(job_id)
        public_job = public_video_job(job) if job else None

    if public_job is None:
        return jsonify({"success": False, "message": "Video job not found."}), 404

    return jsonify({"success": True, "job": public_job})


# ============================================================
# GET /api/v1/videos/<job_id>/transcript
# ============================================================

@video_bp.route("/<job_id>/transcript", methods=["GET"])
def transcript(job_id):

    _cleanup_expired_jobs()
    with state.VIDEO_LOCK:
        job = state.VIDEO_JOBS.get(job_id)
        job = dict(job) if job else None

    if job is None:
        return jsonify({"success": False, "message": "Video job not found."}), 404

    if job.get("status") != "completed":
        return jsonify({
            "success": False,
            "message": "Transcript is not ready yet.",
            "status": job.get("status"),
            "progress": job.get("progress", 0),
        }), 409

    return jsonify({
        "success": True,
        "job_id": job_id,
        "transcript": job.get("transcript", ""),
        "segments": job.get("segments", []),
        "model_version": config.MODEL_VERSION,
    })