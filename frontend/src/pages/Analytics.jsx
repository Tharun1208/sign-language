import {
  BarChart3,
  Database,
  Activity,
  Sparkles,
  Trees,
  Target,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import ModelPerformance from "../components/analytics/ModelPerformance";
import DatasetStats from "../components/analytics/DataSetStats";

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* =========================================
            PAGE HEADER
        ========================================= */}
        <div
          className="
            group
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
            hover:-translate-y-1
            hover:border-indigo-300
            hover:shadow-xl
            hover:shadow-indigo-500/10
            dark:hover:border-indigo-500/30
            dark:hover:shadow-indigo-500/5
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
              h-56
              w-56
              rounded-full
              bg-indigo-500/10
              blur-3xl
              transition-transform
              duration-500
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
              bg-purple-500/5
              blur-3xl
              transition-transform
              duration-500
              group-hover:scale-125
            "
          />

          <div className="relative">
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
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:rotate-3
                group-hover:shadow-lg
                group-hover:shadow-indigo-500/20
              "
            >
              <BarChart3 size={24} />
            </div>

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
                Dataset & Analytics
              </h1>

              <Sparkles
                size={18}
                className="
                  text-indigo-500
                  transition-transform
                  duration-300
                  group-hover:rotate-12
                  group-hover:scale-125
                "
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
              Monitor the performance of the SignAI Random Forest
              recognition model and explore the dataset used to
              train and evaluate the system.
            </p>
          </div>
        </div>

        {/* =========================================
            QUICK ANALYTICS CARDS
        ========================================= */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          {/* TEST ACCURACY */}
          <div
            className="
              group
              rounded-2xl
              border
              p-5
              border-emerald-200
              bg-white
              dark:border-emerald-500/20
              dark:bg-slate-900
              transition-all
              duration-300
              hover:-translate-y-2
              hover:scale-[1.02]
              hover:border-emerald-400
              hover:shadow-xl
              hover:shadow-emerald-500/10
              dark:hover:border-emerald-500/40
              dark:hover:shadow-emerald-500/10
              cursor-default
            "
          >
            <div className="flex items-center justify-between">
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
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:rotate-6
                "
              >
                <Target size={19} />
              </div>

              <span
                className="
                  rounded-full
                  bg-emerald-50
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-emerald-600
                  dark:bg-emerald-500/10
                  dark:text-emerald-400
                  transition-all
                  duration-300
                  group-hover:scale-105
                "
              >
                Test
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              Test Accuracy
            </p>

            <h2
              className="
                mt-1
                text-2xl
                font-bold
                text-emerald-600
                dark:text-emerald-400
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              93.63%
            </h2>
          </div>

          {/* VALIDATION ACCURACY */}
          <div
            className="
              group
              rounded-2xl
              border
              p-5
              border-indigo-200
              bg-white
              dark:border-indigo-500/20
              dark:bg-slate-900
              transition-all
              duration-300
              hover:-translate-y-2
              hover:scale-[1.02]
              hover:border-indigo-400
              hover:shadow-xl
              hover:shadow-indigo-500/10
              dark:hover:border-indigo-500/40
              dark:hover:shadow-indigo-500/10
              cursor-default
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
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:rotate-6
              "
            >
              <Activity size={19} />
            </div>

            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              Validation Accuracy
            </p>

            <h2
              className="
                mt-1
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              89.55%
            </h2>
          </div>

          {/* MODEL */}
          <div
            className="
              group
              rounded-2xl
              border
              p-5
              border-purple-200
              bg-white
              dark:border-purple-500/20
              dark:bg-slate-900
              transition-all
              duration-300
              hover:-translate-y-2
              hover:scale-[1.02]
              hover:border-purple-400
              hover:shadow-xl
              hover:shadow-purple-500/10
              dark:hover:border-purple-500/40
              dark:hover:shadow-purple-500/10
              cursor-default
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
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:rotate-6
              "
            >
              <Trees size={19} />
            </div>

            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              Model
            </p>

            <h2
              className="
                mt-1
                text-xl
                font-bold
                text-slate-900
                dark:text-white
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              Random Forest
            </h2>
          </div>

          {/* GESTURE CLASSES */}
          <div
            className="
              group
              rounded-2xl
              border
              p-5
              border-blue-200
              bg-white
              dark:border-blue-500/20
              dark:bg-slate-900
              transition-all
              duration-300
              hover:-translate-y-2
              hover:scale-[1.02]
              hover:border-blue-400
              hover:shadow-xl
              hover:shadow-blue-500/10
              dark:hover:border-blue-500/40
              dark:hover:shadow-blue-500/10
              cursor-default
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
                bg-blue-50
                text-blue-600
                dark:bg-blue-500/10
                dark:text-blue-400
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:rotate-6
              "
            >
              <BarChart3 size={19} />
            </div>

            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              Gesture Classes
            </p>

            <h2
              className="
                mt-1
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              26
            </h2>
          </div>
        </div>

        {/* =========================================
            MODEL INFORMATION
        ========================================= */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-3
          "
        >

          {/* TREES */}
          <div
            className="
              group
              flex
              items-center
              gap-4
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
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-indigo-50
                text-indigo-600
                dark:bg-indigo-500/10
                dark:text-indigo-400
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:rotate-6
              "
            >
              <Trees size={21} />
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Number of Trees
              </p>

              <p
                className="
                  mt-1
                  text-xl
                  font-bold
                  text-slate-900
                  dark:text-white
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                300
              </p>
            </div>
          </div>

          {/* FEATURES */}
          <div
            className="
              group
              flex
              items-center
              gap-4
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
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-purple-50
                text-purple-600
                dark:bg-purple-500/10
                dark:text-purple-400
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:rotate-6
              "
            >
              <Database size={21} />
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Input Features
              </p>

              <p
                className="
                  mt-1
                  text-xl
                  font-bold
                  text-slate-900
                  dark:text-white
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                63
              </p>
            </div>
          </div>

          {/* STATUS */}
          <div
            className="
              group
              flex
              items-center
              gap-4
              rounded-2xl
              border
              p-5
              border-emerald-200
              bg-emerald-50/50
              dark:border-emerald-500/20
              dark:bg-emerald-500/5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-emerald-400
              hover:shadow-lg
              hover:shadow-emerald-500/10
              dark:hover:border-emerald-500/30
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
                dark:bg-emerald-500/10
                dark:text-emerald-400
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:rotate-6
              "
            >
              <CheckCircle2 size={21} />
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Model Status
              </p>

              <p
                className="
                  mt-1
                  text-xl
                  font-bold
                  text-emerald-600
                  dark:text-emerald-400
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                Ready
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            ANALYTICS CONTENT
        ========================================= */}
        <div
          className="
            grid
            grid-cols-1
            gap-8
            xl:grid-cols-2
          "
        >
          <div
            className="
              min-w-0
              rounded-2xl
              transition-all
              duration-300
              hover:-translate-y-1
            "
          >
            <ModelPerformance />
          </div>

          <div
            className="
              min-w-0
              rounded-2xl
              transition-all
              duration-300
              hover:-translate-y-1
            "
          >
            <DatasetStats />
          </div>
        </div>

        {/* =========================================
            DATASET SUMMARY
        ========================================= */}
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
            sm:p-6
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-indigo-300
            hover:shadow-xl
            hover:shadow-indigo-500/5
            dark:hover:border-indigo-500/30
            dark:hover:shadow-indigo-500/5
          "
        >
          <div className="flex items-center gap-3">
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
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:rotate-6
              "
            >
              <Database size={19} />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Dataset Summary
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Actual dataset used for model development
              </p>
            </div>
          </div>

          <div
            className="
              mt-5
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >

            {/* TRAINING */}
            <div
              className="
                group/sample
                rounded-xl
                border
                p-4
                border-slate-200
                bg-slate-50
                dark:border-slate-800
                dark:bg-slate-950/50
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-300
                hover:bg-indigo-50/50
                hover:shadow-md
                dark:hover:border-indigo-500/30
                dark:hover:bg-indigo-500/5
              "
            >
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Training Images
              </p>

              <p
                className="
                  mt-1
                  text-lg
                  font-bold
                  text-slate-900
                  dark:text-white
                  transition-transform
                  duration-300
                  group-hover/sample:translate-x-1
                "
              >
                18,198
              </p>
            </div>

            {/* VALIDATION */}
            <div
              className="
                group/sample
                rounded-xl
                border
                p-4
                border-slate-200
                bg-slate-50
                dark:border-slate-800
                dark:bg-slate-950/50
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-300
                hover:bg-indigo-50/50
                hover:shadow-md
                dark:hover:border-indigo-500/30
                dark:hover:bg-indigo-500/5
              "
            >
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Validation Images
              </p>

              <p
                className="
                  mt-1
                  text-lg
                  font-bold
                  text-slate-900
                  dark:text-white
                  transition-transform
                  duration-300
                  group-hover/sample:translate-x-1
                "
              >
                2,579
              </p>
            </div>

            {/* TESTING */}
            <div
              className="
                group/sample
                rounded-xl
                border
                p-4
                border-slate-200
                bg-slate-50
                dark:border-slate-800
                dark:bg-slate-950/50
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-300
                hover:bg-indigo-50/50
                hover:shadow-md
                dark:hover:border-indigo-500/30
                dark:hover:bg-indigo-500/5
              "
            >
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Testing Images
              </p>

              <p
                className="
                  mt-1
                  text-lg
                  font-bold
                  text-slate-900
                  dark:text-white
                  transition-transform
                  duration-300
                  group-hover/sample:translate-x-1
                "
              >
                5,200
              </p>
            </div>

            {/* TOTAL */}
            <div
              className="
                group/sample
                rounded-xl
                border
                p-4
                border-indigo-200
                bg-indigo-50/50
                dark:border-indigo-500/20
                dark:bg-indigo-500/5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-400
                hover:bg-indigo-100/60
                hover:shadow-md
                hover:shadow-indigo-500/10
                dark:hover:border-indigo-500/40
                dark:hover:bg-indigo-500/10
              "
            >
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total Images
              </p>

              <p
                className="
                  mt-1
                  text-lg
                  font-bold
                  text-indigo-600
                  dark:text-indigo-400
                  transition-transform
                  duration-300
                  group-hover/sample:translate-x-1
                "
              >
                25,977
              </p>
            </div>
          </div>

          {/* USABLE SAMPLES */}
          <div
            className="
              mt-4
              flex
              items-center
              gap-2
              text-xs
              text-slate-500
              dark:text-slate-400
              transition-all
              duration-300
              group-hover:translate-x-1
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

            <span>
              23,156 usable samples with detected hand landmarks
              across 26 classes.
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;