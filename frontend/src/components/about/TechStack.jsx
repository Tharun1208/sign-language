import { motion } from "framer-motion";

const technologies = [
  {
    name: "React",
    description: "Frontend Development",
  },
  {
    name: "Python",
    description: "Programming Language",
  },
  {
    name: "TensorFlow",
    description: "Machine Learning",
  },
  {
    name: "OpenCV",
    description: "Computer Vision",
  },
  {
    name: "FastAPI",
    description: "Backend API",
  },
  {
    name: "GitHub",
    description: "Version Control",
  },
];

const TechStack = () => {
  return (
    <section className="card">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="row row-between" style={{ alignItems: "flex-start" }}>
        <div>
          <span className="badge badge-pri">Stack</span>

          <h2 className="mt-2">Technologies</h2>

          <p className="text-sm text-muted">
            Tools and technologies powering SignAI
          </p>
        </div>

        <span className="badge badge-info">
          {technologies.length} Technologies
        </span>
      </div>

      {/* =========================================
          TECHNOLOGY LIST
      ========================================= */}

      <div className="grid grid-2 mt-6" style={{ gap: "var(--space-2)" }}>
        {technologies.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            className="card card-flat"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--space-3)",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <h3
                  className="m-0 text-sm fw-semibold"
                  style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {tech.name}
                </h3>

                <p className="m-0 text-xs text-muted mt-1">
                  {tech.description}
                </p>
              </div>

              <span className="badge badge-ok" style={{ flex: "none" }}>
                Active
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* =========================================
          FOOTER
      ========================================= */}

      <div
        className="mt-6 pt-4"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <p className="text-xs text-muted">
          Built using modern AI, computer vision,
          frontend, and backend technologies.
        </p>
      </div>

    </section>
  );
};

export default TechStack;
