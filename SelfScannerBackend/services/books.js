const axios = require("axios");

async function enrichBookData(title, author) {
  try {
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    const query  = `${title} ${author}`.trim();

    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=1&country=IN`
    );

    const item = response.data.items?.[0];
    if (!item) {
      return {
        title, author,
        coverImage: null, description: null,
        pageCount: null, rating: null, ratingsCount: null,
        publishedDate: null,
        pricing: {
          amazon:      { price: null, buyUrl: `https://www.amazon.in/s?k=${encodeURIComponent(`${title} ${author}`)}`, label: "Amazon India" },
          google:      { price: null, buyUrl: null, label: "Google Play Books" },
          openLibrary: { price: "FREE", buyUrl: `https://openlibrary.org/search?q=${encodeURIComponent(title)}`, label: "Open Library", available: true },
        },
      };
    }

    const info     = item.volumeInfo;
    const saleInfo = item.saleInfo;

    return {
      title:         info.title        || title,
      author:        info.authors?.[0] || author || "Unknown",
      coverImage:    info.imageLinks?.thumbnail?.replace("http://", "https://") || null,
      description:   info.description  || null,
      pageCount:     info.pageCount    || null,
      rating:        info.averageRating || null,
      ratingsCount:  info.ratingsCount  || null,
      publishedDate: info.publishedDate || null,
      categories:    info.categories   || [],
      pricing: {
        amazon: {
          price:  null,
          buyUrl: `https://www.amazon.in/s?k=${encodeURIComponent(`${info.title || title} ${info.authors?.[0] || author}`)}`,
          label:  "Amazon India",
        },
        google: {
          price:  saleInfo?.retailPrice?.amount ? `₹${saleInfo.retailPrice.amount}` : null,
          buyUrl: saleInfo?.buyLink || info.previewLink || null,
          label:  "Google Play Books",
        },
        openLibrary: {
          price:    "FREE",
          buyUrl:   `https://openlibrary.org/search?q=${encodeURIComponent(info.title || title)}`,
          label:    "Open Library",
          available: true,
        },
      },
    };

  } catch (error) {
    console.error(`enrichBookData error for "${title}":`, error.message);
    return {
      title, author,
      coverImage: null, description: null,
      pageCount: null, rating: null,
      pricing: {
        amazon:      { price: null, buyUrl: `https://www.amazon.in/s?k=${encodeURIComponent(title)}`, label: "Amazon India" },
        google:      { price: null, buyUrl: null, label: "Google Play Books" },
        openLibrary: { price: "FREE", buyUrl: `https://openlibrary.org/search?q=${encodeURIComponent(title)}`, label: "Open Library", available: true },
      },
    };
  }
}

module.exports = { enrichBookData };