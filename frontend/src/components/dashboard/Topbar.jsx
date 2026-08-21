import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  UserCircle,
  ChevronDown,
  Settings,
  Info,
  House,
  LogOut,
  Brain,
  User,
} from "lucide-react";

const Topbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  // =========================================================
  // LOAD USER PROFILE
  // =========================================================

  const loadUserProfile = () => {
    try {
      const savedUser = localStorage.getItem("signai-user");
      const savedImage = localStorage.getItem(
        "signai-profile-image"
      );

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } else {
        setUser({
          name: "User",
          email: "user@signai.com",
        });
      }

      setProfileImage(savedImage || null);
    } catch (error) {
      console.error(
        "Failed to load user profile:",
        error
      );

      setUser({
        name: "User",
        email: "user@signai.com",
      });

      setProfileImage(null);
    }
  };

  // =========================================================
  // INITIAL PROFILE LOAD
  // =========================================================

  useEffect(() => {
    loadUserProfile();
  }, []);

  // =========================================================
  // UPDATE PROFILE WHEN LOCAL STORAGE CHANGES
  // =========================================================

  useEffect(() => {
    const handleStorageChange = () => {
      loadUserProfile();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  // =========================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("pendingLoginEmail");

    setOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  // =========================================================
  // CLOSE MENU
  // =========================================================

  const closeMenu = () => {
    setOpen(false);
  };

  // =========================================================
  // USER DATA
  // =========================================================

  const userName =
    user?.name?.trim() || "User";

  const userEmail =
    user?.email?.trim() || "user@signai.com";

  // =========================================================
  // GET USER INITIALS
  // =========================================================

  const getInitials = (name) => {
    if (!name) return "U";

    const parts = name
      .trim()
      .split(" ")
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const initials = getInitials(userName);

  return (
    <header
      className="
        sticky
        top-0
        z-50

        flex
        h-16
        shrink-0
        items-center
        justify-between

        border-b
        border-slate-200
        bg-white/90

        px-4

        sm:px-6
        lg:px-8

        backdrop-blur-xl

        transition-all
        duration-300

        dark:border-slate-800
        dark:bg-slate-950/90
      "
    >
      {/* =====================================================
          LEFT SECTION
      ===================================================== */}

      <div className="flex min-w-0 items-center">
        <Link
          to="/dashboard"
          className="
            group
            flex
            min-w-0
            items-center
            gap-2.5
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <div
            className="
              relative

              flex
              h-9
              w-9
              shrink-0

              items-center
              justify-center

              overflow-hidden
              rounded-xl

              border
              border-indigo-200
              bg-indigo-50
              text-indigo-600

              shadow-sm

              transition-all
              duration-300

              group-hover:scale-105
              group-hover:rotate-2
              group-hover:border-indigo-300
              group-hover:bg-indigo-100
              group-hover:shadow-md
              group-hover:shadow-indigo-500/10

              dark:border-indigo-500/20
              dark:bg-indigo-500/10
              dark:text-indigo-400

              dark:group-hover:border-indigo-500/30
              dark:group-hover:bg-indigo-500/15
            "
          >
            <span
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-xl
                bg-indigo-400/0
                transition-all
                duration-300
                group-hover:bg-indigo-400/10
              "
            />

            <Brain
              size={20}
              className="
                relative
                z-10
                transition-transform
                duration-300
                group-hover:scale-110
              "
            />
          </div>

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="hidden sm:block">
            <h1
              className="
                text-lg
                font-bold
                leading-none
                tracking-tight

                text-slate-900

                transition-colors
                duration-300

                group-hover:text-indigo-600

                dark:text-white
                dark:group-hover:text-indigo-400
              "
            >
              SignAI
            </h1>

            <p
              className="
                mt-1

                text-[9px]
                font-medium
                uppercase
                tracking-[0.2em]

                text-slate-400

                dark:text-slate-500
              "
            >
              Dashboard
            </p>
          </div>
        </Link>
      </div>

      {/* =====================================================
          RIGHT SECTION
      ===================================================== */}

      <div className="flex items-center">
        <div
          ref={menuRef}
          className="relative"
        >
          {/* =================================================
              PROFILE BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-haspopup="menu"
            className="
              group/profile

              flex
              items-center
              gap-2

              rounded-xl
              border

              px-2
              py-1.5

              shadow-sm

              transition-all
              duration-300

              border-slate-200
              bg-white

              hover:-translate-y-0.5
              hover:border-indigo-200
              hover:bg-indigo-50/60
              hover:shadow-md
              hover:shadow-indigo-500/10

              active:translate-y-0
              active:scale-[0.98]

              dark:border-slate-800
              dark:bg-slate-900

              dark:hover:border-indigo-500/20
              dark:hover:bg-slate-800

              sm:px-3
            "
          >
            {/* =================================================
                PROFILE IMAGE
            ================================================= */}

            <div
              className="
                relative
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-lg

                bg-indigo-50
                text-indigo-600

                transition-all
                duration-300

                group-hover/profile:scale-105
                group-hover/profile:bg-indigo-100

                dark:bg-indigo-500/10
                dark:text-indigo-400

                dark:group-hover/profile:bg-indigo-500/15
              "
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={userName}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    group-hover/profile:scale-110
                  "
                />
              ) : (
                <>
                  <span
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      bg-indigo-500/5
                    "
                  />

                  <UserCircle
                    size={29}
                    strokeWidth={1.5}
                    className="
                      relative
                      z-10

                      transition-all
                      duration-300

                      group-hover/profile:scale-105

                      dark:text-indigo-400
                    "
                  />
                </>
              )}
            </div>

            {/* =================================================
                USER NAME
            ================================================= */}

            <div className="hidden min-w-0 text-left sm:block">
              <p
                className="
                  max-w-[130px]
                  truncate

                  text-sm
                  font-semibold

                  text-slate-700

                  transition-colors
                  duration-200

                  group-hover/profile:text-indigo-600

                  dark:text-slate-200
                  dark:group-hover/profile:text-indigo-400
                "
              >
                {userName}
              </p>
            </div>

            {/* =================================================
                CHEVRON
            ================================================= */}

            <ChevronDown
              size={16}
              className={`
                hidden

                text-slate-400

                transition-all
                duration-300

                sm:block

                ${
                  open
                    ? "rotate-180 text-indigo-500"
                    : "group-hover/profile:text-indigo-500"
                }
              `}
            />
          </button>

          {/* =================================================
              DROPDOWN
          ================================================= */}

          {open && (
            <div
              className="
                absolute
                right-0
                top-full
                mt-3

                w-72

                overflow-hidden

                rounded-2xl

                border

                border-slate-200
                bg-white

                shadow-2xl
                shadow-slate-900/10

                animate-in
                fade-in
                slide-in-from-top-2
                duration-200

                dark:border-slate-800
                dark:bg-slate-900
                dark:shadow-black/30
              "
            >
              {/* =================================================
                  PROFILE HEADER
              ================================================= */}

              <div
                className="
                  relative
                  overflow-hidden

                  border-b
                  border-slate-200

                  bg-gradient-to-br
                  from-indigo-50
                  via-white
                  to-purple-50

                  px-4
                  py-5

                  dark:border-slate-800
                  dark:from-indigo-500/10
                  dark:via-slate-900
                  dark:to-purple-500/5
                "
              >
                {/* Background Glow */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-28
                    w-28
                    rounded-full
                    bg-indigo-500/10
                    blur-2xl
                  "
                />

                <div className="relative flex items-center gap-3">
                  {/* Profile Image */}

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-2xl

                      border
                      border-indigo-200

                      bg-indigo-100
                      text-indigo-600

                      shadow-sm

                      dark:border-indigo-500/20
                      dark:bg-indigo-500/10
                      dark:text-indigo-400
                    "
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={userName}
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    ) : (
                      <span className="text-base font-bold">
                        {initials}
                      </span>
                    )}
                  </div>

                  {/* User Details */}

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        truncate
                        text-sm
                        font-bold

                        text-slate-900
                        dark:text-white
                      "
                    >
                      {userName}
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        text-xs

                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  MENU ITEMS
              ================================================= */}

              <div className="p-1.5">
                {/* PROFILE */}

                <Link
                  to="/settings"
                  onClick={closeMenu}
                  className="
                    group/item

                    flex
                    items-center
                    gap-3

                    rounded-xl

                    px-3
                    py-2.5

                    text-sm

                    text-slate-600

                    transition-all
                    duration-200

                    hover:translate-x-1
                    hover:bg-indigo-50
                    hover:text-indigo-600

                    dark:text-slate-300
                    dark:hover:bg-indigo-500/10
                    dark:hover:text-indigo-400
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
                      text-slate-500

                      transition-all
                      duration-200

                      group-hover/item:bg-indigo-100
                      group-hover/item:text-indigo-600

                      dark:bg-slate-800
                      dark:text-slate-400

                      dark:group-hover/item:bg-indigo-500/10
                      dark:group-hover/item:text-indigo-400
                    "
                  >
                    <User size={16} />
                  </div>

                  <div>
                    <p className="font-medium">
                      Profile
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[10px]
                        text-slate-400
                        dark:text-slate-500
                      "
                    >
                      Manage your profile
                    </p>
                  </div>
                </Link>

                {/* HOME */}

                <Link
                  to="/"
                  onClick={closeMenu}
                  className="
                    group/item

                    flex
                    items-center
                    gap-3

                    rounded-xl

                    px-3
                    py-2.5

                    text-sm

                    text-slate-600

                    transition-all
                    duration-200

                    hover:translate-x-1
                    hover:bg-indigo-50
                    hover:text-indigo-600

                    dark:text-slate-300
                    dark:hover:bg-indigo-500/10
                    dark:hover:text-indigo-400
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
                      text-slate-500

                      transition-all
                      duration-200

                      group-hover/item:bg-indigo-100
                      group-hover/item:text-indigo-600

                      dark:bg-slate-800
                      dark:text-slate-400

                      dark:group-hover/item:bg-indigo-500/10
                      dark:group-hover/item:text-indigo-400
                    "
                  >
                    <House size={16} />
                  </div>

                  <span className="font-medium">
                    Home
                  </span>
                </Link>

                {/* ABOUT */}

                <Link
                  to="/about"
                  onClick={closeMenu}
                  className="
                    group/item

                    flex
                    items-center
                    gap-3

                    rounded-xl

                    px-3
                    py-2.5

                    text-sm

                    text-slate-600

                    transition-all
                    duration-200

                    hover:translate-x-1
                    hover:bg-indigo-50
                    hover:text-indigo-600

                    dark:text-slate-300
                    dark:hover:bg-indigo-500/10
                    dark:hover:text-indigo-400
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
                      text-slate-500

                      transition-all
                      duration-200

                      group-hover/item:bg-indigo-100
                      group-hover/item:text-indigo-600

                      dark:bg-slate-800
                      dark:text-slate-400

                      dark:group-hover/item:bg-indigo-500/10
                      dark:group-hover/item:text-indigo-400
                    "
                  >
                    <Info size={16} />
                  </div>

                  <span className="font-medium">
                    About Project
                  </span>
                </Link>

                {/* SETTINGS */}

                <Link
                  to="/settings"
                  onClick={closeMenu}
                  className="
                    group/item

                    flex
                    items-center
                    gap-3

                    rounded-xl

                    px-3
                    py-2.5

                    text-sm

                    text-slate-600

                    transition-all
                    duration-200

                    hover:translate-x-1
                    hover:bg-indigo-50
                    hover:text-indigo-600

                    dark:text-slate-300
                    dark:hover:bg-indigo-500/10
                    dark:hover:text-indigo-400
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
                      text-slate-500

                      transition-all
                      duration-200

                      group-hover/item:bg-indigo-100
                      group-hover/item:text-indigo-600

                      dark:bg-slate-800
                      dark:text-slate-400

                      dark:group-hover/item:bg-indigo-500/10
                      dark:group-hover/item:text-indigo-400
                    "
                  >
                    <Settings
                      size={16}
                      className="
                        transition-transform
                        duration-300

                        group-hover/item:rotate-45
                      "
                    />
                  </div>

                  <span className="font-medium">
                    Settings
                  </span>
                </Link>
              </div>

              {/* =================================================
                  DIVIDER
              ================================================= */}

              <div
                className="
                  mx-3
                  border-t
                  border-slate-200
                  dark:border-slate-800
                "
              />

              {/* =================================================
                  LOGOUT
              ================================================= */}

              <div className="p-1.5">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    group/logout

                    flex
                    w-full
                    items-center
                    gap-3

                    rounded-xl

                    px-3
                    py-2.5

                    text-sm

                    text-red-500

                    transition-all
                    duration-200

                    hover:translate-x-1
                    hover:bg-red-50
                    hover:text-red-600

                    dark:text-red-400
                    dark:hover:bg-red-500/10
                    dark:hover:text-red-300
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

                      bg-red-50
                      text-red-500

                      transition-all
                      duration-200

                      group-hover/logout:bg-red-100

                      dark:bg-red-500/10
                      dark:text-red-400

                      dark:group-hover/logout:bg-red-500/15
                    "
                  >
                    <LogOut
                      size={16}
                      className="
                        transition-transform
                        duration-200

                        group-hover/logout:translate-x-0.5
                      "
                    />
                  </div>

                  <span className="font-medium">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;