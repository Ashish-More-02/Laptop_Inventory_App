# Phase 3 & 4 — API Layer + JWT Management (the heart of this project)

## Phase 3 — The API layer (`api/http.js`)

We're using the browser's built-in **`fetch`** — no library to install. But raw
fetch has two annoyances we want to fix in ONE place:
1. it doesn't know our base URL,
2. it won't attach the JWT automatically,
3. it doesn't throw on HTTP errors (a 404 or 500 still "succeeds").

So we write **one wrapper function** that every component uses — never raw `fetch`.

```js
// api/http.js  (shape to aim for)
const BASE_URL = import.meta.env.VITE_API_URL;   // http://localhost:3000

export async function http(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // attach JWT if present
      ...options.headers,
    },
  });

  // fetch does NOT throw on 400/401/500 — we check ourselves
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";          // token expired → kick to login
    return;
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}
```

**Why one wrapper?** Same reason axios users make one instance: if the API URL
changes (e.g. you deploy), you edit ONE file. And the token + error logic lives in
one spot instead of being copy-pasted into every call. This is the DRY principle.

**The key fetch gotcha:** unlike axios, `fetch` only rejects on *network* failure.
A `404` or `500` still resolves "successfully" with `res.ok === false`. You MUST
check `res.ok` yourself — beginners forget this and wonder why their `catch` never
runs.

---

## Phase 4 — JWT management

This is the concept you specifically wanted to learn. Three sub-decisions.

### 4.1 — Where do I store the token?

| Option | Pros | Cons |
|--------|------|------|
| **`localStorage`** | Simple, survives page refresh | Readable by JS → vulnerable to XSS |
| **httpOnly cookie** | JS can't read it → XSS-safe | More setup, needs CSRF protection |
| **memory (variable)** | Most secure | Lost on refresh |

- **For learning → use `localStorage`.** It's what most tutorials use; great for
  understanding the flow.
- **Know the truth:** production apps often use **httpOnly cookies** because
  localStorage is vulnerable to XSS (injected JS can steal the token). Saying this
  in an interview shows maturity.

### 4.2 — The login flow (mental model)

```
User submits login form
  → POST /signin with { email, password }
  → API returns { token }
  → localStorage.setItem("token", token)
  → update auth state (Context)
  → redirect to /laptops
```

### 4.3 — Auto-attaching the token (with fetch, there are no interceptors)

axios has "interceptors" — functions that run automatically before every request
and after every response. **`fetch` has nothing like that.** So we recreate the same
behaviour *inside our wrapper* (`api/http.js` from Phase 3). Look back at it — two
lines do the work:

```js
// attach the JWT on the way OUT (axios calls this a "request interceptor")
...(token && { Authorization: `Bearer ${token}` }),

// handle expired token on the way BACK (axios calls this a "response interceptor")
if (res.status === 401) {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
```

**Why this is huge:** without the wrapper, you'd manually add the `Authorization`
header to every protected call. With it, you write it ONCE. Your `Laptops.jsx` just
calls `http("/api/laptops")` — no auth boilerplate anywhere.

> This is the frontend mirror of your backend middleware: the backend *reads*
> `Authorization: Bearer <token>`; this wrapper is what *sends* it.

**The 401 case — why it matters:** your JWT expires after 7 days. When it does, the
API returns `401`. Handling it in the wrapper means *any* 401 anywhere in the app
logs the user out cleanly, instead of every page breaking in its own way.

> 💡 You just hand-built what axios gives for free. That's the whole point of doing
> it with fetch first — when you switch to axios later, interceptors will make
> instant sense because you already wrote them yourself.

## How this connects to the JWT doc

Remember from the backend docs: a JWT is `header.payload.signature`, and the
payload is just Base64 (readable, not encrypted). After you log in:
- Open DevTools → Application → Local Storage → you'll see the token string.
- Paste it into https://jwt.io → you'll see your `userId` in the payload.
- That's the exact value your backend's `jwt.verify()` puts into `req.user`.

## Checklist before moving on

- [ ] `api/http.js` exports one `http()` wrapper using `VITE_API_URL`
- [ ] wrapper attaches `Authorization: Bearer <token>` when a token exists
- [ ] wrapper checks `res.ok` and throws on errors (fetch won't do this for you)
- [ ] wrapper logs out + redirects on `401`
- [ ] you can log in and SEE the token in localStorage (DevTools)
