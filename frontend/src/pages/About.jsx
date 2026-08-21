import {
  Info,
  Layers,
  Users,
  Sparkles,
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

        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            p-6

            border-slate-200
            bg-white

            dark:border-slate-800
            dark:bg-slate-900

            transition-all
            duration-300

            sm:p-8
          "
        >
          {/* Background Decoration */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-48
              w-48
              rounded-full
              bg-indigo-500/10
              blur-3xl
            "
          />

          <div className="relative">

            {/* Icon */}

            <div
              className="
                mb-5
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl

                border
                border-indigo-200
                bg-indigo-50
                text-indigo-600

                dark:border-indigo-500/20
                dark:bg-indigo-500/10
                dark:text-indigo-400
              "
            >
              <Info size={24} />
            </div>

            {/* Heading */}

            <div className="flex flex-wrap items-center gap-2">

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
                About the Project
              </h1>

              <Sparkles
                size={19}
                className="text-indigo-500"
              />

            </div>

            <p
              className="
                mt-3
                max-w-3xl
                text-sm
                leading-7

                text-slate-500

                dark:text-slate-400

                sm:text-base
                sm:leading-8
              "
            >
              Learn more about SignAI, its technology stack,
              development team, and the AI-powered approach
              used for real-time sign language recognition.
            </p>

          </div>
        </div>

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