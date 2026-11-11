import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-wrap">
        <div className="stack" style={{ alignItems: "center" }}>
          <span className="spinner spinner-lg" role="status" aria-label="Loading" />
          <p className="text-sm text-muted">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    try {
      localStorage.setItem("redirectAfterLogin", location.pathname);
    } catch {
      // ignore
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
