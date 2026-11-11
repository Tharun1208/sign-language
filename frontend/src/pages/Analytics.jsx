import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import ModelPerformance from "../components/analytics/ModelPerformance";
import DatasetStats from "../components/analytics/DataSetStats";
import AnimatedNumber from "../components/ui/AnimatedNumber";
import { apiFetch } from "../services/api";

const fallback = {
  test: 93.63,
  validation: 89.55,
  training: 100,
  trees: 300,
  features: 63,
  classes: 26,
  loaded: true,
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const Analytics = () => {
  const [model, setModel] = useState(fallback);
  const [source, setSource] = useState("reference");

  useEffect(() => {
    let active = true;

    apiFetch("/api/health")
      .then((data) => {
        if (!active || !data?.success) return;
        setSource("live");
        setModel({
          test: Number(data.test_accuracy_percent ?? fallback.test),
          validation: Number(data.validation_accuracy_percent ?? fallback.validation),
          training: Number(data.training_accuracy_percent ?? fallback.training),
          trees: Number(data.n_estimators ?? data.tree_count ?? fallback.trees),
          features: Number(data.feature_count ?? fallback.features),
          classes: Number(data.number_of_labels ?? data.labels?.length ?? fallback.classes),
          loaded: data.model_loaded !== false,
        });
      })
      .catch(() => {
        /* keep reference values when the backend is unavailable */
      });

    return () => {
      active = false;
    };
  }, []);

  const metrics = [
    {
      label: "Test accuracy",
      value: model.test,
      decimals: 2,
      suffix: "%",
      accent: "#14805F",
      meta: "Independent testing dataset",
      progress: model.test,
    },
    {
      label: "Validation accuracy",
      value: model.validation,
      decimals: 2,
      suffix: "%",
      accent: "#5B3FD9",
      meta: "Held-out validation split",
      progress: model.validation,
    },
    {
      label: "Recognition model",
      value: "Random Forest",
      accent: "#1F5FA8",
      meta: `${model.trees} decision trees`,
    },
    {
      label: "Gesture classes",
      value: model.classes,
      accent: "#8A5A00",
      meta: "A–Z alphabet categories",
    },
  ];

  return (
    <>
      <div className="stack" style={{ gap: "var(--space-6)" }}>
        <motion.header className="page-head" {...fade()}>
          <div>
            <span className="eyebrow">Transparency</span>
            <h1 className="mt-2">Dataset and model</h1>
            <p style={{ maxWidth: "66ch" }}>
              Inspect the SignAI Random Forest recognition model and the dataset
              used to train, validate and evaluate the system.
            </p>
          </div>

          <div className="row">
            <span className={`badge badge-dot ${model.loaded ? "badge-ok" : "badge-err"}`}>
              {model.loaded ? "Model ready" : "Model unavailable"}
            </span>
            <span className="badge badge-pri">
              {source === "live" ? "Live backend values" : "Reference values"}
            </span>
          </div>
        </motion.header>

        <section className="grid grid-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="card stat-card card-hover"
              style={{ "--accent": metric.accent }}
              {...fade(0.05 * index)}
            >
              <p className="stat-label">{metric.label}</p>
              <p className="stat-value">
                {typeof metric.value === "number" ? (
                  <AnimatedNumber
                    value={metric.value}
                    decimals={metric.decimals || 0}
                    suffix={metric.suffix || ""}
                  />
                ) : (
                  metric.value
                )}
              </p>

              {metric.progress != null && (
                <div className="progress" style={{ marginTop: "var(--space-3)" }}>
                  <motion.i
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(metric.progress, 100)}%` }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                  />
                </div>
              )}

              <p className="stat-meta">{metric.meta}</p>
            </motion.div>
          ))}
        </section>

        <section className="stack">
          <div className="section-head">
            <div>
              <h2>Model specifications</h2>
              <p>Configuration and readiness information</p>
            </div>
          </div>

          <div className="grid grid-3">
            {[
              ["Number of trees", model.trees],
              ["Input features", model.features],
            ].map(([label, value]) => (
              <div key={label} className="card card-hover">
                <p className="stat-label">{label}</p>
                <p className="stat-value">
                  <AnimatedNumber value={Number(value) || 0} />
                </p>
              </div>
            ))}

            <div className="card card-hover">
              <p className="stat-label">Model status</p>
              <div className="row" style={{ marginTop: "6px" }}>
                <p className="stat-value text-ok" style={{ marginTop: 0, fontSize: "var(--fs-xl)" }}>
                  {model.loaded ? "Ready" : "Offline"}
                </p>
                <span className={`badge ${model.loaded ? "badge-ok" : "badge-err"}`}>
                  {model.loaded ? "Online" : "Unavailable"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="stack">
          <div className="section-head">
            <div>
              <h2>Performance analytics</h2>
              <p>Model performance and dataset distribution</p>
            </div>
          </div>

          <div className="grid grid-2">
            <div style={{ minWidth: 0 }}>
              <ModelPerformance />
            </div>

            <div style={{ minWidth: 0 }}>
              <DatasetStats />
            </div>
          </div>
        </section>

        <section className="card">
          <div className="row row-between">
            <div>
              <h3 style={{ marginBottom: 0 }}>Dataset summary</h3>
              <p className="text-muted text-sm" style={{ marginTop: "4px" }}>
                Dataset used for model development
              </p>
            </div>

            <span className="badge badge-ok">23,156 usable samples</span>
          </div>

          <div className="grid grid-4" style={{ marginTop: "var(--space-5)" }}>
            {[
              ["Training images", 18198, ""],
              ["Validation images", 2579, ""],
              ["Testing images", 5200, ""],
              ["Total images", 25977, "text-primary"],
            ].map(([label, value, tone]) => (
              <div key={label}>
                <p className="stat-label">{label}</p>
                <p className={`stat-value ${tone}`} style={{ fontSize: "var(--fs-xl)" }}>
                  <AnimatedNumber value={value} />
                </p>
              </div>
            ))}
          </div>

          <div
            className="row row-between"
            style={{
              marginTop: "var(--space-5)",
              paddingTop: "var(--space-4)",
              borderTop: "var(--bw) solid var(--line)",
            }}
          >
            <span className="text-muted text-xs">
              23,156 samples contain detected hand landmarks across {model.classes} gesture classes.
            </span>
            <span className="text-muted text-xs fw-semibold">
              {model.features} input features
            </span>
          </div>
        </section>
      </div>
    </>
  );
};

export default Analytics;
