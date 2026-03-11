const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ── Get auth token from Cognito session ──────────────────────
function getToken() {
  const keys    = Object.keys(sessionStorage);
  const oidcKey = keys.find(k => k.startsWith("oidc.user:"));
  if (!oidcKey) return null;
  const oidcData = JSON.parse(sessionStorage.getItem(oidcKey));
  return oidcData?.id_token || null;
}

// ── Base fetch with auth header ──────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API request failed");
  }

  return response.json();
}

// ── Scan a bookshelf image ───────────────────────────────────
export async function scanShelf(imageFile) {
  const token    = getToken();
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${BASE_URL}/api/scan`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Scan failed");
  }

  return response.json();
}

// ── Get recommendations ──────────────────────────────────────
export async function getRecommendations(books) {
  return apiFetch("/api/recommend", {
    method: "POST",
    body: JSON.stringify({ books }),
  });
}

// ── Save preferences ─────────────────────────────────────────
export async function savePreferences(prefs) {
  return apiFetch("/api/preferences", {
    method: "POST",
    body: JSON.stringify(prefs),
  });
}

// ── Get preferences ──────────────────────────────────────────
export async function getPreferences() {
  return apiFetch("/api/preferences");
}

// ── Get discover books ───────────────────────────────────────
export async function getDiscover() {
  return apiFetch("/api/books/discover");
}

// ── Save book to reading list ────────────────────────────────
export async function saveBook(book) {
  return apiFetch("/api/books/save", {
    method: "POST",
    body: JSON.stringify(book),
  });
}

// ── Get reading list ─────────────────────────────────────────
export async function getReadingList() {
  return apiFetch("/api/books/list");
}

// ── Remove book from reading list ────────────────────────────
export async function removeBook(title) {
  return apiFetch(`/api/books/remove/${encodeURIComponent(title)}`, {
    method: "DELETE",
  });
}

// ── Import Goodreads CSV ─────────────────────────────────────
export async function importGoodreads(csvData) {
  return apiFetch("/api/preferences/goodreads", {
    method: "POST",
    body: JSON.stringify({ csvData }),
  });
}