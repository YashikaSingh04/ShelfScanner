const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS = [
  "gemini-2.5-flash-lite-preview-06-17",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
];

// Timeout helper
const withTimeout = (promise, ms = 20000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timeout")), ms)
    ),
  ]);

async function runWithFallback(promptArgs) {
  for (const modelName of MODELS) {
    try {
      console.log(`Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await withTimeout(model.generateContent(promptArgs));
      return result;
    } catch (e) {
      console.error(`Model ${modelName} failed:`, e.status, e.message);
      if (e.status === 429 || e.status === 503 || e.status === 404 || e.message?.includes("quota")) {
        console.log(`Quota hit on ${modelName}, trying next...`);
        continue;
      }
      throw e;
    }
  }
  throw new Error("All Gemini models exhausted");
}

// ── Extract book titles from shelf image ─────────────────────
async function extractBooksFromImage(imageBuffer, mimeType = "image/jpeg") {
  try {
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType,
      },
    };

    const prompt = `You are an expert book spine reader with exceptional ability to read text at any angle.

Carefully examine this bookshelf image and extract EVERY book you can see.

Rules:
- Read ALL visible spines, even partial ones
- Read text at any angle (vertical, horizontal, tilted)
- If you can read at least 2-3 words of a title, include it
- If author is not visible, use "Unknown"
- Include books even if partially hidden
- Try to read faded or worn text
- Look for both title and author on each spine

Return ONLY a JSON array in this exact format, nothing else:
[
  { "title": "Book Title Here", "author": "Author Name Here" },
  { "title": "Another Book", "author": "Author Name" }
]

Return ONLY the JSON array, no other text whatsoever.`;

    const result = await runWithFallback([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const books = JSON.parse(jsonMatch[0]);
    return books;

  } catch (error) {
    console.error("Gemini vision error:", error);
    return [];
  }
}

// ── Generate personalised recommendations ────────────────────
async function generateRecommendations(detectedBooks, preferences) {
  try {
    const booksListText = detectedBooks
      .map(b => `"${b.title}" by ${b.author}`)
      .join(", ");

    const prefsText = `
      Favourite genres: ${preferences.genres?.join(", ") || "not specified"}
      Favourite authors: ${preferences.authors || "not specified"}
      Books they loved: ${preferences.loved || "not specified"}
      Reading pace: ${preferences.pace || "not specified"}
      Book length preference: ${preferences.length || "not specified"}
      Minimum rating: ${preferences.minRating || "any"}
    `;

    const prompt = `You are an expert book recommender.

Books found on the shelf:
${booksListText}

User preferences:
${prefsText}

Your task:
1. Rank ALL books from the shelf based on how well they match the user's preferences
2. Give each book a match percentage (0-100%)
3. For books that match well (70%+), explain WHY in 1-2 sentences
4. For books that don't match well, still include them with a lower match %
5. If no preferences are set, rank by general popularity and quality

Return ALL books ranked from highest to lowest match percentage.
Return ONLY a JSON array in this exact format, nothing else:
[
  {
    "title": "Book Title",
    "author": "Author Name",
    "matchPercent": "95%",
    "reason": "Why this book matches their taste or general description if no preference match",
    "matchLevel": "high"
  }
]

matchLevel should be: "high" (70%+), "medium" (40-69%), or "low" (below 40%)
Return ONLY the JSON array, no other text.`;

    const result = await runWithFallback(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const recommendations = JSON.parse(jsonMatch[0]);
    return recommendations;

  } catch (error) {
    console.error("Gemini recommendations error:", error);
    return [];
  }
}

module.exports = { extractBooksFromImage, generateRecommendations };