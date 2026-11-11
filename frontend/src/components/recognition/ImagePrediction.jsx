const ImagePrediction = ({
  prediction,
  loading = false,
}) => {
  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div
        className="empty"
        style={{ minHeight: "420px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
      >
        <span className="spinner spinner-lg" role="status" aria-label="Loading" />

        <h3 className="mt-4">Analyzing image...</h3>

        <p className="hint">
          Detecting hand landmarks and running the trained AI model.
        </p>

        <div className="progress mt-4" style={{ width: "12rem" }}>
          <i style={{ width: "50%" }} />
        </div>
      </div>
    );
  }

  // =========================================================
  // NO PREDICTION
  // =========================================================

  if (!prediction) {
    return (
      <div className="empty" style={{ minHeight: "420px" }}>
        <h3>No prediction yet</h3>

        <p className="hint">
          Upload a hand gesture image and choose{" "}
          <span className="fw-semibold text-primary">Predict</span> to see the
          AI recognition result here.
        </p>
      </div>
    );
  }

  // =========================================================
  // GET PREDICTION LABEL
  // =========================================================

  const label =
    prediction.label ??
    prediction.predicted_label ??
    prediction.prediction ??
    prediction.class ??
    prediction.sign ??
    "?";

  // =========================================================
  // CONFIDENCE
  // =========================================================

  let confidence =
    prediction.confidence_percent ??
    prediction.confidence ??
    prediction.probability ??
    null;

  if (confidence !== null) {
    confidence = Number(confidence);

    if (confidence > 0 && confidence <= 1) {
      confidence = confidence * 100;
    }

    confidence = Math.min(
      100,
      Math.max(0, confidence)
    );
  }

  // =========================================================
  // ACCURACY
  // =========================================================

  let accuracy =
    prediction.accuracy_percent ??
    prediction.accuracy ??
    null;

  if (accuracy !== null) {
    accuracy = Number(accuracy);

    if (accuracy > 0 && accuracy <= 1) {
      accuracy = accuracy * 100;
    }

    accuracy = Math.min(
      100,
      Math.max(0, accuracy)
    );
  }

  // =========================================================
  // PROCESSING TIME
  // =========================================================

  const processingTime =
    prediction.processing_time_ms ??
    prediction.processing_time ??
    prediction.processingTime ??
    null;

  // =========================================================
  // MODEL
  // =========================================================

  const modelName =
    prediction.model ??
    prediction.model_name ??
    "SignAI Neural Network";

  // =========================================================
  // RESULT CARD
  // =========================================================

  return (
    <div className="stack">
      {/* =====================================================
          PREDICTION HIGHLIGHT
      ===================================================== */}

      <div className="caption caption-now">
        <div className="row row-between">
          <span className="badge badge-ok">Recognition successful</span>

          <span className="badge badge-pri">{modelName}</span>
        </div>

        <div
          className="row mt-4"
          style={{ alignItems: "flex-end", gap: "var(--space-5)" }}
        >
          <div
            className="stat-value"
            style={{ fontSize: "4rem", lineHeight: 1 }}
          >
            {String(label).toUpperCase()}
          </div>

          <div>
            <p className="stat-label">Predicted gesture</p>
            <h2 className="mt-1">Sign {String(label).toUpperCase()}</h2>
            <p className="text-sm text-ok fw-semibold">
              Recognition successful
            </p>
          </div>
        </div>

        {confidence !== null && (
          <div className="meter high">
            <i style={{ width: `${confidence}%` }} />
          </div>
        )}

        <p className="hint">
          Confidence {confidence !== null ? `${confidence.toFixed(2)}%` : "--"}
        </p>
      </div>

      {/* =====================================================
          METRICS
      ===================================================== */}

      <div className="grid grid-2">
        <div className="card">
          <span className="stat-label">Accuracy</span>
          <div className="stat-value">
            {accuracy !== null ? `${accuracy.toFixed(2)}%` : "--"}
          </div>

          {accuracy !== null && (
            <div className="meter high">
              <i style={{ width: `${accuracy}%` }} />
            </div>
          )}

          <p className="hint">Prediction accuracy</p>
        </div>

        <div className="card">
          <span className="stat-label">Processing time</span>
          <div className="stat-value" style={{ fontSize: "var(--fs-xl)" }}>
            {processingTime !== null ? `${processingTime} ms` : "Completed"}
          </div>
          <p className="hint">Time to analyze this image</p>
        </div>
      </div>

      {/* =====================================================
          MODEL
      ===================================================== */}

      <div className="card">
        <div className="row row-between">
          <span className="stat-label">Model</span>
          <span className="fw-semibold text-sm">{modelName}</span>
        </div>
      </div>

      {/* =====================================================
          STATUS
      ===================================================== */}

      <div className="card">
        <div className="row row-between">
          <span className="stat-label">Status</span>
          <span className="badge badge-ok">Recognized</span>
        </div>
      </div>
    </div>
  );
};

export default ImagePrediction;