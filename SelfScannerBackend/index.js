const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");
const dotenv     = require("dotenv");

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Routes ──────────────────────────────────────────────────
app.use("/api/scan",        require("./routes/scan"));
app.use("/api/recommend",   require("./routes/recommend"));
app.use("/api/preferences", require("./routes/preferences"));
app.use("/api/books",       require("./routes/books"));

// ── Health check ────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Shelf Scanner API is running" });
});

// ── MongoDB connection ───────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ── Start server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});