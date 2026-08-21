import {
  Brain,
  CheckCircle2,
  Clock3,
  Cpu,
  Loader2,
  Target,
} from "lucide-react";

const ImagePrediction = ({
  prediction,
  loading = false,
}) => {
  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div
        className="
          group
          relative
          flex
          min-h-[420px]
          w-full
          flex-col
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-6
          text-center
          shadow-sm

          dark:border-slate-800
          dark:bg-slate-900

          transition-all
          duration-300
          hover:shadow-xl
          hover:shadow-indigo-500/5
        "
      >
        {/* Background Glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-40
            w-40
            rounded-full
            bg-indigo-500/10
            blur-3xl

            transition-transform
            duration-700

            group-hover:scale-150
          "
        />

        {/* Loader */}

        <div
          className="
            relative
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-2xl

            bg-indigo-50
            text-indigo-500

            dark:bg-indigo-500/10
            dark:text-indigo-400

            shadow-lg
            shadow-indigo-500/10

            transition-all
            duration-300

            group-hover:scale-110
            group-hover:rotate-3
          "
        >
          <Loader2
            size={40}
            className="animate-spin"
          />
        </div>

        <h3
          className="
            relative
            mt-5
            text-base
            font-semibold

            text-slate-800
            dark:text-white
          "
        >
          Analyzing Image...
        </h3>

        <p
          className="
            relative
            mt-2
            max-w-sm
            text-sm
            leading-6

            text-slate-500
            dark:text-slate-400
          "
        >
          Detecting hand landmarks and running the
          trained AI model.
        </p>

        {/* Loading Indicator */}

        <div
          className="
            relative
            mt-6
            h-1.5
            w-48
            overflow-hidden
            rounded-full
            bg-slate-200

            dark:bg-slate-800
          "
        >
          <div
            className="
              h-full
              w-1/2
              animate-pulse
              rounded-full
              bg-indigo-500
            "
          />
        </div>
      </div>
    );
  }

  // =========================================================
  // NO PREDICTION
  // =========================================================

  if (!prediction) {
    return (
      <div
        className="
          group
          relative
          flex
          min-h-[420px]
          w-full
          flex-col
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-6
          text-center
          shadow-sm

          dark:border-slate-800
          dark:bg-slate-900

          transition-all
          duration-300

          hover:-translate-y-1
          hover:shadow-xl
          hover:shadow-indigo-500/5
        "
      >
        {/* Background Glow */}

        <div
          className="
            pointer-events-none
            absolute
            -left-20
            -top-20
            h-40
            w-40
            rounded-full
            bg-indigo-500/5
            blur-3xl

            transition-all
            duration-700

            group-hover:scale-150
            group-hover:bg-indigo-500/10
          "
        />

        <div
          className="
            relative
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-2xl

            bg-indigo-50
            text-indigo-500

            dark:bg-indigo-500/10
            dark:text-indigo-400

            transition-all
            duration-300

            group-hover:scale-110
            group-hover:rotate-3
          "
        >
          <Brain size={36} />
        </div>

        <h3
          className="
            relative
            mt-5
            text-base
            font-semibold

            text-slate-800
            dark:text-white
          "
        >
          No Prediction Yet
        </h3>

        <p
          className="
            relative
            mt-2
            max-w-sm
            text-sm
            leading-6

            text-slate-500
            dark:text-slate-400
          "
        >
          Upload a hand gesture image and click{" "}
          <span
            className="
              font-semibold
              text-indigo-500
              dark:text-indigo-400
            "
          >
            Predict
          </span>{" "}
          to see the AI recognition result here.
        </p>

        {/* Bottom Accent */}

        <div
          className="
            absolute
            bottom-0
            left-0
            h-0.5
            w-0
            bg-indigo-500

            transition-all
            duration-500

            group-hover:w-full
          "
        />
      </div>
    );
  }

  // =========================================================
  // GET PREDICTION LABEL
  // =========================================================

  const label =
    prediction.label ??
    prediction.predicted_label ??
    prediction.prediction ??
    prediction.class ??
    prediction.sign ??
    "?";

  // =========================================================
  // CONFIDENCE
  // =========================================================

  let confidence =
    prediction.confidence_percent ??
    prediction.confidence ??
    prediction.probability ??
    null;

  if (confidence !== null) {
    confidence = Number(confidence);

    if (confidence > 0 && confidence <= 1) {
      confidence = confidence * 100;
    }

    confidence = Math.min(
      100,
      Math.max(0, confidence)
    );
  }

  // =========================================================
  // ACCURACY
  // =========================================================

  let accuracy =
    prediction.accuracy_percent ??
    prediction.accuracy ??
    null;

  if (accuracy !== null) {
    accuracy = Number(accuracy);

    if (accuracy > 0 && accuracy <= 1) {
      accuracy = accuracy * 100;
    }

    accuracy = Math.min(
      100,
      Math.max(0, accuracy)
    );
  }

  // =========================================================
  // PROCESSING TIME
  // =========================================================

  const processingTime =
    prediction.processing_time_ms ??
    prediction.processing_time ??
    prediction.processingTime ??
    null;

  // =========================================================
  // MODEL
  // =========================================================

  const modelName =
    prediction.model ??
    prediction.model_name ??
    "SignAI Neural Network";

  // =========================================================
  // RESULT CARD
  // =========================================================

  return (
    <div
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        text-slate-900
        shadow-sm

        dark:border-slate-800
        dark:bg-slate-900
        dark:text-white

        transition-all
        duration-300

        hover:shadow-xl
        hover:shadow-indigo-500/5
      "
    >
      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-52
          w-52
          rounded-full
          bg-indigo-500/5
          blur-3xl

          transition-all
          duration-700

          group-hover:scale-150
          group-hover:bg-indigo-500/10
        "
      />

      <div className="relative">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-center gap-3">

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

              dark:bg-purple-500/10
              dark:text-purple-400

              transition-all
              duration-300

              group-hover:scale-110
              group-hover:rotate-3
            "
          >
            <Brain size={20} />
          </div>

          <div>
            <h2
              className="
                text-lg
                font-semibold

                text-slate-900
                dark:text-white
              "
            >
              Prediction Result
            </h2>

            <p
              className="
                mt-1
                text-xs

                text-slate-500
                dark:text-slate-400
              "
            >
              AI image recognition result
            </p>
          </div>

        </div>


        {/* =====================================================
            PREDICTED GESTURE
        ===================================================== */}

        <div className="mt-8">

          <div className="flex items-center gap-2">

            <CheckCircle2
              size={17}
              className="
                text-emerald-500
                dark:text-emerald-400
              "
            />

            <p
              className="
                text-sm
                font-medium

                text-slate-500
                dark:text-slate-400
              "
            >
              Predicted Gesture
            </p>

          </div>


          <div className="mt-4 flex items-center gap-5">

            {/* LETTER */}

            <div
              className="
                group/letter
                relative
                flex
                h-28
                w-28
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-3xl
                border

                border-indigo-200
                bg-indigo-50

                dark:border-indigo-500/20
                dark:bg-indigo-500/10

                shadow-sm

                transition-all
                duration-300

                hover:-translate-y-1
                hover:scale-105
                hover:shadow-xl
                hover:shadow-indigo-500/20
              "
            >

              <div
                className="
                  absolute
                  inset-0
                  bg-indigo-500/5

                  transition-all
                  duration-500

                  group-hover/letter:scale-150
                "
              />

              <span
                className="
                  relative
                  text-7xl
                  font-black
                  tracking-tight

                  text-indigo-600
                  dark:text-indigo-400

                  transition-all
                  duration-300

                  group-hover/letter:scale-110
                "
              >
                {String(label).toUpperCase()}
              </span>

            </div>


            {/* LABEL */}

            <div>

              <p
                className="
                  text-xs

                  text-slate-500
                  dark:text-slate-400
                "
              >
                Recognized Sign
              </p>

              <p
                className="
                  mt-1
                  text-xl
                  font-bold

                  text-slate-900
                  dark:text-white
                "
              >
                Sign {String(label).toUpperCase()}
              </p>

              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-1.5
                  text-xs
                  font-semibold

                  text-emerald-600
                  dark:text-emerald-400
                "
              >
                <CheckCircle2 size={14} />

                Recognition successful
              </div>

            </div>

          </div>
        </div>


        {/* =====================================================
            CONFIDENCE
        ===================================================== */}

        <div
          className="
            mt-8
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-4

            dark:border-slate-800
            dark:bg-slate-800/50

            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:border-emerald-200
            hover:shadow-md

            dark:hover:border-emerald-500/20
          "
        >

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <CheckCircle2
                size={17}
                className="
                  text-emerald-500
                  dark:text-emerald-400
                "
              />

              <span
                className="
                  text-sm
                  font-medium

                  text-slate-600
                  dark:text-slate-300
                "
              >
                Confidence
              </span>

            </div>

            <span
              className="
                text-lg
                font-bold

                text-emerald-600
                dark:text-emerald-400
              "
            >
              {confidence !== null
                ? `${confidence.toFixed(2)}%`
                : "--"}
            </span>

          </div>


          {confidence !== null && (
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
                  h-full
                  rounded-full
                  bg-emerald-500

                  transition-all
                  duration-1000
                  ease-out
                "
                style={{
                  width: `${confidence}%`,
                }}
              />
            </div>
          )}

        </div>


        {/* =====================================================
            ACCURACY
        ===================================================== */}

        <div
          className="
            mt-4
            rounded-2xl
            border
            border-emerald-200
            bg-emerald-50
            p-4

            dark:border-emerald-500/20
            dark:bg-emerald-500/5

            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:shadow-md
            hover:shadow-emerald-500/10
          "
        >

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <Target
                size={17}
                className="
                  text-emerald-600
                  dark:text-emerald-400

                  transition-transform
                  duration-300

                  group-hover:scale-110
                "
              />

              <span
                className="
                  text-sm
                  font-medium

                  text-slate-600
                  dark:text-slate-300
                "
              >
                Accuracy
              </span>

            </div>

            <span
              className="
                text-lg
                font-bold

                text-emerald-600
                dark:text-emerald-400
              "
            >
              {accuracy !== null
                ? `${accuracy.toFixed(2)}%`
                : "--"}
            </span>

          </div>


          {accuracy !== null && (
            <div
              className="
                mt-4
                h-3
                w-full
                overflow-hidden
                rounded-full

                bg-emerald-100

                dark:bg-emerald-950/50
              "
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-emerald-500

                  transition-all
                  duration-1000
                  ease-out
                "
                style={{
                  width: `${accuracy}%`,
                }}
              />
            </div>
          )}

          <p
            className="
              mt-2
              text-xs

              text-emerald-600/80
              dark:text-emerald-400/70
            "
          >
            Prediction accuracy
          </p>

        </div>


        {/* =====================================================
            PROCESSING TIME
        ===================================================== */}

        <div
          className="
            mt-4
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-4

            dark:border-slate-800
            dark:bg-slate-800/50

            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:border-blue-200
            hover:shadow-md

            dark:hover:border-blue-500/20
          "
        >

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <Clock3
                size={17}
                className="
                  text-blue-500
                  dark:text-blue-400

                  transition-transform
                  duration-300

                  group-hover:rotate-12
                "
              />

              <span
                className="
                  text-sm
                  font-medium

                  text-slate-600
                  dark:text-slate-300
                "
              >
                Processing Time
              </span>

            </div>

            <span
              className="
                text-sm
                font-bold

                text-slate-900
                dark:text-white
              "
            >
              {processingTime !== null
                ? `${processingTime} ms`
                : "Completed"}
            </span>

          </div>

        </div>


        {/* =====================================================
            MODEL
        ===================================================== */}

        <div
          className="
            mt-4
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-4

            dark:border-slate-800
            dark:bg-slate-800/50

            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:border-purple-200
            hover:shadow-md

            dark:hover:border-purple-500/20
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <div className="flex items-center gap-2">

              <Cpu
                size={17}
                className="
                  text-purple-500
                  dark:text-purple-400

                  transition-transform
                  duration-300

                  group-hover:scale-110
                "
              />

              <span
                className="
                  text-sm
                  font-medium

                  text-slate-600
                  dark:text-slate-300
                "
              >
                Model
              </span>

            </div>

            <span
              className="
                text-right
                text-sm
                font-semibold

                text-slate-900
                dark:text-white
              "
            >
              {modelName}
            </span>

          </div>

        </div>


        {/* =====================================================
            STATUS
        ===================================================== */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-emerald-200
            bg-emerald-50
            px-4
            py-3

            dark:border-emerald-500/20
            dark:bg-emerald-500/10

            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:shadow-md
            hover:shadow-emerald-500/10
          "
        >

          <div className="flex items-center gap-2">

            <span className="relative flex h-2.5 w-2.5">

              <span
                className="
                  absolute
                  inline-flex
                  h-full
                  w-full
                  animate-ping
                  rounded-full
                  bg-emerald-400
                  opacity-75
                "
              />

              <span
                className="
                  relative
                  inline-flex
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-emerald-500
                "
              />

            </span>

            <span
              className="
                text-sm
                font-medium

                text-slate-600
                dark:text-slate-300
              "
            >
              Status
            </span>

          </div>

          <div
            className="
              flex
              items-center
              gap-1.5
              text-sm
              font-bold

              text-emerald-600
              dark:text-emerald-400
            "
          >
            <CheckCircle2 size={16} />

            Recognized
          </div>

        </div>

      </div>


      {/* =====================================================
          BOTTOM ACCENT
      ===================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          h-0.5
          w-0

          bg-gradient-to-r
          from-indigo-500
          via-purple-500
          to-emerald-500

          transition-all
          duration-500

          group-hover:w-full
        "
      />

    </div>
  );
};

export default ImagePrediction;