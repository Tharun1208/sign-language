import {
    FaCamera,
    FaImage,
    FaBrain,
    FaBolt,
} from "react-icons/fa";

const features = [
    {
        icon: <FaCamera size={40} />,
        title: "Live Recognition",
        description:
            "Recognize sign language in real-time using your webcam.",
    },
    {
        icon: <FaImage size={40} />,
        title: "Image Recognition",
        description:
            "Upload hand gesture images for instant predictions.",
    },
    {
        icon: <FaBrain size={40} />,
        title: "Enhanced Neural Network",
        description:
            "Deep learning model trained for high accuracy.",
    },
    {
        icon: <FaBolt size={40} />,
        title: "Fast Processing",
        description:
            "Low-latency predictions with optimized inference.",
    },
];

const Features = () => {
    return (
        <section
            id="features"
            className="bg-slate-900 py-24 px-6"
        >

            <div className="max-w-7xl mx-auto">

                <h2 className="text-4xl font-bold text-center text-white">
                    Features
                </h2>

                <p className="text-center text-slate-400 mt-4">
                    Everything needed for accurate sign language recognition.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">

                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="bg-slate-800 rounded-2xl p-8 hover:-translate-y-2 transition duration-300 border border-slate-700"
                        >
                            <div className="text-blue-500">
                                {feature.icon}
                            </div>

                            <h3 className="text-xl font-semibold text-white mt-6">
                                {feature.title}
                            </h3>

                            <p className="text-slate-400 mt-4 leading-7">
                                {feature.description}
                            </p>

                        </div>
                    ))}

                </div>

            </div>

        </section>
    );
};

export default Features;