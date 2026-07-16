const data = [
  {
    time: "10:23 AM",
    prediction: "L",
    confidence: "98.72%",
  },
  {
    time: "10:22 AM",
    prediction: "V",
    confidence: "97.11%",
  },
  {
    time: "10:20 AM",
    prediction: "A",
    confidence: "99.02%",
  },
  {
    time: "10:18 AM",
    prediction: "B",
    confidence: "96.90%",
  },
];

const PredictionHistory = () => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 mt-10">

      <div className="p-6 border-b border-slate-800">

        <h2 className="text-white text-xl font-semibold">
          Recent Predictions
        </h2>

      </div>

      <table className="w-full">

        <thead>

          <tr className="text-slate-400">

            <th className="text-left p-4">Time</th>
            <th className="text-left p-4">Prediction</th>
            <th className="text-left p-4">Confidence</th>

          </tr>

        </thead>

        <tbody>

          {data.map((item, index) => (

            <tr
              key={index}
              className="border-t border-slate-800 hover:bg-slate-800"
            >

              <td className="p-4 text-white">
                {item.time}
              </td>

              <td className="p-4 text-blue-400 font-semibold">
                {item.prediction}
              </td>

              <td className="p-4 text-green-400">
                {item.confidence}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default PredictionHistory;