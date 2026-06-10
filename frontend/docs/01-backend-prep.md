# Phase 0 — Prep the Backend (do this FIRST)

> ✅ **STATUS: DONE & VERIFIED (2026-06-04).** Both items below are fixed in the
> API project. CORS is enabled and scoped to the frontend origin, and signin now
> rejects wrong passwords with a `401`. Kept here as a reference for *why* each
> change mattered.

Your frontend can't talk to the API until two things are fixed in the **API** project.

## 0.1 — Enable CORS ✅ done

**The problem:** Your React app runs on `http://localhost:5173`, your API on
`http://localhost:3000`. These are **different origins**. Browsers enforce the
**Same-Origin Policy** and will BLOCK the request unless the server explicitly
says "I allow other origins to call me."

This is the #1 wall every beginner hits when connecting a frontend. The error
looks like:
```
Access to XMLHttpRequest at 'http://localhost:3000/...' from origin
'http://localhost:5173' has been blocked by CORS policy.
```

**The fix:**
1. In the API folder, install the `cors` package.
2. In `index.js`, register it **before your routes**:
   ```js
   const cors = require("cors");
   app.use(cors());          // must come before app.use("/api", ...)
   ```

**Why "before routes"?** Middleware runs top-to-bottom. CORS must add its
permission headers before the request reaches your route handlers.

**Best practice (for later):** Don't leave it wide open in production. Restrict
to your frontend's origin:
```js
app.use(cors({ origin: "http://localhost:5173" }));
```
Wide-open `cors()` allows ANY website to call your API — fine for local dev,
risky in production.

## 0.2 — Fix the signin password bug ✅ done

In `AuthController.js`, the `signin` function computes the comparison but never
checks it:

```js
const compare = await bcrypt.compare(password, user.password);
// ❌ result is never used — a wrong password still gets a token!

const token = jwt.sign({ userId: user._id }, ...);
```

**The fix:** actually check the result before issuing a token.
```js
const compare = await bcrypt.compare(password, user.password);
if (!compare) {
  return res.status(401).json({ error: "invalid credentials" });
}
// only now sign the token
```

**Why it matters:** Right now anyone can log in with the wrong password and
receive a valid JWT. This is the single most important auth bug to fix before
building a login screen on top of it.

**Security note:** Return the same generic message ("invalid credentials") for
both "user not found" and "wrong password". Telling an attacker *which* one was
wrong helps them figure out which emails are registered.

## Checklist before moving on

- [x] `cors` installed and `app.use(cors())` added before routes
      *(scoped to `http://localhost:5173` — better than wide-open)*
- [x] signin returns 401 when `bcrypt.compare` is false
- [x] backend restarts cleanly and `GET /hello` still works in Postman
