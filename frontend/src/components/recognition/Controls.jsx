import {
  FaPlay,
  FaStop,
  FaCamera,
  FaRedo,
} from "react-icons/fa";

/**
 * Recognition Controls
 *
 * Wired to the LiveRecognition session. Every button acts on the live feed:
 *  - Start / Stop  -> toggles the webcam + prediction loop
 *  - Capture       -> pins the current sign plus its top candidates
 *  - Reset         -> clears the assembled sentence and hold state
 */
const Controls = ({
  isRunning = false,
  currentLabel = "—",
  confidence = 0,
  isProcessing = false,
  onStart,
  onStop,
  onCapture,
  onReset,
  canCapture = false,
  canReset = true,
}) => {
  const statusLabel = !isRunning
    ? "SYSTEM IDLE"
    : isProcessing
      ? "BUSY"
      : "SYSTEM READY";

  const statusBadge = !isRunning
    ? "badge-info"
    : isProcessing
      ? "badge-warn"
      : "badge-ok";

  return (
    <div className="card stack" style={{ gap: "var(--space-4)" }}>
      {/* HEADER */}
      <div className="row row-between">
        <div className="row" style={{ gap: "var(--space-3)" }}>
          <div
            aria-hidden="true"
            style={{
              display: "grid",
              placeItems: "center",
              width: 44,
              height: 44,
              borderRadius: "var(--r-m)",
              background: "var(--primary-soft)",
              color: "var(--primary)",
              flex: "none",
            }}
          >
            <FaCamera size={17} />
          </div>

          <div>
            <h2 style={{ marginBottom: 0 }}>Recognition Controls</h2>
            <p className="hint" style={{ marginTop: 2, marginBottom: 0 }}>
              Manage your recognition session.
            </p>
          </div>
        </div>

        <span className={`badge ${statusBadge}`}>{statusLabel}</span>
      </div>

      {/* BUTTONS */}
      <div className="row" style={{ flexWrap: "wrap", gap: "var(--space-3)" }}>
        {!isRunning ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={onStart}
            style={{ flex: "1 1 120px" }}
          >
            <FaPlay size={12} style={{ marginRight: 8 }} />
            Start
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-danger"
            onClick={onStop}
            style={{ flex: "1 1 120px" }}
          >
            <FaStop size={12} style={{ marginRight: 8 }} />
            Stop
          </button>
        )}

        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCapture}
          disabled={!isRunning || !canCapture}
          style={{ flex: "1 1 120px" }}
          title={
            canCapture
              ? `Capture ${currentLabel} at ${confidence}%`
              : "No confident sign detected"
          }
        >
          <FaCamera size={14} style={{ marginRight: 8 }} />
          Capture
        </button>

        <button
          type="button"
          className="btn btn-ghost"
          onClick={onReset}
          disabled={!canReset}
          style={{ flex: "1 1 120px" }}
          title="Clear the assembled sentence"
        >
          <FaRedo size={13} style={{ marginRight: 8 }} />
          Reset
        </button>
      </div>

      {/* STATUS */}
      <div
        className="row row-between"
        style={{
          padding: "var(--space-3) var(--space-4)",
          borderRadius: "var(--r-m)",
          background: "var(--surface-2)",
          border: "var(--bw) solid var(--line)",
        }}
      >
        <div className="row" style={{ gap: "var(--space-2)" }}>
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: 9,
              height: 9,
              borderRadius: "50%",
              flex: "none",
              background: isRunning ? "var(--ok)" : "var(--ink-3)",
              boxShadow: isRunning ? "0 0 0 4px var(--ok-soft)" : "none",
            }}
          />

          <span className="text-sm">
            {isRunning
              ? isProcessing
                ? "Processing frame…"
                : "Recognition system ready"
              : "Camera paused"}
          </span>
        </div>

        <span className="hint" style={{ marginTop: 0 }}>
          AI Engine
        </span>
      </div>
    </div>
  );
};

export default Controls;