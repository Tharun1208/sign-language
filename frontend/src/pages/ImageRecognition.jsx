import { useState } from "react";

import {
  Image,
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
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import UploadSection from "../components/recognition/UploadSection";


const ImageRecognition = () => {

  const [prediction, setPrediction] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =====================================================
     HANDLE PREDICTION
  ===================================================== */

  const handlePrediction = (
    predictionData
  ) => {

    console.log(
      "================================="
    );

    console.log(
      "PREDICTION RECEIVED"
    );

    console.log(
      "================================="
    );

    console.log(
      predictionData
    );


    if (!predictionData) {

      setPrediction(null);

      setError(
        "No prediction received from the backend."
      );

      setLoading(false);

      return;
    }


    /* =====================================================
       LABEL
    ===================================================== */

    const label =
      predictionData.label ??
      predictionData.predicted_label ??
      predictionData.prediction ??
      predictionData.class ??
      predictionData.sign ??
      predictionData.gesture;


    /* =====================================================
       CONFIDENCE
    ===================================================== */

    let confidence =
      predictionData.confidence_percent ??
      predictionData.confidence ??
      predictionData.probability ??
      predictionData.score ??
      0;


    confidence =
      Number(confidence);


    /*
     * Backend can return:
     *
     * 0.95
     *
     * OR
     *
     * 95
     */

    if (
      confidence > 0 &&
      confidence <= 1
    ) {

      confidence *= 100;
    }


    confidence =
      Math.min(
        100,
        Math.max(
          0,
          confidence || 0
        )
      );


    /* =====================================================
       SIGN ACCURACY
       Predicted class test-set recall
    ===================================================== */

    let signAccuracy =
      predictionData.sign_accuracy_percent ??
      predictionData.sign_accuracy ??
      null;


    if (
      signAccuracy !== null &&
      signAccuracy !== undefined &&
      signAccuracy !== ""
    ) {

      signAccuracy =
        Number(signAccuracy);


      if (
        signAccuracy > 0 &&
        signAccuracy <= 1
      ) {

        signAccuracy *= 100;
      }


      signAccuracy =
        Math.min(
          100,
          Math.max(
            0,
            signAccuracy
          )
        );

    } else {

      signAccuracy = null;
    }


    /* =====================================================
       PROCESSING TIME
    ===================================================== */

    const processingTime =
      predictionData.processing_time_ms ??
      predictionData.processing_time ??
      predictionData.processingTime ??
      null;


    /* =====================================================
       MODEL
    ===================================================== */

    const model =
      predictionData.model ??
      predictionData.model_name ??
      "Random Forest Classifier";


    /* =====================================================
       SUPPORT
    ===================================================== */

    const support =
      predictionData.support ??
      null;


    /* =====================================================
       NORMALIZED RESULT
    ===================================================== */

    const normalizedPrediction = {

      label: label
        ? String(label)
            .trim()
            .toUpperCase()
        : "UNKNOWN",

      confidence_percent:
        confidence,

      sign_accuracy_percent:
        signAccuracy,

      support:
        support,

      processing_time_ms:
        processingTime !== null
          ? Number(processingTime)
          : null,

      model:
        model,

    };


    console.log(
      "NORMALIZED PREDICTION:"
    );

    console.log(
      normalizedPrediction
    );


    setPrediction(
      normalizedPrediction
    );

    setError("");

    setLoading(false);
  };


  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {

    setPrediction(null);

    setError("");

    setLoading(false);
  };


  /* =====================================================
     CONFIDENCE
  ===================================================== */

  const confidenceValue =
    prediction
      ? Math.min(
          100,
          Math.max(
            0,
            Number(
              prediction.confidence_percent
            ) || 0
          )
        )
      : 0;


  /* =====================================================
     SIGN ACCURACY
  ===================================================== */

  const signAccuracyValue =
    prediction?.sign_accuracy_percent !==
      null &&
    prediction?.sign_accuracy_percent !==
      undefined
      ? Math.min(
          100,
          Math.max(
            0,
            Number(
              prediction.sign_accuracy_percent
            ) || 0
          )
        )
      : null;


  /* =====================================================
     CONFIDENCE STATUS
  ===================================================== */

  const confidenceStatus =
    confidenceValue >= 90
      ? "High"
      : confidenceValue >= 75
      ? "Good"
      : "Moderate";


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <DashboardLayout>

      <div
        className="
          min-h-full
          space-y-8
          pb-10
        "
      >


        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm

            dark:border-slate-800
            dark:bg-slate-900

            sm:p-8
          "
        >

          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-64
              w-64
              rounded-full
              bg-indigo-500/10
              blur-3xl
            "
          />


          <div
            className="
              relative
              flex
              flex-col
              gap-5

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div
              className="
                flex
                items-start
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
                  border
                  border-indigo-200
                  bg-indigo-50
                  text-indigo-600

                  dark:border-indigo-500/20
                  dark:bg-indigo-500/10
                  dark:text-indigo-400
                "
              >
                <Image size={26} />
              </div>


              <div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

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

                  <Sparkles
                    size={18}
                    className="
                      hidden
                      text-indigo-500

                      dark:text-indigo-400

                      sm:block
                    "
                  />

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
                  Upload a hand gesture image and let
                  SignAI identify the corresponding sign
                  using the trained AI model.
                </p>

              </div>

            </div>


            {/* AI STATUS */}

            <div
              className="
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-indigo-200
                bg-indigo-50
                px-4
                py-2.5
                text-indigo-700

                dark:border-indigo-500/20
                dark:bg-indigo-500/10
                dark:text-indigo-400
              "
            >

              <span
                className="
                  h-2
                  w-2
                  animate-pulse
                  rounded-full
                  bg-indigo-500
                "
              />

              <Brain size={15} />

              <span
                className="
                  text-xs
                  font-semibold
                "
              >
                AI Prediction
              </span>

            </div>

          </div>

        </section>


        {/* =================================================
            HOW IT WORKS
        ================================================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm

            dark:border-slate-800
            dark:bg-slate-900

            sm:p-6
          "
        >

          <div
            className="
              relative
              flex
              items-start
              gap-4
            "
          >

            <div
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
            </div>


            <div
              className="
                min-w-0
              "
            >

              <h2
                className="
                  text-sm
                  font-semibold
                  text-slate-900

                  dark:text-white
                "
              >
                How Image Prediction Works
              </h2>


              <p
                className="
                  mt-1
                  max-w-3xl
                  text-sm
                  leading-6
                  text-slate-500

                  dark:text-slate-400
                "
              >
                Upload a clear hand gesture image.
                MediaPipe detects the hand landmarks,
                converts them into 63 features, and
                the trained Random Forest model predicts
                the sign.
              </p>


              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                "
              >

                <span
                  className="
                    rounded-lg
                    bg-slate-100
                    px-3
                    py-1.5
                    text-slate-600

                    dark:bg-slate-800
                    dark:text-slate-300
                  "
                >
                  1. Upload
                </span>


                <ArrowRight
                  size={14}
                  className="text-slate-400"
                />


                <span
                  className="
                    rounded-lg
                    bg-slate-100
                    px-3
                    py-1.5
                    text-slate-600

                    dark:bg-slate-800
                    dark:text-slate-300
                  "
                >
                  2. MediaPipe
                </span>


                <ArrowRight
                  size={14}
                  className="text-slate-400"
                />


                <span
                  className="
                    rounded-lg
                    bg-slate-100
                    px-3
                    py-1.5
                    text-slate-600

                    dark:bg-slate-800
                    dark:text-slate-300
                  "
                >
                  3. Random Forest
                </span>


                <ArrowRight
                  size={14}
                  className="text-slate-400"
                />


                <span
                  className="
                    rounded-lg
                    bg-indigo-50
                    px-3
                    py-1.5
                    text-indigo-600

                    dark:bg-indigo-500/10
                    dark:text-indigo-400
                  "
                >
                  4. Prediction
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            WORKSPACE
        ================================================= */}

        <section>

          <div
            className="mb-5"
          >

            <h2
              className="
                text-lg
                font-semibold
                text-slate-900

                dark:text-white
              "
            >
              Prediction Workspace
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-slate-500

                dark:text-slate-400
              "
            >
              Upload a hand gesture image and view
              the prediction, confidence, and
              predicted-sign performance.
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div
              className="
                mb-6
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-4
                text-red-700

                dark:border-red-500/20
                dark:bg-red-500/10
                dark:text-red-400
              "
            >

              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0"
              />


              <div>

                <p
                  className="font-semibold"
                >
                  Prediction Failed
                </p>


                <p
                  className="mt-1 text-sm"
                >
                  {error}
                </p>

              </div>

            </div>

          )}


          {/* TWO COLUMNS */}

          <div
            className="
              grid
              grid-cols-1
              gap-6

              lg:grid-cols-2
            "
          >


            {/* =================================================
                UPLOAD
            ================================================= */}

            <div
              className="
                min-w-0
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

              <div
                className="
                  flex
                  items-center
                  gap-3
                  border-b
                  border-slate-200
                  px-5
                  py-4

                  dark:border-slate-800
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
                    bg-indigo-50
                    text-indigo-600

                    dark:bg-indigo-500/10
                    dark:text-indigo-400
                  "
                >
                  <Upload size={19} />
                </div>


                <div>

                  <h3
                    className="
                      text-sm
                      font-semibold
                      text-slate-900

                      dark:text-white
                    "
                  >
                    Upload Image
                  </h3>


                  <p
                    className="
                      text-xs
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    Select a hand gesture image
                  </p>

                </div>

              </div>


              <UploadSection
                onPrediction={
                  handlePrediction
                }
                onReset={
                  handleReset
                }
                onLoadingChange={
                  setLoading
                }
              />

            </div>


            {/* =================================================
                RESULT
            ================================================= */}

            <div
              className="
                min-w-0
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

              {/* RESULT HEADER */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  border-b
                  border-slate-200
                  px-5
                  py-4

                  dark:border-slate-800
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

                    dark:bg-purple-500/10
                    dark:text-purple-400
                  "
                >
                  <Brain size={19} />
                </div>


                <div>

                  <h3
                    className="
                      text-sm
                      font-semibold
                      text-slate-900

                      dark:text-white
                    "
                  >
                    Prediction Result
                  </h3>


                  <p
                    className="
                      text-xs
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    AI prediction result
                  </p>

                </div>

              </div>


              {/* RESULT BODY */}

              <div
                className="
                  min-h-[500px]
                  bg-white
                  p-6

                  dark:bg-slate-900
                "
              >


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                  <div
                    className="
                      flex
                      min-h-[450px]
                      flex-col
                      items-center
                      justify-center
                      text-center
                    "
                  >

                    <div
                      className="
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-2xl
                        bg-indigo-50

                        dark:bg-indigo-500/10
                      "
                    >

                      <Loader2
                        size={40}
                        className="
                          animate-spin
                          text-indigo-500
                        "
                      />

                    </div>


                    <h3
                      className="
                        mt-5
                        text-base
                        font-semibold
                        text-slate-800

                        dark:text-white
                      "
                    >
                      Predicting Image...
                    </h3>


                    <p
                      className="
                        mt-2
                        max-w-sm
                        text-sm
                        leading-6
                        text-slate-500

                        dark:text-slate-400
                      "
                    >
                      Processing the hand gesture
                      with the trained AI model.
                    </p>

                  </div>

                )}


                {/* =================================================
                    RESULT
                ================================================= */}

                {!loading &&
                  prediction && (

                    <div
                      className="
                        flex
                        min-h-[450px]
                        flex-col
                        items-center
                        justify-center
                      "
                    >


                      {/* =================================================
                          SIGN
                      ================================================= */}

                      <div
                        className="
                          w-full
                          max-w-md
                          rounded-3xl
                          border
                          border-indigo-200
                          bg-indigo-50
                          p-8
                          text-center

                          dark:border-indigo-500/20
                          dark:bg-indigo-500/10
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            text-sm
                            font-semibold
                            text-indigo-600

                            dark:text-indigo-400
                          "
                        >

                          <CheckCircle
                            size={18}
                          />

                          Predicted Gesture

                        </div>


                        <div
                          className="
                            mt-5
                            text-9xl
                            font-black
                            tracking-tight
                            text-indigo-600

                            dark:text-indigo-400
                          "
                        >
                          {prediction.label}
                        </div>


                        <p
                          className="
                            mt-3
                            text-sm
                            font-medium
                            text-slate-500

                            dark:text-slate-400
                          "
                        >
                          Sign {prediction.label}
                        </p>

                      </div>


                      {/* =================================================
                          CONFIDENCE
                      ================================================= */}

                      <div
                        className="
                          mt-7
                          w-full
                          max-w-md
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
                              items-center
                              gap-2
                            "
                          >

                            <Brain
                              size={16}
                              className="
                                text-emerald-500
                              "
                            />

                            <span
                              className="
                                text-sm
                                font-medium
                                text-slate-500

                                dark:text-slate-400
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
                            {confidenceValue.toFixed(
                              2
                            )}
                            %
                          </span>

                        </div>


                        <div
                          className="
                            mt-3
                            h-3
                            w-full
                            overflow-hidden
                            rounded-full
                            bg-slate-200

                            dark:bg-slate-800
                          "
                        >

                          <div
                            className="
                              h-full
                              rounded-full
                              bg-emerald-500
                              transition-all
                              duration-700
                            "
                            style={{
                              width:
                                `${confidenceValue}%`,
                            }}
                          />

                        </div>


                        <div
                          className="
                            mt-2
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <p
                            className="
                              text-xs
                              text-slate-400

                              dark:text-slate-500
                            "
                          >
                            Confidence for this image
                          </p>


                          <span
                            className="
                              text-xs
                              font-semibold
                              text-emerald-600

                              dark:text-emerald-400
                            "
                          >
                            {confidenceStatus}
                          </span>

                        </div>

                      </div>


                      {/* =================================================
                          SIGN ACCURACY
                      ================================================= */}

                      {signAccuracyValue !== null && (

                        <div
                          className="
                            mt-5
                            w-full
                            max-w-md
                            rounded-2xl
                            border
                            border-blue-200
                            bg-blue-50
                            p-4

                            dark:border-blue-500/20
                            dark:bg-blue-500/10
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
                                items-center
                                gap-2
                              "
                            >

                              <Target
                                size={18}
                                className="
                                  text-blue-500

                                  dark:text-blue-400
                                "
                              />


                              <div>

                                <p
                                  className="
                                    text-sm
                                    font-semibold
                                    text-slate-700

                                    dark:text-slate-200
                                  "
                                >
                                  Sign Accuracy
                                </p>

                                <p
                                  className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500

                                    dark:text-slate-400
                                  "
                                >
                                  Test-set performance
                                  for sign{" "}
                                  {prediction.label}
                                </p>

                              </div>

                            </div>


                            <span
                              className="
                                text-lg
                                font-bold
                                text-blue-600

                                dark:text-blue-400
                              "
                            >
                              {signAccuracyValue.toFixed(
                                2
                              )}
                              %
                            </span>

                          </div>


                          <div
                            className="
                              mt-3
                              h-2.5
                              w-full
                              overflow-hidden
                              rounded-full
                              bg-blue-100

                              dark:bg-slate-800
                            "
                          >

                            <div
                              className="
                                h-full
                                rounded-full
                                bg-blue-500
                                transition-all
                                duration-700
                              "
                              style={{
                                width:
                                  `${signAccuracyValue}%`,
                              }}
                            />

                          </div>


                          <p
                            className="
                              mt-2
                              text-xs
                              leading-5
                              text-slate-500

                              dark:text-slate-400
                            "
                          >
                            Based on the test-set recall
                            of the predicted sign class.
                          </p>

                        </div>

                      )}


                      {/* =================================================
                          PROCESSING + MODEL
                      ================================================= */}

                      <div
                        className="
                          mt-6
                          grid
                          w-full
                          max-w-md
                          grid-cols-1
                          gap-4

                          sm:grid-cols-2
                        "
                      >

                        {/* PROCESSING TIME */}

                        <div
                          className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4

                            dark:border-slate-800
                            dark:bg-slate-800/50
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-slate-500

                              dark:text-slate-400
                            "
                          >

                            <Clock3 size={17} />

                            <span
                              className="
                                text-xs
                                font-medium
                              "
                            >
                              Processing Time
                            </span>

                          </div>


                          <p
                            className="
                              mt-3
                              text-lg
                              font-bold
                              text-slate-900

                              dark:text-white
                            "
                          >
                            {prediction.processing_time_ms !==
                            null
                              ? `${prediction.processing_time_ms} ms`
                              : "Completed"}
                          </p>

                        </div>


                        {/* MODEL */}

                        <div
                          className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4

                            dark:border-slate-800
                            dark:bg-slate-800/50
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-slate-500

                              dark:text-slate-400
                            "
                          >

                            <Cpu size={17} />

                            <span
                              className="
                                text-xs
                                font-medium
                              "
                            >
                              Model
                            </span>

                          </div>


                          <p
                            className="
                              mt-3
                              text-sm
                              font-bold
                              text-slate-900

                              dark:text-white
                            "
                          >
                            {prediction.model}
                          </p>

                        </div>

                      </div>


                      {/* =================================================
                          SUCCESS
                      ================================================= */}

                      <div
                        className="
                          mt-6
                          flex
                          w-full
                          max-w-md
                          items-center
                          justify-between
                          rounded-2xl
                          border
                          border-emerald-200
                          bg-emerald-50
                          px-4
                          py-4

                          dark:border-emerald-500/20
                          dark:bg-emerald-500/10
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          <CheckCircle
                            size={20}
                            className="
                              text-emerald-500

                              dark:text-emerald-400
                            "
                          />


                          <div>

                            <p
                              className="
                                text-sm
                                font-semibold
                                text-slate-700

                                dark:text-slate-200
                              "
                            >
                              Prediction Successful
                            </p>


                            <p
                              className="
                                text-xs
                                text-slate-500

                                dark:text-slate-400
                              "
                            >
                              Gesture predicted successfully.
                            </p>

                          </div>

                        </div>


                        <span
                          className="
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

                      </div>

                    </div>

                  )}


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {!loading &&
                  !prediction &&
                  !error && (

                    <div
                      className="
                        flex
                        min-h-[450px]
                        flex-col
                        items-center
                        justify-center
                        text-center
                      "
                    >

                      <div
                        className="
                          flex
                          h-20
                          w-20
                          items-center
                          justify-center
                          rounded-2xl
                          bg-slate-100
                          text-slate-400

                          dark:bg-slate-800
                          dark:text-slate-500
                        "
                      >

                        <Brain size={36} />

                      </div>


                      <h3
                        className="
                          mt-5
                          text-base
                          font-semibold
                          text-slate-700

                          dark:text-slate-200
                        "
                      >
                        No Prediction Yet
                      </h3>


                      <p
                        className="
                          mt-2
                          max-w-sm
                          text-sm
                          leading-6
                          text-slate-500

                          dark:text-slate-400
                        "
                      >
                        Upload a hand gesture image
                        and click Predict to see the
                        AI recognition result here.
                      </p>

                    </div>

                  )}


                {/* =================================================
                    ERROR STATE
                ================================================= */}

                {!loading &&
                  error && (

                    <div
                      className="
                        flex
                        min-h-[450px]
                        flex-col
                        items-center
                        justify-center
                        text-center
                      "
                    >

                      <div
                        className="
                          flex
                          h-20
                          w-20
                          items-center
                          justify-center
                          rounded-2xl
                          bg-red-50
                          text-red-500

                          dark:bg-red-500/10
                          dark:text-red-400
                        "
                      >

                        <AlertCircle size={36} />

                      </div>


                      <h3
                        className="
                          mt-5
                          text-base
                          font-semibold
                          text-red-600

                          dark:text-red-400
                        "
                      >
                        Prediction Failed
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
                        {error}
                      </p>

                    </div>

                  )}

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <section
          className="
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-4

            dark:border-slate-800
            dark:bg-slate-900/60
          "
        >

          {prediction ? (

            <CheckCircle
              size={18}
              className="
                mt-0.5
                shrink-0
                text-green-500
              "
            />

          ) : (

            <Brain
              size={18}
              className="
                mt-0.5
                shrink-0
                text-indigo-500

                dark:text-indigo-400
              "
            />

          )}


          <div>

            <p
              className="
                text-xs
                font-semibold
                text-slate-700

                dark:text-slate-300
              "
            >
              SignAI Image Prediction
            </p>


            <p
              className="
                mt-1
                text-xs
                leading-5
                text-slate-500

                dark:text-slate-400
              "
            >

              {prediction
                ? `Predicted sign: ${
                    prediction.label
                  } with ${
                    confidenceValue.toFixed(2)
                  }% confidence${
                    signAccuracyValue !== null
                      ? ` and ${signAccuracyValue.toFixed(
                          2
                        )}% sign accuracy.`
                      : "."
                  }`

                : "For the best results, use a clear image with good lighting and keep the hand gesture fully visible."}

            </p>

          </div>

        </section>

      </div>

    </DashboardLayout>
  );
};


export default ImageRecognition;
