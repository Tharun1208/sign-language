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

import {
  Activity,
  TrendingUp,
  Target,
  CheckCircle2,
  Brain,
} from "lucide-react";

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
    : "#64748b";

  const gridColor = isDark
    ? "#1e293b"
    : "#e2e8f0";

  const tooltipBackground = isDark
    ? "#0f172a"
    : "#ffffff";

  const tooltipBorder = isDark
    ? "#334155"
    : "#e2e8f0";

  const tooltipText = isDark
    ? "#f8fafc"
    : "#0f172a";

  const tooltipCursor = isDark
    ? "#334155"
    : "#cbd5e1";

  const chartStroke = "#6366f1";

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
    <section
      className="
        group
        relative
        overflow-hidden

        rounded-xl
        sm:rounded-2xl

        border

        p-4
        sm:p-5
        md:p-6
        lg:p-8

        shadow-sm

        transition-all
        duration-300
        ease-out

        border-slate-200
        bg-white
        shadow-slate-200/50

        hover:-translate-y-1
        hover:border-indigo-300
        hover:shadow-xl
        hover:shadow-indigo-500/10

        dark:border-slate-800
        dark:bg-slate-900
        dark:shadow-black/10

        dark:hover:border-indigo-500/30
        dark:hover:shadow-indigo-500/10
      "
    >
      {/* =========================================
          BACKGROUND DECORATION
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16

          h-44
          w-44

          sm:-right-20
          sm:-top-20
          sm:h-56
          sm:w-56

          rounded-full
          bg-indigo-500/5
          blur-3xl

          transition-all
          duration-500

          group-hover:bg-indigo-500/10
          group-hover:scale-110

          dark:bg-indigo-500/10
          dark:group-hover:bg-indigo-500/15
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-20
          -left-16

          h-40
          w-40

          rounded-full
          bg-purple-500/5
          blur-3xl

          transition-all
          duration-500

          group-hover:scale-110
          group-hover:bg-purple-500/10

          dark:bg-purple-500/10
        "
      />

      <div className="relative">
        {/* =========================================
            HEADER
        ========================================= */}

        <div
          className="
            flex
            flex-col
            gap-4

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div
              className="
                flex
                h-10
                w-10

                sm:h-12
                sm:w-12

                shrink-0
                items-center
                justify-center

                rounded-lg
                sm:rounded-xl

                border

                border-indigo-200
                bg-indigo-50
                text-indigo-600

                transition-all
                duration-300

                group-hover:scale-110
                group-hover:rotate-3
                group-hover:bg-indigo-100

                dark:border-indigo-500/20
                dark:bg-indigo-500/10
                dark:text-indigo-400

                dark:group-hover:bg-indigo-500/15
              "
            >
              <Activity
                size={20}
                className="sm:hidden"
              />

              <Activity
                size={24}
                className="hidden sm:block"
              />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-lg
                  font-bold
                  tracking-tight

                  text-slate-900
                  dark:text-white

                  sm:text-xl
                  md:text-2xl

                  transition-colors
                  duration-300

                  group-hover:text-indigo-600
                  dark:group-hover:text-indigo-400
                "
              >
                Model Performance
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5

                  text-slate-500
                  dark:text-slate-400

                  sm:text-sm
                "
              >
                Random Forest evaluation across training stages
              </p>
            </div>
          </div>

          {/* =====================================
              TEST ACCURACY
          ===================================== */}

          <div
            className="
              group/test
              flex
              w-fit
              shrink-0
              items-center
              gap-2.5

              rounded-xl
              border

              px-3
              py-2

              sm:gap-3
              sm:px-4
              sm:py-2.5

              border-emerald-200
              bg-emerald-50

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-emerald-300
              hover:shadow-lg
              hover:shadow-emerald-500/10

              dark:border-emerald-500/20
              dark:bg-emerald-500/10
            "
          >
            <CheckCircle2
              size={17}
              className="
                text-emerald-600
                transition-transform
                duration-300
                group-hover/test:scale-110
                dark:text-emerald-400
              "
            />

            <div>
              <p
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-wider

                  text-slate-500
                  dark:text-slate-500
                "
              >
                Test Accuracy
              </p>

              <p
                className="
                  text-base
                  font-bold

                  text-emerald-600
                  dark:text-emerald-400

                  sm:text-lg
                "
              >
                {testAccuracy}%
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            MODEL INFORMATION
        ========================================= */}

        <div
          className="
            mt-5

            grid
            grid-cols-1
            gap-3

            sm:mt-6
            sm:grid-cols-3
            sm:gap-4
          "
        >
          {/* ALGORITHM */}

          <div
            className="
              group/info
              flex
              items-center
              gap-3

              rounded-xl
              border
              p-4

              border-indigo-200
              bg-indigo-50/50

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-indigo-300
              hover:bg-indigo-50
              hover:shadow-lg
              hover:shadow-indigo-500/10

              dark:border-indigo-500/20
              dark:bg-indigo-500/5

              dark:hover:border-indigo-500/30
              dark:hover:bg-indigo-500/10
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg

                bg-indigo-100
                text-indigo-600

                transition-all
                duration-300

                group-hover/info:scale-110
                group-hover/info:rotate-3

                dark:bg-indigo-500/10
                dark:text-indigo-400
              "
            >
              <Brain size={19} />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Algorithm
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-sm
                  font-semibold

                  text-slate-900
                  dark:text-white
                "
              >
                Random Forest
              </p>
            </div>
          </div>

          {/* TREES */}

          <div
            className="
              group/info
              rounded-xl
              border
              p-4

              border-slate-200
              bg-slate-50

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-indigo-300
              hover:bg-white
              hover:shadow-lg
              hover:shadow-indigo-500/10

              dark:border-slate-800
              dark:bg-slate-950/50

              dark:hover:border-indigo-500/30
              dark:hover:bg-slate-950
            "
          >
            <p
              className="
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              Trees
            </p>

            <p
              className="
                mt-1
                text-lg
                font-bold

                text-slate-900
                dark:text-white

                transition-transform
                duration-300

                group-hover/info:translate-x-1
              "
            >
              300
            </p>
          </div>

          {/* FEATURES */}

          <div
            className="
              group/info
              rounded-xl
              border
              p-4

              border-slate-200
              bg-slate-50

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-indigo-300
              hover:bg-white
              hover:shadow-lg
              hover:shadow-indigo-500/10

              dark:border-slate-800
              dark:bg-slate-950/50

              dark:hover:border-indigo-500/30
              dark:hover:bg-slate-950
            "
          >
            <p
              className="
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              Features
            </p>

            <p
              className="
                mt-1
                text-lg
                font-bold

                text-slate-900
                dark:text-white

                transition-transform
                duration-300

                group-hover/info:translate-x-1
              "
            >
              63
            </p>
          </div>
        </div>

        {/* =========================================
            CHART
        ========================================= */}

        <div
          className="
            mt-6
            h-[280px]
            w-full

            transition-all
            duration-300

            sm:mt-7
            sm:h-[320px]

            md:h-[340px]

            lg:mt-8

            group-hover:scale-[1.005]
          "
        >
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

        <div
          className="
            mt-5

            flex
            flex-col
            gap-3

            sm:mt-6
            sm:grid
            sm:grid-cols-3
            sm:gap-4
          "
        >
          {/* TRAINING */}

          <div
            className="
              group/metric
              rounded-xl
              border
              p-4

              border-blue-200
              bg-blue-50/50

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-blue-300
              hover:bg-blue-50
              hover:shadow-lg
              hover:shadow-blue-500/10

              dark:border-blue-500/20
              dark:bg-blue-500/5

              dark:hover:border-blue-500/30
              dark:hover:bg-blue-500/10
            "
          >
            <div className="flex items-center gap-2">
              <Target
                size={16}
                className="
                  text-blue-600
                  transition-transform
                  duration-300
                  group-hover/metric:scale-110
                  dark:text-blue-400
                "
              />

              <span
                className="
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Training Accuracy
              </span>
            </div>

            <p
              className="
                mt-2
                text-lg
                font-bold

                text-blue-600
                dark:text-blue-400
              "
            >
              {trainingAccuracy.toFixed(2)}%
            </p>
          </div>

          {/* VALIDATION */}

          <div
            className="
              group/metric
              rounded-xl
              border
              p-4

              border-purple-200
              bg-purple-50/50

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-purple-300
              hover:bg-purple-50
              hover:shadow-lg
              hover:shadow-purple-500/10

              dark:border-purple-500/20
              dark:bg-purple-500/5

              dark:hover:border-purple-500/30
              dark:hover:bg-purple-500/10
            "
          >
            <div className="flex items-center gap-2">
              <Activity
                size={16}
                className="
                  text-purple-600
                  transition-transform
                  duration-300
                  group-hover/metric:scale-110
                  dark:text-purple-400
                "
              />

              <span
                className="
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Validation Accuracy
              </span>
            </div>

            <p
              className="
                mt-2
                text-lg
                font-bold

                text-purple-600
                dark:text-purple-400
              "
            >
              {validationAccuracy.toFixed(2)}%
            </p>
          </div>

          {/* TEST */}

          <div
            className="
              group/metric
              rounded-xl
              border
              p-4

              border-emerald-200
              bg-emerald-50/50

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-emerald-300
              hover:bg-emerald-50
              hover:shadow-lg
              hover:shadow-emerald-500/10

              dark:border-emerald-500/20
              dark:bg-emerald-500/5

              dark:hover:border-emerald-500/30
              dark:hover:bg-emerald-500/10
            "
          >
            <div className="flex items-center gap-2">
              <TrendingUp
                size={16}
                className="
                  text-emerald-600
                  transition-transform
                  duration-300
                  group-hover/metric:scale-110
                  dark:text-emerald-400
                "
              />

              <span
                className="
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Test Accuracy
              </span>
            </div>

            <p
              className="
                mt-2
                text-lg
                font-bold

                text-emerald-600
                dark:text-emerald-400
              "
            >
              {testAccuracy.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* =========================================
            IMPROVEMENT INFORMATION
        ========================================= */}

        <div
          className="
            mt-4
            rounded-xl
            border
            p-4

            border-indigo-200
            bg-indigo-50/50

            transition-all
            duration-300

            hover:border-indigo-300
            hover:bg-indigo-50
            hover:shadow-md
            hover:shadow-indigo-500/5

            dark:border-indigo-500/20
            dark:bg-indigo-500/5

            dark:hover:border-indigo-500/30
            dark:hover:bg-indigo-500/10
          "
        >
          <div className="flex items-center gap-3">
            <TrendingUp
              size={18}
              className="
                shrink-0
                text-indigo-600
                dark:text-indigo-400
              "
            />

            <div className="min-w-0">
              <p
                className="
                  text-xs
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Validation → Test Improvement
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-bold
                  text-indigo-600
                  dark:text-indigo-400
                "
              >
                +{improvement} percentage points
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            FOOTER
        ========================================= */}

        <div
          className="
            mt-5

            flex
            items-start
            gap-2

            border-t
            pt-4

            border-slate-200
            dark:border-slate-800

            sm:mt-6
            sm:pt-5
          "
        >
          <CheckCircle2
            size={16}
            className="
              mt-0.5
              shrink-0

              text-emerald-500
              dark:text-emerald-400
            "
          />

          <p
            className="
              text-xs
              leading-5

              text-slate-500
              dark:text-slate-400
            "
          >
            SignAI uses a Random Forest classifier with
            300 trees, 63 hand-landmark features and
            26 A-Z sign language classes. The trained
            model achieved {testAccuracy.toFixed(2)}%
            accuracy on the independent testing dataset.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ModelPerformance;