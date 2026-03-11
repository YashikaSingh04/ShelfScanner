const rateLimit = require("express-rate-limit");

// ── Scan rate limiter (expensive Gemini Vision calls) ────────
const scanLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,                   // 10 scans per hour per IP
  message: {
    error: "Too many scans. Please wait before scanning again.",
    retryAfter: "1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Recommend rate limiter ───────────────────────────────────
const recommendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,                   // 20 recommendations per hour
  message: {
    error: "Too many requests. Please wait before trying again.",
    retryAfter: "1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── General API limiter ──────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per 15 minutes
  message: {
    error: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { scanLimiter, recommendLimiter, generalLimiter };