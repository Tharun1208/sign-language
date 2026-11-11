const PredictionTable = ({ history = [] }) => {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "var(--pad-card)", borderBottom: "1px solid var(--line)" }}>
        <h2 style={{ marginBottom: 0 }}>Recent Predictions</h2>
        <p className="hint" style={{ marginTop: "2px" }}>
          Latest gesture recognition results
        </p>
      </div>

      {/* Empty state */}
      {history.length === 0 ? (
        <div className="empty" style={{ margin: "var(--pad-card)" }}>
          <p className="text-sm fw-semibold">No predictions yet</p>
          <p className="hint" style={{ maxWidth: "34ch", marginInline: "auto" }}>
            Upload a hand gesture image and choose{" "}
            <span className="text-primary fw-semibold">Predict</span> to see your
            recognition history here.
          </p>
        </div>
      ) : (
        /* Table */
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Prediction</th>
                <th>Confidence</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item, index) => {
                const confidence = Number(item.confidence ?? 0);

                return (
                  <tr key={item.id || index}>
                    <td className="text-sm fw-medium">
                      {item.time || "--"}
                    </td>

                    <td>
                      <span className="badge badge-pri">
                        {item.prediction || "--"}
                      </span>
                    </td>

                    <td>
                      <div className="stack" style={{ gap: "6px" }}>
                        <span className="badge badge-ok">
                          {confidence.toFixed(2)}%
                        </span>

                        <div className="meter" style={{ width: "96px", marginTop: 0 }}>
                          <i
                            style={{
                              width: `${Math.min(
                                Math.max(confidence, 0),
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-ok">
                        Recognized
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PredictionTable;
