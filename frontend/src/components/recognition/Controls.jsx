import {
  FaPlay,
  FaStop,
  FaCamera,
  FaRedo,
} from "react-icons/fa";

const Controls = () => {
  return (
    <div
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border
        p-5
        sm:p-6

        border-slate-200
        bg-white

        dark:border-slate-800
        dark:bg-slate-900

        shadow-sm
        hover:shadow-xl
        hover:shadow-indigo-500/5

        transition-all
        duration-300
      "
    >
      {/* Background Glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-40
          w-40
          rounded-full
          bg-indigo-500/5
          blur-3xl

          transition-all
          duration-500

          group-hover:scale-150
          group-hover:bg-indigo-500/10
        "
      />

      <div className="relative">

        {/* ================================
            HEADER
        ================================= */}

        <div className="mb-6">

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

                hover:scale-110
                hover:rotate-3
              "
            >
              <FaCamera size={17} />
            </div>

            <div>

              <h3
                className="
                  text-base
                  font-semibold

                  text-slate-900
                  dark:text-white
                "
              >
                Recognition Controls
              </h3>

              <p
                className="
                  mt-1
                  text-sm

                  text-slate-500
                  dark:text-slate-400
                "
              >
                Manage your recognition session.
              </p>

            </div>

          </div>

        </div>


        {/* ================================
            BUTTONS
        ================================= */}

        <div
          className="
            grid
            grid-cols-2
            gap-3

            sm:flex
            sm:flex-wrap
          "
        >

          {/* ================================
              START
          ================================= */}

          <button
            type="button"
            className="
              group/start
              relative
              flex
              min-w-[120px]
              flex-1
              items-center
              justify-center
              gap-2
              overflow-hidden

              rounded-xl
              border

              border-emerald-500
              bg-emerald-500
              text-white

              px-5
              py-3

              font-semibold

              shadow-md
              shadow-emerald-500/20

              transition-all
              duration-300

              hover:-translate-y-1
              hover:bg-emerald-600
              hover:border-emerald-600
              hover:shadow-xl
              hover:shadow-emerald-500/30

              active:translate-y-0
              active:scale-95

              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500/40
              focus:ring-offset-2

              dark:focus:ring-offset-slate-900
            "
          >

            {/* Shine */}

            <span
              className="
                absolute
                inset-0
                -translate-x-full
                bg-white/20

                transition-transform
                duration-500

                group-hover/start:translate-x-full
              "
            />

            <FaPlay
              size={13}
              className="
                relative
                transition-transform
                duration-300

                group-hover/start:scale-125
                group-hover/start:translate-x-0.5
              "
            />

            <span className="relative">
              Start
            </span>

          </button>


          {/* ================================
              STOP
          ================================= */}

          <button
            type="button"
            className="
              group/stop
              relative
              flex
              min-w-[120px]
              flex-1
              items-center
              justify-center
              gap-2
              overflow-hidden

              rounded-xl
              border

              border-red-500
              bg-red-500
              text-white

              px-5
              py-3

              font-semibold

              shadow-md
              shadow-red-500/20

              transition-all
              duration-300

              hover:-translate-y-1
              hover:bg-red-600
              hover:border-red-600
              hover:shadow-xl
              hover:shadow-red-500/30

              active:translate-y-0
              active:scale-95

              focus:outline-none
              focus:ring-2
              focus:ring-red-500/40
              focus:ring-offset-2

              dark:focus:ring-offset-slate-900
            "
          >

            <span
              className="
                absolute
                inset-0
                -translate-x-full
                bg-white/20

                transition-transform
                duration-500

                group-hover/stop:translate-x-full
              "
            />

            <FaStop
              size={13}
              className="
                relative

                transition-transform
                duration-300

                group-hover/stop:scale-125
              "
            />

            <span className="relative">
              Stop
            </span>

          </button>


          {/* ================================
              CAPTURE
          ================================= */}

          <button
            type="button"
            className="
              group/capture
              relative
              flex
              min-w-[120px]
              flex-1
              items-center
              justify-center
              gap-2
              overflow-hidden

              rounded-xl
              border

              border-blue-500
              bg-blue-500
              text-white

              px-5
              py-3

              font-semibold

              shadow-md
              shadow-blue-500/20

              transition-all
              duration-300

              hover:-translate-y-1
              hover:bg-blue-600
              hover:border-blue-600
              hover:shadow-xl
              hover:shadow-blue-500/30

              active:translate-y-0
              active:scale-95

              focus:outline-none
              focus:ring-2
              focus:ring-blue-500/40
              focus:ring-offset-2

              dark:focus:ring-offset-slate-900
            "
          >

            <span
              className="
                absolute
                inset-0
                -translate-x-full
                bg-white/20

                transition-transform
                duration-500

                group-hover/capture:translate-x-full
              "
            />

            <FaCamera
              size={15}
              className="
                relative

                transition-all
                duration-300

                group-hover/capture:scale-125
                group-hover/capture:rotate-6
              "
            />

            <span className="relative">
              Capture
            </span>

          </button>


          {/* ================================
              RESET
          ================================= */}

          <button
            type="button"
            className="
              group/reset
              relative
              flex
              min-w-[120px]
              flex-1
              items-center
              justify-center
              gap-2
              overflow-hidden

              rounded-xl
              border

              border-orange-500
              bg-orange-500
              text-white

              px-5
              py-3

              font-semibold

              shadow-md
              shadow-orange-500/20

              transition-all
              duration-300

              hover:-translate-y-1
              hover:bg-orange-600
              hover:border-orange-600
              hover:shadow-xl
              hover:shadow-orange-500/30

              active:translate-y-0
              active:scale-95

              focus:outline-none
              focus:ring-2
              focus:ring-orange-500/40
              focus:ring-offset-2

              dark:focus:ring-offset-slate-900
            "
          >

            <span
              className="
                absolute
                inset-0
                -translate-x-full
                bg-white/20

                transition-transform
                duration-500

                group-hover/reset:translate-x-full
              "
            />

            <FaRedo
              size={14}
              className="
                relative

                transition-transform
                duration-500

                group-hover/reset:rotate-180
              "
            />

            <span className="relative">
              Reset
            </span>

          </button>

        </div>


        {/* ================================
            STATUS INFORMATION
        ================================= */}

        <div
          className="
            mt-5
            flex
            items-center
            gap-2
            rounded-xl
            border
            px-4
            py-3

            border-slate-200
            bg-slate-50

            dark:border-slate-800
            dark:bg-slate-950

            transition-all
            duration-300

            hover:border-indigo-200
            hover:bg-indigo-50/50

            dark:hover:border-indigo-500/20
            dark:hover:bg-indigo-500/5
          "
        >

          <span
            className="
              relative
              flex
              h-2.5
              w-2.5
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
                bg-emerald-400
                opacity-75
              "
            />

            <span
              className="
                relative
                inline-flex
                h-2.5
                w-2.5
                rounded-full
                bg-emerald-500
              "
            />
          </span>

          <span
            className="
              text-xs
              font-medium

              text-slate-500
              dark:text-slate-400
            "
          >
            Recognition system ready
          </span>

        </div>

      </div>

      {/* Bottom Accent */}

      <div
        className="
          absolute
          bottom-0
          left-0
          h-0.5
          w-0

          bg-gradient-to-r
          from-indigo-500
          via-purple-500
          to-blue-500

          transition-all
          duration-500

          group-hover:w-full
        "
      />

    </div>
  );
};

export default Controls;