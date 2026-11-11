import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/*
=========================================================
REAL SIGN LANGUAGE MODEL PERFORMANCE
=========================================================

Algorithm:
Random Forest

Trees:
300

Features:
63

Classes:
26

Training Accuracy:
100.00%

Validation Accuracy:
89.55%

Test Accuracy:
93.63%

IMPORTANT:
Random Forest does not train using epochs like a
Neural Network. Therefore, the chart represents
the three actual evaluation stages of the trained model.
=========================================================
*/

const performanceData = [
  {
    stage: "Training",
    accuracy: 100.0,
  },
  {
    stage: "Validation",
    accuracy: 89.55,
  },
  {
    stage: "Testing",
    accuracy: 93.63,
  },
];

const ModelPerformance = () => {
  const [isDark, setIsDark] = useState(false);

  /* =========================================
      DETECT THEME
  ========================================= */

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(
        document.documentElement.classList.contains("dark")
      );
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  /* =========================================
      CHART COLORS
  ========================================= */

  const axisColor = isDark
    ? "#94a3b8"
    : "#7B7794";

  const gridColor = isDark
    ? "#1e293b"
    : "#DAD5EA";

  const tooltipBackground = isDark
    ? "#0f172a"
    : "#FFFFFF";

  const tooltipBorder = isDark
    ? "#334155"
    : "#DAD5EA";

  const tooltipText = isDark
    ? "#f8fafc"
    : "#17142B";

  const tooltipCursor = isDark
    ? "#334155"
    : "#DAD5EA";

  const chartStroke = "#5B3FD9";

  /* =========================================
      REAL MODEL VALUES
  ========================================= */

  const trainingAccuracy = 100.0;
  const validationAccuracy = 89.55;
  const testAccuracy = 93.63;

  const improvement = (
    testAccuracy - validationAccuracy
  ).toFixed(2);

  return (
    <section className="card stack">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="page-head" style={{ marginBottom: 0, alignItems: "center" }}>
        <div>
          <h3 style={{ marginBottom: 0 }}>Model performance</h3>
          <p className="text-muted text-sm" style={{ marginTop: "4px" }}>
            Random Forest evaluation across training stages
          </p>
        </div>

        <span className="badge badge-ok">
          Test accuracy {testAccuracy}%
        </span>
      </div>

      {/* =========================================
          MODEL INFORMATION
      ========================================= */}

      <div className="grid grid-3">

        {/* ALGORITHM */}

        <div className="card card-flat">
          <p className="stat-label">Algorithm</p>
          <p className="stat-value" style={{ fontSize: "var(--fs-lg)" }}>
            Random Forest
          </p>
        </div>

        {/* TREES */}

        <div className="card card-flat">
          <p className="stat-label">Trees</p>
          <p className="stat-value" style={{ fontSize: "var(--fs-lg)" }}>
            300
          </p>
        </div>

        {/* FEATURES */}

        <div className="card card-flat">
          <p className="stat-label">Features</p>
          <p className="stat-value" style={{ fontSize: "var(--fs-lg)" }}>
            63
          </p>
        </div>

      </div>

      {/* =========================================
          CHART
      ========================================= */}

      <div style={{ height: "300px", width: "100%" }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={performanceData}
            margin={{
              top: 15,
              right: 20,
              left: 5,
              bottom: 10,
            }}
          >
            <CartesianGrid
              stroke={gridColor}
              strokeDasharray="4 4"
              vertical={false}
            />

            {/* =====================================
                X AXIS
            ===================================== */}

            <XAxis
              dataKey="stage"
              stroke={axisColor}
              tick={{
                fill: axisColor,
                fontSize: 11,
              }}
              tickLine={false}
              axisLine={false}
              padding={{
                left: 20,
                right: 20,
              }}
            />

            {/* =====================================
                Y AXIS
            ===================================== */}

            <YAxis
              domain={[80, 100]}
              stroke={axisColor}
              tick={{
                fill: axisColor,
                fontSize: 11,
              }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              width={58}
              allowDecimals={false}
            />

            {/* =====================================
                TOOLTIP
            ===================================== */}

            <Tooltip
              cursor={{
                stroke: tooltipCursor,
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                backgroundColor: tooltipBackground,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "12px",
                color: tooltipText,
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.12)",
              }}
              labelStyle={{
                color: tooltipText,
                fontWeight: 600,
                marginBottom: "4px",
              }}
              itemStyle={{
                color: chartStroke,
                fontWeight: 600,
              }}
              formatter={(value) => [
                `${Number(value).toFixed(2)}%`,
                "Accuracy",
              ]}
            />

            {/* =====================================
                PERFORMANCE LINE
            ===================================== */}

            <Line
              type="monotone"
              dataKey="accuracy"
              stroke={chartStroke}
              strokeWidth={3}

              dot={{
                r: 5,
                fill: chartStroke,
                strokeWidth: 2,
                stroke: isDark
                  ? "#0f172a"
                  : "#ffffff",
              }}

              activeDot={{
                r: 7,
                fill: chartStroke,
                stroke: isDark
                  ? "#0f172a"
                  : "#ffffff",
                strokeWidth: 3,
              }}

              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* =========================================
          PERFORMANCE SUMMARY
      ========================================= */}

      <div className="grid grid-3">

        {/* TRAINING */}

        <div className="card card-flat">
          <p className="stat-label">Training accuracy</p>
          <p className="stat-value" style={{ fontSize: "var(--fs-lg)" }}>
            {trainingAccuracy.toFixed(2)}%
          </p>
        </div>

        {/* VALIDATION */}

        <div className="card card-flat">
          <p className="stat-label">Validation accuracy</p>
          <p className="stat-value" style={{ fontSize: "var(--fs-lg)" }}>
            {validationAccuracy.toFixed(2)}%
          </p>
        </div>

        {/* TEST */}

        <div className="card card-flat">
          <p className="stat-label">Test accuracy</p>
          <p className="stat-value text-ok" style={{ fontSize: "var(--fs-lg)" }}>
            {testAccuracy.toFixed(2)}%
          </p>
        </div>

      </div>

      {/* =========================================
          IMPROVEMENT INFORMATION
      ========================================= */}

      <div className="alert alert-info" style={{ marginBottom: 0 }}>
        <b>Validation → test improvement</b>
        <span className="text-sm">
          +{improvement} percentage points
        </span>
      </div>

      {/* =========================================
          FOOTER
      ========================================= */}

      <p
        className="text-muted text-xs"
        style={{
          paddingTop: "var(--space-4)",
          borderTop: "var(--bw) solid var(--line)",
        }}
      >
        SignAI uses a Random Forest classifier with
        300 trees, 63 hand-landmark features and
        26 A-Z sign language classes. The trained
        model achieved {testAccuracy.toFixed(2)}%
        accuracy on the independent testing dataset.
      </p>

    </section>
  );
};

export default ModelPerformance;
