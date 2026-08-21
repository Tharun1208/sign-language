import Webcam from "react-webcam";
import {
  FaCamera,
  FaCircle,
} from "react-icons/fa";

const WebcamSection = () => {
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
        hover:shadow-xl
        hover:shadow-indigo-500/10

        transition-all
        duration-500
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-5 flex items-center justify-between">

        {/* TITLE */}

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

              group-hover:scale-105
              group-hover:bg-indigo-100

              dark:group-hover:bg-indigo-500/15
            "
          >
            <FaCamera size={17} />
          </div>

          <div>

            <h2
              className="
                text-base
                font-semibold
                text-slate-900

                dark:text-white

                sm:text-lg
              "
            >
              Live Camera
            </h2>

            <p
              className="
                mt-0.5
                text-xs

                text-slate-500

                dark:text-slate-400
              "
            >
              Real-time gesture recognition
            </p>

          </div>

        </div>


        {/* LIVE STATUS */}

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            px-3
            py-1.5

            border-emerald-200
            bg-emerald-50

            text-xs
            font-semibold
            text-emerald-600

            dark:border-emerald-500/20
            dark:bg-emerald-500/10
            dark:text-emerald-400

            transition-all
            duration-300

            group-hover:shadow-md
            group-hover:shadow-emerald-500/10
          "
        >

          <span
            className="
              relative
              flex
              h-2.5
              w-2.5
              items-center
              justify-center
            "
          >

            {/* Pulse */}

            <span
              className="
                absolute
                h-2.5
                w-2.5
                rounded-full
                bg-emerald-500
                opacity-50
                animate-ping
              "
            />

            {/* Dot */}

            <FaCircle
              size={7}
              className="
                relative
                text-emerald-500
                dark:text-emerald-400
              "
            />

          </span>

          Live

        </div>

      </div>


      {/* =====================================================
          CAMERA CONTAINER
      ===================================================== */}

      <div
        className="
          group/camera
          relative
          overflow-hidden
          rounded-2xl

          border-2
          border-emerald-400/70

          bg-slate-100

          shadow-lg
          shadow-emerald-500/10

          dark:border-emerald-500/40
          dark:bg-slate-950

          transition-all
          duration-500

          hover:border-indigo-400
          hover:shadow-xl
          hover:shadow-indigo-500/10

          dark:hover:border-indigo-500/60
        "
      >

        {/* ===================================================
            WEBCAM
        =================================================== */}

        <Webcam
          audio={false}
          mirrored
          screenshotFormat="image/jpeg"
          className="
            block
            h-auto
            min-h-[280px]
            w-full
            object-cover

            transition-transform
            duration-700

            group-hover/camera:scale-[1.02]
          "
        />


        {/* ===================================================
            DARK OVERLAY
        =================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0

            bg-gradient-to-t
            from-slate-950/30
            via-transparent
            to-slate-950/10

            opacity-0

            transition-opacity
            duration-500

            group-hover/camera:opacity-100
          "
        />


        {/* ===================================================
            DETECTION FRAME
        =================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-[10%]

            rounded-2xl

            border-2
            border-dashed
            border-indigo-400/80

            dark:border-indigo-400/70

            transition-all
            duration-500

            group-hover/camera:inset-[8%]
            group-hover/camera:border-indigo-300
          "
        >

          {/* TOP LEFT CORNER */}

          <span
            className="
              absolute
              left-0
              top-0
              h-6
              w-6

              -translate-x-[2px]
              -translate-y-[2px]

              border-l-4
              border-t-4
              border-indigo-500

              rounded-tl-lg

              dark:border-indigo-400
            "
          />

          {/* TOP RIGHT CORNER */}

          <span
            className="
              absolute
              right-0
              top-0
              h-6
              w-6

              translate-x-[2px]
              -translate-y-[2px]

              border-r-4
              border-t-4
              border-indigo-500

              rounded-tr-lg

              dark:border-indigo-400
            "
          />

          {/* BOTTOM LEFT CORNER */}

          <span
            className="
              absolute
              bottom-0
              left-0
              h-6
              w-6

              -translate-x-[2px]
              translate-y-[2px]

              border-b-4
              border-l-4
              border-indigo-500

              rounded-bl-lg

              dark:border-indigo-400
            "
          />

          {/* BOTTOM RIGHT CORNER */}

          <span
            className="
              absolute
              bottom-0
              right-0
              h-6
              w-6

              translate-x-[2px]
              translate-y-[2px]

              border-b-4
              border-r-4
              border-indigo-500

              rounded-br-lg

              dark:border-indigo-400
            "
          />

        </div>


        {/* ===================================================
            CAMERA ICON
        =================================================== */}

        <div
          className="
            absolute
            right-4
            top-4

            flex
            h-10
            w-10
            items-center
            justify-center

            rounded-xl

            border
            border-white/20

            bg-slate-950/50
            text-white

            backdrop-blur-md

            shadow-lg

            transition-all
            duration-300

            group-hover/camera:scale-110
            group-hover/camera:bg-indigo-600
            group-hover/camera:border-indigo-400
          "
        >

          <FaCamera
            size={17}
            className="
              transition-transform
              duration-300

              group-hover/camera:rotate-6
            "
          />

        </div>


        {/* ===================================================
            DETECTION STATUS
        =================================================== */}

        <div
          className="
            absolute
            bottom-4
            left-4

            flex
            items-center
            gap-2

            rounded-full

            border
            border-white/20

            bg-slate-950/60

            px-3
            py-1.5

            text-xs
            font-medium
            text-white

            backdrop-blur-md

            transition-all
            duration-300

            group-hover/camera:bg-indigo-600/80
          "
        >

          <span
            className="
              h-2
              w-2
              rounded-full
              bg-emerald-400

              shadow
              shadow-emerald-400/60

              animate-pulse
            "
          />

          Detecting hand gestures

        </div>


        {/* ===================================================
            SCAN LINE
        =================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            left-[10%]
            right-[10%]
            top-[10%]

            h-[2px]

            bg-gradient-to-r
            from-transparent
            via-indigo-400
            to-transparent

            opacity-0

            transition-opacity
            duration-300

            group-hover/camera:opacity-80

            animate-[scan_3s_ease-in-out_infinite]
          "
        />

      </div>


      {/* =====================================================
          FOOTER INFO
      ===================================================== */}

      <div
        className="
          mt-4
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
        "
      >

        {/* CAMERA STATUS */}

        <div
          className="
            flex
            items-center
            gap-2

            text-xs
            text-slate-500

            dark:text-slate-400
          "
        >

          <span
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg

              bg-slate-100
              text-slate-500

              dark:bg-slate-800
              dark:text-slate-400
            "
          >
            <FaCamera size={12} />
          </span>

          Camera connected

        </div>


        {/* AI STATUS */}

        <div
          className="
            flex
            items-center
            gap-2

            text-xs
            font-medium

            text-indigo-600

            dark:text-indigo-400
          "
        >

          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-indigo-500

              animate-pulse
            "
          />

          AI Ready

        </div>

      </div>

    </div>
  );
};

export default WebcamSection;