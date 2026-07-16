import {
  LineChart,
  Line,
  XAxis,
  YAxis,
 Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { epoch: 1, accuracy: 82 },
  { epoch: 2, accuracy: 86 },
  { epoch: 3, accuracy: 90 },
  { epoch: 4, accuracy: 94 },
  { epoch: 5, accuracy: 97 },
  { epoch: 6, accuracy: 99 },
];

const ModelPerformance = () => {
  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

      <h2 className="text-2xl text-white mb-6">
        Model Accuracy
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="epoch" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#3B82F6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default ModelPerformance;