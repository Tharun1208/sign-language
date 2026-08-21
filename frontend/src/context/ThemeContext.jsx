import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  /*
   * Read the previously selected theme.
   * Default = dark
   */
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("signai-theme") || "dark";
  });

  /*
   * Apply theme to the entire application
   */
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (selectedTheme) => {
      if (selectedTheme === "dark") {
        root.classList.add("dark");
      } else if (selectedTheme === "light") {
        root.classList.remove("dark");
      } else if (selectedTheme === "system") {
        const systemDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

        root.classList.toggle("dark", systemDark);
      }
    };

    /*
     * Apply immediately
     */
    applyTheme(theme);

    /*
     * Save selected preference
     */
    localStorage.setItem("signai-theme", theme);

    /*
     * Listen for system theme changes
     */
    if (theme === "system") {
      const mediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

      const handleSystemThemeChange = (event) => {
        root.classList.toggle("dark", event.matches);
      };

      mediaQuery.addEventListener(
        "change",
        handleSystemThemeChange
      );

      return () => {
        mediaQuery.removeEventListener(
          "change",
          handleSystemThemeChange
        );
      };
    }
  }, [theme]);

  /*
   * Change theme
   */
  const changeTheme = (newTheme) => {
    if (!["light", "dark", "system"].includes(newTheme)) {
      return;
    }

    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/*
 * Custom hook
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
};