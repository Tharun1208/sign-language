import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Brain,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();

  const googleButtonRef = useRef(null);
  const googleInitializedRef = useRef(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // REDIRECT AFTER LOGIN
  // =========================================================

  const redirectAfterLogin = () => {
    const redirect =
      localStorage.getItem("redirectAfterLogin") ||
      "/dashboard";

    localStorage.removeItem("redirectAfterLogin");

    navigate(redirect, {
      replace: true,
    });
  };

  // =========================================================
  // SAVE USER SESSION
  // =========================================================

  const saveUserSession = (data) => {
    localStorage.setItem("isLoggedIn", "true");

    if (data?.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("authToken", data.token);
    }

    if (data?.user) {
      localStorage.setItem(
        "signai-user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      const profileImage =
        data.user.picture ||
        data.user.profileImage ||
        data.user.image ||
        "";

      if (profileImage) {
        localStorage.setItem(
          "signai-profile-image",
          profileImage
        );
      }
    }
  };

  // =========================================================
  // NORMAL EMAIL/PASSWORD LOGIN
  // =========================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: cleanEmail,
            password: cleanPassword,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Invalid email or password."
        );
      }

      if (!data.token) {
        throw new Error(
          "Login successful, but authentication token was not received."
        );
      }

      saveUserSession(data);

      setSuccess(
        data.message ||
          "Login successful."
      );

      setTimeout(() => {
        redirectAfterLogin();
      }, 500);

    } catch (err) {
      console.error(
        "Login Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // GOOGLE RESPONSE
  // =========================================================

  const handleGoogleResponse = async (response) => {
    console.log(
      "Google credential received"
    );

    if (!response?.credential) {
      setGoogleLoading(false);

      setError(
        "Google authentication failed. No credential received."
      );

      return;
    }

    try {
      setGoogleLoading(true);

      setError("");
      setSuccess("");

      console.log(
        "Sending Google credential to backend..."
      );

      const result = await fetch(
        `${API_URL}/api/auth/google`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            credential: response.credential,
          }),
        }
      );

      let data = {};

      try {
        data = await result.json();
      } catch {
        data = {};
      }

      console.log(
        "Google backend response:",
        data
      );

      if (!result.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Google login failed."
        );
      }

      if (!data.token) {
        throw new Error(
          "Google login succeeded, but authentication token was not received."
        );
      }

      saveUserSession(data);

      setSuccess(
        data.message ||
          "Google login successful."
      );

      setTimeout(() => {
        redirectAfterLogin();
      }, 500);

    } catch (err) {
      console.error(
        "Google Login Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to sign in with Google."
      );

      setGoogleLoading(false);
    }
  };

  // =========================================================
  // GOOGLE IDENTITY SERVICES
  // =========================================================

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error(
        "VITE_GOOGLE_CLIENT_ID is missing."
      );

      setError(
        "Google Sign-In is not configured."
      );

      return;
    }

    let cancelled = false;

    const initializeGoogle = () => {
      if (cancelled) {
        return;
      }

      if (!window.google?.accounts?.id) {
        console.warn(
          "Google Identity Services is not ready yet."
        );

        return;
      }

      if (!googleButtonRef.current) {
        console.warn(
          "Google button container is not ready."
        );

        return;
      }

      // Prevent duplicate initialization
      if (googleInitializedRef.current) {
        console.log(
          "Google Sign-In already initialized."
        );

        return;
      }

      try {
        googleInitializedRef.current = true;

        console.log(
          "Initializing Google Identity Services..."
        );

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,

          callback: handleGoogleResponse,

          auto_select: false,

          cancel_on_tap_outside: true,
        });

        // Clear previous button
        googleButtonRef.current.innerHTML = "";

        // Render REAL Google button
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: "outline",
            size: "large",
            width: 400,
            text: "continue_with",
            shape: "rectangular",
            logo_alignment: "left",
          }
        );

        console.log(
          "Google Sign-In initialized successfully."
        );

      } catch (err) {
        console.error(
          "Google initialization error:",
          err
        );

        googleInitializedRef.current = false;

        setError(
          "Unable to initialize Google Sign-In."
        );
      }
    };

    // -------------------------------------------------------
    // Google script already exists
    // -------------------------------------------------------

    const existingScript =
      document.getElementById(
        "google-identity-script"
      );

    if (existingScript) {
      console.log(
        "Google Identity script already exists."
      );

      if (window.google?.accounts?.id) {
        initializeGoogle();
      } else {
        existingScript.addEventListener(
          "load",
          initializeGoogle
        );
      }

      return () => {
        cancelled = true;

        existingScript.removeEventListener(
          "load",
          initializeGoogle
        );
      };
    }

    // -------------------------------------------------------
    // Create Google script
    // -------------------------------------------------------

    console.log(
      "Loading Google Identity Services..."
    );

    const script =
      document.createElement("script");

    script.id =
      "google-identity-script";

    script.src =
      "https://accounts.google.com/gsi/client";

    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log(
        "Google Identity Services script loaded."
      );

      initializeGoogle();
    };

    script.onerror = () => {
      console.error(
        "Failed to load Google Identity Services."
      );

      setError(
        "Unable to load Google Sign-In."
      );
    };

    document.head.appendChild(script);

    return () => {
      cancelled = true;

      script.onload = null;
    };
  }, []);

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-x-hidden
        bg-slate-50
        text-slate-900
        dark:bg-slate-950
        dark:text-white
      "
    >

      {/* =====================================================
          AUTOFILL FIX
      ===================================================== */}

      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-text-fill-color: #0f172a !important;
          -webkit-box-shadow:
            0 0 0 1000px #f8fafc inset !important;
          box-shadow:
            0 0 0 1000px #f8fafc inset !important;
          caret-color: #0f172a !important;
        }

        .dark input:-webkit-autofill,
        .dark input:-webkit-autofill:hover,
        .dark input:-webkit-autofill:focus,
        .dark input:-webkit-autofill:active {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow:
            0 0 0 1000px #1e293b inset !important;
          box-shadow:
            0 0 0 1000px #1e293b inset !important;
          caret-color: #ffffff !important;
        }

        .dark input {
          color: #ffffff;
          caret-color: #ffffff;
        }

        .dark input::placeholder {
          color: #64748b;
        }

        input:-webkit-autofill {
          transition:
            background-color 9999s ease-in-out 0s;
        }
      `}</style>

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          -top-32
          h-72
          w-72
          rounded-full
          bg-indigo-500/10
          blur-3xl
          sm:h-96
          sm:w-96
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -right-32
          h-72
          w-72
          rounded-full
          bg-blue-500/10
          blur-3xl
          sm:h-96
          sm:w-96
        "
      />

      {/* =====================================================
          BACK HOME
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
            px-3
            py-2
            text-sm
            font-medium
            text-slate-600
            transition-all
            duration-200
            hover:bg-white
            hover:text-indigo-600
            hover:shadow-sm
            dark:text-slate-400
            dark:hover:bg-slate-900
            dark:hover:text-indigo-400
          "
        >
          <ArrowLeft
            size={17}
            className="
              transition-transform
              duration-200
              group-hover:-translate-x-1
            "
          />

          <span>
            Back to Home
          </span>
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
        <div className="w-full max-w-md">

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
                mx-auto
                mb-4
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-indigo-100
                text-indigo-600
                shadow-lg
                shadow-indigo-500/10
                transition-transform
                duration-300
                hover:scale-105
                dark:bg-indigo-500/10
                dark:text-indigo-400
              "
            >
              <Brain size={29} />
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
                size={17}
                className="
                  text-indigo-500
                  dark:text-indigo-400
                "
              />
            </div>

            <p
              className="
                mx-auto
                mt-2
                max-w-xs
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              AI-Powered Sign Language
              Recognition
            </p>
          </div>

          {/* =================================================
              CARD
          ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-xl
              shadow-slate-900/5
              dark:border-slate-800
              dark:bg-slate-900
              dark:shadow-black/20
              sm:rounded-3xl
              sm:p-8
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-40
                w-40
                rounded-full
                bg-indigo-500/10
                blur-3xl
              "
            />

            <div className="relative">

              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="mb-6">

                <div
                  className="
                    mb-3
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-indigo-50
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-indigo-600
                    dark:bg-indigo-500/10
                    dark:text-indigo-400
                  "
                >
                  <Sparkles size={12} />

                  Welcome back
                </div>

                <h2
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-900
                    dark:text-white
                  "
                >
                  Sign in to your account
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Continue to your SignAI
                  workspace.
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
                    text-red-600
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
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-emerald-200
                    bg-emerald-50
                    px-4
                    py-3
                    text-sm
                    text-emerald-600
                    dark:border-emerald-500/20
                    dark:bg-emerald-500/10
                    dark:text-emerald-400
                  "
                >
                  <CheckCircle2 size={18} />

                  {success}
                </div>
              )}

              {/* =================================================
                  LOGIN FORM
              ================================================= */}

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>

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
                        dark:text-slate-500
                      "
                    />

                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                        setSuccess("");
                      }}
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
                        transition-all
                        duration-200
                        placeholder:text-slate-400
                        hover:border-slate-300
                        focus:border-indigo-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-indigo-500/10
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-white
                        dark:placeholder:text-slate-500
                        dark:focus:bg-slate-800
                      "
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div>

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

                    <button
                      type="button"
                      onClick={() => {
                        setError(
                          "Password recovery is not configured yet."
                        );
                      }}
                      className="
                        text-xs
                        font-semibold
                        text-indigo-600
                        hover:underline
                        dark:text-indigo-400
                      "
                    >
                      Forgot password?
                    </button>

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
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(
                          e.target.value
                        );

                        setError("");
                        setSuccess("");
                      }}
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
                        transition-all
                        duration-200
                        placeholder:text-slate-400
                        hover:border-slate-300
                        focus:border-indigo-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-indigo-500/10
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-white
                        dark:placeholder:text-slate-500
                        dark:focus:bg-slate-800
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                      className="
                        absolute
                        right-2
                        top-1/2
                        -translate-y-1/2
                        rounded-lg
                        p-2
                        text-slate-400
                        transition-colors
                        hover:bg-indigo-50
                        hover:text-indigo-600
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

                </div>

                {/* =================================================
                    SIGN IN
                ================================================= */}

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
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-indigo-700
                    hover:shadow-xl
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-70
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

                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />

                      Sign In
                    </>
                  )}
                </button>

              </form>

              {/* =================================================
                  DIVIDER
              ================================================= */}

              <div
                className="
                  my-6
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    h-px
                    flex-1
                    bg-slate-200
                    dark:bg-slate-800
                  "
                />

                <span
                  className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  Or
                </span>

                <div
                  className="
                    h-px
                    flex-1
                    bg-slate-200
                    dark:bg-slate-800
                  "
                />
              </div>

              {/* =================================================
                  GOOGLE LOGIN
              ================================================= */}

              <div className="w-full">

                {googleLoading && (
                  <div
                    className="
                      mb-3
                      flex
                      items-center
                      justify-center
                      gap-2
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-slate-300
                        border-t-indigo-600
                      "
                    />

                    Signing in with Google...
                  </div>
                )}

                {/* REAL GOOGLE BUTTON */}

                <div
                  ref={googleButtonRef}
                  className="
                    flex
                    min-h-[44px]
                    w-full
                    justify-center
                    overflow-hidden
                    rounded-xl
                  "
                />

              </div>

              {/* =================================================
                  REGISTER
              ================================================= */}

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
                  Don't have an account?{" "}

                  <Link
                    to="/register"
                    className="
                      font-semibold
                      text-indigo-600
                      transition-colors
                      hover:text-indigo-700
                      hover:underline
                      dark:text-indigo-400
                      dark:hover:text-indigo-300
                    "
                  >
                    Create an account
                  </Link>
                </p>

              </div>

            </div>
          </div>

          {/* =====================================================
              SECURITY
          ===================================================== */}

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
              text-slate-400
              dark:text-slate-500
            "
          >
            <ShieldCheck
              size={14}
              className="shrink-0 text-emerald-500"
            />

            <span>
              Secure access to your SignAI
              workspace
            </span>
          </div>

          <p
            className="
              mt-3
              px-4
              text-center
              text-[11px]
              leading-5
              text-slate-400
              dark:text-slate-600
            "
          >
            By continuing, you agree to use
            SignAI responsibly.
          </p>

        </div>
      </main>
    </div>
  );
};

export default Login;