import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import StatsCard from "../components/dashboard/Statscard";
import PredictionHistory from "../components/dashboard/PredictionHistory";
import AnimatedNumber from "../components/ui/AnimatedNumber";
import { apiFetch } from "../services/api";

const REFRESH_INTERVAL = 5000;

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const AccuracyRing = ({ value = 0, loading }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className="accuracy-ring">
      <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--surface-2)" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (pct / 100) * circumference }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          transform="rotate(-90 60 60)"
        />
        <defs>
          <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8C77F5" />
            <stop offset="55%" stopColor="#5B3FD9" />
            <stop offset="100%" stopColor="#E8467C" />
          </linearGradient>
        </defs>
      </svg>
      <div className="accuracy-ring-label">
        <span className="stat-value" style={{ marginTop: 0, fontSize: "var(--fs-xl)" }}>
          {loading ? "…" : <AnimatedNumber value={pct} decimals={1} suffix="%" />}
        </span>
        <span className="stat-label">Test accuracy</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [health, setHealth] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchHealth = async () => {
    const data = await apiFetch("/api/health");
    setHealth(data);
    return data;
  };

  const fetchPredictions = async () => {
    const data = await apiFetch("/api/predictions");
    setPredictions(data?.success && Array.isArray(data.predictions) ? data.predictions : []);
    return data;
  };

  const loadDashboard = async (manual = false) => {
    manual ? setRefreshing(true) : setLoading(true);
    setError("");

    try {
      await Promise.all([fetchHealth(), fetchPredictions()]);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError("Unable to connect to the SignAI backend. Please check whether the Flask server is running.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  useEffect(() => {
    let inFlight = false;

    const refresh = async () => {
      // Don't poll while the tab is hidden or a request is already running.
      if (document.hidden || inFlight) return;
      inFlight = true;
      try {
        await Promise.all([fetchHealth(), fetchPredictions()]);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Dashboard auto-refresh error:", err);
      } finally {
        inFlight = false;
      }
    };

    const interval = setInterval(refresh, REFRESH_INTERVAL);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const modelAccuracy = Number(health?.test_accuracy_percent ?? 0);
  const trainingAccuracy = Number(health?.training_accuracy_percent ?? 0);
  const validationAccuracy = Number(health?.validation_accuracy_percent ?? 0);
  const signClasses = health?.number_of_labels ?? health?.labels?.length ?? 0;
  const modelFeatures = health?.feature_count ?? 0;
  const modelName = health?.model_name || health?.algorithm || "Random Forest";
  const modelLoaded = health?.model_loaded === true;
  const backendOnline = health?.success === true && health?.status === "online";

  const totalPredictions = useMemo(() => predictions.length, [predictions]);

  const averageConfidence = useMemo(() => {
    if (!predictions.length) return 0;
    const valid = predictions.filter((p) => typeof p.confidence === "number");
    if (!valid.length) return 0;
    const total = valid.reduce((sum, p) => sum + p.confidence, 0);
    return Number(((total / valid.length) * 100).toFixed(2));
  }, [predictions]);

  const latestPrediction = useMemo(() => (predictions.length ? predictions[0] : null), [predictions]);
  const latestLabel = latestPrediction?.label || latestPrediction?.prediction || "--";

  const latestConfidence = useMemo(() => {
    if (!latestPrediction) return 0;
    if (latestPrediction.confidence_percent != null) return Number(latestPrediction.confidence_percent);
    if (typeof latestPrediction.confidence === "number") return Number((latestPrediction.confidence * 100).toFixed(2));
    return 0;
  }, [latestPrediction]);

  const formatTime = (date) => {
    if (!date) return "--";
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const performanceLevel = useMemo(() => {
    if (modelAccuracy >= 95) return { label: "Excellent", badge: "badge-ok" };
    if (modelAccuracy >= 85) return { label: "Very good", badge: "badge-info" };
    if (modelAccuracy >= 70) return { label: "Good", badge: "badge-warn" };
    return { label: "Needs improvement", badge: "badge-err" };
  }, [modelAccuracy]);

  const bars = [
    { label: "Training", value: trainingAccuracy, tone: "var(--ok)" },
    { label: "Validation", value: validationAccuracy, tone: "var(--primary)" },
    { label: "Testing", value: modelAccuracy, tone: "var(--ok)" },
  ];

  return (
    <>
      <div className="stack" style={{ gap: "var(--space-6)", paddingBottom: "var(--space-8)" }}>
        {/* PAGE HEAD */}
        <motion.header className="page-head" {...fade()}>
          <div>
            <span className="eyebrow">AI recognition centre</span>
            <h1 className="mt-2">SignAI overview</h1>
            <p style={{ maxWidth: "62ch" }}>
              Monitor the recognition engine, model accuracy, prediction
              confidence and real-time activity from one workspace.
            </p>

            <div className="row mt-4">
              <span className={`badge badge-dot ${backendOnline ? "badge-ok" : "badge-err"}`}>
                {backendOnline ? "Backend online" : "Backend offline"}
              </span>
              <span className={`badge badge-dot ${modelLoaded ? "badge-pri" : "badge-err"}`}>
                {modelLoaded ? "Model ready" : "Model unavailable"}
              </span>
              <span className="badge badge-info">Auto-refresh 5s</span>
            </div>
          </div>

          <div className="card spotlight" style={{ minWidth: 260, display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            <AccuracyRing value={modelAccuracy} loading={loading} />
            <div>
              <span className="stat-label">Performance</span>
              <div className="mt-1">
                <span className={`badge ${performanceLevel.badge}`}>{performanceLevel.label}</span>
              </div>
              <p className="hint" style={{ maxWidth: "16ch" }}>Independent test split</p>
            </div>
          </div>
        </motion.header>

        {error && (
          <motion.div className="alert alert-err" {...fade()}>
            <div className="row row-between">
              <div>
                <b>Backend connection error</b>
                <p className="text-sm">{error}</p>
              </div>
              <button onClick={() => loadDashboard(true)} disabled={refreshing} className="btn btn-ghost btn-sm">
                {refreshing ? "Retrying…" : "Retry connection"}
              </button>
            </div>
          </motion.div>
        )}

        {/* METRICS */}
        <section>
          <div className="section-head">
            <div>
              <h2>Recognition metrics</h2>
              <p>Live performance indicators</p>
            </div>
            <button onClick={() => loadDashboard(true)} disabled={refreshing} className="btn btn-ghost btn-sm">
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          <div className="grid grid-4">
            <StatsCard
              title="Test accuracy"
              value={loading ? "…" : `${modelAccuracy}%`}
              numericValue={modelAccuracy}
              decimals={2}
              suffix="%"
              color="#14805F"
              description="Final model test accuracy"
              delay={0.05}
            />
            <StatsCard
              title="Avg. confidence"
              value={loading ? "…" : `${averageConfidence}%`}
              numericValue={averageConfidence}
              decimals={1}
              suffix="%"
              color="#5B3FD9"
              description="Average prediction confidence"
              delay={0.1}
            />
            <StatsCard
              title="Model features"
              value={loading ? "…" : modelFeatures || "--"}
              numericValue={modelFeatures}
              color="#8A5A00"
              description="Hand landmark features"
              delay={0.15}
            />
            <StatsCard
              title="Predictions"
              value={loading ? "…" : totalPredictions}
              numericValue={totalPredictions}
              color="#1F5FA8"
              description="Recognition requests"
              delay={0.2}
            />
          </div>
        </section>

        {/* MODEL + ENGINE */}
        <section className="grid grid-2" style={{ alignItems: "start" }}>
          <motion.div className="card card-hover" {...fade(0.1)}>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <div>
                <h3 style={{ marginBottom: 0 }}>Model accuracy</h3>
                <p>Training, validation and testing</p>
              </div>
              <span className={`badge ${performanceLevel.badge}`}>{performanceLevel.label}</span>
            </div>

            <div className="stack mt-6" style={{ gap: "var(--space-4)" }}>
              {bars.map((bar) => (
                <div key={bar.label}>
                  <div className="row row-between" style={{ marginBottom: 6 }}>
                    <span className="text-sm text-soft">{bar.label}</span>
                    <span className="text-sm fw-semibold">
                      {loading ? "--" : `${Number(bar.value).toFixed(2)}%`}
                    </span>
                  </div>
                  <div className="progress">
                    <motion.i
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(bar.value, 100)}%` }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                      style={{ background: bar.tone }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="card card-hover" {...fade(0.15)}>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <div>
                <h3 style={{ marginBottom: 0 }}>Recognition engine</h3>
                <p>Current model configuration</p>
              </div>
              <span className="badge badge-pri">{modelName}</span>
            </div>

            <div className="table-wrap mt-4">
              <table>
                <tbody>
                  {[
                    ["Algorithm", modelName],
                    ["Features", modelFeatures || "--"],
                    ["Sign classes", signClasses || "--"],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td className="text-muted">{label}</td>
                      <td className="fw-semibold" style={{ textAlign: "right" }}>{value}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="text-muted">Engine status</td>
                    <td style={{ textAlign: "right" }}>
                      <span className={`badge badge-dot ${modelLoaded ? "badge-ok" : "badge-err"}`}>
                        {modelLoaded ? "Ready" : "Unavailable"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* LATEST */}
        <motion.section className="card spotlight" {...fade(0.1)}>
          <div className="row row-between">
            <div>
              <span className="stat-label">Latest recognition</span>
              {latestPrediction ? (
                <h2 className="mt-2 gradient-text" style={{ fontSize: "2.6rem" }}>{latestLabel}</h2>
              ) : (
                <h3 className="mt-2">No recognition yet</h3>
              )}
            </div>

            {latestPrediction ? (
              <div className="row">
                <div className="card card-flat" style={{ minWidth: 130, padding: "var(--space-3) var(--space-4)" }}>
                  <span className="stat-label">Confidence</span>
                  <div className="stat-value" style={{ fontSize: "var(--fs-xl)" }}>
                    <AnimatedNumber value={latestConfidence} suffix="%" />
                  </div>
                </div>
                <div className="card card-flat" style={{ minWidth: 130, padding: "var(--space-3) var(--space-4)" }}>
                  <span className="stat-label">Model accuracy</span>
                  <div className="stat-value text-ok" style={{ fontSize: "var(--fs-xl)" }}>
                    {modelAccuracy ? `${modelAccuracy}%` : "--"}
                  </div>
                </div>
              </div>
            ) : (
              <span className="badge badge-info">Waiting for recognition activity</span>
            )}
          </div>

          {latestPrediction && (
            <div className="mt-6" style={{ maxWidth: 620 }}>
              <div className="row row-between">
                <span className="text-xs text-muted">Recognition confidence</span>
                <span className="text-xs fw-semibold text-primary">{latestConfidence}%</span>
              </div>
              <div className="progress mt-2">
                <motion.i initial={{ width: 0 }} animate={{ width: `${Math.min(latestConfidence, 100)}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
              </div>
            </div>
          )}
        </motion.section>

        {/* HEALTH */}
        <section className="grid grid-3">
          {[
            {
              title: "Backend service",
              value: "Flask recognition API",
              badge: backendOnline ? "Online" : "Offline",
              tone: backendOnline ? "badge-ok" : "badge-err",
            },
            {
              title: "AI recognition model",
              value: modelName,
              badge: modelLoaded ? "Ready" : "Unavailable",
              tone: modelLoaded ? "badge-ok" : "badge-err",
            },
            {
              title: "Last synchronization",
              value: formatTime(lastUpdated),
              badge: "Synced",
              tone: "badge-ok",
            },
          ].map((item, index) => (
            <motion.div key={item.title} className="card card-hover" {...fade(0.05 * index)}>
              <div className="row row-between">
                <h3 className="m-0" style={{ fontSize: "var(--fs-md)" }}>{item.title}</h3>
                <span className={`badge ${item.tone}`}>{item.badge}</span>
              </div>
              <p className="text-sm text-muted mt-1">{item.value}</p>
            </motion.div>
          ))}
        </section>

        {/* PREDICTIONS */}
        <section>
          <div className="section-head">
            <div>
              <h2>Recent predictions</h2>
              <p>Latest sign recognition activity</p>
            </div>
            <span className="text-sm text-muted">Last {Math.min(predictions.length, 10)} shown</span>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <PredictionHistory predictions={predictions} accuracy={modelAccuracy} loading={loading} />
          </div>

          {!loading && predictions.length === 0 && (
            <div className="empty mt-4">
              <h3>No predictions recorded</h3>
              <p className="hint">Open live detection and hold a sign steady to create the first entry.</p>
            </div>
          )}
        </section>

        <div className="row row-between" style={{ borderTop: "1px solid var(--line)", paddingTop: "var(--space-4)" }}>
          <span className="text-xs text-muted">SignAI monitoring is {backendOnline ? "active" : "offline"}</span>
          <span className="text-xs text-muted">
            Last updated: {formatTime(lastUpdated)}
            {(loading || refreshing) && " · Refreshing…"} · Auto-refresh: 5s
          </span>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
