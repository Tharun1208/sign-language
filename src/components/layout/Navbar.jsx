import { Link, useNavigate } from "react-router-dom";
import { FaHandsHelping } from "react-icons/fa";

const Navbar = () => {
    const navigate = useNavigate();

    const handleProtectedNavigation = (path) => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if (isLoggedIn) {
            navigate(path);
        } else {
            localStorage.setItem("redirectAfterLogin", path);
            navigate("/login");
        }
    };
    return (
        <nav className="fixed top-0 left-0 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-8">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3 text-white text-3xl font-bold"
                >
                    <FaHandsHelping className="text-blue-500" />
                    SignAI
                </Link>

                {/* Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    <Link
                        to="/"
                        className="text-gray-300 hover:text-blue-500 transition"
                    >
                        Home
                    </Link>

                    <button
                        onClick={() => handleProtectedNavigation("/live-recognition")}
                        className="text-gray-300 hover:text-blue-500 transition"
                    >
                        Live Detection
                    </button>

                    <button
                        onClick={() => handleProtectedNavigation("/image-recognition")}
                        className="text-gray-300 hover:text-blue-500 transition"
                    >
                        Image Detection
                    </button>

                    <button
                        onClick={() => handleProtectedNavigation("/analytics")}
                        className="text-gray-300 hover:text-blue-500 transition"
                    >
                        Dataset
                    </button>

                    <Link
                        to="/about"
                        className="text-gray-300 hover:text-blue-500 transition"
                    >
                        About
                    </Link>
                </div>

                {/* Get Started Button */}
                <Link
                    to="/login"
                    className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white font-semibold transition"
                >
                    Get Started
                </Link>

            </div>
        </nav>
    );
};

export default Navbar;