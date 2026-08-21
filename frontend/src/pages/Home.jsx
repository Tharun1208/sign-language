import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import Workflow from "../components/home/Workflow";
import Footer from "../components/layout/Footer";

const Home = () => {
  return (
    <div
      className="
        min-h-screen
        overflow-x-hidden
        bg-white
        text-slate-900
      "
    >
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <main>
        <Hero />

        {/* Features */}
        <Features />

        {/* Workflow */}
        <Workflow />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;