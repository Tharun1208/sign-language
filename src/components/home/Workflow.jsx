import {
  FaCamera,
  FaCog,
  FaBrain,
  FaCheckCircle,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaCamera />,
    title: "Capture",
    desc: "Capture hand gestures using webcam.",
  },
  {
    icon: <FaCog />,
    title: "Preprocessing",
    desc: "MediaPipe extracts hand landmarks.",
  },
  {
    icon: <FaBrain />,
    title: "Neural Network",
    desc: "Enhanced neural network predicts the gesture.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Output",
    desc: "Display translated text instantly.",
  },
];

const Workflow = () => {
  return (
    <section className="bg-slate-950 py-24 px-6">

      <div className="max-w-6xl mx-auto">

        <h2 className="text-4xl font-bold text-center text-white">
          How It Works
        </h2>

        <div className="grid md:grid-cols-4 gap-8 mt-16">

          {steps.map((step) => (
            <div
              key={step.title}
              className="text-center bg-slate-900 rounded-2xl p-8 border border-slate-700"
            >
              <div className="text-blue-500 text-5xl flex justify-center">
                {step.icon}
              </div>

              <h3 className="text-xl font-semibold text-white mt-5">
                {step.title}
              </h3>

              <p className="text-slate-400 mt-4">
                {step.desc}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default Workflow;