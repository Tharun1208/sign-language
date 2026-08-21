import {
  FaReact,
  FaPython,
  FaGithub,
} from "react-icons/fa";

import {
  SiTensorflow,
  SiOpencv,
  SiFastapi,
} from "react-icons/si";

import {
  Cpu,
  Code2,
  Layers3,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const technologies = [
  {
    name: "React",
    description: "Frontend Development",
    icon: <FaReact />,
    iconClass: "text-sky-500 dark:text-sky-400",
  },
  {
    name: "Python",
    description: "Programming Language",
    icon: <FaPython />,
    iconClass: "text-yellow-500 dark:text-yellow-400",
  },
  {
    name: "TensorFlow",
    description: "Machine Learning",
    icon: <SiTensorflow />,
    iconClass: "text-orange-500 dark:text-orange-400",
  },
  {
    name: "OpenCV",
    description: "Computer Vision",
    icon: <SiOpencv />,
    iconClass: "text-green-600 dark:text-green-400",
  },
  {
    name: "FastAPI",
    description: "Backend API",
    icon: <SiFastapi />,
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "GitHub",
    description: "Version Control",
    icon: <FaGithub />,
    iconClass: "text-slate-700 dark:text-white",
  },
];

const TechStack = () => {
  return (
    <section
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        sm:rounded-2xl
        border
        p-4
        sm:p-5
        md:p-6
        lg:p-8

        shadow-sm

        transition-all
        duration-500
        ease-out

        border-slate-200
        bg-white
        shadow-slate-200/50

        hover:-translate-y-1
        hover:border-indigo-300
        hover:shadow-2xl
        hover:shadow-indigo-500/10

        dark:border-slate-800
        dark:bg-slate-900
        dark:shadow-black/10

        dark:hover:border-indigo-500/40
        dark:hover:shadow-indigo-500/10
      "
    >
      {/* =========================================
          MAIN BACKGROUND GLOW
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-44
          w-44

          sm:-right-20
          sm:-top-20
          sm:h-56
          sm:w-56

          rounded-full
          bg-indigo-500/5
          blur-3xl

          transition-all
          duration-700

          group-hover:scale-125
          group-hover:bg-indigo-500/10

          dark:bg-indigo-500/10
          dark:group-hover:bg-indigo-500/20
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-20
          -left-16
          h-40
          w-40

          sm:-bottom-24
          sm:-left-20
          sm:h-48
          sm:w-48

          rounded-full
          bg-purple-500/5
          blur-3xl

          transition-all
          duration-700

          group-hover:scale-125
          group-hover:bg-purple-500/10

          dark:bg-purple-500/5
          dark:group-hover:bg-purple-500/10
        "
      />

      <div className="relative">
        {/* =========================================
            HEADER
        ========================================= */}

        <div
          className="
            flex
            flex-col
            gap-4

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* TITLE */}

          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {/* HEADER ICON */}

            <div
              className="
                flex
                h-10
                w-10

                sm:h-12
                sm:w-12

                shrink-0
                items-center
                justify-center

                rounded-lg
                sm:rounded-xl

                border

                border-indigo-200
                bg-indigo-50
                text-indigo-600

                transition-all
                duration-500
                ease-out

                group-hover:scale-110
                group-hover:rotate-3
                group-hover:border-indigo-300
                group-hover:bg-indigo-100
                group-hover:shadow-lg
                group-hover:shadow-indigo-500/20

                dark:border-indigo-500/20
                dark:bg-indigo-500/10
                dark:text-indigo-400

                dark:group-hover:border-indigo-500/40
                dark:group-hover:bg-indigo-500/20
                dark:group-hover:shadow-indigo-500/20
              "
            >
              <Cpu
                size={20}
                className="
                  transition-transform
                  duration-500
                  group-hover:rotate-12
                  sm:hidden
                "
              />

              <Cpu
                size={24}
                className="
                  hidden
                  transition-transform
                  duration-500
                  group-hover:rotate-12
                  sm:block
                "
              />
            </div>

            {/* TITLE */}

            <div className="min-w-0">
              <h2
                className="
                  text-lg
                  font-bold
                  tracking-tight

                  text-slate-900
                  dark:text-white

                  transition-colors
                  duration-300

                  group-hover:text-indigo-700
                  dark:group-hover:text-indigo-300

                  sm:text-xl
                  md:text-2xl
                "
              >
                Technologies
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5

                  text-slate-500
                  dark:text-slate-400

                  transition-colors
                  duration-300

                  group-hover:text-slate-600
                  dark:group-hover:text-slate-300

                  sm:text-sm
                "
              >
                Tools and technologies powering SignAI
              </p>
            </div>
          </div>

          {/* TECHNOLOGY COUNT */}

          <div
            className="
              flex
              w-fit
              shrink-0
              items-center
              gap-2

              rounded-full
              border

              px-3
              py-1.5

              text-xs
              font-medium

              border-indigo-200
              bg-indigo-50
              text-indigo-600

              transition-all
              duration-300

              group-hover:border-indigo-300
              group-hover:bg-indigo-100
              group-hover:shadow-md
              group-hover:shadow-indigo-500/10

              dark:border-indigo-500/20
              dark:bg-indigo-500/10
              dark:text-indigo-400

              dark:group-hover:border-indigo-500/40
              dark:group-hover:bg-indigo-500/20
            "
          >
            <Layers3
              size={14}
              className="
                transition-transform
                duration-300
                group-hover:rotate-12
              "
            />

            <span>
              {technologies.length} Technologies
            </span>
          </div>
        </div>

        {/* =========================================
            TECHNOLOGY LIST
        ========================================= */}

        <div
          className="
            mt-6
            flex
            flex-col
            gap-3

            sm:mt-7
            sm:gap-4
          "
        >
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="
                group/tech
                relative
                overflow-hidden

                rounded-xl
                border

                p-3
                sm:p-4

                border-slate-200
                bg-slate-50

                transition-all
                duration-500
                ease-out

                hover:-translate-y-1
                hover:scale-[1.01]
                hover:border-indigo-300
                hover:bg-white
                hover:shadow-xl
                hover:shadow-indigo-500/10

                dark:border-slate-800
                dark:bg-slate-950/60

                dark:hover:border-indigo-500/40
                dark:hover:bg-slate-950
                dark:hover:shadow-indigo-500/10
              "
            >
              {/* =====================================
                  CARD GLOW
              ===================================== */}

              <div
                className="
                  pointer-events-none
                  absolute

                  -right-10
                  -top-10

                  h-28
                  w-28

                  rounded-full

                  bg-indigo-500/5
                  blur-2xl

                  opacity-0

                  transition-all
                  duration-500

                  group-hover/tech:scale-150
                  group-hover/tech:opacity-100

                  dark:bg-indigo-500/10
                "
              />

              {/* =====================================
                  CARD SHINE
              ===================================== */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  -left-full
                  w-1/3

                  skew-x-[-20deg]

                  bg-white/30

                  transition-all
                  duration-700

                  group-hover/tech:left-[120%]

                  dark:bg-white/5
                "
              />

              <div
                className="
                  relative
                  flex
                  min-w-0
                  items-center
                  gap-3

                  sm:gap-4
                "
              >
                {/* =================================
                    TECHNOLOGY ICON
                ================================= */}

                <div
                  className="
                    flex
                    h-10
                    w-10

                    sm:h-12
                    sm:w-12

                    shrink-0
                    items-center
                    justify-center

                    rounded-lg
                    sm:rounded-xl

                    border

                    text-2xl
                    sm:text-3xl

                    border-slate-200
                    bg-white

                    shadow-sm

                    transition-all
                    duration-500
                    ease-out

                    group-hover/tech:scale-110
                    group-hover/tech:rotate-3
                    group-hover/tech:border-indigo-300
                    group-hover/tech:shadow-lg
                    group-hover/tech:shadow-indigo-500/10

                    dark:border-slate-800
                    dark:bg-slate-900

                    dark:group-hover/tech:border-indigo-500/40
                    dark:group-hover/tech:bg-slate-900
                  "
                >
                  <span
                    className={`
                      ${tech.iconClass}
                      transition-transform
                      duration-500
                      group-hover/tech:scale-110
                    `}
                  >
                    {tech.icon}
                  </span>
                </div>

                {/* =================================
                    TECHNOLOGY INFORMATION
                ================================= */}

                <div className="min-w-0 flex-1">
                  <h3
                    className="
                      truncate
                      text-sm
                      font-semibold

                      text-slate-900
                      dark:text-white

                      transition-all
                      duration-300

                      group-hover/tech:translate-x-0.5
                      group-hover/tech:text-indigo-700

                      dark:group-hover/tech:text-indigo-300

                      sm:text-base
                    "
                  >
                    {tech.name}
                  </h3>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-xs

                      text-slate-500
                      dark:text-slate-400

                      transition-colors
                      duration-300

                      group-hover/tech:text-slate-600
                      dark:group-hover/tech:text-slate-300

                      sm:text-sm
                    "
                  >
                    {tech.description}
                  </p>
                </div>

                {/* =================================
                    ACTIVE STATUS
                ================================= */}

                <div
                  className="
                    hidden
                    shrink-0
                    items-center
                    gap-1.5

                    text-xs
                    font-medium

                    text-emerald-600
                    dark:text-emerald-400

                    transition-all
                    duration-300

                    group-hover/tech:scale-105

                    sm:flex
                  "
                >
                  <CheckCircle2
                    size={14}
                    className="
                      transition-transform
                      duration-300

                      group-hover/tech:scale-110
                      group-hover/tech:rotate-6
                    "
                  />

                  <span>
                    Active Technology
                  </span>
                </div>

                {/* =================================
                    ARROW
                ================================= */}

                <ArrowUpRight
                  size={17}
                  className="
                    shrink-0

                    text-slate-400

                    transition-all
                    duration-300

                    group-hover/tech:-translate-y-1
                    group-hover/tech:translate-x-1
                    group-hover/tech:scale-110
                    group-hover/tech:text-indigo-500

                    dark:text-slate-600
                    dark:group-hover/tech:text-indigo-400
                  "
                />
              </div>

              {/* =====================================
                  MOBILE STATUS
              ===================================== */}

              <div
                className="
                  relative
                  mt-3

                  flex
                  items-center
                  gap-1.5

                  text-[11px]
                  font-medium

                  text-emerald-600
                  dark:text-emerald-400

                  transition-transform
                  duration-300

                  group-hover/tech:translate-x-0.5

                  sm:hidden
                "
              >
                <CheckCircle2
                  size={13}
                  className="
                    transition-transform
                    duration-300
                    group-hover/tech:scale-110
                  "
                />

                Active Technology
              </div>
            </div>
          ))}
        </div>

        {/* =========================================
            FOOTER
        ========================================= */}

        <div
          className="
            mt-5
            flex
            items-start
            gap-2

            border-t
            pt-4

            border-slate-200
            dark:border-slate-800

            transition-colors
            duration-300

            group-hover:border-indigo-200
            dark:group-hover:border-indigo-500/20

            sm:mt-6
            sm:pt-5
          "
        >
          <Code2
            size={16}
            className="
              mt-0.5
              shrink-0

              text-indigo-500
              dark:text-indigo-400

              transition-transform
              duration-300

              group-hover:scale-110
              group-hover:rotate-6
            "
          />

          <p
            className="
              text-xs
              leading-5

              text-slate-500
              dark:text-slate-400

              transition-colors
              duration-300

              group-hover:text-slate-600
              dark:group-hover:text-slate-300
            "
          >
            Built using modern AI, computer vision,
            frontend, and backend technologies.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TechStack;