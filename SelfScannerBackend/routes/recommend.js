const express = require("express");
const router  = express.Router();
const { verifyToken }              = require("../middleware/auth");
const { recommendLimiter }         = require("../middleware/rateLimit");
const { generateRecommendations }  = require("../services/gemini");
const { enrichBookData }           = require("../services/books");
const { Preferences, Scan }        = require("../services/mongodb");

// ── POST /api/recommend ──────────────────────────────────────
router.post("/", verifyToken, recommendLimiter, async (req, res) => {
  try {
    const userId    = req.user.userId;
    const { books } = req.body;

    if (!books || books.length === 0) {
      return res.status(400).json({ error: "No books provided" });
    }

    console.log(`⭐ Ranking ${books.length} books for user ${userId}`);

    // Get user preferences — ok if none exist
    const preferences    = await Preferences.findOne({ userId }) || {};
    const hasPreferences = preferences.genres?.length > 0 ||
                           preferences.authors ||
                           preferences.loved;

    // Generate ranked recommendations using Gemini
    const recommendations = await generateRecommendations(books, preferences);

    if (!recommendations || recommendations.length === 0) {
      // If Gemini fails return books as-is with no ranking
      const enriched = await Promise.all(
        books.slice(0, 10).map(async book => {
          const bookData = await enrichBookData(book.title, book.author);
          return {
            ...bookData,
            matchPercent: "—",
            matchLevel:   "unknown",
            reason:       "Could not generate personalised ranking.",
          };
        })
      );
      return res.json({
        success:              true,
        hasPreferences,
        totalRecommendations: enriched.length,
        recommendations:      enriched,
      });
    }

    // Enrich ALL ranked books with covers + pricing
    const enriched = await Promise.all(
      recommendations.map(async rec => {
        const bookData = await enrichBookData(rec.title, rec.author);
        return {
          ...bookData,
          matchPercent: rec.matchPercent,
          matchLevel:   rec.matchLevel || "medium",
          reason:       rec.reason,
        };
      })
    );

    // Save to scan history
    await Scan.findOneAndUpdate(
      { userId },
      { recommendations: enriched },
      { sort: { scannedAt: -1 } }
    );

    res.json({
      success:              true,
      hasPreferences,
      totalRecommendations: enriched.length,
      recommendations:      enriched,
    });

  } catch (error) {
    console.error("Recommend error:", error);
    res.status(500).json({ error: "Failed to generate recommendations." });
  }
});

module.exports = router;