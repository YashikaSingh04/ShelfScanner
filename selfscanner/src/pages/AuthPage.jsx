import { useState } from "react";
import { useAppAuth } from "../contexts/AuthContext";
import { BookOpen } from "lucide-react";

export default function AuthPage() {
  const { signIn } = useAppAuth();
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    signIn();
  };

  return (
    <div className="page">
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Full background library photo */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.35)",
          zIndex: 0,
        }}/>

        {/* Warm overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(61,43,31,0.7) 0%, rgba(28,20,9,0.5) 100%)",
          zIndex: 1,
        }}/>

        {/* Auth card */}
        <div style={{
          background: "rgba(250,246,237,0.97)",
          borderRadius: "16px",
          padding: "3rem",
          width: "100%",
          maxWidth: "440px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          position: "relative",
          zIndex: 2,
          border: "1px solid var(--border)",
          backdropFilter: "blur(10px)",
        }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ marginBottom: "0.5rem" }}>
  <BookOpen size={44} color="var(--amber)" strokeWidth={1.5}/>
</div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem", color: "var(--bark)", fontWeight: 700
            }}>
              Shelf Scanner
            </h1>
            <p style={{
              color: "var(--dusty)", fontSize: "0.95rem",
              fontWeight: 300, marginTop: "0.3rem"
            }}>
              Your personal book discovery companion
            </p>
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex", borderBottom: "2px solid var(--border)",
            marginBottom: "2rem"
          }}>
            {[["signin", "Sign In"], ["signup", "Sign Up"]].map(([t, l]) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                style={{
                  flex: 1, padding: "0.7rem", background: "none", border: "none",
                  fontFamily: "'Crimson Pro', serif", fontSize: "1.05rem",
                  color: tab === t ? "var(--amber)" : "var(--dusty)",
                  borderBottom: `2px solid ${tab === t ? "var(--amber)" : "transparent"}`,
                  marginBottom: "-2px", cursor: "pointer", transition: "all 0.2s",
                  fontWeight: tab === t ? 500 : 400
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Form fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {tab === "signup" && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Your name</label>
                <input
                  className="form-input" type="text"
                  placeholder="e.g. Jane Austen"
                  value={name} onChange={e => setName(e.target.value)}
                />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email address</label>
              <input
                className="form-input" type="email"
                placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <input
                className="form-input" type="password"
                placeholder={tab === "signup" ? "Min. 8 characters" : "Your password"}
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p style={{
                color: "#c0392b", fontSize: "0.88rem",
                background: "rgba(192,57,43,0.08)",
                padding: "0.6rem 0.9rem", borderRadius: "6px",
                border: "1px solid rgba(192,57,43,0.2)"
              }}>
                ⚠️ {error}
              </p>
            )}

            {tab === "signin" && (
              <div style={{ textAlign: "right" }}>
                <span style={{
                  fontSize: "0.88rem", color: "var(--amber)",
                  cursor: "pointer", textDecoration: "underline"
                }}>
                  Forgot password?
                </span>
              </div>
            )}

            <button
              className="btn-primary"
              style={{ width: "100%", marginTop: "0.5rem" }}
              onClick={handleSubmit}
            >
              {tab === "signin" ? "Sign In →" : "Create Account →"}
            </button>

            {/* Divider */}
            <div style={{
              display: "flex", alignItems: "center",
              gap: "1rem", margin: "0.5rem 0"
            }}>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }}/>
              <span style={{ color: "var(--dusty)", fontSize: "0.85rem" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }}/>
            </div>

            {/* Google button */}
            <button
              onClick={signIn}
              style={{
                width: "100%", padding: "0.75rem",
                border: "1.5px solid var(--border)", borderRadius: "6px",
                background: "white", cursor: "pointer",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "0.75rem",
                transition: "all 0.2s",
                fontFamily: "'Crimson Pro', serif",
                fontSize: "1rem", color: "var(--bark)"
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = "var(--amber)"}
              onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

          </div>

          {/* Footer note */}
          <p style={{
            textAlign: "center", marginTop: "1.5rem",
            fontSize: "0.82rem", color: "var(--dusty)", fontWeight: 300
          }}>
            No credit card required · Free forever
          </p>

        </div>
      </div>
    </div>
  );
}