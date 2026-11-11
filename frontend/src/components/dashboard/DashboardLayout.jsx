import { Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ScanFace,
  Film,
  BookOpenText,
  Settings as SettingsIcon,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CommandPalette from "../ui/CommandPalette";
import RouteFallback from "../ui/RouteFallback";
import { pageMeta } from "../../data/navigation";

const mobileItems = [
  { title: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { title: "Live", path: "/live-recognition", icon: ScanFace },
  { title: "Video", path: "/video-translation", icon: Film },
  { title: "Dictionary", path: "/dictionary", icon: BookOpenText },
  { title: "Settings", path: "/settings", icon: SettingsIcon },
];

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef(null);
  const firstRender = useRef(true);

  // Global ⌘K / Ctrl+K shortcut for the command palette.
  useEffect(() => {
    const onKeyDown = (event) => {
      const isPaletteShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isPaletteShortcut) {
        event.preventDefault();
        setPaletteOpen((current) => !current);
        return;
      }
      if (event.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Move focus to the page region after navigation for keyboard and
  // screen-reader users. Skip the very first render to avoid stealing focus.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  // Keep the document title in sync with the current workspace page.
  useEffect(() => {
    const title = pageMeta[location.pathname]?.title;
    document.title = title ? `${title} · SignAI` : "SignAI — Sign Language Recognition";
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <button
        type="button"
        aria-label="Close menu"
        className={`sidebar-scrim ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="app-main">
        <Topbar onMenu={() => setSidebarOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />
        <main className="app-content" id="main-content" ref={mainRef} tabIndex={-1}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            >
              <Suspense fallback={<RouteFallback />}>
                {children || <Outlet />}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}
              aria-current={location.pathname === item.path ? "page" : undefined}
            >
              <Icon size={19} strokeWidth={1.9} aria-hidden="true" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
