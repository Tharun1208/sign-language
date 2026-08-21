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
        group relative w-full overflow-hidden rounded-2xl
        border border-slate-800 bg-slate-950 p-5
        shadow-xl shadow-black/20
        transition-all duration-300
        hover:-translate-y-1
        hover:border-indigo-500/40
        hover:shadow-2xl hover:shadow-indigo-500/10
        sm:p-6
      "
    >
      {/* Background Glow */}
      <div
        className="
          pointer-events-none absolute -right-20 -top-20
          h-48 w-48 rounded-full
          bg-indigo-500/10 blur-3xl
          transition-all duration-500
          group-hover:scale-150
          group-hover:bg-indigo-500/15
        "
      />

      <div
        className="
          pointer-events-none absolute -bottom-24 -left-20
          h-40 w-40 rounded-full
          bg-purple-500/5 blur-3xl
        "
      />

      <div className="relative">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-xl
                border border-indigo-500/20
                bg-indigo-500/10
                text-indigo-400
                shadow-lg shadow-indigo-500/10
                transition-all duration-300
                group-hover:scale-110
                group-hover:rotate-3
                group-hover:bg-indigo-500/15
              "
            >
              <FaCamera size={17} />
            </div>

            <div>
              <h3
                className="
                  text-base font-semibold tracking-tight
                  text-white
                "
              >
                Recognition Controls
              </h3>

              <p
                className="
                  mt-1 text-sm text-slate-400
                "
              >
                Manage your recognition session.
              </p>
            </div>

          </div>

          {/* SYSTEM STATUS */}
          <div
            className="
              hidden items-center gap-2
              rounded-full
              border border-emerald-500/20
              bg-emerald-500/10
              px-3 py-1.5
              sm:flex
            "
          >
            <span className="relative flex h-2 w-2">
              <span
                className="
                  absolute inline-flex h-full w-full
                  animate-ping rounded-full
                  bg-emerald-400 opacity-75
                "
              />

              <span
                className="
                  relative inline-flex h-2 w-2
                  rounded-full bg-emerald-500
                "
              />
            </span>

            <span
              className="
                text-[11px] font-semibold
                text-emerald-400
              "
            >
              SYSTEM READY
            </span>
          </div>

        </div>

        {/* BUTTONS */}
        <div
          className="
            grid grid-cols-2 gap-3
            sm:flex sm:flex-wrap
          "
        >

          {/* START */}
          <button
            type="button"
            className="
              group/start relative flex min-h-[46px]
              min-w-[120px] flex-1 items-center
              justify-center gap-2 overflow-hidden
              rounded-xl border
              border-emerald-500/40
              bg-emerald-500
              px-5 py-3
              font-semibold text-white
              shadow-lg shadow-emerald-500/20
              transition-all duration-300
              hover:-translate-y-1
              hover:border-emerald-400
              hover:bg-emerald-400
              hover:shadow-xl
              hover:shadow-emerald-500/30
              active:translate-y-0
              active:scale-95
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-400/40
            "
          >
            <span
              className="
                absolute inset-0
                -translate-x-full
                bg-gradient-to-r
                from-transparent via-white/20
                to-transparent
                transition-transform duration-700
                group-hover/start:translate-x-full
              "
            />

            <FaPlay
              size={13}
              className="
                relative
                transition-transform duration-300
                group-hover/start:scale-125
              "
            />

            <span className="relative">
              Start
            </span>
          </button>

          {/* STOP */}
          <button
            type="button"
            className="
              group/stop relative flex min-h-[46px]
              min-w-[120px] flex-1 items-center
              justify-center gap-2 overflow-hidden
              rounded-xl border
              border-red-500/40
              bg-red-500
              px-5 py-3
              font-semibold text-white
              shadow-lg shadow-red-500/20
              transition-all duration-300
              hover:-translate-y-1
              hover:border-red-400
              hover:bg-red-400
              hover:shadow-xl
              hover:shadow-red-500/30
              active:translate-y-0
              active:scale-95
              focus:outline-none
              focus:ring-2
              focus:ring-red-400/40
            "
          >
            <span
              className="
                absolute inset-0
                -translate-x-full
                bg-gradient-to-r
                from-transparent via-white/20
                to-transparent
                transition-transform duration-700
                group-hover/stop:translate-x-full
              "
            />

            <FaStop
              size={13}
              className="
                relative
                transition-transform duration-300
                group-hover/stop:scale-125
              "
            />

            <span className="relative">
              Stop
            </span>
          </button>

          {/* CAPTURE */}
          <button
            type="button"
            className="
              group/capture relative flex min-h-[46px]
              min-w-[120px] flex-1 items-center
              justify-center gap-2 overflow-hidden
              rounded-xl border
              border-blue-500/40
              bg-blue-500
              px-5 py-3
              font-semibold text-white
              shadow-lg shadow-blue-500/20
              transition-all duration-300
              hover:-translate-y-1
              hover:border-blue-400
              hover:bg-blue-400
              hover:shadow-xl
              hover:shadow-blue-500/30
              active:translate-y-0
              active:scale-95
              focus:outline-none
              focus:ring-2
              focus:ring-blue-400/40
            "
          >
            <span
              className="
                absolute inset-0
                -translate-x-full
                bg-gradient-to-r
                from-transparent via-white/20
                to-transparent
                transition-transform duration-700
                group-hover/capture:translate-x-full
              "
            />

            <FaCamera
              size={15}
              className="
                relative
                transition-all duration-300
                group-hover/capture:scale-125
                group-hover/capture:rotate-6
              "
            />

            <span className="relative">
              Capture
            </span>
          </button>

          {/* RESET */}
          <button
            type="button"
            className="
              group/reset relative flex min-h-[46px]
              min-w-[120px] flex-1 items-center
              justify-center gap-2 overflow-hidden
              rounded-xl border
              border-orange-500/40
              bg-orange-500
              px-5 py-3
              font-semibold text-white
              shadow-lg shadow-orange-500/20
              transition-all duration-300
              hover:-translate-y-1
              hover:border-orange-400
              hover:bg-orange-400
              hover:shadow-xl
              hover:shadow-orange-500/30
              active:translate-y-0
              active:scale-95
              focus:outline-none
              focus:ring-2
              focus:ring-orange-400/40
            "
          >
            <span
              className="
                absolute inset-0
                -translate-x-full
                bg-gradient-to-r
                from-transparent via-white/20
                to-transparent
                transition-transform duration-700
                group-hover/reset:translate-x-full
              "
            />

            <FaRedo
              size={14}
              className="
                relative
                transition-transform duration-500
                group-hover/reset:rotate-180
              "
            />

            <span className="relative">
              Reset
            </span>
          </button>

        </div>

        {/* STATUS */}
        <div
          className="
            mt-5 flex items-center justify-between
            gap-3 rounded-xl
            border border-slate-800
            bg-slate-900/80
            px-4 py-3
            shadow-inner
            transition-all duration-300
            hover:border-indigo-500/30
            hover:bg-slate-900
          "
        >

          <div className="flex items-center gap-3">

            <span className="relative flex h-2.5 w-2.5">

              <span
                className="
                  absolute inline-flex h-full w-full
                  animate-ping rounded-full
                  bg-emerald-400 opacity-75
                "
              />

              <span
                className="
                  relative inline-flex h-2.5 w-2.5
                  rounded-full
                  bg-emerald-500
                  shadow-lg shadow-emerald-500/50
                "
              />

            </span>

            <span
              className="
                text-xs font-medium
                text-slate-300
              "
            >
              Recognition system ready
            </span>

          </div>

          <span
            className="
              hidden rounded-md
              border border-slate-700
              bg-slate-800
              px-2 py-1
              text-[10px]
              font-semibold uppercase
              tracking-wider
              text-slate-400
              sm:block
            "
          >
            AI Engine
          </span>

        </div>

      </div>

      {/* Bottom Accent */}
      <div
        className="
          absolute bottom-0 left-0
          h-0.5 w-0
          bg-gradient-to-r
          from-indigo-500
          via-purple-500
          to-blue-500
          transition-all duration-500
          group-hover:w-full
        "
      />

    </div>
  );
};

export default Controls;