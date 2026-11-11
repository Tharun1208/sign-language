import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, Camera, Sparkles, Image as ImageIcon } from "lucide-react";
import { DICTIONARY_CATEGORIES, SIGN_DICTIONARY } from "../data/signDictionary";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

const SignDictionary = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(SIGN_DICTIONARY[0]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const entries = useMemo(() => {
    const term = query.trim().toLowerCase();

    return SIGN_DICTIONARY.filter((entry) => {
      const matchesCategory = category === "All" || entry.category === category;
      const matchesTerm =
        !term ||
        entry.label.toLowerCase().includes(term) ||
        entry.description.toLowerCase().includes(term);

      return matchesCategory && matchesTerm;
    });
  }, [query, category]);

  const speak = (text) => {
    if (!text || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {
      /* ignore */
    }
  };

  const getLetterImageUrl = (letter) => `/dataset/letters/${letter.toUpperCase()}.jpg`;
  const getFallbackImageUrl = (letter) => `${API_URL}/api/v1/dictionary/image/${letter.toUpperCase()}`;

  return (
    <>
      <div className="stack" style={{ gap: "var(--space-6)" }}>
        <div className="page-head">
          <div>
            <span className="eyebrow">Visual Reference</span>
            <h1 className="mt-2">Sign Dictionary</h1>
            <p style={{ maxWidth: "64ch" }}>
              Browse the supported A–Z finger-spelling vocabulary. Click any letter
              to view its original dataset gesture photo, hear pronunciation, and practise live.
            </p>
          </div>

          <Link to="/live-recognition" className="btn btn-primary" style={{ gap: 6 }}>
            <Camera size={16} />
            <span>Practise live</span>
          </Link>
        </div>

        <div className="card">
          <div className="row row-between" style={{ alignItems: "flex-end" }}>
            <div className="field" style={{ marginBottom: 0, flex: "1 1 280px" }}>
              <label className="label" htmlFor="dictionary-search">Search signs</label>
              <input
                id="dictionary-search"
                className="input"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a letter or description…"
              />
            </div>

            <div className="row" style={{ gap: "var(--space-2)" }}>
              {DICTIONARY_CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="chip"
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <p className="hint mt-4" style={{ marginBottom: 0 }}>
            {entries.length} of {SIGN_DICTIONARY.length} entries shown
          </p>
        </div>

        <div className="grid grid-2" style={{ alignItems: "start", gap: "var(--space-5)" }}>
          {/* Alphabet Selection Grid */}
          <div>
            <AnimatePresence mode="wait">
              {entries.length ? (
                <motion.div
                  key={`${category}-${query}`}
                  className="grid grid-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ gap: "var(--space-2)" }}
                >
                  {entries.map((entry, index) => {
                    const isSelected = selected?.id === entry.id;
                    return (
                      <motion.button
                        key={entry.id}
                        type="button"
                        className="gesture"
                        aria-pressed={isSelected}
                        onClick={() => {
                          setSelected(entry);
                          setImageLoaded(false);
                        }}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: Math.min(index * 0.015, 0.3),
                          type: "spring",
                          stiffness: 320,
                          damping: 24,
                        }}
                        style={{
                          borderColor: isSelected ? "var(--primary)" : "var(--line)",
                          background: isSelected ? "var(--primary-soft)" : "var(--surface)",
                          boxShadow: isSelected ? "var(--shadow-s)" : "none",
                          transform: isSelected ? "scale(1.04)" : "scale(1)",
                          transition: "all var(--t-fast)",
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ fontSize: "1.4rem", fontWeight: "var(--fw-bold)" }}>
                          {entry.label}
                        </span>
                        <small style={{ color: isSelected ? "var(--primary)" : "var(--ink-3)" }}>
                          Sign {entry.label}
                        </small>
                      </motion.button>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div key="empty" className="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3>No matching signs</h3>
                  <p className="hint">Try a different letter or clear the search.</p>
                  <button
                    type="button"
                    className="btn btn-secondary mt-4"
                    onClick={() => {
                      setQuery("");
                      setCategory("All");
                    }}
                  >
                    Clear filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Detailed Selected Sign Photo & Information Card */}
          <div className="stack" style={{ gap: "var(--space-4)" }}>
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  className="stack"
                  style={{ gap: "var(--space-4)" }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="card spotlight" style={{ position: "relative", overflow: "hidden" }}>
                    <div className="row row-between mb-3">
                      <div className="row" style={{ gap: 8 }}>
                        <span className="badge badge-pri">Letter {selected.label}</span>
                        <span className="badge badge-ok" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <ImageIcon size={12} />
                          Dataset Photo
                        </span>
                      </div>
                      <span className="text-xs text-soft">ISL Reference</span>
                    </div>

                    {/* Sign Photo Display from DataSet Letters Folder */}
                    <div
                      style={{
                        position: "relative",
                        borderRadius: "var(--r-m)",
                        overflow: "hidden",
                        background: "radial-gradient(circle at 50% 50%, var(--surface-2) 0%, var(--surface) 100%)",
                        border: "1px solid var(--line)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 280,
                        maxHeight: 340,
                        margin: "12px 0 16px",
                        boxShadow: "inset 0 0 20px rgba(0,0,0,0.06)",
                      }}
                    >
                      <img
                        key={selected.label}
                        src={getLetterImageUrl(selected.label)}
                        alt={`Sign gesture photo for Letter ${selected.label}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getFallbackImageUrl(selected.label);
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          maxHeight: 320,
                          objectFit: "contain",
                          display: "block",
                          padding: 12,
                          transition: "opacity 0.3s ease",
                          opacity: imageLoaded ? 1 : 0.4,
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          bottom: 12,
                          right: 12,
                          background: "rgba(15, 12, 30, 0.78)",
                          backdropFilter: "blur(6px)",
                          color: "#FFFFFF",
                          padding: "4px 10px",
                          borderRadius: "var(--r-s)",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                      >
                        SIGN '{selected.label}'
                      </div>
                    </div>

                    <div className="row row-between mt-2">
                      <div>
                        <h2 className="m-0" style={{ fontSize: "var(--fs-2xl)" }}>
                          Gesture '{selected.label}'
                        </h2>
                        <p className="text-soft mt-1" style={{ fontSize: "var(--fs-sm)" }}>
                          Official Indian Sign Language dataset capture for letter {selected.label}.
                        </p>
                      </div>

                      <div
                        className="stat-value gradient-text"
                        style={{ fontSize: "3.2rem", lineHeight: 1, margin: 0 }}
                      >
                        {selected.label}
                      </div>
                    </div>

                    <div className="row mt-4" style={{ gap: "var(--space-2)" }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => speak(`Letter ${selected.label}`)}
                        style={{ gap: 6 }}
                      >
                        <Volume2 size={16} />
                        <span>Hear letter</span>
                      </button>

                      <Link
                        to="/live-recognition"
                        className="btn btn-secondary"
                        style={{ gap: 6 }}
                      >
                        <Camera size={16} />
                        <span>Practise live</span>
                      </Link>
                    </div>
                  </div>

                  <div className="card">
                    <div className="row mb-2" style={{ gap: 6 }}>
                      <Sparkles size={16} style={{ color: "var(--primary)" }} />
                      <h3 className="m-0">Practice Tip</h3>
                    </div>
                    <p className="text-soft" style={{ fontSize: "var(--fs-sm)" }}>
                      {selected.tip}
                    </p>
                    <p className="hint mt-2" style={{ marginBottom: 0 }}>
                      Match your hand orientation and finger positioning with the dataset photo above
                      for the highest recognition confidence (&gt;90%).
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="no-selection" className="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3>Select a sign</h3>
                  <p className="hint">Choose any letter to see its dataset gesture photo.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignDictionary;
