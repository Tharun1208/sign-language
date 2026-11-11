import { motion } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Command, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { navGroups, getInitials } from "../../data/navigation";

const Sidebar = ({ open, setOpen, onOpenPalette }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const name = user?.name || user?.fullName || "SignAI user";
  const email = user?.email || "Signed in";

  return (
    <aside className={`app-sidebar ${open ? "open" : ""}`} aria-label="Main navigation">
      <div className="brand">
        <NavLink to="/dashboard" className="brand-link" onClick={() => setOpen(false)}>
          <img
            src="/logo.png"
            alt="SignAI Logo"
            className="brand-mark"
            style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "8px", background: "transparent", padding: 0 }}
          />
          <span>
            Sign<span>AI</span>
          </span>
        </NavLink>
        <button
          type="button"
          className="btn btn-ghost btn-sm sidebar-close"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        >
          Close
        </button>
      </div>

      <button
        type="button"
        className="sidebar-search"
        onClick={() => {
          setOpen(false);
          onOpenPalette?.();
        }}
        aria-label="Search pages (Control K)"
      >
        <Search size={15} aria-hidden="true" />
        <span>Search pages</span>
        <kbd aria-hidden="true">
          <Command size={11} /> K
        </kbd>
      </button>

      <nav className="sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.label} className="nav-group">
            <p className="nav-group-label">{group.label}</p>
            {group.items.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${active ? "active" : ""}`}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="sidebar-active-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {Icon && (
                    <Icon className="sidebar-link-icon" size={17} strokeWidth={1.9} aria-hidden="true" />
                  )}
                  <span className="sidebar-link-text">{item.shortTitle || item.title}</span>
                  {item.hint && <span className="nav-count">{item.hint}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="sidebar-user">
          <span className="avatar" aria-hidden="true">{getInitials(name)}</span>
          <div style={{ minWidth: 0 }}>
            <div className="fw-semibold text-sm sidebar-user-name">{name}</div>
            <div className="text-xs text-muted sidebar-user-name">{email}</div>
          </div>
        </div>
        <button type="button" className="btn btn-ghost btn-sm btn-block mt-2" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
