import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Brain,
  Target,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Database,
  Layers3,
  Zap,
  ShieldCheck,
  BarChart3,
  Cpu,
  Clock3,
  ChevronRight,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatsCard from "../components/dashboard/Statscard";
import PredictionHistory from "../components/dashboard/PredictionHistory";

const API_URL = import.meta.env.VITE_API_URL;

const REFRESH_INTERVAL = 5000;

const Dashboard = () => {
  /* =========================================================
     STATE
  ========================================================= */

  const [health, setHealth] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  /* =========================================================
     FETCH HEALTH
  ========================================================= */

  const fetchHealth = async () => {
    const response = await fetch(`${API_URL}/api/health`);

    if (!response.ok) {
      throw new Error(`Health request failed: ${response.status}`);
    }

    const data = await response.json();

    setHealth(data);

    return data;
  };

  /* =========================================================
     FETCH PREDICTIONS
  ========================================================= */

  const fetchPredictions = async () => {
    const response = await fetch(`${API_URL}/api/predictions`);

    if (!response.ok) {
      throw new Error(
        `Prediction request failed: ${response.status}`
      );
    }

    const data = await response.json();

    if (data.success) {
      setPredictions(
        Array.isArray(data.predictions)
          ? data.predictions
          : []
      );
    } else {
      setPredictions([]);
    }

    return data;
  };

  /* =========================================================
     LOAD DASHBOARD
  ========================================================= */

  const loadDashboard = async (manual = false) => {
    if (manual) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      await Promise.all([
        fetchHealth(),
        fetchPredictions(),
      ]);

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Dashboard loading error:", err);

      setError(
        "Unable to connect to the SignAI backend. Please check whether the Flask server is running."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadDashboard();
  }, []);

  /* =========================================================
     AUTO REFRESH
  ========================================================= */

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await Promise.all([
          fetchHealth(),
          fetchPredictions(),
        ]);

        setLastUpdated(new Date());
      } catch (err) {
        console.error(
          "Dashboard auto-refresh error:",
          err
        );
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  /* =========================================================
     DERIVED DATA
  ========================================================= */

  const modelAccuracy = Number(
    health?.test_accuracy_percent ?? 0
  );

  const trainingAccuracy = Number(
    health?.training_accuracy_percent ?? 0
  );

  const validationAccuracy = Number(
    health?.validation_accuracy_percent ?? 0
  );

  const signClasses =
    health?.number_of_labels ??
    health?.labels?.length ??
    0;

  const modelFeatures = health?.feature_count ?? 0;

  const modelName =
    health?.model_name ||
    health?.algorithm ||
    "Random Forest";

  const modelLoaded =
    health?.model_loaded === true;

  const backendOnline =
    health?.success === true &&
    health?.status === "online";

  /* =========================================================
     TOTAL PREDICTIONS
  ========================================================= */

  const totalPredictions = useMemo(() => {
    return predictions.length;
  }, [predictions]);

  /* =========================================================
     AVERAGE CONFIDENCE
  ========================================================= */

  const averageConfidence = useMemo(() => {
    if (!predictions.length) {
      return 0;
    }

    const validPredictions = predictions.filter(
      (prediction) =>
        typeof prediction.confidence === "number"
    );

    if (!validPredictions.length) {
      return 0;
    }

    const total = validPredictions.reduce(
      (sum, prediction) =>
        sum + prediction.confidence,
      0
    );

    return Number(
      (
        (total / validPredictions.length) *
        100
      ).toFixed(2)
    );
  }, [predictions]);

  /* =========================================================
     LATEST PREDICTION
  ========================================================= */

  const latestPrediction = useMemo(() => {
    if (!predictions.length) {
      return null;
    }

    return predictions[0];
  }, [predictions]);

  const latestLabel =
    latestPrediction?.label ||
    latestPrediction?.prediction ||
    "--";

  const latestConfidence = useMemo(() => {
    if (!latestPrediction) {
      return 0;
    }

    if (
      latestPrediction.confidence_percent != null
    ) {
      return Number(
        latestPrediction.confidence_percent
      );
    }

    if (
      typeof latestPrediction.confidence ===
      "number"
    ) {
      return Number(
        (
          latestPrediction.confidence * 100
        ).toFixed(2)
      );
    }

    return 0;
  }, [latestPrediction]);

  /* =========================================================
     TIME FORMAT
  ========================================================= */

  const formatTime = (date) => {
    if (!date) {
      return "--";
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  /* =========================================================
     PERFORMANCE LEVEL
  ========================================================= */

  const performanceLevel = useMemo(() => {
    if (modelAccuracy >= 95) {
      return {
        label: "Excellent",
        text: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-500/10",
      };
    }

    if (modelAccuracy >= 85) {
      return {
        label: "Very Good",
        text: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-500/10",
      };
    }

    if (modelAccuracy >= 70) {
      return {
        label: "Good",
        text: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-500/10",
      };
    }

    return {
      label: "Needs Improvement",
      text: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-500/10",
    };
  }, [modelAccuracy]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-8">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          className="
            group
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm

            transition-all
            duration-300

            hover:border-indigo-200
            hover:shadow-xl
            hover:shadow-indigo-500/5

            dark:border-slate-800
            dark:bg-slate-900

            sm:p-8
            lg:p-10
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-indigo-500/10
              blur-3xl
              transition-all
              duration-500
              group-hover:bg-indigo-500/20
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              left-1/3
              h-72
              w-72
              rounded-full
              bg-purple-500/10
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              right-1/3
              top-1/2
              h-32
              w-32
              rounded-full
              bg-cyan-500/5
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-8

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div className="max-w-3xl">

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-indigo-200
                  bg-indigo-50
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-indigo-600

                  dark:border-indigo-500/20
                  dark:bg-indigo-500/10
                  dark:text-indigo-400
                "
              >
                <Sparkles size={14} />

                AI Recognition Center

                <span
                  className="
                    h-1
                    w-1
                    rounded-full
                    bg-indigo-400
                  "
                />

                Live
              </div>

              <h1
                className="
                  text-3xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-white

                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Welcome to your{" "}
                <span
                  className="
                    bg-gradient-to-r
                    from-indigo-600
                    via-purple-600
                    to-cyan-500
                    bg-clip-text
                    text-transparent
                  "
                >
                  SignAI Dashboard
                </span>
              </h1>

              <p
                className="
                  mt-4
                  max-w-2xl
                  text-sm
                  leading-7
                  text-slate-500
                  dark:text-slate-400
                  sm:text-base
                "
              >
                Monitor your sign language recognition
                engine, model accuracy, prediction
                confidence, and real-time recognition
                activity from one intelligent workspace.
              </p>

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >
                <div
                  className={`
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    ${
                      backendOnline
                        ? `
                          border-emerald-200
                          bg-emerald-50
                          text-emerald-700
                          dark:border-emerald-500/20
                          dark:bg-emerald-500/10
                          dark:text-emerald-400
                        `
                        : `
                          border-red-200
                          bg-red-50
                          text-red-700
                          dark:border-red-500/20
                          dark:bg-red-500/10
                          dark:text-red-400
                        `
                    }
                  `}
                >
                  <span
                    className={`
                      h-2
                      w-2
                      rounded-full
                      ${
                        backendOnline
                          ? "animate-pulse bg-emerald-500"
                          : "bg-red-500"
                      }
                    `}
                  />

                  {backendOnline
                    ? "Backend Online"
                    : "Backend Offline"}
                </div>

                <div
                  className={`
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    ${
                      modelLoaded
                        ? `
                          border-indigo-200
                          bg-indigo-50
                          text-indigo-700
                          dark:border-indigo-500/20
                          dark:bg-indigo-500/10
                          dark:text-indigo-400
                        `
                        : `
                          border-red-200
                          bg-red-50
                          text-red-700
                          dark:border-red-500/20
                          dark:bg-red-500/10
                          dark:text-red-400
                        `
                    }
                  `}
                >
                  <Cpu size={13} />

                  {modelLoaded
                    ? "Model Ready"
                    : "Model Unavailable"}
                </div>
              </div>
            </div>

            <div
              className="
                relative
                flex
                shrink-0
                flex-col
                items-center
                justify-center
                rounded-3xl
                border
                border-indigo-100
                bg-gradient-to-br
                from-indigo-50
                to-purple-50
                p-6
                text-center

                transition-all
                duration-500

                hover:-translate-y-1
                hover:shadow-xl
                hover:shadow-indigo-500/10

                dark:border-indigo-500/20
                dark:from-indigo-500/10
                dark:to-purple-500/5

                sm:min-w-[220px]
              "
            >
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white
                  text-indigo-600
                  shadow-lg
                  shadow-indigo-500/10

                  transition-transform
                  duration-500

                  hover:scale-110

                  dark:bg-slate-900
                  dark:text-indigo-400
                "
              >
                <Brain size={30} />
              </div>

              <p
                className="
                  mt-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-widest
                  text-slate-400
                "
              >
                Model Performance
              </p>

              <p
                className="
                  mt-1
                  text-4xl
                  font-bold
                  text-slate-900
                  dark:text-white
                "
              >
                {loading
                  ? "..."
                  : modelAccuracy
                  ? `${modelAccuracy.toFixed(1)}%`
                  : "--"}
              </p>

              <div
                className={`
                  mt-2
                  rounded-full
                  px-3
                  py-1
                  text-[11px]
                  font-bold
                  ${performanceLevel.bg}
                  ${performanceLevel.text}
                `}
              >
                {performanceLevel.label}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <section
            className="
              flex
              flex-col
              gap-4
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-5

              dark:border-red-500/20
              dark:bg-red-500/5

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-red-700
                    dark:text-red-400
                  "
                >
                  Backend Connection Error
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-red-600
                    dark:text-red-400/80
                  "
                >
                  {error}
                </p>
              </div>
            </div>

            <button
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
              className="
                flex
                w-fit
                items-center
                gap-2
                rounded-xl
                border
                border-red-200
                bg-white
                px-4
                py-2.5
                text-xs
                font-semibold
                text-red-600

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:bg-red-50
                hover:shadow-md

                disabled:cursor-not-allowed
                disabled:opacity-60

                dark:border-red-500/20
                dark:bg-slate-900
                dark:text-red-400
              "
            >
              <RefreshCw
                size={14}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Retry Connection
            </button>
          </section>
        )}

        {/* =====================================================
            QUICK METRICS
        ===================================================== */}

        <section>
          <div
            className="
              mb-4
              flex
              items-center
              justify-between
            "
          >
            <div>
              <div className="flex items-center gap-2">
                <Activity
                  size={17}
                  className="text-indigo-500"
                />

                <h2
                  className="
                    text-lg
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Recognition Metrics
                </h2>
              </div>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Live performance indicators
              </p>
            </div>

            <button
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
              title="Refresh dashboard"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                text-slate-500

                transition-all
                duration-300

                hover:scale-105
                hover:border-indigo-200
                hover:bg-indigo-50
                hover:text-indigo-600

                disabled:opacity-50

                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-400
                dark:hover:bg-indigo-500/10
                dark:hover:text-indigo-400
              "
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>

          <div
            className="
              grid
              grid-cols-1
              gap-4

              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            <div
              className="
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >
              <StatsCard
                title="Test Accuracy"
                value={
                  loading
                    ? "..."
                    : modelAccuracy
                    ? `${modelAccuracy}%`
                    : "--"
                }
                color="#16A34A"
                icon={Target}
                description="Final model test accuracy"
              />
            </div>

            <div
              className="
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >
              <StatsCard
                title="Avg. Confidence"
                value={
                  loading
                    ? "..."
                    : `${averageConfidence}%`
                }
                color="#9333EA"
                icon={TrendingUp}
                description="Average prediction confidence"
              />
            </div>

            <div
              className="
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >
              <StatsCard
                title="Model Features"
                value={
                  loading
                    ? "..."
                    : modelFeatures || "--"
                }
                color="#EAB308"
                icon={Database}
                description="Hand landmark features"
              />
            </div>

            <div
              className="
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >
              <StatsCard
                title="Predictions"
                value={
                  loading
                    ? "..."
                    : totalPredictions
                }
                color="#2563EB"
                icon={Brain}
                description="Recognition requests"
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            MODEL ANALYTICS
        ===================================================== */}

        <section
          className="
            grid
            grid-cols-1
            gap-5

            xl:grid-cols-[1.4fr_0.8fr]
          "
        >

          {/* ===================================================
              MODEL ACCURACY
          =================================================== */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm

              transition-all
              duration-500
              ease-out

              hover:-translate-y-2
              hover:border-emerald-300
              hover:shadow-2xl
              hover:shadow-emerald-500/10

              dark:border-slate-800
              dark:bg-slate-900

              dark:hover:border-emerald-500/40
              dark:hover:shadow-emerald-500/10
            "
          >

            {/* Animated glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-48
                w-48
                rounded-full
                bg-emerald-500/10
                blur-3xl

                transition-all
                duration-700

                group-hover:scale-150
                group-hover:bg-emerald-500/20
              "
            />

            {/* Hover gradient */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-3xl
                bg-gradient-to-br
                from-emerald-500/0
                via-transparent
                to-emerald-500/0

                transition-all
                duration-500

                group-hover:from-emerald-500/[0.04]
                group-hover:to-emerald-500/[0.08]
              "
            />

            <div
              className="
                relative
                z-10
                flex
                flex-col
                gap-6
              "
            >

              <div
                className="
                  flex
                  items-start
                  justify-between
                "
              >
                <div>
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <BarChart3
                      size={18}
                      className="
                        text-emerald-500
                        transition-transform
                        duration-300
                        group-hover:scale-110
                      "
                    />

                    <h2
                      className="
                        text-base
                        font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      Model Accuracy
                    </h2>
                  </div>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Comparison across training,
                    validation and testing datasets
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    bg-emerald-50
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-emerald-600

                    transition-all
                    duration-300

                    group-hover:scale-105
                    group-hover:shadow-md
                    group-hover:shadow-emerald-500/10

                    dark:bg-emerald-500/10
                    dark:text-emerald-400
                  "
                >
                  {performanceLevel.label}
                </div>
              </div>

              <div
                className="
                  flex
                  flex-col
                  gap-6

                  md:flex-row
                  md:items-center
                "
              >

                {/* Accuracy circle */}

                <div
                  className="
                    relative
                    flex
                    h-36
                    w-36
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-[10px]
                    border-emerald-100

                    transition-all
                    duration-500

                    group-hover:scale-105
                    group-hover:shadow-xl
                    group-hover:shadow-emerald-500/10

                    dark:border-emerald-500/10
                  "
                  style={{
                    background: `conic-gradient(
                      #10b981 ${Math.min(
                        modelAccuracy,
                        100
                      )}%,
                      transparent 0
                    )`,
                  }}
                >
                  <div
                    className="
                      flex
                      h-28
                      w-28
                      flex-col
                      items-center
                      justify-center
                      rounded-full
                      bg-white

                      dark:bg-slate-900
                    "
                  >
                    <span
                      className="
                        text-3xl
                        font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {loading
                        ? "..."
                        : modelAccuracy
                        ? `${modelAccuracy.toFixed(
                            1
                          )}%`
                        : "--"}
                    </span>

                    <span
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-400
                      "
                    >
                      Test
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-4">

                  {/* Training */}

                  <div>
                    <div
                      className="
                        mb-2
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <span
                        className="
                          text-xs
                          font-medium
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Training
                      </span>

                      <span
                        className="
                          text-xs
                          font-bold
                          text-slate-900
                          dark:text-white
                        "
                      >
                        {loading
                          ? "--"
                          : trainingAccuracy
                          ? `${trainingAccuracy.toFixed(
                              2
                            )}%`
                          : "--"}
                      </span>
                    </div>

                    <div
                      className="
                        h-2
                        overflow-hidden
                        rounded-full
                        bg-slate-100

                        dark:bg-slate-800
                      "
                    >
                      <div
                        className="
                          h-full
                          rounded-full
                          bg-emerald-400
                          transition-all
                          duration-1000
                          group-hover:brightness-110
                        "
                        style={{
                          width: `${Math.min(
                            trainingAccuracy,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Validation */}

                  <div>
                    <div
                      className="
                        mb-2
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <span
                        className="
                          text-xs
                          font-medium
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Validation
                      </span>

                      <span
                        className="
                          text-xs
                          font-bold
                          text-slate-900
                          dark:text-white
                        "
                      >
                        {loading
                          ? "--"
                          : validationAccuracy
                          ? `${validationAccuracy.toFixed(
                              2
                            )}%`
                          : "--"}
                      </span>
                    </div>

                    <div
                      className="
                        h-2
                        overflow-hidden
                        rounded-full
                        bg-slate-100

                        dark:bg-slate-800
                      "
                    >
                      <div
                        className="
                          h-full
                          rounded-full
                          bg-indigo-500
                          transition-all
                          duration-1000
                          group-hover:brightness-110
                        "
                        style={{
                          width: `${Math.min(
                            validationAccuracy,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Testing */}

                  <div>
                    <div
                      className="
                        mb-2
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <span
                        className="
                          text-xs
                          font-medium
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Testing
                      </span>

                      <span
                        className="
                          text-xs
                          font-bold
                          text-emerald-600
                          dark:text-emerald-400
                        "
                      >
                        {loading
                          ? "--"
                          : modelAccuracy
                          ? `${modelAccuracy.toFixed(
                              2
                            )}%`
                          : "--"}
                      </span>
                    </div>

                    <div
                      className="
                        h-2
                        overflow-hidden
                        rounded-full
                        bg-slate-100

                        dark:bg-slate-800
                      "
                    >
                      <div
                        className="
                          h-full
                          rounded-full
                          bg-emerald-500
                          transition-all
                          duration-1000
                          group-hover:brightness-110
                        "
                        style={{
                          width: `${Math.min(
                            modelAccuracy,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================
              RECOGNITION ENGINE
          =================================================== */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm

              transition-all
              duration-500
              ease-out

              hover:-translate-y-2
              hover:border-indigo-300
              hover:shadow-2xl
              hover:shadow-indigo-500/10

              dark:border-slate-800
              dark:bg-slate-900

              dark:hover:border-indigo-500/40
              dark:hover:shadow-indigo-500/10
            "
          >

            {/* Top glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                h-40
                w-40
                rounded-full
                bg-indigo-500/10
                blur-3xl

                transition-all
                duration-700

                group-hover:scale-150
                group-hover:bg-indigo-500/20
              "
            />

            {/* Bottom glow */}

            <div
              className="
                pointer-events-none
                absolute
                -bottom-20
                -left-20
                h-36
                w-36
                rounded-full
                bg-purple-500/5
                blur-3xl

                transition-all
                duration-700

                group-hover:scale-150
                group-hover:bg-purple-500/15
              "
            />

            {/* Hover overlay */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-3xl
                bg-gradient-to-br
                from-indigo-500/0
                via-transparent
                to-purple-500/0

                transition-all
                duration-500

                group-hover:from-indigo-500/[0.04]
                group-hover:to-purple-500/[0.07]
              "
            />

            <div className="relative z-10">

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Layers3
                  size={18}
                  className="
                    text-indigo-500
                    transition-all
                    duration-300

                    group-hover:scale-110
                    group-hover:rotate-6
                  "
                />

                <h2
                  className="
                    text-base
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Recognition Engine
                </h2>
              </div>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Current model configuration
              </p>

              <div className="mt-6 space-y-3">

                {/* Algorithm */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-slate-100
                    bg-slate-50
                    p-3

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:border-indigo-200
                    hover:bg-indigo-50
                    hover:shadow-md

                    dark:border-slate-800
                    dark:bg-slate-950/50

                    dark:hover:border-indigo-500/30
                    dark:hover:bg-indigo-500/5
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <Cpu
                      size={16}
                      className="
                        text-indigo-500
                        transition-transform
                        duration-300
                      "
                    />

                    <span
                      className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Algorithm
                    </span>
                  </div>

                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {modelName}
                  </span>
                </div>

                {/* Features */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-slate-100
                    bg-slate-50
                    p-3

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:border-amber-200
                    hover:bg-amber-50
                    hover:shadow-md

                    dark:border-slate-800
                    dark:bg-slate-950/50

                    dark:hover:border-amber-500/30
                    dark:hover:bg-amber-500/5
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <Database
                      size={16}
                      className="
                        text-amber-500
                        transition-transform
                        duration-300
                      "
                    />

                    <span
                      className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Features
                    </span>
                  </div>

                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {modelFeatures || "--"}
                  </span>
                </div>

                {/* Sign Classes */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-slate-100
                    bg-slate-50
                    p-3

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:border-purple-200
                    hover:bg-purple-50
                    hover:shadow-md

                    dark:border-slate-800
                    dark:bg-slate-950/50

                    dark:hover:border-purple-500/30
                    dark:hover:bg-purple-500/5
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <Brain
                      size={16}
                      className="
                        text-purple-500
                        transition-transform
                        duration-300
                      "
                    />

                    <span
                      className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Sign Classes
                    </span>
                  </div>

                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {signClasses || "--"}
                  </span>
                </div>

                {/* Status */}

                <div
                  className={`
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    p-3

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:shadow-md

                    ${
                      modelLoaded
                        ? `
                          border-emerald-100
                          bg-emerald-50/70
                          hover:border-emerald-300
                          hover:bg-emerald-50

                          dark:border-emerald-500/20
                          dark:bg-emerald-500/5
                          dark:hover:border-emerald-500/40
                        `
                        : `
                          border-red-100
                          bg-red-50/70
                          hover:border-red-300
                          hover:bg-red-50

                          dark:border-red-500/20
                          dark:bg-red-500/5
                          dark:hover:border-red-500/40
                        `
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    {modelLoaded ? (
                      <CheckCircle2
                        size={16}
                        className="
                          text-emerald-500
                          transition-transform
                          duration-300
                        "
                      />
                    ) : (
                      <AlertCircle
                        size={16}
                        className="text-red-500"
                      />
                    )}

                    <span
                      className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Engine Status
                    </span>
                  </div>

                  <span
                    className={`
                      text-xs
                      font-bold
                      ${
                        modelLoaded
                          ? `
                            text-emerald-600
                            dark:text-emerald-400
                          `
                          : `
                            text-red-600
                            dark:text-red-400
                          `
                      }
                    `}
                  >
                    {modelLoaded
                      ? "Ready"
                      : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            LATEST RECOGNITION
        ===================================================== */}

        <section
          className="
            group
            relative
            overflow-hidden
            rounded-3xl
            border
            border-indigo-200
            bg-gradient-to-br
            from-indigo-50
            via-white
            to-purple-50
            p-6

            transition-all
            duration-500

            hover:-translate-y-1
            hover:shadow-xl
            hover:shadow-indigo-500/10

            dark:border-indigo-500/20
            dark:from-indigo-500/10
            dark:via-slate-900
            dark:to-purple-500/5

            sm:p-8
          "
        >
          <div
            className="
              absolute
              -right-24
              -top-24
              h-64
              w-64
              rounded-full
              bg-indigo-500/10
              blur-3xl

              transition-all
              duration-700

              group-hover:scale-150
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-6

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div
              className="
                flex
                items-center
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-indigo-600
                  text-white
                  shadow-lg
                  shadow-indigo-500/20

                  transition-transform
                  duration-500

                  group-hover:scale-110
                  group-hover:rotate-3
                "
              >
                <Zap size={26} />
              </div>

              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-indigo-600
                    dark:text-indigo-400
                  "
                >
                  Latest Recognition
                </p>

                {latestPrediction ? (
                  <h2
                    className="
                      mt-1
                      text-3xl
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {latestLabel}
                  </h2>
                ) : (
                  <h2
                    className="
                      mt-1
                      text-xl
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    No recognition yet
                  </h2>
                )}
              </div>
            </div>

            {latestPrediction ? (
              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                  sm:flex
                "
              >
                <div
                  className="
                    min-w-[130px]
                    rounded-2xl
                    border
                    border-indigo-100
                    bg-white/80
                    px-5
                    py-4
                    backdrop-blur

                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:shadow-lg

                    dark:border-indigo-500/20
                    dark:bg-slate-900/70
                  "
                >
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    Confidence
                  </p>

                  <p
                    className="
                      mt-1
                      text-2xl
                      font-bold
                      text-indigo-600
                      dark:text-indigo-400
                    "
                  >
                    {latestConfidence}%
                  </p>
                </div>

                <div
                  className="
                    min-w-[130px]
                    rounded-2xl
                    border
                    border-emerald-100
                    bg-emerald-50/70
                    px-5
                    py-4

                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:shadow-lg

                    dark:border-emerald-500/20
                    dark:bg-emerald-500/5
                  "
                >
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-emerald-600
                      dark:text-emerald-400
                    "
                  >
                    Model Accuracy
                  </p>

                  <p
                    className="
                      mt-1
                      text-2xl
                      font-bold
                      text-emerald-600
                      dark:text-emerald-400
                    "
                  >
                    {modelAccuracy
                      ? `${modelAccuracy}%`
                      : "--"}
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  text-xs
                  font-medium
                  text-slate-500

                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:text-slate-400
                "
              >
                <Activity size={15} />

                Waiting for recognition activity
              </div>
            )}
          </div>

          {latestPrediction && (
            <div className="relative mt-6 max-w-xl">
              <div
                className="
                  mb-2
                  flex
                  items-center
                  justify-between
                "
              >
                <span
                  className="
                    text-xs
                    font-medium
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Recognition confidence
                </span>

                <span
                  className="
                    text-xs
                    font-bold
                    text-indigo-600
                    dark:text-indigo-400
                  "
                >
                  {latestConfidence}%
                </span>
              </div>

              <div
                className="
                  h-2.5
                  overflow-hidden
                  rounded-full
                  bg-indigo-100

                  dark:bg-indigo-500/10
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-indigo-500
                    to-purple-500
                    transition-all
                    duration-1000
                  "
                  style={{
                    width: `${Math.min(
                      latestConfidence,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </section>

        {/* =====================================================
            SYSTEM HEALTH
        ===================================================== */}

        <section
          className="
            grid
            grid-cols-1
            gap-4

            md:grid-cols-3
          "
        >
          {/* Backend */}

          <div
            className="
              group
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5

              transition-all
              duration-300

              hover:-translate-y-1
              hover:shadow-lg

              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600

                  transition-transform
                  duration-300

                  group-hover:scale-110

                  dark:bg-blue-500/10
                  dark:text-blue-400
                "
              >
                <Activity size={19} />
              </div>

              <span
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  ${
                    backendOnline
                      ? `
                        bg-emerald-50
                        text-emerald-600
                        dark:bg-emerald-500/10
                        dark:text-emerald-400
                      `
                      : `
                        bg-red-50
                        text-red-600
                        dark:bg-red-500/10
                        dark:text-red-400
                      `
                  }
                `}
              >
                {backendOnline
                  ? "ONLINE"
                  : "OFFLINE"}
              </span>
            </div>

            <h3
              className="
                mt-4
                text-sm
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              Backend Service
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              Flask recognition API
            </p>
          </div>

          {/* Model */}

          <div
            className="
              group
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5

              transition-all
              duration-300

              hover:-translate-y-1
              hover:shadow-lg

              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-purple-50
                  text-purple-600

                  transition-transform
                  duration-300

                  group-hover:scale-110

                  dark:bg-purple-500/10
                  dark:text-purple-400
                "
              >
                <Brain size={19} />
              </div>

              <span
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  ${
                    modelLoaded
                      ? `
                        bg-emerald-50
                        text-emerald-600
                        dark:bg-emerald-500/10
                        dark:text-emerald-400
                      `
                      : `
                        bg-red-50
                        text-red-600
                        dark:bg-red-500/10
                        dark:text-red-400
                      `
                  }
                `}
              >
                {modelLoaded
                  ? "READY"
                  : "UNAVAILABLE"}
              </span>
            </div>

            <h3
              className="
                mt-4
                text-sm
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              AI Recognition Model
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              {modelName}
            </p>
          </div>

          {/* Last update */}

          <div
            className="
              group
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5

              transition-all
              duration-300

              hover:-translate-y-1
              hover:shadow-lg

              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-amber-50
                  text-amber-600

                  transition-transform
                  duration-300

                  group-hover:scale-110

                  dark:bg-amber-500/10
                  dark:text-amber-400
                "
              >
                <Clock3 size={19} />
              </div>

              <CheckCircle2
                size={17}
                className="text-emerald-500"
              />
            </div>

            <h3
              className="
                mt-4
                text-sm
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              Last Synchronization
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              {formatTime(lastUpdated)}
            </p>
          </div>
        </section>

        {/* =====================================================
            RECENT PREDICTIONS
        ===================================================== */}

        <section>
          <div
            className="
              mb-4
              flex
              items-end
              justify-between
            "
          >
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-50
                    text-indigo-600

                    dark:bg-indigo-500/10
                    dark:text-indigo-400
                  "
                >
                  <BarChart3 size={17} />
                </div>

                <div>
                  <h2
                    className="
                      text-lg
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    Recent Predictions
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Latest sign recognition activity
                  </p>
                </div>
              </div>
            </div>

            <div
              className="
                hidden
                items-center
                gap-1
                text-xs
                font-medium
                text-slate-400
                sm:flex
              "
            >
              View activity

              <ChevronRight size={14} />
            </div>
          </div>

          <div
            className="
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-sm

              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div className="w-full overflow-x-auto">
              <div
                className="
                  min-w-[760px]
                  sm:min-w-0
                "
              >
                <PredictionHistory
                  predictions={predictions}
                  accuracy={modelAccuracy}
                  loading={loading}
                />
              </div>
            </div>
          </div>

          {!loading && predictions.length === 0 && (
            <div
              className="
                mt-3
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-dashed
                border-slate-200
                py-5
                text-xs
                text-slate-400

                dark:border-slate-800
              "
            >
              <ShieldCheck size={15} />

              No recognition predictions have been
              recorded yet.
            </div>
          )}
        </section>

        {/* =====================================================
            FOOTER STATUS
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            gap-3
            border-t
            border-slate-100
            pt-5
            text-xs
            text-slate-400

            dark:border-slate-800
            dark:text-slate-500

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                relative
                flex
                h-2
                w-2
              "
            >
              <span
                className={`
                  absolute
                  inline-flex
                  h-full
                  w-full
                  rounded-full
                  opacity-75
                  ${
                    backendOnline
                      ? "animate-ping bg-emerald-400"
                      : "bg-red-400"
                  }
                `}
              />

              <span
                className={`
                  relative
                  inline-flex
                  h-2
                  w-2
                  rounded-full
                  ${
                    backendOnline
                      ? "bg-emerald-500"
                      : "bg-red-500"
                  }
                `}
              />
            </span>

            SignAI monitoring is{" "}
            {backendOnline
              ? "active"
              : "offline"}
          </div>

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <RefreshCw
              size={13}
              className={
                loading || refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            <span>
              Last updated:{" "}
              {formatTime(lastUpdated)}
            </span>

            <span className="text-slate-300 dark:text-slate-700">
              •
            </span>

            <span>
              Auto-refresh: 5s
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;