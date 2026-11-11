import { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedNumber from "../components/ui/AnimatedNumber";
import { useToast } from "../components/ui/ToastProvider";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ImageRecognition = () => {
  const fileInputRef = useRef(null);
  const toast = useToast();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [prediction, setPrediction] = useState(null);

  const speakPrediction = useCallback((label, confidence) => {
    if (!("speechSynthesis" in window) || !label) return;
    try {
      window.speechSynthesis.cancel();
      const text = `Predicted sign is letter ${label}, with ${confidence} percent confidence.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      /* ignore */
    }
  }, []);

  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image file exceeds 10 MB limit.");
      return;
    }

    setError("");
    setPrediction(null);
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const runPrediction = async () => {
    if (!imageFile) {
      setError("Please select or drop an image first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(`${API_URL}/api/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Prediction request failed.");
      }

      const predictedLabel = (data.label || data.predicted_label || data.prediction || "UNKNOWN").toUpperCase();
      const conf = Number(data.confidence_percent || 0);

      const normalizedResult = {
        label: predictedLabel,
        confidence_percent: conf,
        sign_accuracy_percent: data.sign_accuracy_percent ?? null,
        support: data.support ?? null,
        processing_time_ms: data.processing_time_ms ?? null,
        model: data.model || "Random Forest Classifier",
        top_predictions: Array.isArray(data.top_predictions)
          ? data.top_predictions
          : [{ label: predictedLabel, confidence_percent: conf }],
      };

      setPrediction(normalizedResult);
      toast.success(`Detected letter ${predictedLabel} at ${Math.round(conf)}% confidence.`, "Detection complete");
      speakPrediction(predictedLabel, Math.round(conf));
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || "Failed to analyze the image.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setPrediction(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyResult = async () => {
    if (!prediction) return;
    const text = `SignAI Prediction Result:\nSign: Letter ${prediction.label}\nConfidence: ${prediction.confidence_percent}%\nProcessing Time: ${prediction.processing_time_ms}ms\nModel: ${prediction.model}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Result copied to the clipboard.", "Copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Clipboard access was blocked by the browser.");
    }
  };

  return (
    <>
      <div className="stack" style={{ gap: "var(--space-6)" }}>
        <div className="page-head">
          <div>
            <span className="eyebrow">Image pipeline</span>
            <h1 className="mt-2">Image detection</h1>
            <p style={{ maxWidth: "62ch" }}>
              Upload a sign language photo. SignAI extracts hand landmarks and
              predicts the ASL/ISL alphabet letter with a full probability spread.
            </p>
          </div>

          {prediction && (
            <button onClick={handleReset} className="btn btn-ghost">
              Upload new image
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-err">
            <b>Could not analyze the image</b>
            {error}
          </div>
        )}

        <div className="grid grid-2" style={{ alignItems: "start" }}>
          <div className="stack">
            <AnimatePresence mode="wait">
              {!imagePreview ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click();
                  }}
                  role="button"
                  tabIndex={0}
                  className={`drop${isDragging ? " over" : ""}`}
                  style={{ minHeight: "360px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                    onClick={(event) => event.stopPropagation()}
                    className="sr-only"
                  />

                  <motion.span
                    className="drop-mark"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    A
                  </motion.span>

                  <h3 className="mt-4">Drop your sign image here</h3>
                  <p className="hint" style={{ maxWidth: "38ch" }}>
                    or <span className="text-primary fw-semibold">browse files</span>. JPEG, PNG or WEBP up to 10 MB, with the hand clearly visible.
                  </p>

                  <div className="row mt-4" style={{ justifyContent: "center", gap: "var(--space-2)" }}>
                    {["JPG", "PNG", "WEBP"].map((type) => (
                      <span key={type} className="badge badge-info">{type}</span>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  className="card"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="camera" style={{ borderColor: "var(--line)" }}>
                    <img src={imagePreview} alt="Uploaded gesture preview" style={{ objectFit: "contain" }} />
                    {loading && <span className="badge badge-pri live">Analyzing</span>}
                  </div>

                  <div className="row row-between mt-4">
                    <div className="text-xs text-muted" style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {imageFile?.name} · {(imageFile?.size / 1024).toFixed(0)} KB
                    </div>
                    <div className="row">
                      <button onClick={runPrediction} disabled={loading} className="btn btn-primary">
                        {loading ? "Analyzing image..." : "Run sign prediction"}
                      </button>
                      <button onClick={handleReset} disabled={loading} className="btn btn-ghost btn-sm">
                        Reset
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="card card-flat">
              <h3 style={{ marginBottom: "var(--space-2)" }}>How it works</h3>
              <ol className="stepper">
                <li className="done">Upload photo</li>
                <li className="now">Extract landmarks</li>
                <li>Predict letter</li>
              </ol>
            </div>
          </div>

          <div className="stack">
            <AnimatePresence mode="wait">
              {prediction ? (
                <motion.div
                  key="result"
                  className="stack"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="caption caption-now spotlight" style={{ position: "relative", overflow: "hidden" }}>
                    <div className="row row-between">
                      <span className="badge badge-ok badge-dot">Detection complete</span>

                      <div className="row" style={{ gap: "var(--space-2)" }}>
                        <button
                          onClick={() => speakPrediction(prediction.label, Math.round(prediction.confidence_percent))}
                          className="btn btn-ghost btn-sm"
                          title="Speak sign name"
                        >
                          Speak
                        </button>
                        <button onClick={copyResult} className="btn btn-ghost btn-sm" title="Copy results">
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div className="row mt-4" style={{ alignItems: "flex-end", gap: "var(--space-5)" }}>
                      <motion.div
                        className="stat-value gradient-text"
                        style={{ fontSize: "5rem", lineHeight: 0.95, marginTop: 0 }}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      >
                        {prediction.label}
                      </motion.div>

                      <div>
                        <p className="stat-label">Predicted sign</p>
                        <h2 className="mt-1">Letter {prediction.label}</h2>
                        <p className="text-sm text-ok fw-semibold">
                          <AnimatedNumber value={prediction.confidence_percent} decimals={1} suffix="% confidence" />
                        </p>
                      </div>
                    </div>

                    <div className="meter high">
                      <i style={{ width: `${Math.min(100, Math.max(0, prediction.confidence_percent || 0))}%` }} />
                    </div>
                    <p className="hint">Confidence {prediction.confidence_percent} percent</p>
                  </div>

                  <div className="card">
                    <div className="section-head" style={{ marginBottom: 0 }}>
                      <div>
                        <h3 style={{ marginBottom: 0 }}>Top-5 probability distribution</h3>
                        <p>Confidence across candidate classes</p>
                      </div>
                    </div>

                    <div className="table-wrap mt-4">
                      <table>
                        <thead>
                          <tr>
                            <th>Letter</th>
                            <th>Confidence</th>
                            <th style={{ width: "45%" }}>Distribution</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prediction.top_predictions.map((item, idx) => (
                            <tr key={`${item.label}-${idx}`}>
                              <td><span className="badge badge-pri">{item.label}</span></td>
                              <td className="fw-semibold">{Math.round(item.confidence_percent || 0)}%</td>
                              <td>
                                <div className="meter" style={{ marginTop: 0 }}>
                                  <i style={{ width: `${Math.min(100, item.confidence_percent || 0)}%` }} />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid grid-2">
                    <div className="card">
                      <span className="stat-label">Processing time</span>
                      <div className="stat-value">
                        {prediction.processing_time_ms ?? "—"} <span className="unit">ms</span>
                      </div>
                    </div>
                    <div className="card">
                      <span className="stat-label">Classifier</span>
                      <div className="stat-value" style={{ fontSize: "var(--fs-lg)" }}>Random Forest</div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ minHeight: 280, display: "grid", placeContent: "center" }}
                >
                  <h3>Awaiting image input</h3>
                  <p className="hint">Upload an image to extract hand landmarks and view the probability distribution.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageRecognition;
