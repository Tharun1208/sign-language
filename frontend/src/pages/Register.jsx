import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If the user visits or navigates to register, mark splash as already seen
    sessionStorage.setItem("signai-splash-shown", "true");
  }, []);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordStrength = useMemo(() => {
    const password = form.password;
    if (!password) return { score: 0, label: "", percent: 0, badge: "" };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { score, label: "Weak", percent: 33, badge: "badge-err" };
    }
    if (score <= 4) {
      return { score, label: "Medium", percent: 66, badge: "badge-warn" };
    }
    return { score, label: "Strong", percent: 100, badge: "badge-ok" };
  }, [form.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!fullName || fullName.length < 2) {
      setError("Full name must contain at least 2 characters.");
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        fullName,
        email,
        password,
        confirmPassword,
      });

      setSuccess(
        response.data?.message ||
          "Account created successfully. Redirecting to login..."
      );

      setForm({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login", {
          state: {
            email,
            message: "Registration successful. Please sign in.",
          },
        });
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response) {
        setError(
          err.response.data?.message ||
            err.response.data?.error ||
            "Registration failed."
        );
      } else {
        setError("Unable to connect to the server. Please check backend status.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
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
            Create your workspace
          </span>
          <h2 className="mt-3" style={{ fontSize: "clamp(1.75rem, 2.6vw, 2.4rem)", lineHeight: 1.15 }}>
            Start signing in minutes.
          </h2>
          <p className="mt-2 text-soft" style={{ fontSize: "0.875rem", lineHeight: 1.45 }}>
            One account keeps your recognition history, saved phrases, and
            feedback corrections together across every device.
          </p>

          <div style={{ maxWidth: 360, display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
                    padding: 16,
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
                padding: 16,
                background: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.16)",
                boxShadow: "none",
                margin: 0,
              }}
            >
              <div className="row row-between">
                <span className="text-xs" style={{ color: "rgba(245,242,255,0.7)" }}>
                  Session preview
                </span>
                <span className="badge badge-ok" style={{ fontSize: "0.7rem", padding: "1px 6px" }}>Ready</span>
              </div>
              <div className="row mt-2" style={{ gap: 6 }}>
                {["H", "E", "L", "L", "O"].map((letter, idx) => (
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

      <section className="auth-form-side">
        <div className="auth-card" style={{ width: "min(460px, 100%)" }}>
          <div className="row mb-2" style={{ justifyContent: "flex-end" }}>
            <ThemeToggle />
          </div>

          <div className="card" style={{ padding: "clamp(20px, 2.5vh, 26px) clamp(20px, 3vw, 30px)" }}>
            <span className="eyebrow" style={{ fontSize: "0.75rem" }}>New Account</span>
            <h1 className="mt-1" style={{ fontSize: "clamp(1.35rem, 2vw, 1.65rem)", lineHeight: 1.2 }}>
              Create your account
            </h1>
            <p className="text-xs text-soft mt-1">
              Start recognising signs in a few minutes.
            </p>

            {error && (
              <div className="alert alert-err mt-3" style={{ padding: "8px 12px", fontSize: "0.8rem" }} role="alert">
                <AlertCircle size={15} className="shrink-0" />
                <div>
                  <b>Could not create account</b>
                  <div>{error}</div>
                </div>
              </div>
            )}

            {success && (
              <div className="alert alert-ok mt-3" style={{ padding: "8px 12px", fontSize: "0.8rem" }} role="status">
                <CheckCircle2 size={15} className="shrink-0" />
                <div>
                  <b>Account created</b>
                  <div>{success}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="mt-3" noValidate>
              <div className="field">
                <label className="label" htmlFor="register-name" style={{ fontSize: "0.8rem", marginBottom: 3 }}>
                  Full name
                </label>
                <input
                  id="register-name"
                  name="fullName"
                  className="input"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  style={{ height: 38, fontSize: "0.875rem" }}
                />
              </div>

              <div className="field" style={{ marginTop: 8 }}>
                <label className="label" htmlFor="register-email" style={{ fontSize: "0.8rem", marginBottom: 3 }}>
                  Email address
                </label>
                <input
                  id="register-email"
                  name="email"
                  className="input"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={{ height: 38, fontSize: "0.875rem" }}
                />
              </div>

              <div className="field" style={{ marginTop: 8 }}>
                <label className="label" htmlFor="register-password" style={{ fontSize: "0.8rem", marginBottom: 3 }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="register-password"
                    name="password"
                    className="input"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{ paddingRight: 64, height: 38, fontSize: "0.875rem" }}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ position: "absolute", right: 4, top: 4, bottom: 4, padding: "0 6px" }}
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {form.password && (
                  <div className="mt-1.5">
                    <div className="row row-between" style={{ fontSize: "0.725rem" }}>
                      <span className="hint" style={{ marginTop: 0, fontSize: "0.725rem" }}>Password strength</span>
                      <span className={`badge ${passwordStrength.badge}`} style={{ fontSize: "0.675rem", padding: "1px 5px" }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <motion.div
                      className="meter"
                      aria-hidden="true"
                      initial={false}
                      style={{ height: 3, marginTop: 3 }}
                    >
                      <motion.i
                        animate={{ width: `${passwordStrength.percent}%` }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          background:
                            passwordStrength.percent === 100
                              ? "var(--ok)"
                              : passwordStrength.percent === 66
                              ? "var(--warn)"
                              : "var(--err)",
                        }}
                      />
                    </motion.div>
                  </div>
                )}
              </div>

              <div className="field" style={{ marginTop: 8 }}>
                <label className="label" htmlFor="register-confirm" style={{ fontSize: "0.8rem", marginBottom: 3 }}>
                  Confirm password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="register-confirm"
                    name="confirmPassword"
                    className="input"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    style={{ paddingRight: 64, height: 38, fontSize: "0.875rem" }}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ position: "absolute", right: 4, top: 4, bottom: 4, padding: "0 6px" }}
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block mt-3"
                style={{ height: 40, fontSize: "0.875rem" }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner spinner-sm" aria-hidden="true" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="divider mt-3 mb-2" />

            <p className="text-xs text-soft" style={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ fontWeight: "var(--fw-semibold)" }}>
                Sign In
              </Link>
            </p>

            <div
              className="row mt-2"
              style={{
                justifyContent: "center",
                gap: 6,
                color: "var(--ink-3)",
                fontSize: "0.725rem",
              }}
            >
              <ShieldCheck size={13} style={{ color: "var(--ok)" }} />
              <span>Encrypted workspace data protection</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
