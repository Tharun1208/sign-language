import {
  FaHome,
  FaCamera,
  FaImage,
  FaDatabase,
  FaChartBar,
  FaInfoCircle,
  FaCog,
} from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const menu = [
    { title: "Home", icon: <FaHome />, path: "/" }, // Landing page
    { title: "Dashboard", icon: <MdSpaceDashboard />, path: "/dashboard" },
    { title: "Live Detection", icon: <FaCamera />, path: "/live-recognition" },
    { title: "Image Detection", icon: <FaImage />, path: "/image-recognition" },
    { title: "Dataset", icon: <FaDatabase />, path: "/analytics" },
    { title: "About", icon: <FaInfoCircle />, path: "/about" },
    { title: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-6">

      <h1 className="text-3xl font-bold text-white mb-10">
        🤟 SignAI
      </h1>

      <div className="space-y-3">

        {menu.map((item) => (

          <Link
            key={item.title}
            to={item.path}
            className={`flex items-center gap-4 p-3 rounded-lg transition ${
              pathname === item.path
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-slate-800"
            }`}
          >
            {item.icon}
            {item.title}
          </Link>

        ))}

      </div>

    </aside>
  );
};

export default Sidebar;