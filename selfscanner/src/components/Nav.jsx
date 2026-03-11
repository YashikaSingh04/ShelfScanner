import { useAppAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Camera } from "lucide-react";

export default function Nav({ page, setPage }) {
  const { isAuthenticated, signOut, signIn, name, email } = useAppAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: scrolled ? "rgba(28,20,9,0.97)" : "var(--bark)",
      borderBottom: "3px solid var(--gold)",
      padding: "0 2rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: "64px",
      boxShadow: "0 4px 20px rgba(28,20,9,0.3)",
      transition: "background 0.3s",
    }}>

      {/* Animated Logo */}
      <div
        className="nav-brand"
        onClick={() => setPage("home")}
        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
      >
        <div style={{ position: "relative", width: "32px", height: "32px" }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <style>{`
              @keyframes bookBounce {
                0%, 100% { transform: translateY(0px) rotate(-3deg); }
                50% { transform: translateY(-4px) rotate(3deg); }
              }
              @keyframes pageFlip {
                0%, 100% { transform: scaleX(1); }
                50% { transform: scaleX(0.85); }
              }
              .book-body { animation: bookBounce 2.5s ease-in-out infinite; transform-origin: center; }
              .book-page { animation: pageFlip 2.5s ease-in-out infinite; transform-origin: left; }
            `}</style>
            <g className="book-body">
              <rect x="4" y="6" width="18" height="22" rx="2" fill="#d4a84b"/>
              <rect x="4" y="6" width="4" height="22" rx="1" fill="#c8852a"/>
              <rect x="10" y="11" width="9" height="1.5" rx="1" fill="rgba(255,255,255,0.6)" className="book-page"/>
              <rect x="10" y="14" width="7" height="1.5" rx="1" fill="rgba(255,255,255,0.4)" className="book-page"/>
              <rect x="10" y="17" width="8" height="1.5" rx="1" fill="rgba(255,255,255,0.4)" className="book-page"/>
            </g>
            <g style={{ animation: "bookBounce 2.5s ease-in-out infinite 0.4s", transformOrigin: "center" }}>
              <rect x="16" y="9" width="14" height="19" rx="2" fill="#7c4b2a"/>
              <rect x="16" y="9" width="3.5" height="19" rx="1" fill="#5c3520"/>
              <rect x="21" y="14" width="6" height="1.2" rx="1" fill="rgba(255,255,255,0.4)"/>
              <rect x="21" y="17" width="5" height="1.2" rx="1" fill="rgba(255,255,255,0.3)"/>
            </g>
          </svg>
        </div>
        <span style={{
         
          fontFamily: "'Baloo 2', cursive",
          fontSize: "1.6rem",
          fontWeight: 800,
          fontSize: "1.5rem",
          color: "var(--gold)",
          letterSpacing: "0.02em",
          background: "linear-gradient(135deg, var(--gold), var(--amber))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          ShelfScanner
        </span>
      </div>

      <div className="nav-links">
        {isAuthenticated && (
          <>
            {[
              ["home",    "Home"],
              ["discover", "Discover"],
              ["scanner", "Scan a Shelf"],
              ["results", "Results"],
              ["list",    "Reading List"],
            ].map(([p, label]) => (
              <button
                key={p}
                className={`nav-link${page === p ? " active" : ""}`}
                onClick={() => setPage(p)}
              >
                {label}
              </button>
            ))}
            <button className="nav-cta" onClick={() => setPage("scanner")}
  style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
  <Camera size={15} strokeWidth={2.5} /> Scan Now
</button>
          </>
        )}

        {isAuthenticated ? (
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            marginLeft: "0.5rem", paddingLeft: "0.75rem",
            borderLeft: "1px solid rgba(255,255,255,0.15)"
          }}>
            <div style={{ position: "relative", width: "44px", height: "44px", flexShrink: 0 }}>
              <img
                src="/fairy/wreath.png"
                alt=""
                style={{
                  position: "absolute",
                  top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60px", height: "60px",
                  pointerEvents: "none",
                  zIndex: 1,
                  animation: "wreathGlow 2s ease-in-out infinite alternate",
                }}
              />
              <div style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
                width: "34px", height: "34px", borderRadius: "50%",
                background: "var(--amber)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Righteous', cursive",
                fontSize: "0.95rem", fontWeight: 700,
                color: "white",
                border: "2px solid var(--gold)"
              }}>
                {(name || email || "U")[0].toUpperCase()}
              </div>
            </div>
            <span style={{
              fontFamily: "'Crimson Pro', serif",
              fontSize: "0.9rem", color: "var(--parchment)",
              opacity: 0.85, maxWidth: "120px",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
            }}>
              {name || email}
            </span>
            <button
              onClick={signOut}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "4px", padding: "0.35rem 0.75rem",
                color: "var(--parchment)", opacity: 0.7,
                fontFamily: "'Crimson Pro', serif", fontSize: "0.85rem",
                cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseOver={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderColor = "var(--gold)"; }}
              onMouseOut={e => { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <button className="nav-cta" onClick={signIn}>Sign in</button>
        )}
      </div>
    </nav>
  );
}