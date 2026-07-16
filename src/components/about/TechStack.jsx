import {
  FaReact,
  FaPython,
  FaGithub
} from "react-icons/fa";

import {
  SiTensorflow,
  SiOpencv,
  SiFastapi
} from "react-icons/si";

const technologies = [
  { name: "React", icon: <FaReact className="text-sky-400" /> },
  { name: "Python", icon: <FaPython className="text-yellow-400" /> },
  { name: "TensorFlow", icon: <SiTensorflow className="text-orange-500" /> },
  { name: "OpenCV", icon: <SiOpencv className="text-green-400" /> },
  { name: "FastAPI", icon: <SiFastapi className="text-green-500" /> },
  { name: "GitHub", icon: <FaGithub className="text-white" /> },
];

const TechStack = () => {
  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">

      <h2 className="text-2xl font-bold text-white mb-6">
        Technologies
      </h2>

      <div className="grid grid-cols-2 gap-5">

        {technologies.map((tech) => (
          <div
            key={tech.name}
            className="flex items-center gap-4 bg-slate-800 rounded-xl p-4"
          >
            <div className="text-3xl">
              {tech.icon}
            </div>

            <span className="text-white">
              {tech.name}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
};

export default TechStack;