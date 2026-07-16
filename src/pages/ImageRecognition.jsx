import DashboardLayout from "../components/dashboard/DashboardLayout";
import UploadSection from "../components/recognition/UploadSection";
import ImagePrediction from "../components/recognition/ImagePrediction";

const ImageRecognition = () => {
  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold text-white mb-8">
        Image Recognition
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <UploadSection />
        <ImagePrediction />
      </div>
    </DashboardLayout>
  );
};

export default ImageRecognition;