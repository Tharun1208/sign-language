import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatsCard from "../components/dashboard/StatsCard";
import PredictionHistory from "../components/dashboard/PredictionHistory";

const Dashboard = () => {
  return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold text-white">
        Dashboard
      </h1>

      <p className="text-slate-400 mt-2">
        Welcome to SignAI
      </p>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

        <StatsCard
          title="Accuracy"
          value="99.21%"
          color="#16A34A"
        />

        <StatsCard
          title="Avg. Confidence"
          value="97.15%"
          color="#9333EA"
        />

        <StatsCard
          title="Latency"
          value="32 ms"
          color="#EAB308"
        />

        <StatsCard
          title="Predictions"
          value="542"
          color="#2563EB"
        />

      </div>

      <PredictionHistory />

    </DashboardLayout>
  );
};

export default Dashboard;