import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import ThemeToggle from "../components/ui/ThemeToggle";
import SplashScreen from "../components/ui/SplashScreen";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showSplash, setShowSplash] = useState(true);

  const [email, setEmail] = useState(() => location.state?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(() => location.state?.message || "");

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const redirectAfterLogin = () => {
    const redirect = localStorage.getItem("redirectAfterLogin") || "/dashboard";
    localStorage.removeItem("redirectAfterLogin");
    navigate(redirect, { replace: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      setError("Please enter your email and password.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await login(cleanEmail, cleanPassword);
      setSuccess(data?.message || "Login successful. Redirecting...");
      setTimeout(() => {
        redirectAfterLogin();
      }, 500);
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err?.message ||
          err?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Visual Brand Panel (Left on Desktop) */}
      <section className="auth-visual">
        <div
          className="auth-orb"
          style={{
            width: 280,
            height: 280,
            left: "-50px",
            top: "10%",
            background: "radial-gradient(circle, rgba(140,119,245,0.65), transparent 65%)",
          }}
        />
        <div
          className="auth-orb"
          style={{
            width: 220,
            height: 220,
            right: "-40px",
            bottom: "12%",
            background: "radial-gradient(circle, rgba(232,70,124,0.45), transparent 65%)",
            animationDelay: "-3.5s",
          }}
        />

        <div className="brand-link" style={{ color: "#fff" }}>
          <img
            src="/logo.png"
            alt="SignAI Logo"
            className="brand-mark"
            style={{
              width: "36px",
              height: "36px",
              objectFit: "contain",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.08)",
              padding: "4px",
            }}
          />
          <span>SignAI</span>
        </div>

        <div style={{ position: "relative", zIndex: 2, maxWidth: 520, margin: "auto 0" }}>
          <span
            className="badge"
            style={{
              background: "rgba(255,255,255,0.12)",
              color: "#EDE7FF",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Sparkles size={12} />
            AI-Powered ISL Recognition
          </span>
          <h2 className="mt-3" style={{ fontSize: "clamp(1.75rem, 2.6vw, 2.4rem)", lineHeight: 1.15 }}>
            Bridge communication in real time.
          </h2>
          <p className="mt-2 text-soft" style={{ fontSize: "0.875rem", lineHeight: 1.45 }}>
            Instant sign language detection, intelligent sentence formation,
            and complete session history in one connected platform.
          </p>

          <div style={{ maxWidth: 360, display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["26", "A–Z Alphabets"],
                ["93.6%", "Model Accuracy"],
              ].map(([value, label], index) => (
                <motion.div
                  key={label}
                  className="card"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.14)",
                    boxShadow: "none",
                    padding: "12px 14px",
                    margin: 0,
                  }}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                >
                  <div
                    className="stat-value"
                    style={{ color: "#fff", fontSize: "1.35rem", marginTop: 0 }}
                  >
                    {value}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(245,242,255,0.66)", marginTop: 2 }}>
                    {label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div
              className="auth-demo card"
              style={{
                padding: "12px 14px",
                background: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.16)",
                boxShadow: "none",
                margin: 0,
              }}
            >
              <div className="row row-between">
                <span className="text-xs" style={{ color: "rgba(245,242,255,0.7)" }}>
                  Live detection preview
                </span>
                <span className="badge badge-ok" style={{ fontSize: "0.7rem", padding: "1px 6px" }}>Ready</span>
              </div>
              <div className="row mt-2" style={{ gap: 6 }}>
                {["S", "I", "G", "N", "A", "I"].map((letter, idx) => (
                  <span
                    key={`${letter}-${idx}`}
                    className="badge"
                    style={{
                      background: "rgba(255,255,255,0.16)",
                      color: "#fff",
                      fontFamily: "var(--font-display)",
                      fontSize: "0.8rem",
                      padding: "2px 7px",
                    }}
                  >
                    {letter}
                  </span>
                ))}
                <span className="badge badge-primary" style={{ fontSize: "0.75rem", padding: "2px 6px" }}>94%</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 2 }}>
          <span className="text-xs" style={{ color: "rgba(245,242,255,0.45)" }}>
            SignAI · Real-time ISL Gesture Translation
          </span>
        </div>
      </section>

      {/* Form Panel (Right) */}
      <section className="auth-form-side">
        <div className="auth-card" style={{ width: "min(440px, 100%)" }}>
          <div className="row mb-2" style={{ justifyContent: "flex-end" }}>
            <ThemeToggle />
          </div>

          <div className="card" style={{ padding: "clamp(20px, 2.8vh, 28px) clamp(20px, 3vw, 32px)" }}>
            <span className="eyebrow" style={{ fontSize: "0.75rem" }}>Sign In</span>
            <h1 className="mt-1" style={{ fontSize: "clamp(1.35rem, 2vw, 1.65rem)", lineHeight: 1.2 }}>
              Welcome back
            </h1>
            <p className="text-xs text-soft mt-1">
              Enter your credentials to access your SignAI workspace.
            </p>

            {error && (
              <div className="alert alert-err mt-3" style={{ padding: "8px 12px", fontSize: "0.8rem" }} role="alert">
                <AlertCircle size={15} className="shrink-0" />
                <div>
                  <b>Could not sign in</b>
                  <div>{error}</div>
                </div>
              </div>
            )}

            {success && (
              <div className="alert alert-ok mt-3" style={{ padding: "8px 12px", fontSize: "0.8rem" }} role="status">
                <CheckCircle2 size={15} className="shrink-0" />
                <div>
                  <b>Success</b>
                  <div>{success}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-3" noValidate>
              <div className="field">
                <label className="label" htmlFor="login-email" style={{ fontSize: "0.8rem", marginBottom: 4 }}>
                  Email address
                </label>
                <input
                  id="login-email"
                  name="email"
                  className="input"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                  style={{ height: 38, fontSize: "0.875rem" }}
                />
              </div>

              <div className="field" style={{ marginTop: 10 }}>
                <div className="row row-between mb-1">
                  <label className="label" htmlFor="login-password" style={{ marginBottom: 0, fontSize: "0.8rem" }}>
                    Password
                  </label>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ padding: "0 4px", fontSize: "0.75rem" }}
                    onClick={() =>
                      setError("Password reset is not configured yet. Please contact support.")
                    }
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    id="login-password"
                    name="password"
                    className="input"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    required
                    style={{ paddingRight: 64, height: 38, fontSize: "0.875rem" }}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ position: "absolute", right: 4, top: 4, bottom: 4, padding: "0 6px" }}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block mt-4"
                style={{ height: 40, fontSize: "0.875rem" }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner spinner-sm" aria-hidden="true" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="divider mt-4 mb-3" />

            <p className="text-xs text-soft" style={{ textAlign: "center" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ fontWeight: "var(--fw-semibold)" }}>
                Create an account
              </Link>
            </p>

            <div
              className="row mt-3"
              style={{
                justifyContent: "center",
                gap: 6,
                color: "var(--ink-3)",
                fontSize: "0.725rem",
              }}
            >
              <ShieldCheck size={13} style={{ color: "var(--ok)" }} />
              <span>Secure encrypted session</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
