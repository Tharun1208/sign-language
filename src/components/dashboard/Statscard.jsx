import { FaChartLine } from "react-icons/fa";

const StatsCard = ({ title, value, color }) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-blue-500 transition duration-300">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-slate-400">{title}</p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {value}
          </h2>
        </div>

        <div
          className="w-14 h-14 rounded-xl flex justify-center items-center"
          style={{ backgroundColor: color }}
        >
          <FaChartLine className="text-white text-xl" />
        </div>

      </div>

    </div>
  );
};

export default StatsCard;