import { useEffect } from "react";

// =========================================================
// LIGHT-ONLY THEME GUARD
// Kept for backwards compatibility. It always enforces the
// light theme and ignores any legacy theme events.
// =========================================================

const ThemeManager = () => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  }, []);

  return null;
};

export default ThemeManager;
