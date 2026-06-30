# Phase 11 — "Sign in with Google" (Redirect / Authorization-Code Flow)

> A guide, not copy-paste code. It explains the concept, the flow for YOUR stack,
> the exact Google Console setup, and the steps to build. You write the code.

## What is this, in plain English?

Normally **you** check the user's password. With "Sign in with Google," you instead
let **Google vouch for who they are.**

> **Analogy:** instead of checking someone's ID yourself, a trusted bouncer (Google)
> checks it and hands you a signed note: *"Yes, this is Ashish, email ashish@gmail.com."*
> You trust the note because it's from Google. You never see their password.

**Key idea for your app:** Google is only used to *identify* the user. Once you know
who they are, **you still issue your own JWT** (the same `jwt.sign({ userId })` you
already have). So all your existing middleware and protected routes keep working
**unchanged**. Google logs them in; your JWT keeps them logged in.

## Redirect flow vs popup

- **Popup:** a small window opens, user signs in, window closes. (Google's JS SDK.)
- **Redirect (what you want):** the whole browser navigates to Google, user signs
  in, Google navigates them back to your app. This is the classic **authorization
  code flow**, handled server-side — more secure because the secret stays on your
  backend.

## The flow for YOUR stack (read this twice)

```
1. User clicks "Sign in with Google" (frontend)
        │  browser navigates to ↓
2. Your backend  GET /auth/google
        │  builds Google's auth URL + redirects user to Google
3. Google consent screen  →  user approves
        │  Google redirects back to ↓ (with ?code=...&state=...)
4. Your backend  GET /auth/google/callback
        │  a) verify state (CSRF check)
        │  b) exchange the `code` for tokens (server-to-server POST)
        │  c) read user's email + name from Google
        │  d) find-or-create that user in MongoDB
        │  e) sign YOUR OWN jwt ({ userId })
        │  f) redirect to frontend with the token ↓
5. Frontend  /auth/callback?token=...
        │  read token from URL → store in localStorage (AuthContext.login)
        │  → navigate to /dashboard
```

The magic: step 5 ends exactly where your normal login ends — token in localStorage.
Everything after that is your existing app.

---

## Step 0 — Google Cloud Console setup (do this first, ~10 min)

1. Go to **console.cloud.google.com** → create a new **Project** (e.g. "Laptop Inventory").
2. **APIs & Services → OAuth consent screen:**
   - User type: **External**. Fill app name, your email. Add scopes `email`,
     `profile`, `openid`. Add yourself as a **Test user** (while in "testing" mode).
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID:**
   - Application type: **Web application**.
   - **Authorized JavaScript origins:** `http://localhost:5173` (your frontend).
   - **Authorized redirect URIs:** `http://localhost:3000/auth/google/callback`
     (your BACKEND callback — this must match EXACTLY what your code uses).
4. Copy the **Client ID** and **Client Secret**.

> **Rules that bite:** the redirect URI must match character-for-character (a trailing
> slash difference = `redirect_uri_mismatch` error). `localhost` is allowed over HTTP;
> in production it must be HTTPS and your real domain. Changes can take a few minutes
> to apply.

Put the secrets in `Laptop_inventry_API/.env` (NEVER the frontend — your `.gitignore`
already protects `.env`):
```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
CLIENT_URL=http://localhost:5173
```

---

## Step 1 — Backend route: start the flow  `GET /auth/google`

Build Google's authorization URL and redirect the user to it.

- **Auth endpoint:** `https://accounts.google.com/o/oauth2/v2/auth`
- **Query params:**
  - `client_id` = your client id
  - `redirect_uri` = your backend callback
  - `response_type` = `code`
  - `scope` = `openid email profile`
  - `state` = a random string (CSRF protection — store it to compare later)
  - `access_type` = `offline` (optional; gives a refresh token)

Then `res.redirect(thatUrl)`. (Build the query string with `URLSearchParams`.)

## Step 2 — Backend route: handle the callback  `GET /auth/google/callback`

Google redirects here with `?code=...&state=...`. In the handler:

1. **Verify `state`** matches what you sent (CSRF guard).
2. **Exchange the code for tokens** — POST to `https://oauth2.googleapis.com/token`
   with: `code`, `client_id`, `client_secret`, `redirect_uri`, `grant_type=authorization_code`.
   The response has `access_token` and `id_token`.
3. **Get the user's identity.** Two options:
   - Call `https://www.googleapis.com/oauth2/v3/userinfo` with the access token
     (`Authorization: Bearer <access_token>`) → returns `{ email, name, sub, ... }`.
   - OR decode the `id_token` (it's a JWT containing email/name/sub).
   - `sub` is Google's stable unique user id — store it as `googleId`.
4. **Find-or-create the user** in MongoDB:
   - `User.findOne({ email })` → if found, log them in (links the account).
   - If not found, `User.create({ name, email, googleId })` — **no password.**
5. **Sign YOUR jwt:** `jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" })`.
6. **Redirect to the frontend with the token:**
   `res.redirect(`${CLIENT_URL}/auth/callback?token=${token}`)`.

> **Why exchange the code server-side?** The `client_secret` is required for the
> exchange, and it must NEVER touch the browser. That's the whole reason this flow is
> more secure than client-side ones — the secret stays on your server.

## Step 3 — Backend: update the User model

Google users have no password, but your schema has `password: { required: true }`.
Fix it:
- Make `password` **not required** (Google users won't have one).
- Add `googleId: { type: String }` (optional — only Google users have it).
- Keep `email` unique — it's how you match a Google login to an existing account.

> Decision to make: if someone registered with email+password and later "Sign in with
> Google" using the same email — do you link them (same account) or block it? Simplest
> for now: **match by email and link.** Just be aware of the choice.

## Step 4 — Frontend: the button + the callback route

**The button** (on Login/Register page) is dead simple in redirect flow — it's just a
link to your backend:
```jsx
<a href="http://localhost:3000/auth/google">Sign in with Google</a>
```
(No library needed — clicking it navigates the browser to step 2.)

**The callback route** — add a route `/auth/callback` in your `App.jsx` that renders a
small component which:
1. Reads `token` from the URL (`useSearchParams` from react-router).
2. Calls your `AuthContext.login(token)` (stores it in localStorage).
3. `navigate("/dashboard")`.

That's it — you land exactly where your normal login lands.

---

## Library options (pick based on how much you want to learn)

| Approach | What it gives | When |
|----------|---------------|------|
| **Manual** (fetch to Google's endpoints) | Full understanding of every step | ✅ Best for *learning* — your style |
| **`google-auth-library`** (official) | Helpers for the token exchange + verifying the `id_token` | Good middle ground; verifies tokens safely |
| **Passport.js** (`passport-google-oauth20`) | Does the whole flow for you | Least code, least learning |

> Recommendation: do the **manual** flow once to understand OAuth (you'll see it in
> every interview), but use **`google-auth-library`** just for verifying the `id_token`
> so you don't hand-roll JWT signature checks. Same "raw first, then the safe tool"
> approach you've used all along.

## Security checklist
- [ ] `client_secret` only in backend `.env`, never frontend
- [ ] Validate the `state` param on callback (CSRF)
- [ ] `redirect_uri` matches the Console exactly
- [ ] Don't store Google's access/refresh tokens unless you need them — you only need
      identity, then your own JWT takes over
- [ ] Passing your JWT via URL query (`?token=`) is OK for learning; production apps
      often use an httpOnly cookie set by the callback instead (more secure)

## Build order
1. Google Console setup + env vars.
2. `GET /auth/google` (redirect to Google) — test it sends you to the consent screen.
3. `GET /auth/google/callback` — `console.log` the `code` first to confirm it arrives,
   THEN add the token exchange, THEN find-or-create + your JWT.
4. User model: password optional + `googleId`.
5. Frontend button + `/auth/callback` route.
6. Test the full loop: click → Google → back → on the dashboard.

> Debug tip (your favorite skill now): at each step, `console.log` what you received
> before using it — the `code`, the token response, the userinfo. Build the chain one
> verified link at a time, exactly like you debugged the prop bugs.
