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

---

## ⚡ Stage 6 — Polish & Performance

### What changed

| Area | Improvement |
|------|-------------|
| **Error handling** | `ErrorBoundary` wraps the whole app — a render crash now shows a styled fallback screen ("Something went off-script") instead of a blank white page, with a one-click reload |
| **Code splitting** | All pages except Login/Register/Home/404 are lazy-loaded via `React.lazy` + `Suspense`. Main JS bundle dropped from **321 KB → 265 KB** (gzipped 95.6 → 86.9 KB); the rest loads on-demand as 1–8 KB chunks per page |
| **Perceived performance** | `RouteProgressBar` — a subtle gold bar animates across the top on every navigation, like a native app |
| **Scroll behavior** | `ScrollToTop` resets scroll position to the top on every route change (previously scroll position carried over, which felt broken on long pages) |
| **Image loading** | `LazyImage` replaces raw `<img>` tags on movie/series posters — shows a pulsing skeleton until loaded, fades in smoothly, and gracefully falls back to a placeholder icon if the image fails or is missing |
| **SEO / meta tags** | `usePageTitle` hook sets `document.title` and the meta description per page (e.g. "Movies · CineVault", or the actual film title + overview on detail pages). `index.html` now has Open Graph tags and a `theme-color` for mobile browser chrome |
| **Deployment readiness** | Added `.gitignore` to both `client/` and `server/`, plus `client/vercel.json` with an SPA rewrite rule so routes like `/movies` or `/profile` don't 404 on a hard refresh once deployed |

### Why this matters before Stage 7 (deployment)

- A smaller initial bundle means faster first load on real-world connections
- The SPA rewrite rule is required for client-side routing to work correctly on Vercel — without it, refreshing on any route other than `/` would 404
- Proper page titles matter for browser history, bookmarks, and any future sharing features

---

## 🚀 Stage 7 — Deployment

This stage has no new app features — it's about getting CineVault live on the internet. You'll deploy:

- **Database**: MongoDB Atlas (already done, since Stage 1 — just confirm network access below)
- **Backend**: Render (free tier)
- **Frontend**: Vercel (free tier)

### Step 0 — Push your code to GitHub

If you haven't already:

```bash
cd Cine-Vault
git init
git add .
git commit -m "CineVault — ready for deployment"
```

Create a new repo on [github.com/new](https://github.com/new), then:

```bash
git remote add origin https://github.com/<your-username>/cinevault.git
git branch -M main
git push -u origin main
```

Because `.gitignore` is already in place, your `.env` files and `node_modules` will **not** be pushed — good, that's exactly what you want.

---

### Step 1 — MongoDB Atlas: allow Render to connect

Render's servers don't have a fixed IP on the free tier, so:

1. Go to your [Atlas dashboard](https://cloud.mongodb.com) → **Network Access**
2. Click **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
3. Confirm

This is safe because your database still requires the correct username/password in the connection string — this setting only controls *which IPs are allowed to attempt a connection at all*.

---

### Step 2 — Deploy the backend to Render

1. Go to [render.com](https://render.com) → sign up / log in (GitHub login is easiest)
2. Click **New +** → **Web Service**
3. Connect your GitHub repo
4. Render should auto-detect the `render.yaml` blueprint in the repo root. If it asks you to configure manually instead, use these settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add each of these (copy values from your local `server/.env`):

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | your Atlas connection string |
   | `JWT_SECRET` | your secret (same one or generate a new one) |
   | `TMDB_API_KEY` | your TMDB key |
   | `TMDB_BASE_URL` | `https://api.themoviedb.org/3` |
   | `CLIENT_URL` | leave blank for now — you'll fill this in after Step 3 |

6. Click **Create Web Service**. Render will build and deploy — this takes 2–5 minutes.
7. Once live, copy your backend URL, e.g. `https://cinevault-server.onrender.com`
8. Visit `https://cinevault-server.onrender.com/api/health` in your browser — you should see `{"status":"CineVault server is running",...}`. If you see this, your backend is live.

> **Free tier note:** Render's free web services "spin down" after 15 minutes of inactivity and take 30–60 seconds to wake back up on the next request. This is normal — your first request after idle time will just feel slow once.

---

### Step 3 — Deploy the frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → sign up / log in (GitHub login is easiest)
2. Click **Add New** → **Project** → import your GitHub repo
3. Configure:
   - **Root Directory**: click "Edit" and set it to `client`
   - **Framework Preset**: Vercel should auto-detect **Vite**
   - **Build Command**: `npm run build` (default, should already be filled)
   - **Output Directory**: `dist` (default)
4. Expand **Environment Variables** and add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | your Render backend URL from Step 2, e.g. `https://cinevault-server.onrender.com` |

5. Click **Deploy**. This takes 1–2 minutes.
6. Once live, copy your frontend URL, e.g. `https://cinevault.vercel.app`

---

### Step 4 — Connect the two: update CLIENT_URL on Render

1. Go back to your Render service → **Environment**
2. Set `CLIENT_URL` to your Vercel URL from Step 3, e.g.:
   ```
   CLIENT_URL=https://cinevault.vercel.app
   ```
   (No trailing slash. If you also test Vercel preview URLs later, you can add them comma-separated: `https://cinevault.vercel.app,https://cinevault-git-main-yourname.vercel.app`)
3. Save — Render will automatically redeploy with the new variable (takes ~1 minute)

---

### Step 5 — Promote yourself to admin on production

Your local `makeAdmin.js` script connects using whatever `MONGO_URI` is in your **local** `.env` — since that's the same Atlas database your production server uses, you can run it locally and it'll take effect immediately on the live site:

```bash
cd server
node scripts/makeAdmin.js you@example.com
```

---

### Step 6 — Test the full flow live

Visit your Vercel URL and walk through:

1. Register a new account → confirms frontend ↔ backend ↔ database all connected
2. Browse movies/series → confirms TMDB key works in production
3. Add something to My List → confirms write operations work
4. Log out, log back in → confirms cookies/JWT work cross-domain
5. If you ran Step 5, check the Admin Panel link appears in your avatar menu

If registration or login fails with a network error, the most common cause is a typo in `VITE_API_URL` or `CLIENT_URL` — double check both have no trailing slash and use `https://`.

---

### Ongoing: how updates work

Both Vercel and Render are connected to your GitHub repo, so the workflow going forward is simply:

```bash
git add .
git commit -m "describe your change"
git push
```

Both platforms automatically detect the push and redeploy within a minute or two — no manual redeploy needed.
