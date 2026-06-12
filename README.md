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

---

## 🎬 Stage 2 — TMDB Setup

### 1. Get a free TMDB API key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup)
2. Go to **Settings → API → Create → Developer**
3. Copy your **API Key (v3 auth)**

### 2. Add it to your `.env`

```env
TMDB_API_KEY=paste_your_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
```

### 3. New pages in Stage 2

| Route | Page |
|-------|------|
| `/` | Home — hero banner + 5 movie rows |
| `/movies` | Browse all movies, sort + genre filter, pagination |
| `/genres` | Visual genre grid, click to browse by genre |
| `/search` | Live debounced search |
| `/movie/:id` | Full detail — cast, trailer link, similar movies |

### New API endpoints (all protected)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/movies/trending` | Trending this week |
| GET | `/api/movies/popular` | Popular movies |
| GET | `/api/movies/top-rated` | Top rated |
| GET | `/api/movies/upcoming` | Upcoming releases |
| GET | `/api/movies/now-playing` | In theatres now |
| GET | `/api/movies/genres` | Genre list |
| GET | `/api/movies/genre/:id` | Movies by genre |
| GET | `/api/movies/search?q=` | Search movies |
| GET | `/api/movies/:id` | Full movie detail + cast + videos + similar |

---

## 👤 Stage 3 — Profile Editing & My List

### New pages

| Route | Page |
|-------|------|
| `/profile` | View account details, My List summary, link to edit |
| `/profile/edit` | Edit display name, pick avatar color, change password |
| `/my-list` | Grid of all movies saved to your watchlist |

### New API endpoints (all protected)

| Method | Route | Description |
|--------|-------|-------------|
| PUT | `/api/user/profile` | Update `name` and/or `avatar` (0–5) |
| PUT | `/api/user/password` | Change password (requires current password) |
| GET | `/api/user/mylist` | Get saved movies, newest first |
| POST | `/api/user/mylist` | Add a movie `{ movieId, title, poster_path, vote_average, release_date }` |
| DELETE | `/api/user/mylist/:movieId` | Remove a movie from the list |

### How it works

- The bookmark icon appears on every `MovieCard` hover overlay and on the movie detail page — click to toggle add/remove.
- `MyListContext` keeps the list in memory and updates optimistically (instant UI feedback, rolls back on error).
- Avatar colors are stored as a number (0–5) on the user — `AvatarPicker` lets you choose one of 6 color swatches matched to your initials.
- Password change requires the current password and re-hashes via the existing `User` model `pre('save')` hook.
