const PredictionPanel = ({
  prediction = null,
  fps = 0,
  processingTime = 0,
  isDetecting = false,
}) => {
  // =========================================================
  // GET VALUES
  // =========================================================

  const label = prediction?.label || "--";

  let confidence = Number(
    prediction?.confidence_percent ?? 0
  );

  confidence = Math.min(
    Math.max(confidence, 0),
    100
  );

  // =========================================================
  // STATUS
  // =========================================================

  let status = "Waiting";

  if (isDetecting && prediction) {
    status = "Detecting";
  } else if (isDetecting) {
    status = "Processing";
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="card stack">
      {/* Header */}
      <div className="row row-between">
        <div>
          <h2 style={{ marginBottom: 0 }}>AI Prediction</h2>
          <p className="hint" style={{ marginTop: "2px" }}>
            Current recognition result
          </p>
        </div>

        <span className={`badge ${isDetecting ? "badge-ok" : "badge-info"}`}>
          {status}
        </span>
      </div>

      {/* Detected gesture */}
      <div className="gesture" style={{ fontSize: "3.25rem" }}>
        {String(label).toUpperCase()}
      </div>
      <p className="text-sm text-muted" style={{ textAlign: "center" }}>
        Detected gesture
      </p>

      {/* Confidence */}
      <div className="caption caption-now" style={{ marginBottom: 0 }}>
        <div className="row row-between">
          <span className="text-sm fw-semibold">Confidence</span>
          <span className="text-sm fw-bold text-ok">
            {confidence.toFixed(2)}%
          </span>
        </div>

        <div className={`meter ${confidence >= 65 ? "high" : "low"}`}>
          <i style={{ width: `${confidence}%` }} />
        </div>
      </div>

      {/* Details */}
      <div className="stack" style={{ gap: "var(--space-2)" }}>
        <div className="row row-between">
          <span className="text-sm text-soft">FPS</span>
          <span className="fw-bold">{fps || 0}</span>
        </div>

        <div className="row row-between">
          <span className="text-sm text-soft">Processing</span>
          <span className="fw-bold">
            {processingTime
              ? `${processingTime} ms`
              : "--"}
          </span>
        </div>

        <div className="row row-between">
          <span className="text-sm text-soft">Status</span>
          <span className={`badge ${isDetecting ? "badge-ok" : "badge-info"}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Live recognition indicator */}
      {isDetecting && (
        <div className="alert alert-info" style={{ marginBottom: 0 }}>
          <span className="text-sm">AI recognition is running in real time</span>
        </div>
      )}
    </div>
  );
};

export default PredictionPanel;
