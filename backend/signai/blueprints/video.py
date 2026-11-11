"""
Video translation endpoints.

Serves /video-translation -> /api/v1/videos/*

A background thread walks the video, samples one frame per second,
classifies each, and merges consecutive identical labels into segments.
"""

import os
import threading
import time
import uuid

import cv2

from flask import Blueprint, jsonify, request

from .. import config, state
from ..services import inference

video_bp = Blueprint("video", __name__, url_prefix="/api/v1/videos")


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

    job = state.VIDEO_JOBS.get(job_id)

    if job is None:
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

        step = max(int(round(fps)), 1)  # one sample per second

        samples = []
        index = 0

        while True:

            ok, frame = capture.read()

            if not ok:
                break

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
            print("Video groq refinement notice:", groq_err)
            job["refined_sentence"] = raw_transcript
            job["ai_refined"] = False

        job["status"] = "completed"
        job["progress"] = 100
        job["completed_at"] = time.time()

    except Exception as error:
        print("Video job error:", error)
        job["status"] = "failed"
        job["error"] = str(error)

    finally:
        job["updated_at"] = time.time()

        if capture is not None:
            try:
                capture.release()
            except Exception:
                pass


# ============================================================
# POST /api/v1/videos/upload
# ============================================================

@video_bp.route("/upload", methods=["POST"])
def upload():

    uploaded_file = request.files.get("video") or request.files.get("file")

    if uploaded_file is None:
        return jsonify({
            "success": False,
            "message": "No video uploaded. Use field name 'video'.",
        }), 400

    filename = uploaded_file.filename or "video.mp4"

    extension = (
        filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    )

    if extension not in config.ALLOWED_VIDEO_EXTENSIONS:
        return jsonify({
            "success": False,
            "message": "Unsupported video format. Use MP4, WebM, MOV, M4V, AVI or MKV.",
        }), 415

    try:
        os.makedirs(config.VIDEO_DIR, exist_ok=True)

        job_id = uuid.uuid4().hex
        video_path = os.path.join(config.VIDEO_DIR, f"{job_id}.{extension}")

        uploaded_file.save(video_path)

        size_bytes = os.path.getsize(video_path)

        if size_bytes > config.MAX_CONTENT_LENGTH:
            os.remove(video_path)
            return jsonify({
                "success": False,
                "message": "Video exceeds the 150 MB limit.",
            }), 413

        try:
            threshold = float(request.form.get("threshold", 0.5))
        except (TypeError, ValueError):
            threshold = 0.5

        threshold = min(1.0, max(0.0, threshold))

        job = {
            "id": job_id,
            "filename": filename,
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

        return jsonify({
            "success": True,
            "job_id": job_id,
            "job": public_video_job(job),
            "status_endpoint": f"/api/v1/videos/{job_id}/status",
            "transcript_endpoint": f"/api/v1/videos/{job_id}/transcript",
        }), 202

    except Exception as error:
        print("Video upload error:", error)
        return jsonify({
            "success": False,
            "message": "Video upload failed.",
            "error": str(error),
        }), 500


# ============================================================
# GET /api/v1/videos/<job_id>/status
# ============================================================

@video_bp.route("/<job_id>/status", methods=["GET"])
def status(job_id):

    job = state.VIDEO_JOBS.get(job_id)

    if job is None:
        return jsonify({"success": False, "message": "Video job not found."}), 404

    return jsonify({"success": True, "job": public_video_job(job)})


# ============================================================
# GET /api/v1/videos/<job_id>/transcript
# ============================================================

@video_bp.route("/<job_id>/transcript", methods=["GET"])
def transcript(job_id):

    job = state.VIDEO_JOBS.get(job_id)

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