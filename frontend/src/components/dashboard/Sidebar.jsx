import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  House,
  LayoutDashboard,
  Camera,
  Image,
  Database,
  Info,
  Settings,
  LogOut,
  Menu as MenuIcon,
} from "lucide-react";

// =========================================================
// MENU ITEMS
// =========================================================

const menuItems = [
  {
    title: "Home",
    path: "/",
    icon: House,
  },
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Live Detection",
    path: "/live-recognition",
    icon: Camera,
  },
  {
    title: "Image Detection",
    path: "/image-recognition",
    icon: Image,
  },
  {
    title: "Dataset",
    path: "/analytics",
    icon: Database,
  },
  {
    title: "About",
    path: "/about",
    icon: Info,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

// =========================================================
// SIDEBAR
// =========================================================

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  // =======================================================
  // LOGOUT
  // =======================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("isLoggedIn");

    navigate("/login", {
      replace: true,
    });
  };

  // =======================================================
  // TOGGLE SIDEBAR
  // =======================================================

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={`
        relative
        z-50

        flex
        h-screen
        max-h-screen
        shrink-0
        flex-col
        overflow-visible

        border-r

        border-slate-200
        bg-white

        dark:border-slate-800
        dark:bg-slate-950

        transition-[width]
        duration-300
        ease-in-out

        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* =================================================
          SIDEBAR INNER
      ================================================= */}

      <div
        className="
          flex
          h-full
          min-h-0
          flex-col

          p-3
          sm:p-4
        "
      >
        {/* =================================================
            MENU BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className={`
            group

            relative

            flex
            h-11
            w-full
            shrink-0

            items-center

            overflow-hidden

            rounded-xl

            border

            border-slate-200
            bg-slate-50
            text-slate-600

            shadow-sm

            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:border-indigo-300
            hover:bg-indigo-50
            hover:text-indigo-600
            hover:shadow-md
            hover:shadow-indigo-500/10

            dark:border-slate-800
            dark:bg-slate-900
            dark:text-slate-400

            dark:hover:border-indigo-500/30
            dark:hover:bg-indigo-500/10
            dark:hover:text-indigo-400

            ${collapsed
              ? "justify-center"
              : "justify-start px-3"
            }
          `}
        >
          {/* Subtle hover glow */}

          <span
            className="
              pointer-events-none
              absolute
              inset-0

              bg-indigo-500/0

              transition-all
              duration-300

              group-hover:bg-indigo-500/5

              dark:group-hover:bg-indigo-500/5
            "
          />

          <MenuIcon
            size={21}
            className="
              relative
              z-10
              shrink-0

              transition-all
              duration-300

              group-hover:scale-110
              group-hover:rotate-3
            "
          />

          {!collapsed && (
            <span
              className="
                relative
                z-10

                ml-3

                whitespace-nowrap

                text-sm
                font-semibold
              "
            >
              Menu
            </span>
          )}
        </button>

        {/* =================================================
            SPACE
        ================================================= */}

        <div className="h-5 shrink-0" />

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav
          className="
            flex
            min-h-0
            flex-1
            flex-col
            gap-1.5
            overflow-visible
          "
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                end={item.path === "/"}
                title={collapsed ? item.title : undefined}
                className={({ isActive }) =>
                  `
                    group/nav

                    relative

                    flex
                    min-h-[46px]
                    w-full
                    shrink-0

                    items-center

                    overflow-hidden

                    rounded-xl

                    font-medium

                    transition-all
                    duration-300

                    ${
                      collapsed
                        ? "justify-center"
                        : "gap-3 px-3"
                    }

                    ${
                      isActive
                        ? `
                          bg-indigo-600
                          text-white

                          shadow-lg
                          shadow-indigo-500/25

                          hover:bg-indigo-600
                        `
                        : `
                          text-slate-600

                          hover:-translate-y-0.5
                          hover:bg-indigo-50
                          hover:text-indigo-600
                          hover:shadow-sm
                          hover:shadow-indigo-500/5

                          dark:text-slate-400

                          dark:hover:bg-indigo-500/10
                          dark:hover:text-indigo-400
                        `
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {/* =================================================
                        ACTIVE LEFT INDICATOR
                    ================================================= */}

                    {isActive && (
                      <span
                        className="
                          absolute
                          left-0
                          top-1/2

                          h-7
                          w-1

                          -translate-y-1/2

                          rounded-r-full

                          bg-white/90
                        "
                      />
                    )}

                    {/* =================================================
                        HOVER GLOW
                    ================================================= */}

                    {!isActive && (
                      <span
                        className="
                          pointer-events-none

                          absolute
                          inset-0

                          rounded-xl

                          bg-indigo-500/0

                          transition-all
                          duration-300

                          group-hover/nav:bg-indigo-500/5
                        "
                      />
                    )}

                    {/* =================================================
                        ICON
                    ================================================= */}

                    <span
                      className={`
                        relative
                        z-10

                        flex
                        h-9
                        w-9
                        shrink-0

                        items-center
                        justify-center

                        rounded-lg

                        transition-all
                        duration-300

                        ${
                          isActive
                            ? `
                              bg-white/10
                              text-white
                            `
                            : `
                              text-slate-500

                              group-hover/nav:scale-110
                              group-hover/nav:bg-indigo-100
                              group-hover/nav:text-indigo-600

                              dark:text-slate-500
                              dark:group-hover/nav:bg-indigo-500/10
                              dark:group-hover/nav:text-indigo-400
                            `
                        }
                      `}
                    >
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.3 : 2}
                        className="
                          transition-transform
                          duration-300

                          group-hover/nav:scale-105
                        "
                      />
                    </span>

                    {/* =================================================
                        TEXT
                    ================================================= */}

                    {!collapsed && (
                      <span
                        className="
                          relative
                          z-10

                          min-w-0
                          truncate
                          whitespace-nowrap

                          text-sm
                        "
                      >
                        {item.title}
                      </span>
                    )}

                    {/* =================================================
                        COLLAPSED TOOLTIP
                    ================================================= */}

                    {collapsed && (
                      <span
                        className="
                          pointer-events-none

                          absolute
                          left-full
                          top-1/2

                          z-[999]

                          ml-3

                          -translate-y-1/2
                          translate-x-1

                          whitespace-nowrap

                          rounded-xl

                          border

                          border-slate-200

                          bg-white

                          px-3
                          py-2

                          text-sm
                          font-medium

                          text-slate-700

                          opacity-0

                          shadow-xl
                          shadow-slate-900/10

                          transition-all
                          duration-200

                          group-hover/nav:translate-x-0
                          group-hover/nav:opacity-100

                          dark:border-slate-700
                          dark:bg-slate-800
                          dark:text-slate-200
                        "
                      >
                        {item.title}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <div
          className="
            mt-4
            shrink-0

            border-t

            border-slate-200

            pt-4

            dark:border-slate-800
          "
        >
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={`
              group/logout

              relative

              flex
              h-11
              w-full
              shrink-0

              items-center

              overflow-hidden

              rounded-xl

              border

              transition-all
              duration-300

              ${
                collapsed
                  ? `
                    justify-center

                    border-red-200
                    bg-red-50
                    text-red-500

                    hover:-translate-y-0.5
                    hover:border-red-300
                    hover:bg-red-100
                    hover:text-red-600
                    hover:shadow-md
                    hover:shadow-red-500/10

                    dark:border-red-500/20
                    dark:bg-red-500/5
                    dark:text-red-400

                    dark:hover:border-red-500/30
                    dark:hover:bg-red-500/10
                  `
                  : `
                    justify-start
                    gap-3
                    px-3

                    border-red-200
                    bg-red-50
                    text-red-600

                    hover:-translate-y-0.5
                    hover:border-red-300
                    hover:bg-red-100
                    hover:shadow-md
                    hover:shadow-red-500/10

                    dark:border-red-500/20
                    dark:bg-red-500/5
                    dark:text-red-400

                    dark:hover:border-red-500/30
                    dark:hover:bg-red-500/10
                  `
              }
            `}
          >
            {/* Logout Glow */}

            <span
              className="
                pointer-events-none

                absolute
                inset-0

                bg-red-500/0

                transition-all
                duration-300

                group-hover/logout:bg-red-500/5
              "
            />

            {/* =================================================
                ICON
            ================================================= */}

            <span
              className="
                relative
                z-10

                flex
                h-9
                w-9
                shrink-0

                items-center
                justify-center

                rounded-lg

                transition-all
                duration-300

                group-hover/logout:scale-110
                group-hover/logout:bg-red-100

                dark:group-hover/logout:bg-red-500/10
              "
            >
              <LogOut
                size={18}
                className="
                  transition-transform
                  duration-300

                  group-hover/logout:translate-x-0.5
                "
              />
            </span>

            {/* =================================================
                TEXT
            ================================================= */}

            {!collapsed && (
              <span
                className="
                  relative
                  z-10

                  whitespace-nowrap

                  text-sm
                  font-semibold
                "
              >
                Logout
              </span>
            )}

            {/* =================================================
                COLLAPSED TOOLTIP
            ================================================= */}

            {collapsed && (
              <span
                className="
                  pointer-events-none

                  absolute
                  left-full
                  top-1/2

                  z-[999]

                  ml-3

                  -translate-y-1/2
                  translate-x-1

                  whitespace-nowrap

                  rounded-xl

                  border

                  border-slate-200

                  bg-white

                  px-3
                  py-2

                  text-sm
                  font-medium

                  text-slate-700

                  opacity-0

                  shadow-xl
                  shadow-slate-900/10

                  transition-all
                  duration-200

                  group-hover/logout:translate-x-0
                  group-hover/logout:opacity-100

                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-slate-200
                "
              >
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;