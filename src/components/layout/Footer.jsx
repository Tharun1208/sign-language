import {FaGithub,FaLinkedin,FaEnvelope,} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-10">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row justify-between items-center">

          <div>

            <h2 className="text-2xl font-bold text-white">
              SignAI
            </h2>

            <p className="text-slate-400 mt-2">
              Sign Language Recognition using Enhanced Neural Networks.
            </p>

          </div>

          <div className="flex gap-6 text-2xl text-slate-300 mt-8 md:mt-0">

            <FaGithub className="hover:text-blue-500 cursor-pointer" />
            <FaLinkedin className="hover:text-blue-500 cursor-pointer" />
            <FaEnvelope className="hover:text-blue-500 cursor-pointer" />

          </div>

        </div>

        <hr className="border-slate-700 my-8" />

        <p className="text-center text-slate-500">
          © 2026 SignAI. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
};

export default Footer;