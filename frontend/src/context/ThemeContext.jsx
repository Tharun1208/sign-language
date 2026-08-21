import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem("signai-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (selectedTheme) => {
      if (selectedTheme === "dark") {
        root.classList.add("dark");
        return;
      }

      if (selectedTheme === "light") {
        root.classList.remove("dark");
        return;
      }

      if (selectedTheme === "system") {
        const mediaQuery = window.matchMedia(
          "(prefers-color-scheme: dark)"
        );

        root.classList.toggle("dark", mediaQuery.matches);
      }
    };

    applyTheme(theme);

    try {
      localStorage.setItem("signai-theme", theme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleChange = (event) => {
      document.documentElement.classList.toggle(
        "dark",
        event.matches
      );
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  const setTheme = (newTheme) => {
    if (!["light", "dark", "system"].includes(newTheme)) {
      console.warn("Invalid theme:", newTheme);
      return;
    }

    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
};