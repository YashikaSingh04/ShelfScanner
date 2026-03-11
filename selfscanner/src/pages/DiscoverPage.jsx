import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck, ShoppingCart, Search, SlidersHorizontal } from "lucide-react";
import { getDiscover } from "../services/api";
import BookModal from "../components/BookModal";
import { saveBook, removeBook } from "../services/api";

export default function DiscoverPage({ saved, setSaved, showToast, setPage }) {
  const [books,   setBooks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filter,  setFilter]  = useState("all");
  const [sort,    setSort]    = useState("relevance");
  const [search,  setSearch]  = useState("");
  const [basedOn,    setBasedOn]    = useState({ genres: [], authors: "" });
const [modalBook,  setModalBook]  = useState(null);

  useEffect(() => {
    fetchDiscoverBooks();
  }, []);

  const fetchDiscoverBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDiscover();
      setBooks(result.books || []);
      setBasedOn(result.basedOn || { genres: [], authors: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
    setSaved(s =>
      alreadySaved
        ? s.filter(b => b.title !== book.title)
        : [...s, { ...book, savedAt: new Date().toLocaleDateString() }]
    );
    showToast(alreadySaved ? "Removed" : `"${book.title}" saved!`);
  }
};

  const isSaved = title => saved.some(b => b.title === title);

  // Filter + sort + search
  const displayBooks = books
    .filter(b => {
      if (filter === "rated")  return b.rating >= 4;
      if (filter === "priced") return b.pricing?.google?.price;
      if (filter === "free")   return b.pricing?.openLibrary?.available;
      return true;
    })
    .filter(b =>
      search
        ? b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sort === "rating")  return (b.rating || 0) - (a.rating || 0);
      if (sort === "pages")   return (b.pageCount || 0) - (a.pageCount || 0);
      return 0;
    });

  return (
    <div className="page">
      <div className="results-wrap">

        {/* Header */}
        <div className="results-header">
          <h2>Discover books</h2>
          <p>
            Personalised picks based on your preferences
            {basedOn.genres?.length > 0 && (
              <span> · {basedOn.genres.join(", ")}</span>
            )}
          </p>

          {/* Based on tags */}
          {basedOn.genres?.length > 0 && (
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.6rem" }}>
              {basedOn.genres.map((g, i) => (
                <span key={i} style={{
                  background: "var(--amber)", color: "white",
                  borderRadius: "20px", padding: "0.2rem 0.7rem",
                  fontSize: "0.78rem", fontFamily: "'DM Mono', monospace",
                }}>
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Search bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          background: "var(--warm-white)", border: "1px solid var(--border)",
          borderRadius: "10px", padding: "0.6rem 1rem", marginBottom: "1rem",
        }}>
          <Search size={16} color="var(--dusty)"/>
          <input
            type="text"
            placeholder="Search within results…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              border: "none", background: "transparent", outline: "none",
              fontFamily: "'Crimson Pro', serif", fontSize: "1rem",
              color: "var(--bark)", width: "100%",
            }}
          />
        </div>

        {/* Filter + Sort bar */}
        <div style={{
          display: "flex", gap: "0.5rem", marginBottom: "1.5rem",
          flexWrap: "wrap", alignItems: "center",
        }}>
          <SlidersHorizontal size={14} color="var(--dusty)"/>
          {[
            ["all",    "All"],
            ["rated",  "⭐ Top rated"],
            ["priced", "💰 Available to buy"],
            ["free",   "📖 Free to read"],
          ].map(([f, label]) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "0.35rem 0.9rem", borderRadius: "20px", fontSize: "0.85rem",
              border: `1.5px solid ${filter === f ? "var(--amber)" : "var(--border)"}`,
              background: filter === f ? "var(--amber)" : "transparent",
              color: filter === f ? "white" : "var(--bark)",
              cursor: "pointer", transition: "all 0.2s",
              fontFamily: "'Crimson Pro', serif",
            }}>
              {label}
            </button>
          ))}

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--dusty)" }}>Sort:</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                border: "1px solid var(--border)", borderRadius: "6px",
                padding: "0.3rem 0.6rem", background: "var(--warm-white)",
                fontFamily: "'Crimson Pro', serif", fontSize: "0.9rem",
                color: "var(--bark)", cursor: "pointer",
              }}
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Rating</option>
              <option value="pages">Page count</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--dusty)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📚</div>
            <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "1.1rem" }}>
              Finding books you'll love…
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            background: "rgba(200,133,42,0.1)", border: "1px solid var(--amber)",
            borderRadius: "10px", padding: "1.5rem", textAlign: "center",
          }}>
            <p style={{ marginBottom: "1rem", color: "var(--bark)" }}>
              {error === "Please set your preferences first"
                ? "👋 Set your reading preferences on the home page first!"
                : error
              }
            </p>
            <button className="btn-primary" onClick={() =>
              error === "Please set your preferences first"
                ? setPage("home")
                : fetchDiscoverBooks()
            }>
              {error === "Please set your preferences first"
                ? "Go to preferences →"
                : "Try again"
              }
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && !error && displayBooks.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--dusty)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔍</div>
            <p>No books found for this filter.</p>
            <button
              onClick={() => setFilter("all")}
              style={{ marginTop: "0.8rem", color: "var(--amber)", cursor: "pointer",
                background: "none", border: "none", fontSize: "0.95rem" }}>
              Clear filter →
            </button>
          </div>
        )}

        {/* Book grid */}
        {!loading && !error && displayBooks.length > 0 && (
          <div className="book-cards">
            {displayBooks.map((book, index) => (
              <div className="book-card" key={index}
  style={{ cursor: "pointer" }}
  onClick={() => setModalBook(book)}
>

                {/* Cover */}
                <div className="book-cover">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} style={{
                      width: "90px", height: "130px", objectFit: "cover",
                      borderRadius: "3px", boxShadow: "4px 4px 12px rgba(0,0,0,0.3)",
                    }}/>
                  ) : (
                    <div className="book-cover-placeholder">📚</div>
                  )}
                </div>

                {/* Info */}
                <div className="book-info">
                  <div className="book-title">{book.title}</div>
                  <div className="book-author">{book.author}</div>

                  {book.rating && (
                    <div style={{ fontSize: "0.82rem", color: "var(--dusty)", marginBottom: "0.5rem" }}>
                      ⭐ {book.rating} ({book.ratingsCount?.toLocaleString() || 0} ratings)
                      {book.pageCount ? ` · ${book.pageCount} pages` : ""}
                    </div>
                  )}

                  {book.description && (
                    <p style={{
                      fontSize: "0.85rem", color: "var(--dusty)",
                      marginBottom: "0.8rem", lineHeight: 1.5,
                      display: "-webkit-box", WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {book.description}
                    </p>
                  )}

                  {/* Price comparison */}
                  <div style={{
                    fontSize: "0.82rem", color: "var(--dusty)", marginBottom: "0.6rem",
                    background: "rgba(245,239,224,0.8)", borderRadius: "6px",
                    padding: "0.6rem 0.8rem",
                  }}>
                    <div style={{
                      fontFamily: "'DM Mono', monospace", fontSize: "0.68rem",
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      marginBottom: "0.4rem", color: "var(--dusty)",
                    }}>
                      Where to buy
                    </div>

                    {book.pricing?.google?.price && (
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span>Google Play</span>
                        <a href={book.pricing.google.buyUrl} target="_blank" rel="noreferrer"
                          style={{ color: "var(--amber)", fontWeight: 500, textDecoration: "none" }}>
                          {book.pricing.google.price} →
                        </a>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <span>Amazon India</span>
                      <a href={book.pricing?.amazon?.buyUrl} target="_blank" rel="noreferrer"
                        style={{ color: "var(--amber)", textDecoration: "none" }}>
                        Search →
                      </a>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Open Library</span>
                      <a href={book.pricing?.openLibrary?.buyUrl} target="_blank" rel="noreferrer"
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
                    <button className="btn-amazon"
                      onClick={() => window.open(book.pricing?.amazon?.buyUrl, "_blank")}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <ShoppingCart size={14}/> Amazon
                      </span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh button */}
        {!loading && !error && books.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button className="btn-secondary" onClick={fetchDiscoverBooks}>
              🔄 Refresh recommendations
            </button>
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