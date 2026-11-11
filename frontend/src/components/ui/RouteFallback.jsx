const RouteFallback = () => (
  <div className="route-fallback" role="status" aria-live="polite" aria-label="Loading page">
    <span className="sr-only">Loading page…</span>
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-line" style={{ width: "38%" }} />
    <div className="route-fallback-grid">
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="card route-fallback-card">
          <div className="skeleton skeleton-line" style={{ width: "48%", height: 12 }} />
          <div className="skeleton skeleton-line" style={{ width: "70%", height: 26, marginTop: 14 }} />
          <div className="skeleton skeleton-line" style={{ width: "60%", marginTop: 12 }} />
        </div>
      ))}
    </div>
    <div className="card route-fallback-panel">
      <div className="skeleton skeleton-line" style={{ width: "30%", height: 14 }} />
      <div className="skeleton skeleton-line" style={{ marginTop: 18, height: 120 }} />
    </div>
  </div>
);

export default RouteFallback;
