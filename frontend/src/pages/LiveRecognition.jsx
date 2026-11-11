import { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";
import AnimatedNumber from "../components/ui/AnimatedNumber";
import { useToast } from "../components/ui/ToastProvider";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LiveRecognition = () => {
  const webcamRef = useRef(null);
  const predictionLoopRef = useRef(null);
  const isProcessingRef = useRef(false);
  const toast = useToast();

  const [isRunning, setIsRunning] = useState(false);
  const [currentLabel, setCurrentLabel] = useState("—");
  const [confidence, setConfidence] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [fps, setFps] = useState(0);
  const [error, setError] = useState("");
  const [topPredictions, setTopPredictions] = useState([]);

  const predictionWindowRef = useRef([]);
  const fpsCountRef = useRef(0);
  const fpsTimeRef = useRef(0);

  const [sentence, setSentence] = useState("");
  const [copied, setCopied] = useState(false);
  const [aiSentence, setAiSentence] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [aiCopied, setAiCopied] = useState(false);
  const [aiNotice, setAiNotice] = useState("");
  const [holdProgress, setHoldProgress] = useState(0);
  const holdStartTimeRef = useRef(null);
  const lastAppendedCharRef = useRef("");
  const lastAppendTimeRef = useRef(0);

  const [autoTTS, setAutoTTS] = useState(
    () => localStorage.getItem("signai-auto-tts") === "true"
  );
  const [autoAppend, setAutoAppend] = useState(true);
  const [minConfidenceThreshold, setMinConfidenceThreshold] = useState(
    () => Number(localStorage.getItem("signai-conf-threshold")) || 65
  );
  const [holdDurationMs, setHoldDurationMs] = useState(
    () => Number(localStorage.getItem("signai-hold-duration")) || 1200
  );
  const [showSettings, setShowSettings] = useState(false);
  const [history, setHistory] = useState([]);

  const speakText = useCallback((text) => {
    if (!text || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Number(localStorage.getItem("signai-tts-rate")) || 1.0;
      utterance.pitch = Number(localStorage.getItem("signai-tts-pitch")) || 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS Error:", e);
    }
  }, []);

  const computeSmoothedPrediction = useCallback((rawLabel, rawConfidence) => {
    const windowSize = 5;
    const windowList = predictionWindowRef.current;

    windowList.push({ label: rawLabel, confidence: rawConfidence });
    if (windowList.length > windowSize) windowList.shift();

    const counts = {};
    const totalConf = {};

    for (const item of windowList) {
      if (item.label === "—" || item.label === "NO HAND") continue;
      counts[item.label] = (counts[item.label] || 0) + 1;
      totalConf[item.label] = (totalConf[item.label] || 0) + item.confidence;
    }

    let dominantLabel = rawLabel;
    let maxCount = 0;
    for (const label in counts) {
      if (counts[label] > maxCount) {
        maxCount = counts[label];
        dominantLabel = label;
      }
    }

    if (maxCount >= 3) {
      return { label: dominantLabel, confidence: totalConf[dominantLabel] / maxCount };
    }
    return { label: rawLabel, confidence: rawConfidence };
  }, []);

  const handleHoldAndAppend = useCallback(
    (detectedLabel, detectedConfidence) => {
      if (!autoAppend || detectedLabel === "—" || detectedConfidence < minConfidenceThreshold) {
        holdStartTimeRef.current = null;
        setHoldProgress(0);
        return;
      }

      const now = performance.now();

      if (lastAppendedCharRef.current === detectedLabel && now - lastAppendTimeRef.current < 2000) {
        setHoldProgress(0);
        return;
      }

      if (!holdStartTimeRef.current) holdStartTimeRef.current = now;

      const elapsed = now - holdStartTimeRef.current;
      const progress = Math.min(100, (elapsed / holdDurationMs) * 100);
      setHoldProgress(progress);

      if (elapsed >= holdDurationMs) {
        setSentence((prev) => prev + detectedLabel);
        lastAppendedCharRef.current = detectedLabel;
        lastAppendTimeRef.current = now;
        holdStartTimeRef.current = null;
        setHoldProgress(0);
        if (autoTTS) speakText(detectedLabel);
      }
    },
    [autoAppend, minConfidenceThreshold, holdDurationMs, autoTTS, speakText]
  );

  const predictFrame = useCallback(async () => {
    if (!webcamRef.current || isProcessingRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    isProcessingRef.current = true;
    const startTime = performance.now();

    try {
      setError("");
      const imageResponse = await fetch(imageSrc);
      const blob = await imageResponse.blob();

      const formData = new FormData();
      formData.append("frame", blob, `frame-${Date.now()}.jpg`);

      const apiResponse = await fetch(`${API_URL}/api/predict/frame`, {
        method: "POST",
        body: formData,
      });

      const endTime = performance.now();
      setProcessingTime(Math.round(endTime - startTime));

      fpsCountRef.current += 1;
      if (endTime - fpsTimeRef.current >= 1000) {
        setFps(fpsCountRef.current);
        fpsCountRef.current = 0;
        fpsTimeRef.current = endTime;
      }

      if (!apiResponse.ok) {
        setCurrentLabel("—");
        setConfidence(0);
        setHoldProgress(0);
        holdStartTimeRef.current = null;
        return;
      }

      const data = await apiResponse.json();

      if (data.success) {
        const rawLabel = (data.label || data.predicted_label || data.prediction || "—").toUpperCase();
        const rawConf = Number(data.confidence_percent || 0);

        const smoothed = computeSmoothedPrediction(rawLabel, rawConf);
        const finalLabel = smoothed.label;
        const finalConfidence = Math.min(100, Math.max(0, Math.round(smoothed.confidence)));

        setCurrentLabel(finalLabel);
        setConfidence(finalConfidence);

        if (Array.isArray(data.top_predictions) && data.top_predictions.length > 0) {
          setTopPredictions(data.top_predictions);
        } else {
          setTopPredictions([{ label: finalLabel, confidence_percent: finalConfidence }]);
        }

        if (finalLabel !== "—" && finalConfidence >= 50) {
          setHistory((prev) => [
            { id: `${Date.now()}-${Math.random()}`, label: finalLabel, confidence: finalConfidence, time: new Date().toLocaleTimeString() },
            ...prev.slice(0, 19),
          ]);
        }

        handleHoldAndAppend(finalLabel, finalConfidence);
      } else {
        setCurrentLabel("—");
        setConfidence(0);
        setHoldProgress(0);
        holdStartTimeRef.current = null;
      }
    } catch (err) {
      console.warn("Prediction frame error:", err);
    } finally {
      isProcessingRef.current = false;
    }
  }, [computeSmoothedPrediction, handleHoldAndAppend]);

  useEffect(() => {
    if (isRunning) {
      fpsTimeRef.current = performance.now();
      fpsCountRef.current = 0;
      predictionLoopRef.current = setInterval(predictFrame, 200);
    } else {
      if (predictionLoopRef.current) clearInterval(predictionLoopRef.current);
      holdStartTimeRef.current = null;
    }

    return () => {
      if (predictionLoopRef.current) clearInterval(predictionLoopRef.current);
    };
  }, [isRunning, predictFrame]);

  const refineWithGroq = useCallback(
    async (textToRefine) => {
      const raw = (textToRefine !== undefined ? textToRefine : sentence).trim();
      if (!raw) {
        toast.warn("Please assemble or sign some words first.");
        return;
      }

      setIsRefining(true);
      setAiNotice("");

      try {
        const response = await fetch(`${API_URL}/api/groq/refine`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: raw }),
        });

        const data = await response.json();

        if (data.success) {
          setAiSentence(data.refined_sentence);
          if (data.ai_generated) {
            setAiNotice(data.model || "Groq LLaMA 3.3");
            toast.success("Sentence refined with Groq AI.", "AI Translation");
            if (autoTTS) speakText(data.refined_sentence);
          } else {
            setAiNotice(data.message || "Offline grammar correction applied");
          }
        } else {
          throw new Error(data.message || "Failed to refine sentence.");
        }
      } catch (err) {
        console.warn("Groq refinement error:", err);
        const fallback =
          raw.charAt(0).toUpperCase() +
          raw.slice(1).toLowerCase() +
          (/[.?!]$/.test(raw) ? "" : ".");
        setAiSentence(fallback);
        setAiNotice("Offline fallback mode active");
      } finally {
        setIsRefining(false);
      }
    },
    [sentence, autoTTS, speakText, toast]
  );

  const addSpace = () => setSentence((prev) => prev + " ");
  const handleBackspace = () => setSentence((prev) => prev.slice(0, -1));
  const clearSentence = () => {
    setSentence("");
    setAiSentence("");
    setAiNotice("");
  };

  const copySentence = async () => {
    if (!sentence) return;
    try {
      await navigator.clipboard.writeText(sentence);
      setCopied(true);
      toast.success("Transcript copied to the clipboard.", "Copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Clipboard access was blocked by the browser.");
    }
  };

  const copyAiSentence = async () => {
    if (!aiSentence) return;
    try {
      await navigator.clipboard.writeText(aiSentence);
      setAiCopied(true);
      toast.success("AI sentence copied to clipboard.", "Copied");
      setTimeout(() => setAiCopied(false), 2000);
    } catch {
      toast.error("Failed to copy AI sentence.");
    }
  };

  const downloadTranscript = () => {
    if (!sentence) return;
    const content = [
      `SignAI Transcript`,
      `Date: ${new Date().toLocaleString()}`,
      `\n--- Recognized Signs (Deep Learning) ---`,
      sentence,
      aiSentence ? `\n--- AI Context Sentence (Groq LLM) ---\n${aiSentence}` : "",
    ].filter(Boolean).join("\n");

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `signai-transcript-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Transcript downloaded.", "Saved");
  };

  return (
    <>
      <div className="stack" style={{ gap: "var(--space-6)", paddingBottom: "var(--space-8)" }}>
        <div className="page-head">
          <div>
            <span className="eyebrow">Live workspace</span>
            <h1 className="mt-2">Live detection</h1>
            <p style={{ maxWidth: "62ch" }}>
              Webcam gesture translation with smoothing, voice synthesis and a
              sentence builder. Hold a sign steady to lock it in.
            </p>
          </div>

          <div className="row">
            <button
              onClick={() => setShowSettings((prev) => !prev)}
              className={`btn btn-sm ${showSettings ? "btn-secondary" : "btn-ghost"}`}
            >
              {showSettings ? "Hide settings" : "Settings"}
            </button>
            <button
              onClick={() => setAutoTTS((prev) => !prev)}
              className={`btn btn-sm ${autoTTS ? "btn-secondary" : "btn-ghost"}`}
            >
              {autoTTS ? "Auto-TTS on" : "Auto-TTS off"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="card glass grid grid-3" style={{ alignItems: "start" }}>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="live-confidence">
                    Min confidence filter: {minConfidenceThreshold}%
                  </label>
                  <input
                    id="live-confidence"
                    type="range"
                    min="50"
                    max="95"
                    value={minConfidenceThreshold}
                    onChange={(e) => setMinConfidenceThreshold(Number(e.target.value))}
                    className="slider"
                  />
                  <span className="hint">Ignore predictions below this confidence</span>
                </div>

                <div className="field" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="live-hold">
                    Hold-to-append duration: {holdDurationMs / 1000}s
                  </label>
                  <input
                    id="live-hold"
                    type="range"
                    min="800"
                    max="2500"
                    step="100"
                    value={holdDurationMs}
                    onChange={(e) => setHoldDurationMs(Number(e.target.value))}
                    className="slider"
                  />
                  <span className="hint">Time to hold before appending to the sentence</span>
                </div>

                <div>
                  <label className="toggle">
                    <input type="checkbox" checked={autoAppend} onChange={(e) => setAutoAppend(e.target.checked)} />
                    <span className="track" />
                    <span>Enable auto-append to sentence</span>
                  </label>
                  <span className="hint">Automatically adds steady letters to the text box</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="alert alert-err">
            <b>Recognition stopped</b>
            {error}
          </div>
        )}

        {/* HUD */}
        <div className="grid grid-4">
          {[
            { label: "Sign output", value: currentLabel, accent: "var(--primary)" },
            { label: "Confidence", value: <AnimatedNumber value={confidence} suffix="%" />, accent: confidence >= 65 ? "var(--ok)" : "var(--warn)" },
            { label: "Latency", value: <>{processingTime}<span className="unit">ms</span></>, accent: "var(--info)" },
            { label: "Live speed", value: <>{fps}<span className="unit">FPS</span></>, accent: "var(--hand)" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="card stat-card"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              style={{ "--accent": item.accent }}
            >
              <span className="stat-label">{item.label}</span>
              <div className="stat-value" style={{ fontSize: "var(--fs-xl)" }}>{item.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-2" style={{ alignItems: "start" }}>
          <div className="stack">
            <div className="card">
              <div className={`camera ${isRunning ? "is-live" : ""}`}>
                {isRunning ? (
                  <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "user", width: 640, height: 480 }} />
                ) : (
                  <div className="stack" style={{ height: "100%", alignItems: "center", justifyContent: "center", padding: "32px", textAlign: "center" }}>
                    <div className="camera-idle-mark">
                      <span>S</span>
                    </div>
                    <h3 style={{ color: "#fff", marginBottom: 0 }}>Camera is paused</h3>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.62)", maxWidth: "34ch" }}>
                      Start the camera to begin real-time sign recognition.
                    </p>
                  </div>
                )}

                {isRunning && <span className="badge badge-err badge-dot live">Live</span>}

                {isRunning && (
                  <>
                    <span className="hand-tag" style={{ left: "30%", top: "14%" }}>Hand 1</span>
                    <div className="hand-box" style={{ left: "30%", top: "20%", width: "40%", height: "52%" }} />
                  </>
                )}

                {isRunning && currentLabel !== "—" && (
                  <span className="badge badge-pri" style={{ position: "absolute", left: "var(--space-3)", top: "var(--space-3)", zIndex: 2 }}>
                    Holding {currentLabel} · {confidence}%
                  </span>
                )}

                {isRunning && autoAppend && holdProgress > 0 && (
                  <div style={{ position: "absolute", left: "18px", right: "18px", bottom: "14px", zIndex: 2 }}>
                    <div className="row row-between" style={{ marginBottom: "6px" }}>
                      <span className="badge badge-pri">Locking {currentLabel}</span>
                      <span className="badge badge-pri">{Math.round(holdProgress)}%</span>
                    </div>
                    <div className="progress">
                      <i style={{ width: `${holdProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="row row-between" style={{ marginTop: "var(--space-4)" }}>
                <div className="row">
                  <button
                    onClick={() => {
                      if (isRunning) {
                        setHoldProgress(0);
                        holdStartTimeRef.current = null;
                      }
                      setIsRunning((prev) => !prev);
                    }}
                    className={`btn ${isRunning ? "btn-danger" : "btn-primary"}`}
                  >
                    {isRunning ? "Stop camera" : "Start camera"}
                  </button>

                  {currentLabel !== "—" && (
                    <button onClick={() => speakText(currentLabel)} className="btn btn-ghost btn-sm">
                      Speak letter
                    </button>
                  )}
                </div>

                <span className={`badge badge-dot ${isRunning ? "badge-ok" : "badge-info"}`}>
                  {isRunning ? "Tracking active" : "Camera paused"}
                </span>
              </div>
            </div>

            <div className="caption caption-now">
              <span className="hint">Now signing</span>
              <div className="caption-text">{currentLabel === "—" ? "Waiting for a sign" : currentLabel}</div>
              <div
                className={`meter ${confidence >= 65 ? "high" : "low"}`}
                role="meter"
                aria-valuenow={confidence}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Confidence"
              >
                <i style={{ width: `${confidence}%` }} />
              </div>
              <p className="hint">Confidence {confidence} percent</p>
            </div>

            <div className="card stack">
              <div className="row row-between">
                <div>
                  <h3 style={{ marginBottom: 0 }}>Sentence builder</h3>
                  <p className="hint" style={{ marginTop: "4px" }}>Hold a sign steady to add it to the transcript.</p>
                </div>

                <div className="row">
                  <button onClick={() => speakText(sentence)} disabled={!sentence} className="btn btn-ghost btn-sm">
                    Speak sentence
                  </button>
                  <button onClick={copySentence} disabled={!sentence} className="btn btn-ghost btn-sm">
                    {copied ? "Copied" : "Copy text"}
                  </button>
                  <button onClick={downloadTranscript} disabled={!sentence} className="btn btn-ghost btn-sm">
                    Download
                  </button>
                </div>
              </div>

              <div
                style={{
                  minHeight: "112px",
                  width: "100%",
                  borderRadius: "var(--r-m)",
                  border: "1px solid var(--line)",
                  background: "var(--surface-2)",
                  padding: "var(--space-4)",
                  fontSize: "1.25rem",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  color: "var(--ink)",
                }}
              >
                {sentence ? (
                  <div className="row" style={{ gap: "4px" }}>
                    {sentence.split("").map((char, index) => (
                      <motion.span
                        key={`${index}-${char}`}
                        initial={{ scale: 0.5, opacity: 0, y: 6 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 28 }}
                        className={char === " " ? "" : "badge badge-pri"}
                        style={char === " " ? { display: "inline-block", width: "12px" } : { fontFamily: "var(--font-display)", fontSize: "1.05rem" }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted" style={{ fontStyle: "italic" }}>
                    Hold signs in front of the camera to assemble words and sentences here…
                  </span>
                )}
              </div>

              <div className="row">
                <button onClick={addSpace} className="btn btn-ghost btn-sm">Add space</button>
                <button onClick={handleBackspace} disabled={!sentence} className="btn btn-ghost btn-sm">Backspace</button>
                <button onClick={clearSentence} disabled={!sentence} className="btn btn-ghost btn-sm" style={{ color: "var(--err)" }}>
                  Clear all
                </button>
              </div>

              {/* AI Language Processing Layer (Groq API) */}
              <div
                className="card card-flat"
                style={{
                  marginTop: "var(--space-2)",
                  background: "var(--surface-3)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--r-m)",
                  padding: "var(--space-4)",
                }}
              >
                <div className="row row-between" style={{ marginBottom: "var(--space-2)" }}>
                  <div className="row" style={{ gap: "var(--space-2)" }}>
                    <span className="badge badge-pri">Groq AI Processing</span>
                    {aiNotice && (
                      <span className="badge badge-dot badge-info" style={{ fontSize: "0.75rem" }}>
                        {aiNotice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => refineWithGroq()}
                    disabled={!sentence || isRefining}
                    className={`btn btn-sm ${isRefining ? "btn-ghost" : "btn-primary"}`}
                  >
                    {isRefining ? (
                      <>
                        <span className="spinner spinner-sm" aria-hidden="true" style={{ marginRight: "6px" }} />
                        Constructing sentence…
                      </>
                    ) : (
                      "Refine with Groq AI"
                    )}
                  </button>
                </div>

                <div style={{ marginTop: "var(--space-2)" }}>
                  <div className="row row-between" style={{ marginBottom: "4px" }}>
                    <span className="hint" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      AI Context-Aware Sentence:
                    </span>
                    {aiSentence && (
                      <span className="hint" style={{ fontSize: "0.75rem" }}>
                        Grammar corrected & structured
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      minHeight: "48px",
                      padding: "var(--space-3)",
                      borderRadius: "var(--r-s)",
                      background: "var(--surface-2)",
                      border: "1px solid var(--line)",
                      color: aiSentence ? "var(--ink)" : "var(--ink-3)",
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      lineHeight: 1.45,
                    }}
                  >
                    {aiSentence ? (
                      <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {aiSentence}
                      </motion.span>
                    ) : (
                      <span className="text-sm text-muted" style={{ fontStyle: "italic" }}>
                        Click "Refine with Groq AI" above to transform your recognized signs into a natural, complete sentence.
                      </span>
                    )}
                  </div>
                </div>

                {aiSentence && (
                  <div className="row" style={{ marginTop: "var(--space-3)", gap: "var(--space-2)" }}>
                    <button
                      onClick={() => speakText(aiSentence)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Volume2 size={15} aria-hidden="true" />
                      Speak AI sentence
                    </button>
                    <button
                      onClick={copyAiSentence}
                      className="btn btn-ghost btn-sm"
                    >
                      {aiCopied ? "Copied" : "Copy AI sentence"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="stack">
            <div className="card card-hover">
              <div className="section-head" style={{ marginBottom: 0 }}>
                <div>
                  <h3 style={{ marginBottom: 0 }}>Confidence distribution</h3>
                  <p>Top predicted sign probabilities</p>
                </div>
                <span className="badge badge-pri">{topPredictions.length} candidates</span>
              </div>

              <div className="stack" style={{ marginTop: "var(--space-4)", gap: "var(--space-3)" }}>
                {topPredictions.length > 0 ? (
                  topPredictions.map((item, idx) => (
                    <div key={`${item.label}-${idx}`}>
                      <div className="row row-between" style={{ marginBottom: "4px" }}>
                        <span className="text-sm fw-semibold">Letter {item.label}</span>
                        <span className="text-sm text-muted">{Math.round(item.confidence_percent || 0)}%</span>
                      </div>
                      <div className="meter">
                        <i style={{ width: `${Math.min(100, item.confidence_percent || 0)}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty">
                    <p className="text-sm text-muted">No active predictions</p>
                  </div>
                )}
              </div>
            </div>

            <div className="card card-hover">
              <div className="row row-between">
                <h3 style={{ marginBottom: 0 }}>Detection stream</h3>
                <span className="hint" style={{ marginTop: 0 }}>{history.length} logged</span>
              </div>

              <div className="stack" style={{ marginTop: "var(--space-4)", maxHeight: "320px", overflowY: "auto", gap: "var(--space-2)" }}>
                <AnimatePresence initial={false}>
                  {history.length > 0 ? (
                    history.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 16, scale: 0.98 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="caption"
                        style={{ marginBottom: 0 }}
                      >
                        <div className="row row-between" style={{ marginBottom: "4px" }}>
                          <span className="text-sm fw-semibold">Letter {item.label}</span>
                          <span className="badge badge-ok">{item.confidence}%</span>
                        </div>
                        <div className={`meter ${item.confidence >= 65 ? "high" : "low"}`} style={{ marginTop: 0 }}>
                          <i style={{ width: `${item.confidence}%` }} />
                        </div>
                        <p className="hint" style={{ marginTop: "4px" }}>{item.time}</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="empty">
                      <p className="text-sm text-muted">Predictions will appear here in real time.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="card card-flat">
              <h3 style={{ marginBottom: "var(--space-2)" }}>Tips for a clean read</h3>
              <ul className="text-sm text-soft" style={{ paddingLeft: "1.2rem" }}>
                <li className="mb-1">Face a window or lamp so the hand is evenly lit.</li>
                <li className="mb-1">Keep the whole hand inside the frame.</li>
                <li>Hold the sign still until the lock meter fills.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveRecognition;
