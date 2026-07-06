# Phase 13 — Dockerize + Deploy on Render

> A guide, not copy-paste. Explains Docker, the pre-deploy refactors your app NEEDS,
> and the exact Render steps. Read the "blockers" section first — skip it and your
> deploy will fail in confusing ways.

---

## ⚠️ Read this first — 3 things that WILL block your deploy

### Blocker 1: Render has NO managed MongoDB
You asked "can I get a MongoDB instance on Render?" — **no.** Render offers managed
PostgreSQL/Redis, but **not MongoDB.** And your local MongoDB (on your laptop) is
unreachable from the internet, so Render can't use it either.

**Solution: MongoDB Atlas (free M0 tier)** — cloud-hosted MongoDB.
- You may already be on Atlas (your connection string looked like a `mongodb+srv://...`
  cluster). If so, you just reuse that connection string on Render. ✅
- If you're truly on local Mongo, create a free Atlas cluster and point your app at it.
- **Critical Atlas setting:** Network Access → allow `0.0.0.0/0` (from anywhere), or
  Render's servers can't connect. (Fine for a learning project; tighten later.)

### Blocker 2: 13 hardcoded `http://localhost:3000` URLs
Every `fetch("http://localhost:3000/...")` in your frontend points at YOUR laptop.
In production the backend lives at some `https://your-api.onrender.com`. All 13 must
become an **environment variable**:
```js
const BASE_URL = import.meta.env.VITE_API_URL;   // "http://localhost:3000" in dev, prod URL in prod
fetch(`${BASE_URL}/signin`, ...)
```
> **This is the `http()` wrapper moment we've discussed since day one.** If you'd had
> one wrapper, you'd change the base URL in ONE place. Instead you have 13 edits. So
> either: (a) finally build the wrapper and route calls through it, or (b) at minimum,
> replace every hardcoded URL with `import.meta.env.VITE_API_URL`. Do (a) if you can —
> deployment is the perfect reason.

### Blocker 3: production URLs must be registered in two more places
- **CORS:** your backend allows `origin: "http://localhost:5173"`. It must also allow
  your deployed frontend URL. Make it an env var (`CLIENT_URL`).
- **Google OAuth:** add your production redirect URI + JS origin in Google Cloud
  Console, or Google sign-in will `redirect_uri_mismatch`.

---

## Part A — What is Docker? (the concept)

> **Analogy:** Docker is a **shipping container** for your app. Instead of "it works
> on my machine" (different Node versions, missing deps), you pack your app + its exact
> Node version + all dependencies into a sealed container that runs **identically
> everywhere** — your laptop, a teammate's, or Render's servers.

Two words to know:
- **Image** = the blueprint (built from a `Dockerfile`). A frozen snapshot of your app + environment.
- **Container** = a running instance of an image (like an object is an instance of a class).

---

## Part B — Dockerize the backend

### 1. `Laptop_inventry_API/Dockerfile`
```dockerfile
FROM node:20-alpine           # base image: a tiny Linux with Node 20
WORKDIR /app                  # work inside /app in the container

COPY package*.json ./         # copy ONLY package files first...
RUN npm install               # ...so this layer caches unless deps change

COPY . .                      # now copy the rest of the source

EXPOSE 3000                   # document the port the app listens on
CMD ["node", "index.js"]      # the command that starts the app
```
> **Why copy `package.json` before the source?** Docker caches each step ("layer"). If
> your source changes but deps don't, Docker reuses the cached `npm install` — much
> faster rebuilds. This ordering is a standard Docker optimization.

### 2. `Laptop_inventry_API/.dockerignore`
Keep junk/secrets out of the image:
```
node_modules
.env
npm-debug.log
```

### 3. Build & run it locally to test
```bash
cd Laptop_inventry_API
docker build -t laptop-api .            # build the image
docker run -p 3000:3000 --env-file .env laptop-api   # run it, mapping the port
```
Hit `http://localhost:3000/hello` — if it responds, your image works.

---

## Part C — Dockerize the frontend (optional)

A Vite app builds to **static files** (`dist/`). Two options:
- **For Render: don't bother** — deploy as a **Static Site** (Part E), much simpler.
- **To learn Docker:** a multi-stage build (Node builds it, nginx serves it):
```dockerfile
# stage 1: build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build              # produces /app/dist

# stage 2: serve the static files with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```
> **Multi-stage builds** let you use a big Node image to *build*, then throw it away and
> ship only the tiny nginx + static files. Smaller, safer final image. Good concept to
> know, but overkill for Render — use a Static Site there.

---

## Part D — Docker Compose (the real "learn Docker" win)

`docker-compose.yml` runs your **whole stack** (backend + frontend + a local Mongo)
with ONE command — great for local dev consistency:
```yaml
services:
  mongo:
    image: mongo:7
    ports: ["27017:27017"]
  api:
    build: ./Laptop_inventry_API
    ports: ["3000:3000"]
    env_file: ./Laptop_inventry_API/.env
    depends_on: [mongo]
  web:
    build: ./frontend
    ports: ["5173:80"]
    depends_on: [api]
```
`docker compose up` → entire app running. This is where Docker "clicks" — one command,
identical environment for anyone who clones your repo. (This is a portfolio flex too.)

---

## Part E — Deploy on Render

Render can build from your repo **natively** (no Docker needed) OR use your Dockerfile.
Recommended split: **backend as a Web Service (uses your Dockerfile), frontend as a
Static Site (native build).**

### Backend → Render Web Service
1. Push your repo to GitHub (make sure `.env` is gitignored — it is).
2. Render → New → **Web Service** → connect the repo → root dir `Laptop_inventry_API`.
3. Runtime: **Docker** (it finds your Dockerfile) — or Node with start `node index.js`.
4. **Environment variables** (set in Render dashboard, NOT committed):
   `MONGO_DB_CONNECTION_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
   `GOOGLE_REDIRECT_URI` (prod), `CLIENT_URL` (prod frontend URL).
5. **PORT:** Render sets `process.env.PORT` for you — your app already uses it. ✅
   Don't hardcode 3000.
6. Deploy → you get `https://your-api.onrender.com`.

### Frontend → Render Static Site
1. Render → New → **Static Site** → same repo → root dir `frontend`.
2. Build command: `npm install && npm run build`. Publish dir: `dist`.
3. **Env var:** `VITE_API_URL` = your deployed backend URL (`https://your-api.onrender.com`).
4. **Add a rewrite rule** so client-side routing works (react-router):
   `Source: /*  →  Destination: /index.html` (type: Rewrite). Without this, refreshing
   on `/dashboard` gives a 404.
5. Deploy → you get `https://your-app.onrender.com`.

### Wire the two together (the gotchas)
- Backend CORS `origin` → set to your **frontend's** Render URL (via `CLIENT_URL`).
- Google Console → add the prod redirect URI (`https://your-api.onrender.com/auth/google/callback`)
  and JS origin (`https://your-app.onrender.com`).
- Frontend `VITE_API_URL` → your **backend's** Render URL.

### Render free-tier reality
The free Web Service **spins down after ~15 min of inactivity**, so the first request
after idle takes ~50s to wake ("cold start"). Static sites don't spin down. Totally
fine for a portfolio demo — just mention it if someone tests it cold.

---

## Deploy checklist (do in this order)
1. [ ] MongoDB on Atlas + Network Access `0.0.0.0/0`.
2. [ ] Replace 13 hardcoded `localhost:3000` → `VITE_API_URL` (build the wrapper!).
3. [ ] Backend CORS + Google redirect URIs use env vars, not hardcoded localhost.
4. [ ] Confirm app listens on `process.env.PORT`.
5. [ ] Dockerfile + `.dockerignore` for backend; test `docker build` + `docker run` locally.
6. [ ] Push to GitHub (`.env` NOT committed).
7. [ ] Render Web Service (backend) with env vars.
8. [ ] Render Static Site (frontend) with `VITE_API_URL` + SPA rewrite.
9. [ ] Update Google Console with prod URLs.
10. [ ] Test the live URL end-to-end: signup → login → CRUD → Google sign-in.
11. [ ] Put the live URL in your README (and your resume 🎉).
```
