import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeIcon = ({ dark }) => (
  <motion.span
    key={dark ? "moon" : "sun"}
    initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
    animate={{ rotate: 0, opacity: 1, scale: 1 }}
    transition={{ duration: 0.2 }}
    style={{ display: "inline-flex" }}
  >
    {dark ? <Moon size={11} strokeWidth={2.6} /> : <Sun size={11} strokeWidth={2.6} />}
  </motion.span>
);

const ThemeToggle = ({ compact = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className="theme-toggle-label">{isDark ? "Light" : "Dark"}</span>
      <span className={`theme-toggle-track ${isDark ? "on" : ""}`} aria-hidden="true">
        <motion.span
          className="theme-toggle-knob"
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
        >
          <ThemeIcon dark={isDark} />
        </motion.span>
      </span>
      {!compact && <span className="sr-only">Toggle colour theme</span>}
    </button>
  );
};

export default ThemeToggle;
