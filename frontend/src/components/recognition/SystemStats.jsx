const SystemStats = () => {
  return (
    <div className="card stack">
      {/* Header */}
      <div className="row row-between">
        <div>
          <h2 style={{ marginBottom: 0 }}>System Statistics</h2>
          <p className="hint" style={{ marginTop: "2px" }}>
            AI recognition system status
          </p>
        </div>

        <span className="badge badge-ok">Online</span>
      </div>

      {/* Statistics */}
      <div className="stack" style={{ gap: "var(--space-2)" }}>
        {/* Model */}
        <div className="row row-between" style={{ paddingBottom: "var(--space-2)", borderBottom: "1px solid var(--line)" }}>
          <span className="text-sm text-soft">Model</span>
          <span className="text-sm fw-semibold">Enhanced NN</span>
        </div>

        {/* Accuracy */}
        <div style={{ paddingBottom: "var(--space-2)", borderBottom: "1px solid var(--line)" }}>
          <div className="row row-between">
            <span className="text-sm text-soft">Accuracy</span>
            <span className="text-sm fw-bold text-ok">99.2%</span>
          </div>
          <div className="meter high">
            <i style={{ width: "99.2%" }} />
          </div>
        </div>

        {/* GPU */}
        <div className="row row-between" style={{ paddingBottom: "var(--space-2)", borderBottom: "1px solid var(--line)" }}>
          <span className="text-sm text-soft">GPU</span>
          <span className="badge badge-ok">Available</span>
        </div>

        {/* Frames */}
        <div className="row row-between">
          <span className="text-sm text-soft">Frames</span>
          <span className="text-sm fw-bold">542</span>
        </div>
      </div>

      {/* Footer status */}
      <div className="row" style={{ borderTop: "1px solid var(--line)", paddingTop: "var(--space-4)" }}>
        <span className="text-xs text-muted">Recognition system is ready</span>
      </div>
    </div>
  );
};

export default SystemStats;
