import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Info, LogOut, Menu, Search, Settings, Sparkles, WifiOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ui/ThemeToggle";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import { pageMeta, getInitials } from "../../data/navigation";

const Topbar = ({ onMenu, onOpenPalette }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const online = useOnlineStatus();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  const meta = pageMeta[location.pathname] || { title: "SignAI", subtitle: "Sign language recognition" };
  const name = user?.name || user?.fullName || "User";

  return (
    <header className="app-topbar">
      <div className="row topbar-left" style={{ gap: 12, minWidth: 0 }}>
        <button
          type="button"
          className="btn btn-ghost btn-sm sidebar-toggle icon-btn"
          onClick={onMenu}
          aria-label="Open navigation"
        >
          <Menu size={18} aria-hidden="true" />
        </button>
        <div style={{ minWidth: 0 }}>
          <div className="title">{meta.title}</div>
          <div className="topbar-sub">{meta.subtitle}</div>
        </div>
      </div>

      <div className="row topbar-right" style={{ gap: 10, flexWrap: "nowrap" }}>
        {!online && (
          <span className="badge badge-err badge-dot topbar-offline" role="status">
            Offline
            <WifiOff size={12} aria-hidden="true" />
          </span>
        )}

        <button
          type="button"
          className="topbar-search"
          onClick={onOpenPalette}
          aria-label="Search pages (Control K)"
          aria-keyshortcuts="Control+K Meta+K"
        >
          <span className="topbar-search-icon" aria-hidden="true">
            <Search size={14} />
          </span>
          <span className="topbar-search-text">Search</span>
          <kbd aria-hidden="true">⌘K</kbd>
        </button>

        <ThemeToggle />

        <Link to="/live-recognition" className="btn btn-primary btn-sm topbar-cta">
          <Sparkles size={15} aria-hidden="true" />
          Start recognition
        </Link>

        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            ref={triggerRef}
            type="button"
            className="btn btn-ghost btn-sm topbar-user"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Account menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="avatar" style={{ width: 26, height: 26, fontSize: 11 }} aria-hidden="true">
              {getInitials(name)}
            </span>
            <span className="topbar-user-name">{name}</span>
            <motion.span
              className="topbar-user-caret"
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.18 }}
              aria-hidden="true"
            >
              <ChevronDown size={14} />
            </motion.span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                role="menu"
                aria-label="Account"
                className="card user-menu"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="user-menu-head">
                  <span className="avatar" aria-hidden="true">{getInitials(name)}</span>
                  <div style={{ minWidth: 0 }}>
                    <div className="fw-semibold text-sm">{name}</div>
                    <div className="text-xs text-muted topbar-user-name">{user?.email || "Signed in"}</div>
                  </div>
                </div>
                <Link to="/settings" role="menuitem" className="sidebar-link" onClick={() => setOpen(false)}>
                  <Settings size={16} aria-hidden="true" />
                  Settings
                </Link>
                <Link to="/about" role="menuitem" className="sidebar-link" onClick={() => setOpen(false)}>
                  <Info size={16} aria-hidden="true" />
                  About
                </Link>
                <button type="button" role="menuitem" className="sidebar-link" onClick={handleLogout}>
                  <LogOut size={16} aria-hidden="true" />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
