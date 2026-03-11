const express = require("express");
const router  = express.Router();
const { verifyToken }  = require("../middleware/auth");
const { Preferences }  = require("../services/mongodb");
const csv              = require("csvtojson");

// ── GET /api/preferences ─────────────────────────────────────
router.get("/", verifyToken, async (req, res) => {
  try {
    const prefs = await Preferences.findOne({ userId: req.user.userId });
    if (!prefs) return res.json({ preferences: null });
    res.json({ preferences: prefs });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch preferences" });
  }
});

// ── POST /api/preferences ────────────────────────────────────
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
  genres    = [],
  pace      = "",
  length    = "",
  authors   = "",
  loved     = "",
  minRating = 0,
} = req.body;

    const prefs = await Preferences.findOneAndUpdate(
      { userId },
      {
        userId,
        email: req.user.email,
        genres:    genres    || [],
        pace:      pace      || "",
        length:    length    || "",
        authors:   authors   || "",
        loved:     loved     || "",
        minRating: minRating || 0,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, preferences: prefs });

  } catch (error) {
    console.error("Preferences error:", error);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

// ── POST /api/preferences/goodreads ─────────────────────────
router.post("/goodreads", verifyToken, async (req, res) => {
  try {
    const userId  = req.user.userId;
    const { csvData } = req.body;

    if (!csvData) {
      return res.status(400).json({ error: "No CSV data provided" });
    }

    // Parse Goodreads CSV
    const books = await csv().fromString(csvData);

    // Extract useful data from Goodreads export
    const goodreadsData = books
      .filter(b => b["Exclusive Shelf"] === "read")
      .map(b => ({
        title:      b["Title"],
        author:     b["Author"],
        rating:     parseInt(b["My Rating"]) || 0,
        dateRead:   b["Date Read"],
        shelves:    b["Bookshelves"],
      }))
      .filter(b => b.title);

    // Save to MongoDB
    await Preferences.findOneAndUpdate(
      { userId },
      { goodreadsData },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      imported: goodreadsData.length,
      message: `Successfully imported ${goodreadsData.length} books from Goodreads`,
    });

  } catch (error) {
    console.error("Goodreads import error:", error);
    res.status(500).json({ error: "Failed to import Goodreads data" });
  }
});

module.exports = router;