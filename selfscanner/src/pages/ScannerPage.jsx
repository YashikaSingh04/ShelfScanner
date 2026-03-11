import { useState, useRef } from "react";
import { Camera, Upload, Lightbulb, Scan } from "lucide-react";
import { BookOpen } from "lucide-react";
import { scanShelf, getRecommendations } from "../services/api";

export default function ScannerPage({ setPage, showToast, setResults }) {
  const [image,    setImage]    = useState(null);
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef();

  const [imageFile, setImageFile] = useState(null);

const handleImage = f => {
  if (!f) return;
  setImageFile(f);
  const url = URL.createObjectURL(f);
  setImage(url);
};
  const handleScan = async () => {
  if (!image) { showToast("Please select a photo first"); return; }
  setScanning(true);
  try {
    // Send image to backend
    const scanResult = await scanShelf(imageFile);
    // Get recommendations based on detected books
    // Pass simple title/author objects to recommend endpoint
const simpleBooks = scanResult.books.map(b => ({
  title:  b.title,
  author: b.author,
}));
const recResult = await getRecommendations(simpleBooks);
    // Store results and navigate
    setResults({
      detected: scanResult.books,
      recommendations: recResult.recommendations,
       hasPreferences:  recResult.hasPreferences,
    });
    showToast(`Found ${scanResult.totalDetected} books!`);
    setPage("results");
  } catch (error) {
    showToast(error.message || "Scan failed. Try again.");
  } finally {
    setScanning(false);
  }
};

  return (
    <div className="page">
      <div className="scanner-wrap">

        <div className="scanner-header">
          <h2>📷 Scan a bookshelf</h2>
          <p>Take a photo or upload one from your camera roll. Keep the spines clearly visible.</p>
        </div>

        {/* CAMERA ZONE */}
        <div
  className={`camera-zone${image ? " has-image" : ""}`}
  onClick={() => !image && fileRef.current.click()}
  style={{
    position: "relative",
    width: "100%",
    height: image ? "auto" : "380px",
minHeight: "280px",
maxHeight: "600px",
    overflow: "hidden",
    borderRadius: "12px",
    background: "var(--warm-white)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={e => handleImage(e.target.files[0])}
          />

          {image ? (
  <>
   <img src={image} alt="shelf" style={{
  width: "100%",
  height: "100%",
  objectFit: "scale-down",
  borderRadius: "8px",
  display: "block",
  maxHeight: "500px",
}} />
              {scanning && (
                <div className="scanning-overlay">
                  <div className="scan-line" />
                  <span className="scanning-text">Identifying books…</span>
                </div>
              )}
            </>
          ) : (
            <div className="camera-placeholder">
              <div style={{ marginBottom: "1rem", opacity: 0.4 }}>
  <Camera size={56} color="var(--bark)" strokeWidth={1}/>
</div>
<h3>Tap to take or upload a photo</h3>
              <p>Supports JPG, PNG, HEIC — up to 20MB</p>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="scan-actions">
          {image && (
            <button
              className="btn-secondary"
              style={{ flex: 1, opacity: 1, color: "var(--bark)", fontWeight: 600 }}
              onClick={() => setImage(null)}
            >
              ↺ Choose different photo
            </button>
          )}
          <button
            className="btn-primary"
            style={{ flex: 2 }}
            onClick={image ? handleScan : () => fileRef.current.click()}
          >
            {image ? (scanning ? "Scanning…" : "✨ Analyse shelf") : "📁 Upload a photo"}
          </button>
        </div>

        {/* TIP */}
        <div className="scan-tip">
          <strong>Tip:</strong> Hold your phone parallel to the shelf for best results.
          Make sure the lighting is even and titles are readable.
        </div>

        {/* DEMO */}
        <div style={{
          marginTop: "2rem", background: "var(--warm-white)",
          border: "1px solid var(--border)", borderRadius: "10px", padding: "1.2rem"
        }}>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.72rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--bark)", marginBottom: "0.8rem",
            fontWeight: 700,
          }}>
            Or try with a demo image
          </p>
          <button
            className="btn-secondary"
            style={{ width: "100%", opacity: 1, color: "var(--bark)", fontWeight: 600, border: "2px solid var(--amber)" }}
            onClick={async () => {
              try {
                const url = "/fairy/bookshelf-demo.jpg";
                const response = await fetch(url);
                const blob = await response.blob();
                const file = new File([blob], "bookshelf-demo.jpg", { type: "image/jpeg" });
                setImageFile(file);
                setImage(url);
                showToast("Demo shelf loaded!");
              } catch {
                showToast("Failed to load demo image");
              }
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--bark)", fontWeight: 600 }}>
              <BookOpen size={16} color="var(--bark)"/> Load demo bookshelf
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}