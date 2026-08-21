import {
  Camera,
  Settings2,
  Brain,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Capture",
    desc: "Capture hand gestures using your webcam for real-time recognition.",
    color: "indigo",
  },
  {
    number: "02",
    icon: Settings2,
    title: "Preprocessing",
    desc: "MediaPipe detects and extracts important hand landmarks from the input.",
    color: "purple",
  },
  {
    number: "03",
    icon: Brain,
    title: "Neural Network",
    desc: "The enhanced neural network analyzes the landmarks and predicts the gesture.",
    color: "blue",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Output",
    desc: "The recognized gesture is converted into readable text instantly.",
    color: "emerald",
  },
];

const colorStyles = {
  indigo: {
    icon:
      "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400",

    glow:
      "bg-indigo-500/5 group-hover:bg-indigo-500/10",

    border:
      "hover:border-indigo-300 dark:hover:border-indigo-500/30",

    title:
      "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",

    number:
      "text-indigo-500",

    arrow:
      "group-hover:text-indigo-500 dark:group-hover:text-indigo-400",

    accent:
      "bg-indigo-500",

    status:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  },

  purple: {
    icon:
      "border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400",

    glow:
      "bg-purple-500/5 group-hover:bg-purple-500/10",

    border:
      "hover:border-purple-300 dark:hover:border-purple-500/30",

    title:
      "group-hover:text-purple-600 dark:group-hover:text-purple-400",

    number:
      "text-purple-500",

    arrow:
      "group-hover:text-purple-500 dark:group-hover:text-purple-400",

    accent:
      "bg-purple-500",

    status:
      "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  },

  blue: {
    icon:
      "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",

    glow:
      "bg-blue-500/5 group-hover:bg-blue-500/10",

    border:
      "hover:border-blue-300 dark:hover:border-blue-500/30",

    title:
      "group-hover:text-blue-600 dark:group-hover:text-blue-400",

    number:
      "text-blue-500",

    arrow:
      "group-hover:text-blue-500 dark:group-hover:text-blue-400",

    accent:
      "bg-blue-500",

    status:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },

  emerald: {
    icon:
      "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",

    glow:
      "bg-emerald-500/5 group-hover:bg-emerald-500/10",

    border:
      "hover:border-emerald-300 dark:hover:border-emerald-500/30",

    title:
      "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",

    number:
      "text-emerald-500",

    arrow:
      "group-hover:text-emerald-500 dark:group-hover:text-emerald-400",

    accent:
      "bg-emerald-500",

    status:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
};

const Workflow = () => {
  return (
    <section
      className="
        relative
        overflow-hidden

        bg-white
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
          left-1/2
          top-0

          h-80
          w-80

          -translate-x-1/2

          rounded-full

          bg-indigo-500/5

          blur-3xl

          dark:bg-indigo-500/5
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-0

          h-72
          w-72

          rounded-full

          bg-purple-500/10

          blur-3xl

          dark:bg-purple-500/5
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-1/2

          h-64
          w-64

          rounded-full

          bg-blue-500/5

          blur-3xl
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

            Recognition Process
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
            How It Works
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
            SignAI processes hand gestures through a simple
            four-step recognition pipeline.
          </p>
        </div>

        {/* =====================================================
            WORKFLOW
        ===================================================== */}

        <div
          className="
            relative

            mt-14

            grid
            grid-cols-1
            gap-5

            sm:grid-cols-2

            lg:grid-cols-4
            lg:gap-6
          "
        >

          {/* =================================================
              CONNECTING LINE
          ================================================= */}

          <div
            className="
              pointer-events-none

              absolute

              left-[12%]
              right-[12%]
              top-[76px]

              hidden

              h-px

              bg-gradient-to-r
              from-indigo-200
              via-purple-200
              to-emerald-200

              dark:from-indigo-500/20
              dark:via-purple-500/20
              dark:to-emerald-500/20

              lg:block
            "
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const styles = colorStyles[step.color];

            return (
              <div
                key={step.title}
                className={`
                  group

                  relative
                  overflow-hidden

                  rounded-2xl

                  border

                  bg-slate-50

                  p-6
                  sm:p-7

                  shadow-sm

                  transition-all
                  duration-500
                  ease-out

                  hover:-translate-y-2
                  hover:scale-[1.015]
                  hover:bg-white
                  hover:shadow-2xl

                  dark:border-slate-800
                  dark:bg-slate-900

                  dark:hover:bg-slate-900

                  ${styles.border}
                `}
              >

                {/* =================================================
                    CARD GLOW
                ================================================= */}

                <div
                  className={`
                    pointer-events-none

                    absolute
                    -right-14
                    -top-14

                    h-36
                    w-36

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
                    -bottom-16
                    -left-16

                    h-32
                    w-32

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
                      TOP ROW
                  ================================================= */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    {/* STEP NUMBER */}

                    <div className="flex items-center gap-2">

                      <span
                        className={`
                          text-xs
                          font-bold
                          tracking-[0.18em]

                          transition-all
                          duration-300

                          group-hover:tracking-[0.22em]

                          ${styles.number}
                        `}
                      >
                        STEP
                      </span>

                      <span
                        className="
                          text-xs
                          font-bold
                          tracking-widest

                          text-slate-400

                          dark:text-slate-600
                        "
                      >
                        {step.number}
                      </span>

                    </div>

                    {/* ARROW */}

                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center

                        rounded-lg

                        bg-white

                        shadow-sm

                        transition-all
                        duration-300

                        group-hover:translate-x-1

                        dark:bg-slate-800
                      "
                    >
                      <ArrowRight
                        size={17}
                        className={`
                          text-slate-300

                          transition-colors
                          duration-300

                          dark:text-slate-600

                          ${styles.arrow}
                        `}
                      />
                    </div>

                  </div>

                  {/* =================================================
                      ICON
                  ================================================= */}

                  <div
                    className={`
                      relative
                      z-10

                      mt-6

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

                      group-hover:-translate-y-1
                      group-hover:scale-110
                      group-hover:shadow-lg

                      ${styles.icon}
                    `}
                  >
                    <Icon
                      size={26}
                      strokeWidth={2}
                      className="
                        transition-transform
                        duration-500

                        group-hover:scale-110
                      "
                    />
                  </div>

                  {/* =================================================
                      TITLE
                  ================================================= */}

                  <h3
                    className={`
                      mt-6

                      text-lg
                      font-semibold

                      text-slate-900

                      transition-colors
                      duration-300

                      dark:text-white

                      ${styles.title}
                    `}
                  >
                    {step.title}
                  </h3>

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
                    {step.desc}
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

                      border-slate-200

                      dark:border-slate-800
                    "
                  >

                    <span
                      className={`
                        flex
                        h-5
                        w-5

                        items-center
                        justify-center

                        rounded-full

                        transition-transform
                        duration-300

                        group-hover:scale-110

                        ${styles.status}
                      `}
                    >
                      <CheckCircle2 size={12} />
                    </span>

                    <span
                      className="
                        text-xs
                        font-medium

                        text-slate-500

                        dark:text-slate-500
                      "
                    >
                      Process ready
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

            items-center
            justify-center

            gap-3

            rounded-2xl

            border

            bg-slate-50

            px-5
            py-4

            text-center

            shadow-sm

            transition-all
            duration-300

            hover:border-indigo-200
            hover:shadow-md

            border-slate-200

            dark:border-slate-800
            dark:bg-slate-900/50

            dark:hover:border-indigo-500/20

            sm:px-6
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

              rounded-xl

              bg-emerald-50
              text-emerald-600

              dark:bg-emerald-500/10
              dark:text-emerald-400
            "
          >
            <CheckCircle2 size={17} />
          </div>

          <p
            className="
              text-xs
              leading-5

              text-slate-500

              dark:text-slate-400
            "
          >
            From gesture capture to translated text, the
            entire recognition pipeline is designed for
            fast and accurate processing.
          </p>

        </div>

      </div>
    </section>
  );
};

export default Workflow;