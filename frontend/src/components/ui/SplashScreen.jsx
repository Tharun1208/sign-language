import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const SplashScreen = ({ onComplete, duration = 2000 }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
    }, duration);

    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        setExiting(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [duration]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!exiting && (
        <motion.div
          key="splash-screen"
          className="splash-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(circle at 50% 40%, #1A1440 0%, #100C29 55%, #070512 100%)",
            color: "#FFFFFF",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => setExiting(true)}
        >
          {/* Background Ambient Orbs */}
          <div
            style={{
              position: "absolute",
              width: "clamp(300px, 50vw, 550px)",
              height: "clamp(300px, 50vw, 550px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(140, 119, 245, 0.35) 0%, transparent 70%)",
              filter: "blur(60px)",
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(232, 70, 124, 0.22) 0%, transparent 70%)",
              filter: "blur(50px)",
              bottom: "10%",
              right: "15%",
              pointerEvents: "none",
            }}
          />

          {/* Centered Animated Logo */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Animated Pulsing Ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                width: 150,
                height: 150,
                borderRadius: "34px",
                border: "2px solid rgba(168, 145, 255, 0.45)",
                filter: "drop-shadow(0 0 20px rgba(140, 119, 245, 0.5))",
                pointerEvents: "none",
              }}
            />

            {/* Glowing Logo Card */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 22,
                delay: 0.1,
              }}
              style={{
                width: 108,
                height: 108,
                borderRadius: "26px",
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 14,
                boxShadow:
                  "0 24px 48px rgba(0, 0, 0, 0.5), 0 0 35px rgba(124, 92, 252, 0.4)",
              }}
            >
              <motion.img
                src="/logo.png"
                alt="SignAI Logo"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.3))",
                }}
              />
            </motion.div>
          </div>

          {/* Brand Heading & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{
              textAlign: "center",
              marginTop: 28,
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <h1
                style={{
                  fontFamily:
                    "var(--font-display, 'Bricolage Grotesque', system-ui, sans-serif)",
                  fontSize: "clamp(2rem, 5vw, 2.75rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#FFFFFF",
                  margin: 0,
                  textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                }}
              >
                SignAI
              </h1>
              <motion.div
                animate={{ rotate: [0, 12, -12, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles size={22} color="#C4B5FD" />
              </motion.div>
            </div>

            <p
              style={{
                fontSize: "clamp(0.85rem, 2.2vw, 1rem)",
                color: "rgba(237, 231, 255, 0.75)",
                margin: "10px 0 0",
                letterSpacing: "0.01em",
                fontWeight: 500,
              }}
            >
              AI-Powered Sign Language Recognition
            </p>
          </motion.div>

          {/* Loading Shimmer Bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 150 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            style={{
              height: 3,
              background: "rgba(255, 255, 255, 0.12)",
              borderRadius: 6,
              overflow: "hidden",
              marginTop: 32,
              position: "relative",
            }}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 1.15,
                ease: "easeInOut",
              }}
              style={{
                width: "55%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, #A78BFA, transparent)",
              }}
            />
          </motion.div>

          {/* Subtle click/tap prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1, duration: 0.4 }}
            style={{
              position: "absolute",
              bottom: 28,
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.5)",
              display: "flex",
              alignItems: "center",
              gap: 4,
              letterSpacing: "0.04em",
            }}
          >
            <span>Click anywhere to continue</span>
            <ArrowRight size={12} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
