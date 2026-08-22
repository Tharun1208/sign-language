import {
  useEffect,
  useState,
} from "react";

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
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();

  // =========================================================
  // FORM STATE
  // =========================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [googleReady, setGoogleReady] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // REDIRECT AFTER LOGIN
  // =========================================================

  const redirectAfterLogin = () => {
    const redirect =
      localStorage.getItem(
        "redirectAfterLogin"
      ) || "/dashboard";

    localStorage.removeItem(
      "redirectAfterLogin"
    );

    navigate(redirect, {
      replace: true,
    });
  };

  // =========================================================
  // SAVE USER SESSION
  // =========================================================

  const saveUserSession = (data) => {
    localStorage.setItem(
      "isLoggedIn",
      "true"
    );

    if (data?.token) {
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "authToken",
        data.token
      );
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
  // NORMAL EMAIL / PASSWORD LOGIN
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
            "Content-Type":
              "application/json",
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

  const handleGoogleResponse = async (
    response
  ) => {
    console.log(
      "================================="
    );

    console.log(
      "GOOGLE RESPONSE RECEIVED"
    );

    console.log(
      "================================="
    );

    if (!response?.credential) {
      console.error(
        "No Google credential received."
      );

      setGoogleLoading(false);

      setError(
        "Google authentication failed. No credential was received."
      );

      return;
    }

    try {
      setGoogleLoading(true);

      setError("");
      setSuccess("");

      console.log(
        "Google credential received successfully."
      );

      console.log(
        "Sending Google credential to backend..."
      );

      const result = await fetch(
        `${API_URL}/api/auth/google`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            credential:
              response.credential,
          }),
        }
      );

      let data = {};

      try {
        data = await result.json();
      } catch (jsonError) {
        console.error(
          "Unable to parse Google backend response:",
          jsonError
        );

        data = {};
      }

      console.log(
        "Google backend status:",
        result.status
      );

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

      console.log(
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
    } finally {
      setGoogleLoading(false);
    }
  };

  // =========================================================
  // INITIALIZE GOOGLE IDENTITY SERVICES
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

      if (
        !window.google ||
        !window.google.accounts ||
        !window.google.accounts.id
      ) {
        console.warn(
          "Google Identity Services is not ready yet."
        );

        return;
      }

      try {
        console.log(
          "Initializing Google Identity Services..."
        );

        window.google.accounts.id.initialize({
          client_id:
            GOOGLE_CLIENT_ID,

          callback:
            handleGoogleResponse,

          auto_select: false,

          cancel_on_tap_outside: true,

          context: "signin",
        });

        console.log(
          "Google Identity Services initialized successfully."
        );

        if (!cancelled) {
          setGoogleReady(true);
        }
      } catch (err) {
        console.error(
          "Google initialization error:",
          err
        );

        setError(
          "Unable to initialize Google Sign-In."
        );
      }
    };

    // =======================================================
    // CHECK EXISTING GOOGLE SCRIPT
    // =======================================================

    const existingScript =
      document.getElementById(
        "google-identity-script"
      );

    if (existingScript) {
      if (
        window.google?.accounts?.id
      ) {
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

    // =======================================================
    // LOAD GOOGLE SCRIPT
    // =======================================================

    const script =
      document.createElement(
        "script"
      );

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

    document.head.appendChild(
      script
    );

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================
  // CUSTOM GOOGLE BUTTON
  // =========================================================

  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError(
        "Google Sign-In is not configured."
      );

      return;
    }

    if (
      !window.google?.accounts?.id
    ) {
      setError(
        "Google Sign-In is still loading. Please try again."
      );

      return;
    }

    try {
      setGoogleLoading(true);

      setError("");
      setSuccess("");

      console.log(
        "Opening Google Sign-In..."
      );

      /*
       * This opens Google's authentication UI.
       *
       * The callback configured above receives
       * the Google credential.
       */
      window.google.accounts.id.prompt(
        (notification) => {
          console.log(
            "Google prompt notification:",
            notification
          );

          /*
           * If Google closes/dismisses the prompt
           * without returning a credential, stop
           * the loading state.
           */
          if (
            notification?.isNotDisplayed?.() ||
            notification?.isSkippedMoment?.() ||
            notification?.isDismissedMoment?.()
          ) {
            setGoogleLoading(false);
          }
        }
      );
    } catch (err) {
      console.error(
        "Google button error:",
        err
      );

      setGoogleLoading(false);

      setError(
        "Unable to open Google Sign-In. Please try again."
      );
    }
  };

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
          CUSTOM CSS
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

                  <span>
                    {error}
                  </span>
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
                        setEmail(
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
                          (value) =>
                            !value
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
                    SIGN IN BUTTON
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
                  CUSTOM GOOGLE BUTTON
              ================================================= */}

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={
                  googleLoading ||
                  !googleReady
                }
                className="
                  group
                  relative
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  py-3.5
                  text-sm
                  font-semibold
                  text-slate-700
                  shadow-lg
                  shadow-slate-900/5
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-slate-300
                  hover:bg-slate-50
                  hover:shadow-xl
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                  dark:hover:border-slate-600
                  dark:hover:bg-slate-750
                "
              >
                {googleLoading ? (
                  <>
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-slate-300
                        border-t-indigo-600
                        dark:border-slate-600
                        dark:border-t-indigo-400
                      "
                    />

                    Signing in with Google...
                  </>
                ) : (
                  <>
                    {/* GOOGLE LOGO */}

                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M21.35 12.27c0-.71-.06-1.4-.18-2.05H12v3.88h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.2Z"
                      />

                      <path
                        fill="#34A853"
                        d="M12 21.8c2.63 0 4.84-.87 6.45-2.34l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.52A9.75 9.75 0 0 0 12 21.8Z"
                      />

                      <path
                        fill="#FBBC05"
                        d="M6.53 13.91a5.87 5.87 0 0 1 0-3.75V7.64H3.28a9.8 9.8 0 0 0 0 8.78l3.25-2.51Z"
                      />

                      <path
                        fill="#EA4335"
                        d="M12 6.13c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.24 14.63 2.2 12 2.2a9.75 9.75 0 0 0-8.72 5.44l3.25 2.52C7.3 7.85 9.46 6.13 12 6.13Z"
                      />
                    </svg>

                    <span>
                      Continue with Google
                    </span>
                  </>
                )}
              </button>

              {/* =================================================
                  GOOGLE NOT READY
              ================================================= */}

              {!googleReady &&
                GOOGLE_CLIENT_ID && (
                  <p
                    className="
                      mt-2
                      text-center
                      text-xs
                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    Loading Google Sign-In...
                  </p>
                )}

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