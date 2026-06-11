# CineVault 🎬

A premium streaming platform with a cinematic navy-gold aesthetic. Built with React + Express + MongoDB Atlas.

---

## 🗂 Project Structure

```
cinevault/
├── client/          # React + Vite frontend
└── server/          # Express + MongoDB backend
```

---

## ⚡ Quick Start

### 1. Clone & install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure environment variables

```bash
# In /server, copy the example file
cp .env.example .env
```

Then edit `/server/.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cinevault?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret_string
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **Get your MONGO_URI:** Go to [MongoDB Atlas](https://cloud.mongodb.com) → your cluster → Connect → Drivers → copy the connection string, replace `<password>` with your DB user password.

### 3. Run the development servers

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd server
npm run dev
# Runs on http://localhost:5000

# Terminal 2 — Frontend
cd client
npm run dev
# Runs on http://localhost:5173
```

Visit `http://localhost:5173` in your browser.

---

## 🧪 Test the auth flow

1. Go to `/register` → create an account
2. You'll be redirected to the home page (authenticated)
3. Click your avatar → Sign Out
4. Go to `/login` → sign in with same credentials
5. Refresh the page — session persists via httpOnly cookie
6. Try visiting `/` without being logged in → redirected to `/login`

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Sign in |
| POST | `/api/auth/logout` | No | Sign out (clears cookie) |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/health` | No | Server health check |

---

## 🎨 Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `brand-bg` | `#0D0F1A` | Page background |
| `brand-surface` | `#161929` | Cards, navbar |
| `brand-accent` | `#C8A96E` | Gold — CTAs, highlights |
| `brand-textPrimary` | `#F0EDE8` | Headings, body |
| `brand-textSecondary` | `#8A8FA8` | Labels, subtitles |
| `brand-danger` | `#E05C5C` | Errors, destructive |

Fonts: **Outfit** (display/headings) + **Inter** (body)

---

## 🗓 Build Stages

| Stage | Status | What's built |
|-------|--------|-------------|
| **1** | ✅ Done | Auth, MongoDB, base theme |
| **2** | ⏳ Next | TMDB API, movie listings, hero |
| **3** | — | Movie detail, video player, search |
| **4** | — | Profiles, avatar, My List |
| **5** | — | Admin panel |
| **6** | — | Polish & performance |
| **7** | — | Deploy (Vercel + Render + Atlas) |

---

## 🚀 Deployment (Stage 7 preview)

- **Frontend:** Vercel — `cd client && npm run build`, deploy `dist/`
- **Backend:** Render — set env vars, deploy from `/server`
- **Database:** MongoDB Atlas (already cloud-hosted)

Remember to update `CLIENT_URL` in your server `.env` to your Vercel URL before deploying.
