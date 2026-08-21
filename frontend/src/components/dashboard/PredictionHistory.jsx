import React, { useMemo } from "react";

import {
  Brain,
  CheckCircle2,
  Clock3,
  Target,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

const PredictionHistory = ({
  predictions = [],
  accuracy = 93.63,
  loading = false,
}) => {
  /* =====================================================
     FORMAT PERCENTAGE
  ===================================================== */

  const formatPercentage = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "--";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return "--";
    }

    const percentage =
      number <= 1
        ? number * 100
        : number;

    return `${percentage.toFixed(2)}%`;
  };

  /* =====================================================
     CONVERT VALUE TO PERCENTAGE NUMBER
  ===================================================== */

  const getPercentageNumber = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return null;
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return null;
    }

    return number <= 1
      ? number * 100
      : number;
  };

  /* =====================================================
     OVERALL MODEL ACCURACY
  ===================================================== */

  const overallAccuracy = useMemo(() => {
    const value = getPercentageNumber(accuracy);

    if (value === null) {
      return 93.63;
    }

    return value;
  }, [accuracy]);

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (value) => {
    if (!value) {
      return "--";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "--";
    }

    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =====================================================
     NORMALIZE PREDICTIONS
  ===================================================== */

  const normalizedPredictions = useMemo(() => {
    if (!Array.isArray(predictions)) {
      return [];
    }

    const normalized = predictions.map(
      (prediction, index) => {
        /* ================================================
           CONFIDENCE

           Confidence belongs to the individual prediction.
        ================================================= */

        const confidence =
          prediction.confidence_percent ??
          prediction.confidence ??
          null;

        /* ================================================
           PREDICTION-SPECIFIC ACCURACY

           If backend sends a specific accuracy, use it.

           Otherwise we will use the overall model accuracy
           in the table.
        ================================================= */

        const predictionAccuracy =
          prediction.accuracy_percent ??
          prediction.accuracy ??
          prediction.class_accuracy ??
          null;

        /* ================================================
           MODEL ACCURACY

           Backend may send it, otherwise Dashboard's
           accuracy prop will be used later.
        ================================================= */

        const backendModelAccuracy =
          prediction.model_accuracy ??
          prediction.model_accuracy_percent ??
          null;

        return {
          ...prediction,

          id:
            prediction._id ??
            prediction.id ??
            index,

          label:
            prediction.label ??
            prediction.prediction ??
            prediction.gesture ??
            prediction.class_name ??
            "Unknown",

          confidence,

          predictionAccuracy,

          backendModelAccuracy,

          timestamp:
            prediction.createdAt ??
            prediction.created_at ??
            prediction.timestamp ??
            prediction.date ??
            null,
        };
      }
    );

    /* ================================================
       NEWEST FIRST
    ================================================= */

    normalized.sort((a, b) => {
      const dateA = a.timestamp
        ? new Date(a.timestamp).getTime()
        : 0;

      const dateB = b.timestamp
        ? new Date(b.timestamp).getTime()
        : 0;

      return dateB - dateA;
    });

    /* ================================================
       LATEST 10
    ================================================= */

    return normalized.slice(0, 10);
  }, [predictions]);

  /* =====================================================
     EMPTY STATE
  ===================================================== */

  if (!normalizedPredictions.length) {
    return (
      <div
        className="
          flex
          min-h-[260px]
          flex-col
          items-center
          justify-center
          px-6
          py-10
          text-center
        "
      >
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl

            bg-indigo-50
            text-indigo-600

            dark:bg-indigo-500/10
            dark:text-indigo-400
          "
        >
          <Brain size={26} />
        </div>

        <h3
          className="
            mt-4
            text-base
            font-semibold

            text-slate-900
            dark:text-white
          "
        >
          No Predictions Yet
        </h3>

        <p
          className="
            mt-2
            max-w-md
            text-sm
            leading-6

            text-slate-500
            dark:text-slate-400
          "
        >
          Start recognition to see your latest sign
          language predictions, confidence, and model
          accuracy here.
        </p>

        {!loading && (
          <div
            className="
              mt-4
              rounded-lg
              border
              border-indigo-200
              bg-indigo-50
              px-4
              py-2

              dark:border-indigo-500/20
              dark:bg-indigo-500/5
            "
          >
            <p
              className="
                text-xs
                font-semibold
                text-indigo-600

                dark:text-indigo-400
              "
            >
              Model Accuracy:{" "}
              {overallAccuracy.toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    );
  }

  /* =====================================================
     TABLE
  ===================================================== */

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <table
          className="
            min-w-[760px]
            w-full
            border-collapse
            text-left
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <thead>
            <tr
              className="
                border-b
                border-slate-200
                bg-slate-50/80

                dark:border-slate-800
                dark:bg-slate-950/40
              "
            >
              <th
                className="
                  px-5
                  py-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider

                  text-slate-500
                  dark:text-slate-400
                "
              >
                Prediction
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider

                  text-slate-500
                  dark:text-slate-400
                "
              >
                Confidence
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider

                  text-slate-500
                  dark:text-slate-400
                "
              >
                Accuracy
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider

                  text-slate-500
                  dark:text-slate-400
                "
              >
                Date
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-right
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider

                  text-slate-500
                  dark:text-slate-400
                "
              >
                Status
              </th>
            </tr>
          </thead>

          {/* =================================================
              BODY
          ================================================= */}

          <tbody
            className="
              divide-y
              divide-slate-100

              dark:divide-slate-800/80
            "
          >
            {normalizedPredictions.map(
              (prediction) => {
                /* =========================================
                   CONFIDENCE
                ========================================= */

                const confidencePercentage =
                  getPercentageNumber(
                    prediction.confidence
                  );

                /* =========================================
                   ACCURACY

                   Priority:

                   1. Backend prediction-specific accuracy
                   2. Backend model accuracy
                   3. Dashboard overall accuracy
                ========================================= */

                const accuracyPercentage =
                  getPercentageNumber(
                    prediction.predictionAccuracy
                  ) ??
                  getPercentageNumber(
                    prediction.backendModelAccuracy
                  ) ??
                  overallAccuracy;

                /* =========================================
                   STATUS

                   Status should primarily represent
                   prediction confidence.
                ========================================= */

                const statusValue =
                  confidencePercentage ??
                  accuracyPercentage ??
                  0;

                const isHigh =
                  statusValue >= 90;

                const isModerate =
                  statusValue >= 75 &&
                  statusValue < 90;

                return (
                  <tr
                    key={prediction.id}
                    className="
                      group
                      transition-all
                      duration-200

                      hover:bg-indigo-50/50

                      dark:hover:bg-indigo-500/5
                    "
                  >
                    {/* =====================================
                        PREDICTION
                    ===================================== */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl

                            bg-indigo-50
                            text-indigo-600

                            transition-all
                            duration-200

                            group-hover:scale-105

                            dark:bg-indigo-500/10
                            dark:text-indigo-400
                          "
                        >
                          <Brain size={18} />
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                              truncate
                              text-sm
                              font-semibold

                              text-slate-900
                              dark:text-white
                            "
                          >
                            {prediction.label}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-xs

                              text-slate-400
                              dark:text-slate-500
                            "
                          >
                            Predicted sign
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* =====================================
                        CONFIDENCE
                    ===================================== */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp
                          size={16}
                          className="
                            text-purple-500
                            dark:text-purple-400
                          "
                        />

                        <div>
                          <span
                            className="
                              text-sm
                              font-semibold

                              text-slate-700
                              dark:text-slate-300
                            "
                          >
                            {formatPercentage(
                              prediction.confidence
                            )}
                          </span>

                          {confidencePercentage !==
                            null && (
                            <div
                              className="
                                mt-1.5
                                h-1.5
                                w-20
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
                                  bg-purple-500
                                  transition-all
                                  duration-500
                                "
                                style={{
                                  width: `${Math.min(
                                    Math.max(
                                      confidencePercentage,
                                      0
                                    ),
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* =====================================
                        ACCURACY
                    ===================================== */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Target
                          size={16}
                          className="
                            text-emerald-500
                            dark:text-emerald-400
                          "
                        />

                        <div className="min-w-[120px]">
                          <span
                            className={`
                              text-sm
                              font-bold

                              ${
                                accuracyPercentage >=
                                90
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : accuracyPercentage >=
                                    75
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-red-600 dark:text-red-400"
                              }
                            `}
                          >
                            {accuracyPercentage.toFixed(
                              2
                            )}
                            %
                          </span>

                          <div
                            className="
                              mt-1.5
                              h-1.5
                              w-20
                              overflow-hidden
                              rounded-full

                              bg-slate-100
                              dark:bg-slate-800
                            "
                          >
                            <div
                              className={`
                                h-full
                                rounded-full
                                transition-all
                                duration-500

                                ${
                                  accuracyPercentage >=
                                  90
                                    ? "bg-emerald-500"
                                    : accuracyPercentage >=
                                      75
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }
                              `}
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    accuracyPercentage,
                                    0
                                  ),
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                          <p
                            className="
                              mt-1
                              text-[10px]

                              text-slate-400
                              dark:text-slate-500
                            "
                          >
                            Model test accuracy
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* =====================================
                        DATE
                    ===================================== */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Clock3
                          size={15}
                          className="
                            text-slate-400
                            dark:text-slate-500
                          "
                        />

                        <span
                          className="
                            whitespace-nowrap
                            text-sm

                            text-slate-600
                            dark:text-slate-300
                          "
                        >
                          {formatDate(
                            prediction.timestamp
                          )}
                        </span>
                      </div>
                    </td>

                    {/* =====================================
                        STATUS
                    ===================================== */}

                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end">
                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            px-3
                            py-1.5
                            text-xs
                            font-semibold

                            ${
                              isHigh
                                ? `
                                  border-emerald-200
                                  bg-emerald-50
                                  text-emerald-600

                                  dark:border-emerald-500/20
                                  dark:bg-emerald-500/10
                                  dark:text-emerald-400
                                `
                                : isModerate
                                ? `
                                  border-amber-200
                                  bg-amber-50
                                  text-amber-600

                                  dark:border-amber-500/20
                                  dark:bg-amber-500/10
                                  dark:text-amber-400
                                `
                                : `
                                  border-red-200
                                  bg-red-50
                                  text-red-600

                                  dark:border-red-500/20
                                  dark:bg-red-500/10
                                  dark:text-red-400
                                `
                            }
                          `}
                        >
                          {isHigh ? (
                            <CheckCircle2 size={13} />
                          ) : (
                            <AlertCircle size={13} />
                          )}

                          {isHigh
                            ? "High"
                            : isModerate
                            ? "Moderate"
                            : "Low"}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-2
          border-t
          px-5
          py-4

          border-slate-200
          bg-slate-50/50

          dark:border-slate-800
          dark:bg-slate-950/30

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <p
          className="
            text-xs

            text-slate-500
            dark:text-slate-400
          "
        >
          Showing{" "}
          <span
            className="
              font-semibold
              text-slate-700
              dark:text-slate-300
            "
          >
            {normalizedPredictions.length}
          </span>{" "}
          recent predictions
        </p>

        <div
          className="
            flex
            items-center
            gap-2
            text-xs

            text-slate-400
            dark:text-slate-500
          "
        >
          <Target size={13} />

          <span>
            Model Accuracy:{" "}
            <strong
              className="
                font-semibold
                text-emerald-600
                dark:text-emerald-400
              "
            >
              {overallAccuracy.toFixed(2)}%
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PredictionHistory;