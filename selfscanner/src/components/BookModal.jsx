import { useEffect } from "react";
import { X, Bookmark, BookmarkCheck, ShoppingCart, BookOpen, Headphones } from "lucide-react";
import { saveBook, removeBook } from "../services/api";


export default function BookModal({ book, onClose, saved, setSaved, showToast }) {
  useEffect(() => {
  if (book) {
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  }
  return () => {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
  };
}, [book]);

  if (!book) return null;

  const isSaved = saved.some(b => b.title === book.title);

  const toggleSave = async () => {
    try {
      if (isSaved) {
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
        isSaved
          ? s.filter(b => b.title !== book.title)
          : [...s, { ...book, savedAt: new Date().toLocaleDateString() }]
      );
      showToast(isSaved ? "Removed" : `"${book.title}" saved!`);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(28,20,9,0.6)",
          zIndex: 200,
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50vh",
        left: "50vw",
        transform: "translate(-50%, -50%)",
        zIndex: 201,
        background: "var(--warm-white)",
        borderRadius: "16px",
        boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        width: "min(680px, 92vw)",
        maxHeight: "80vh",
        overflowY: "auto",
      }}>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "sticky", top: "1rem",
            float: "right", marginRight: "1rem",
            background: "rgba(28,20,9,0.08)",
            border: "none", borderRadius: "50%",
            width: "36px", height: "36px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 10,
          }}
        >
          <X size={18} color="var(--bark)"/>
        </button>

        <div style={{ padding: "2rem", paddingTop: "1.5rem" }}>

          {/* Top section — cover + basic info */}
          <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>

            {/* Cover */}
            <div style={{ flexShrink: 0 }}>
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} style={{
                  width: "120px", height: "175px",
                  objectFit: "cover", borderRadius: "6px",
                  boxShadow: "6px 6px 20px rgba(0,0,0,0.25)",
                }}/>
              ) : (
                <div style={{
                  width: "120px", height: "175px",
                  background: "var(--bark)", borderRadius: "6px",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "2.5rem",
                }}>
                  📚
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.5rem", color: "var(--bark)",
                marginBottom: "0.3rem", lineHeight: 1.3,
              }}>
                {book.title}
              </h2>
              <p style={{
                fontFamily: "'Crimson Pro', serif",
                fontSize: "1.05rem", color: "var(--dusty)",
                marginBottom: "0.8rem", fontStyle: "italic",
              }}>
                {book.author}
              </p>

              {/* Rating + pages */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
                {book.rating && (
                  <span style={{
                    background: "rgba(200,133,42,0.12)",
                    border: "1px solid var(--amber)",
                    borderRadius: "6px", padding: "0.25rem 0.6rem",
                    fontSize: "0.85rem", color: "var(--amber)", fontWeight: 600,
                  }}>
                    ⭐ {book.rating} {book.ratingsCount ? `(${book.ratingsCount.toLocaleString()})` : ""}
                  </span>
                )}
                {book.pageCount && (
                  <span style={{
                    background: "rgba(107,124,94,0.1)",
                    border: "1px solid var(--sage)",
                    borderRadius: "6px", padding: "0.25rem 0.6rem",
                    fontSize: "0.85rem", color: "var(--sage)",
                  }}>
                    📄 {book.pageCount} pages
                  </span>
                )}
                {book.publishedDate && (
                  <span style={{
                    background: "rgba(158,143,125,0.1)",
                    border: "1px solid var(--dusty)",
                    borderRadius: "6px", padding: "0.25rem 0.6rem",
                    fontSize: "0.85rem", color: "var(--dusty)",
                  }}>
                    🗓 {book.publishedDate?.slice(0, 4)}
                  </span>
                )}
              </div>

              {/* Match info if from results */}
              {book.matchPercent && (
                <div style={{
                  background: "rgba(107,124,94,0.12)",
                  border: "1px solid var(--sage)",
                  borderRadius: "8px", padding: "0.5rem 0.8rem",
                  fontSize: "0.88rem", color: "var(--bark)",
                }}>
                  ✅ <strong>{book.matchPercent} match</strong> — {book.reason}
                </div>
              )}
            </div>
          </div>

          {/* Description / Summary */}
          {book.description && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem", letterSpacing: "0.12em",
                textTransform: "uppercase", color: "var(--dusty)",
                marginBottom: "0.6rem",
              }}>
                About this book
              </h4>
              <p style={{
                fontFamily: "'Crimson Pro', serif",
                fontSize: "1.05rem", lineHeight: 1.7,
                color: "var(--bark)", opacity: 0.85,
              }}>
                {book.description}
              </p>
            </div>
          )}

          {/* Availability */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem", letterSpacing: "0.12em",
              textTransform: "uppercase", color: "var(--dusty)",
              marginBottom: "0.8rem",
            }}>
              Availability
            </h4>
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>

              {/* Free PDF / Read online */}
              <div style={{
                flex: 1, minWidth: "140px",
                background: book.pricing?.openLibrary?.buyUrl
                  ? "rgba(107,124,94,0.1)" : "rgba(158,143,125,0.08)",
                border: `1px solid ${book.pricing?.openLibrary?.buyUrl ? "var(--sage)" : "var(--border)"}`,
                borderRadius: "10px", padding: "0.8rem 1rem",
                textAlign: "center",
              }}>
                <BookOpen size={20} color={book.pricing?.openLibrary?.buyUrl ? "var(--sage)" : "var(--dusty)"}
                  style={{ marginBottom: "0.4rem" }}/>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--bark)", marginBottom: "0.2rem" }}>
                  Free to Read
                </div>
                {book.pricing?.openLibrary?.buyUrl ? (
                  <a href={book.pricing.openLibrary.buyUrl} target="_blank" rel="noreferrer"
                    style={{ fontSize: "0.78rem", color: "var(--sage)", textDecoration: "none" }}>
                    Open Library →
                  </a>
                ) : (
                  <div style={{ fontSize: "0.78rem", color: "var(--dusty)" }}>Not available</div>
                )}
              </div>

              {/* Audiobook */}
              <div style={{
                flex: 1, minWidth: "140px",
                background: "rgba(158,143,125,0.08)",
                border: "1px solid var(--border)",
                borderRadius: "10px", padding: "0.8rem 1rem",
                textAlign: "center",
              }}>
                <Headphones size={20} color="var(--dusty)" style={{ marginBottom: "0.4rem" }}/>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--bark)", marginBottom: "0.2rem" }}>
                  Audiobook
                </div>
                <a
                  href={`https://www.audible.in/search?keywords=${encodeURIComponent(book.title)}`}
                  target="_blank" rel="noreferrer"
                  style={{ fontSize: "0.78rem", color: "var(--amber)", textDecoration: "none" }}
                >
                  Search Audible →
                </a>
              </div>

              {/* Google Play */}
              <div style={{
                flex: 1, minWidth: "140px",
                background: book.pricing?.google?.price
                  ? "rgba(200,133,42,0.08)" : "rgba(158,143,125,0.08)",
                border: `1px solid ${book.pricing?.google?.price ? "var(--amber)" : "var(--border)"}`,
                borderRadius: "10px", padding: "0.8rem 1rem",
                textAlign: "center",
              }}>
                <span style={{ fontSize: "1.2rem", display: "block", marginBottom: "0.4rem" }}>📱</span>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--bark)", marginBottom: "0.2rem" }}>
                  Google Play
                </div>
                {book.pricing?.google?.price ? (
                  <a href={book.pricing.google.buyUrl} target="_blank" rel="noreferrer"
                    style={{ fontSize: "0.78rem", color: "var(--amber)", textDecoration: "none" }}>
                    {book.pricing.google.price} →
                  </a>
                ) : (
                  <div style={{ fontSize: "0.78rem", color: "var(--dusty)" }}>Check store</div>
                )}
              </div>

            </div>
          </div>

          {/* Where to buy */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem", letterSpacing: "0.12em",
              textTransform: "uppercase", color: "var(--dusty)",
              marginBottom: "0.8rem",
            }}>
              Where to buy
            </h4>
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              <a href={book.pricing?.amazon?.buyUrl} target="_blank" rel="noreferrer"
                style={{
                  flex: 1, textAlign: "center",
                  background: "var(--amber)", color: "white",
                  borderRadius: "8px", padding: "0.7rem 1rem",
                  textDecoration: "none", fontFamily: "'Crimson Pro', serif",
                  fontSize: "0.95rem", fontWeight: 600,
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "0.4rem",
                }}>
                <ShoppingCart size={15}/> Amazon India
              </a>
              {(book.pricing?.google?.buyUrl || book.googleUrl) && (
                <a href={book.pricing?.google?.buyUrl || book.googleUrl} target="_blank" rel="noreferrer"
                  style={{
                    flex: 1, textAlign: "center",
                    background: "transparent",
                    border: "2px solid var(--amber)", color: "var(--amber)",
                    borderRadius: "8px", padding: "0.7rem 1rem",
                    textDecoration: "none", fontFamily: "'Crimson Pro', serif",
                    fontSize: "0.95rem", fontWeight: 600,
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "0.4rem",
                  }}>
                  📱 Google Play
                </a>
              )}
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={toggleSave}
            style={{
              width: "100%", padding: "0.9rem",
              background: isSaved ? "var(--sage)" : "var(--bark)",
              color: "white", border: "none", borderRadius: "10px",
              fontFamily: "'Crimson Pro', serif", fontSize: "1.05rem",
              fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "0.5rem",
              transition: "all 0.2s",
            }}
          >
            {isSaved
              ? <><BookmarkCheck size={18}/> Saved to reading list</>
              : <><Bookmark size={18}/> Save to reading list</>
            }
          </button>

        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translate(-50%, -45%); opacity: 0 } to { transform: translate(-50%, -50%); opacity: 1 } }
      `}</style>
    </>
  );
}