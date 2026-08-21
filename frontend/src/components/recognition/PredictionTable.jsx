import {
  FaHistory,
  FaCheckCircle,
} from "react-icons/fa";

const PredictionTable = ({ history = [] }) => {
  return (
    <div
      className="
        group
        w-full
        overflow-hidden
        rounded-2xl
        border

        border-slate-200
        bg-white

        dark:border-slate-800
        dark:bg-slate-900

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

      <div
        className="
          flex
          items-center
          gap-3
          border-b

          border-slate-200
          p-5

          dark:border-slate-800

          transition-colors
          duration-300
        "
      >
        {/* Header Icon */}

        <div
          className="
            flex
            h-10
            w-10
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

            group-hover:scale-105
            group-hover:bg-indigo-100

            dark:group-hover:bg-indigo-500/15
          "
        >
          <FaHistory
            size={17}
            className="
              transition-transform
              duration-300

              group-hover:rotate-[-8deg]
              group-hover:scale-110
            "
          />
        </div>

        {/* Header Text */}

        <div>
          <h2
            className="
              text-lg
              font-semibold

              text-slate-900

              dark:text-white
            "
          >
            Recent Predictions
          </h2>

          <p
            className="
              mt-1
              text-xs

              text-slate-500

              dark:text-slate-400
            "
          >
            Latest gesture recognition results
          </p>
        </div>
      </div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {history.length === 0 ? (
        <div
          className="
            flex
            min-h-[240px]
            flex-col
            items-center
            justify-center
            p-6
            text-center
          "
        >
          {/* Empty Icon */}

          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl

              border
              border-slate-200
              bg-slate-100
              text-slate-400

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-500

              transition-all
              duration-300

              hover:scale-105
              hover:border-indigo-200
              hover:bg-indigo-50
              hover:text-indigo-500

              dark:hover:border-indigo-500/30
              dark:hover:bg-indigo-500/10
              dark:hover:text-indigo-400
            "
          >
            <FaHistory
              size={24}
              className="
                transition-transform
                duration-300

                hover:rotate-[-8deg]
              "
            />
          </div>

          {/* Empty Title */}

          <p
            className="
              mt-5
              text-sm
              font-semibold

              text-slate-700

              dark:text-slate-200
            "
          >
            No predictions yet
          </p>

          {/* Empty Description */}

          <p
            className="
              mt-2
              max-w-sm
              text-xs
              leading-5

              text-slate-500

              dark:text-slate-400
            "
          >
            Upload a hand gesture image and click{" "}
            <span
              className="
                font-semibold
                text-indigo-600

                dark:text-indigo-400
              "
            >
              Predict
            </span>{" "}
            to see your recognition history here.
          </p>
        </div>
      ) : (
        /* ===================================================
           TABLE
        =================================================== */

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[560px]">
            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <thead>
              <tr
                className="
                  border-b

                  border-slate-200
                  bg-slate-50

                  dark:border-slate-800
                  dark:bg-slate-800/50
                "
              >
                {/* TIME */}

                <th
                  className="
                    p-4
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide

                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  Time
                </th>

                {/* PREDICTION */}

                <th
                  className="
                    p-4
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide

                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  Prediction
                </th>

                {/* CONFIDENCE */}

                <th
                  className="
                    p-4
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide

                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  Confidence
                </th>

                {/* STATUS */}

                <th
                  className="
                    p-4
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide

                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  Status
                </th>
              </tr>
            </thead>

            {/* =================================================
                TABLE BODY
            ================================================= */}

            <tbody>
              {history.map((item, index) => {
                const confidence = Number(item.confidence ?? 0);

                return (
                  <tr
                    key={item.id || index}
                    className="
                      group/row

                      border-b
                      border-slate-100

                      hover:bg-indigo-50/40

                      dark:border-slate-800/70
                      dark:hover:bg-indigo-500/5

                      transition-all
                      duration-300

                      hover:shadow-sm
                    "
                  >
                    {/* =================================================
                        TIME
                    ================================================= */}

                    <td
                      className="
                        p-4
                        text-sm
                        font-medium
                        whitespace-nowrap

                        text-slate-700

                        dark:text-slate-300
                      "
                    >
                      <span
                        className="
                          transition-colors
                          duration-200

                          group-hover/row:text-indigo-600

                          dark:group-hover/row:text-indigo-400
                        "
                      >
                        {item.time || "--"}
                      </span>
                    </td>

                    {/* =================================================
                        PREDICTION
                    ================================================= */}

                    <td className="p-4">
                      <span
                        className="
                          inline-flex
                          min-w-[44px]
                          items-center
                          justify-center

                          rounded-xl
                          border

                          border-indigo-100
                          bg-indigo-50

                          px-3
                          py-1.5

                          text-sm
                          font-bold

                          text-indigo-600

                          shadow-sm

                          transition-all
                          duration-300

                          group-hover/row:scale-105
                          group-hover/row:border-indigo-200
                          group-hover/row:bg-indigo-100
                          group-hover/row:shadow-md
                          group-hover/row:shadow-indigo-500/10

                          dark:border-indigo-500/20
                          dark:bg-indigo-500/10
                          dark:text-indigo-400

                          dark:group-hover/row:border-indigo-500/30
                          dark:group-hover/row:bg-indigo-500/15
                        "
                      >
                        {item.prediction || "--"}
                      </span>
                    </td>

                    {/* =================================================
                        CONFIDENCE
                    ================================================= */}

                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        {/* Percentage */}

                        <span
                          className="
                            inline-flex
                            w-fit
                            rounded-full

                            border
                            border-emerald-100
                            bg-emerald-50

                            px-3
                            py-1

                            text-xs
                            font-semibold

                            text-emerald-600

                            transition-all
                            duration-300

                            group-hover/row:scale-105
                            group-hover/row:border-emerald-200
                            group-hover/row:bg-emerald-100

                            dark:border-emerald-500/20
                            dark:bg-emerald-500/10
                            dark:text-emerald-400

                            dark:group-hover/row:border-emerald-500/30
                            dark:group-hover/row:bg-emerald-500/15
                          "
                        >
                          {confidence.toFixed(2)}%
                        </span>

                        {/* Mini Progress */}

                        <div
                          className="
                            h-1.5
                            w-24
                            overflow-hidden
                            rounded-full

                            bg-slate-100

                            dark:bg-slate-800
                          "
                        >
                          <div
                            className="
                              h-full
                              rounded-full

                              bg-emerald-500

                              transition-all
                              duration-700
                            "
                            style={{
                              width: `${Math.min(
                                Math.max(confidence, 0),
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <td className="p-4">
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2

                          rounded-full

                          border
                          border-emerald-100
                          bg-emerald-50

                          px-3
                          py-1.5

                          text-xs
                          font-semibold

                          text-emerald-600

                          transition-all
                          duration-300

                          group-hover/row:scale-105
                          group-hover/row:border-emerald-200
                          group-hover/row:bg-emerald-100

                          dark:border-emerald-500/20
                          dark:bg-emerald-500/10
                          dark:text-emerald-400

                          dark:group-hover/row:border-emerald-500/30
                          dark:group-hover/row:bg-emerald-500/15
                        "
                      >
                        <FaCheckCircle
                          size={13}
                          className="
                            transition-transform
                            duration-300

                            group-hover/row:scale-110
                            group-hover/row:rotate-6
                          "
                        />

                        Recognized
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PredictionTable;