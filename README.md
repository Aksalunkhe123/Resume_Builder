# SkillBridge AI

Full-stack authentication app with React, Node.js, Express, MongoDB, and JWT.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express.js, Mongoose, bcrypt, JWT

## Project Structure

```
Resume_Builder/
├── backend/
│   ├── config/db.js
│   ├── controllers/authController.js
│   ├── middleware/authMiddleware.js
│   ├── models/User.js
│   ├── routes/authRoutes.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        ├── context/AuthContext.jsx
        ├── pages/
        ├── services/api.js
        └── utils/
```

## Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

### Backend

```bash
cd backend
npm install
```

**If you get `Cannot find module 'mammoth'` or `pdf-parse` errors** (common on OneDrive folders), run:

```bash
npm run install-deps
```

Or double-click `backend/install-deps.bat`. This installs parser packages via a temp folder to avoid OneDrive sync issues.

Then:

```bash
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and GEMINI_API_KEY
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Endpoints

### Authentication

| Method | Route               | Description              | Auth |
|--------|---------------------|--------------------------|------|
| POST   | `/api/auth/signup`  | Register a new user      | No   |
| POST   | `/api/auth/login`   | Login and receive JWT    | No   |
| GET    | `/api/auth/profile` | Get authenticated user   | Yes  |

### Student Profile

| Method | Route                    | Description                    | Auth |
|--------|--------------------------|--------------------------------|------|
| POST   | `/api/student-profile`   | Create student profile         | Yes  |
| GET    | `/api/student-profile`   | Get logged-in user's profile   | Yes  |
| PUT    | `/api/student-profile`   | Update student profile         | Yes  |
| DELETE | `/api/student-profile`   | Delete student profile         | Yes  |

### Resume Upload

| Method | Route                        | Description                    | Auth |
|--------|------------------------------|--------------------------------|------|
| POST   | `/api/resume/upload`         | Upload PDF/DOCX resume         | Yes  |
| GET    | `/api/resume/list`           | List logged-in user's resumes  | Yes  |
| DELETE | `/api/resume/delete/:id`     | Delete a resume                | Yes  |

### AI Resume Analysis

| Method | Route                          | Description                    | Auth |
|--------|--------------------------------|--------------------------------|------|
| POST   | `/api/analysis/analyze/:id`  | Analyze an uploaded resume     | Yes  |
| GET    | `/api/analysis/list`           | List all analysis reports      | Yes  |
| GET    | `/api/analysis/:id`            | Get a single analysis report   | Yes  |

### Skill Gap Analysis

| Method | Route                    | Description                         | Auth |
|--------|--------------------------|-------------------------------------|------|
| GET    | `/api/skill-gap/roles`   | List supported target roles         | Yes  |
| POST   | `/api/skill-gap/preview` | Preview skill gap (no save)         | Yes  |
| POST   | `/api/skill-gap/analyze` | Analyze and save skill gap report     | Yes  |
| GET    | `/api/skill-gap/list`    | List saved skill gap reports          | Yes  |
| GET    | `/api/skill-gap/:id`     | Get a single skill gap report         | Yes  |

## Environment Variables

**Backend (`.env`):**

- `PORT` — Server port (default: 5000)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Secret key for signing tokens
- `JWT_EXPIRES_IN` — Token expiry (default: 7d)
- `GEMINI_API_KEY` — Google Gemini API key for resume analysis
- `GEMINI_MODEL` — Gemini model name (default: gemini-1.5-flash)

**Frontend (optional `.env`):**

- `VITE_API_URL` — API base URL (default: `http://localhost:5000/api`)

## Features

- User signup and login
- JWT-based authentication with protected routes
- Password hashing with bcrypt
- Form validation on client and server
- Responsive Tailwind CSS UI
- Secure token storage in localStorage with Axios interceptors
- Logout functionality
- Student profile module (create, view, edit) linked to JWT user
- Resume upload module (PDF/DOCX, 5MB limit) with list and delete
- AI Resume Analyzer with Gemini API (skills, projects, strengths, gaps)
- Skill Gap Analysis with role comparison, match %, and improvement suggestions
