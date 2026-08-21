import {
  Brain,
  Camera,
  Hand,
  Languages,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

const ProjectOverview = () => {
  const technologies = [
    {
      name: "MediaPipe",
      icon: Hand,
    },
    {
      name: "OpenCV",
      icon: Camera,
    },
    {
      name: "TensorFlow",
      icon: Brain,
    },
    {
      name: "Neural Network",
      icon: Sparkles,
    },
  ];

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
          BACKGROUND GLOW
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-48
          w-48
          rounded-full
          bg-indigo-500/5
          blur-3xl

          transition-all
          duration-700
          ease-out

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
          -bottom-24
          -left-16
          h-44
          w-44
          rounded-full
          bg-purple-500/5
          blur-3xl

          transition-all
          duration-700
          ease-out

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
            sm:items-start
            sm:justify-between
          "
        >
          {/* PROJECT TITLE */}

          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            {/* Project Icon */}

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
              "
            >
              <Brain
                size={20}
                className="
                  transition-transform
                  duration-500
                  sm:hidden
                  group-hover:scale-110
                "
              />

              <Brain
                size={24}
                className="
                  hidden
                  transition-transform
                  duration-500
                  sm:block
                  group-hover:scale-110
                "
              />
            </div>

            {/* TITLE */}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
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
                  Project Overview
                </h2>

                <Sparkles
                  size={15}
                  className="
                    shrink-0
                    text-indigo-500

                    transition-all
                    duration-500

                    group-hover:rotate-12
                    group-hover:scale-125

                    dark:text-indigo-400
                  "
                />
              </div>

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
                AI-powered Sign Language Recognition
              </p>
            </div>
          </div>

          {/* STATUS */}

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

              border-emerald-200
              bg-emerald-50
              text-emerald-600

              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:border-emerald-300
              hover:bg-emerald-100
              hover:shadow-md
              hover:shadow-emerald-500/10

              dark:border-emerald-500/20
              dark:bg-emerald-500/10
              dark:text-emerald-400

              dark:hover:border-emerald-500/40
              dark:hover:bg-emerald-500/15
            "
          >
            <span className="relative flex h-2 w-2">
              <span
                className="
                  absolute
                  inline-flex
                  h-full
                  w-full
                  animate-ping
                  rounded-full
                  bg-emerald-400
                  opacity-75
                "
              />

              <span
                className="
                  relative
                  inline-flex
                  h-2
                  w-2
                  rounded-full
                  bg-emerald-500
                "
              />
            </span>

            Active
          </div>
        </div>

        {/* =========================================
            DESCRIPTION
        ========================================= */}

        <div className="mt-6 max-w-4xl sm:mt-7">
          <p
            className="
              text-sm
              leading-6
              text-slate-600
              dark:text-slate-400

              transition-colors
              duration-300

              group-hover:text-slate-700
              dark:group-hover:text-slate-300

              sm:leading-7
              md:text-base
              md:leading-8
            "
          >
            SignAI is an AI-powered system designed for{" "}
            <span
              className="
                font-medium
                text-slate-900
                dark:text-slate-200

                transition-colors
                duration-300

                group-hover:text-indigo-700
                dark:group-hover:text-indigo-300
              "
            >
              real-time Sign Language Recognition
            </span>
            . It combines an enhanced neural network with computer vision
            technologies to identify hand gestures and convert them into
            readable text.
          </p>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-slate-600
              dark:text-slate-400

              transition-colors
              duration-300

              group-hover:text-slate-700
              dark:group-hover:text-slate-300

              sm:mt-4
              sm:leading-7
              md:text-base
              md:leading-8
            "
          >
            The system can process gestures captured through a webcam or
            uploaded images, helping create a more accessible communication
            experience for individuals who use sign language.
          </p>
        </div>

        {/* =========================================
            FEATURES
        ========================================= */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-3

            sm:mt-8
            sm:grid-cols-2
          "
        >
          {/* REAL-TIME DETECTION */}

          <div
            className="
              group/feature
              flex
              items-start
              gap-3
              rounded-xl
              border
              p-3
              sm:p-4

              border-slate-200
              bg-slate-50

              transition-all
              duration-300
              ease-out

              hover:-translate-y-1
              hover:border-indigo-300
              hover:bg-indigo-50/70
              hover:shadow-lg
              hover:shadow-indigo-500/10

              dark:border-slate-800
              dark:bg-slate-950/50

              dark:hover:border-indigo-500/30
              dark:hover:bg-indigo-500/10
              dark:hover:shadow-indigo-500/5
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg

                bg-indigo-100
                text-indigo-600

                transition-all
                duration-300

                group-hover/feature:scale-110
                group-hover/feature:rotate-3
                group-hover/feature:shadow-md
                group-hover/feature:shadow-indigo-500/20

                dark:bg-indigo-500/10
                dark:text-indigo-400
              "
            >
              <Camera
                size={18}
                className="
                  transition-transform
                  duration-300
                  group-hover/feature:scale-110
                "
              />
            </div>

            <div className="min-w-0">
              <h3
                className="
                  text-sm
                  font-semibold
                  text-slate-800
                  dark:text-slate-200

                  transition-colors
                  duration-300

                  group-hover/feature:text-indigo-700
                  dark:group-hover/feature:text-indigo-300
                "
              >
                Real-Time Detection
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-slate-500
                  dark:text-slate-400

                  transition-colors
                  duration-300

                  group-hover/feature:text-slate-600
                  dark:group-hover/feature:text-slate-300
                "
              >
                Recognizes hand gestures directly through a webcam.
              </p>
            </div>
          </div>

          {/* GESTURE TRANSLATION */}

          <div
            className="
              group/feature
              flex
              items-start
              gap-3
              rounded-xl
              border
              p-3
              sm:p-4

              border-slate-200
              bg-slate-50

              transition-all
              duration-300
              ease-out

              hover:-translate-y-1
              hover:border-purple-300
              hover:bg-purple-50/70
              hover:shadow-lg
              hover:shadow-purple-500/10

              dark:border-slate-800
              dark:bg-slate-950/50

              dark:hover:border-purple-500/30
              dark:hover:bg-purple-500/10
              dark:hover:shadow-purple-500/5
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg

                bg-purple-100
                text-purple-600

                transition-all
                duration-300

                group-hover/feature:scale-110
                group-hover/feature:rotate-3
                group-hover/feature:shadow-md
                group-hover/feature:shadow-purple-500/20

                dark:bg-purple-500/10
                dark:text-purple-400
              "
            >
              <Languages
                size={18}
                className="
                  transition-transform
                  duration-300
                  group-hover/feature:scale-110
                "
              />
            </div>

            <div className="min-w-0">
              <h3
                className="
                  text-sm
                  font-semibold
                  text-slate-800
                  dark:text-slate-200

                  transition-colors
                  duration-300

                  group-hover/feature:text-purple-700
                  dark:group-hover/feature:text-purple-300
                "
              >
                Gesture Translation
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-slate-500
                  dark:text-slate-400

                  transition-colors
                  duration-300

                  group-hover/feature:text-slate-600
                  dark:group-hover/feature:text-slate-300
                "
              >
                Converts recognized gestures into readable text.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            TECHNOLOGY STACK
        ========================================= */}

        <div
          className="
            mt-6
            border-t
            pt-5

            border-slate-200
            dark:border-slate-800

            sm:mt-8
            sm:pt-6
          "
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3
              className="
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-300

                transition-colors
                duration-300

                group-hover:text-indigo-700
                dark:group-hover:text-indigo-300
              "
            >
              Technology Stack
            </h3>

            <ArrowUpRight
              size={16}
              className="
                shrink-0
                text-slate-400
                dark:text-slate-600

                transition-all
                duration-300

                group-hover:translate-x-1
                group-hover:-translate-y-1
                group-hover:text-indigo-500

                dark:group-hover:text-indigo-400
              "
            />
          </div>

          <div
            className="
              grid
              grid-cols-1
              gap-2.5

              min-[400px]:grid-cols-2
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {technologies.map((technology) => {
              const Icon = technology.icon;

              return (
                <div
                  key={technology.name}
                  className="
                    group/tech
                    flex
                    min-w-0
                    items-center
                    gap-2.5
                    rounded-xl
                    border
                    px-3
                    py-3

                    border-slate-200
                    bg-slate-50

                    transition-all
                    duration-300
                    ease-out

                    hover:-translate-y-1
                    hover:border-indigo-300
                    hover:bg-indigo-50
                    hover:shadow-lg
                    hover:shadow-indigo-500/10

                    dark:border-slate-800
                    dark:bg-slate-950/40

                    dark:hover:border-indigo-500/30
                    dark:hover:bg-indigo-500/10
                    dark:hover:shadow-indigo-500/5
                  "
                >
                  <Icon
                    size={17}
                    className="
                      shrink-0
                      text-indigo-500

                      transition-all
                      duration-300

                      group-hover/tech:scale-125
                      group-hover/tech:rotate-6

                      dark:text-indigo-400
                    "
                  />

                  <span
                    className="
                      min-w-0
                      truncate
                      text-xs
                      font-medium

                      text-slate-600

                      transition-colors
                      duration-300

                      group-hover/tech:text-indigo-700

                      dark:text-slate-400
                      dark:group-hover/tech:text-indigo-300
                    "
                  >
                    {technology.name}
                  </span>

                  <CheckCircle2
                    size={13}
                    className="
                      ml-auto
                      shrink-0
                      text-emerald-500/70

                      transition-all
                      duration-300

                      group-hover/tech:scale-110
                      group-hover/tech:text-emerald-500
                    "
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectOverview;