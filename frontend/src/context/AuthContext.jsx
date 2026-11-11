/* eslint-disable react-refresh/only-export-components -- provider and hook intentionally share one module */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { apiFetch } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem("signai-user") ||
        localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      null
    );
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(
      localStorage.getItem("isLoggedIn") === "true" ||
      localStorage.getItem("token")
    );
  });

  const [loading, setLoading] = useState(true);

  // =========================================================
  // PERSIST USER DATA
  // =========================================================

  const persistSession = useCallback((authToken, userData) => {
    if (authToken) {
      setToken(authToken);
      localStorage.setItem("token", authToken);
      localStorage.setItem("authToken", authToken);
    }

    if (userData) {
      setUser(userData);
      localStorage.setItem("signai-user", JSON.stringify(userData));
      localStorage.setItem("user", JSON.stringify(userData));

      const profileImage =
        userData.picture ||
        userData.profileImage ||
        userData.image ||
        "";

      if (profileImage) {
        localStorage.setItem("signai-profile-image", profileImage);
      }
    }

    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  }, []);

  // =========================================================
  // CLEAR SESSION
  // =========================================================

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);

    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("signai-user");
    localStorage.removeItem("isLoggedIn");
  }, []);

  // =========================================================
  // INITIAL VERIFY SESSION
  // =========================================================

  useEffect(() => {
    const verifySession = async () => {
      const storedToken =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiFetch("/api/auth/me", { token: storedToken });

        if (data?.success && data.user) {
          persistSession(storedToken, data.user);
        }
      } catch (err) {
        console.warn("Session verification warning:", err);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [persistSession]);

  // =========================================================
  // LOGIN
  // =========================================================

  const login = async (email, password) => {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (!data?.success) {
      throw new Error(data?.message || "Login failed.");
    }

    persistSession(data.token, data.user);
    return data;
  };

  // =========================================================
  // REGISTER
  // =========================================================

  const register = async (userData) => {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: userData,
    });

    if (!data?.success) {
      throw new Error(data?.message || "Registration failed.");
    }

    persistSession(data.token, data.user);
    return data;
  };

  // =========================================================
  // GOOGLE LOGIN
  // =========================================================

  const googleLogin = async (credential) => {
    const data = await apiFetch("/api/auth/google", {
      method: "POST",
      body: { credential },
    });

    if (!data?.success) {
      throw new Error(data?.message || "Google sign-in failed.");
    }

    persistSession(data.token, data.user);
    return data;
  };

  // =========================================================
  // UPDATE PROFILE
  // =========================================================

  const updateProfile = async (updates) => {
    const storedToken =
      token ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    const data = await apiFetch("/api/auth/profile", {
      method: "PUT",
      token: storedToken || undefined,
      body: updates,
    });

    if (!data?.success) {
      throw new Error(data?.message || "Failed to update profile.");
    }

    if (data.user) {
      persistSession(storedToken, data.user);
    }

    return data;
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = async () => {
    const storedToken =
      token ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    if (storedToken) {
      try {
        await apiFetch("/api/auth/logout", {
          method: "POST",
          token: storedToken,
        });
      } catch (err) {
        console.warn("Logout API warning:", err);
      }
    }

    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        loading,
        login,
        register,
        googleLogin,
        updateProfile,
        logout,
        persistSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
