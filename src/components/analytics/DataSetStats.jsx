const DatasetStats = () => {
  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

      <h2 className="text-2xl text-white mb-6">
        Dataset Statistics
      </h2>

      <div className="space-y-5">

        <div className="flex justify-between">
          <span className="text-gray-400">Classes</span>
          <span className="text-white">26 (A-Z)</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Training Images</span>
          <span className="text-white">87,000</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Validation Images</span>
          <span className="text-white">10,000</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Test Images</span>
          <span className="text-white">5,000</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Model</span>
          <span className="text-blue-400">
            Enhanced Neural Network
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Accuracy</span>
          <span className="text-green-400">
            99.21%
          </span>
        </div>

      </div>

    </div>
  );
};

export default DatasetStats;