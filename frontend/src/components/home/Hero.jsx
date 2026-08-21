import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Sparkles,
    ArrowRight,
    ScanLine,
} from "lucide-react";

const Hero = () => {
    const navigate = useNavigate();

    const handleStartRecognition = () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if (isLoggedIn) {
            navigate("/dashboard");
        } else {
            localStorage.setItem(
                "redirectAfterLogin",
                "/dashboard"
            );

            navigate("/login");
        }
    };

    const handleLearnMore = () => {
        const section = document.getElementById("features");

        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <section
            className="
                relative
                min-h-screen
                overflow-hidden

                flex
                items-center

                pt-24
                pb-16
                px-5

                sm:px-8
                lg:px-12

                bg-white
                text-slate-900

                dark:bg-slate-950
                dark:text-white

                transition-colors
                duration-300
            "
        >

            {/* =====================================================
                BACKGROUND GLOW
            ===================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -top-40
                    -left-40

                    h-96
                    w-96

                    rounded-full

                    bg-blue-500/10
                    blur-3xl

                    dark:bg-blue-500/10
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-40
                    -right-40

                    h-96
                    w-96

                    rounded-full

                    bg-indigo-500/10
                    blur-3xl

                    dark:bg-indigo-500/10
                "
            />

            {/* =====================================================
                MAIN CONTAINER
            ===================================================== */}

            <div
                className="
                    relative
                    z-10

                    max-w-7xl
                    mx-auto
                    w-full

                    grid
                    lg:grid-cols-2

                    gap-12
                    lg:gap-20

                    items-center
                "
            >

                {/* =================================================
                    LEFT CONTENT
                ================================================= */}

                <motion.div
                    initial={{
                        x: -60,
                        opacity: 0,
                    }}
                    animate={{
                        x: 0,
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                    }}
                >

                    {/* =================================================
                        AI BADGE
                    ================================================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.2,
                            duration: 0.5,
                        }}
                        className="
                            inline-flex
                            items-center
                            gap-2

                            rounded-full

                            border

                            border-blue-200
                            bg-blue-50

                            px-4
                            py-2

                            text-sm
                            font-semibold

                            text-blue-600

                            shadow-sm
                            shadow-blue-500/10

                            dark:border-blue-500/20
                            dark:bg-blue-500/10
                            dark:text-blue-400
                        "
                    >
                        <span
                            className="
                                relative
                                flex
                                h-2
                                w-2
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

                                    bg-blue-500
                                    opacity-75
                                "
                            />

                            <span
                                className="
                                    relative
                                    inline-flex
                                    h-2
                                    w-2

                                    rounded-full

                                    bg-blue-600

                                    dark:bg-blue-400
                                "
                            />
                        </span>

                        <Sparkles size={15} />

                        AI Powered
                    </motion.div>


                    {/* =================================================
                        HEADING
                    ================================================= */}

                    <h1
                        className="
                            mt-6

                            max-w-3xl

                            text-4xl
                            font-extrabold

                            leading-[1.1]

                            tracking-tight

                            text-slate-900

                            sm:text-5xl
                            md:text-6xl
                            lg:text-6xl
                            xl:text-7xl

                            dark:text-white
                        "
                    >
                        Sign Language

                        <span
                            className="
                                block

                                bg-gradient-to-r
                                from-blue-600
                                via-indigo-600
                                to-purple-600

                                bg-clip-text

                                text-transparent

                                dark:from-blue-400
                                dark:via-indigo-400
                                dark:to-purple-400
                            "
                        >
                            Recognition
                        </span>
                    </h1>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <p
                        className="
                            mt-6

                            max-w-2xl

                            text-base
                            leading-7

                            text-slate-600

                            sm:text-lg
                            sm:leading-8

                            dark:text-slate-400
                        "
                    >
                        Real-time sign language recognition powered by
                        Enhanced Neural Networks, MediaPipe, and
                        Computer Vision — transforming hand gestures
                        into meaningful text.
                    </p>


                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div
                        className="
                            mt-8

                            flex
                            flex-col
                            gap-3

                            sm:flex-row
                            sm:gap-4
                        "
                    >

                        {/* START RECOGNITION */}

                        <motion.button
                            whileHover={{
                                y: -3,
                            }}
                            whileTap={{
                                scale: 0.97,
                            }}
                            onClick={handleStartRecognition}
                            className="
                                group

                                inline-flex
                                items-center
                                justify-center
                                gap-2

                                rounded-xl

                                bg-blue-600

                                px-7
                                py-3.5

                                font-semibold
                                text-white

                                shadow-lg
                                shadow-blue-600/20

                                transition-all
                                duration-300

                                hover:bg-blue-700
                                hover:shadow-xl
                                hover:shadow-blue-600/30

                                dark:bg-blue-600
                                dark:hover:bg-blue-500
                            "
                        >
                            <ScanLine
                                size={18}
                                className="
                                    transition-transform
                                    duration-300

                                    group-hover:scale-110
                                "
                            />

                            Start Recognition

                            <ArrowRight
                                size={17}
                                className="
                                    transition-transform
                                    duration-300

                                    group-hover:translate-x-1
                                "
                            />
                        </motion.button>


                        {/* LEARN MORE */}

                        <motion.button
                            whileHover={{
                                y: -3,
                            }}
                            whileTap={{
                                scale: 0.97,
                            }}
                            onClick={handleLearnMore}
                            className="
                                inline-flex
                                items-center
                                justify-center

                                rounded-xl

                                border

                                px-7
                                py-3.5

                                font-semibold

                                border-slate-300
                                bg-white
                                text-slate-700

                                shadow-sm

                                transition-all
                                duration-300

                                hover:border-blue-300
                                hover:bg-blue-50
                                hover:text-blue-600
                                hover:shadow-md

                                dark:border-slate-700
                                dark:bg-slate-900
                                dark:text-slate-200

                                dark:hover:border-blue-500/30
                                dark:hover:bg-blue-500/10
                                dark:hover:text-blue-400
                            "
                        >
                            Learn More
                        </motion.button>

                    </div>


                    {/* =================================================
                        SMALL TRUST TEXT
                    ================================================= */}

                    <div
                        className="
                            mt-7

                            flex
                            flex-wrap
                            items-center
                            gap-x-5
                            gap-y-2

                            text-xs
                            font-medium

                            text-slate-400

                            dark:text-slate-500
                        "
                    >
                        <span className="flex items-center gap-1.5">
                            <span
                                className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-emerald-500
                                "
                            />
                            Real-Time Detection
                        </span>

                        <span className="flex items-center gap-1.5">
                            <span
                                className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-blue-500
                                "
                            />
                            AI Powered
                        </span>

                        <span className="flex items-center gap-1.5">
                            <span
                                className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-purple-500
                                "
                            />
                            Computer Vision
                        </span>
                    </div>

                </motion.div>


                {/* =================================================
                    RIGHT IMAGE
                ================================================= */}

                <motion.div
                    initial={{
                        x: 60,
                        opacity: 0,
                        scale: 0.95,
                    }}
                    animate={{
                        x: 0,
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.9,
                        ease: "easeOut",
                    }}
                    className="
                        relative

                        flex
                        items-center
                        justify-center

                        min-h-[350px]

                        sm:min-h-[450px]

                        lg:min-h-[520px]
                    "
                >

                    {/* =================================================
                        IMAGE BACKGROUND GLOW
                    ================================================= */}

                    <div
                        className="
                            pointer-events-none
                            absolute

                            h-64
                            w-64

                            sm:h-80
                            sm:w-80

                            lg:h-96
                            lg:w-96

                            rounded-full

                            bg-blue-500/15

                            blur-3xl

                            dark:bg-blue-500/10
                        "
                    />


                    {/* =================================================
                        DECORATIVE RINGS
                    ================================================= */}

                    <motion.div
                        animate={{
                            rotate: 360,
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="
                            pointer-events-none
                            absolute

                            h-72
                            w-72

                            sm:h-96
                            sm:w-96

                            lg:h-[430px]
                            lg:w-[430px]

                            rounded-full

                            border

                            border-blue-500/10

                            dark:border-blue-400/10
                        "
                    />

                    <motion.div
                        animate={{
                            rotate: -360,
                        }}
                        transition={{
                            duration: 35,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="
                            pointer-events-none
                            absolute

                            h-56
                            w-56

                            sm:h-80
                            sm:w-80

                            lg:h-[360px]
                            lg:w-[360px]

                            rounded-full

                            border

                            border-dashed

                            border-indigo-500/10

                            dark:border-indigo-400/10
                        "
                    />


                    {/* =================================================
                        FLOATING DOT - TOP
                    ================================================= */}

                    <motion.div
                        animate={{
                            y: [0, -12, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="
                            absolute
                            right-[12%]
                            top-[12%]

                            h-3
                            w-3

                            rounded-full

                            bg-blue-500

                            shadow-lg
                            shadow-blue-500/40
                        "
                    />


                    {/* =================================================
                        FLOATING DOT - BOTTOM
                    ================================================= */}

                    <motion.div
                        animate={{
                            y: [0, 12, 0],
                        }}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="
                            absolute
                            bottom-[12%]
                            left-[12%]

                            h-2.5
                            w-2.5

                            rounded-full

                            bg-purple-500

                            shadow-lg
                            shadow-purple-500/40
                        "
                    />


                    {/* =================================================
                        HERO IMAGE
                    ================================================= */}

                    <motion.img
                        src="/hero.png"
                        alt="AI Sign Language Recognition"
                        animate={{
                            y: [0, -8, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        whileHover={{
                            scale: 1.03,
                        }}
                        className="
                            relative
                            z-10

                            w-[380px]
                            max-w-[90%]

                            sm:w-[460px]

                            lg:w-[520px]

                            drop-shadow-2xl

                            transition-transform
                            duration-500
                        "
                    />

                </motion.div>

            </div>
        </section>
    );
};

export default Hero;