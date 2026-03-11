# ShelfScanner — Backend API 🔧

> RESTful API server powering the ShelfScanner book discovery platform.

![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Gemini](https://img.shields.io/badge/Gemini-AI-orange?logo=google)

---

## 🌟 Overview

This is the backend API for ShelfScanner — an AI-powered book discovery platform. It handles image processing, AI inference, book metadata enrichment, user data persistence, and authentication verification.

---

## ✨ Key Responsibilities

- **Image Processing** — Receives shelf photos via multipart upload, passes to Gemini AI
- **AI Orchestration** — Manages Gemini model fallback chain to handle quota limits gracefully
- **Book Enrichment** — Fetches covers, ratings, descriptions, and pricing from Google Books API
- **Personalisation** — Generates match scores between detected books and user preferences
- **Data Persistence** — Stores reading lists, preferences, and scan history in MongoDB
- **Auth Verification** — Verifies AWS Cognito JWTs using JWKS endpoint

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API framework |
| MongoDB Atlas + Mongoose | Database |
| Google Gemini AI | Vision + text generation |
| Google Books API | Book metadata |
| AWS Cognito JWKS | JWT verification |
| Multer | Multipart image handling |
| Axios | HTTP client |
| Morgan | Request logging |
| CORS | Cross-origin handling |

---

## 📁 Project Structure
```
SelfScannerBackend/
├── routes/
│   ├── scan.js             # POST /api/scan — image upload + AI processing
│   ├── recommend.js        # POST /api/recommend — preference-based ranking
│   ├── books.js            # Reading list + discovery endpoints
│   └── preferences.js      # User preference CRUD + Goodreads import
├── services/
│   ├── gemini.js           # Gemini AI with multi-model fallback chain
│   ├── vision.js           # Google Vision API fallback
│   ├── mongodb.js          # Mongoose schemas + connection
│   └── books.js            # Google Books API enrichment
├── middleware/
│   ├── auth.js             # Cognito JWT verification
│   └── rateLimit.js        # Express rate limiting
├── index.js                # Server entry point
└── .env                    # Environment variables
```

---

## 🔌 API Reference

### Health
```
GET /api/health
```

### Scanning
```
POST /api/scan
Content-Type: multipart/form-data
Body: { image: File }

Response: {
  books: [...],
  totalDetected: number,
  usedFallback: boolean
}
```

### Recommendations
```
POST /api/recommend
Body: { books: [{ title, author }] }

Response: {
  recommendations: [...],
  hasPreferences: boolean
}
```

### Books
```
GET    /api/books/list           # Get reading list
POST   /api/books/save           # Save book
DELETE /api/books/remove/:title  # Remove book
GET    /api/books/discover       # Preference-based discovery
GET    /api/books/search?q=      # Search books
```

### Preferences
```
GET  /api/preferences            # Get preferences
POST /api/preferences            # Save preferences
POST /api/preferences/goodreads  # Import Goodreads CSV
```

---

## 🤖 AI Architecture

### Gemini Model Fallback Chain
```
gemini-2.5-flash-lite  (primary)
        ↓ if 429/503
gemini-2.0-flash       (fallback 1)
        ↓ if 429/503
gemini-1.5-flash       (fallback 2)
```

### Scan Pipeline
```
Image Upload → Gemini Vision → Parse JSON
→ Google Books Enrichment → Save to MongoDB → Return to client
```

---

## 🚀 Getting Started

### Installation
```bash
git clone https://github.com/yourusername/shelf-scanner-backend.git
cd shelf-scanner-backend
npm install
```

### Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/shelfscanner
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLOUD_API_KEY=your_google_cloud_key
CLIENT_URL=http://localhost:3000
COGNITO_REGION=ap-south-1
COGNITO_USER_POOL_ID=your_pool_id
```

### Run
```bash
# Development
npm run dev

# Production
npm start
```

---

## 🌐 Deployment

Deployed on **Render** as a Node.js web service.

- Build command: `npm install`
- Start command: `node index.js`
- Environment variables set via Render dashboard

---
