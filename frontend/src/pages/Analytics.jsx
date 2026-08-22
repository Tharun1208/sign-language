import {
  BarChart3,
  Database,
  Activity,
  Sparkles,
  Trees,
  Target,
  CheckCircle2,
  TrendingUp,
  Brain,
  Layers3,
  Image,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import ModelPerformance from "../components/analytics/ModelPerformance";
import DatasetStats from "../components/analytics/DataSetStats";

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <section
          className="
            group
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            px-6
            py-7
            shadow-sm
            transition-all
            duration-300
            hover:border-indigo-300
            hover:shadow-xl
            hover:shadow-indigo-500/5
            dark:border-slate-800
            dark:bg-slate-900
            dark:hover:border-indigo-500/30
            sm:px-8
            sm:py-9
          "
        >
          {/* Background glow */}

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
              transition-transform
              duration-700
              group-hover:scale-125
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              left-1/3
              h-56
              w-56
              rounded-full
              bg-purple-500/5
              blur-3xl
            "
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}

            <div className="max-w-3xl">

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-indigo-50
                    text-indigo-600
                    ring-1
                    ring-indigo-100
                    transition-all
                    duration-300
                    group-hover:scale-105
                    group-hover:rotate-2
                    dark:bg-indigo-500/10
                    dark:text-indigo-400
                    dark:ring-indigo-500/20
                  "
                >
                  <BarChart3 size={27} />
                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h1
                      className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-slate-900
                        dark:text-white
                        sm:text-3xl
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
                      "
                    />

                  </div>

                  <div className="mt-1 flex items-center gap-2">

                    <span
                      className="
                        h-2
                        w-2
                        rounded-full
                        bg-emerald-500
                        shadow-sm
                        shadow-emerald-500/50
                      "
                    />

                    <span
                      className="
                        text-xs
                        font-medium
                        text-emerald-600
                        dark:text-emerald-400
                      "
                    >
                      Model ready
                    </span>

                  </div>

                </div>

              </div>

              <p
                className="
                  mt-5
                  text-sm
                  leading-7
                  text-slate-500
                  dark:text-slate-400
                  sm:text-base
                "
              >
                Monitor the performance of the SignAI Random Forest
                recognition model and explore the dataset used to
                train, validate and evaluate the system.
              </p>

            </div>

            {/* RIGHT SUMMARY */}

            <div
              className="
                hidden
                shrink-0
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                dark:border-slate-800
                dark:bg-slate-950/50
                lg:flex
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-50
                  text-emerald-600
                  dark:bg-emerald-500/10
                  dark:text-emerald-400
                "
              >
                <TrendingUp size={18} />
              </div>

              <div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Test Accuracy
                </p>

                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  93.63%
                </p>

              </div>
            </div>

          </div>
        </section>


        {/* =====================================================
            QUICK METRICS
        ===================================================== */}

        <section
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >

          {/* TEST ACCURACY */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-emerald-200
              bg-white
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-emerald-400
              hover:shadow-xl
              hover:shadow-emerald-500/10
              dark:border-emerald-500/20
              dark:bg-slate-900
              dark:hover:border-emerald-500/40
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-8
                -top-8
                h-24
                w-24
                rounded-full
                bg-emerald-500/10
                blur-2xl
                transition-transform
                duration-500
                group-hover:scale-150
              "
            />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-emerald-50
                    text-emerald-600
                    transition-transform
                    duration-300
                    group-hover:scale-110
                    dark:bg-emerald-500/10
                    dark:text-emerald-400
                  "
                >
                  <Target size={20} />
                </div>

                <span
                  className="
                    rounded-full
                    bg-emerald-50
                    px-2.5
                    py-1
                    text-[11px]
                    font-semibold
                    text-emerald-600
                    dark:bg-emerald-500/10
                    dark:text-emerald-400
                  "
                >
                  Test
                </span>

              </div>

              <p className="mt-5 text-xs font-medium text-slate-500 dark:text-slate-400">
                Test Accuracy
              </p>

              <div className="mt-1 flex items-end justify-between gap-3">

                <h2
                  className="
                    text-3xl
                    font-bold
                    tracking-tight
                    text-emerald-600
                    dark:text-emerald-400
                  "
                >
                  93.63%
                </h2>

                <TrendingUp
                  size={20}
                  className="mb-1 text-emerald-500"
                />

              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-500/10">

                <div
                  className="
                    h-full
                    w-[93.63%]
                    rounded-full
                    bg-emerald-500
                  "
                />

              </div>

            </div>
          </div>


          {/* VALIDATION ACCURACY */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-indigo-200
              bg-white
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-indigo-400
              hover:shadow-xl
              hover:shadow-indigo-500/10
              dark:border-indigo-500/20
              dark:bg-slate-900
              dark:hover:border-indigo-500/40
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-8
                -top-8
                h-24
                w-24
                rounded-full
                bg-indigo-500/10
                blur-2xl
                transition-transform
                duration-500
                group-hover:scale-150
              "
            />

            <div className="relative">

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-50
                  text-indigo-600
                  transition-transform
                  duration-300
                  group-hover:scale-110
                  dark:bg-indigo-500/10
                  dark:text-indigo-400
                "
              >
                <Activity size={20} />
              </div>

              <p className="mt-5 text-xs font-medium text-slate-500 dark:text-slate-400">
                Validation Accuracy
              </p>

              <h2
                className="
                  mt-1
                  text-3xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                "
              >
                89.55%
              </h2>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-500/10">

                <div
                  className="
                    h-full
                    w-[89.55%]
                    rounded-full
                    bg-indigo-500
                  "
                />

              </div>

            </div>
          </div>


          {/* MODEL */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-purple-200
              bg-white
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-purple-400
              hover:shadow-xl
              hover:shadow-purple-500/10
              dark:border-purple-500/20
              dark:bg-slate-900
              dark:hover:border-purple-500/40
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-purple-50
                text-purple-600
                transition-transform
                duration-300
                group-hover:scale-110
                dark:bg-purple-500/10
                dark:text-purple-400
              "
            >
              <Trees size={20} />
            </div>

            <p className="mt-5 text-xs font-medium text-slate-500 dark:text-slate-400">
              Recognition Model
            </p>

            <h2
              className="
                mt-1
                text-xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Random Forest
            </h2>

            <div className="mt-3 flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />

              <span className="text-xs text-slate-500 dark:text-slate-400">
                300 decision trees
              </span>

            </div>

          </div>


          {/* GESTURE CLASSES */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-blue-200
              bg-white
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-blue-400
              hover:shadow-xl
              hover:shadow-blue-500/10
              dark:border-blue-500/20
              dark:bg-slate-900
              dark:hover:border-blue-500/40
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
                transition-transform
                duration-300
                group-hover:scale-110
                dark:bg-blue-500/10
                dark:text-blue-400
              "
            >
              <Layers3 size={20} />
            </div>

            <p className="mt-5 text-xs font-medium text-slate-500 dark:text-slate-400">
              Gesture Classes
            </p>

            <h2
              className="
                mt-1
                text-3xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              26
            </h2>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Alphabet gesture categories
            </p>

          </div>

        </section>


        {/* =====================================================
            MODEL SPECIFICATIONS
        ===================================================== */}

        <section>

          <div className="mb-4 flex items-center gap-3">

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-slate-100
                text-slate-600
                dark:bg-slate-800
                dark:text-slate-300
              "
            >
              <Brain size={18} />
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Model Specifications
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configuration and readiness information
              </p>

            </div>

          </div>


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
                border-slate-200
                bg-white
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-300
                hover:shadow-lg
                hover:shadow-indigo-500/5
                dark:border-slate-800
                dark:bg-slate-900
                dark:hover:border-indigo-500/30
              "
            >

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-50
                  text-indigo-600
                  transition-transform
                  duration-300
                  group-hover:scale-110
                  dark:bg-indigo-500/10
                  dark:text-indigo-400
                "
              >
                <Trees size={21} />
              </div>

              <div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Number of Trees
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
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
                border-slate-200
                bg-white
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-purple-300
                hover:shadow-lg
                hover:shadow-purple-500/5
                dark:border-slate-800
                dark:bg-slate-900
                dark:hover:border-purple-500/30
              "
            >

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-purple-50
                  text-purple-600
                  transition-transform
                  duration-300
                  group-hover:scale-110
                  dark:bg-purple-500/10
                  dark:text-purple-400
                "
              >
                <Database size={21} />
              </div>

              <div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Input Features
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
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
                border-emerald-200
                bg-emerald-50/50
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-emerald-400
                hover:shadow-lg
                hover:shadow-emerald-500/10
                dark:border-emerald-500/20
                dark:bg-emerald-500/5
                dark:hover:border-emerald-500/30
              "
            >

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-100
                  text-emerald-600
                  transition-transform
                  duration-300
                  group-hover:scale-110
                  dark:bg-emerald-500/10
                  dark:text-emerald-400
                "
              >
                <CheckCircle2 size={21} />
              </div>

              <div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Model Status
                </p>

                <div className="mt-1 flex items-center gap-2">

                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    Ready
                  </p>

                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            PERFORMANCE + DATASET
        ===================================================== */}

        <section>

          <div className="mb-4 flex items-center gap-3">

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-indigo-50
                text-indigo-600
                dark:bg-indigo-500/10
                dark:text-indigo-400
              "
            >
              <BarChart3 size={18} />
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Performance Analytics
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Model performance and dataset distribution
              </p>

            </div>

          </div>


          <div
            className="
              grid
              grid-cols-1
              gap-6
              xl:grid-cols-2
            "
          >

            <div className="min-w-0">
              <ModelPerformance />
            </div>

            <div className="min-w-0">
              <DatasetStats />
            </div>

          </div>

        </section>


        {/* =====================================================
            DATASET SUMMARY
        ===================================================== */}

        <section
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-300
            hover:border-indigo-300
            hover:shadow-xl
            hover:shadow-indigo-500/5
            dark:border-slate-800
            dark:bg-slate-900
            dark:hover:border-indigo-500/30
            sm:p-7
          "
        >

          {/* HEADER */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-50
                  text-indigo-600
                  dark:bg-indigo-500/10
                  dark:text-indigo-400
                "
              >
                <Database size={20} />
              </div>

              <div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Dataset Summary
                </h3>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Dataset used for model development
                </p>

              </div>

            </div>


            <div
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                bg-emerald-50
                px-3
                py-1.5
                text-xs
                font-semibold
                text-emerald-600
                dark:bg-emerald-500/10
                dark:text-emerald-400
              "
            >
              <CheckCircle2 size={14} />
              23,156 usable samples
            </div>

          </div>


          {/* DATA */}

          <div
            className="
              mt-6
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
                group
                rounded-2xl
                bg-slate-50
                p-4
                transition-all
                duration-300
                hover:bg-indigo-50
                dark:bg-slate-950/50
                dark:hover:bg-indigo-500/5
              "
            >

              <div className="flex items-center justify-between">

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Training Images
                </p>

                <Image
                  size={15}
                  className="text-indigo-500"
                />

              </div>

              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                18,198
              </p>

            </div>


            {/* VALIDATION */}

            <div
              className="
                group
                rounded-2xl
                bg-slate-50
                p-4
                transition-all
                duration-300
                hover:bg-indigo-50
                dark:bg-slate-950/50
                dark:hover:bg-indigo-500/5
              "
            >

              <div className="flex items-center justify-between">

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Validation Images
                </p>

                <Activity
                  size={15}
                  className="text-indigo-500"
                />

              </div>

              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                2,579
              </p>

            </div>


            {/* TESTING */}

            <div
              className="
                group
                rounded-2xl
                bg-slate-50
                p-4
                transition-all
                duration-300
                hover:bg-indigo-50
                dark:bg-slate-950/50
                dark:hover:bg-indigo-500/5
              "
            >

              <div className="flex items-center justify-between">

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Testing Images
                </p>

                <Target
                  size={15}
                  className="text-indigo-500"
                />

              </div>

              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                5,200
              </p>

            </div>


            {/* TOTAL */}

            <div
              className="
                rounded-2xl
                bg-indigo-50
                p-4
                dark:bg-indigo-500/10
              "
            >

              <div className="flex items-center justify-between">

                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  Total Images
                </p>

                <Layers3
                  size={15}
                  className="text-indigo-500"
                />

              </div>

              <p className="mt-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
                25,977
              </p>

            </div>

          </div>


          {/* FOOTER */}

          <div
            className="
              mt-5
              flex
              flex-col
              gap-2
              border-t
              border-slate-100
              pt-5
              text-xs
              text-slate-500
              dark:border-slate-800
              dark:text-slate-400
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div className="flex items-center gap-2">

              <CheckCircle2
                size={15}
                className="shrink-0 text-emerald-500"
              />

              <span>
                23,156 samples contain detected hand landmarks
                across 26 gesture classes.
              </span>

            </div>

            <span className="shrink-0 font-medium text-slate-400 dark:text-slate-500">
              63 input features
            </span>

          </div>

        </section>

      </div>
    </DashboardLayout>
  );
};

export default Analytics;