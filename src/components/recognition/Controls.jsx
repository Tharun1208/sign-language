import {
  FaPlay,
  FaStop,
  FaCamera,
  FaRedo,
} from "react-icons/fa";

const Controls = () => {
  return (
    <div className="flex flex-wrap gap-4 mt-8">

      <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white">
        <FaPlay />
        Start
      </button>

      <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white">
        <FaStop />
        Stop
      </button>

      <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white">
        <FaCamera />
        Capture
      </button>

      <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg text-white">
        <FaRedo />
        Reset
      </button>

    </div>
  );
};

export default Controls;