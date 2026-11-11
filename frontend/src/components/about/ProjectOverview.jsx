const ProjectOverview = () => {
  const technologies = [
    {
      name: "MediaPipe",
    },
    {
      name: "OpenCV",
    },
    {
      name: "TensorFlow",
    },
    {
      name: "Neural Network",
    },
  ];

  return (
    <section className="card">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="row row-between" style={{ alignItems: "flex-start" }}>
        <div>
          <span className="badge badge-pri">Overview</span>

          <h2 className="mt-2">Project Overview</h2>

          <p className="text-sm text-muted">
            AI-powered Sign Language Recognition
          </p>
        </div>

        <span className="badge badge-ok">Active</span>
      </div>

      {/* =========================================
          DESCRIPTION
      ========================================= */}

      <div className="stack gap-3 mt-6" style={{ maxWidth: "75ch" }}>
        <p className="text-soft">
          SignAI is an AI-powered system designed for{" "}
          <span className="fw-semibold" style={{ color: "var(--ink)" }}>
            real-time Sign Language Recognition
          </span>
          . It combines an enhanced neural network with computer vision
          technologies to identify hand gestures and convert them into
          readable text.
        </p>

        <p className="text-soft">
          The system can process gestures captured through a webcam or
          uploaded images, helping create a more accessible communication
          experience for individuals who use sign language.
        </p>
      </div>

      {/* =========================================
          FEATURES
      ========================================= */}

      <div className="grid grid-2 mt-6">

        {/* REAL-TIME DETECTION */}

        <div className="card card-flat">
          <span className="badge badge-info">Capability</span>

          <h3 className="mt-2">Real-Time Detection</h3>

          <p className="text-sm text-muted">
            Recognizes hand gestures directly through a webcam.
          </p>
        </div>

        {/* GESTURE TRANSLATION */}

        <div className="card card-flat">
          <span className="badge badge-pri">Capability</span>

          <h3 className="mt-2">Gesture Translation</h3>

          <p className="text-sm text-muted">
            Converts recognized gestures into readable text.
          </p>
        </div>

      </div>

      {/* =========================================
          TECHNOLOGY STACK
      ========================================= */}

      <div
        className="mt-6 pt-4"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <div className="row row-between mb-4">
          <h3 className="m-0" style={{ fontSize: "var(--fs-md)" }}>
            Technology Stack
          </h3>

          <span className="badge">
            {technologies.length} Technologies
          </span>
        </div>

        <div className="grid grid-4">
          {technologies.map((technology) => (
            <div
              key={technology.name}
              className="card card-flat"
            >
              <div className="fw-semibold text-sm">
                {technology.name}
              </div>

              <span className="badge badge-ok mt-2">
                Integrated
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default ProjectOverview;
