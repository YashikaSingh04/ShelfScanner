const express = require("express");
const router  = express.Router();
const axios   = require("axios");
const { verifyToken }              = require("../middleware/auth");
const { enrichBookData }           = require("../services/books");
const { ReadingList, Preferences } = require("../services/mongodb");

// ── GET /api/books/search?q=title ───────────────────────────
router.get("/search", verifyToken, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query required" });
    const bookData = await enrichBookData(q, "");
    res.json({ success: true, book: bookData });
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

// ── GET /api/books/list ──────────────────────────────────────
router.get("/list", verifyToken, async (req, res) => {
  try {
    const books = await ReadingList
      .find({ userId: req.user.userId })
      .sort({ savedAt: -1 });
    res.json({ success: true, books });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reading list" });
  }
});

// ── POST /api/books/save ─────────────────────────────────────
router.post("/save", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, author, coverImage, amazonUrl, googleUrl, openLibUrl } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });
    const existing = await ReadingList.findOne({ userId, title });
    if (existing) {
      return res.json({ success: true, message: "Already saved", book: existing });
    }
    const book = await ReadingList.create({
      userId,
      bookId:     `${userId}_${title}`.replace(/\s/g, "_"),
      title,
      author:     author     || "Unknown",
      coverImage: coverImage || null,
      amazonUrl:  amazonUrl  || null,
      googleUrl:  googleUrl  || null,
      openLibUrl: openLibUrl || null,
      savedAt:    new Date(),
    });
    res.json({ success: true, book });
  } catch (error) {
    console.error("Save book error:", error);
    res.status(500).json({ error: "Failed to save book" });
  }
});

// ── DELETE /api/books/remove/:title ─────────────────────────
router.delete("/remove/:title", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const title  = decodeURIComponent(req.params.title);
    await ReadingList.findOneAndDelete({ userId, title });
    res.json({ success: true, message: "Book removed from reading list" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove book" });
  }
});

// ── GET /api/books/discover ──────────────────────────────────
router.get("/discover", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const prefs  = await Preferences.findOne({ userId });

    if (!prefs) {
      return res.status(400).json({ error: "Please set your preferences first" });
    }

    const { genres, authors, loved } = prefs;
    const queries = [];

    if (genres && genres.length > 0) {
      genres.slice(0, 3).forEach(genre => {
  queries.push(`subject:${genre}`);
  queries.push(`${genre} fiction popular`);
});
    }
    if (authors) {
      authors.split(",").map(a => a.trim()).slice(0, 2)
        .forEach(author => queries.push(`inauthor:${author}`));
    }
    if (loved) {
      loved.split(",").map(l => l.trim()).slice(0, 2)
        .forEach(book => queries.push(book));
    }
    if (queries.length === 0) queries.push("bestseller fiction");

// Also always add a genre-based fallback
if (genres && genres.length > 0) {
  queries.push(`${genres[0]} books bestseller`);
}

    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

    const bookPromises = queries.map(query =>
      axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=6&country=IN&orderBy=relevance`
      ).catch(() => null)
    );

    const results  = await Promise.all(bookPromises);
    const seen     = new Set();
    const books    = [];

    results.forEach(result => {
      if (!result?.data?.items) return;
      result.data.items.forEach(item => {
        const info     = item.volumeInfo;
        const saleInfo = item.saleInfo;
        const id       = item.id;
        if (seen.has(id)) return;
        seen.add(id);

        const title  = info.title  || "";
        const author = info.authors?.[0] || "Unknown";

        books.push({
          googleBooksId: id,
          title,
          author,
          description:   info.description || "",
          coverImage:    info.imageLinks?.thumbnail?.replace("http://", "https://") || null,
          pageCount:     info.pageCount    || null,
          rating:        info.averageRating || null,
          ratingsCount:  info.ratingsCount  || null,
          publishedDate: info.publishedDate || null,
          categories:    info.categories   || [],
          pricing: {
            google: {
              price:  saleInfo?.retailPrice?.amount ? `₹${saleInfo.retailPrice.amount}` : null,
              buyUrl: saleInfo?.buyLink || info.previewLink || null,
              label:  "Google Play Books",
            },
            amazon: {
              price:  null,
              buyUrl: `https://www.amazon.in/s?k=${encodeURIComponent(`${title} ${author}`)}`,
              label:  "Amazon India",
            },
            openLibrary: {
              price:    "FREE",
              buyUrl:   `https://openlibrary.org/search?q=${encodeURIComponent(title)}`,
              label:    "Open Library",
              available: true,
            },
          },
        });
      });
    });

    res.json({
      success: true,
      total:   books.length,
      books,
      basedOn: { genres: genres || [], authors: authors || "" },
    });

  } catch (error) {
    console.error("Discover error:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

module.exports = router;