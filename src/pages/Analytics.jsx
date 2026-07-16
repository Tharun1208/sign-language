import DashboardLayout from "../components/dashboard/DashboardLayout";
import ModelPerformance from "../components/analytics/ModelPerformance";
import DatasetStats from "../components/analytics/DatasetStats";

const Analytics = () => {
  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold text-white mb-8">
        Dataset & Analytics
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <ModelPerformance />
        <DatasetStats />
      </div>
    </DashboardLayout>
  );
};

export default Analytics;