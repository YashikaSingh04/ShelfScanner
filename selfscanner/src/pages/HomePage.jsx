import { useState, useRef } from "react";
import { Target, Camera, Bot, Sparkles, ShoppingCart, BookOpen, Zap, FileText, Star, X } from "lucide-react";
import { savePreferences } from "../services/api";

const GENRE_SUGGESTIONS = [
  "Literary Fiction", "Mystery", "Sci-Fi", "Fantasy", "Historical Fiction",
  "Thriller", "Biography", "Romance", "Dark Romance", "Non-fiction",
  "Horror", "Psychological Thriller", "Short Stories", "Graphic Novel",
  "Self Help", "True Crime", "Memoir", "Young Adult", "Children's",
  "Dystopian", "Magical Realism", "Contemporary Fiction", "Adventure",
  "Crime Fiction", "Cozy Mystery", "Epic Fantasy", "Space Opera",
  "Paranormal", "Satire", "Poetry", "Essays", "Philosophy",
  "Science", "History", "Politics", "Travel", "Cooking", "Art",
];

const PACE   = ["Quick reads", "Long epics", "Either"];
const LENGTH = ["Under 300pp", "300–500pp", "500pp+", "No preference"];

export default function HomePage({ setPage, prefs, setPrefs, showToast }) {
  const [dragover,     setDragover]     = useState(false);
  const [csvFile,      setCsvFile]      = useState(null);
  const [minRating,    setMinRating]    = useState(0);
  const [genreInput,   setGenreInput]   = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileRef = useRef();

  // Filter suggestions based on input
  const filteredSuggestions = genreInput.length > 0
    ? GENRE_SUGGESTIONS.filter(g =>
        g.toLowerCase().includes(genreInput.toLowerCase()) &&
        !prefs.genres.includes(g)
      )
    : GENRE_SUGGESTIONS.filter(g => !prefs.genres.includes(g));

  const addGenre = g => {
    const trimmed = g.trim();
    if (!trimmed) return;
    if (prefs.genres.includes(trimmed)) return;
    setPrefs(p => ({ ...p, genres: [...p.genres, trimmed] }));
    setGenreInput("");
    setShowSuggestions(false);
  };

  const removeGenre = g => {
    setPrefs(p => ({ ...p, genres: p.genres.filter(x => x !== g) }));
  };

  const handleGenreKeyDown = e => {
    if (e.key === "Enter" && genreInput.trim()) {
      addGenre(genreInput);
    }
  };

  const handleFile = f => {
    if (f && f.name.endsWith(".csv")) {
      setCsvFile(f);
      showToast("Goodreads CSV loaded!");
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    setDragover(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="page">

      {/* HERO */}
      <div className="hero" style={{
        position: "relative", overflow: "hidden",
        padding: "6rem 2rem 5rem", textAlign: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.pexels.com/photos/4855385/pexels-photo-4855385.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: "cover", backgroundPosition: "center 30%",
          filter: "brightness(0.45)", zIndex: 0,
        }}/>
        <div style={{ position: "relative", zIndex: 2 }}>
          <p className="hero-eyebrow">AI-Powered Book Discovery</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }}>
            Never leave a book sale<br /><em>empty-handed</em> again.
          </h1>
          <p style={{
            fontSize: "1.2rem", color: "var(--dusty)",
            maxWidth: "520px", margin: "0 auto 2.5rem",
            lineHeight: 1.7, fontWeight: 300,
          }}>
            Photograph any bookshelf. Get instant, personalised recommendations
            based on your taste — then buy directly or save for later.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setPage("scanner")}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Camera size={18} strokeWidth={2}/> Scan a Shelf
            </button>
            <button className="btn-secondary"
              onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })}>
              See how it works ↓
            </button>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="section" id="how">
        <p className="hero-eyebrow" style={{ color: "var(--dusty)" }}>The Process</p>
        <h2 className="section-title">How Shelf Scanner works</h2>
        <div className="divider" />
        <div className="steps">
          {[
            { n: "01", icon: <Target size={32} color="var(--amber)" strokeWidth={1.5}/>, title: "Set your taste", desc: "Tell us your favourite genres, authors, and how you rate books." },
            { n: "02", icon: <Camera size={32} color="var(--amber)" strokeWidth={1.5}/>, title: "Photograph a shelf", desc: "Point your phone at any bookshelf — at a sale, library, or friend's home." },
            { n: "03", icon: <Bot size={32} color="var(--amber)" strokeWidth={1.5}/>, title: "AI reads the spines", desc: "Gemini AI identifies every book on the shelf, even partial titles." },
            { n: "04", icon: <Sparkles size={32} color="var(--amber)" strokeWidth={1.5}/>, title: "Get recommendations", desc: "We cross-reference your taste with what's on the shelf and surface your top picks." },
            { n: "05", icon: <ShoppingCart size={32} color="var(--amber)" strokeWidth={1.5}/>, title: "Buy or save", desc: "One tap to buy on Amazon, or add to your reading list for later." },
          ].map(s => (
            <div className="step" key={s.n}
              onMouseOver={e => e.currentTarget.querySelector("svg").style.transform = "scale(1.2) rotate(-5deg)"}
              onMouseOut={e => e.currentTarget.querySelector("svg").style.transform = "scale(1) rotate(0deg)"}
            >
              <div className="step-num">{s.n}</div>
              <div style={{ marginBottom: "0.8rem", transition: "transform 0.3s" }}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PREFERENCES */}
      <div style={{ background: "var(--parchment)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="section">
          <p className="hero-eyebrow" style={{ color: "var(--dusty)" }}>Personalise</p>
          <h2 className="section-title">Set your reading preferences</h2>
          <div className="divider" />

          <div className="prefs-grid">

            {/* LEFT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="pref-card">
                <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <BookOpen size={18} color="var(--amber)"/> Favourite genres
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--dusty)", marginBottom: "1rem" }}>
                  Type any genre or pick from suggestions below
                </p>

                {/* Selected genre chips */}
                {prefs.genres.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.8rem" }}>
                    {prefs.genres.map(g => (
                      <span key={g} style={{
                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                        background: "var(--amber)", color: "white",
                        borderRadius: "20px", padding: "0.3rem 0.8rem",
                        fontSize: "0.85rem", fontFamily: "'Crimson Pro', serif",
                      }}>
                        {g}
                        <X size={12} style={{ cursor: "pointer" }} onClick={() => removeGenre(g)}/>
                      </span>
                    ))}
                  </div>
                )}

                {/* Genre search input */}
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Type a genre e.g. Dark Romance, Cozy Mystery…"
                    value={genreInput}
                    onChange={e => { setGenreInput(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={handleGenreKeyDown}
                    style={{
                      width: "100%", padding: "0.6rem 1rem",
                      border: "1.5px solid var(--border)", borderRadius: "8px",
                      fontFamily: "'Crimson Pro', serif", fontSize: "0.95rem",
                      background: "var(--warm-white)", color: "var(--bark)",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                  <span style={{
                    position: "absolute", right: "0.8rem", top: "50%",
                    transform: "translateY(-50%)", fontSize: "0.75rem",
                    color: "var(--dusty)",
                  }}>
                    ↵ Enter to add
                  </span>

                  {/* Dropdown suggestions */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div style={{
                      position: "absolute", top: "100%", left: 0, right: 0,
                      background: "white", border: "1.5px solid var(--border)",
                      borderRadius: "8px", marginTop: "4px",
                      maxHeight: "200px", overflowY: "auto",
                      zIndex: 50, boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}>
                      {filteredSuggestions.map(g => (
                        <div key={g}
                          onMouseDown={() => addGenre(g)}
                          style={{
                            padding: "0.6rem 1rem", cursor: "pointer",
                            fontFamily: "'Crimson Pro', serif", fontSize: "0.95rem",
                            color: "var(--bark)", transition: "background 0.15s",
                          }}
                          onMouseOver={e => e.currentTarget.style.background = "var(--parchment)"}
                          onMouseOut={e => e.currentTarget.style.background = "transparent"}
                        >
                          {g}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Popular genre chips */}
                <div style={{ marginTop: "1rem" }}>
                  <p style={{ fontSize: "0.78rem", color: "var(--dusty)", marginBottom: "0.5rem",
                    fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Popular picks
                  </p>
                  <div className="genre-chips">
                    {GENRE_SUGGESTIONS.filter(g => !prefs.genres.includes(g)).slice(0, 16).map(g => (
                      <button key={g} className="chip" onClick={() => addGenre(g)}>{g}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pref-card">
                <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Zap size={18} color="var(--amber)"/> Reading pace
                </h3>
                <div className="genre-chips">
                  {PACE.map(p => (
                    <button key={p}
                      className={`chip${prefs.pace === p ? " selected" : ""}`}
                      onClick={() => setPrefs(pr => ({ ...pr, pace: p }))}>
                      {p}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FileText size={18} color="var(--amber)"/> Book length
                  </h3>
                  <div className="genre-chips" style={{ marginTop: "0.8rem" }}>
                    {LENGTH.map(l => (
                      <button key={l}
                        className={`chip${prefs.length === l ? " selected" : ""}`}
                        onClick={() => setPrefs(pr => ({ ...pr, length: l }))}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="pref-card">
                <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Star size={18} color="var(--amber)"/> Favourite authors
                </h3>
                <div className="form-group">
                  <label className="form-label">Authors you love</label>
                  <textarea className="form-textarea"
                    placeholder="e.g. Kazuo Ishiguro, Donna Tartt, Neil Gaiman…"
                    value={prefs.authors}
                    onChange={e => setPrefs(p => ({ ...p, authors: e.target.value }))}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Books you've loved</label>
                  <textarea className="form-textarea"
                    placeholder="e.g. The Secret History, Never Let Me Go…"
                    value={prefs.loved}
                    onChange={e => setPrefs(p => ({ ...p, loved: e.target.value }))}/>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Minimum rating to recommend</label>
                  <div className="rating-row">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s}
                        className={`star${minRating >= s ? " lit" : ""}`}
                        onClick={() => { setMinRating(s); setPrefs(p => ({ ...p, minRating: s })); }}>
                        ⭐
                      </span>
                    ))}
                    <span style={{ fontSize: "0.85rem", color: "var(--dusty)", marginLeft: "0.4rem", alignSelf: "center" }}>
                      {minRating ? `${minRating}+ stars` : "Any"}
                    </span>
                  </div>
                </div>
              </div>

              {/* GOODREADS UPLOAD */}
              <div className="pref-card">
                <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FileText size={18} color="var(--amber)"/> Import Goodreads data
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--dusty)", marginBottom: "1rem", fontWeight: 300 }}>
                  Export your library from Goodreads → My Books → Export, then upload the CSV here.
                </p>
                {csvFile ? (
                  <div className="file-success">
                    <span style={{ fontSize: "1.3rem" }}>✅</span>
                    <div>
                      <strong>{csvFile.name}</strong><br/>
                      <span style={{ fontSize: "0.82rem", opacity: 0.7 }}>Reading history imported</span>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`upload-zone${dragover ? " dragover" : ""}`}
                    onDragOver={e => { e.preventDefault(); setDragover(true); }}
                    onDragLeave={() => setDragover(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current.click()}
                  >
                    <input ref={fileRef} type="file" accept=".csv"
                      style={{ display: "none" }}
                      onChange={e => handleFile(e.target.files[0])}/>
                    <div className="upload-zone-icon">📂</div>
                    <h4>Drop your CSV here</h4>
                    <p>or <span className="browse-link">browse to upload</span></p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* SAVE BUTTONS */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
            <button className="prefs-save-btn" onClick={async () => {
              try {
                await savePreferences({
                  genres: prefs.genres, pace: prefs.pace, length: prefs.length,
                  authors: prefs.authors, loved: prefs.loved, minRating: prefs.minRating,
                });
                showToast("Preferences saved!");
              } catch (err) {
                showToast("Saved locally!");
              }
              setTimeout(() => setPage("discover"), 800);
            }}>
              ✨ Discover books by preference →
            </button>
            <button className="prefs-save-btn" style={{
              background: "transparent",
              border: "2px solid var(--amber)",
              color: "var(--amber)",
            }} onClick={async () => {
              try {
                await savePreferences({
                  genres: prefs.genres, pace: prefs.pace, length: prefs.length,
                  authors: prefs.authors, loved: prefs.loved, minRating: prefs.minRating,
                });
                showToast("Preferences saved — ready to scan!");
              } catch (err) {
                showToast("Ready to scan!");
              }
              setTimeout(() => setPage("scanner"), 800);
            }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <Camera size={18}/> Scan a shelf instead →
              </span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}