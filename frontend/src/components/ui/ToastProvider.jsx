/* eslint-disable react-refresh/only-export-components -- provider and hook intentionally share one module */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ToastContext = createContext(null);

let nextId = 1;

const TITLES = {
  ok: "Done",
  info: "Heads up",
  warn: "Check this",
  err: "Something went wrong",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (toast) => {
      const id = nextId++;
      const entry = {
        id,
        tone: toast.tone || "info",
        title: toast.title || TITLES[toast.tone || "info"],
        message: toast.message || "",
        duration: toast.duration ?? 4200,
      };
      setToasts((current) => [...current.slice(-3), entry]);
      if (entry.duration > 0) {
        setTimeout(() => dismiss(id), entry.duration);
      }
      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      push,
      dismiss,
      success: (message, title) => push({ tone: "ok", message, title }),
      error: (message, title) => push({ tone: "err", message, title }),
      info: (message, title) => push({ tone: "info", message, title }),
      warn: (message, title) => push({ tone: "warn", message, title }),
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toasts" aria-live="polite" aria-atomic="false">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={`toast toast-${toast.tone}`}
              role="status"
            >
              <div>
                <b>{toast.title}</b>
                {toast.message && <span>{toast.message}</span>}
              </div>
              <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss">
                Dismiss
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
};
