# ShelfScanner 📚✨

> An AI-powered book discovery platform that transforms any bookshelf photograph into personalised reading recommendations — built with React, Node.js, Gemini AI, and AWS Cognito.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange?logo=google)
![AWS Cognito](https://img.shields.io/badge/AWS-Cognito-yellow?logo=amazon-aws)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/API-Render-purple?logo=render)

---

## 🌟 What is ShelfScanner?

ShelfScanner solves a real problem for book lovers — standing in front of a bookshelf at a sale, library, or friend's home and not knowing which books are worth picking up.

Simply photograph any bookshelf. Gemini AI reads every spine, cross-references the detected books against your personal taste profile, and delivers ranked recommendations with pricing from Amazon India, Google Play Books, and Open Library — all in under 10 seconds.

---

## 🎥 Demo

*Screenshots and demo video coming soon*

---

## ✨ Features

| Feature | Description |
|---|---|
| 📷 AI Shelf Scanning | Gemini AI identifies every book title and author from a shelf photo |
| 🤖 Smart Recommendations | Books ranked by match % based on your genres, authors, and reading history |
| 🔍 Discover | Browse curated book picks powered by Google Books API |
| 💾 Reading List | Save books to a persistent reading list backed by MongoDB |
| 💰 Price Comparison | Instant links to Amazon India, Google Play Books, and Open Library |
| 📖 Book Detail Modal | Rich info — description, ratings, page count, and purchase options |
| 🔐 Secure Auth | AWS Cognito handles sign-up, sign-in, and JWT verification |
| 📊 Goodreads Import | Import reading history via CSV for smarter recommendations |
| 🧚 Magical UI | Custom fairy cursor with canvas-based sparkle trail animation |

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React.js 18 | UI framework |
| AWS Cognito + OIDC | Authentication and JWT management |
| Canvas API | Custom cursor and sparkle animations |
| CSS3 | Animations, transitions, responsive layout |
| Lucide React | Icon library |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB Atlas + Mongoose | Database and ODM |
| Google Gemini AI | Book spine recognition and recommendations |
| Google Books API | Book metadata, covers, and pricing |
| Open Library API | Free book availability |
| AWS Cognito JWKS | JWT token verification |
| Multer | Image upload handling |

---

## 🏗 System Architecture
```
┌─────────────────────┐         ┌──────────────────────┐
│   React Frontend     │ ──────▶ │   Express Backend     │
│   (Vercel)           │ ◀────── │   (Render)            │
└─────────────────────┘         └──────────┬───────────┘
                                            │
              ┌─────────────────────────────┼──────────────────────┐
              ▼                             ▼                      ▼
   ┌──────────────────┐      ┌─────────────────────┐  ┌───────────────────┐
   │  MongoDB Atlas    │      │    Gemini AI API     │  │ Google Books API  │
   │  Reading lists    │      │  Vision + Rankings   │  │ Metadata + Covers │
   │  Preferences      │      │  Model fallback      │  │ Pricing           │
   │  Scan history     │      │  chain               │  │                   │
   └──────────────────┘      └─────────────────────┘  └───────────────────┘
```

---

## 🔄 User Flows

### Flow 1 — Scan a Shelf
```
Sign in → Set preferences → Upload shelf photo
→ Gemini reads spines → Books ranked by match %
→ View book details → Buy on Amazon or save to list
```

### Flow 2 — Discover Books
```
Sign in → Set preferences → Discover page
→ Browse AI-curated picks → Filter and sort
→ View book details → Buy or save
```

---

## 📁 Project Structure
```
shelf-scanner/
│
├── README.md                        ← You are here
│
├── frontend/                        ← React Application
│   ├── README.md
│   ├── public/
│   │   └── fairy/                   ← Static assets
│   └── src/
│       ├── components/              ← Nav, Footer, BookModal, FairyCursor
│       ├── contexts/                ← AWS Cognito Auth context
│       ├── pages/                   ← Home, Scanner, Results, Discover, List
│       ├── services/                ← API service layer
│       └── styles/                  ← Global CSS
│
└── backend/                         ← Node.js API Server
    ├── README.md
    ├── routes/                      ← scan, recommend, books, preferences
    ├── services/                    ← gemini, vision, mongodb, books
    └── middleware/                  ← auth, rateLimit
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key
- Google Cloud API key (Books API)
- AWS Cognito User Pool

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/shelf-scanner.git
cd shelf-scanner
```

### 2. Set up the Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

### 3. Set up the Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Fill in your environment variables
npm start
```

### Environment Variables

**Frontend `.env`**
```env
REACT_APP_COGNITO_AUTHORITY=https://cognito-idp.REGION.amazonaws.com/POOL_ID
REACT_APP_COGNITO_CLIENT_ID=your_client_id
REACT_APP_COGNITO_REDIRECT_URI=http://localhost:3000
REACT_APP_COGNITO_DOMAIN=https://your-domain.auth.region.amazoncognito.com
REACT_APP_COGNITO_SCOPE=phone openid email
REACT_APP_API_URL=http://localhost:5000
DISABLE_ESLINT_PLUGIN=true
```

**Backend `.env`**
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/shelfscanner
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLOUD_API_KEY=your_google_cloud_key
CLIENT_URL=http://localhost:3000
COGNITO_REGION=ap-south-1
COGNITO_USER_POOL_ID=your_pool_id
```

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | Coming soon |
| Backend API | Render | Coming soon |
| Database | MongoDB Atlas | Cloud hosted |
| Auth | AWS Cognito | Managed service |

---

## 🧠 Technical Highlights

| Highlight | Detail |
|---|---|
| AI Model Fallback | Automatically switches between Gemini models if quota is exceeded |
| JWT Verification | Verifies AWS Cognito tokens server-side using JWKS endpoint |
| Image Processing | Handles up to 20MB images in memory without disk storage |
| Canvas Animation | Custom fairy cursor built entirely with HTML5 Canvas API |
| Persistent State | Reading list and preferences synced to MongoDB across sessions |

---

## 👩‍💻 Author

**Yashika Singh**

---

## 📄 License

MIT License — feel free to use this project as inspiration!