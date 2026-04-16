# ⚡ ResumeAI – AI-Based Resume Analyzer

A full-stack web application that analyzes resumes using NLP, provides an ATS score, extracts skills, and gives AI-powered improvement suggestions.

**Stack:** React.js · Node.js · Express · MongoDB · JWT Auth

---

## 📁 Project Structure

```
resume-analyzer/
├── backend/                  # Node.js + Express API
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Route logic
│   ├── middleware/           # Auth + file upload
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── services/             # NLP + PDF parsing
│   ├── server.js             # App entry point
│   └── .env.example          # Environment template
│
├── frontend/                 # React.js app
│   ├── src/
│   │   ├── context/          # Auth context (global state)
│   │   ├── pages/            # Landing, Login, Register, Dashboard, Analyze, Result, Profile
│   │   ├── services/api.js   # Axios API client
│   │   ├── App.js            # Routes
│   │   └── App.css           # All styles
│   └── public/index.html
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### Step 1 – Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
JWT_SECRET=your_very_secret_key_here_change_this
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

Start backend:
```bash
npm run dev
```
Backend runs at → `http://localhost:5000`

---

### Step 2 – Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```
Frontend runs at → `http://localhost:3000`

---

## 🌐 API Endpoints

### Auth (`/api/auth`)
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/register` | Create account | ❌ |
| POST | `/login` | Sign in + get JWT | ❌ |
| GET | `/me` | Get current user | ✅ |
| PUT | `/update` | Update name | ✅ |
| PUT | `/change-password` | Change password | ✅ |

### Resume (`/api/resume`)
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/analyze` | Upload + analyze PDF | ✅ |
| GET | `/history` | Get all analyses | ✅ |
| GET | `/:id` | Get single analysis | ✅ |
| DELETE | `/:id` | Delete analysis | ✅ |

### User (`/api/user`)
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/stats` | Dashboard stats | ✅ |

---

## ✨ Features

- **Authentication** – Register, login, JWT tokens, profile management, change password
- **Resume Upload** – PDF drag-and-drop, file validation (type + size)
- **NLP Analysis** – Extracts 100+ technical skills across Web Dev, Data Science, Mobile, DevOps, Database domains
- **Resume Score** – 0–100 score with breakdown (Skills 30 + Projects 25 + Experience 20 + Education 10 + Keywords 15)
- **Domain Detection** – Auto-classifies into Web Development, Data Science/ML, Mobile Dev, etc.
- **Missing Skills** – Shows what skills are needed for detected domain
- **AI Suggestions** – Personalized tips to improve resume and beat ATS
- **Job Roles** – Recommends relevant job titles
- **History** – All past analyses saved per user
- **Charts** – Beautiful bar charts showing score breakdown (recharts)
- **Responsive** – Works on mobile, tablet, desktop

---

## 🔐 Authentication Flow

1. User registers → password hashed with bcryptjs → stored in MongoDB
2. On login → bcrypt.compare → JWT generated with 7-day expiry
3. Token stored in localStorage
4. Every protected API call sends `Authorization: Bearer <token>`
5. Backend middleware verifies JWT on each request

---

## 📊 Scoring Engine

| Category | Max Points | How Calculated |
|----------|-----------|----------------|
| Skills | 30 | (detected skills / 10) × 30, capped at 30 |
| Projects | 25 | +20 if projects section found, +5 if GitHub mentioned |
| Experience | 20 | +20 if experience/internship section found |
| Education | 10 | +10 if education section found |
| Keywords | 15 | Based on total skills found (capped at 15) |

---

## 🚀 Deployment

### Backend → Render
1. Push `backend/` folder to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Set environment variables (MONGODB_URI, JWT_SECRET, CLIENT_URL)
4. Build command: `npm install`, Start: `npm start`

### Frontend → Vercel
1. Push `frontend/` folder to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Set environment variable: `REACT_APP_API_URL=https://your-render-url.onrender.com/api`
4. Deploy

---

## 🧪 Test Credentials (create yourself)

Register at `/register` with any email + password (min 6 chars).

---

## 📝 Notes

- Only PDF files are accepted (max 5MB)
- Scanned/image PDFs won't work (text-based PDFs only)
- Files are automatically deleted after analysis for privacy
- MongoDB Atlas free tier works perfectly for this project
