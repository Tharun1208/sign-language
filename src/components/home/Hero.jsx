import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

    const handleStartRecognition = () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if (isLoggedIn) {
            navigate("/dashboard");
        } else {
            localStorage.setItem("redirectAfterLogin", "/dashboard");
            navigate("/login");
        }
    };

    return (
        <section className="min-h-screen bg-slate-950 text-white flex items-center pt-28 px-8">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full">
                        AI Powered
                    </span>

                    <h1 className="text-6xl font-bold mt-6 leading-tight">
                        Sign Language
                        <span className="text-blue-500"> Recognition</span>
                    </h1>

                    <p className="mt-6 text-gray-400 text-lg leading-8">
                        Real-time sign language recognition using Enhanced Neural Networks,
                        MediaPipe and Computer Vision.
                    </p>

                    <div className="mt-8 flex gap-5">

                        <button
                            onClick={handleStartRecognition}
                            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-white font-semibold"
                        >
                            Start Recognition
                        </button>
                        <button
                            onClick={() => {
                                const section = document.getElementById("features");
                                if (section) {
                                    section.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    });
                                }
                            }}
                            className="border border-gray-700 px-7 py-4 rounded-xl hover:bg-slate-800"
                        >
                            Learn More
                        </button>

                    </div>
                </motion.div>

                <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex justify-center">
                        <img
                            src="/hero.png"
                            className="w-[500px] animate-pulse"
                            alt="AI Hand"
                        />
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;