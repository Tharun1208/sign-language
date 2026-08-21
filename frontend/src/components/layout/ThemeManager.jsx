import { useEffect, useState } from "react";

const ThemeManager = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    return savedTheme === "light" ? "light" : "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleThemeChange = (event) => {
      const newTheme = event.detail;

      if (newTheme === "light" || newTheme === "dark") {
        setTheme(newTheme);
      }
    };

    window.addEventListener(
      "themeChange",
      handleThemeChange
    );

    return () => {
      window.removeEventListener(
        "themeChange",
        handleThemeChange
      );
    };
  }, []);

  return null;
};

export default ThemeManager;