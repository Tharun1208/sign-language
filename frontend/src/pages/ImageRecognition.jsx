import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Image as ImageIcon,
  Sparkles,
  Upload,
  Brain,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock3,
  Cpu,
  Target,
  ShieldCheck,
  RotateCcw,
  Zap,
  BarChart3,
  Info,
  Activity,
  Eye,
  Layers3,
  ScanFace,
  Gauge,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import UploadSection from "../components/recognition/UploadSection";

const ImageRecognition = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ============================================================
     HELPERS
  ============================================================ */

  const normalizePercentage = (value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
      return null;
    }

    const normalized = number > 0 && number <= 1 ? number * 100 : number;

    return Math.min(100, Math.max(0, normalized));
  };

  const getSafeNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  };

  /* ============================================================
     HANDLE PREDICTION
  ============================================================ */

  const handlePrediction = (predictionData) => {
    console.log("=================================");
    console.log("PREDICTION RECEIVED");
    console.log("=================================");
    console.log(predictionData);

    if (!predictionData) {
      setPrediction(null);
      setError("No prediction was received from the backend.");
      setLoading(false);
      return;
    }

    const rawLabel =
      predictionData.label ??
      predictionData.predicted_label ??
      predictionData.prediction ??
      predictionData.class ??
      predictionData.sign ??
      predictionData.gesture;

    const label = rawLabel
      ? String(rawLabel).trim().toUpperCase()
      : "UNKNOWN";

    const confidence = normalizePercentage(
      predictionData.confidence_percent ??
        predictionData.confidence ??
        predictionData.probability ??
        predictionData.score ??
        0
    );

    const signAccuracy = normalizePercentage(
      predictionData.sign_accuracy_percent ??
        predictionData.sign_accuracy ??
        predictionData.class_accuracy ??
        predictionData.recall
    );

    const rawProcessingTime =
      predictionData.processing_time_ms ??
      predictionData.processing_time ??
      predictionData.processingTime ??
      null;

    const processingTime = getSafeNumber(rawProcessingTime);

    const model =
      predictionData.model ??
      predictionData.model_name ??
      predictionData.classifier ??
      "Random Forest Classifier";

    const support =
      predictionData.support ??
      predictionData.class_support ??
      null;

    const normalizedPrediction = {
      label,
      confidence_percent: confidence ?? 0,
      sign_accuracy_percent: signAccuracy,
      support,
      processing_time_ms: processingTime,
      model: String(model),
    };

    console.log("NORMALIZED PREDICTION:");
    console.log(normalizedPrediction);

    setPrediction(normalizedPrediction);
    setError("");
    setLoading(false);
  };

  /* ============================================================
     RESET
  ============================================================ */

  const handleReset = () => {
    setPrediction(null);
    setError("");
    setLoading(false);
  };

  /* ============================================================
     DERIVED VALUES
  ============================================================ */

  const confidenceValue = useMemo(() => {
    if (!prediction) return 0;

    return Math.min(
      100,
      Math.max(0, Number(prediction.confidence_percent) || 0)
    );
  }, [prediction]);

  const signAccuracyValue = useMemo(() => {
    if (
      prediction?.sign_accuracy_percent === null ||
      prediction?.sign_accuracy_percent === undefined
    ) {
      return null;
    }

    return Math.min(
      100,
      Math.max(0, Number(prediction.sign_accuracy_percent) || 0)
    );
  }, [prediction]);

  /* ============================================================
     CONFIDENCE INFORMATION
  ============================================================ */

  const confidenceInfo = useMemo(() => {
    if (confidenceValue >= 90) {
      return {
        label: "Excellent",
        description: "Very high prediction confidence",
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
        barClass: "bg-emerald-500",
        icon: ShieldCheck,
      };
    }

    if (confidenceValue >= 75) {
      return {
        label: "Good",
        description: "Reliable prediction confidence",
        className:
          "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
        barClass: "bg-blue-500",
        icon: CheckCircle,
      };
    }

    if (confidenceValue >= 50) {
      return {
        label: "Moderate",
        description: "Consider trying another image",
        className:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
        barClass: "bg-amber-500",
        icon: Info,
      };
    }

    return {
      label: "Low",
      description: "Try a clearer hand gesture image",
      className:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
      barClass: "bg-red-500",
      icon: AlertCircle,
    };
  }, [confidenceValue]);

  const ConfidenceIcon = confidenceInfo.icon;

  /* ============================================================
     PROCESSING TIME
  ============================================================ */

  const processingTimeText = useMemo(() => {
    if (
      prediction?.processing_time_ms === null ||
      prediction?.processing_time_ms === undefined
    ) {
      return "Completed";
    }

    const value = Number(prediction.processing_time_ms);

    if (!Number.isFinite(value)) {
      return "Completed";
    }

    if (value < 1000) {
      return `${value.toFixed(0)} ms`;
    }

    return `${(value / 1000).toFixed(2)} s`;
  }, [prediction]);

  /* ============================================================
     ANIMATION VARIANTS
  ============================================================ */

  const cardHover = {
    y: -4,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  };

  const iconHover = {
    scale: 1.08,
    rotate: 3,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  };

  const fadeUp = {
    initial: {
      opacity: 0,
      y: 18,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <DashboardLayout>
      <div className="min-h-full space-y-7 overflow-hidden pb-10">

        {/* ========================================================
            PAGE HEADER
        ======================================================== */}

        <motion.section
          initial="initial"
          animate="animate"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          whileHover={cardHover}
          className="
            group
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            transition-shadow
            duration-300
            hover:shadow-xl
            hover:shadow-indigo-500/5
            dark:border-slate-800
            dark:bg-slate-900
            sm:p-7
          "
        >
          {/* Decorative backgrounds */}

          <div
            className="
              pointer-events-none
              absolute
              -right-28
              -top-28
              h-80
              w-80
              rounded-full
              bg-indigo-500/10
              blur-3xl
              transition-transform
              duration-700
              group-hover:scale-125
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
              bg-purple-500/5
              blur-3xl
              transition-transform
              duration-700
              group-hover:scale-110
            "
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex min-w-0 items-start gap-4">

              <motion.div
                whileHover={iconHover}
                className="
                  relative
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  border
                  border-indigo-200
                  bg-gradient-to-br
                  from-indigo-50
                  to-purple-50
                  text-indigo-600
                  shadow-sm
                  dark:border-indigo-500/20
                  dark:from-indigo-500/10
                  dark:to-purple-500/10
                  dark:text-indigo-400
                "
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <ImageIcon size={27} />
              </motion.div>

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <h1
                    className="
                      text-2xl
                      font-bold
                      tracking-tight
                      text-slate-900
                      dark:text-white
                      sm:text-3xl
                    "
                  >
                    Image Prediction
                  </h1>

                  <motion.div
                    animate={{
                      rotate: [0, 8, -8, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    <Sparkles
                      size={18}
                      className="text-indigo-500 dark:text-indigo-400"
                    />
                  </motion.div>

                </div>

                <p
                  className="
                    mt-2
                    max-w-2xl
                    text-sm
                    leading-6
                    text-slate-500
                    dark:text-slate-400
                    sm:text-base
                  "
                >
                  Upload a hand gesture image and let SignAI
                  identify the corresponding sign using the
                  trained AI model.
                </p>

                {/* Header features */}

                <div className="mt-4 flex flex-wrap gap-2">

                  {[
                    {
                      icon: ShieldCheck,
                      text: "AI Powered",
                    },
                    {
                      icon: ScanFace,
                      text: "Hand Detection",
                    },
                    {
                      icon: Zap,
                      text: "Fast Analysis",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.text}
                        whileHover={{
                          y: -2,
                          scale: 1.02,
                        }}
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-lg
                          border
                          border-slate-200
                          bg-slate-50
                          px-2.5
                          py-1.5
                          text-[11px]
                          font-semibold
                          text-slate-600
                          transition-colors
                          hover:border-indigo-200
                          hover:text-indigo-600
                          dark:border-slate-800
                          dark:bg-slate-800/60
                          dark:text-slate-300
                          dark:hover:border-indigo-500/30
                          dark:hover:text-indigo-400
                        "
                      >
                        <Icon size={13} />
                        {item.text}
                      </motion.div>
                    );
                  })}

                </div>
              </div>
            </div>

            {/* Status */}

            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              className="
                flex
                w-fit
                items-center
                gap-2.5
                rounded-full
                border
                border-indigo-200
                bg-indigo-50
                px-4
                py-2.5
                text-indigo-700
                shadow-sm
                dark:border-indigo-500/20
                dark:bg-indigo-500/10
                dark:text-indigo-400
              "
            >
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    bg-indigo-400
                    opacity-75
                  "
                />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
              </span>

              <Brain size={15} />

              <span className="text-xs font-semibold">
                AI Prediction Ready
              </span>
            </motion.div>
          </div>
        </motion.section>

        {/* ========================================================
            HOW IT WORKS
        ======================================================== */}

        <motion.section
          initial="initial"
          animate="animate"
          variants={fadeUp}
          transition={{
            duration: 0.5,
            delay: 0.05,
          }}
          whileHover={cardHover}
          className="
            group
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            transition-shadow
            duration-300
            hover:shadow-xl
            hover:shadow-indigo-500/5
            dark:border-slate-800
            dark:bg-slate-900
            sm:p-6
          "
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="flex items-start gap-4">

            <motion.div
              whileHover={iconHover}
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-indigo-50
                text-indigo-600
                dark:bg-indigo-500/10
                dark:text-indigo-400
              "
            >
              <Upload size={20} />
            </motion.div>

            <div className="min-w-0 flex-1">

              <div className="flex flex-wrap items-center justify-between gap-3">

                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    How Image Prediction Works
                  </h2>

                  <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Your image passes through the hand-landmark
                    pipeline before the trained Random Forest
                    classifier identifies the gesture.
                  </p>
                </div>

                <motion.div
                  whileHover={{
                    scale: 1.04,
                  }}
                  className="
                    hidden
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    text-slate-600
                    dark:border-slate-800
                    dark:bg-slate-800/60
                    dark:text-slate-300
                    md:flex
                  "
                >
                  <Zap size={14} className="text-amber-500" />
                  63 Landmark Features
                </motion.div>
              </div>

              {/* Pipeline */}

              <div className="mt-5 overflow-x-auto pb-1">

                <div className="flex min-w-max items-center gap-2">

                  {[
                    {
                      label: "Upload",
                      icon: Upload,
                    },
                    {
                      label: "MediaPipe",
                      icon: ScanFace,
                    },
                    {
                      label: "63 Features",
                      icon: Layers3,
                    },
                    {
                      label: "Random Forest",
                      icon: Brain,
                    },
                    {
                      label: "Prediction",
                      icon: Target,
                    },
                  ].map((step, index) => {
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.label}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          whileHover={{
                            y: -3,
                            scale: 1.03,
                          }}
                          className={`
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            transition-all
                            ${
                              index === 4
                                ? "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400"
                                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400"
                            }
                          `}
                        >
                          <Icon size={14} />
                          {step.label}
                        </motion.div>

                        {index < 4 && (
                          <ArrowRight
                            size={14}
                            className="shrink-0 text-slate-400"
                          />
                        )}
                      </div>
                    );
                  })}

                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ========================================================
            WORKSPACE HEADER
        ======================================================== */}

        <motion.section
          initial="initial"
          animate="animate"
          variants={fadeUp}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
        >
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">

            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <BarChart3
                  size={19}
                  className="text-indigo-500"
                />
                Prediction Workspace
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Upload a gesture image to analyze the predicted
                sign and model confidence.
              </p>
            </div>

            <AnimatePresence>
              {prediction && (
                <motion.button
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    x: 10,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  whileHover={{
                    scale: 1.04,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  type="button"
                  onClick={handleReset}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3.5
                    py-2
                    text-xs
                    font-semibold
                    text-slate-600
                    shadow-sm
                    transition-all
                    hover:border-indigo-200
                    hover:text-indigo-600
                    hover:shadow-md
                    dark:border-slate-800
                    dark:bg-slate-900
                    dark:text-slate-300
                    dark:hover:border-indigo-500/30
                    dark:hover:text-indigo-400
                  "
                >
                  <RotateCcw size={14} />
                  New Prediction
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ERROR BANNER */}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: -8,
                }}
                className="
                  mb-6
                  flex
                  items-start
                  gap-3
                  overflow-hidden
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  p-4
                  text-red-700
                  shadow-sm
                  dark:border-red-500/20
                  dark:bg-red-500/10
                  dark:text-red-400
                "
              >
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <div className="min-w-0">
                  <p className="font-semibold">
                    Prediction Failed
                  </p>

                  <p className="mt-1 text-sm leading-5">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ========================================================
            WORKSPACE
        ======================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]
          "
        >
          {/* ======================================================
              UPLOAD CARD
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.12,
            }}
            whileHover={cardHover}
            className="
              group
              min-w-0
              overflow-hidden
              rounded-[28px]
              border
              border-slate-200
              bg-white
              shadow-sm
              transition-shadow
              duration-300
              hover:shadow-xl
              hover:shadow-indigo-500/5
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            {/* top glow */}

            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-70 transition-opacity group-hover:opacity-100" />

            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">

              <div className="flex items-center gap-3">

                <motion.div
                  whileHover={iconHover}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-50
                    text-indigo-600
                    dark:bg-indigo-500/10
                    dark:text-indigo-400
                  "
                >
                  <Upload size={19} />
                </motion.div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Upload Image
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select a clear hand gesture
                  </p>
                </div>
              </div>

              <div
                className="
                  hidden
                  rounded-lg
                  bg-slate-100
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-slate-500
                  dark:bg-slate-800
                  dark:text-slate-400
                  sm:block
                "
              >
                INPUT
              </div>
            </div>

            <div className="p-1">
              <UploadSection
                onPrediction={handlePrediction}
                onReset={handleReset}
                onLoadingChange={setLoading}
              />
            </div>
          </motion.div>

          {/* ======================================================
              RESULT CARD
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.15,
            }}
            whileHover={cardHover}
            className="
              group
              min-w-0
              overflow-hidden
              rounded-[28px]
              border
              border-slate-200
              bg-white
              shadow-sm
              transition-shadow
              duration-300
              hover:shadow-xl
              hover:shadow-purple-500/5
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            {/* top glow */}

            <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 opacity-70 transition-opacity group-hover:opacity-100" />

            {/* RESULT HEADER */}

            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">

              <div className="flex items-center gap-3">

                <motion.div
                  whileHover={iconHover}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-purple-50
                    text-purple-600
                    dark:bg-purple-500/10
                    dark:text-purple-400
                  "
                >
                  <Brain size={19} />
                </motion.div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Prediction Result
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    AI analysis and performance
                  </p>
                </div>
              </div>

              {prediction && (
                <motion.span
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-emerald-50
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-emerald-600
                    dark:bg-emerald-500/10
                    dark:text-emerald-400
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Complete
                </motion.span>
              )}
            </div>

            {/* RESULT BODY */}

            <div className="min-h-[560px] bg-white p-5 dark:bg-slate-900 sm:p-6">

              <AnimatePresence mode="wait">

                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading && (
                  <motion.div
                    key="loading"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="flex min-h-[510px] flex-col items-center justify-center text-center"
                  >
                    <div className="relative">

                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="
                          flex
                          h-24
                          w-24
                          items-center
                          justify-center
                          rounded-3xl
                          bg-indigo-50
                          shadow-inner
                          dark:bg-indigo-500/10
                        "
                      >
                        <Loader2
                          size={42}
                          className="animate-spin text-indigo-500"
                        />
                      </motion.div>

                      <span
                        className="
                          absolute
                          -right-1
                          -top-1
                          h-4
                          w-4
                          animate-pulse
                          rounded-full
                          bg-indigo-500
                          ring-4
                          ring-white
                          dark:ring-slate-900
                        "
                      />
                    </div>

                    <h3 className="mt-6 text-base font-semibold text-slate-800 dark:text-white">
                      Analyzing Gesture...
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                      MediaPipe is extracting hand landmarks
                      and the AI model is identifying the gesture.
                    </p>

                    <div
                      className="
                        mt-6
                        flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-indigo-100
                        bg-indigo-50
                        px-4
                        py-2
                        text-xs
                        font-medium
                        text-indigo-600
                        dark:border-indigo-500/20
                        dark:bg-indigo-500/10
                        dark:text-indigo-400
                      "
                    >
                      <Sparkles size={14} />
                      AI processing in progress
                    </div>

                    <div className="mt-6 flex items-center gap-1.5">
                      {[0, 1, 2].map((item) => (
                        <motion.span
                          key={item}
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            y: [0, -3, 0],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: item * 0.15,
                          }}
                          className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ==================================================
                    PREDICTION
                ================================================== */}

                {!loading && prediction && (
                  <motion.div
                    key="prediction"
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="flex min-h-[510px] flex-col"
                  >
                    {/* SIGN RESULT */}

                    <motion.div
                      whileHover={{
                        scale: 1.01,
                      }}
                      className="
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
                        text-center
                        shadow-sm
                        dark:border-indigo-500/20
                        dark:from-indigo-500/10
                        dark:via-slate-900
                        dark:to-purple-500/10
                        sm:p-8
                      "
                    >
                      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl" />

                      <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-purple-400/10 blur-3xl" />

                      <div className="relative flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        <CheckCircle size={18} />
                        Predicted Gesture
                      </div>

                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0.7,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 180,
                          damping: 12,
                        }}
                        whileHover={{
                          scale: 1.04,
                        }}
                        className="
                          relative
                          mt-4
                          break-words
                          text-7xl
                          font-black
                          tracking-tight
                          text-indigo-600
                          transition-colors
                          dark:text-indigo-400
                          sm:text-8xl
                        "
                      >
                        {prediction.label}
                      </motion.div>

                      <p className="relative mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Sign {prediction.label}
                      </p>
                    </motion.div>

                    {/* CONFIDENCE */}

                    <motion.div
                      whileHover={{
                        y: -2,
                      }}
                      className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-2">

                          <div
                            className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-lg
                              bg-emerald-50
                              text-emerald-500
                              dark:bg-emerald-500/10
                              dark:text-emerald-400
                            "
                          >
                            <Gauge size={15} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                              Confidence
                            </p>

                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                              Prediction certainty
                            </p>
                          </div>
                        </div>

                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          {confidenceValue.toFixed(2)}%
                        </span>
                      </div>

                      <div className="relative mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">

                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${confidenceValue}%`,
                          }}
                          transition={{
                            duration: 1,
                            ease: "easeOut",
                          }}
                          className={`h-full rounded-full ${confidenceInfo.barClass}`}
                        />

                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">

                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Confidence for this image
                        </p>

                        <motion.span
                          whileHover={{
                            scale: 1.04,
                          }}
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            px-2.5
                            py-1
                            text-[11px]
                            font-bold
                            ${confidenceInfo.className}
                          `}
                        >
                          <ConfidenceIcon size={12} />
                          {confidenceInfo.label}
                        </motion.span>

                      </div>

                      <p className="mt-2 text-right text-[11px] text-slate-400 dark:text-slate-500">
                        {confidenceInfo.description}
                      </p>
                    </motion.div>

                    {/* METRIC CARDS */}

                    <div
                      className={`
                        mt-5
                        grid
                        gap-4
                        ${
                          signAccuracyValue !== null
                            ? "grid-cols-1 sm:grid-cols-2"
                            : "grid-cols-1"
                        }
                      `}
                    >

                      {signAccuracyValue !== null && (
                        <motion.div
                          whileHover={{
                            y: -3,
                            scale: 1.01,
                          }}
                          className="
                            rounded-2xl
                            border
                            border-blue-200
                            bg-blue-50
                            p-4
                            transition-shadow
                            hover:shadow-md
                            dark:border-blue-500/20
                            dark:bg-blue-500/10
                          "
                        >
                          <div className="flex items-center justify-between gap-3">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                <Target size={17} />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                  Sign Accuracy
                                </p>

                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                  Class performance
                                </p>
                              </div>

                            </div>

                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {signAccuracyValue.toFixed(2)}%
                            </span>
                          </div>

                          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-blue-100 dark:bg-slate-800">

                            <motion.div
                              initial={{
                                width: 0,
                              }}
                              animate={{
                                width: `${signAccuracyValue}%`,
                              }}
                              transition={{
                                duration: 0.9,
                                delay: 0.15,
                              }}
                              className="h-full rounded-full bg-blue-500"
                            />

                          </div>

                          <p className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                            Based on test-set recall for the predicted sign.
                          </p>
                        </motion.div>
                      )}

                      {/* TEST SUPPORT */}

                      {prediction.support !== null &&
                        prediction.support !== undefined && (
                          <motion.div
                            whileHover={{
                              y: -3,
                              scale: 1.01,
                            }}
                            className="
                              rounded-2xl
                              border
                              border-slate-200
                              bg-slate-50
                              p-4
                              transition-shadow
                              hover:shadow-md
                              dark:border-slate-800
                              dark:bg-slate-800/50
                            "
                          >
                            <div className="flex items-center justify-between gap-3">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
                                  <BarChart3 size={17} />
                                </div>

                                <div>
                                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Test Samples
                                  </p>

                                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Class support
                                  </p>
                                </div>

                              </div>

                              <span className="text-lg font-bold text-slate-800 dark:text-white">
                                {prediction.support}
                              </span>

                            </div>
                          </motion.div>
                        )}

                    </div>

                    {/* PROCESSING + MODEL */}

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                      <motion.div
                        whileHover={{
                          y: -3,
                        }}
                        className="
                          group/stat
                          rounded-2xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-4
                          transition-all
                          hover:border-indigo-200
                          hover:shadow-md
                          dark:border-slate-800
                          dark:bg-slate-800/50
                          dark:hover:border-indigo-500/20
                        "
                      >
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">

                          <Clock3
                            size={17}
                            className="transition-transform duration-300 group-hover/stat:scale-110"
                          />

                          <span className="text-xs font-medium">
                            Processing Time
                          </span>

                        </div>

                        <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                          {processingTimeText}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                          End-to-end inference
                        </p>
                      </motion.div>

                      <motion.div
                        whileHover={{
                          y: -3,
                        }}
                        className="
                          group/stat
                          rounded-2xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-4
                          transition-all
                          hover:border-purple-200
                          hover:shadow-md
                          dark:border-slate-800
                          dark:bg-slate-800/50
                          dark:hover:border-purple-500/20
                        "
                      >
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">

                          <Cpu
                            size={17}
                            className="transition-transform duration-300 group-hover/stat:scale-110"
                          />

                          <span className="text-xs font-medium">
                            Model
                          </span>

                        </div>

                        <p className="mt-3 break-words text-sm font-bold text-slate-900 dark:text-white">
                          {prediction.model}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                          Active classifier
                        </p>
                      </motion.div>

                    </div>

                    {/* SUCCESS */}

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.3,
                      }}
                      whileHover={{
                        scale: 1.01,
                      }}
                      className="
                        mt-5
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-2xl
                        border
                        border-emerald-200
                        bg-emerald-50
                        px-4
                        py-4
                        shadow-sm
                        dark:border-emerald-500/20
                        dark:bg-emerald-500/10
                      "
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <motion.div
                          animate={{
                            scale: [1, 1.08, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 2,
                          }}
                        >
                          <CheckCircle
                            size={20}
                            className="shrink-0 text-emerald-500 dark:text-emerald-400"
                          />
                        </motion.div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Prediction Successful
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            Gesture analyzed successfully.
                          </p>
                        </div>

                      </div>

                      <span
                        className="
                          shrink-0
                          rounded-full
                          bg-emerald-100
                          px-3
                          py-1.5
                          text-xs
                          font-bold
                          text-emerald-700
                          dark:bg-emerald-500/20
                          dark:text-emerald-400
                        "
                      >
                        Success
                      </span>

                    </motion.div>
                  </motion.div>
                )}

                {/* ==================================================
                    EMPTY STATE
                ================================================== */}

                {!loading && !prediction && !error && (
                  <motion.div
                    key="empty"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    className="flex min-h-[510px] flex-col items-center justify-center px-4 text-center"
                  >
                    <motion.div
                      animate={{
                        y: [0, -6, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      whileHover={{
                        scale: 1.08,
                      }}
                      className="
                        relative
                        flex
                        h-24
                        w-24
                        items-center
                        justify-center
                        rounded-3xl
                        bg-slate-100
                        text-slate-400
                        shadow-inner
                        dark:bg-slate-800
                        dark:text-slate-500
                      "
                    >
                      <div className="absolute inset-0 rounded-3xl bg-indigo-500/5 blur-xl" />
                      <Brain size={40} />
                    </motion.div>

                    <h3 className="mt-6 text-base font-semibold text-slate-700 dark:text-slate-200">
                      No Prediction Yet
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Upload a hand gesture image and click
                      Predict to see the AI recognition result
                      here.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">

                      {[
                        {
                          icon: Eye,
                          text: "Clear image",
                        },
                        {
                          icon: Sparkles,
                          text: "Good lighting",
                        },
                        {
                          icon: ScanFace,
                          text: "Full hand visible",
                        },
                      ].map((item) => {
                        const Icon = item.icon;

                        return (
                          <motion.div
                            key={item.text}
                            whileHover={{
                              y: -3,
                              scale: 1.03,
                            }}
                            className="
                              flex
                              items-center
                              justify-center
                              gap-1.5
                              rounded-xl
                              border
                              border-slate-200
                              bg-slate-50
                              px-3
                              py-2
                              text-xs
                              font-medium
                              text-slate-500
                              transition-all
                              hover:border-indigo-200
                              hover:text-indigo-600
                              dark:border-slate-800
                              dark:bg-slate-800
                              dark:text-slate-400
                              dark:hover:border-indigo-500/20
                              dark:hover:text-indigo-400
                            "
                          >
                            <Icon size={13} />
                            {item.text}
                          </motion.div>
                        );
                      })}

                    </div>
                  </motion.div>
                )}

                {/* ==================================================
                    ERROR STATE
                ================================================== */}

                {!loading && error && (
                  <motion.div
                    key="error"
                    initial={{
                      opacity: 0,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    className="flex min-h-[510px] flex-col items-center justify-center px-4 text-center"
                  >
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                      }}
                      className="
                        flex
                        h-24
                        w-24
                        items-center
                        justify-center
                        rounded-3xl
                        bg-red-50
                        text-red-500
                        shadow-inner
                        dark:bg-red-500/10
                        dark:text-red-400
                      "
                    >
                      <AlertCircle size={40} />
                    </motion.div>

                    <h3 className="mt-6 text-base font-semibold text-red-600 dark:text-red-400">
                      Prediction Failed
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {error}
                    </p>

                    <motion.button
                      whileHover={{
                        scale: 1.04,
                        y: -2,
                      }}
                      whileTap={{
                        scale: 0.96,
                      }}
                      type="button"
                      onClick={handleReset}
                      className="
                        mt-6
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-indigo-600
                        px-4
                        py-2.5
                        text-xs
                        font-semibold
                        text-white
                        shadow-lg
                        shadow-indigo-500/20
                        transition
                        hover:bg-indigo-700
                        hover:shadow-xl
                      "
                    >
                      <RotateCcw size={14} />
                      Try Again
                    </motion.button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ========================================================
            FOOTER SUMMARY
        ======================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
          whileHover={{
            y: -2,
          }}
          className="
            group
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-4
            shadow-sm
            transition-all
            duration-300
            hover:border-indigo-200
            hover:shadow-md
            dark:border-slate-800
            dark:bg-slate-900/60
            dark:hover:border-indigo-500/20
          "
        >
          <motion.div
            whileHover={{
              scale: 1.1,
              rotate: 5,
            }}
          >
            {prediction ? (
              <CheckCircle
                size={18}
                className="mt-0.5 shrink-0 text-emerald-500"
              />
            ) : (
              <Activity
                size={18}
                className="mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-400"
              />
            )}
          </motion.div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                SignAI Image Prediction
              </p>

              {prediction && (
                <span
                  className="
                    rounded-full
                    bg-emerald-100
                    px-2
                    py-0.5
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-emerald-700
                    dark:bg-emerald-500/10
                    dark:text-emerald-400
                  "
                >
                  Analyzed
                </span>
              )}

            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">

              {prediction
                ? `Predicted sign: ${prediction.label} with ${confidenceValue.toFixed(
                    2
                  )}% confidence${
                    signAccuracyValue !== null
                      ? ` and ${signAccuracyValue.toFixed(
                          2
                        )}% sign accuracy.`
                      : "."
                  }`
                : "For the best results, use a clear image with good lighting and keep the hand gesture fully visible."}

            </p>
          </div>
        </motion.section>
      </div>
    </DashboardLayout>
  );
};

export default ImageRecognition;