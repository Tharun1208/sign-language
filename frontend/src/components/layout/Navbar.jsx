import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Brain,
  Camera,
  Image,
  Database,
  Info,
  Menu,
  X,
  ArrowRight,
  LogIn,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // =========================================
  // CHECK LOGIN + NAVIGATE
  // =========================================

  const handleProtectedNavigation = (path) => {
    const isLoggedIn =
      localStorage.getItem("isLoggedIn") === "true" ||
      !!localStorage.getItem("token") ||
      !!localStorage.getItem("authToken");

    setMobileMenuOpen(false);

    if (isLoggedIn) {
      navigate(path);
    } else {
      localStorage.setItem("redirectAfterLogin", path);
      navigate("/login");
    }
  };

  // =========================================
  // HOME
  // =========================================

  const handleHome = () => {
    setMobileMenuOpen(false);
    navigate("/");
  };

  // =========================================
  // CLOSE MOBILE MENU ON ROUTE CHANGE
  // =========================================

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // =========================================
  // PREVENT BODY SCROLL
  // =========================================

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // =========================================
  // ACTIVE ROUTE
  // =========================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav
        className="
          fixed
          left-0
          top-0
          z-50
          w-full

          border-b
          border-slate-200/80

          bg-white/85

          backdrop-blur-xl

          dark:border-slate-800/80
          dark:bg-slate-950/85

          transition-colors
          duration-300
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            max-w-7xl
            items-center
            justify-between
            px-4

            sm:h-20
            sm:px-6

            lg:px-8
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="
              group
              flex
              items-center
              gap-2.5
              outline-none
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl

                bg-indigo-50
                text-indigo-600

                dark:bg-indigo-500/10
                dark:text-indigo-400

                transition-all
                duration-300

                group-hover:scale-105
                group-hover:bg-indigo-100

                dark:group-hover:bg-indigo-500/15
              "
            >
              <Brain
                size={20}
                strokeWidth={2.2}
              />
            </div>

            <div className="flex flex-col">
              <span
                className="
                  text-lg
                  font-bold
                  leading-none
                  tracking-tight

                  text-slate-900

                  dark:text-white

                  sm:text-xl
                "
              >
                SignAI
              </span>

              <span
                className="
                  mt-1
                  hidden
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-widest

                  text-slate-400

                  sm:block
                "
              >
                Intelligent Recognition
              </span>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <div
            className="
              hidden
              items-center
              gap-1

              lg:flex
            "
          >
            {/* HOME */}

            <Link
              to="/"
              className={`
                group
                relative
                flex
                items-center
                gap-2
                rounded-lg
                px-3.5
                py-2
                text-sm
                font-medium

                transition-all
                duration-200

                ${
                  isActive("/")
                    ? `
                      text-indigo-600
                      dark:text-indigo-400
                    `
                    : `
                      text-slate-600

                      hover:bg-slate-100
                      hover:text-indigo-600

                      dark:text-slate-400
                      dark:hover:bg-slate-900
                      dark:hover:text-indigo-400
                    `
                }
              `}
            >
              Home

              {isActive("/") && (
                <span
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    h-0.5
                    w-5
                    -translate-x-1/2
                    rounded-full
                    bg-indigo-500
                  "
                />
              )}
            </Link>

            {/* LIVE DETECTION */}

            <button
              type="button"
              onClick={() =>
                handleProtectedNavigation(
                  "/live-recognition"
                )
              }
              className="
                group
                flex
                items-center
                gap-2
                rounded-lg
                px-3.5
                py-2
                text-sm
                font-medium

                text-slate-600

                hover:bg-slate-100
                hover:text-indigo-600

                dark:text-slate-400
                dark:hover:bg-slate-900
                dark:hover:text-indigo-400

                transition-all
                duration-200
              "
            >
              <Camera size={16} />

              Live Detection
            </button>

            {/* IMAGE DETECTION */}

            <button
              type="button"
              onClick={() =>
                handleProtectedNavigation(
                  "/image-recognition"
                )
              }
              className="
                group
                flex
                items-center
                gap-2
                rounded-lg
                px-3.5
                py-2
                text-sm
                font-medium

                text-slate-600

                hover:bg-slate-100
                hover:text-indigo-600

                dark:text-slate-400
                dark:hover:bg-slate-900
                dark:hover:text-indigo-400

                transition-all
                duration-200
              "
            >
              <Image size={16} />

              Image Detection
            </button>

            {/* DATASET */}

            <button
              type="button"
              onClick={() =>
                handleProtectedNavigation("/analytics")
              }
              className="
                group
                flex
                items-center
                gap-2
                rounded-lg
                px-3.5
                py-2
                text-sm
                font-medium

                text-slate-600

                hover:bg-slate-100
                hover:text-indigo-600

                dark:text-slate-400
                dark:hover:bg-slate-900
                dark:hover:text-indigo-400

                transition-all
                duration-200
              "
            >
              <Database size={16} />

              Dataset
            </button>

            {/* ABOUT */}

            <Link
              to="/about"
              className={`
                flex
                items-center
                gap-2
                rounded-lg
                px-3.5
                py-2
                text-sm
                font-medium

                transition-all
                duration-200

                ${
                  isActive("/about")
                    ? `
                      bg-indigo-50
                      text-indigo-600

                      dark:bg-indigo-500/10
                      dark:text-indigo-400
                    `
                    : `
                      text-slate-600

                      hover:bg-slate-100
                      hover:text-indigo-600

                      dark:text-slate-400
                      dark:hover:bg-slate-900
                      dark:hover:text-indigo-400
                    `
                }
              `}
            >
              <Info size={16} />

              About
            </Link>
          </div>

          {/* =================================================
              DESKTOP GET STARTED
          ================================================= */}

          <div
            className="
              hidden
              items-center
              gap-3

              lg:flex
            "
          >
            <Link
              to="/login"
              className="
                group
                flex
                items-center
                gap-2
                rounded-xl

                bg-indigo-600

                px-5
                py-2.5

                text-sm
                font-semibold
                text-white

                shadow-lg
                shadow-indigo-500/20

                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:bg-indigo-700
                hover:shadow-xl
                hover:shadow-indigo-500/30

                active:translate-y-0
              "
            >
              <LogIn size={16} />

              Get Started

              <ArrowRight
                size={15}
                className="
                  transition-transform
                  duration-200

                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((prev) => !prev)
            }
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border

              border-slate-200
              bg-slate-50
              text-slate-700

              hover:border-indigo-200
              hover:bg-indigo-50
              hover:text-indigo-600

              dark:border-slate-800
              dark:bg-slate-900
              dark:text-slate-300

              dark:hover:border-indigo-500/30
              dark:hover:bg-indigo-500/10
              dark:hover:text-indigo-400

              transition-all
              duration-200

              lg:hidden
            "
          >
            {mobileMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </nav>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {mobileMenuOpen && (
        <div
          className="
            fixed
            inset-0
            z-40

            bg-slate-950/30
            backdrop-blur-sm

            lg:hidden
          "
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              absolute
              left-0
              right-0
              top-16

              border-b

              border-slate-200
              bg-white

              shadow-2xl

              dark:border-slate-800
              dark:bg-slate-950

              sm:top-20
            "
          >
            <div
              className="
                mx-auto
                max-w-7xl
                px-4
                py-5

                sm:px-6
              "
            >
              {/* =================================================
                  MOBILE NAVIGATION
              ================================================= */}

              <div className="space-y-1">
                {/* HOME */}

                <button
                  type="button"
                  onClick={handleHome}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium

                    text-slate-600

                    hover:bg-slate-100
                    hover:text-indigo-600

                    dark:text-slate-300
                    dark:hover:bg-slate-900
                    dark:hover:text-indigo-400

                    transition-all
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg

                      bg-slate-100

                      dark:bg-slate-900
                    "
                  >
                    <Brain size={17} />
                  </div>

                  Home
                </button>

                {/* LIVE DETECTION */}

                <button
                  type="button"
                  onClick={() =>
                    handleProtectedNavigation(
                      "/live-recognition"
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium

                    text-slate-600

                    hover:bg-slate-100
                    hover:text-indigo-600

                    dark:text-slate-300
                    dark:hover:bg-slate-900
                    dark:hover:text-indigo-400

                    transition-all
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg

                      bg-indigo-50
                      text-indigo-600

                      dark:bg-indigo-500/10
                      dark:text-indigo-400
                    "
                  >
                    <Camera size={17} />
                  </div>

                  Live Detection
                </button>

                {/* IMAGE DETECTION */}

                <button
                  type="button"
                  onClick={() =>
                    handleProtectedNavigation(
                      "/image-recognition"
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium

                    text-slate-600

                    hover:bg-slate-100
                    hover:text-indigo-600

                    dark:text-slate-300
                    dark:hover:bg-slate-900
                    dark:hover:text-indigo-400

                    transition-all
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg

                      bg-purple-50
                      text-purple-600

                      dark:bg-purple-500/10
                      dark:text-purple-400
                    "
                  >
                    <Image size={17} />
                  </div>

                  Image Detection
                </button>

                {/* DATASET */}

                <button
                  type="button"
                  onClick={() =>
                    handleProtectedNavigation(
                      "/analytics"
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium

                    text-slate-600

                    hover:bg-slate-100
                    hover:text-indigo-600

                    dark:text-slate-300
                    dark:hover:bg-slate-900
                    dark:hover:text-indigo-400

                    transition-all
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg

                      bg-emerald-50
                      text-emerald-600

                      dark:bg-emerald-500/10
                      dark:text-emerald-400
                    "
                  >
                    <Database size={17} />
                  </div>

                  Dataset
                </button>

                {/* ABOUT */}

                <Link
                  to="/about"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-medium

                    text-slate-600

                    hover:bg-slate-100
                    hover:text-indigo-600

                    dark:text-slate-300
                    dark:hover:bg-slate-900
                    dark:hover:text-indigo-400

                    transition-all
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg

                      bg-amber-50
                      text-amber-600

                      dark:bg-amber-500/10
                      dark:text-amber-400
                    "
                  >
                    <Info size={17} />
                  </div>

                  About
                </Link>
              </div>

              {/* =================================================
                  MOBILE GET STARTED
              ================================================= */}

              <div
                className="
                  mt-4
                  border-t
                  border-slate-200
                  pt-4

                  dark:border-slate-800
                "
              >
                <Link
                  to="/login"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl

                    bg-indigo-600

                    px-5
                    py-3

                    text-sm
                    font-semibold
                    text-white

                    shadow-lg
                    shadow-indigo-500/20

                    transition-all

                    hover:bg-indigo-700
                  "
                >
                  <LogIn size={17} />

                  Get Started

                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;