import { useRef, useState } from "react";

import {
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  FileImage,
  RotateCcw,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const UploadSection = ({
  onPrediction,
  onLoading,
  onError,
  onReset,
}) => {
  const inputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // =====================================================
  // VALIDATE FILE
  // =====================================================

  const validateFile = (file) => {
    if (!file) {
      return "Please select an image.";
    }

    if (!file.type.startsWith("image/")) {
      return "Please select a valid image file.";
    }

    if (file.size > 10 * 1024 * 1024) {
      return "Image must be smaller than 10 MB.";
    }

    return "";
  };

  // =====================================================
  // SET FILE
  // =====================================================

  const processFile = (file) => {
    if (!file) {
      return;
    }

    setError("");
    setMessage("");

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);

      if (onError) {
        onError(validationError);
      }

      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreview(imageUrl);

    if (onReset) {
      onReset();
    }
  };

  // =====================================================
  // SELECT IMAGE
  // =====================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    processFile(file);
  };

  // =====================================================
  // DRAG EVENTS
  // =====================================================

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    processFile(file);
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(null);
    setPreview(null);
    setError("");
    setMessage("");
    setLoading(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (onReset) {
      onReset();
    }
  };

  // =====================================================
  // PREDICT IMAGE
  // =====================================================

  const handlePredict = async () => {
    if (!selectedFile) {
      const msg = "Please select an image first.";

      setError(msg);

      if (onError) {
        onError(msg);
      }

      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    if (onLoading) {
      onLoading(true);
    }

    try {
      const formData = new FormData();

      formData.append("image", selectedFile);

      const endpoint = `${API_URL}/api/predict`;

      console.log("=================================");
      console.log("IMAGE PREDICTION STARTED");
      console.log("=================================");
      console.log("Endpoint:", endpoint);
      console.log("File:", selectedFile.name);
      console.log("Type:", selectedFile.type);
      console.log("Size:", selectedFile.size);

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      console.log("HTTP Status:", response.status);

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      // ===================================================
      // READ RESPONSE
      // ===================================================

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error("Non JSON response:", text);

        throw new Error(
          `Backend returned an invalid response. HTTP ${response.status}`
        );
      }

      console.log("=================================");
      console.log("BACKEND RESPONSE");
      console.log("=================================");
      console.log(data);

      // ===================================================
      // HTTP ERROR
      // ===================================================

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Server returned HTTP ${response.status}`
        );
      }

      // ===================================================
      // BACKEND ERROR
      // ===================================================

      if (data?.success === false) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Image prediction failed."
        );
      }

      // ===================================================
      // GET RESULT
      // ===================================================

      const result =
        data?.prediction ??
        data?.result ??
        data?.data?.prediction ??
        data?.data?.result ??
        data;

      if (!result) {
        throw new Error(
          "Prediction was not returned by Flask."
        );
      }

      // ===================================================
      // VARIABLES
      // =====================================================

      let label = "";
      let confidence = 0;
      let signAccuracy = null;
      let support = null;
      let processingTime = null;

      let model =
        "Random Forest Classifier";

      // ===================================================
      // STRING RESULT
      // ===================================================

      if (typeof result === "string") {
        label = result;

        confidence =
          data?.confidence_percent ??
          data?.confidence ??
          data?.probability ??
          0;

        signAccuracy =
          data?.sign_accuracy_percent ??
          data?.sign_accuracy ??
          null;

        support =
          data?.support ??
          null;

        processingTime =
          data?.processing_time_ms ??
          data?.processing_time ??
          null;

        model =
          data?.model ??
          data?.model_name ??
          "Random Forest Classifier";
      }

      // ===================================================
      // OBJECT RESULT
      // ===================================================

      else if (
        typeof result === "object" &&
        result !== null
      ) {
        label =
          result.label ??
          result.predicted_label ??
          result.prediction ??
          result.class ??
          result.sign ??
          result.gesture ??
          result.name ??
          "";

        confidence =
          result.confidence_percent ??
          result.confidence ??
          result.probability ??
          result.score ??
          data?.confidence_percent ??
          data?.confidence ??
          data?.probability ??
          0;

        signAccuracy =
          result.sign_accuracy_percent ??
          result.sign_accuracy ??
          data?.sign_accuracy_percent ??
          data?.sign_accuracy ??
          null;

        support =
          result.support ??
          data?.support ??
          null;

        processingTime =
          result.processing_time_ms ??
          result.processing_time ??
          result.processingTime ??
          data?.processing_time_ms ??
          data?.processing_time ??
          null;

        model =
          result.model ??
          result.model_name ??
          data?.model ??
          data?.model_name ??
          "Random Forest Classifier";
      }

      // ===================================================
      // VALIDATE LABEL
      // ===================================================

      label = String(label).trim();

      if (!label) {
        throw new Error(
          "Flask returned a prediction but no label was found."
        );
      }

      label = label.toUpperCase();

      // ===================================================
      // NORMALIZE CONFIDENCE
      // ===================================================

      confidence = Number(confidence);

      if (
        confidence > 0 &&
        confidence <= 1
      ) {
        confidence *= 100;
      }

      confidence = Math.min(
        100,
        Math.max(0, confidence || 0)
      );

      // ===================================================
      // NORMALIZE SIGN ACCURACY
      // ===================================================

      if (
        signAccuracy !== null &&
        signAccuracy !== undefined &&
        signAccuracy !== ""
      ) {
        signAccuracy = Number(signAccuracy);

        if (
          signAccuracy > 0 &&
          signAccuracy <= 1
        ) {
          signAccuracy *= 100;
        }

        signAccuracy = Math.min(
          100,
          Math.max(
            0,
            signAccuracy || 0
          )
        );
      } else {
        signAccuracy = null;
      }

      // ===================================================
      // NORMALIZE SUPPORT
      // ===================================================

      if (
        support !== null &&
        support !== undefined &&
        support !== ""
      ) {
        support = Number(support);
      } else {
        support = null;
      }

      // ===================================================
      // NORMALIZE PROCESSING TIME
      // ===================================================

      if (
        processingTime !== null &&
        processingTime !== undefined &&
        processingTime !== ""
      ) {
        processingTime = Number(
          processingTime
        );
      } else {
        processingTime = null;
      }

      // ===================================================
      // FINAL PREDICTION
      // ===================================================

      const finalPrediction = {
        label,
        confidence_percent: confidence,
        sign_accuracy_percent: signAccuracy,
        support,
        processing_time_ms: processingTime,
        model,
      };

      console.log("=================================");
      console.log("FINAL PREDICTION");
      console.log("=================================");
      console.log(finalPrediction);

      // ===================================================
      // SEND TO PARENT
      // ===================================================

      if (onPrediction) {
        onPrediction(finalPrediction);
      }

      setMessage(
        `Prediction successful: ${label}`
      );

      setError("");
    } catch (err) {
      console.error("=================================");
      console.error("IMAGE PREDICTION ERROR");
      console.error("=================================");
      console.error(err);

      const errorMessage =
        err?.message ||
        "Unable to connect to SignAI backend.";

      setError(errorMessage);
      setMessage("");

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);

      if (onLoading) {
        onLoading(false);
      }

      console.log(
        "IMAGE PREDICTION FINISHED"
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full p-5 sm:p-6">

      {/* =================================================
          UPLOAD AREA
      ================================================= */}

      {!preview && (
        <button
          type="button"
          onClick={() => {
            inputRef.current?.click();
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            group
            relative
            flex
            min-h-[280px]
            w-full
            flex-col
            items-center
            justify-center
            overflow-hidden
            rounded-2xl
            border-2
            border-dashed
            px-6
            text-center

            transition-all
            duration-300

            ${
              isDragging
                ? `
                  border-indigo-500
                  bg-indigo-50
                  shadow-lg
                  shadow-indigo-500/10

                  dark:border-indigo-400
                  dark:bg-indigo-500/10
                `
                : `
                  border-slate-300
                  bg-slate-50

                  hover:border-indigo-400
                  hover:bg-indigo-50/50
                  hover:shadow-lg
                  hover:shadow-indigo-500/5

                  dark:border-slate-700
                  dark:bg-slate-800/50

                  dark:hover:border-indigo-500
                  dark:hover:bg-indigo-500/5
                `
            }
          `}
        >
          {/* Background decoration */}

          <div
            className="
              pointer-events-none
              absolute
              -right-10
              -top-10
              h-32
              w-32
              rounded-full
              bg-indigo-500/5
              blur-2xl

              transition-all
              duration-500

              group-hover:scale-150
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-10
              -left-10
              h-32
              w-32
              rounded-full
              bg-purple-500/5
              blur-2xl

              transition-all
              duration-500

              group-hover:scale-150
            "
          />

          {/* Upload Icon */}

          <div
            className={`
              relative
              mb-5
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-2xl

              bg-indigo-100
              text-indigo-600

              shadow-sm

              transition-all
              duration-300

              group-hover:-translate-y-1
              group-hover:scale-105
              group-hover:shadow-lg
              group-hover:shadow-indigo-500/20

              dark:bg-indigo-500/10
              dark:text-indigo-400
            `}
          >
            {isDragging ? (
              <FileImage
                size={32}
                className="animate-bounce"
              />
            ) : (
              <Upload
                size={32}
                className="
                  transition-transform
                  duration-300

                  group-hover:-translate-y-1
                "
              />
            )}
          </div>

          {/* Title */}

          <h4
            className="
              relative
              text-base
              font-semibold

              text-slate-800

              dark:text-white
            "
          >
            {isDragging
              ? "Drop your image here"
              : "Upload Hand Gesture Image"}
          </h4>

          {/* Description */}

          <p
            className="
              relative
              mt-2
              text-sm

              text-slate-500

              dark:text-slate-400
            "
          >
            {isDragging
              ? "Release to upload your image"
              : "Click or drag & drop an image here"}
          </p>

          {/* File types */}

          <div
            className="
              relative
              mt-4
              flex
              flex-wrap
              items-center
              justify-center
              gap-2
            "
          >
            {[
              "JPG",
              "PNG",
              "JPEG",
              "BMP",
              "WEBP",
            ].map((type) => (
              <span
                key={type}
                className="
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-2.5
                  py-1
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-500

                  transition-all
                  duration-200

                  group-hover:border-indigo-200
                  group-hover:text-indigo-600

                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-slate-400

                  dark:group-hover:border-indigo-500/30
                  dark:group-hover:text-indigo-400
                "
              >
                {type}
              </span>
            ))}
          </div>

          <p
            className="
              relative
              mt-3
              text-[11px]

              text-slate-400
            "
          >
            Maximum file size: 10 MB
          </p>
        </button>
      )}

      {/* =================================================
          FILE INPUT
      ================================================= */}

      <input
        ref={inputRef}
        type="file"
        accept="
          image/jpeg,
          image/png,
          image/jpg,
          image/bmp,
          image/webp
        "
        onChange={handleFileChange}
        className="hidden"
      />

      {/* =================================================
          SELECTED IMAGE
      ================================================= */}

      {preview && (
        <div className="space-y-4">

          {/* IMAGE PREVIEW */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border

              border-slate-200
              bg-slate-100

              shadow-sm

              transition-all
              duration-300

              hover:border-indigo-200
              hover:shadow-lg
              hover:shadow-indigo-500/5

              dark:border-slate-700
              dark:bg-slate-800

              dark:hover:border-indigo-500/30
            "
          >
            <img
              src={preview}
              alt="Selected hand gesture"
              className="
                max-h-[380px]
                min-h-[220px]
                w-full
                object-contain
                p-2

                transition-transform
                duration-500

                group-hover:scale-[1.02]
              "
            />

            {/* Image overlay */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-slate-950/10
                via-transparent
                to-transparent
                opacity-0

                transition-opacity
                duration-300

                group-hover:opacity-100
              "
            />

            {/* Remove */}

            <button
              type="button"
              onClick={handleRemove}
              disabled={loading}
              className="
                absolute
                right-3
                top-3
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl

                bg-red-500
                text-white

                shadow-lg
                shadow-red-500/20

                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:scale-105
                hover:bg-red-600
                hover:shadow-xl
                hover:shadow-red-500/30

                active:scale-95

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              title="Remove image"
            >
              <X size={18} />
            </button>

            {/* Preview badge */}

            <div
              className="
                absolute
                bottom-3
                left-3
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/20
                bg-slate-950/70
                px-3
                py-2
                text-xs
                font-medium
                text-white
                backdrop-blur-md
              "
            >
              <ImageIcon size={14} />

              Image Preview
            </div>
          </div>

          {/* =================================================
              FILE INFORMATION
          ================================================= */}

          <div
            className="
              group
              flex
              items-center
              justify-between
              gap-3
              rounded-xl
              border
              p-3.5

              border-slate-200
              bg-slate-50

              transition-all
              duration-300

              hover:border-indigo-200
              hover:bg-indigo-50/50

              dark:border-slate-700
              dark:bg-slate-800

              dark:hover:border-indigo-500/30
              dark:hover:bg-indigo-500/5
            "
          >
            <div className="flex min-w-0 items-center gap-3">

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

                  dark:bg-indigo-500/10
                  dark:text-indigo-400

                  transition-transform
                  duration-300

                  group-hover:scale-105
                "
              >
                <FileImage size={19} />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-sm
                    font-semibold

                    text-slate-800

                    dark:text-white
                  "
                >
                  {selectedFile?.name}
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs

                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  {selectedFile
                    ? (
                        selectedFile.size /
                        1024 /
                        1024
                      ).toFixed(2)
                    : "0.00"}{" "}
                  MB
                  {" • "}
                  {selectedFile?.type
                    ?.split("/")[1]
                    ?.toUpperCase()}
                </p>
              </div>
            </div>

            <CheckCircle
              size={20}
              className="
                shrink-0
                text-emerald-500

                dark:text-emerald-400
              "
            />
          </div>

          {/* =================================================
              PREDICT BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={handlePredict}
            disabled={loading}
            className="
              group
              relative
              flex
              w-full
              items-center
              justify-center
              gap-2.5
              overflow-hidden
              rounded-xl
              bg-indigo-600
              px-5
              py-3.5
              text-sm
              font-semibold
              text-white

              shadow-lg
              shadow-indigo-500/20

              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:bg-indigo-700
              hover:shadow-xl
              hover:shadow-indigo-500/30

              active:translate-y-0
              active:scale-[0.98]

              disabled:cursor-not-allowed
              disabled:opacity-60
              disabled:hover:translate-y-0
              disabled:hover:shadow-lg
            "
          >
            {/* Shine */}

            {!loading && (
              <span
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/10
                  to-transparent

                  transition-transform
                  duration-700

                  group-hover:translate-x-full
                "
              />
            )}

            {loading ? (
              <>
                <Loader2
                  size={19}
                  className="animate-spin"
                />

                <span>
                  Analyzing Image...
                </span>
              </>
            ) : (
              <>
                <Sparkles
                  size={18}
                  className="
                    transition-transform
                    duration-300

                    group-hover:rotate-12
                    group-hover:scale-110
                  "
                />

                <span>
                  Predict Image
                </span>

                <span
                  className="
                    text-indigo-200
                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </>
            )}
          </button>

          {/* Reset */}

          <button
            type="button"
            onClick={handleRemove}
            disabled={loading}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              py-3
              text-sm
              font-medium
              text-slate-600

              transition-all
              duration-200

              hover:border-slate-300
              hover:bg-slate-50
              hover:text-slate-900

              active:scale-[0.98]

              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-400

              dark:hover:border-slate-600
              dark:hover:bg-slate-800
              dark:hover:text-white

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RotateCcw size={16} />

            Choose Another Image
          </button>
        </div>
      )}

      {/* =================================================
          SUCCESS
      ================================================= */}

      {message && (
        <div
          className="
            mt-4
            flex
            items-start
            gap-3
            rounded-xl
            border

            border-emerald-200
            bg-emerald-50

            p-4

            shadow-sm
            shadow-emerald-500/5

            dark:border-emerald-500/20
            dark:bg-emerald-500/10
          "
        >
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg

              bg-emerald-100
              text-emerald-600

              dark:bg-emerald-500/10
              dark:text-emerald-400
            "
          >
            <CheckCircle size={17} />
          </div>

          <div>
            <p
              className="
                text-sm
                font-semibold

                text-emerald-700

                dark:text-emerald-400
              "
            >
              Prediction Successful
            </p>

            <p
              className="
                mt-1
                text-xs

                text-emerald-600/80

                dark:text-emerald-400/70
              "
            >
              {message}
            </p>
          </div>
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          className="
            mt-4
            flex
            items-start
            gap-3
            rounded-xl
            border

            border-red-200
            bg-red-50

            p-4

            shadow-sm
            shadow-red-500/5

            dark:border-red-500/20
            dark:bg-red-500/10
          "
        >
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg

              bg-red-100
              text-red-600

              dark:bg-red-500/10
              dark:text-red-400
            "
          >
            <AlertCircle size={17} />
          </div>

          <div>
            <p
              className="
                text-sm
                font-semibold

                text-red-700

                dark:text-red-400
              "
            >
              Prediction Failed
            </p>

            <p
              className="
                mt-1
                text-xs
                leading-5

                text-red-600

                dark:text-red-300
              "
            >
              {error}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;