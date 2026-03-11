const axios = require("axios");

// Google Vision API fallback
async function extractTextFromImage(imageBuffer) {
  try {
    const base64Image = imageBuffer.toString("base64");
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        requests: [
          {
            image: { content: base64Image },
            features: [
              { type: "TEXT_DETECTION", maxResults: 50 },
              { type: "DOCUMENT_TEXT_DETECTION", maxResults: 50 },
            ],
          },
        ],
      }
    );

    const annotations = response.data.responses[0];
    if (!annotations || !annotations.textAnnotations) return [];

    // Get full text block
    const fullText = annotations.textAnnotations[0]?.description || "";

    // Split into lines and clean up
    const lines = fullText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 2 && line.length < 100)
      .filter(line => !/^\d+$/.test(line)); // remove pure numbers

    return lines;

  } catch (error) {
    console.error("Google Vision error:", error.message);
    return [];
  }
}

// Parse vision text into book titles
function parseBooksFromText(textLines) {
  // Filter out common non-book text
  const filtered = textLines.filter(line => {
    const lower = line.toLowerCase();
    return !lower.includes("bestseller") &&
           !lower.includes("www.") &&
           !lower.includes("isbn") &&
           !lower.includes("price") &&
           line.length > 3;
  });

  // Return as book objects with unknown authors
  return filtered.map(title => ({
    title,
    author: "Unknown",
  }));
}

module.exports = { extractTextFromImage, parseBooksFromText };