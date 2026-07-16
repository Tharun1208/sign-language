const ImagePrediction = () => {
  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

      <h2 className="text-2xl text-white">
        Prediction Result
      </h2>

      <div className="mt-10">

        <p className="text-gray-400">
          Predicted Gesture
        </p>

        <h1 className="text-7xl text-blue-500 font-bold mt-2">
          A
        </h1>

      </div>

      <div className="mt-10 space-y-6">

        <div>
          <p className="text-gray-400">
            Confidence
          </p>

          <h2 className="text-green-400 text-2xl">
            98.72%
          </h2>
        </div>

        <div>
          <p className="text-gray-400">
            Processing Time
          </p>

          <h2 className="text-white text-2xl">
            27 ms
          </h2>
        </div>

        <div>
          <p className="text-gray-400">
            Model
          </p>

          <h2 className="text-white text-xl">
            Enhanced Neural Network
          </h2>
        </div>

      </div>

    </div>
  );
};

export default ImagePrediction;