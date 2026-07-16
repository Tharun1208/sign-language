import DashboardLayout from "../components/dashboard/DashboardLayout";
import TechStack from "../components/about/TechStack";
import TeamSection from "../components/about/TeamSection";
import ProjectOverview from "../components/about/ProjectOverview";

const About = () => {
  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold text-white mb-8">
        About the Project
      </h1>

      <ProjectOverview />

      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        <TechStack />
        <TeamSection />
      </div>
    </DashboardLayout>
  );
};

export default About;