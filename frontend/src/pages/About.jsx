import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import TechStack from "../components/about/TechStack";
import ProjectOverview from "../components/about/ProjectOverview";
import AnimatedNumber from "../components/ui/AnimatedNumber";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const About = () => {
  return (
    <>
      <div className="stack" style={{ gap: "var(--space-6)" }}>
        <motion.section className="card spotlight" {...fade()}>
          <div className="page-head" style={{ marginBottom: 0 }}>
            <div style={{ maxWidth: "62ch" }}>
              <div className="row mb-2">
                <span className="eyebrow">Project dossier</span>
                <span className="badge badge-ok badge-dot">Active</span>
              </div>

              <h1>About SignAI</h1>

              <p className="lead" style={{ color: "var(--primary)", marginTop: "var(--space-3)" }}>
                Intelligent sign language recognition, powered by AI.
              </p>

              <p className="text-soft mt-4">
                SignAI turns hand landmarks into text and speech in real time. It
                combines a browser-based camera pipeline, a Python recognition
                service and an accessible interface designed for both sign and
                hearing users.
              </p>

              <div className="row mt-4">
                {["AI powered", "Real-time recognition", "Accessible by design"].map((chip, index) => (
                  <span
                    key={chip}
                    className={`badge ${index === 0 ? "badge-pri" : index === 1 ? "badge-info" : "badge-warn"}`}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="row mt-6">
                <Link to="/live-recognition" className="btn btn-primary">
                  Try live detection
                </Link>
                <Link to="/analytics" className="btn btn-ghost">
                  View model details
                </Link>
              </div>
            </div>

            <div className="stack" style={{ minWidth: 230, gap: "var(--space-2)" }}>
              {[
                ["Test accuracy", "%", 93.63, 2],
                ["Sign classes", "", 26, 0],
                ["Input features", "", 63, 0],
              ].map(([label, suffix, value, decimals]) => (
                <div key={label} className="card card-flat">
                  <span className="stat-label">{label}</span>
                  <div className="stat-value" style={{ fontSize: "var(--fs-xl)" }}>
                    <AnimatedNumber value={value} decimals={decimals} suffix={suffix} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <ProjectOverview />

        <TechStack />

        <div className="grid grid-3">
          {[
            { badge: "AI", tone: "badge-pri", title: "AI powered", copy: "Hand-landmark extraction and a Random Forest classifier tuned for A–Z finger spelling." },
            { badge: "Stack", tone: "badge-info", title: "Modern technology", copy: "React, Vite, Python, scikit-learn, MediaPipe and OpenCV form the core pipeline." },
            { badge: "Real-time", tone: "badge-ok", title: "Instant inference", copy: "Low-latency browser-based webcam stream analysis for smooth real-time communication." },
          ].map((item, index) => (
            <motion.div key={item.title} className="card card-hover" {...fade(0.05 * index)}>
              <span className={`badge ${item.tone}`}>{item.badge}</span>
              <h3 className="mt-4">{item.title}</h3>
              <p className="text-sm text-muted mt-2">{item.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default About;
