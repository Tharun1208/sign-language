import {
  Database,
  Layers,
  Images,
  Image,
  FlaskConical,
  Brain,
  Target,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

const DatasetStats = () => {
  const statistics = [
    {
      label: "Classes",
      value: "26",
      description: "A-Z sign language classes",
      icon: Layers,
      iconStyle:
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    },
    {
      label: "Training Images",
      value: "18,198",
      description: "Training dataset",
      icon: Images,
      iconStyle:
        "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      label: "Validation Images",
      value: "2,579",
      description: "Validation dataset",
      icon: Image,
      iconStyle:
        "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    },
    {
      label: "Test Images",
      value: "5,200",
      description: "Testing dataset",
      icon: FlaskConical,
      iconStyle:
        "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
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

        border-slate-200
        bg-white
        shadow-sm
        shadow-slate-200/50

        transition-all
        duration-500
        ease-out

        hover:-translate-y-1
        hover:border-indigo-300
        hover:shadow-2xl
        hover:shadow-indigo-500/10

        dark:border-slate-800
        dark:bg-slate-900
        dark:shadow-black/10

        dark:hover:border-indigo-500/40
        dark:hover:shadow-indigo-500/5
      "
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-44
          w-44
          rounded-full
          bg-indigo-500/5
          blur-3xl

          transition-all
          duration-700

          group-hover:scale-125
          group-hover:bg-indigo-500/10

          dark:bg-indigo-500/10
          dark:group-hover:bg-indigo-500/15
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
          rounded-full
          bg-purple-500/5
          blur-3xl

          transition-all
          duration-700

          group-hover:scale-125
          group-hover:bg-purple-500/10
        "
      />

      <div className="relative">

        {/* =====================================================
            HEADER
        ===================================================== */}

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
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">

            {/* Dataset Icon */}

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                border

                border-indigo-200
                bg-indigo-50
                text-indigo-600

                transition-all
                duration-500
                ease-out

                group-hover:scale-110
                group-hover:rotate-3
                group-hover:bg-indigo-100
                group-hover:shadow-lg
                group-hover:shadow-indigo-500/10

                dark:border-indigo-500/20
                dark:bg-indigo-500/10
                dark:text-indigo-400

                dark:group-hover:bg-indigo-500/15
              "
            >
              <Database
                size={20}
                className="
                  transition-transform
                  duration-500
                  group-hover:scale-110
                "
              />
            </div>

            {/* Title */}

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

                  group-hover:text-indigo-600
                  dark:group-hover:text-indigo-400

                  sm:text-xl
                  md:text-2xl
                "
              >
                Dataset Statistics
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5

                  text-slate-500
                  dark:text-slate-400

                  sm:text-sm
                "
              >
                Overview of the SignAI A-Z sign language dataset
              </p>

            </div>
          </div>

          {/* Dataset Status */}

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

              hover:scale-105
              hover:shadow-md
              hover:shadow-emerald-500/10

              dark:border-emerald-500/20
              dark:bg-emerald-500/10
              dark:text-emerald-400
            "
          >
            <CheckCircle2 size={14} />

            <span>Dataset Ready</span>
          </div>
        </div>

        {/* =====================================================
            DATASET STATISTICS
        ===================================================== */}

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
          {statistics.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="
                  group/stat
                  relative
                  overflow-hidden
                  rounded-xl
                  border
                  p-3
                  sm:p-4

                  border-slate-200
                  bg-slate-50

                  transition-all
                  duration-400
                  ease-out

                  hover:-translate-y-1
                  hover:scale-[1.01]
                  hover:border-indigo-300
                  hover:bg-white
                  hover:shadow-xl
                  hover:shadow-indigo-500/10

                  dark:border-slate-800
                  dark:bg-slate-950/60

                  dark:hover:border-indigo-500/30
                  dark:hover:bg-slate-950
                "
              >

                {/* Glow */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-6
                    -top-6
                    h-20
                    w-20
                    rounded-full
                    bg-indigo-500/5
                    blur-2xl

                    transition-all
                    duration-500

                    group-hover/stat:scale-150
                    group-hover/stat:bg-indigo-500/10
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

                  {/* Icon */}

                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      sm:h-12
                      sm:w-12
                      sm:rounded-xl

                      transition-all
                      duration-400
                      ease-out

                      group-hover/stat:scale-110
                      group-hover/stat:rotate-3
                      group-hover/stat:shadow-lg

                      ${stat.iconStyle}
                    `}
                  >
                    <Icon
                      size={19}
                      className="
                        transition-transform
                        duration-400
                        group-hover/stat:scale-110
                      "
                    />
                  </div>

                  {/* Label */}

                  <div className="min-w-0 flex-1">

                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold

                        text-slate-900
                        dark:text-white

                        transition-colors
                        duration-300

                        group-hover/stat:text-indigo-600
                        dark:group-hover/stat:text-indigo-400

                        sm:text-base
                      "
                    >
                      {stat.label}
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-xs

                        text-slate-500
                        dark:text-slate-400

                        sm:text-sm
                      "
                    >
                      {stat.description}
                    </p>

                  </div>

                  {/* Value */}

                  <div
                    className="
                      shrink-0
                      text-right
                      text-lg
                      font-bold
                      tracking-tight

                      text-slate-900
                      dark:text-white

                      transition-all
                      duration-300

                      group-hover/stat:scale-110
                      group-hover/stat:text-indigo-600

                      dark:group-hover/stat:text-indigo-400

                      sm:text-2xl
                    "
                  >
                    {stat.value}
                  </div>

                  {/* Status */}

                  <CheckCircle2
                    size={18}
                    className="
                      hidden
                      shrink-0
                      text-emerald-500/50

                      transition-all
                      duration-300

                      group-hover/stat:scale-110
                      group-hover/stat:text-emerald-500

                      sm:block
                    "
                  />

                </div>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            MODEL + ACCURACY
        ===================================================== */}

        <div
          className="
            mt-5
            grid
            grid-cols-1
            gap-3

            sm:mt-6
            sm:gap-4

            md:grid-cols-2
          "
        >

          {/* =================================================
              MODEL
          ================================================= */}

          <div
            className="
              group/model
              relative
              flex
              min-w-0
              items-center
              gap-3
              overflow-hidden
              rounded-xl
              border
              p-4

              border-slate-200
              bg-slate-50

              transition-all
              duration-400
              ease-out

              hover:-translate-y-1
              hover:border-purple-300
              hover:bg-purple-50/70
              hover:shadow-xl
              hover:shadow-purple-500/10

              dark:border-slate-800
              dark:bg-slate-950/50

              dark:hover:border-purple-500/30
              dark:hover:bg-slate-950

              sm:gap-4
              sm:p-5
            "
          >

            {/* Glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-10
                -top-10
                h-24
                w-24
                rounded-full
                bg-purple-500/5
                blur-2xl

                transition-all
                duration-500

                group-hover/model:scale-150
                group-hover/model:bg-purple-500/10
              "
            />

            {/* Icon */}

            <div
              className="
                relative
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                sm:h-11
                sm:w-11
                sm:rounded-xl

                bg-purple-100
                text-purple-600

                transition-all
                duration-400

                group-hover/model:scale-110
                group-hover/model:rotate-3
                group-hover/model:shadow-lg

                dark:bg-purple-500/10
                dark:text-purple-400
              "
            >
              <Brain size={20} />
            </div>

            {/* Model Information */}

            <div className="relative min-w-0">

              <p
                className="
                  text-xs
                  font-medium

                  text-slate-500
                  dark:text-slate-400
                "
              >
                Model Algorithm
              </p>

              <h3
                className="
                  mt-1
                  truncate
                  text-sm
                  font-semibold

                  text-slate-900
                  dark:text-white

                  transition-colors
                  duration-300

                  group-hover/model:text-purple-600
                  dark:group-hover/model:text-purple-400

                  sm:text-base
                "
              >
                Random Forest Classifier
              </h3>

              <p
                className="
                  mt-1
                  text-xs

                  text-slate-500
                  dark:text-slate-400
                "
              >
                300 decision trees · 63 features
              </p>

            </div>
          </div>

          {/* =================================================
              TEST ACCURACY
          ================================================= */}

          <div
            className="
              group/accuracy
              relative
              flex
              min-w-0
              items-center
              gap-3
              overflow-hidden
              rounded-xl
              border
              p-4

              border-emerald-200
              bg-emerald-50/50

              transition-all
              duration-400
              ease-out

              hover:-translate-y-1
              hover:scale-[1.01]
              hover:border-emerald-300
              hover:bg-emerald-50
              hover:shadow-xl
              hover:shadow-emerald-500/10

              dark:border-emerald-500/20
              dark:bg-emerald-500/5

              dark:hover:border-emerald-500/30
              dark:hover:bg-emerald-500/10

              sm:gap-4
              sm:p-5
            "
          >

            {/* Glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-12
                -top-12
                h-28
                w-28
                rounded-full
                bg-emerald-500/5
                blur-3xl

                transition-all
                duration-500

                group-hover/accuracy:scale-150
                group-hover/accuracy:bg-emerald-500/10
              "
            />

            {/* Icon */}

            <div
              className="
                relative
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                sm:h-11
                sm:w-11
                sm:rounded-xl

                bg-emerald-100
                text-emerald-600

                transition-all
                duration-400

                group-hover/accuracy:scale-110
                group-hover/accuracy:rotate-3
                group-hover/accuracy:shadow-lg

                dark:bg-emerald-500/10
                dark:text-emerald-400
              "
            >
              <Target size={20} />
            </div>

            {/* Accuracy */}

            <div className="relative min-w-0 flex-1">

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >

                <div className="min-w-0">

                  <p
                    className="
                      text-xs
                      font-medium

                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Test Accuracy
                  </p>

                  <h3
                    className="
                      mt-1
                      text-xl
                      font-bold

                      text-emerald-600
                      dark:text-emerald-400

                      transition-transform
                      duration-300

                      group-hover/accuracy:scale-105

                      sm:text-2xl
                    "
                  >
                    93.63%
                  </h3>

                </div>

                <BarChart3
                  size={23}
                  className="
                    shrink-0
                    text-emerald-500/50

                    transition-all
                    duration-400

                    group-hover/accuracy:scale-110
                    group-hover/accuracy:text-emerald-500
                  "
                />

              </div>

              {/* Progress */}

              <div
                className="
                  mt-3
                  h-1.5
                  overflow-hidden
                  rounded-full

                  bg-emerald-100

                  dark:bg-emerald-500/10
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-emerald-500

                    transition-all
                    duration-700
                    ease-out

                    group-hover/accuracy:brightness-110
                  "
                  style={{
                    width: "93.63%",
                  }}
                />
              </div>

            </div>
          </div>
        </div>

        {/* =====================================================
            ADDITIONAL MODEL METRICS
        ===================================================== */}

        <div
          className="
            mt-4
            grid
            grid-cols-1
            gap-3

            sm:grid-cols-2
            md:grid-cols-3
          "
        >

          {/* Training Accuracy */}

          <div
            className="
              group/training
              relative
              overflow-hidden
              rounded-xl
              border
              p-4

              border-slate-200
              bg-slate-50

              transition-all
              duration-400
              ease-out

              hover:-translate-y-1
              hover:scale-[1.02]
              hover:border-blue-300
              hover:bg-blue-50/60
              hover:shadow-xl
              hover:shadow-blue-500/10

              dark:border-slate-800
              dark:bg-slate-950/50

              dark:hover:border-blue-500/30
              dark:hover:bg-blue-500/5
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-8
                -top-8
                h-20
                w-20
                rounded-full
                bg-blue-500/5
                blur-2xl

                transition-all
                duration-500

                group-hover/training:scale-150
                group-hover/training:bg-blue-500/10
              "
            />

            <div
              className="
                relative
                flex
                items-center
                gap-2
              "
            >
              <CheckCircle2
                size={17}
                className="
                  text-blue-500

                  transition-transform
                  duration-300

                  group-hover/training:scale-110
                  group-hover/training:rotate-3
                "
              />

              <span
                className="
                  text-xs
                  font-medium

                  text-slate-500
                  dark:text-slate-400
                "
              >
                Training Accuracy
              </span>
            </div>

            <p
              className="
                relative
                mt-2
                text-xl
                font-bold

                text-slate-900
                dark:text-white

                transition-all
                duration-300

                group-hover/training:translate-x-1
                group-hover/training:text-blue-600

                dark:group-hover/training:text-blue-400
              "
            >
              100.00%
            </p>

          </div>

          {/* Validation Accuracy */}

          <div
            className="
              group/validation
              relative
              overflow-hidden
              rounded-xl
              border
              p-4

              border-slate-200
              bg-slate-50

              transition-all
              duration-400
              ease-out

              hover:-translate-y-1
              hover:scale-[1.02]
              hover:border-purple-300
              hover:bg-purple-50/60
              hover:shadow-xl
              hover:shadow-purple-500/10

              dark:border-slate-800
              dark:bg-slate-950/50

              dark:hover:border-purple-500/30
              dark:hover:bg-purple-500/5
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-8
                -top-8
                h-20
                w-20
                rounded-full
                bg-purple-500/5
                blur-2xl

                transition-all
                duration-500

                group-hover/validation:scale-150
                group-hover/validation:bg-purple-500/10
              "
            />

            <div
              className="
                relative
                flex
                items-center
                gap-2
              "
            >
              <Target
                size={17}
                className="
                  text-purple-500

                  transition-transform
                  duration-300

                  group-hover/validation:scale-110
                  group-hover/validation:rotate-3
                "
              />

              <span
                className="
                  text-xs
                  font-medium

                  text-slate-500
                  dark:text-slate-400
                "
              >
                Validation Accuracy
              </span>
            </div>

            <p
              className="
                relative
                mt-2
                text-xl
                font-bold

                text-slate-900
                dark:text-white

                transition-all
                duration-300

                group-hover/validation:translate-x-1
                group-hover/validation:text-purple-600

                dark:group-hover/validation:text-purple-400
              "
            >
              89.55%
            </p>

          </div>

          {/* Usable Samples */}

          <div
            className="
              group/samples
              relative
              overflow-hidden
              rounded-xl
              border
              p-4

              border-slate-200
              bg-slate-50

              transition-all
              duration-400
              ease-out

              hover:-translate-y-1
              hover:scale-[1.02]
              hover:border-indigo-300
              hover:bg-indigo-50/60
              hover:shadow-xl
              hover:shadow-indigo-500/10

              dark:border-slate-800
              dark:bg-slate-950/50

              dark:hover:border-indigo-500/30
              dark:hover:bg-indigo-500/5
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-8
                -top-8
                h-20
                w-20
                rounded-full
                bg-indigo-500/5
                blur-2xl

                transition-all
                duration-500

                group-hover/samples:scale-150
                group-hover/samples:bg-indigo-500/10
              "
            />

            <div
              className="
                relative
                flex
                items-center
                gap-2
              "
            >
              <Database
                size={17}
                className="
                  text-indigo-500

                  transition-transform
                  duration-300

                  group-hover/samples:scale-110
                  group-hover/samples:rotate-3
                "
              />

              <span
                className="
                  text-xs
                  font-medium

                  text-slate-500
                  dark:text-slate-400
                "
              >
                Usable Samples
              </span>
            </div>

            <p
              className="
                relative
                mt-2
                text-xl
                font-bold

                text-slate-900
                dark:text-white

                transition-all
                duration-300

                group-hover/samples:translate-x-1
                group-hover/samples:text-indigo-600

                dark:group-hover/samples:text-indigo-400
              "
            >
              23,156
            </p>

          </div>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

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

            sm:mt-6
            sm:pt-5

            transition-colors
            duration-300

            group-hover:border-indigo-200
            dark:group-hover:border-indigo-500/20
          "
        >

          <Database
            size={16}
            className="
              mt-0.5
              shrink-0

              text-indigo-500
              dark:text-indigo-400

              transition-transform
              duration-300

              group-hover:scale-110
            "
          />

          <p
            className="
              text-xs
              leading-5

              text-slate-500
              dark:text-slate-400
            "
          >
            SignAI uses 25,977 dataset images across 26 A-Z
            sign language classes. 23,156 images contained
            detectable hand landmarks and were used by the
            machine-learning pipeline.
          </p>

        </div>

      </div>
    </section>
  );
};

export default DatasetStats;