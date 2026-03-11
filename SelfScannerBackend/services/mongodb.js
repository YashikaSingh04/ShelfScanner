const mongoose = require("mongoose");

// ── User Preferences Schema ──────────────────────────────────
const preferencesSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email:  { type: String },
  genres:    { type: [String], default: [] },
  pace:      { type: String, default: "" },
  length:    { type: String, default: "" },
  authors:   { type: String, default: "" },
  loved:     { type: String, default: "" },
  minRating: { type: Number, default: 0 },
  goodreadsData: { type: Array, default: [] },
}, { timestamps: true });

// ── Reading List Schema ──────────────────────────────────────
const readingListSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  bookId:    { type: String, required: true },
  title:     { type: String, required: true },
  author:    { type: String },
  coverImage:{ type: String },
  amazonUrl: { type: String },
  googleUrl: { type: String },
  openLibUrl:{ type: String },
  savedAt:   { type: Date, default: Date.now },
}, { timestamps: true });

// ── Scan History Schema ──────────────────────────────────────
const scanSchema = new mongoose.Schema({
  userId:         { type: String, required: true },
  detectedBooks:  { type: [String], default: [] },
  recommendations:{ type: Array, default: [] },
  imageUrl:       { type: String },
  scannedAt:      { type: Date, default: Date.now },
});

// ── Export Models ────────────────────────────────────────────
const Preferences  = mongoose.model("Preferences",  preferencesSchema);
const ReadingList  = mongoose.model("ReadingList",   readingListSchema);
const Scan         = mongoose.model("Scan",          scanSchema);

module.exports = { Preferences, ReadingList, Scan };