import {
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

const StatsCard = ({
  title,
  value,
  color = "#6366f1",
}) => {
  return (
    <div
      className="
        group
        relative
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
        hover:-translate-y-1
        hover:shadow-xl

        transition-all
        duration-300
      "
    >
      {/* =========================================
          BACKGROUND GLOW
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-28
          w-28
          rounded-full
          opacity-10
          blur-3xl
          transition-all
          duration-500

          group-hover:scale-150
          group-hover:opacity-20
        "
        style={{
          backgroundColor: color,
        }}
      />

      {/* =========================================
          CARD CONTENT
      ========================================= */}

      <div className="relative flex items-center justify-between gap-4">

        {/* LEFT */}

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <p
              className="
                truncate
                text-sm
                font-medium

                text-slate-500

                dark:text-slate-400
              "
            >
              {title}
            </p>

            {/* Trend */}

            <span
              className="
                hidden
                items-center
                gap-1
                rounded-full
                px-2
                py-1
                text-[10px]
                font-semibold

                sm:flex
              "
              style={{
                color: color,
                backgroundColor: `${color}15`,
              }}
            >
              <ArrowUpRight size={12} />

              Active
            </span>

          </div>

          {/* VALUE */}

          <h2
            className="
              mt-2
              truncate
              text-2xl
              font-bold
              tracking-tight

              text-slate-900

              dark:text-white

              sm:text-3xl
            "
          >
            {value}
          </h2>

          {/* Bottom text */}

          <div className="mt-2 flex items-center gap-1.5">

            <TrendingUp
              size={14}
              style={{
                color: color,
              }}
            />

            <span
              className="
                text-xs
                text-slate-400

                dark:text-slate-500
              "
            >
              Performance metric
            </span>

          </div>

        </div>

        {/* =========================================
            ICON
        ========================================= */}

        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-xl

            transition-all
            duration-300

            group-hover:scale-110
            group-hover:rotate-3

            sm:h-14
            sm:w-14
          "
          style={{
            backgroundColor: `${color}18`,
            color: color,
          }}
        >
          <TrendingUp
            size={24}
            strokeWidth={2.2}
          />
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
          h-0.5
          w-0

          transition-all
          duration-500

          group-hover:w-full
        "
        style={{
          backgroundColor: color,
        }}
      />

    </div>
  );
};

export default StatsCard;