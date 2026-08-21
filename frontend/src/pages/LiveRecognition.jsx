import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

import {
  Camera,
  Brain,
  Activity,
  Sparkles,
  Radio,
  ShieldCheck,
  Play,
  Square,
  CameraIcon,
  RotateCcw,
  Zap,
  Clock3,
  CheckCircle2,
  Gauge,
  Cpu,
  MonitorCheck,
  AlertCircle,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const LiveRecognition = () => {
  const webcamRef = useRef(null);
  const predictionLoopRef = useRef(null);
  const firstPredictionTimeoutRef = useRef(null);

  const isProcessingRef = useRef(false);
  const lastPredictionRef = useRef("");
  const lastPredictionTimeRef = useRef(0);

  const [isRunning, setIsRunning] = useState(false);
  const [prediction, setPrediction] = useState("—");
  const [confidence, setConfidence] = useState(0);
  const [fps, setFps] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  // ============================================================
  // PREDICT FRAME
  // ============================================================

  const predictFrame = async () => {
    if (!webcamRef.current || isProcessingRef.current) {
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      return;
    }

    isProcessingRef.current = true;

    const startTime = performance.now();

    try {
      setError("");

      // ========================================================
      // BASE64 → BLOB
      // ========================================================

      const imageResponse = await fetch(imageSrc);

      if (!imageResponse.ok) {
        throw new Error("Unable to convert webcam frame.");
      }

      const blob = await imageResponse.blob();

      // ========================================================
      // FORM DATA
      // ========================================================

      const formData = new FormData();

      formData.append(
        "frame",
        blob,
        `frame-${Date.now()}.jpg`
      );

      // ========================================================
      // SEND TO FLASK
      // ========================================================

      const apiResponse = await fetch(
        `${API_URL}/api/predict/frame`,
        {
          method: "POST",
          body: formData,
        }
      );

      // ========================================================
      // READ RESPONSE AS TEXT FIRST
      // ========================================================

      const responseText = await apiResponse.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error(
          "Backend returned non-JSON response:",
          responseText
        );

        if (apiResponse.status === 404) {
          throw new Error(
            `Prediction endpoint not found (404). React is requesting: ${API_URL}/api/predict/frame. Make sure Flask contains POST /api/predict/frame`
          );
        }

        throw new Error(
          `Backend returned invalid response (${apiResponse.status}).`
        );
      }

      // ========================================================
      // PROCESSING TIME
      // ========================================================

      const endTime = performance.now();

      const processing = Math.round(
        endTime - startTime
      );

      setProcessingTime(processing);

      // ========================================================
      // API ERROR
      // ========================================================

      if (!apiResponse.ok || !data.success) {
        const message =
          data.message || "Prediction failed.";

        // ------------------------------------------------------
        // NO HAND
        // ------------------------------------------------------

        if (
          message
            .toLowerCase()
            .includes("no hand")
        ) {
          setPrediction("—");
          setConfidence(0);
          return;
        }

        setError(message);
        return;
      }

      // ========================================================
      // GET PREDICTION
      // ========================================================

      const result = data.prediction;

      if (!result) {
        throw new Error(
          "Backend response does not contain prediction data."
        );
      }

      const predictedLabel =
        result.label ||
        data.predicted_label ||
        data.label ||
        "—";

      const predictedConfidence = Number(
        result.confidence_percent ??
          data.confidence_percent ??
          0
      );

      // ========================================================
      // UPDATE UI
      // ========================================================

      setPrediction(predictedLabel);

      setConfidence(
        Math.min(
          100,
          Math.max(0, predictedConfidence)
        )
      );

      // ========================================================
      // FPS
      // ========================================================

      const now = performance.now();

      const previousTime =
        lastPredictionTimeRef.current;

      if (previousTime > 0) {
        const difference =
          now - previousTime;

        if (difference > 0) {
          const calculatedFps =
            1000 / difference;

          setFps(
            Math.min(
              Math.round(calculatedFps),
              60
            )
          );
        }
      }

      lastPredictionTimeRef.current = now;

      // ========================================================
      // HISTORY
      // ========================================================

      const previousPrediction =
        lastPredictionRef.current;

      const predictionChanged =
        previousPrediction !== predictedLabel;

      if (predictionChanged) {
        const historyItem = {
          time: new Date().toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }
          ),

          prediction: predictedLabel,

          confidence: `${predictedConfidence.toFixed(
            2
          )}%`,
        };

        setHistory((prev) =>
          [historyItem, ...prev].slice(0, 50)
        );

        lastPredictionRef.current =
          predictedLabel;
      }
    } catch (err) {
      console.error(
        "Prediction request failed:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to SignAI backend."
      );
    } finally {
      isProcessingRef.current = false;
    }
  };

  // ============================================================
  // START
  // ============================================================

  const handleStart = () => {
    if (isRunning) {
      return;
    }

    setError("");
    setIsRunning(true);

    lastPredictionRef.current = "";
    lastPredictionTimeRef.current = 0;

    // First prediction
    firstPredictionTimeoutRef.current =
      setTimeout(() => {
        predictFrame();
      }, 700);

    // Prediction loop
    predictionLoopRef.current =
      setInterval(() => {
        predictFrame();
      }, 500);
  };

  // ============================================================
  // STOP
  // ============================================================

  const handleStop = () => {
    setIsRunning(false);

    if (firstPredictionTimeoutRef.current) {
      clearTimeout(
        firstPredictionTimeoutRef.current
      );

      firstPredictionTimeoutRef.current = null;
    }

    if (predictionLoopRef.current) {
      clearInterval(
        predictionLoopRef.current
      );

      predictionLoopRef.current = null;
    }

    isProcessingRef.current = false;

    setFps(0);
    setProcessingTime(0);
    setError("");
  };

  // ============================================================
  // CAPTURE
  // ============================================================

  const handleCapture = () => {
    if (
      !webcamRef.current ||
      !isRunning
    ) {
      return;
    }

    const imageSrc =
      webcamRef.current.getScreenshot();

    if (!imageSrc) {
      console.error(
        "Unable to capture webcam frame."
      );

      return;
    }

    const link =
      document.createElement("a");

    link.href = imageSrc;

    link.download =
      `sign-capture-${Date.now()}.jpg`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // ============================================================
  // RESET
  // ============================================================

  const handleReset = () => {
    handleStop();

    setPrediction("—");
    setConfidence(0);
    setFps(0);
    setProcessingTime(0);
    setHistory([]);
    setError("");

    lastPredictionRef.current = "";
    lastPredictionTimeRef.current = 0;
  };

  // ============================================================
  // CLEANUP
  // ============================================================

  useEffect(() => {
    return () => {
      if (firstPredictionTimeoutRef.current) {
        clearTimeout(
          firstPredictionTimeoutRef.current
        );
      }

      if (predictionLoopRef.current) {
        clearInterval(
          predictionLoopRef.current
        );
      }
    };
  }, []);

  // ============================================================
  // UI
  // ============================================================

  return (
    <DashboardLayout>
      <div className="min-h-full space-y-8 pb-10">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section
          className="
            relative overflow-hidden rounded-3xl border
            border-slate-200 bg-white p-6 shadow-sm
            transition-all duration-300
            hover:-translate-y-1
            hover:border-indigo-200
            hover:shadow-xl hover:shadow-indigo-500/5
            dark:border-slate-800 dark:bg-slate-900
            dark:hover:border-indigo-500/30
            dark:hover:shadow-indigo-500/10
            sm:p-8
          "
        >
          <div
            className="
              pointer-events-none absolute -right-20 -top-24
              h-64 w-64 rounded-full
              bg-indigo-500/10 blur-3xl
            "
          />

          <div
            className="
              pointer-events-none absolute -bottom-24
              left-1/3 h-52 w-52 rounded-full
              bg-blue-500/5 blur-3xl
            "
          />

          <div
            className="
              relative flex flex-col gap-6
              lg:flex-row lg:items-center
              lg:justify-between
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex h-14 w-14 shrink-0
                  items-center justify-center
                  rounded-2xl border
                  border-indigo-200
                  bg-indigo-50
                  text-indigo-600
                  transition-all duration-300
                  hover:scale-110
                  hover:rotate-2
                  hover:shadow-lg
                  dark:border-indigo-500/20
                  dark:bg-indigo-500/10
                  dark:text-indigo-400
                "
              >
                <Camera size={26} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1
                    className="
                      text-2xl font-bold tracking-tight
                      text-slate-900 dark:text-white
                      sm:text-3xl
                    "
                  >
                    Live Recognition
                  </h1>

                  <Sparkles
                    size={18}
                    className="
                      hidden text-indigo-500
                      dark:text-indigo-400 sm:block
                    "
                  />
                </div>

                <p
                  className="
                    mt-2 max-w-2xl text-sm leading-6
                    text-slate-500 dark:text-slate-400
                    sm:text-base
                  "
                >
                  Detect and recognize sign language
                  gestures in real time using your webcam
                  and AI model.
                </p>
              </div>
            </div>

            {/* STATUS */}

            <div
              className={`
                flex w-fit items-center gap-2.5
                rounded-full border px-4 py-2.5
                text-xs font-semibold
                transition-all duration-300
                ${
                  isRunning
                    ? `
                      border-emerald-200
                      bg-emerald-50
                      text-emerald-700
                      shadow-sm
                      shadow-emerald-500/10
                      dark:border-emerald-500/20
                      dark:bg-emerald-500/10
                      dark:text-emerald-400
                    `
                    : `
                      border-slate-200
                      bg-slate-50
                      text-slate-600
                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-slate-300
                    `
                }
              `}
            >
              <span className="relative flex h-2.5 w-2.5">
                {isRunning && (
                  <span
                    className="
                      absolute inline-flex h-full w-full
                      animate-ping rounded-full
                      bg-emerald-400 opacity-75
                    "
                  />
                )}

                <span
                  className={`
                    relative inline-flex h-2.5 w-2.5
                    rounded-full
                    ${
                      isRunning
                        ? "bg-emerald-500"
                        : "bg-slate-400 dark:bg-slate-500"
                    }
                  `}
                />
              </span>

              <Radio size={14} />

              {isRunning
                ? "Live System"
                : "System Ready"}
            </div>
          </div>
        </section>

        {/* =====================================================
            WORKSPACE
        ===================================================== */}

        <section>
          <div className="mb-5 flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 items-center
                justify-center rounded-xl
                bg-slate-100 text-slate-600
                transition-all duration-300
                hover:scale-110
                hover:bg-indigo-100
                hover:text-indigo-600
                dark:bg-slate-800
                dark:text-slate-300
                dark:hover:bg-indigo-500/10
                dark:hover:text-indigo-400
              "
            >
              <Activity size={19} />
            </div>

            <div>
              <h2
                className="
                  text-lg font-semibold
                  text-slate-900 dark:text-white
                "
              >
                Recognition Workspace
              </h2>

              <p
                className="
                  mt-1 text-xs text-slate-500
                  dark:text-slate-400
                "
              >
                Monitor your camera and AI predictions
                in real time.
              </p>
            </div>
          </div>

          <div
            className="
              grid grid-cols-1 gap-6
              xl:grid-cols-3 xl:gap-7
            "
          >

            {/* =================================================
                CAMERA
            ================================================= */}

            <div
              className="
                min-w-0 overflow-hidden rounded-3xl
                border border-slate-200 bg-white shadow-sm
                transition-all duration-300
                hover:-translate-y-1
                hover:border-indigo-200
                hover:shadow-xl hover:shadow-indigo-500/5
                dark:border-slate-800 dark:bg-slate-900
                dark:hover:border-indigo-500/30
                dark:hover:shadow-indigo-500/10
                xl:col-span-2
              "
            >
              <div
                className="
                  flex flex-col gap-3 border-b
                  border-slate-200 px-5 py-4
                  dark:border-slate-800
                  sm:flex-row sm:items-center
                  sm:justify-between
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-10 w-10 items-center
                      justify-center rounded-xl
                      bg-indigo-50 text-indigo-600
                      transition-all duration-300
                      hover:scale-110
                      hover:rotate-2
                      hover:shadow-md
                      dark:bg-indigo-500/10
                      dark:text-indigo-400
                    "
                  >
                    <Camera size={19} />
                  </div>

                  <div>
                    <h3
                      className="
                        text-sm font-semibold
                        text-slate-900 dark:text-white
                      "
                    >
                      Live Camera
                    </h3>

                    <p
                      className="
                        text-xs text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Real-time gesture capture
                    </p>
                  </div>
                </div>

                <div
                  className={`
                    flex w-fit items-center gap-2
                    rounded-full px-3 py-1.5
                    text-xs font-semibold
                    transition-all duration-300
                    ${
                      isRunning
                        ? `
                          bg-emerald-50
                          text-emerald-700
                          dark:bg-emerald-500/10
                          dark:text-emerald-400
                        `
                        : `
                          bg-slate-100
                          text-slate-600
                          dark:bg-slate-800
                          dark:text-slate-300
                        `
                    }
                  `}
                >
                  <span
                    className={`
                      h-2 w-2 rounded-full
                      ${
                        isRunning
                          ? "animate-pulse bg-emerald-500"
                          : "bg-slate-400"
                      }
                    `}
                  />

                  {isRunning
                    ? "Detecting"
                    : "Ready"}
                </div>
              </div>

              {/* CAMERA */}

              <div
                className="
                  relative min-h-[390px]
                  bg-slate-950 p-4
                  transition-all duration-300
                  hover:bg-slate-900
                  sm:p-6
                "
              >
                <div
                  className="
                    relative mx-auto flex min-h-[350px]
                    w-full max-w-4xl items-center
                    justify-center overflow-hidden
                    rounded-2xl border border-slate-700
                    bg-black shadow-2xl
                    transition-all duration-300
                    hover:border-indigo-500/60
                    hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]
                  "
                >
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    mirrored
                    screenshotFormat="image/jpeg"
                    screenshotQuality={0.85}
                    videoConstraints={{
                      width: 1280,
                      height: 720,
                      facingMode: "user",
                    }}
                    className={`
                      h-full min-h-[350px]
                      w-full object-cover
                      transition-opacity duration-500
                      ${
                        isRunning
                          ? "opacity-100"
                          : "opacity-60"
                      }
                    `}
                  />

                  {/* DETECTION FRAME */}

                  <div
                    className="
                      pointer-events-none
                      absolute inset-[12%]
                      rounded-2xl border-2
                      border-indigo-400/80
                      shadow-[0_0_30px_rgba(99,102,241,0.15)]
                      transition-all duration-500
                    "
                  >
                    <span
                      className="
                        absolute -left-1 -top-1
                        h-8 w-8
                        border-l-4 border-t-4
                        border-indigo-400
                      "
                    />

                    <span
                      className="
                        absolute -right-1 -top-1
                        h-8 w-8
                        border-r-4 border-t-4
                        border-indigo-400
                      "
                    />

                    <span
                      className="
                        absolute -bottom-1 -left-1
                        h-8 w-8
                        border-b-4 border-l-4
                        border-indigo-400
                      "
                    />

                    <span
                      className="
                        absolute -bottom-1 -right-1
                        h-8 w-8
                        border-b-4 border-r-4
                        border-indigo-400
                      "
                    />
                  </div>

                  {/* CAMERA ICON */}

                  <div
                    className="
                      absolute right-4 top-4
                      flex h-10 w-10 items-center
                      justify-center rounded-xl
                      bg-black/50 text-white
                      backdrop-blur-md
                      transition-all duration-300
                      hover:scale-110
                      hover:bg-indigo-500/70
                    "
                  >
                    <CameraIcon size={18} />
                  </div>

                  {/* READY */}

                  {!isRunning && (
                    <div
                      className="
                        absolute inset-0 flex items-center
                        justify-center bg-black/30
                        backdrop-blur-[2px]
                      "
                    >
                      <div
                        className="
                          rounded-2xl border
                          border-white/10
                          bg-black/50 px-6 py-5
                          text-center text-white
                          backdrop-blur-xl
                          transition-all duration-300
                          hover:scale-105
                          hover:border-indigo-400/30
                          hover:bg-black/60
                        "
                      >
                        <div
                          className="
                            mx-auto flex h-12 w-12
                            items-center justify-center
                            rounded-xl
                            bg-indigo-500/20
                            text-indigo-300
                            transition-transform duration-300
                            hover:scale-110
                          "
                        >
                          <Camera size={23} />
                        </div>

                        <p className="mt-3 text-sm font-semibold">
                          Camera Ready
                        </p>

                        <p className="mt-1 text-xs text-slate-300">
                          Start recognition to begin detection
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                PREDICTION
            ================================================= */}

            <div
              className="
                min-w-0 overflow-hidden rounded-3xl
                border border-slate-200 bg-white shadow-sm
                transition-all duration-300
                hover:-translate-y-1
                hover:border-purple-200
                hover:shadow-xl hover:shadow-purple-500/5
                dark:border-slate-800 dark:bg-slate-900
                dark:hover:border-purple-500/30
                dark:hover:shadow-purple-500/10
              "
            >
              <div
                className="
                  flex items-center gap-3 border-b
                  border-slate-200 px-5 py-4
                  dark:border-slate-800
                "
              >
                <div
                  className="
                    flex h-10 w-10 items-center
                    justify-center rounded-xl
                    bg-purple-50 text-purple-600
                    transition-all duration-300
                    hover:scale-110
                    hover:rotate-2
                    hover:shadow-md
                    dark:bg-purple-500/10
                    dark:text-purple-400
                  "
                >
                  <Brain size={19} />
                </div>

                <div>
                  <h3
                    className="
                      text-sm font-semibold
                      text-slate-900 dark:text-white
                    "
                  >
                    AI Prediction
                  </h3>

                  <p
                    className="
                      text-xs text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Current recognition result
                  </p>
                </div>
              </div>

              <div className="flex min-h-[390px] flex-col p-6">
                <div
                  className="
                    flex flex-1 flex-col
                    items-center justify-center
                  "
                >
                  <div
                    className="
                      relative flex h-36 w-36
                      items-center justify-center
                      rounded-[2rem]
                      border border-indigo-200
                      bg-indigo-50
                      text-6xl font-black
                      text-indigo-600
                      transition-all duration-300
                      hover:scale-105
                      hover:border-indigo-400
                      hover:shadow-[0_0_35px_rgba(99,102,241,0.25)]
                      dark:border-indigo-500/20
                      dark:bg-indigo-500/10
                      dark:text-indigo-400
                      dark:hover:border-indigo-400/40
                    "
                  >
                    {prediction}

                    {isRunning &&
                      prediction !== "—" && (
                        <span
                          className="
                            absolute -right-2 -top-2
                            flex h-7 w-7
                            items-center justify-center
                            rounded-full border-4
                            border-white bg-emerald-500
                            dark:border-slate-900
                          "
                        >
                          <CheckCircle2
                            size={14}
                            className="text-white"
                          />
                        </span>
                      )}
                  </div>

                  <p
                    className="
                      mt-5 text-base font-semibold
                      text-slate-900 dark:text-white
                    "
                  >
                    {prediction !== "—"
                      ? "Detected Gesture"
                      : "No Prediction"}
                  </p>

                  <p
                    className="
                      mt-1 text-center text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {isRunning
                      ? prediction !== "—"
                        ? "AI model is analyzing the camera feed."
                        : "Place your hand inside the detection frame."
                      : "Start recognition to begin detection."}
                  </p>

                  {/* ERROR */}

                  {error && (
                    <div
                      className="
                        mt-4 flex max-w-xs
                        items-start gap-2
                        rounded-xl border
                        border-red-200
                        bg-red-50 px-3 py-3
                        text-xs text-red-600
                        transition-all duration-300
                        hover:border-red-300
                        hover:shadow-md
                        dark:border-red-500/20
                        dark:bg-red-500/10
                        dark:text-red-400
                      "
                    >
                      <AlertCircle
                        size={15}
                        className="mt-0.5 shrink-0"
                      />

                      <span>{error}</span>
                    </div>
                  )}
                </div>

                {/* CONFIDENCE */}

                <div
                  className="
                    rounded-2xl border
                    border-slate-200
                    bg-slate-50 p-4
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-indigo-200
                    hover:shadow-md
                    dark:border-slate-800
                    dark:bg-slate-950
                    dark:hover:border-indigo-500/30
                  "
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge
                        size={16}
                        className="
                          text-indigo-500
                          dark:text-indigo-400
                        "
                      />

                      <span
                        className="
                          text-xs font-medium
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Confidence
                      </span>
                    </div>

                    <span
                      className="
                        text-sm font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {confidence.toFixed(2)}%
                    </span>
                  </div>

                  <div
                    className="
                      mt-3 h-2.5 overflow-hidden
                      rounded-full bg-slate-200
                      dark:bg-slate-800
                    "
                  >
                    <div
                      className="
                        h-full rounded-full
                        bg-gradient-to-r
                        from-indigo-500
                        to-emerald-500
                        transition-all duration-500
                      "
                      style={{
                        width: `${Math.min(
                          Math.max(confidence, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* STATS */}

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {/* FPS */}

                  <div
                    className="
                      rounded-xl border
                      border-slate-200
                      bg-slate-50 p-3
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:border-indigo-200
                      hover:bg-indigo-50/50
                      hover:shadow-md
                      dark:border-slate-800
                      dark:bg-slate-950
                      dark:hover:border-indigo-500/30
                      dark:hover:bg-indigo-500/5
                    "
                  >
                    <div className="flex items-center gap-2">
                      <Zap
                        size={14}
                        className="text-amber-500"
                      />

                      <span
                        className="
                          text-[11px]
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        FPS
                      </span>
                    </div>

                    <p
                      className="
                        mt-1 text-lg font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {fps}
                    </p>
                  </div>

                  {/* PROCESSING */}

                  <div
                    className="
                      rounded-xl border
                      border-slate-200
                      bg-slate-50 p-3
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:border-indigo-200
                      hover:bg-indigo-50/50
                      hover:shadow-md
                      dark:border-slate-800
                      dark:bg-slate-950
                      dark:hover:border-indigo-500/30
                      dark:hover:bg-indigo-500/5
                    "
                  >
                    <div className="flex items-center gap-2">
                      <Clock3
                        size={14}
                        className="text-blue-500"
                      />

                      <span
                        className="
                          text-[11px]
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Processing
                      </span>
                    </div>

                    <p
                      className="
                        mt-1 text-lg font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {processingTime} ms
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTROLS
        ===================================================== */}

        <section>
          <div className="mb-5">
            <h2
              className="
                text-lg font-semibold
                text-slate-900 dark:text-white
              "
            >
              Recognition Controls
            </h2>

            <p
              className="
                mt-1 text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Manage your live recognition session.
            </p>
          </div>

          <div
            className="
              rounded-3xl border
              border-slate-200
              bg-white p-5 shadow-sm
              transition-all duration-300
              hover:-translate-y-1
              hover:border-indigo-200
              hover:shadow-xl hover:shadow-indigo-500/5
              dark:border-slate-800
              dark:bg-slate-900
              dark:hover:border-indigo-500/30
              sm:p-6
            "
          >
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {/* START */}

              <button
                type="button"
                onClick={handleStart}
                disabled={isRunning}
                className="
                  inline-flex items-center
                  justify-center gap-2.5
                  rounded-xl bg-emerald-600
                  px-5 py-3 text-sm
                  font-semibold text-white
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-emerald-700
                  hover:shadow-lg
                  hover:shadow-emerald-500/20
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:bg-emerald-500
                  dark:hover:bg-emerald-400
                "
              >
                <Play
                  size={16}
                  fill="currentColor"
                />

                {isRunning
                  ? "Running"
                  : "Start"}
              </button>

              {/* STOP */}

              <button
                type="button"
                onClick={handleStop}
                disabled={!isRunning}
                className="
                  inline-flex items-center
                  justify-center gap-2.5
                  rounded-xl bg-red-600
                  px-5 py-3 text-sm
                  font-semibold text-white
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-red-700
                  hover:shadow-lg
                  hover:shadow-red-500/20
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:bg-red-500
                  dark:hover:bg-red-400
                "
              >
                <Square
                  size={16}
                  fill="currentColor"
                />

                Stop
              </button>

              {/* CAPTURE */}

              <button
                type="button"
                onClick={handleCapture}
                disabled={!isRunning}
                className="
                  inline-flex items-center
                  justify-center gap-2.5
                  rounded-xl bg-blue-600
                  px-5 py-3 text-sm
                  font-semibold text-white
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-blue-700
                  hover:shadow-lg
                  hover:shadow-blue-500/20
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:bg-blue-500
                  dark:hover:bg-blue-400
                "
              >
                <CameraIcon size={17} />

                Capture
              </button>

              {/* RESET */}

              <button
                type="button"
                onClick={handleReset}
                className="
                  inline-flex items-center
                  justify-center gap-2.5
                  rounded-xl bg-violet-600
                  px-5 py-3 text-sm
                  font-semibold text-white
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-violet-700
                  hover:shadow-lg
                  hover:shadow-violet-500/20
                  active:translate-y-0
                  dark:bg-violet-500
                  dark:hover:bg-violet-400
                "
              >
                <RotateCcw size={17} />

                Reset
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            ANALYTICS
        ===================================================== */}

        <section>
          <div className="mb-5 flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 items-center
                justify-center rounded-xl
                bg-indigo-50 text-indigo-600
                transition-all duration-300
                hover:scale-110
                hover:rotate-2
                hover:shadow-md
                dark:bg-indigo-500/10
                dark:text-indigo-400
              "
            >
              <Activity size={19} />
            </div>

            <div>
              <h2
                className="
                  text-lg font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                Recognition Analytics
              </h2>

              <p
                className="
                  mt-1 text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Prediction history and system performance.
              </p>
            </div>
          </div>

          <div
            className="
              grid grid-cols-1 gap-6
              lg:grid-cols-2
            "
          >
            {/* HISTORY */}

            <div
              className="
                min-w-0 overflow-hidden
                rounded-3xl border
                border-slate-200
                bg-white shadow-sm
                transition-all duration-300
                hover:-translate-y-1
                hover:border-indigo-200
                hover:shadow-xl
                hover:shadow-indigo-500/5
                dark:border-slate-800
                dark:bg-slate-900
                dark:hover:border-indigo-500/30
              "
            >
              <div
                className="
                  border-b
                  border-slate-200
                  px-5 py-4
                  dark:border-slate-800
                "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className="
                        text-sm font-semibold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      Recent Predictions
                    </h3>

                    <p
                      className="
                        mt-1 text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Latest recognition results
                    </p>
                  </div>

                  <div
                    className="
                      flex h-9 w-9 items-center
                      justify-center rounded-xl
                      bg-indigo-50
                      text-indigo-600
                      transition-all duration-300
                      hover:scale-110
                      hover:rotate-2
                      hover:shadow-md
                      dark:bg-indigo-500/10
                      dark:text-indigo-400
                    "
                  >
                    <Brain size={17} />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table
                  className="
                    w-full min-w-[420px]
                    text-left
                  "
                >
                  <thead>
                    <tr
                      className="
                        border-b
                        border-slate-200
                        dark:border-slate-800
                      "
                    >
                      <th
                        className="
                          px-5 py-3
                          text-xs font-semibold
                          uppercase tracking-wider
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Time
                      </th>

                      <th
                        className="
                          px-5 py-3
                          text-xs font-semibold
                          uppercase tracking-wider
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Sign
                      </th>

                      <th
                        className="
                          px-5 py-3
                          text-xs font-semibold
                          uppercase tracking-wider
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Confidence
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="
                            px-5 py-12
                            text-center text-sm
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          No predictions yet.
                        </td>
                      </tr>
                    ) : (
                      history.map(
                        (item, index) => (
                          <tr
                            key={`${item.time}-${index}`}
                            className="
                              border-b
                              border-slate-100
                              transition-all duration-200
                              hover:bg-indigo-50/60
                              dark:border-slate-800
                              dark:hover:bg-indigo-500/5
                            "
                          >
                            <td
                              className="
                                px-5 py-4 text-sm
                                text-slate-500
                                dark:text-slate-400
                              "
                            >
                              {item.time}
                            </td>

                            <td
                              className="
                                px-5 py-4 text-sm
                                font-bold
                                text-indigo-600
                                transition-colors duration-200
                                dark:text-indigo-400
                              "
                            >
                              {item.prediction}
                            </td>

                            <td
                              className="
                                px-5 py-4 text-sm
                                font-semibold
                                text-emerald-600
                                dark:text-emerald-400
                              "
                            >
                              {item.confidence}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SYSTEM STATS */}

            <div
              className="
                min-w-0 overflow-hidden
                rounded-3xl border
                border-slate-200
                bg-white shadow-sm
                transition-all duration-300
                hover:-translate-y-1
                hover:border-emerald-200
                hover:shadow-xl
                hover:shadow-emerald-500/5
                dark:border-slate-800
                dark:bg-slate-900
                dark:hover:border-emerald-500/30
              "
            >
              <div
                className="
                  flex items-center
                  justify-between
                  border-b
                  border-slate-200
                  px-5 py-4
                  dark:border-slate-800
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-10 w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-emerald-50
                      text-emerald-600
                      transition-all duration-300
                      hover:scale-110
                      hover:rotate-2
                      hover:shadow-md
                      dark:bg-emerald-500/10
                      dark:text-emerald-400
                    "
                  >
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <h3
                      className="
                        text-sm font-semibold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      System Statistics
                    </h3>

                    <p
                      className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Current recognition performance
                    </p>
                  </div>
                </div>

                <Cpu
                  size={20}
                  className="
                    text-slate-400
                    transition-transform duration-300
                    hover:rotate-12 hover:scale-110
                    dark:text-slate-500
                  "
                />
              </div>

              <div
                className="
                  grid grid-cols-2 gap-4 p-5
                "
              >
                {/* ACCURACY */}

                <div
                  className="
                    rounded-2xl border
                    border-slate-200
                    bg-slate-50 p-4
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-emerald-200
                    hover:shadow-lg
                    hover:shadow-emerald-500/5
                    dark:border-slate-800
                    dark:bg-slate-950
                    dark:hover:border-emerald-500/30
                  "
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Confidence
                    </p>

                    <MonitorCheck
                      size={15}
                      className="
                        text-emerald-500
                        transition-transform duration-300
                        hover:scale-125
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-2 text-2xl font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {confidence > 0
                      ? `${confidence.toFixed(2)}%`
                      : "0%"}
                  </p>
                </div>

                {/* FPS */}

                <div
                  className="
                    rounded-2xl border
                    border-slate-200
                    bg-slate-50 p-4
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-amber-200
                    hover:shadow-lg
                    hover:shadow-amber-500/5
                    dark:border-slate-800
                    dark:bg-slate-950
                    dark:hover:border-amber-500/30
                  "
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      FPS
                    </p>

                    <Zap
                      size={15}
                      className="
                        text-amber-500
                        transition-transform duration-300
                        hover:scale-125
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-2 text-2xl font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {fps}
                  </p>
                </div>

                {/* PREDICTIONS */}

                <div
                  className="
                    rounded-2xl border
                    border-slate-200
                    bg-slate-50 p-4
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-indigo-200
                    hover:shadow-lg
                    hover:shadow-indigo-500/5
                    dark:border-slate-800
                    dark:bg-slate-950
                    dark:hover:border-indigo-500/30
                  "
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Predictions
                    </p>

                    <Brain
                      size={15}
                      className="
                        text-indigo-500
                        transition-transform duration-300
                        hover:scale-125
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-2 text-2xl font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {history.length}
                  </p>
                </div>

                {/* STATUS */}

                <div
                  className="
                    rounded-2xl border
                    border-slate-200
                    bg-slate-50 p-4
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-blue-200
                    hover:shadow-lg
                    dark:border-slate-800
                    dark:bg-slate-950
                    dark:hover:border-blue-500/30
                  "
                >
                  <p
                    className="
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Status
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`
                        h-2 w-2 rounded-full
                        ${
                          isRunning
                            ? "animate-pulse bg-emerald-500"
                            : "bg-slate-400"
                        }
                      `}
                    />

                    <p
                      className={`
                        text-sm font-bold
                        ${
                          isRunning
                            ? `
                              text-emerald-600
                              dark:text-emerald-400
                            `
                            : `
                              text-slate-600
                              dark:text-slate-300
                            `
                        }
                      `}
                    >
                      {isRunning
                        ? "Detecting"
                        : "Ready"}
                    </p>
                  </div>
                </div>
              </div>

              {/* MODEL */}

              <div
                className="
                  mx-5 mb-5 flex
                  items-center gap-3
                  rounded-2xl border
                  border-slate-200
                  bg-slate-50 p-4
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-indigo-200
                  hover:shadow-lg
                  dark:border-slate-800
                  dark:bg-slate-950
                  dark:hover:border-indigo-500/30
                "
              >
                <div
                  className="
                    flex h-9 w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-50
                    text-indigo-600
                    transition-all duration-300
                    hover:scale-110
                    hover:rotate-2
                    dark:bg-indigo-500/10
                    dark:text-indigo-400
                  "
                >
                  <Cpu size={17} />
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    AI Model
                  </p>

                  <p
                    className="
                      mt-0.5 text-sm
                      font-semibold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    SignAI Landmark Classifier
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default LiveRecognition;