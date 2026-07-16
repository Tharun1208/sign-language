import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import Workflow from "../components/home/Workflow";
import Footer from "../components/layout/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <Footer />
    </>
  );
};

export default Home;