# Chapter

A personal book manager. Keep track of what you're reading, what you've finished, and what's still waiting.

Built as a technical assessment.

## Live

- **App** — _deployment pending_
- **API** — _deployment pending_

## Stack

**Frontend** — Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Zustand, React Hook Form, Zod, Axios, Framer Motion, GSAP

**Backend** — Node.js, Express 5, TypeScript, Mongoose 9, JWT, bcrypt

**Database** — MongoDB Atlas

## What it does

- Sign up, sign in, sign out
- Add, edit and remove books, each with an author, tags and a reading status
- Filter by shelf (Want to read / Reading / Completed) and by tag
- Search across titles, authors and tags
- Sort by date added, title or author
- Switch between a cover grid and a list view
- Open any book for details, notes and reading progress
- Light and dark themes, following the system by default

## Running it locally

**You'll need** Node.js 18 or newer and a MongoDB database. A free MongoDB Atlas cluster is the quickest route.

### 1. Clone

```bash
git clone <repo-url>
cd thumbstack
```

### 2. Start the API

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Fill in `.env` before starting:

| Variable | What it's for |
| --- | --- |
| `PORT` | Port the API listens on. `5000` matches the client default. |
| `MONGODB_URI` | Your MongoDB connection string, **including a database name** |
| `JWT_SECRET` | Any long random string. `openssl rand -base64 48` works. |
| `CLIENT_ORIGIN` | Where the frontend runs. `http://localhost:3000` locally. |
| `NODE_ENV` | `development` locally, `production` when deployed |

The server checks all of these on boot and exits with a clear message if any are missing, so a typo fails immediately rather than at first login.

> **On the connection string:** put a database name before the `?`, like `...mongodb.net/chapter?retryWrites=true`. Leave it out and Mongoose quietly writes everything to a database called `test`.

You should see:

```
MongoDB connected to "chapter"
Server running on port 5000
```

If it fails with a TLS error instead, your IP isn't on the Atlas allowlist — see **Deploying** below.

### 3. Start the app

In a second terminal:

```bash
cd client
cp .env.local.example .env.local
npm install
npm run dev
```

`.env.local` needs one value:

| Variable | What it's for |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Where the API lives. `http://localhost:5000` locally. |

### 4. Open it

<http://localhost:3000> — create an account and add a book.

## Commands

Both `client/` and `server/` accept the same four:

```bash
npm run dev        # start in watch mode
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## API

Every `/api/books` route requires a valid session cookie.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signup` | — | Create an account |
| `POST` | `/api/auth/login` | — | Sign in |
| `POST` | `/api/auth/logout` | — | Sign out and clear the cookie |
| `GET` | `/api/auth/me` | Yes | The signed-in user |
| `GET` | `/api/books` | Yes | List books, newest first |
| `POST` | `/api/books` | Yes | Add a book |
| `GET` | `/api/books/:id` | Yes | One book |
| `PUT` | `/api/books/:id` | Yes | Update a book |
| `PATCH` | `/api/books/:id/status` | Yes | Change status only |
| `DELETE` | `/api/books/:id` | Yes | Remove a book |
| `GET` | `/health` | — | Liveness check |

`GET /api/books` takes optional filters: `?status=reading` and `?tags=fiction,essays` (a book must carry *every* listed tag).

Errors always come back as `{ "message": string }`, with `errors` added for per-field validation problems.

## Data model

**User** — name, email (unique, lowercased), password. The password is hashed with bcrypt at 12 rounds and excluded from queries by default, so it can't leak through a stray lookup.

**Book** — title, author, tags, status, cover, pages, currentPage, note, owner. Tags are lowercased, trimmed and de-duplicated on save, so `Fiction` and `fiction` never become two tags. Indexed on `{ owner, status }` and `{ owner, tags }`, since every query is scoped to one person before it's narrowed.

## Decisions worth explaining

**A separate Express API rather than Next.js route handlers.** The brief asks for the MERN stack, which implies a real Express server. It also keeps the two halves independently deployable.

**JWT in an HttpOnly cookie, not localStorage.** A token in localStorage can be read by any script that gets onto the page. An HttpOnly cookie can't be — `document.cookie` returns nothing while signed in. The cookie switches to `SameSite=None; Secure` in production because the app and the API sit on different domains once deployed.

**Zustand holds only the session and the active filters.** Book data lives in component state, because it's request-scoped rather than global. Putting server data in a store means hand-rolling cache invalidation, which is a problem worth having only if you're using something like React Query.

**Filtering runs on the client.** The sidebar shows a count for every shelf at the same moment the grid shows one of them, and a filtered API response can't answer both at once. So the app fetches once and filters locally, which also makes it instant. The API still supports server-side filtering — see the query parameters above.

**Covers are drawn, not fetched.** Each book gets one of eight palettes and one of five spine layouts, so a shelf looks varied without depending on anything external. An earlier version pulled real cover art from Open Library; that service was down for most of a day during development, which made the case for itself.

**Deleting is deferred, not immediate.** Removing a book takes it off screen straight away but holds the API call for five seconds. Undo cancels it, so the record is never actually deleted and keeps its original id. Only if the toast expires does the request go out.

## Known limitations

- No pagination — a personal library is assumed to be small enough to load at once
- No password reset or email verification
- Books are private to their owner; nothing is shared or public
- Reading progress is a page number, not a history

## A note on the brief

Two places where this diverges from the original spec, both deliberate:

- **Search exists.** The brief lists it as out of scope, but the design provided later included a search field, so it's there. It filters the already-loaded list rather than adding an endpoint.
- **There's no separate dashboard page.** The design folds the counts into the library header, so the totals sit above the shelves instead of on their own screen. `/dashboard` redirects to the library.

## Deploying

**The app** goes on Vercel. Set the root directory to `client` and add `NEXT_PUBLIC_API_URL` pointing at the deployed API.

**The API** goes on Railway. Set the root directory to `server` and add all five environment variables. `CLIENT_ORIGIN` must be the exact Vercel URL — CORS sends credentials, so a wildcard won't work.

**One thing that will catch you out:** MongoDB Atlas → Network Access must allow `0.0.0.0/0`. Railway's outbound IPs change, so a single-IP allowlist can't work in production. The database is still protected by its username and password. Symptom if you forget: a TLS handshake error that looks like a network fault rather than a permissions one.

Deploy the API first so you have its URL for Vercel, then set `CLIENT_ORIGIN` to the Vercel URL and redeploy the API.
