const express    = require("express");
const multer     = require("multer");
const router     = express.Router();
const { verifyToken }             = require("../middleware/auth");
const { scanLimiter }             = require("../middleware/rateLimit");
const { extractBooksFromImage }   = require("../services/gemini");
const { extractTextFromImage, parseBooksFromText } = require("../services/vision");
const { enrichBookData }          = require("../services/books");
const { Scan }                    = require("../services/mongodb");

// Multer — store image in memory (Vercel safe)
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

// ── POST /api/scan ───────────────────────────────────────────
router.post("/", verifyToken, scanLimiter, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const imageBuffer = req.file.buffer;
    const mimeType    = req.file.mimetype;
    const userId      = req.user.userId;

    console.log(`📷 Scanning shelf for user ${userId}`);

    // Step 1 — Try Gemini Vision first
    let detectedBooks = await extractBooksFromImage(imageBuffer, mimeType);
    let usedFallback  = false;

    // Step 2 — Fall back to Google Vision if Gemini fails
    if (!detectedBooks || detectedBooks.length === 0) {
      console.log("⚠️ Gemini failed, trying Google Vision fallback...");
      const textLines   = await extractTextFromImage(imageBuffer);
      detectedBooks     = parseBooksFromText(textLines);
      usedFallback      = true;
    }

    if (!detectedBooks || detectedBooks.length === 0) {
      return res.status(422).json({
        error: "Could not detect any books. Please try a clearer photo.",
      });
    }

    console.log(`📚 Detected ${detectedBooks.length} books`);

    // Step 3 — Enrich with metadata (covers, prices, links)
    const enrichedBooks = await Promise.all(
      detectedBooks.slice(0, 15).map(book =>
        enrichBookData(book.title, book.author)
      )
    );

    // Step 4 — Save scan to MongoDB
    await Scan.create({
      userId,
      detectedBooks: detectedBooks.map(b => b.title),
      scannedAt: new Date(),
    });

    res.json({
      success: true,
      usedFallback,
      totalDetected: detectedBooks.length,
      books: enrichedBooks,
    });

  } catch (error) {
    console.error("Scan error:", error);
    res.status(500).json({ error: "Scan failed. Please try again." });
  }
});

// ── GET /api/scan/history ────────────────────────────────────
router.get("/history", verifyToken, async (req, res) => {
  try {
    const scans = await Scan.find({ userId: req.user.userId })
      .sort({ scannedAt: -1 })
      .limit(10);
    res.json({ scans });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch scan history" });
  }
});

module.exports = router;