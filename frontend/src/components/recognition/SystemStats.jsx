import {
  Brain,
  Target,
  Cpu,
  Layers3,
  CheckCircle2,
  Activity,
} from "lucide-react";

const SystemStats = () => {
  return (
    <div
      className="
        group
        w-full
        rounded-2xl
        border
        p-5
        sm:p-6

        bg-white
        border-slate-200

        dark:bg-slate-900
        dark:border-slate-800

        shadow-sm
        hover:shadow-lg
        hover:shadow-indigo-500/5

        transition-all
        duration-300
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Icon */}

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

              group-hover:scale-105
              group-hover:bg-indigo-100

              dark:group-hover:bg-indigo-500/15
            "
          >
            <Activity
              size={20}
              className="
                transition-transform
                duration-300

                group-hover:rotate-6
                group-hover:scale-110
              "
            />
          </div>

          <div>
            <h2
              className="
                text-lg
                font-semibold

                text-slate-900

                dark:text-white
              "
            >
              System Statistics
            </h2>

            <p
              className="
                mt-0.5
                text-xs

                text-slate-500

                dark:text-slate-400
              "
            >
              AI recognition system status
            </p>
          </div>
        </div>

        {/* Online Indicator */}

        <div
          className="
            hidden
            items-center
            gap-2
            rounded-full

            border
            border-emerald-200
            bg-emerald-50

            px-3
            py-1.5

            text-xs
            font-semibold
            text-emerald-600

            sm:flex

            dark:border-emerald-500/20
            dark:bg-emerald-500/10
            dark:text-emerald-400
          "
        >
          <span
            className="
              h-2
              w-2
              rounded-full
              bg-emerald-500

              animate-pulse
            "
          />

          Online
        </div>
      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="space-y-3">
        {/* ===================================================
            MODEL
        =================================================== */}

        <div
          className="
            group/item
            flex
            items-center
            justify-between
            gap-4

            rounded-xl
            border
            p-4

            border-slate-200
            bg-slate-50

            hover:border-indigo-200
            hover:bg-indigo-50/60

            dark:border-slate-800
            dark:bg-slate-800/50

            dark:hover:border-indigo-500/30
            dark:hover:bg-indigo-500/5

            transition-all
            duration-300
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg

                bg-purple-50
                text-purple-600

                dark:bg-purple-500/10
                dark:text-purple-400

                transition-transform
                duration-300

                group-hover/item:scale-110
              "
            >
              <Brain size={17} />
            </div>

            <span
              className="
                text-sm
                font-medium

                text-slate-500

                dark:text-slate-400
              "
            >
              Model
            </span>
          </div>

          <span
            className="
              text-right
              text-sm
              font-semibold

              text-slate-900

              dark:text-white
            "
          >
            Enhanced NN
          </span>
        </div>

        {/* ===================================================
            ACCURACY
        =================================================== */}

        <div
          className="
            group/item
            rounded-xl
            border
            p-4

            border-slate-200
            bg-slate-50

            hover:border-emerald-200
            hover:bg-emerald-50/50

            dark:border-slate-800
            dark:bg-slate-800/50

            dark:hover:border-emerald-500/30
            dark:hover:bg-emerald-500/5

            transition-all
            duration-300
          "
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg

                  bg-emerald-50
                  text-emerald-600

                  dark:bg-emerald-500/10
                  dark:text-emerald-400

                  transition-transform
                  duration-300

                  group-hover/item:scale-110
                "
              >
                <Target size={17} />
              </div>

              <span
                className="
                  text-sm
                  font-medium

                  text-slate-500

                  dark:text-slate-400
                "
              >
                Accuracy
              </span>
            </div>

            <span
              className="
                text-sm
                font-bold

                text-emerald-600

                dark:text-emerald-400
              "
            >
              99.2%
            </span>
          </div>

          {/* Accuracy Bar */}

          <div
            className="
              mt-3
              h-2
              overflow-hidden
              rounded-full

              bg-emerald-100

              dark:bg-emerald-950/50
            "
          >
            <div
              className="
                h-full
                w-[99.2%]
                rounded-full

                bg-emerald-500

                transition-all
                duration-700

                group-hover/item:brightness-110
              "
            />
          </div>
        </div>

        {/* ===================================================
            GPU
        =================================================== */}

        <div
          className="
            group/item
            flex
            items-center
            justify-between
            gap-4

            rounded-xl
            border
            p-4

            border-slate-200
            bg-slate-50

            hover:border-blue-200
            hover:bg-blue-50/50

            dark:border-slate-800
            dark:bg-slate-800/50

            dark:hover:border-blue-500/30
            dark:hover:bg-blue-500/5

            transition-all
            duration-300
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg

                bg-blue-50
                text-blue-600

                dark:bg-blue-500/10
                dark:text-blue-400

                transition-transform
                duration-300

                group-hover/item:scale-110
              "
            >
              <Cpu size={17} />
            </div>

            <span
              className="
                text-sm
                font-medium

                text-slate-500

                dark:text-slate-400
              "
            >
              GPU
            </span>
          </div>

          <span
            className="
              inline-flex
              items-center
              gap-2

              rounded-full

              bg-emerald-50
              px-3
              py-1

              text-xs
              font-semibold

              text-emerald-600

              dark:bg-emerald-500/10
              dark:text-emerald-400
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-500

                animate-pulse
              "
            />

            Available
          </span>
        </div>

        {/* ===================================================
            FRAMES
        =================================================== */}

        <div
          className="
            group/item
            flex
            items-center
            justify-between
            gap-4

            rounded-xl
            border
            p-4

            border-slate-200
            bg-slate-50

            hover:border-orange-200
            hover:bg-orange-50/50

            dark:border-slate-800
            dark:bg-slate-800/50

            dark:hover:border-orange-500/30
            dark:hover:bg-orange-500/5

            transition-all
            duration-300
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg

                bg-orange-50
                text-orange-600

                dark:bg-orange-500/10
                dark:text-orange-400

                transition-transform
                duration-300

                group-hover/item:scale-110
              "
            >
              <Layers3 size={17} />
            </div>

            <span
              className="
                text-sm
                font-medium

                text-slate-500

                dark:text-slate-400
              "
            >
              Frames
            </span>
          </div>

          <span
            className="
              text-sm
              font-bold

              text-slate-900

              dark:text-white

              transition-colors
              duration-300

              group-hover/item:text-orange-600

              dark:group-hover/item:text-orange-400
            "
          >
            542
          </span>
        </div>
      </div>

      {/* =====================================================
          FOOTER STATUS
      ===================================================== */}

      <div
        className="
          mt-5
          flex
          items-center
          gap-2
          border-t
          pt-4

          border-slate-200

          dark:border-slate-800
        "
      >
        <CheckCircle2
          size={15}
          className="
            text-emerald-500

            dark:text-emerald-400
          "
        />

        <span
          className="
            text-xs
            text-slate-500

            dark:text-slate-400
          "
        >
          Recognition system is ready
        </span>
      </div>
    </div>
  );
};

export default SystemStats;