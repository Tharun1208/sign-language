import { useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

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
    <div className="stack">

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
          className={`drop${isDragging ? " over" : ""}`}
          style={{ minHeight: "280px" }}
        >
          <span className="badge badge-pri">Upload</span>

          <h3 className="mt-4">
            {isDragging
              ? "Drop your image here"
              : "Upload hand gesture image"}
          </h3>

          <p className="hint">
            {isDragging
              ? "Release to upload your image"
              : "Click or drag and drop an image here"}
          </p>

          <div
            className="row mt-4"
            style={{ justifyContent: "center", gap: "var(--space-2)" }}
          >
            {["JPG", "PNG", "JPEG", "BMP", "WEBP"].map((type) => (
              <span key={type} className="badge badge-info">
                {type}
              </span>
            ))}
          </div>

          <p className="hint mt-4">Maximum file size: 10 MB</p>
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
        <div className="stack">

          {/* IMAGE PREVIEW */}

          <div className="card">
            <div className="camera">
              <img
                src={preview}
                alt="Selected hand gesture"
                style={{ objectFit: "contain" }}
              />

              <span className="badge badge-pri live">Image preview</span>
            </div>

            <div className="row mt-4">
              <button
                type="button"
                onClick={handleRemove}
                disabled={loading}
                className="btn btn-ghost btn-sm"
                title="Remove image"
              >
                Remove
              </button>
            </div>
          </div>

          {/* =================================================
              FILE INFORMATION
          ================================================= */}

          <div className="caption">
            <div className="row row-between">
              <div style={{ minWidth: 0 }}>
                <p
                  className="fw-semibold"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedFile?.name}
                </p>

                <p className="hint">
                  {selectedFile
                    ? (selectedFile.size / 1024 / 1024).toFixed(2)
                    : "0.00"}{" "}
                  MB
                  {" • "}
                  {selectedFile?.type?.split("/")[1]?.toUpperCase()}
                </p>
              </div>

              <span className="badge badge-ok">Ready</span>
            </div>
          </div>

          {/* =================================================
              PREDICT BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={handlePredict}
            disabled={loading}
            className="btn btn-primary btn-block"
          >
            {loading ? "Analyzing image..." : "Predict image"}
          </button>

          {/* Reset */}

          <button
            type="button"
            onClick={handleRemove}
            disabled={loading}
            className="btn btn-ghost btn-block"
          >
            Choose another image
          </button>
        </div>
      )}

      {/* =================================================
          SUCCESS
      ================================================= */}

      {message && (
        <div className="alert alert-ok">
          <b>Prediction successful</b>
          {message}
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="alert alert-err">
          <b>Prediction failed</b>
          {error}
        </div>
      )}
    </div>
  );
};

export default UploadSection;