import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
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
        <div className="auth-orb" style={{ width: 260, height: 260, left: "-60px", top: "12%", background: "radial-gradient(circle, rgba(140,119,245,0.65), transparent 65%)" }} />
        <div className="auth-orb" style={{ width: 200, height: 200, right: "-30px", bottom: "14%", background: "radial-gradient(circle, rgba(232,70,124,0.45), transparent 65%)", animationDelay: "-4s" }} />

        <div className="brand-link" style={{ color: "#fff" }}>
          <img
            src="/logo.png"
            alt="SignAI Logo"
            className="brand-mark"
            style={{ width: "36px", height: "36px", objectFit: "contain", borderRadius: "8px", background: "rgba(255,255,255,0.08)", padding: "4px" }}
          />
          <span>SignAI</span>
        </div>

        <div style={{ position: "relative", zIndex: 2, maxWidth: 520 }}>
          <span className="badge" style={{ background: "rgba(255,255,255,0.12)", color: "#EDE7FF" }}>
            Create your workspace
          </span>
          <h2 className="mt-4">Start signing in minutes.</h2>
          <p className="mt-4">
            One account keeps your recognition history, saved phrases and
            feedback corrections together across every device.
          </p>

          <div className="grid grid-3 mt-8" style={{ maxWidth: 480 }}>
            {[
              ["26", "A–Z classes"],
              ["93.6%", "Test accuracy"],
              ["5s", "Auto refresh"],
            ].map(([value, label], index) => (
              <motion.div
                key={label}
                className="card"
                style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.14)", boxShadow: "none", padding: 14 }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              >
                <div className="stat-value" style={{ color: "#fff", fontSize: "var(--fs-xl)", marginTop: 0 }}>{value}</div>
                <div className="text-xs" style={{ color: "rgba(245,242,255,0.66)" }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="auth-demo card" style={{ padding: 16, background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.16)", boxShadow: "none", maxWidth: 340 }}>
            <span className="text-xs" style={{ color: "rgba(245,242,255,0.7)" }}>Session preview</span>
            <div className="row mt-2" style={{ gap: 6 }}>
              {["H", "E", "L", "L", "O"].map((letter, idx) => (
                <span key={`${letter}-${idx}`} className="badge" style={{ background: "rgba(255,255,255,0.16)", color: "#fff", fontFamily: "var(--font-display)", fontSize: "0.85rem" }}>
                  {letter}
                </span>
              ))}
              <span className="badge badge-ok">94%</span>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-card" style={{ width: "min(500px, 100%)" }}>
          <div className="row row-between mb-4">
            <span className="eyebrow">New account</span>
            <ThemeToggle />
          </div>

          <div className="card" style={{ padding: "clamp(22px, 4vw, 34px)" }}>
            <h1 style={{ fontSize: "var(--fs-2xl)" }}>Create your account</h1>
            <p className="text-sm text-soft mt-1">
              Start recognising signs in a few minutes.
            </p>

            {error && (
              <div className="alert alert-err mt-4" role="alert">
                <b>Could not create the account</b>
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-ok mt-4" role="status">
                <b>Account created</b>
                {success}
              </div>
            )}

            <form onSubmit={handleRegister} className="mt-4" noValidate>
              <div className="field">
                <label className="label" htmlFor="register-name">Full name</label>
                <input
                  id="register-name"
                  name="fullName"
                  className="input"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={form.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="register-email">Email</label>
                <input
                  id="register-email"
                  name="email"
                  className="input"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="register-password">Password</label>
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
                    style={{ paddingRight: 74 }}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ position: "absolute", right: 6, top: 6, bottom: 6 }}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {form.password && (
                  <div className="mt-2">
                    <div className="row row-between">
                      <span className="hint" style={{ marginTop: 0 }}>Password strength</span>
                      <span className={`badge ${passwordStrength.badge}`}>{passwordStrength.label}</span>
                    </div>
                    <motion.div
                      className="meter"
                      aria-hidden="true"
                      initial={false}
                    >
                      <motion.i
                        animate={{ width: `${passwordStrength.percent}%` }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ background: passwordStrength.percent === 100 ? "var(--ok)" : passwordStrength.percent === 66 ? "var(--warn)" : "var(--err)" }}
                      />
                    </motion.div>
                  </div>
                )}
              </div>

              <div className="field">
                <label className="label" htmlFor="register-confirm">Confirm password</label>
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
                    style={{ paddingRight: 74 }}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ position: "absolute", right: 6, top: 6, bottom: 6 }}
                    onClick={() => setShowConfirmPassword((value) => !value)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="text-sm text-soft mt-6" style={{ textAlign: "center" }}>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
