import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";

const WebcamSection = () => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-white text-xl font-semibold">
          Live Camera
        </h2>

        <div className="flex items-center gap-2 text-green-400">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          Live
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border-4 border-green-500">

        <Webcam
          audio={false}
          mirrored
          screenshotFormat="image/jpeg"
          className="w-full rounded-lg"
        />

        {/* Detection Frame */}
        <div className="absolute inset-12 border-4 border-blue-400 rounded-xl pointer-events-none"></div>

        <FaCamera className="absolute top-4 right-4 text-white text-2xl" />

      </div>

    </div>
  );
};

export default WebcamSection;