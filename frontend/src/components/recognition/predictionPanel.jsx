import {
  FaCheckCircle,
  FaBolt,
  FaClock,
} from "react-icons/fa";

const PredictionPanel = ({
  prediction = null,
  fps = 0,
  processingTime = 0,
  isDetecting = false,
}) => {
  // =========================================================
  // GET VALUES
  // =========================================================

  const label = prediction?.label || "--";

  let confidence = Number(
    prediction?.confidence_percent ?? 0
  );

  confidence = Math.min(
    Math.max(confidence, 0),
    100
  );

  // =========================================================
  // STATUS
  // =========================================================

  let status = "Waiting";

  if (isDetecting && prediction) {
    status = "Detecting";
  } else if (isDetecting) {
    status = "Processing";
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      className="
        group
        w-full
        rounded-2xl
        border
        p-5
        sm:p-6

        bg-white
        text-slate-900

        border-slate-200

        dark:bg-slate-900
        dark:text-white
        dark:border-slate-800

        shadow-sm
        hover:shadow-xl

        transition-all
        duration-300
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          {/* ICON */}

          <div
            className={`
              relative
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

              transition-all
              duration-300

              group-hover:scale-105

              ${
                isDetecting
                  ? "shadow-lg shadow-purple-500/20"
                  : ""
              }
            `}
          >
            <FaCheckCircle size={18} />

            {/* LIVE DOT */}

            {isDetecting && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  h-3
                  w-3
                  rounded-full

                  bg-emerald-500

                  ring-2
                  ring-white

                  dark:ring-slate-900

                  animate-pulse
                "
              />
            )}
          </div>

          {/* TITLE */}

          <div>

            <h2
              className="
                text-lg
                font-semibold

                text-slate-900

                dark:text-white
              "
            >
              AI Prediction
            </h2>

            <p
              className="
                mt-1
                text-xs

                text-slate-500

                dark:text-slate-400
              "
            >
              Current recognition result
            </p>

          </div>

        </div>

        {/* STATUS BADGE */}

        <div
          className={`
            hidden
            rounded-full
            px-3
            py-1.5

            text-xs
            font-semibold

            sm:flex
            items-center
            gap-1.5

            transition-all
            duration-300

            ${
              isDetecting
                ? `
                  bg-emerald-50
                  text-emerald-600

                  dark:bg-emerald-500/10
                  dark:text-emerald-400
                `
                : `
                  bg-slate-100
                  text-slate-500

                  dark:bg-slate-800
                  dark:text-slate-400
                `
            }
          `}
        >

          <span
            className={`
              h-1.5
              w-1.5
              rounded-full

              ${
                isDetecting
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-slate-400"
              }
            `}
          />

          {status}

        </div>

      </div>


      {/* =====================================================
          DETECTED GESTURE
      ===================================================== */}

      <div className="mt-8 text-center">

        <div
          className={`
            mx-auto
            flex
            h-28
            w-28
            items-center
            justify-center
            rounded-3xl

            border

            bg-indigo-50
            border-indigo-100

            dark:bg-indigo-500/10
            dark:border-indigo-500/20

            transition-all
            duration-500

            hover:-translate-y-2
            hover:scale-105

            hover:shadow-xl
            hover:shadow-indigo-500/20

            ${
              isDetecting
                ? `
                  shadow-lg
                  shadow-indigo-500/20
                  ring-4
                  ring-indigo-500/5
                `
                : ""
            }
          `}
        >

          <h1
            className="
              text-6xl
              sm:text-7xl
              font-black
              tracking-tight

              text-indigo-600

              dark:text-indigo-400

              transition-transform
              duration-300

              hover:scale-110
            "
          >
            {String(label).toUpperCase()}
          </h1>

        </div>

        <p
          className="
            mt-4
            text-sm
            font-medium

            text-slate-500

            dark:text-slate-400
          "
        >
          Detected Gesture
        </p>

      </div>


      {/* =====================================================
          PREDICTION DETAILS
      ===================================================== */}

      <div className="mt-10 space-y-4">

        {/* =================================================
            CONFIDENCE
        ================================================= */}

        <div
          className="
            rounded-2xl
            border
            p-4

            border-slate-200
            bg-slate-50

            dark:border-slate-800
            dark:bg-slate-800/50

            transition-all
            duration-300

            hover:border-emerald-200
            hover:bg-emerald-50/40
            hover:shadow-md

            dark:hover:border-emerald-500/20
            dark:hover:bg-emerald-500/5
          "
        >

          <div className="flex items-center justify-between">

            <span
              className="
                flex
                items-center
                gap-2

                text-sm
                font-medium

                text-slate-500

                dark:text-slate-400
              "
            >
              <FaCheckCircle
                className="
                  text-emerald-500
                  dark:text-emerald-400
                "
              />

              Confidence
            </span>

            <span
              className="
                font-bold

                text-emerald-600

                dark:text-emerald-400
              "
            >
              {confidence.toFixed(2)}%
            </span>

          </div>


          {/* Progress Bar */}

          <div
            className="
              mt-4
              h-3
              w-full
              overflow-hidden
              rounded-full

              bg-slate-200

              dark:bg-slate-700
            "
          >

            <div
              className="
                relative
                h-full
                rounded-full

                bg-emerald-500

                transition-all
                duration-700
                ease-out
              "
              style={{
                width: `${confidence}%`,
              }}
            >

              {/* SHINE */}

              <div
                className="
                  absolute
                  inset-0

                  bg-white/20

                  opacity-0

                  transition-opacity
                  duration-300

                  hover:opacity-100
                "
              />

            </div>

          </div>

        </div>


        {/* =================================================
            FPS
        ================================================= */}

        <div
          className="
            group/item
            flex
            items-center
            justify-between

            rounded-xl
            border
            px-4
            py-3

            border-slate-200
            bg-slate-50

            dark:border-slate-800
            dark:bg-slate-800/50

            transition-all
            duration-300

            hover:-translate-y-1
            hover:border-amber-200
            hover:bg-amber-50/50
            hover:shadow-md

            dark:hover:border-amber-500/20
            dark:hover:bg-amber-500/5
          "
        >

          <span
            className="
              flex
              items-center
              gap-2
              text-sm

              text-slate-500

              dark:text-slate-400
            "
          >

            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg

                bg-amber-50

                dark:bg-amber-500/10
              "
            >
              <FaBolt
                className="
                  text-amber-500
                  dark:text-amber-400

                  transition-transform
                  duration-300

                  group-hover/item:scale-110
                "
              />
            </span>

            FPS

          </span>

          <span
            className="
              font-bold

              text-slate-900

              dark:text-white
            "
          >
            {fps || 0}
          </span>

        </div>


        {/* =================================================
            PROCESSING TIME
        ================================================= */}

        <div
          className="
            group/item
            flex
            items-center
            justify-between

            rounded-xl
            border
            px-4
            py-3

            border-slate-200
            bg-slate-50

            dark:border-slate-800
            dark:bg-slate-800/50

            transition-all
            duration-300

            hover:-translate-y-1
            hover:border-blue-200
            hover:bg-blue-50/50
            hover:shadow-md

            dark:hover:border-blue-500/20
            dark:hover:bg-blue-500/5
          "
        >

          <span
            className="
              flex
              items-center
              gap-2
              text-sm

              text-slate-500

              dark:text-slate-400
            "
          >

            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg

                bg-blue-50

                dark:bg-blue-500/10
              "
            >
              <FaClock
                className="
                  text-blue-500
                  dark:text-blue-400

                  transition-transform
                  duration-300

                  group-hover/item:scale-110
                "
              />
            </span>

            Processing

          </span>

          <span
            className="
              font-bold

              text-slate-900

              dark:text-white
            "
          >
            {processingTime
              ? `${processingTime} ms`
              : "--"}
          </span>

        </div>


        {/* =================================================
            STATUS
        ================================================= */}

        <div
          className={`
            flex
            items-center
            justify-between

            rounded-xl
            border
            px-4
            py-3

            transition-all
            duration-300

            hover:-translate-y-1
            hover:shadow-md

            ${
              isDetecting
                ? `
                  border-emerald-200
                  bg-emerald-50

                  dark:border-emerald-500/20
                  dark:bg-emerald-500/10

                  hover:shadow-emerald-500/10
                `
                : `
                  border-slate-200
                  bg-slate-50

                  dark:border-slate-800
                  dark:bg-slate-800/50
                `
            }
          `}
        >

          <span
            className="
              flex
              items-center
              gap-2
              text-sm

              text-slate-600

              dark:text-slate-400
            "
          >

            <FaCheckCircle
              className={
                isDetecting
                  ? `
                    text-emerald-500
                    dark:text-emerald-400

                    animate-pulse
                  `
                  : `
                    text-slate-400
                    dark:text-slate-500
                  `
              }
            />

            Status

          </span>

          <span
            className={
              isDetecting
                ? `
                  font-bold
                  text-emerald-600
                  dark:text-emerald-400
                `
                : `
                  font-semibold
                  text-slate-500
                  dark:text-slate-400
                `
            }
          >
            {status}
          </span>

        </div>

      </div>


      {/* =====================================================
          LIVE RECOGNITION INDICATOR
      ===================================================== */}

      {isDetecting && (
        <div
          className="
            mt-5
            flex
            items-center
            gap-3

            rounded-xl
            border
            border-indigo-200
            bg-indigo-50
            px-4
            py-3

            dark:border-indigo-500/20
            dark:bg-indigo-500/10

            animate-in
            fade-in
            duration-300
          "
        >

          <div className="relative flex h-3 w-3">

            <span
              className="
                absolute
                inline-flex
                h-full
                w-full
                rounded-full

                bg-indigo-400

                opacity-75

                animate-ping
              "
            />

            <span
              className="
                relative
                inline-flex
                h-3
                w-3
                rounded-full

                bg-indigo-500
              "
            />

          </div>

          <span
            className="
              text-xs
              font-medium

              text-indigo-600

              dark:text-indigo-400
            "
          >
            AI recognition is running in real time
          </span>

        </div>
      )}

    </div>
  );
};

export default PredictionPanel;