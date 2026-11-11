import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CornerDownLeft, Search } from "lucide-react";
import { navItems } from "../../data/navigation";

const CommandPalette = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return navItems;
    return navItems.filter((item) =>
      `${item.title} ${item.group} ${item.keywords || ""}`.toLowerCase().includes(term)
    );
  }, [query]);

  const close = useCallback(() => {
    setQuery("");
    setActive(0);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => inputRef.current?.focus(), 40);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const item = listRef.current?.querySelector('[data-active="true"]');
    item?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "Tab") {
        const focusables = panelRef.current?.querySelectorAll(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables?.length) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          } else if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        }
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((current) => (results.length ? (current + 1) % results.length : 0));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((current) =>
          results.length ? (current - 1 + results.length) % results.length : 0
        );
        return;
      }
      if (event.key === "Enter") {
        const item = results[active];
        if (item) {
          event.preventDefault();
          close();
          navigate(item.path);
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, results, active, navigate, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cp-scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            className="cp-panel"
            ref={panelRef}
            initial={{ opacity: 0, y: -18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="cp-search">
              <Search size={18} aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                placeholder="Search pages, tools and settings…"
                aria-label="Search pages"
                aria-controls="command-palette-results"
                aria-activedescendant={results[active] ? `cp-item-${results[active].path}` : undefined}
                autoComplete="off"
                spellCheck="false"
              />
              <kbd className="cp-esc">Esc</kbd>
            </div>

            <div className="cp-results" id="command-palette-results" role="listbox" ref={listRef}>
              {results.length === 0 && (
                <p className="cp-empty">No pages match “{query}”. Try “camera” or “settings”.</p>
              )}

              {results.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    id={`cp-item-${item.path}`}
                    type="button"
                    role="option"
                    aria-selected={index === active}
                    data-active={index === active}
                    className={`cp-item ${index === active ? "active" : ""}`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => {
                      close();
                      navigate(item.path);
                    }}
                  >
                    <span className="cp-item-icon" aria-hidden="true">
                      {Icon ? <Icon size={17} strokeWidth={1.9} /> : <ArrowRight size={17} />}
                    </span>
                    <span className="cp-item-text">
                      <span className="cp-item-title">{item.title}</span>
                      <span className="cp-item-group">{item.group}</span>
                    </span>
                    {index === active ? (
                      <span className="cp-enter" aria-hidden="true">
                        <CornerDownLeft size={13} /> Open
                      </span>
                    ) : (
                      <ArrowRight className="cp-item-arrow" size={15} aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="cp-footer" aria-hidden="true">
              <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
              <span><kbd>Enter</kbd> select</span>
              <span><kbd>Esc</kbd> close</span>
            </div>

            <p className="sr-only" role="status" aria-live="polite">
              {results.length} result{results.length === 1 ? "" : "s"} available
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
