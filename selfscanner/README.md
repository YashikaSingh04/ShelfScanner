# ShelfScanner 📚

> AI-powered book discovery platform that transforms any bookshelf photo into personalised reading recommendations.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange?logo=google)
![AWS Cognito](https://img.shields.io/badge/AWS-Cognito-yellow?logo=amazon-aws)

---

## 🌟 Overview

ShelfScanner solves a common problem for book lovers — standing in front of a bookshelf at a sale, library, or friend's home and not knowing which books are worth buying. 

Users simply photograph a bookshelf. Gemini AI reads every spine, cross-references the detected books against the user's personal taste profile, and delivers ranked recommendations with pricing from Amazon India, Google Play Books, and Open Library — all in under 10 seconds.

---

## ✨ Key Features

- **AI Shelf Scanning** — Gemini AI identifies book titles and authors from shelf photos, even at angles or with partial visibility
- **Personalised Recommendations** — Books ranked by match percentage based on user's favourite genres, authors, and reading history
- **Smart Discovery** — Browse curated book picks powered by Google Books API, filtered by personal preferences
- **Reading List** — Save books to a persistent reading list backed by MongoDB
- **Price Comparison** — Instant links to Amazon India, Google Play Books, and Open Library for every book
- **Book Detail Modal** — Rich book info including description, ratings, page count, availability, and purchase options
- **Secure Authentication** — AWS Cognito handles sign-up, sign-in, and JWT verification
- **Goodreads Import** — Import reading history via CSV for smarter recommendations
- **Magical UI** — Custom fairy cursor with canvas sparkle trail animation

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18 | UI framework |
| AWS Cognito + OIDC | Authentication & JWT |
| Canvas API | Custom fairy cursor + sparkle animations |
| CSS3 Animations | UI transitions and effects |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB Atlas + Mongoose | Database & ODM |
| Google Gemini AI | Book spine recognition + recommendations |
| Google Books API | Book metadata, covers, pricing |
| Open Library API | Free book availability |
| AWS Cognito JWKS | JWT token verification |
| Multer | Image upload handling |

---

## 🏗 Architecture
```
┌─────────────────┐         ┌──────────────────┐
│   React Frontend │ ──────▶ │  Express Backend  │
│   (Vercel)       │ ◀────── │  (Render)         │
└─────────────────┘         └────────┬─────────┘
                                      │
              ┌───────────────────────┼────────────────────┐
              ▼                       ▼                    ▼
     ┌────────────────┐   ┌──────────────────┐  ┌─────────────────┐
     │  MongoDB Atlas  │   │   Gemini AI API   │  │ Google Books API│
     │  (Database)     │   │ (Vision + Chat)   │  │ (Metadata)      │
     └────────────────┘   └──────────────────┘  └─────────────────┘
```

---

## 📁 Project Structure
```
SelfScanner/
├── public/
│   └── fairy/                  # Static assets (cursor, flowers, wreath)
├── src/
│   ├── components/
│   │   ├── Nav.jsx             # Sticky navbar with auth state
│   │   ├── Footer.jsx          # App footer
│   │   ├── Toast.jsx           # Notification toasts
│   │   ├── BookModal.jsx       # Book detail modal with pricing
│   │   └── FairyCursor.jsx     # Canvas-based custom cursor
│   ├── contexts/
│   │   └── AuthContext.jsx     # AWS Cognito auth context
│   ├── pages/
│   │   ├── HomePage.jsx        # Landing + preference setup
│   │   ├── ScannerPage.jsx     # Image upload + shelf scanning
│   │   ├── ResultsPage.jsx     # AI-ranked book results
│   │   ├── DiscoverPage.jsx    # Preference-based discovery
│   │   ├── ReadingListPage.jsx # Saved books management
│   │   └── AuthPage.jsx        # Sign in / Sign up
│   ├── services/
│   │   └── api.js              # All backend API calls
│   └── styles/
│       └── global.css          # Global styles + animations
├── .env                        # Environment variables
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- AWS Cognito User Pool (for auth)
- Running instance of ShelfScanner Backend

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/shelf-scanner.git
cd shelf-scanner

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your values in .env

# Start development server
npm start
```

### Environment Variables
```env
REACT_APP_COGNITO_AUTHORITY=https://cognito-idp.REGION.amazonaws.com/POOL_ID
REACT_APP_COGNITO_CLIENT_ID=your_client_id
REACT_APP_COGNITO_REDIRECT_URI=http://localhost:3000
REACT_APP_COGNITO_DOMAIN=https://your-domain.auth.region.amazoncognito.com
REACT_APP_COGNITO_SCOPE=phone openid email
REACT_APP_API_URL=http://localhost:5000
DISABLE_ESLINT_PLUGIN=true
```

---

## 🔄 User Flows

### Flow 1 — Shelf Scanning
```
Set preferences → Upload shelf photo → Gemini reads spines
→ Books ranked by match % → View details → Buy or save
```

### Flow 2 — Discovery
```
Set preferences → Discover page → Browse AI-curated picks
→ Filter & sort → View details → Buy or save
```

---

## 🌐 Deployment

- **Frontend:** Vercel (automatic deployments from GitHub)
- **Backend:** Render (Node.js web service)
- **Database:** MongoDB Atlas (cloud)
- **Auth:** AWS Cognito (managed)

---

## 👩‍💻 Author

**Yashika Singh**  
Built as a full-stack project demonstrating AI integration, cloud authentication, and modern React development.

---

## 📄 License

MIT License — feel free to use this project as inspiration!
