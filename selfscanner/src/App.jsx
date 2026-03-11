import { useAuth } from "react-oidc-context";
import { useState } from "react";
import Nav          from "./components/Nav";
import FairyCursor from "./components/FairyCursor";
import Footer       from "./components/Footer";
import Toast        from "./components/Toast";
import HomePage     from "./pages/HomePage";
import ScannerPage  from "./pages/ScannerPage";
import ResultsPage  from "./pages/ResultsPage";
import ReadingListPage from "./pages/ReadingListPage";
import DiscoverPage from "./pages/DiscoverPage";
import AuthPage     from "./pages/AuthPage";
import { useEffect } from "react";
import { getReadingList } from "./services/api";

export default function App() {
  const auth = useAuth();
  const [page,    setPage]    = useState("home");
  const [saved, setSaved] = useState([]);
const [savedLoaded, setSavedLoaded] = useState(false);
  const [toast,   setToast]   = useState(null);
  const [results, setResults] = useState(null);
  const [prefs,   setPrefs]   = useState({
    genres: [], pace: "", length: "", authors: "", loved: "", minRating: 0
  });

  const showToast = msg => {
    setToast(null);
    setTimeout(() => setToast(msg), 10);
  };
  // Load reading list from backend on login
useEffect(() => {
  if (auth.isAuthenticated && !savedLoaded) {
    getReadingList()
      .then(res => {
        setSaved(res.books || []);
        setSavedLoaded(true);
      })
      .catch(() => setSavedLoaded(true));
  }
}, [auth.isAuthenticated, savedLoaded]);

  // Loading screen
  if (auth.isLoading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "var(--bark)", flexDirection: "column", gap: "1rem"
      }}>
        <div style={{ fontSize: "3rem" }}>📖</div>
        <p style={{
          fontFamily: "'DM Mono', monospace", fontSize: "0.8rem",
          color: "var(--gold)", letterSpacing: "0.15em",
          textTransform: "uppercase"
        }}>
          Loading…
        </p>
      </div>
    );
  }

  // Error screen
  if (auth.error) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "var(--bark)", flexDirection: "column", gap: "1rem"
      }}>
        <div style={{ fontSize: "3rem" }}>⚠️</div>
        <p style={{
          fontFamily: "'Crimson Pro', serif",
          fontSize: "1rem", color: "var(--parchment)"
        }}>
          {auth.error.message}
        </p>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  // Not logged in → Auth page
  if (!auth.isAuthenticated) {
    return (
      <div className="app-shell">
        <AuthPage />
      </div>
    );
  }

  // Logged in → Full app
  const pages = {
    home:     <HomePage      setPage={setPage} prefs={prefs} setPrefs={setPrefs} showToast={showToast} />,
    scanner:  <ScannerPage   setPage={setPage} showToast={showToast} setResults={setResults} />,
    results:  <ResultsPage   saved={saved} setSaved={setSaved} showToast={showToast} results={results} />,
    list:     <ReadingListPage saved={saved} setSaved={setSaved} setPage={setPage} showToast={showToast} />,
    discover: <DiscoverPage  saved={saved} setSaved={setSaved} showToast={showToast} setPage={setPage} />,
  };

 return (
    <div className="app-shell">
      <FairyCursor />
      <Nav page={page} setPage={setPage} />
      {pages[page]}
      <Footer />
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}