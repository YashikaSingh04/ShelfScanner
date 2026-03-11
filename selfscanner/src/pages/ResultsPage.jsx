import { useState } from "react";
import { Bookmark, BookmarkCheck, ShoppingCart, Lightbulb } from "lucide-react";
import { saveBook, removeBook } from "../services/api";
import BookModal from "../components/BookModal";


const MOCK_BOOKS = [
  {
    title: "The Midnight Library", author: "Matt Haig",
    coverImage: null, matchPercent: "98%", matchLevel: "high",
    rating: 4.2, pageCount: 304,
    reason: "Matches your love of literary fiction with speculative elements.",
    pricing: {
      google: { price: "₹299", buyUrl: "#" },
      amazon: { buyUrl: "https://www.amazon.in/s?k=The+Midnight+Library" },
      openLibrary: { available: true, buyUrl: "#" }
    }
  },
  {
    title: "Circe", author: "Madeline Miller",
    coverImage: null, matchPercent: "94%", matchLevel: "high",
    rating: 4.4, pageCount: 393,
    reason: "Your preference for mythological retellings makes this a near-perfect pick.",
    pricing: {
      google: { price: "₹350", buyUrl: "#" },
      amazon: { buyUrl: "https://www.amazon.in/s?k=Circe" },
      openLibrary: { available: false }
    }
  },
  {
    title: "Project Hail Mary", author: "Andy Weir",
    coverImage: null, matchPercent: "60%", matchLevel: "medium",
    rating: 4.5, pageCount: 476,
    reason: "Great book but slightly outside your usual preferences.",
    pricing: {
      google: { price: null },
      amazon: { buyUrl: "https://www.amazon.in/s?k=Project+Hail+Mary" },
      openLibrary: { available: false }
    }
  },
  {
    title: "Anxious People", author: "Fredrik Backman",
    coverImage: null, matchPercent: "30%", matchLevel: "low",
    rating: 4.1, pageCount: 352,
    reason: "May not align closely with your stated preferences.",
    pricing: {
      google: { price: "₹280", buyUrl: "#" },
      amazon: { buyUrl: "https://www.amazon.in/s?k=Anxious+People" },
      openLibrary: { available: true, buyUrl: "#" }
    }
  },
];

const MOCK_DETECTED = [
  "The Midnight Library", "Circe", "Project Hail Mary",
  "Klara and the Sun", "The Thursday Murder Club", "Anxious People"
];

const MATCH_COLORS = {
  high:    { bg: "rgba(107,124,94,0.15)",  border: "var(--sage)",  text: "var(--sage)",  label: "Great match" },
  medium:  { bg: "rgba(200,133,42,0.1)",   border: "var(--amber)", text: "var(--amber)", label: "Decent match" },
  low:     { bg: "rgba(158,143,125,0.1)",  border: "var(--dusty)", text: "var(--dusty)", label: "Low match" },
  unknown: { bg: "transparent",            border: "var(--border)", text: "var(--dusty)", label: "" },
};

export default function ResultsPage({ saved, setSaved, showToast, results }) {
  const [tab,    setTab]    = useState("recommended");
  const [filter, setFilter] = useState("all");
  const [modalBook, setModalBook] = useState(null);
  const detectedBooks   = results?.detected       || MOCK_DETECTED;
  const recommendations = results?.recommendations || MOCK_BOOKS;
  const hasPreferences  = results?.hasPreferences  ?? true;

  const filteredBooks = filter === "all"
    ? recommendations
    : recommendations.filter(b => b.matchLevel === filter);

  const toggleSave = async book => {
  const alreadySaved = saved.find(b => b.title === book.title);
  try {
    if (alreadySaved) {
      await removeBook(book.title);
      setSaved(s => s.filter(b => b.title !== book.title));
      showToast("Removed from reading list");
    } else {
      await saveBook({
        title:      book.title,
        author:     book.author,
        coverImage: book.coverImage,
        amazonUrl:  book.pricing?.amazon?.buyUrl,
        googleUrl:  book.pricing?.google?.buyUrl,
        openLibUrl: book.pricing?.openLibrary?.buyUrl,
      });
      setSaved(s => [...s, { ...book, savedAt: new Date().toLocaleDateString() }]);
      showToast(`"${book.title}" added to your list`);
    }
  } catch (err) {
    // Fallback to local state if API fails
    setSaved(s =>
      alreadySaved
        ? s.filter(b => b.title !== book.title)
        : [...s, { ...book, savedAt: new Date().toLocaleDateString() }]
    );
    showToast(alreadySaved ? "Removed" : `"${book.title}" saved!`);
  }
};

  const isSaved = title => saved.some(b => b.title === title);

  return (
    <div className="page">
      <div className="results-wrap">

        {/* Header */}
        <div className="results-header">
          <h2>Shelf results</h2>
          <p>
            Found {detectedBooks.length} books on the shelf ·{" "}
            {recommendations.length} ranked by{" "}
            {hasPreferences ? "your preferences" : "popularity"}
          </p>
          {!hasPreferences && (
            <div style={{
              background: "rgba(200,133,42,0.1)",
              border: "1px solid var(--amber)",
              borderRadius: "8px", padding: "0.8rem 1rem",
              marginTop: "0.8rem", fontSize: "0.92rem", color: "var(--bark)"
            }}>
              💡 <strong>Tip:</strong> Set your reading preferences on the
              home page to get personalised rankings!
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="results-tabs">
          {[
            ["recommended", "⭐ Ranked books"],
            ["all",         "📋 All detected"],
          ].map(([t, l]) => (
            <button
              key={t}
              className={`tab-btn${tab === t ? " active" : ""}`}
              onClick={() => setTab(t)}
            >
              {l}
            </button>
          ))}
        </div>

        {/* All detected tab */}
        {tab === "all" && (
          <div className="detected-shelf">
            <h4>Books detected on shelf</h4>
            <div className="book-spine-list">
              {detectedBooks.map((b, i) => (
                <span className="spine-tag" key={i}>
                  {typeof b === "string" ? b : b.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Filter bar */}
        {tab === "recommended" && hasPreferences && (
          <div style={{
            display: "flex", gap: "0.5rem",
            marginBottom: "1.5rem", flexWrap: "wrap"
          }}>
            {[
              ["all",    "All books"],
              ["high",   "🟢 Great match"],
              ["medium", "🟡 Decent match"],
              ["low",    "⚪ Low match"],
            ].map(([f, label]) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "0.35rem 0.9rem",
                  borderRadius: "20px", fontSize: "0.85rem",
                  border: `1.5px solid ${filter === f ? "var(--amber)" : "var(--border)"}`,
                  background: filter === f ? "var(--amber)" : "transparent",
                  color: filter === f ? "white" : "var(--bark)",
                  cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "'Crimson Pro', serif",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Book cards */}
        {tab === "recommended" && (
          <div className="book-cards">
            {filteredBooks.map((book, index) => {
              const matchStyle = MATCH_COLORS[book.matchLevel || "unknown"];
              return (
               <div className="book-card" key={index}
  style={{
    border: `1px solid ${matchStyle.border}`,
    background: matchStyle.bg,
    cursor: "pointer",
  }}
  onClick={() => setModalBook(book)}
>

                  {/* Cover */}
                  <div className="book-cover">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        style={{
                          width: "90px", height: "130px",
                          objectFit: "cover", borderRadius: "3px",
                          boxShadow: "4px 4px 12px rgba(0,0,0,0.3)"
                        }}
                      />
                    ) : (
                      <div className="book-cover-placeholder">📚</div>
                    )}
                    <span className="book-match-badge" style={{
                      background: matchStyle.border,
                    }}>
                      {book.matchPercent}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="book-info">
                    <div className="book-title">{book.title}</div>
                    <div className="book-author">{book.author}</div>

                    {matchStyle.label && (
                      <div style={{
                        display: "inline-block",
                        fontSize: "0.75rem",
                        color: matchStyle.text,
                        border: `1px solid ${matchStyle.border}`,
                        borderRadius: "4px",
                        padding: "0.15rem 0.5rem",
                        marginBottom: "0.5rem",
                        fontFamily: "'DM Mono', monospace",
                        letterSpacing: "0.05em",
                      }}>
                        {matchStyle.label}
                      </div>
                    )}

                    {book.rating && (
                      <div style={{
                        fontSize: "0.82rem", color: "var(--dusty)",
                        marginBottom: "0.5rem"
                      }}>
                        ⭐ {book.rating}
                        {book.pageCount ? ` · ${book.pageCount} pages` : ""}
                      </div>
                    )}

                    <p className="book-why" style={{ display: "flex", gap: "0.4rem" }}>
                      <Lightbulb size={14} color="var(--amber)"
                        style={{ flexShrink: 0, marginTop: "2px" }}/>
                      {book.reason}
                    </p>

                    {/* Price comparison */}
                    <div style={{
                      fontSize: "0.82rem", color: "var(--dusty)",
                      marginBottom: "0.6rem",
                      background: "rgba(245,239,224,0.8)",
                      borderRadius: "6px", padding: "0.6rem 0.8rem"
                    }}>
                      <div style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.68rem", letterSpacing: "0.1em",
                        textTransform: "uppercase", marginBottom: "0.4rem",
                        color: "var(--dusty)"
                      }}>
                        Where to buy
                      </div>

                      {book.pricing?.google?.price && (
                        <div style={{
                          display: "flex", justifyContent: "space-between",
                          marginBottom: "0.25rem"
                        }}>
                          <span>Google Play</span>
                          <a href={book.pricing.google.buyUrl}
                            target="_blank" rel="noreferrer"
                            style={{ color: "var(--amber)", fontWeight: 500, textDecoration: "none" }}>
                            {book.pricing.google.price} →
                          </a>
                        </div>
                      )}

                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        marginBottom: "0.25rem"
                      }}>
                        <span>Amazon India</span>
                        <a href={book.pricing?.amazon?.buyUrl}
                          target="_blank" rel="noreferrer"
                          style={{ color: "var(--amber)", textDecoration: "none" }}>
                          Search →
                        </a>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Open Library</span>
                        <a href={book.pricing?.openLibrary?.buyUrl}
                          target="_blank" rel="noreferrer"
                          style={{ color: "var(--sage)", fontWeight: 500, textDecoration: "none" }}>
                          FREE →
                        </a>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="book-actions">
                      <button
                        className={`btn-save${isSaved(book.title) ? " saved" : ""}`}
                        onClick={() => toggleSave(book)}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                          {isSaved(book.title)
                            ? <><BookmarkCheck size={14}/> Saved</>
                            : <><Bookmark size={14}/> Save</>
                          }
                        </span>
                      </button>
                      <button
                        className="btn-amazon"
                        onClick={() => window.open(book.pricing?.amazon?.buyUrl, "_blank")}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                          <ShoppingCart size={14}/> Amazon
                        </span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <BookModal
        book={modalBook}
        onClose={() => setModalBook(null)}
        saved={saved}
        setSaved={setSaved}
        showToast={showToast}
      />
    </div>
  );
}