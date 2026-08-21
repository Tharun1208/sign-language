import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// =========================================
// APPLY SAVED THEME BEFORE APP LOADS
// =========================================

const savedTheme = localStorage.getItem("signai-theme") || "dark";

const applyTheme = (theme) => {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else if (theme === "system") {
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    root.classList.toggle("dark", systemDark);
  }
};

applyTheme(savedTheme);

// =========================================
// RENDER APP
// =========================================

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);