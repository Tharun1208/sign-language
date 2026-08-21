import {
  Camera,
  Image,
  Brain,
  Zap,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Live Recognition",
    description:
      "Recognize sign language in real-time using your webcam with fast and reliable gesture detection.",
    color: "indigo",
  },
  {
    icon: Image,
    title: "Image Recognition",
    description:
      "Upload hand gesture images and receive instant predictions from the trained recognition model.",
    color: "purple",
  },
  {
    icon: Brain,
    title: "Enhanced Neural Network",
    description:
      "Advanced deep learning architecture designed to provide accurate sign language classification.",
    color: "blue",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description:
      "Optimized inference delivers low-latency predictions for a smooth recognition experience.",
    color: "amber",
  },
];

const colorStyles = {
  indigo: {
    icon:
      "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400",
    glow:
      "bg-indigo-500/5 group-hover:bg-indigo-500/10",
    hover:
      "hover:border-indigo-300 dark:hover:border-indigo-500/30",
    title:
      "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
    arrow:
      "group-hover:text-indigo-500 dark:group-hover:text-indigo-400",
    accent:
      "bg-indigo-500",
  },

  purple: {
    icon:
      "border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400",
    glow:
      "bg-purple-500/5 group-hover:bg-purple-500/10",
    hover:
      "hover:border-purple-300 dark:hover:border-purple-500/30",
    title:
      "group-hover:text-purple-600 dark:group-hover:text-purple-400",
    arrow:
      "group-hover:text-purple-500 dark:group-hover:text-purple-400",
    accent:
      "bg-purple-500",
  },

  blue: {
    icon:
      "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
    glow:
      "bg-blue-500/5 group-hover:bg-blue-500/10",
    hover:
      "hover:border-blue-300 dark:hover:border-blue-500/30",
    title:
      "group-hover:text-blue-600 dark:group-hover:text-blue-400",
    arrow:
      "group-hover:text-blue-500 dark:group-hover:text-blue-400",
    accent:
      "bg-blue-500",
  },

  amber: {
    icon:
      "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
    glow:
      "bg-amber-500/5 group-hover:bg-amber-500/10",
    hover:
      "hover:border-amber-300 dark:hover:border-amber-500/30",
    title:
      "group-hover:text-amber-600 dark:group-hover:text-amber-400",
    arrow:
      "group-hover:text-amber-500 dark:group-hover:text-amber-400",
    accent:
      "bg-amber-500",
  },
};

const Features = () => {
  return (
    <section
      id="features"
      className="
        relative
        overflow-hidden

        bg-slate-50
        px-4
        py-20

        dark:bg-slate-950

        transition-colors
        duration-300

        sm:px-6
        sm:py-24
      "
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-20

          h-72
          w-72

          rounded-full

          bg-indigo-500/10

          blur-3xl

          dark:bg-indigo-500/5
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-10

          h-72
          w-72

          rounded-full

          bg-purple-500/10

          blur-3xl

          dark:bg-purple-500/5
        "
      />

      <div className="relative mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mx-auto max-w-2xl text-center">

          {/* LABEL */}

          <div
            className="
              mx-auto
              mb-4

              flex
              w-fit
              items-center
              gap-2

              rounded-full
              border

              px-3
              py-1.5

              text-xs
              font-semibold

              border-indigo-200
              bg-indigo-50
              text-indigo-600

              dark:border-indigo-500/20
              dark:bg-indigo-500/10
              dark:text-indigo-400
            "
          >
            <Brain size={14} />

            AI-Powered Technology
          </div>

          {/* TITLE */}

          <h2
            className="
              text-3xl
              font-bold
              tracking-tight

              text-slate-900

              dark:text-white

              sm:text-4xl
              lg:text-5xl
            "
          >
            Powerful Features
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              mt-4

              text-sm
              leading-7

              text-slate-500

              dark:text-slate-400

              sm:text-base
              sm:leading-8
            "
          >
            Everything you need for accurate, fast, and
            reliable sign language recognition.
          </p>
        </div>

        {/* =====================================================
            FEATURE CARDS
        ===================================================== */}

        <div
          className="
            mt-12

            grid
            grid-cols-1
            gap-5

            sm:grid-cols-2
            lg:grid-cols-4

            lg:mt-14
          "
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            const styles = colorStyles[feature.color];

            return (
              <div
                key={feature.title}
                className={`
                  group

                  relative
                  overflow-hidden

                  rounded-2xl

                  border

                  bg-white

                  p-6
                  sm:p-7

                  shadow-sm

                  transition-all
                  duration-500
                  ease-out

                  hover:-translate-y-2
                  hover:scale-[1.015]
                  hover:shadow-2xl

                  dark:bg-slate-900

                  ${styles.hover}
                `}
              >

                {/* =================================================
                    LARGE CARD GLOW
                ================================================= */}

                <div
                  className={`
                    pointer-events-none

                    absolute
                    -right-16
                    -top-16

                    h-40
                    w-40

                    rounded-full

                    blur-3xl

                    opacity-70

                    transition-all
                    duration-500

                    group-hover:scale-150
                    group-hover:opacity-100

                    ${styles.glow}
                  `}
                />

                {/* =================================================
                    SECONDARY GLOW
                ================================================= */}

                <div
                  className={`
                    pointer-events-none

                    absolute
                    -bottom-20
                    -left-20

                    h-36
                    w-36

                    rounded-full

                    blur-3xl

                    opacity-0

                    transition-opacity
                    duration-500

                    group-hover:opacity-60

                    ${styles.glow}
                  `}
                />

                <div className="relative">

                  {/* =================================================
                      ICON
                  ================================================= */}

                  <div
                    className={`
                      flex
                      h-14
                      w-14

                      items-center
                      justify-center

                      rounded-2xl

                      border

                      shadow-sm

                      transition-all
                      duration-500
                      ease-out

                      group-hover:scale-110
                      group-hover:-translate-y-1

                      group-hover:shadow-lg

                      ${styles.icon}
                    `}
                  >
                    <Icon
                      size={27}
                      strokeWidth={2}
                      className="
                        transition-transform
                        duration-500

                        group-hover:scale-110
                      "
                    />
                  </div>

                  {/* =================================================
                      TITLE + ARROW
                  ================================================= */}

                  <div
                    className="
                      mt-6

                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >
                    <h3
                      className={`
                        text-lg
                        font-semibold
                        leading-6

                        text-slate-900

                        transition-colors
                        duration-300

                        dark:text-white

                        ${styles.title}
                      `}
                    >
                      {feature.title}
                    </h3>

                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0

                        items-center
                        justify-center

                        rounded-lg

                        bg-slate-50

                        transition-all
                        duration-300

                        group-hover:bg-slate-100

                        dark:bg-slate-800
                        dark:group-hover:bg-slate-800
                      "
                    >
                      <ArrowUpRight
                        size={17}
                        className={`
                          text-slate-300

                          transition-all
                          duration-300

                          group-hover:-translate-y-0.5
                          group-hover:translate-x-0.5

                          dark:text-slate-600

                          ${styles.arrow}
                        `}
                      />
                    </div>
                  </div>

                  {/* =================================================
                      DESCRIPTION
                  ================================================= */}

                  <p
                    className="
                      mt-3

                      text-sm
                      leading-6

                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    {feature.description}
                  </p>

                  {/* =================================================
                      STATUS
                  ================================================= */}

                  <div
                    className="
                      mt-6

                      flex
                      items-center
                      gap-2

                      border-t

                      pt-4

                      border-slate-100

                      dark:border-slate-800
                    "
                  >
                    <CheckCircle2
                      size={15}
                      className="
                        text-emerald-500

                        transition-transform
                        duration-300

                        group-hover:scale-110
                      "
                    />

                    <span
                      className="
                        text-xs
                        font-medium

                        text-slate-500

                        dark:text-slate-500
                      "
                    >
                      Available
                    </span>
                  </div>

                </div>

                {/* =================================================
                    BOTTOM ACCENT
                ================================================= */}

                <div
                  className={`
                    absolute
                    bottom-0
                    left-0

                    h-1
                    w-0

                    transition-all
                    duration-500
                    ease-out

                    group-hover:w-full

                    ${styles.accent}
                  `}
                />

              </div>
            );
          })}
        </div>

        {/* =====================================================
            BOTTOM INFORMATION
        ===================================================== */}

        <div
          className="
            mx-auto

            mt-10

            flex
            max-w-3xl

            flex-col
            items-center
            justify-center

            gap-3

            rounded-2xl

            border

            px-5
            py-4

            text-center

            bg-white/70
            border-slate-200

            shadow-sm

            transition-all
            duration-300

            hover:border-indigo-200
            hover:shadow-md

            dark:border-slate-800
            dark:bg-slate-900/50

            dark:hover:border-indigo-500/20

            sm:flex-row
            sm:text-left
          "
        >

          {/* ICON */}

          <div
            className="
              flex
              h-9
              w-9
              shrink-0

              items-center
              justify-center

              rounded-xl

              bg-indigo-50
              text-indigo-600

              dark:bg-indigo-500/10
              dark:text-indigo-400
            "
          >
            <Zap size={17} />
          </div>

          {/* TEXT */}

          <p
            className="
              text-xs
              leading-5

              text-slate-500

              dark:text-slate-400
            "
          >
            SignAI combines computer vision and deep learning
            technologies to provide an efficient recognition
            experience.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Features;