import { BookOpen, ShoppingCart, Trash2 } from "lucide-react";
import { Camera } from "lucide-react";
import { removeBook } from "../services/api";
import BookModal from "../components/BookModal";
import { useState } from "react";

export default function ReadingListPage({ saved, setSaved, setPage, showToast }) {
  const [modalBook, setModalBook] = useState(null);

  const remove = async title => {
    try {
      await removeBook(title);
    } catch (err) {
      console.error("Remove error:", err);
    }
    setSaved(s => s.filter(b => b.title !== title));
    showToast("Removed from reading list");
  };

  const formatDate = dateStr => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="page">
      <div className="list-wrap">

        <div className="list-header">
          <h2>Your reading list</h2>
          <p>{saved.length} {saved.length === 1 ? "book" : "books"} saved for later</p>
        </div>

        {saved.length === 0 ? (
          <div className="list-empty">
            <div style={{ marginBottom: "1rem", opacity: 0.25 }}>
              <BookOpen size={56} color="var(--bark)" strokeWidth={1}/>
            </div>
            <h3>Your list is empty</h3>
            <p>Scan a bookshelf or discover books and save ones you'd like to read.</p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
              <button className="btn-primary" onClick={() => setPage("scanner")}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  <Camera size={16}/> Scan a shelf
                </span>
              </button>
              <button className="btn-secondary" onClick={() => setPage("discover")}>
                ✨ Discover books
              </button>
            </div>
          </div>
        ) : (
          <div className="list-items">
            {saved.map(book => (
              <div className="list-item" key={book.title}
                style={{ cursor: "pointer" }}
                onClick={() => setModalBook(book)}
              >
                {/* Cover image */}
                <div className="list-item-cover">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      style={{
                        width: "60px", height: "88px",
                        objectFit: "cover", borderRadius: "4px",
                        boxShadow: "2px 2px 8px rgba(0,0,0,0.2)"
                      }}
                    />
                  ) : (
                    <div style={{
                      width: "60px", height: "88px",
                      background: "var(--bark)", borderRadius: "4px",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "1.5rem"
                    }}>
                      📚
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="list-item-info">
                  <div className="list-item-title">{book.title}</div>
                  <div className="list-item-author">{book.author}</div>
                  {book.rating && (
                    <div style={{ fontSize: "0.8rem", color: "var(--dusty)", margin: "0.2rem 0" }}>
                      ⭐ {book.rating}
                      {book.pageCount ? ` · ${book.pageCount} pages` : ""}
                    </div>
                  )}
                  <div className="list-item-date">Saved {formatDate(book.savedAt)}</div>
                </div>

                {/* Actions */}
                <div className="list-item-actions" onClick={e => e.stopPropagation()}>
                  <button className="btn-amazon"
                    onClick={() => window.open(
                      book.pricing?.amazon?.buyUrl ||
                      `https://www.amazon.in/s?k=${encodeURIComponent(book.title)}`,
                      "_blank"
                    )}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                      <ShoppingCart size={13}/> Buy
                    </span>
                  </button>
                  <button className="btn-remove" onClick={() => remove(book.title)}>
                    <Trash2 size={14}/>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        <BookModal
          book={modalBook}
          onClose={() => setModalBook(null)}
          saved={saved}
          setSaved={setSaved}
          showToast={showToast}
        />

      </div>
    </div>
  );
}