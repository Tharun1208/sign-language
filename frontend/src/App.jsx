import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";
import Register from "./pages/Register";
import About from "./pages/About";
import Analytics from "./pages/Analytics";
import LiveRecognition from "./pages/LiveRecognition";
import ImageRecognition from "./pages/ImageRecognition";
import Settings from "./pages/Settings";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/live-recognition"
            element={<LiveRecognition />}
          />

          <Route
            path="/image-recognition"
            element={<ImageRecognition />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;