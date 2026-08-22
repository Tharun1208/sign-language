import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Brain,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Check,
  X,
  ArrowRight,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // PASSWORD STRENGTH
  // =========================================================

  const passwordStrength = useMemo(() => {
    const password = form.password;

    if (!password) {
      return {
        score: 0,
        label: "",
      };
    }

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        score,
        label: "Weak",
      };
    }

    if (score === 3) {
      return {
        score,
        label: "Medium",
      };
    }

    return {
      score,
      label: "Strong",
    };
  }, [form.password]);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================================================
  // REGISTER
  // =========================================================

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }

    if (fullName.length < 2) {
      setError("Full name must contain at least 2 characters.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

    // ---------------------------------------------------------
    // API REQUEST
    // ---------------------------------------------------------

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          fullName,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration response:", response.data);

      setSuccess(
        response.data?.message ||
          "Account created successfully. Redirecting to login..."
      );

      // Clear form
      setForm({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect after successful registration
      setTimeout(() => {
        navigate("/login", {
          state: {
            email,
            message: "Registration successful. Please login.",
          },
        });
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            err.response.data?.error ||
            "Registration failed. Please try again."
        );
      } else if (err.request) {
        setError(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-slate-50
        text-slate-900
        dark:bg-slate-950
        dark:text-white
        selection:bg-indigo-500/20
        selection:text-indigo-700
        dark:selection:text-indigo-300
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          -top-40
          h-[28rem]
          w-[28rem]
          rounded-full
          bg-indigo-500/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-40
          h-[30rem]
          w-[30rem]
          rounded-full
          bg-blue-500/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-72
          w-72
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-indigo-400/5
          blur-3xl
        "
      />

      {/* =====================================================
          GRID EFFECT
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
          dark:opacity-[0.04]
          [background-image:linear-gradient(#64748b_1px,transparent_1px),linear-gradient(90deg,#64748b_1px,transparent_1px)]
          [background-size:40px_40px]
        "
      />

      {/* =====================================================
          BACK TO HOME
      ===================================================== */}

      <div
        className="
          absolute
          left-3
          top-3
          z-30
          sm:left-6
          sm:top-6
        "
      >
        <Link
          to="/"
          className="
            group
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-transparent
            px-3
            py-2
            text-sm
            font-medium
            text-slate-600
            transition-all
            duration-300
            hover:-translate-x-1
            hover:border-slate-200
            hover:bg-white
            hover:text-indigo-600
            hover:shadow-lg
            dark:text-slate-400
            dark:hover:border-slate-800
            dark:hover:bg-slate-900
            dark:hover:text-indigo-400
          "
        >
          <ArrowLeft
            size={17}
            className="
              transition-transform
              duration-300
              group-hover:-translate-x-1
            "
          />

          <span>Back to Home</span>
        </Link>
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-4
          py-20
          sm:px-6
          sm:py-24
          lg:px-8
        "
      >
        <div className="w-full max-w-lg">

          {/* =================================================
              BRAND
          ================================================= */}

          <div
            className="
              mb-7
              text-center
              sm:mb-8
            "
          >
            <div
              className="
                group
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                border
                border-indigo-200
                bg-indigo-100
                text-indigo-600
                shadow-xl
                shadow-indigo-500/10
                transition-all
                duration-500
                hover:-translate-y-1
                hover:scale-105
                hover:rotate-2
                dark:border-indigo-500/20
                dark:bg-indigo-500/10
                dark:text-indigo-400
              "
            >
              <Brain
                size={31}
                className="
                  transition-transform
                  duration-500
                  group-hover:scale-110
                "
              />
            </div>

            <div
              className="
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <h1
                className="
                  text-3xl
                  font-extrabold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                "
              >
                SignAI
              </h1>

              <Sparkles
                size={18}
                className="
                  animate-pulse
                  text-indigo-500
                  dark:text-indigo-400
                "
              />
            </div>

            <p
              className="
                mx-auto
                mt-2
                max-w-sm
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              AI-Powered Sign Language Recognition
            </p>
          </div>

          {/* =================================================
              REGISTER CARD
          ================================================= */}

          <section
            className="
              group/card
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white/95
              p-5
              shadow-2xl
              shadow-slate-900/10
              backdrop-blur-xl
              transition-all
              duration-500
              hover:border-indigo-200
              hover:shadow-indigo-500/10
              dark:border-slate-800
              dark:bg-slate-900/95
              dark:shadow-black/30
              dark:hover:border-indigo-500/20
              sm:p-8
            "
          >
            {/* CARD GLOW */}

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-48
                w-48
                rounded-full
                bg-indigo-500/10
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-24
                -left-24
                h-48
                w-48
                rounded-full
                bg-blue-500/10
                blur-3xl
              "
            />

            <div className="relative">

              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="mb-7">

                <div
                  className="
                    mb-3
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-indigo-100
                    bg-indigo-50
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-indigo-600
                    dark:border-indigo-500/20
                    dark:bg-indigo-500/10
                    dark:text-indigo-400
                  "
                >
                  <Sparkles size={13} />
                  Get started
                </div>

                <h2
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-900
                    dark:text-white
                    sm:text-3xl
                  "
                >
                  Create your account
                </h2>

                <p
                  className="
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Create your SignAI account and start
                  exploring AI-powered sign language
                  recognition.
                </p>
              </div>

              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <div
                  className="
                    mb-5
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    leading-5
                    text-red-700
                    dark:border-red-500/20
                    dark:bg-red-500/10
                    dark:text-red-400
                  "
                >
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{error}</span>
                </div>
              )}

              {/* =================================================
                  SUCCESS
              ================================================= */}

              {success && (
                <div
                  className="
                    mb-5
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-emerald-200
                    bg-emerald-50
                    px-4
                    py-3
                    text-sm
                    leading-5
                    text-emerald-700
                    dark:border-emerald-500/20
                    dark:bg-emerald-500/10
                    dark:text-emerald-400
                  "
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{success}</span>
                </div>
              )}

              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleRegister}
                className="space-y-5"
              >

                {/* FULL NAME */}

                <div className="group/input">

                  <label
                    htmlFor="fullName"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={18}
                      className="
                        pointer-events-none
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition-colors
                        group-focus-within/input:text-indigo-500
                        dark:text-slate-500
                      "
                    />

                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={form.fullName}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                      disabled={isLoading}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        py-3.5
                        pl-11
                        pr-4
                        text-sm
                        text-slate-900
                        outline-none
                        placeholder:text-slate-400
                        transition-all
                        duration-300
                        hover:border-slate-300
                        focus:border-indigo-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-indigo-500/10
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-white
                        dark:placeholder:text-slate-500
                        dark:hover:border-slate-600
                        dark:focus:border-indigo-500
                        dark:focus:bg-slate-800
                      "
                    />
                  </div>
                </div>

                {/* EMAIL */}

                <div className="group/input">

                  <label
                    htmlFor="email"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="
                        pointer-events-none
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition-colors
                        group-focus-within/input:text-indigo-500
                        dark:text-slate-500
                      "
                    />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                      disabled={isLoading}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        py-3.5
                        pl-11
                        pr-4
                        text-sm
                        text-slate-900
                        outline-none
                        placeholder:text-slate-400
                        transition-all
                        duration-300
                        hover:border-slate-300
                        focus:border-indigo-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-indigo-500/10
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-white
                        dark:placeholder:text-slate-500
                        dark:hover:border-slate-600
                        dark:focus:border-indigo-500
                        dark:focus:bg-slate-800
                      "
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div className="group/input">

                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <label
                      htmlFor="password"
                      className="
                        text-sm
                        font-semibold
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      Password
                    </label>

                    {form.password && (
                      <span
                        className={`
                          text-xs
                          font-semibold
                          ${
                            passwordStrength.label ===
                            "Strong"
                              ? "text-emerald-500"
                              : passwordStrength.label ===
                                "Medium"
                              ? "text-amber-500"
                              : "text-red-500"
                          }
                        `}
                      >
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="
                        pointer-events-none
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition-colors
                        group-focus-within/input:text-indigo-500
                        dark:text-slate-500
                      "
                    />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      placeholder="Create a strong password"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                      disabled={isLoading}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        py-3.5
                        pl-11
                        pr-12
                        text-sm
                        text-slate-900
                        outline-none
                        placeholder:text-slate-400
                        transition-all
                        duration-300
                        hover:border-slate-300
                        focus:border-indigo-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-indigo-500/10
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-white
                        dark:placeholder:text-slate-500
                        dark:hover:border-slate-600
                        dark:focus:border-indigo-500
                        dark:focus:bg-slate-800
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      disabled={isLoading}
                      className="
                        absolute
                        right-2.5
                        top-1/2
                        -translate-y-1/2
                        rounded-lg
                        p-2
                        text-slate-400
                        transition-all
                        hover:bg-indigo-50
                        hover:text-indigo-600
                        disabled:cursor-not-allowed
                        dark:text-slate-500
                        dark:hover:bg-indigo-500/10
                        dark:hover:text-indigo-400
                      "
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {/* PASSWORD STRENGTH */}

                  {form.password && (
                    <div className="mt-3">

                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map(
                          (item) => (
                            <div
                              key={item}
                              className={`
                                h-1.5
                                flex-1
                                rounded-full
                                transition-all
                                duration-300
                                ${
                                  item <=
                                  passwordStrength.score
                                    ? passwordStrength.label ===
                                      "Strong"
                                      ? "bg-emerald-500"
                                      : passwordStrength.label ===
                                        "Medium"
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                    : "bg-slate-200 dark:bg-slate-700"
                                }
                              `}
                            />
                          )
                        )}
                      </div>

                      <p
                        className="
                          mt-2
                          text-xs
                          text-slate-400
                          dark:text-slate-500
                        "
                      >
                        Use 6+ characters with uppercase,
                        numbers, and symbols for a stronger
                        password.
                      </p>
                    </div>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}

                <div className="group/input">

                  <label
                    htmlFor="confirmPassword"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Confirm Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="
                        pointer-events-none
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition-colors
                        group-focus-within/input:text-indigo-500
                        dark:text-slate-500
                      "
                    />

                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                      disabled={isLoading}
                      className={`
                        w-full
                        rounded-xl
                        border
                        bg-slate-50
                        py-3.5
                        pl-11
                        pr-12
                        text-sm
                        text-slate-900
                        outline-none
                        placeholder:text-slate-400
                        transition-all
                        duration-300
                        dark:bg-slate-800
                        dark:text-white
                        dark:placeholder:text-slate-500
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        ${
                          form.confirmPassword &&
                          form.password !==
                            form.confirmPassword
                            ? `
                              border-red-300
                              focus:border-red-500
                              focus:ring-4
                              focus:ring-red-500/10
                              dark:border-red-500/40
                            `
                            : `
                              border-slate-200
                              hover:border-slate-300
                              focus:border-indigo-500
                              focus:bg-white
                              focus:ring-4
                              focus:ring-indigo-500/10
                              dark:border-slate-700
                              dark:hover:border-slate-600
                              dark:focus:border-indigo-500
                            `
                        }
                      `}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                      disabled={isLoading}
                      className="
                        absolute
                        right-2.5
                        top-1/2
                        -translate-y-1/2
                        rounded-lg
                        p-2
                        text-slate-400
                        transition-all
                        hover:bg-indigo-50
                        hover:text-indigo-600
                        disabled:cursor-not-allowed
                        dark:text-slate-500
                        dark:hover:bg-indigo-500/10
                        dark:hover:text-indigo-400
                      "
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {/* PASSWORD MATCH */}

                  {form.confirmPassword && (
                    <div
                      className={`
                        mt-2
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        font-medium
                        ${
                          form.password ===
                          form.confirmPassword
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      `}
                    >
                      {form.password ===
                      form.confirmPassword ? (
                        <>
                          <Check size={14} />
                          Passwords match
                        </>
                      ) : (
                        <>
                          <X size={14} />
                          Passwords do not match
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* SECURITY MESSAGE */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    dark:border-slate-800
                    dark:bg-slate-800/50
                  "
                >
                  <ShieldCheck
                    size={17}
                    className="
                      mt-0.5
                      shrink-0
                      text-emerald-500
                    "
                  />

                  <p
                    className="
                      text-xs
                      leading-5
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Your information is securely handled
                    and used only to provide your SignAI
                    account experience.
                  </p>
                </div>

                {/* CREATE ACCOUNT */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    group
                    relative
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    overflow-hidden
                    rounded-xl
                    bg-indigo-600
                    py-3.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-indigo-500/20
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-indigo-700
                    hover:shadow-xl
                    hover:shadow-indigo-500/25
                    active:translate-y-0
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                    disabled:hover:translate-y-0
                  "
                >
                  <span
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      -translate-x-full
                      bg-gradient-to-r
                      from-transparent
                      via-white/15
                      to-transparent
                      transition-transform
                      duration-700
                      group-hover:translate-x-full
                    "
                  />

                  <span
                    className="
                      relative
                      z-10
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-white/30
                            border-t-white
                          "
                        />

                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus
                          size={18}
                          className="
                            transition-transform
                            duration-300
                            group-hover:scale-110
                          "
                        />

                        Create Account

                        <ArrowRight
                          size={17}
                          className="
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                          "
                        />
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* LOGIN */}

              <div
                className="
                  mt-7
                  border-t
                  border-slate-200
                  pt-6
                  text-center
                  dark:border-slate-800
                "
              >
                <p
                  className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Already have an account?{" "}

                  <Link
                    to="/login"
                    className="
                      font-semibold
                      text-indigo-600
                      transition-all
                      duration-200
                      hover:text-indigo-700
                      hover:underline
                      hover:underline-offset-4
                      dark:text-indigo-400
                      dark:hover:text-indigo-300
                    "
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </section>

          {/* SECURITY */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-center
              gap-2
              px-4
              text-center
              text-xs
              font-medium
              text-slate-400
              dark:text-slate-500
            "
          >
            <ShieldCheck
              size={14}
              className="text-emerald-500"
            />

            Secure account creation with SignAI
          </div>

          {/* FOOTER */}

          <p
            className="
              mt-3
              text-center
              text-[11px]
              text-slate-400
              dark:text-slate-600
            "
          >
            By creating an account, you agree to use
            SignAI responsibly.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;