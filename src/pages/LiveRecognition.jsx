import DashboardLayout from "../components/dashboard/DashboardLayout";
import WebcamSection from "../components/recognition/WebcamSection";
import PredictionPanel from "../components/recognition/PredictionPanel";
import Controls from "../components/recognition/Controls";
import PredictionTable from "../components/recognition/PredictionTable";
import SystemStats from "../components/recognition/SystemStats";

const LiveRecognition = () => {
  return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold text-white mb-8">
        Live Recognition
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">
          <WebcamSection />
        </div>

        <PredictionPanel />

      </div>

      <Controls />

      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        <PredictionTable />
        <SystemStats />
      </div>

    </DashboardLayout>
  );
};

export default LiveRecognition;