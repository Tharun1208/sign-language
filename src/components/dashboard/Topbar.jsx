import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMoon,
  FaUserCircle,
  FaChevronDown,
  FaCog,
  FaInfoCircle,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";

const Topbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="h-20 border-b border-slate-800 bg-slate-900 flex justify-between items-center px-8">
      <Link
        to="/"
        className="text-2xl font-bold text-white hover:text-blue-400 transition"
      >
        🤟 SignAI
      </Link>

      <div className="flex items-center gap-6">
        <FaMoon className="text-white text-xl cursor-pointer hover:text-blue-400 transition" />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg"
          >
            <FaUserCircle className="text-2xl text-white" />
            <span className="text-white">Admin</span>
            <FaChevronDown
              className={`text-white transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-56 bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-700">
                <p className="text-white font-semibold">SignAI Dashboard</p>
                <p className="text-gray-400 text-sm">Version 1.0</p>
              </div>

              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-slate-700"
              >
                <FaHome />
                Home
              </Link>

              <Link
                to="/about"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-slate-700"
              >
                <FaInfoCircle />
                About Project
              </Link>

              <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-slate-700"
              >
                <FaCog />
                Settings
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;