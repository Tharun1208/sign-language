import { useState } from "react";

import {
  UserCircle,
  Camera,
  Save,
  User,
  Mail,
  Phone,
  Calendar,
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  Pencil,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  /* =========================================
     THEME
  ========================================= */

  const { theme, setTheme } = useTheme();

  /* =========================================
     USER
  ========================================= */

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("signai-user");

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error("Failed to load saved user:", error);
      }
    }

    return {
      name: "User",
      email: "user@signai.com",
      phone: "",
      age: "",
    };
  });

  const [profileImage, setProfileImage] = useState(
    () => localStorage.getItem("signai-profile-image") || null
  );

  const [saved, setSaved] = useState(false);

  /* =========================================
     FORM CHANGE
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((previousUser) => ({
      ...previousUser,
      [name]: value,
    }));

    setSaved(false);
  };

  /* =========================================
     IMAGE CHANGE
  ========================================= */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setProfileImage(imageUrl);

    try {
      const reader = new FileReader();

      reader.onloadend = () => {
        localStorage.setItem(
          "signai-profile-image",
          reader.result
        );
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to save profile image:", error);
    }

    setSaved(false);
  };

  /* =========================================
     SAVE PROFILE
  ========================================= */

  const handleSave = () => {
    localStorage.setItem("signai-user", JSON.stringify(user));

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  /* =========================================
     THEME OPTIONS
  ========================================= */

  const themeOptions = [
    {
      id: "light",
      title: "Light",
      description: "A clean and bright interface",
      icon: Sun,
    },
    {
      id: "dark",
      title: "Dark",
      description: "A comfortable dark interface",
      icon: Moon,
    },
    {
      id: "system",
      title: "System",
      description: "Match your device preference",
      icon: Monitor,
    },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8 pb-10">

        {/* =========================================
            HEADER
        ========================================= */}

        <section
          className="
            group
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm

            transition-all
            duration-500

            hover:-translate-y-1
            hover:border-indigo-200
            hover:shadow-xl
            hover:shadow-indigo-500/10

            dark:border-slate-800
            dark:bg-slate-900
            dark:hover:border-indigo-500/30

            sm:p-8
          "
        >
          {/* Background decoration */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-56
              w-56
              rounded-full
              bg-indigo-500/10
              blur-3xl

              transition-all
              duration-700

              group-hover:bg-indigo-500/20
              group-hover:scale-125
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              left-1/3
              h-40
              w-40
              rounded-full
              bg-purple-500/10
              blur-3xl

              transition-all
              duration-700

              group-hover:translate-x-10
            "
          />

          <div className="relative">

            <div
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-indigo-200
                bg-indigo-50
                px-3
                py-1.5
                text-xs
                font-semibold
                text-indigo-600

                transition-all
                duration-300

                group-hover:border-indigo-300
                group-hover:bg-indigo-100

                dark:border-indigo-500/20
                dark:bg-indigo-500/10
                dark:text-indigo-400
                dark:group-hover:bg-indigo-500/20
              "
            >
              <Sparkles size={14} />

              Personal Settings
            </div>

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-slate-900

                dark:text-white

                sm:text-4xl
              "
            >
              Profile Settings
            </h1>

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-7
                text-slate-500
                dark:text-slate-400

                sm:text-base
              "
            >
              Manage your personal information, profile
              picture, and application appearance.
            </p>
          </div>
        </section>

        {/* =========================================
            PERSONAL INFORMATION
        ========================================= */}

        <section
          className="
            group
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-sm

            transition-all
            duration-500

            hover:-translate-y-1
            hover:border-indigo-200
            hover:shadow-xl
            hover:shadow-indigo-500/10

            dark:border-slate-800
            dark:bg-slate-900
            dark:hover:border-indigo-500/30
          "
        >
          {/* Glow */}

          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-64
              w-64
              rounded-full
              bg-indigo-500/5
              blur-3xl

              transition-all
              duration-700

              group-hover:bg-indigo-500/10
              group-hover:scale-125
            "
          />

          {/* Header */}

          <div
            className="
              relative
              border-b
              border-slate-200
              px-5
              py-5

              dark:border-slate-800

              sm:px-7
            "
          >
            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-100
                  text-indigo-600

                  transition-all
                  duration-300

                  group-hover:scale-110
                  group-hover:rotate-3

                  dark:bg-indigo-500/10
                  dark:text-indigo-400
                "
              >
                <User size={20} />
              </div>

              <div>
                <h2
                  className="
                    text-base
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Personal Information
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Update your personal details
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-5 sm:p-7">

            {/* =========================================
                PROFILE HEADER
            ========================================= */}

            <div
              className="
                flex
                flex-col
                items-center
                gap-6
                border-b
                border-slate-200
                pb-8

                dark:border-slate-800

                sm:flex-row
              "
            >
              {/* Profile Image */}

              <div className="group/avatar relative">

                <div
                  className="
                    relative
                    rounded-full
                    p-1

                    transition-all
                    duration-500

                    group-hover/avatar:scale-105
                  "
                >
                  <div
                    className="
                      absolute
                      inset-0
                      rounded-full
                      bg-gradient-to-r
                      from-indigo-500
                      via-purple-500
                      to-cyan-500
                      opacity-0
                      blur-md

                      transition-all
                      duration-500

                      group-hover/avatar:opacity-60
                    "
                  />

                  <div
                    className="
                      relative
                      overflow-hidden
                      rounded-full
                      bg-white

                      dark:bg-slate-900
                    "
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="
                          h-28
                          w-28
                          rounded-full
                          object-cover
                          ring-4
                          ring-indigo-500/10

                          transition-all
                          duration-500

                          group-hover/avatar:scale-105
                        "
                      />
                    ) : (
                      <UserCircle
                        size={112}
                        strokeWidth={1.2}
                        className="
                          text-indigo-500
                          dark:text-indigo-400
                        "
                      />
                    )}
                  </div>
                </div>

                {/* Camera button */}

                <label
                  className="
                    absolute
                    bottom-0
                    right-0
                    flex
                    h-10
                    w-10
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-full

                    border-4
                    border-white

                    bg-indigo-600
                    text-white

                    shadow-lg
                    shadow-indigo-600/30

                    transition-all
                    duration-300

                    hover:scale-110
                    hover:bg-indigo-700
                    hover:shadow-xl
                    hover:shadow-indigo-600/40

                    dark:border-slate-900
                  "
                >
                  <Camera size={17} />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* User information */}

              <div className="text-center sm:text-left">

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2

                    sm:justify-start
                  "
                >
                  <h2
                    className="
                      text-xl
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {user.name || "User"}
                  </h2>

                  <Pencil
                    size={15}
                    className="
                      text-slate-400

                      transition-all
                      duration-300

                      group-hover:text-indigo-500
                    "
                  />
                </div>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {user.email}
                </p>

                <div
                  className="
                    mt-3
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-indigo-200
                    bg-indigo-50
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-indigo-600

                    transition-all
                    duration-300

                    hover:border-indigo-300
                    hover:bg-indigo-100
                    hover:shadow-md
                    hover:shadow-indigo-500/10

                    dark:border-indigo-500/20
                    dark:bg-indigo-500/10
                    dark:text-indigo-400
                    dark:hover:bg-indigo-500/20
                  "
                >
                  <ShieldCheck size={14} />

                  SignAI User
                </div>
              </div>
            </div>

            {/* =========================================
                FORM
            ========================================= */}

            <div
              className="
                mt-8
                grid
                grid-cols-1
                gap-6

                md:grid-cols-2
              "
            >
              {/* Full Name */}

              <div className="group/input">
                <label
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  <User
                    size={15}
                    className="
                      transition-colors
                      group-focus-within/input:text-indigo-500
                    "
                  />

                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={user.name || ""}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-900
                    outline-none

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:border-indigo-200
                    hover:bg-white
                    hover:shadow-md
                    hover:shadow-indigo-500/5

                    focus:border-indigo-500
                    focus:ring-4
                    focus:ring-indigo-500/10

                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                    dark:placeholder:text-slate-600

                    dark:hover:border-indigo-500/40
                    dark:hover:bg-slate-900
                  "
                />
              </div>

              {/* Email */}

              <div className="group/input">
                <label
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  <Mail
                    size={15}
                    className="
                      transition-colors
                      group-focus-within/input:text-indigo-500
                    "
                  />

                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={user.email || ""}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-900
                    outline-none

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:border-indigo-200
                    hover:bg-white
                    hover:shadow-md
                    hover:shadow-indigo-500/5

                    focus:border-indigo-500
                    focus:ring-4
                    focus:ring-indigo-500/10

                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white

                    dark:hover:border-indigo-500/40
                    dark:hover:bg-slate-900
                  "
                />
              </div>

              {/* Phone */}

              <div className="group/input">
                <label
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  <Phone
                    size={15}
                    className="
                      transition-colors
                      group-focus-within/input:text-indigo-500
                    "
                  />

                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={user.phone || ""}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-900
                    outline-none

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:border-indigo-200
                    hover:bg-white
                    hover:shadow-md

                    focus:border-indigo-500
                    focus:ring-4
                    focus:ring-indigo-500/10

                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white

                    dark:hover:border-indigo-500/40
                    dark:hover:bg-slate-900
                  "
                />
              </div>

              {/* Age */}

              <div className="group/input">
                <label
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  <Calendar
                    size={15}
                    className="
                      transition-colors
                      group-focus-within/input:text-indigo-500
                    "
                  />

                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  value={user.age || ""}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-900
                    outline-none

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:border-indigo-200
                    hover:bg-white
                    hover:shadow-md

                    focus:border-indigo-500
                    focus:ring-4
                    focus:ring-indigo-500/10

                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white

                    dark:hover:border-indigo-500/40
                    dark:hover:bg-slate-900
                  "
                />
              </div>
            </div>

            {/* =========================================
                SAVE
            ========================================= */}

            <div
              className="
                mt-8
                flex
                flex-col
                gap-4
                border-t
                border-slate-200
                pt-6

                dark:border-slate-800

                sm:flex-row
                sm:items-center
                sm:justify-end
              "
            >
              {saved && (
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-sm
                    font-medium
                    text-emerald-500

                    sm:mr-auto
                  "
                >
                  <Check size={17} />

                  Profile updated successfully
                </div>
              )}

              <button
                onClick={handleSave}
                className="
                  group/save
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-indigo-600
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white

                  shadow-lg
                  shadow-indigo-600/20

                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:bg-indigo-700
                  hover:shadow-xl
                  hover:shadow-indigo-600/30

                  active:translate-y-0
                  active:scale-95
                "
              >
                <Save
                  size={17}
                  className="
                    transition-transform
                    duration-300

                    group-hover/save:scale-110
                  "
                />

                Save Changes
              </button>
            </div>
          </div>
        </section>

        {/* =========================================
            APPEARANCE
        ========================================= */}

        <section
          className="
            group
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-sm

            transition-all
            duration-500

            hover:-translate-y-1
            hover:border-purple-200
            hover:shadow-xl
            hover:shadow-purple-500/10

            dark:border-slate-800
            dark:bg-slate-900
            dark:hover:border-purple-500/30
          "
        >
          {/* Background glow */}

          <div
            className="
              pointer-events-none
              absolute
              -left-20
              -top-20
              h-52
              w-52
              rounded-full
              bg-purple-500/5
              blur-3xl

              transition-all
              duration-700

              group-hover:scale-125
              group-hover:bg-purple-500/10
            "
          />

          {/* Header */}

          <div
            className="
              relative
              border-b
              border-slate-200
              px-5
              py-5

              dark:border-slate-800

              sm:px-7
            "
          >
            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-purple-100
                  text-purple-600

                  transition-all
                  duration-300

                  group-hover:scale-110
                  group-hover:rotate-3

                  dark:bg-purple-500/10
                  dark:text-purple-400
                "
              >
                <Palette size={20} />
              </div>

              <div>
                <h2
                  className="
                    text-base
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Appearance
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Customize how SignAI looks
                </p>
              </div>
            </div>
          </div>

          {/* Theme cards */}

          <div className="relative p-5 sm:p-7">

            <div
              className="
                grid
                grid-cols-1
                gap-4

                md:grid-cols-3
              "
            >
              {themeOptions.map((option) => {
                const Icon = option.icon;

                const isSelected = theme === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setTheme(option.id)}
                    className={`
                      group/theme
                      relative
                      overflow-hidden
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      p-5
                      text-left

                      transition-all
                      duration-300

                      hover:-translate-y-1
                      hover:shadow-xl

                      active:scale-[0.98]

                      ${
                        isSelected
                          ? `
                            border-indigo-500
                            bg-indigo-50
                            shadow-lg
                            shadow-indigo-500/10

                            dark:border-indigo-500
                            dark:bg-indigo-500/10
                          `
                          : `
                            border-slate-200
                            bg-slate-50

                            hover:border-indigo-300
                            hover:bg-indigo-50/70
                            hover:shadow-indigo-500/10

                            dark:border-slate-800
                            dark:bg-slate-950

                            dark:hover:border-indigo-500/30
                            dark:hover:bg-slate-900
                          `
                      }
                    `}
                  >
                    {/* Hover glow */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -right-10
                        -top-10
                        h-24
                        w-24
                        rounded-full
                        bg-indigo-500/10
                        blur-2xl
                        opacity-0

                        transition-all
                        duration-500

                        group-hover/theme:opacity-100
                        group-hover/theme:scale-150
                      "
                    />

                    {/* Icon */}

                    <div
                      className={`
                        relative
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl

                        transition-all
                        duration-300

                        group-hover/theme:scale-110
                        group-hover/theme:rotate-3

                        ${
                          isSelected
                            ? `
                              bg-indigo-600
                              text-white
                              shadow-lg
                              shadow-indigo-600/30
                            `
                            : `
                              bg-slate-200
                              text-slate-600

                              group-hover/theme:bg-indigo-600
                              group-hover/theme:text-white

                              dark:bg-slate-800
                              dark:text-slate-400

                              dark:group-hover/theme:bg-indigo-600
                              dark:group-hover/theme:text-white
                            `
                        }
                      `}
                    >
                      <Icon size={21} />
                    </div>

                    {/* Text */}

                    <div className="relative min-w-0 flex-1">

                      <h3
                        className={`
                          text-sm
                          font-semibold

                          transition-colors
                          duration-300

                          ${
                            isSelected
                              ? `
                                text-indigo-700
                                dark:text-indigo-400
                              `
                              : `
                                text-slate-800
                                group-hover/theme:text-indigo-700

                                dark:text-slate-200
                                dark:group-hover/theme:text-indigo-400
                              `
                          }
                        `}
                      >
                        {option.title}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-xs
                          leading-5
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {option.description}
                      </p>
                    </div>

                    {/* Selected */}

                    {isSelected && (
                      <div
                        className="
                          relative
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-indigo-600
                          text-white

                          shadow-md
                          shadow-indigo-600/20

                          animate-in
                        "
                      >
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================
            SECURITY / PRIVACY INFO
        ========================================= */}

        <section
          className="
            group
            flex
            flex-col
            gap-4
            rounded-2xl
            border
            border-emerald-100
            bg-emerald-50/60
            p-5

            transition-all
            duration-300

            hover:-translate-y-1
            hover:border-emerald-200
            hover:bg-emerald-50
            hover:shadow-lg
            hover:shadow-emerald-500/10

            dark:border-emerald-500/20
            dark:bg-emerald-500/5
            dark:hover:bg-emerald-500/10

            sm:flex-row
            sm:items-center
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-emerald-100
              text-emerald-600

              transition-all
              duration-300

              group-hover:scale-110
              group-hover:rotate-3

              dark:bg-emerald-500/10
              dark:text-emerald-400
            "
          >
            <ShieldCheck size={21} />
          </div>

          <div>
            <h3
              className="
                text-sm
                font-semibold
                text-emerald-800
                dark:text-emerald-400
              "
            >
              Your information is stored locally
            </h3>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-emerald-700/70
                dark:text-emerald-400/70
              "
            >
              Your profile information and profile picture
              are saved in your browser's local storage.
            </p>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default Settings;