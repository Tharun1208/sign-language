const DatasetStats = () => {
  const statistics = [
    {
      label: "Classes",
      value: "26",
      description: "A-Z sign language classes",
    },
    {
      label: "Training Images",
      value: "18,198",
      description: "Training dataset",
    },
    {
      label: "Validation Images",
      value: "2,579",
      description: "Validation dataset",
    },
    {
      label: "Test Images",
      value: "5,200",
      description: "Testing dataset",
    },
  ];

  return (
    <section className="card stack">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-head" style={{ marginBottom: 0, alignItems: "center" }}>
        <div>
          <h3 style={{ marginBottom: 0 }}>Dataset statistics</h3>
          <p className="text-muted text-sm" style={{ marginTop: "4px" }}>
            Overview of the SignAI A-Z sign language dataset
          </p>
        </div>

        <span className="badge badge-ok">Dataset ready</span>
      </div>

      {/* =====================================================
          DATASET STATISTICS
      ===================================================== */}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Split</th>
              <th>Description</th>
              <th style={{ textAlign: "right" }}>Images</th>
            </tr>
          </thead>
          <tbody>
            {statistics.map((stat) => (
              <tr key={stat.label}>
                <td className="fw-semibold">{stat.label}</td>
                <td className="text-muted">{stat.description}</td>
                <td className="fw-bold" style={{ textAlign: "right" }}>
                  {stat.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          MODEL + ACCURACY
      ===================================================== */}

      <div className="grid grid-2">

        {/* MODEL */}

        <div className="card card-flat">
          <p className="stat-label">Model algorithm</p>
          <p className="stat-value" style={{ fontSize: "var(--fs-xl)" }}>
            Random Forest Classifier
          </p>
          <p className="stat-meta">300 decision trees · 63 features</p>
        </div>

        {/* TEST ACCURACY */}

        <div className="card card-flat">
          <p className="stat-label">Test accuracy</p>
          <p className="stat-value text-ok">93.63%</p>
          <div className="progress" style={{ marginTop: "var(--space-3)" }}>
            <i style={{ width: "93.63%" }} />
          </div>
        </div>

      </div>

      {/* =====================================================
          ADDITIONAL MODEL METRICS
      ===================================================== */}

      <div className="grid grid-3">

        {/* Training Accuracy */}

        <div className="card card-flat">
          <p className="stat-label">Training accuracy</p>
          <p className="stat-value" style={{ fontSize: "var(--fs-xl)" }}>
            100.00%
          </p>
        </div>

        {/* Validation Accuracy */}

        <div className="card card-flat">
          <p className="stat-label">Validation accuracy</p>
          <p className="stat-value" style={{ fontSize: "var(--fs-xl)" }}>
            89.55%
          </p>
        </div>

        {/* Usable Samples */}

        <div className="card card-flat">
          <p className="stat-label">Usable samples</p>
          <p className="stat-value" style={{ fontSize: "var(--fs-xl)" }}>
            23,156
          </p>
        </div>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <p
        className="text-muted text-xs"
        style={{
          paddingTop: "var(--space-4)",
          borderTop: "var(--bw) solid var(--line)",
        }}
      >
        SignAI uses 25,977 dataset images across 26 A-Z
        sign language classes. 23,156 images contained
        detectable hand landmarks and were used by the
        machine-learning pipeline.
      </p>

    </section>
  );
};

export default DatasetStats;
