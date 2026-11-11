import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ui/ToastProvider";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import ScrollToTop from "./components/ui/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";

// Route-level code splitting keeps the first paint small.
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/Register"));
const About = lazy(() => import("./pages/About"));
const Analytics = lazy(() => import("./pages/Analytics"));
const LiveRecognition = lazy(() => import("./pages/LiveRecognition"));
const ImageRecognition = lazy(() => import("./pages/ImageRecognition"));
const VideoTranslation = lazy(() => import("./pages/VideoTranslation"));
const SignDictionary = lazy(() => import("./pages/SignDictionary"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const routes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/about", element: <About /> },
  { path: "/live-recognition", element: <LiveRecognition /> },
  { path: "/image-recognition", element: <ImageRecognition /> },
  { path: "/video-translation", element: <VideoTranslation /> },
  { path: "/dictionary", element: <SignDictionary /> },
  { path: "/analytics", element: <Analytics /> },
  { path: "/settings", element: <Settings /> },
];

const FullPageLoader = () => (
  <div className="full-loader" role="status" aria-live="polite">
    <span className="spinner spinner-lg" aria-hidden="true" />
    <span className="text-sm text-muted">Loading SignAI…</span>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <ScrollToTop />
            <ErrorBoundary>
              <Suspense fallback={<FullPageLoader />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    {routes.map((route) => (
                      <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
