import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

import {
  Brain,
  ArrowUpRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="
        relative
        overflow-hidden

        border-t

        border-slate-200
        bg-white

        dark:border-slate-800
        dark:bg-slate-950

        transition-colors
        duration-300
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
          -top-32

          h-72
          w-72

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
          -bottom-32

          h-72
          w-72

          rounded-full

          bg-purple-500/5

          blur-3xl

          dark:bg-purple-500/5
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div
        className="
          relative

          mx-auto
          max-w-7xl

          px-5
          py-12

          sm:px-6
          sm:py-14

          lg:px-8
          lg:py-16
        "
      >

        {/* =====================================================
            MAIN FOOTER CONTENT
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            gap-10

            md:flex-row
            md:items-start
            md:justify-between
          "
        >

          {/* =================================================
              BRAND SECTION
          ================================================= */}

          <div className="max-w-lg">

            {/* BRAND */}

            <div
              className="
                group
                flex
                w-fit
                items-center
                gap-3
              "
            >

              {/* LOGO */}

              <div
                className="
                  flex
                  h-11
                  w-11

                  items-center
                  justify-center

                  rounded-xl

                  border

                  border-indigo-200
                  bg-indigo-50
                  text-indigo-600

                  shadow-sm

                  transition-all
                  duration-300

                  group-hover:-translate-y-0.5
                  group-hover:scale-105
                  group-hover:border-indigo-300
                  group-hover:shadow-lg
                  group-hover:shadow-indigo-500/10

                  dark:border-indigo-500/20
                  dark:bg-indigo-500/10
                  dark:text-indigo-400

                  dark:group-hover:border-indigo-500/30
                "
              >
                <Brain
                  size={22}
                  strokeWidth={2}
                />
              </div>

              {/* NAME */}

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    tracking-tight

                    text-slate-900

                    dark:text-white
                  "
                >
                  SignAI
                </h2>

                <p
                  className="
                    mt-0.5

                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]

                    text-indigo-500

                    dark:text-indigo-400
                  "
                >
                  Intelligent Recognition
                </p>

              </div>

            </div>

            {/* DESCRIPTION */}

            <p
              className="
                mt-5

                max-w-md

                text-sm
                leading-7

                text-slate-500

                dark:text-slate-400
              "
            >
              An AI-powered sign language recognition
              platform designed to translate hand gestures
              into readable text using modern computer
              vision and deep learning technologies.
            </p>

            {/* SMALL ACCENT */}

            <div
              className="
                mt-6

                flex
                items-center
                gap-2
              "
            >

              <span
                className="
                  h-1.5
                  w-1.5

                  rounded-full

                  bg-emerald-500
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
                AI-powered recognition system
              </span>

            </div>

          </div>

          {/* =================================================
              SOCIAL SECTION
          ================================================= */}

          <div
            className="
              md:min-w-[220px]
            "
          >

            <h3
              className="
                text-sm
                font-semibold

                text-slate-900

                dark:text-white
              "
            >
              Connect With Us
            </h3>

            <p
              className="
                mt-1.5

                text-xs
                leading-5

                text-slate-500

                dark:text-slate-500
              "
            >
              Follow the project and stay connected.
            </p>

            {/* SOCIAL BUTTONS */}

            <div
              className="
                mt-5

                flex
                items-center
                gap-3
              "
            >

              {/* =================================================
                  GITHUB
              ================================================= */}

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="
                  group/social

                  flex
                  h-11
                  w-11

                  items-center
                  justify-center

                  rounded-xl

                  border

                  border-slate-200
                  bg-slate-50
                  text-slate-600

                  shadow-sm

                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:border-slate-300
                  hover:bg-slate-100
                  hover:text-slate-900
                  hover:shadow-md

                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:text-slate-400

                  dark:hover:border-slate-700
                  dark:hover:bg-slate-800
                  dark:hover:text-white
                "
              >
                <FaGithub
                  size={19}
                  className="
                    transition-transform
                    duration-300

                    group-hover/social:scale-110
                  "
                />
              </a>

              {/* =================================================
                  LINKEDIN
              ================================================= */}

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="
                  group/social

                  flex
                  h-11
                  w-11

                  items-center
                  justify-center

                  rounded-xl

                  border

                  border-slate-200
                  bg-slate-50
                  text-slate-600

                  shadow-sm

                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:border-blue-200
                  hover:bg-blue-50
                  hover:text-blue-600
                  hover:shadow-md
                  hover:shadow-blue-500/10

                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:text-slate-400

                  dark:hover:border-blue-500/30
                  dark:hover:bg-blue-500/10
                  dark:hover:text-blue-400
                "
              >
                <FaLinkedin
                  size={19}
                  className="
                    transition-transform
                    duration-300

                    group-hover/social:scale-110
                  "
                />
              </a>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <a
                href="mailto:contact@signai.com"
                aria-label="Email"
                className="
                  group/social

                  flex
                  h-11
                  w-11

                  items-center
                  justify-center

                  rounded-xl

                  border

                  border-slate-200
                  bg-slate-50
                  text-slate-600

                  shadow-sm

                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:border-indigo-200
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
                "
              >
                <FaEnvelope
                  size={18}
                  className="
                    transition-transform
                    duration-300

                    group-hover/social:scale-110
                  "
                />
              </a>

            </div>

          </div>

        </div>

        {/* =====================================================
            DIVIDER
        ===================================================== */}

        <div
          className="
            my-10

            h-px

            bg-gradient-to-r
            from-transparent
            via-slate-200
            to-transparent

            dark:via-slate-800
          "
        />

        {/* =====================================================
            BOTTOM SECTION
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            gap-4

            text-xs

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          {/* COPYRIGHT */}

          <p
            className="
              text-slate-500

              dark:text-slate-500
            "
          >
            © 2026 SignAI. All rights reserved.
          </p>

          {/* PROJECT TAG */}

          <div
            className="
              flex
              items-center
              gap-2

              rounded-full

              border

              border-slate-200
              bg-slate-50

              px-3
              py-1.5

              text-slate-500

              transition-all
              duration-300

              hover:border-indigo-200
              hover:text-indigo-600

              dark:border-slate-800
              dark:bg-slate-900
              dark:text-slate-500

              dark:hover:border-indigo-500/20
              dark:hover:text-indigo-400
            "
          >

            <span>
              AI-powered sign language recognition
            </span>

            <ArrowUpRight
              size={13}
              className="
                text-indigo-500

                transition-transform
                duration-300
              "
            />

          </div>

        </div>

      </div>

      {/* =====================================================
          BOTTOM ACCENT LINE
      ===================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          h-0.5
          w-full

          bg-gradient-to-r
          from-transparent
          via-indigo-500
          to-transparent

          opacity-60
        "
      />

    </footer>
  );
};

export default Footer;