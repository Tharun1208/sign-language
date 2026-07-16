import {
  FaCheckCircle,
  FaBolt,
  FaClock,
} from "react-icons/fa";

const PredictionPanel = () => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

      <h2 className="text-2xl text-white font-semibold">
        AI Prediction
      </h2>

      <div className="mt-8 text-center">

        <h1 className="text-8xl font-bold text-blue-500">
          A
        </h1>

        <p className="text-gray-400 mt-2">
          Detected Gesture
        </p>

      </div>

      <div className="space-y-5 mt-10">

        <div className="flex justify-between">
          <span className="text-gray-400">Confidence</span>
          <span className="text-green-400 font-semibold">
            98.72%
          </span>
        </div>

        <div className="w-full bg-slate-700 rounded-full h-3">
          <div className="bg-green-500 h-3 rounded-full w-[98%]"></div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex gap-2 items-center">
            <FaBolt />
            FPS
          </span>

          <span className="text-white">29</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex gap-2 items-center">
            <FaClock />
            Processing
          </span>

          <span className="text-white">
            31 ms
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex gap-2 items-center">
            <FaCheckCircle />
            Status
          </span>

          <span className="text-green-400">
            Detecting
          </span>
        </div>

      </div>

    </div>
  );
};

export default PredictionPanel;