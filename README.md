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

---

## 📺 Stage 4 — TV Series Support

### New pages

| Route | Page |
|-------|------|
| `/series` | Browse TV shows — sort tabs (Popular, Top Rated, On The Air, Airing Today) + genre filter |
| `/tv/:id` | Series detail — seasons list, cast, trailer, creators, similar shows |
| `/genres` | Now has a Movies / Series toggle |
| `/search` | Now searches **both** movies and series together |
| `/` | New "Popular Series" row added to the homepage |

### New API endpoints (all protected)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/tv/trending` | Trending TV this week |
| GET | `/api/tv/popular` | Popular TV shows |
| GET | `/api/tv/top-rated` | Top rated TV shows |
| GET | `/api/tv/on-the-air` | Currently airing |
| GET | `/api/tv/airing-today` | Airing today |
| GET | `/api/tv/genres` | TV genre list |
| GET | `/api/tv/genre/:id` | TV shows by genre |
| GET | `/api/tv/search?q=` | Search TV shows |
| GET | `/api/tv/:id` | Full series detail + cast + videos + similar |
| GET | `/api/search/multi?q=` | Combined movie + TV search results |

### My List now supports both

- `User.myList` items now carry a `mediaType: 'movie' | 'tv'` field
- The bookmark icon on every card and detail page now correctly saves/removes the right type
- `DELETE /api/user/mylist/:movieId?mediaType=tv` lets you remove series specifically (movie and series can share the same TMDB ID, so this disambiguates)
- `/my-list` shows a mixed grid of saved movies and series, each linking to the correct detail page

---

## 🛡️ Stage 5 — Admin Panel

### Make yourself an admin

Run this once from the `server` folder (replace with your account's email):

```bash
node scripts/makeAdmin.js you@example.com
```

You should see `✅ Your Name (you@example.com) is now an admin.` Log out and back in (or refresh) — an **"Admin Panel"** link will appear in your avatar dropdown.

### New pages

| Route | Page |
|-------|------|
| `/admin` | Dashboard — total users, new signups this week, saved items across all users, featured count, recent signups list |
| `/admin/users` | Searchable user table — toggle Admin/User role, delete accounts (can't modify/delete your own) |
| `/admin/featured` | Curate the homepage hero — search TMDB, add titles, reorder with up/down arrows, remove |

### New API endpoints (all require `protect` + `requireAdmin`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/stats` | Dashboard metrics |
| GET | `/api/admin/users?page=&q=` | Paginated, searchable user list |
| PUT | `/api/admin/users/:id/role` | Set role to `user` or `admin` |
| DELETE | `/api/admin/users/:id` | Delete a user account |
| GET | `/api/admin/featured` | List featured items (admin view) |
| POST | `/api/admin/featured` | Add a movie/series to the homepage hero |
| DELETE | `/api/admin/featured/:id` | Remove a featured item |
| PUT | `/api/admin/featured/reorder` | Reorder featured items |

### Public endpoint

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/movies/featured` | Returns admin-curated items for the homepage hero (any logged-in user). Falls back to **Trending This Week** automatically if nothing is featured. |

### Safeguards

- Admins can't demote themselves or delete their own account from the panel (prevents accidental lockout)
- Featured titles are deduplicated — the same title can't be added twice
- The homepage hero gracefully falls back to TMDB trending content if the featured list is empty
