import Webcam from "react-webcam";

const WebcamSection = () => {
  return (
    <div className="card stack">
      {/* Header */}
      <div className="row row-between">
        <div>
          <h2 style={{ marginBottom: 0 }}>Live Camera</h2>
          <p className="hint" style={{ marginTop: "2px" }}>
            Real-time gesture recognition
          </p>
        </div>

        <span className="badge badge-ok">Live</span>
      </div>

      {/* Camera */}
      <div className="camera">
        <Webcam
          audio={false}
          mirrored
          screenshotFormat="image/jpeg"
        />

        <span className="badge badge-err live">Live</span>

        <span className="hand-tag" style={{ left: "30%", top: "14%" }}>
          Hand 1
        </span>
        <div
          className="hand-box"
          style={{ left: "30%", top: "20%", width: "40%", height: "52%" }}
        />

        <span
          className="badge badge-ok"
          style={{ position: "absolute", left: "var(--space-3)", bottom: "var(--space-3)" }}
        >
          Detecting hand gestures
        </span>
      </div>

      {/* Footer info */}
      <div className="row row-between">
        <span className="text-sm text-soft">Camera connected</span>
        <span className="text-sm text-primary fw-semibold">AI Ready</span>
      </div>
    </div>
  );
};

export default WebcamSection;
