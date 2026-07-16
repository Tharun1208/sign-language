const history = [
  {
    time: "10:21",
    prediction: "A",
    confidence: "98%"
  },
  {
    time: "10:22",
    prediction: "B",
    confidence: "97%"
  },
  {
    time: "10:23",
    prediction: "C",
    confidence: "99%"
  }
];

const PredictionTable = () => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 mt-10">

      <div className="p-5 border-b border-slate-800">

        <h2 className="text-xl text-white">
          Recent Predictions
        </h2>

      </div>

      <table className="w-full">

        <thead>

          <tr className="text-slate-400">

            <th className="p-4 text-left">
              Time
            </th>

            <th className="p-4 text-left">
              Prediction
            </th>

            <th className="p-4 text-left">
              Confidence
            </th>

          </tr>

        </thead>

        <tbody>

          {history.map((item, index) => (

            <tr
              key={index}
              className="border-t border-slate-800"
            >

              <td className="p-4 text-white">
                {item.time}
              </td>

              <td className="p-4 text-blue-400">
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

export default PredictionTable;