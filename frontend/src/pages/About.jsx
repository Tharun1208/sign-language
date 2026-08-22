import {
  Info,
  Layers,
  Users,
  Sparkles,
  ArrowUpRight,
  Zap,
  Brain,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import TechStack from "../components/about/TechStack";
import TeamSection from "../components/about/TeamSection";
import ProjectOverview from "../components/about/ProjectOverview";

const About = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* =========================================
            PAGE HEADER
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
            shadow-slate-900/5
            transition-all
            duration-500

            hover:border-indigo-200
            hover:shadow-xl
            hover:shadow-indigo-500/5

            dark:border-slate-800
            dark:bg-slate-900
            dark:shadow-black/20

            dark:hover:border-indigo-500/20

            sm:rounded-[2rem]
          "
        >

          {/* =========================================
              BACKGROUND GRADIENT
          ========================================= */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-br
              from-indigo-500/[0.04]
              via-transparent
              to-purple-500/[0.04]

              dark:from-indigo-500/[0.08]
              dark:via-transparent
              dark:to-purple-500/[0.06]
            "
          />

          {/* =========================================
              GRID PATTERN
          ========================================= */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.035]

              dark:opacity-[0.04]

              [background-image:linear-gradient(#6366f1_1px,transparent_1px),linear-gradient(90deg,#6366f1_1px,transparent_1px)]
              [background-size:32px_32px]
            "
          />

          {/* =========================================
              TOP RIGHT GLOW
          ========================================= */}

          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-indigo-500/10
              blur-3xl
              transition-all
              duration-700

              group-hover:scale-125
              group-hover:bg-indigo-500/15

              dark:bg-indigo-500/10
              dark:group-hover:bg-indigo-500/15
            "
          />

          {/* =========================================
              BOTTOM LEFT GLOW
          ========================================= */}

          <div
            className="
              pointer-events-none
              absolute
              -bottom-28
              -left-28
              h-56
              w-56
              rounded-full
              bg-purple-500/5
              blur-3xl

              dark:bg-purple-500/10
            "
          />

          {/* =========================================
              DECORATIVE ORBS
          ========================================= */}

          <div
            className="
              pointer-events-none
              absolute
              right-10
              top-10
              h-2
              w-2
              rounded-full
              bg-indigo-500/40
              shadow-[0_0_20px_rgba(99,102,241,0.6)]
              animate-pulse
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              right-20
              top-24
              h-1.5
              w-1.5
              rounded-full
              bg-purple-500/40
              animate-pulse
              [animation-delay:500ms]
            "
          />

          {/* =========================================
              CONTENT
          ========================================= */}

          <div
            className="
              relative
              flex
              flex-col
              gap-8
              p-6

              sm:p-8
              lg:flex-row
              lg:items-center
              lg:justify-between
              lg:p-10
            "
          >

            {/* =====================================
                LEFT CONTENT
            ===================================== */}

            <div className="min-w-0 flex-1">

              {/* STATUS BADGE */}

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-indigo-200
                  bg-indigo-50
                  px-3.5
                  py-1.5
                  text-xs
                  font-semibold
                  text-indigo-600

                  dark:border-indigo-500/20
                  dark:bg-indigo-500/10
                  dark:text-indigo-400
                "
              >
                <span
                  className="
                    relative
                    flex
                    h-2
                    w-2
                  "
                >
                  <span
                    className="
                      absolute
                      inline-flex
                      h-full
                      w-full
                      animate-ping
                      rounded-full
                      bg-indigo-400
                      opacity-60
                    "
                  />

                  <span
                    className="
                      relative
                      inline-flex
                      h-2
                      w-2
                      rounded-full
                      bg-indigo-500
                    "
                  />
                </span>

                AI Recognition Platform

                <Sparkles
                  size={12}
                  className="text-indigo-500"
                />
              </div>

              {/* =====================================
                  ICON + TITLE
              ===================================== */}

              <div
                className="
                  flex
                  flex-col
                  gap-5

                  sm:flex-row
                  sm:items-center
                "
              >

                {/* ICON */}

                <div
                  className="
                    relative
                    flex
                    h-16
                    w-16
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-2xl
                    border
                    border-indigo-200
                    bg-gradient-to-br
                    from-indigo-50
                    to-purple-50
                    text-indigo-600
                    shadow-lg
                    shadow-indigo-500/10
                    transition-all
                    duration-500

                    group-hover:scale-105
                    group-hover:rotate-1
                    group-hover:shadow-xl
                    group-hover:shadow-indigo-500/15

                    dark:border-indigo-500/20
                    dark:from-indigo-500/10
                    dark:to-purple-500/10
                    dark:text-indigo-400
                  "
                >

                  {/* Icon Glow */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-br
                      from-indigo-500/10
                      to-transparent
                    "
                  />

                  <Brain
                    size={30}
                    className="
                      relative
                      z-10
                      transition-transform
                      duration-500
                      group-hover:scale-110
                    "
                  />

                  {/* Small Spark */}

                  <Sparkles
                    size={11}
                    className="
                      absolute
                      right-2
                      top-2
                      text-purple-500
                      transition-transform
                      duration-500
                      group-hover:rotate-12
                    "
                  />

                </div>

                {/* TITLE */}

                <div>

                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >

                    <h1
                      className="
                        text-3xl
                        font-extrabold
                        tracking-tight
                        text-slate-900

                        dark:text-white

                        sm:text-4xl
                        lg:text-[2.6rem]
                      "
                    >
                      About the Project
                    </h1>

                    <div
                      className="
                        hidden
                        h-8
                        w-px
                        bg-slate-200

                        dark:bg-slate-700

                        sm:block
                      "
                    />

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        bg-slate-100
                        px-2.5
                        py-1
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-500

                        dark:bg-slate-800
                        dark:text-slate-400
                      "
                    >
                      <Zap
                        size={11}
                        className="
                          text-amber-500
                        "
                      />

                      SignAI
                    </span>

                  </div>

                  <p
                    className="
                      mt-2
                      text-sm
                      font-medium
                      text-indigo-600

                      dark:text-indigo-400

                      sm:text-base
                    "
                  >
                    Intelligent sign language recognition,
                    powered by AI.
                  </p>

                </div>

              </div>

              {/* =====================================
                  DESCRIPTION
              ===================================== */}

              <p
                className="
                  mt-6
                  max-w-3xl
                  text-sm
                  leading-7
                  text-slate-500

                  dark:text-slate-400

                  sm:text-base
                  sm:leading-8
                "
              >
                Learn more about SignAI, its technology
                stack, development team, and the
                AI-powered approach used for real-time
                sign language recognition.
              </p>

              {/* =====================================
                  FEATURE MINI CARDS
              ===================================== */}

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  gap-2.5
                "
              >

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-slate-600

                    dark:border-slate-700
                    dark:bg-slate-800/70
                    dark:text-slate-300
                  "
                >
                  <Brain
                    size={14}
                    className="text-indigo-500"
                  />

                  AI Powered
                </div>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-slate-600

                    dark:border-slate-700
                    dark:bg-slate-800/70
                    dark:text-slate-300
                  "
                >
                  <Zap
                    size={14}
                    className="text-amber-500"
                  />

                  Real-Time Recognition
                </div>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-slate-600

                    dark:border-slate-700
                    dark:bg-slate-800/70
                    dark:text-slate-300
                  "
                >
                  <Sparkles
                    size={14}
                    className="text-purple-500"
                  />

                  Modern AI Stack
                </div>

              </div>

            </div>

            {/* =========================================
                RIGHT VISUAL
            ========================================= */}

            <div
              className="
                relative
                hidden
                shrink-0

                lg:block
              "
            >

              {/* Outer Glow */}

              <div
                className="
                  absolute
                  inset-0
                  rounded-3xl
                  bg-indigo-500/10
                  blur-2xl
                "
              />

              {/* Visual Card */}

              <div
                className="
                  relative
                  flex
                  h-48
                  w-48
                  items-center
                  justify-center
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white/80
                  shadow-xl
                  backdrop-blur-sm
                  transition-all
                  duration-500

                  group-hover:-translate-y-1
                  group-hover:shadow-2xl

                  dark:border-slate-700
                  dark:bg-slate-800/80
                "
              >

                {/* Rotating Ring */}

                <div
                  className="
                    absolute
                    h-32
                    w-32
                    rounded-full
                    border
                    border-dashed
                    border-indigo-300/50
                    transition-transform
                    duration-1000

                    group-hover:rotate-180

                    dark:border-indigo-400/20
                  "
                />

                {/* Inner Ring */}

                <div
                  className="
                    absolute
                    h-24
                    w-24
                    rounded-full
                    border
                    border-indigo-200
                    bg-indigo-50/70

                    dark:border-indigo-500/20
                    dark:bg-indigo-500/10
                  "
                />

                {/* Brain */}

                <Brain
                  size={42}
                  className="
                    relative
                    z-10
                    text-indigo-600
                    transition-transform
                    duration-500

                    group-hover:scale-110

                    dark:text-indigo-400
                  "
                />

                {/* Floating Spark */}

                <div
                  className="
                    absolute
                    right-5
                    top-5
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-purple-50
                    text-purple-500
                    shadow-sm

                    dark:bg-purple-500/10
                    dark:text-purple-400

                    animate-bounce
                    [animation-duration:3s]
                  "
                >
                  <Sparkles size={15} />
                </div>

                {/* Arrow */}

                <div
                  className="
                    absolute
                    bottom-5
                    left-5
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-indigo-50
                    text-indigo-500

                    dark:bg-indigo-500/10
                    dark:text-indigo-400
                  "
                >
                  <ArrowUpRight size={16} />
                </div>

              </div>

            </div>

          </div>

          {/* =========================================
              BOTTOM ACCENT
          ========================================= */}

          <div
            className="
              absolute
              bottom-0
              left-0
              h-1
              w-0
              bg-gradient-to-r
              from-indigo-500
              via-purple-500
              to-blue-500
              transition-all
              duration-700

              group-hover:w-full
            "
          />

        </section>

        {/* =========================================
            PROJECT OVERVIEW
        ========================================= */}

        <ProjectOverview />

        {/* =========================================
            TECHNOLOGY + TEAM
        ========================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-8
            lg:grid-cols-2
          "
        >

          {/* Technology Stack */}

          <div className="min-w-0">
            <TechStack />
          </div>

          {/* Development Team */}

          <div className="min-w-0">
            <TeamSection />
          </div>

        </div>

        {/* =========================================
            PROJECT INFORMATION
        ========================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-3
          "
        >

          {/* AI */}

          <div
            className="
              group
              rounded-2xl
              border
              p-5
              border-slate-200
              bg-white
              dark:border-slate-800
              dark:bg-slate-900
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-indigo-300
              hover:shadow-lg
              hover:shadow-indigo-500/5
              dark:hover:border-indigo-500/30
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-indigo-50
                text-indigo-600
                dark:bg-indigo-500/10
                dark:text-indigo-400
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              <Sparkles size={19} />
            </div>

            <h3
              className="
                mt-4
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              AI Powered
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              Enhanced neural network technology for
              gesture recognition.
            </p>
          </div>

          {/* Technology */}

          <div
            className="
              group
              rounded-2xl
              border
              p-5
              border-slate-200
              bg-white
              dark:border-slate-800
              dark:bg-slate-900
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-purple-300
              hover:shadow-lg
              hover:shadow-purple-500/5
              dark:hover:border-purple-500/30
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-purple-50
                text-purple-600
                dark:bg-purple-500/10
                dark:text-purple-400
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              <Layers size={19} />
            </div>

            <h3
              className="
                mt-4
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              Modern Technology
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              Built using React, Python, TensorFlow,
              OpenCV and FastAPI.
            </p>
          </div>

          {/* Team */}

          <div
            className="
              group
              rounded-2xl
              border
              p-5
              border-slate-200
              bg-white
              dark:border-slate-800
              dark:bg-slate-900
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-emerald-300
              hover:shadow-lg
              hover:shadow-emerald-500/5
              dark:hover:border-emerald-500/30
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-emerald-50
                text-emerald-600
                dark:bg-emerald-500/10
                dark:text-emerald-400
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              <Users size={19} />
            </div>

            <h3
              className="
                mt-4
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              Development Team
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              A collaborative team working across frontend,
              backend and AI model development.
            </p>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default About;