import { useState } from "react";

const UploadSection = () => {
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

      <h2 className="text-2xl text-white mb-5">
        Upload Image
      </h2>

      <label className="border-2 border-dashed border-blue-500 rounded-xl h-80 flex items-center justify-center cursor-pointer">

        {image ? (
          <img
            src={image}
            alt="Preview"
            className="h-full object-contain rounded-xl"
          />
        ) : (
          <p className="text-gray-400">
            Click to Upload an Image
          </p>
        )}

        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />

      </label>

      <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-white font-semibold">
        Predict Gesture
      </button>

    </div>
  );
};

export default UploadSection;