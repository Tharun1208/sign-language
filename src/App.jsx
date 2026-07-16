import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import LiveRecognition from "./pages/LiveRecognition";
import ImageRecognition from "./pages/ImageRecognition";
import Analytics from "./pages/Analytics";
import About from "./pages/About";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/live-recognition"
          element={
            <ProtectedRoute>
              <LiveRecognition />
            </ProtectedRoute>
          }
        />

        <Route
          path="/image-recognition"
          element={
            <ProtectedRoute>
              <ImageRecognition />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route path="/about" element={<About />} />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;