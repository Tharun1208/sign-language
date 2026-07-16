const SystemStats = () => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

      <h2 className="text-xl text-white mb-6">
        System Statistics
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span className="text-gray-400">Model</span>
          <span className="text-white">Enhanced NN</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Accuracy</span>
          <span className="text-green-400">99.2%</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">GPU</span>
          <span className="text-white">Available</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Frames</span>
          <span className="text-white">542</span>
        </div>

      </div>

    </div>
  );
};

export default SystemStats;