import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedNumber from "../components/ui/AnimatedNumber";
import { useToast } from "../components/ui/ToastProvider";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatTime = (seconds) => {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
};

const VideoTranslation = () => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const toast = useToast();

  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [threshold, setThreshold] = useState(0.4);
  const [jobId, setJobId] = useState("");
  const [job, setJob] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [uncertainOnly, setUncertainOnly] = useState(false);

  useEffect(() => {
    if (!jobId) return undefined;

    let active = true;
    let timer;

    const tick = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/videos/${jobId}/status`);
        const data = await response.json();

        if (!active) return;

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to read job status.");
        }

        setJob(data.job);

        if (["completed", "failed"].includes(data.job.status)) {
          clearInterval(timer);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to read job status.");
          clearInterval(timer);
        }
      }
    };

    tick();
    timer = setInterval(tick, 1500);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [jobId]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const acceptFile = (file) => {
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const allowed = ["mp4", "webm", "mov", "m4v", "avi", "mkv"];

    if (!file.type.startsWith("video/") && !allowed.includes(extension)) {
      setError("Please choose a video file (MP4, WebM or MOV).");
      return;
    }

    if (file.size > 150 * 1024 * 1024) {
      setError("Video exceeds the 150 MB limit.");
      return;
    }

    setError("");
    setJob(null);
    setJobId("");

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setVideoFile(null);
    setPreviewUrl("");
    setJob(null);
    setJobId("");
    setError("");
  };

  const uploadVideo = async () => {
    if (!videoFile) {
      setError("Choose a video before starting translation.");
      return;
    }

    setUploading(true);
    setError("");
    setJob(null);

    try {
      const form = new FormData();
      form.append("video", videoFile);
      form.append("threshold", String(threshold));

      const response = await fetch(`${API_URL}/api/v1/videos/upload`, {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Video upload failed.");
      }

      setJob(data.job);
      setJobId(data.job_id);
      toast.info("Translation started. This panel refreshes automatically.", "Processing video");
    } catch (err) {
      setError(err.message || "Video upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const seekTo = (seconds) => {
    const player = videoRef.current;
    if (!player) return;
    player.currentTime = Number(seconds) || 0;
    player.play?.();
  };

  const speakText = (text) => {
    if (!text || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } catch {
      /* ignore */
    }
  };

  const copyTranscript = async () => {
    if (!job?.transcript) return;
    try {
      const textToCopy = job.refined_sentence
        ? `${job.refined_sentence}\n\n(Recognized signs: ${job.transcript})`
        : job.transcript;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success("Transcript copied.", "Copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Clipboard access was blocked by the browser.");
    }
  };

  const downloadTranscript = () => {
    if (!job?.transcript) return;
    const blob = new Blob(
      [
        `SignBridge AI — Video Translation\n`,
        `File: ${job.filename}\n`,
        `Model: ${job.model_version || "random-forest"}\n\n`,
        `--- AI Sentence (Groq) ---\n`,
        job.refined_sentence || job.transcript,
        `\n\n--- Raw Recognized Signs (Deep Learning) ---\n`,
        job.transcript,
        "\n",
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `signbridge-transcript-${job.id}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Transcript downloaded.", "Saved");
  };

  const segments = job?.segments || [];
  const visibleSegments = uncertainOnly ? segments.filter((segment) => segment.uncertain) : segments;
  const isProcessing = job && ["queued", "processing"].includes(job.status);

  return (
    <>
      <div className="stack" style={{ gap: "var(--space-6)" }}>
        <div className="page-head">
          <div>
            <span className="eyebrow">Batch pipeline</span>
            <h1 className="mt-2">Video translation</h1>
            <p style={{ maxWidth: "64ch" }}>
              Upload a recorded sign-language video. SignBridge samples one frame
              per second, recognises each sign and returns a timestamped transcript.
            </p>
          </div>

          {job && (
            <button type="button" className="btn btn-ghost" onClick={reset}>
              New video
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-err">
            <b>Video translation could not continue</b>
            {error}
          </div>
        )}

        <div className="grid grid-2" style={{ alignItems: "start" }}>
          <div className="stack">
            <AnimatePresence mode="wait">
              {!previewUrl ? (
                <motion.div
                  key="drop"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`drop${dragging ? " over" : ""}`}
                  style={{ minHeight: "360px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click();
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-m4v,.mp4,.webm,.mov,.m4v,.avi,.mkv"
                    className="sr-only"
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => acceptFile(event.target.files?.[0])}
                  />

                  <motion.span
                    className="drop-mark"
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    V
                  </motion.span>

                  <h3 className="mt-4">Drop a sign-language video here</h3>
                  <p className="hint" style={{ maxWidth: "40ch" }}>
                    or <span className="text-primary fw-semibold">browse files</span>. MP4, WebM, MOV, M4V, AVI or MKV up to 150 MB.
                  </p>

                  <div className="row mt-4" style={{ justifyContent: "center", gap: "var(--space-2)" }}>
                    {["MP4", "WEBM", "MOV"].map((type) => (
                      <span key={type} className="badge badge-info">{type}</span>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  className="card stack"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div style={{ background: "#0f0d1e", borderRadius: "var(--r-m)", overflow: "hidden" }}>
                    <video ref={videoRef} src={previewUrl} controls playsInline style={{ width: "100%", display: "block" }} />
                  </div>

                  <div className="row row-between">
                    <div style={{ minWidth: 0 }}>
                      <p className="fw-semibold" style={{ wordBreak: "break-word" }}>{videoFile?.name}</p>
                      <p className="hint">
                        {(videoFile?.size / (1024 * 1024)).toFixed(1)} MB
                        {job?.duration_seconds ? ` · ${formatTime(job.duration_seconds)} duration` : ""}
                      </p>
                    </div>
                    <span className={`badge ${job?.status === "completed" ? "badge-ok" : job?.status === "failed" ? "badge-err" : isProcessing ? "badge-info" : "badge-pri"}`}>
                      {job?.status || "Ready"}
                    </span>
                  </div>

                  <div className="field" style={{ marginBottom: 0 }}>
                    <label className="label" htmlFor="video-threshold">Uncertainty threshold</label>
                    <select
                      id="video-threshold"
                      className="input"
                      value={threshold}
                      disabled={uploading || isProcessing}
                      onChange={(event) => setThreshold(Number(event.target.value))}
                    >
                      <option value={0.3}>30% — accept more signs</option>
                      <option value={0.4}>40% — balanced</option>
                      <option value={0.5}>50% — stricter</option>
                      <option value={0.6}>60% — very strict</option>
                    </select>
                    <p className="hint">
                      Segments below this confidence are marked uncertain rather than presented as confirmed translations.
                    </p>
                  </div>

                  <div className="row">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={uploadVideo}
                      disabled={uploading || isProcessing || !videoFile}
                    >
                      {uploading ? "Uploading…" : isProcessing ? "Translating…" : "Translate video"}
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={reset} disabled={uploading || isProcessing}>
                      Reset
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="stack">
            <AnimatePresence mode="wait">
              {!job ? (
                <motion.div
                  key="empty"
                  className="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ minHeight: 280, display: "grid", placeContent: "center" }}
                >
                  <h3>Awaiting a video</h3>
                  <p className="hint">Upload footage to see upload state, processing progress and a timestamped transcript here.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="job"
                  className="stack"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="card spotlight">
                    <div className="row row-between">
                      <div>
                        <span className="stat-label">Job status</span>
                        <h3 style={{ marginBottom: 0, textTransform: "capitalize" }}>{job.status}</h3>
                      </div>
                      <span className={`badge badge-dot ${job.status === "completed" ? "badge-ok" : job.status === "failed" ? "badge-err" : "badge-info"}`}>
                        {job.progress || 0}% complete
                      </span>
                    </div>

                    <div className="progress mt-4">
                      <motion.i
                        initial={{ width: 0 }}
                        animate={{ width: `${job.progress || 0}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>

                    <div className="grid grid-3 mt-4">
                      {[
                        ["Sampled", job.sampled_frames],
                        ["Recognised", job.recognized_frames],
                        ["Uncertain", job.uncertain_segments],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <span className="stat-label">{label}</span>
                          <div className="stat-value" style={{ fontSize: "var(--fs-xl)" }}>
                            {typeof value === "number" ? <AnimatedNumber value={value} /> : "—"}
                          </div>
                        </div>
                      ))}
                    </div>

                    {job.status === "failed" && (
                      <div className="alert alert-err mt-4" style={{ marginBottom: 0 }}>
                        <b>Processing failed</b>
                        {job.error || "The video could not be processed."}
                      </div>
                    )}

                    {isProcessing && (
                      <p className="hint mt-4" style={{ marginBottom: 0 }}>
                        Processing runs in the background. This panel refreshes automatically.
                      </p>
                    )}
                  </div>

                  {job.status === "completed" && (
                    <>
                      <div className="caption caption-now">
                        <div className="row row-between">
                          <div className="row" style={{ gap: "var(--space-2)" }}>
                            <span className="badge badge-ok badge-dot">Transcript ready</span>
                            {job.ai_refined && <span className="badge badge-pri">Groq AI Refined</span>}
                          </div>
                          <div className="row" style={{ gap: "var(--space-2)" }}>
                            {job.refined_sentence && (
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => speakText(job.refined_sentence)}
                              >
                                🔊 Speak
                              </button>
                            )}
                            <button type="button" className="btn btn-ghost btn-sm" onClick={copyTranscript} disabled={!job.transcript}>
                              {copied ? "Copied" : "Copy"}
                            </button>
                            <button type="button" className="btn btn-ghost btn-sm" onClick={downloadTranscript} disabled={!job.transcript}>
                              Download
                            </button>
                          </div>
                        </div>

                        {job.refined_sentence && (
                          <div style={{ marginTop: "var(--space-3)" }}>
                            <span className="hint" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                              AI Formed Sentence:
                            </span>
                            <div className="caption-text mt-1" style={{ fontSize: "1.25rem", color: "var(--ink)" }}>
                              {job.refined_sentence}
                            </div>
                          </div>
                        )}

                        <div style={{ marginTop: job.refined_sentence ? "var(--space-3)" : "var(--space-4)" }}>
                          <span className="hint" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Raw Signs Detected:
                          </span>
                          <div className="text-sm mt-1" style={{ color: "var(--ink-soft)", fontFamily: "monospace" }}>
                            {job.transcript || "No signs were recognised."}
                          </div>
                        </div>

                        <p className="hint mt-3">
                          {segments.length} segment{segments.length === 1 ? "" : "s"} · model {job.model_version || "random-forest"}
                        </p>
                      </div>

                      <div className="card">
                        <div className="row row-between">
                          <div>
                            <h3 style={{ marginBottom: 0 }}>Timestamped segments</h3>
                            <p className="hint" style={{ marginTop: "4px" }}>Click a timestamp to jump to that part of the video.</p>
                          </div>

                          <label className="toggle">
                            <input type="checkbox" checked={uncertainOnly} onChange={(event) => setUncertainOnly(event.target.checked)} />
                            <span className="track" aria-hidden="true" />
                            <span className="text-sm">Uncertain only</span>
                          </label>
                        </div>

                        <div className="stack mt-4" style={{ gap: "var(--space-2)" }}>
                          {visibleSegments.length ? (
                            visibleSegments.map((segment, index) => (
                              <motion.button
                                key={`${segment.start}-${segment.label}-${index}`}
                                type="button"
                                className="card card-flat"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: Math.min(index * 0.03, 0.4) }}
                                style={{ textAlign: "left", cursor: "pointer", border: "1px solid var(--line)" }}
                                onClick={() => seekTo(segment.start)}
                              >
                                <div className="row row-between">
                                  <div className="row" style={{ gap: "var(--space-3)" }}>
                                    <span className="mono text-sm text-muted">{formatTime(segment.start)}</span>
                                    <span className="fw-bold" style={{ fontSize: "var(--fs-lg)" }}>{segment.label}</span>
                                  </div>
                                  <div className="row" style={{ gap: "var(--space-2)" }}>
                                    {segment.uncertain && <span className="badge badge-warn">Uncertain</span>}
                                    <span className="text-sm text-muted">{Math.round(segment.confidence_percent || 0)}%</span>
                                  </div>
                                </div>
                                <div className={`meter ${segment.confidence_percent >= 60 ? "high" : "low"}`} style={{ marginTop: "var(--space-2)" }}>
                                  <i style={{ width: `${Math.min(100, Math.max(0, segment.confidence_percent || 0))}%` }} />
                                </div>
                              </motion.button>
                            ))
                          ) : (
                            <div className="empty">
                              <p className="text-sm text-muted">No segments match the current filter.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoTranslation;
