const ProjectOverview = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

      <h2 className="text-2xl font-bold text-white mb-5">
        Project Overview
      </h2>

      <p className="text-slate-400 leading-8">
        This project focuses on real-time Sign Language Recognition
        using an Enhanced Neural Network integrated with MediaPipe,
        OpenCV and TensorFlow.

        The system detects hand gestures through a webcam or uploaded
        images and translates them into readable text,
        improving communication between hearing and speech-impaired
        individuals.
      </p>

    </div>
  );
};

export default ProjectOverview;