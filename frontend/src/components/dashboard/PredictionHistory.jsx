import { useMemo } from "react";
import { motion } from "framer-motion";

const PredictionHistory = ({ predictions = [], accuracy = 0, loading = false }) => {
  const toPercent = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const number = Number(value);
    if (Number.isNaN(number)) return null;
    return number <= 1 ? number * 100 : number;
  };

  const normalizedPredictions = useMemo(() => {
    if (!Array.isArray(predictions)) return [];

    return predictions
      .map((prediction, index) => ({
        ...prediction,
        id: prediction._id ?? prediction.id ?? index,
        label:
          prediction.label ??
          prediction.prediction ??
          prediction.gesture ??
          prediction.class_name ??
          "Unknown",
        confidence:
          prediction.confidence_percent ?? prediction.confidence ?? null,
        timestamp:
          prediction.createdAt ??
          prediction.created_at ??
          prediction.timestamp ??
          prediction.date ??
          null,
      }))
      .sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 10);
  }, [predictions]);

  const overallAccuracy = useMemo(() => {
    const value = toPercent(accuracy);
    return value === null ? 0 : value;
  }, [accuracy]);

  const formatDate = (value) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!normalizedPredictions.length) {
    return (
      <div className="empty" style={{ margin: "var(--space-4)" }}>
        <h3>No predictions yet</h3>
        <p className="text-sm text-muted" style={{ marginInline: "auto", maxWidth: "44ch" }}>
          Start recognition to see your latest sign language predictions,
          confidence and timestamps here.
        </p>
        {!loading && overallAccuracy > 0 && (
          <span className="badge badge-pri" style={{ marginTop: "var(--space-3)" }}>
            Model accuracy {overallAccuracy.toFixed(2)}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="table-wrap">
        <table style={{ minWidth: 640 }}>
          <thead>
            <tr>
              <th>Prediction</th>
              <th>Confidence</th>
              <th>When</th>
              <th style={{ textAlign: "right" }}>Status</th>
            </tr>
          </thead>

          <tbody>
            {normalizedPredictions.map((prediction, index) => {
              const confidence = toPercent(prediction.confidence);
              const statusValue = confidence ?? 0;
              const isHigh = statusValue >= 85;
              const isModerate = statusValue >= 60 && statusValue < 85;

              return (
                <motion.tr
                  key={prediction.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.3 }}
                >
                  <td>
                    <div className="row" style={{ gap: 10, flexWrap: "nowrap" }}>
                      <span className="badge badge-pri" style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem" }}>
                        {prediction.label}
                      </span>
                      <span className="text-xs text-muted">Predicted sign</span>
                    </div>
                  </td>

                  <td style={{ minWidth: 150 }}>
                    <span className="fw-semibold">
                      {confidence === null ? "--" : `${confidence.toFixed(1)}%`}
                    </span>
                    {confidence !== null && (
                      <div className={`meter ${confidence >= 65 ? "high" : "low"}`}>
                        <i style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }} />
                      </div>
                    )}
                  </td>

                  <td>
                    <span className="text-sm text-soft" style={{ whiteSpace: "nowrap" }}>
                      {formatDate(prediction.timestamp)}
                    </span>
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <span
                      className={`badge ${
                        isHigh ? "badge-ok" : isModerate ? "badge-warn" : "badge-err"
                      }`}
                    >
                      {isHigh ? "High" : isModerate ? "Moderate" : "Low"}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        className="row row-between"
        style={{
          borderTop: "1px solid var(--line)",
          padding: "var(--space-3) var(--space-4)",
        }}
      >
        <p className="text-xs text-muted" style={{ margin: 0 }}>
          Showing{" "}
          <span className="fw-semibold text-soft">{normalizedPredictions.length}</span>{" "}
          recent predictions
        </p>

        {overallAccuracy > 0 && (
          <div className="text-xs text-muted">
            Model accuracy <strong className="text-ok">{overallAccuracy.toFixed(2)}%</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionHistory;
