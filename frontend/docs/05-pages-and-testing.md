# Phase 7 & 8 — Build the Pages + Test the Full Loop

## Phase 7 — Build the pages (simplest → hardest)

> With fetch you pass `method` and a JSON-stringified `body`. Your `http()` wrapper
> already sets the `Content-Type` and `Authorization` headers, so calls stay short.

### 1. Signup page
- A form: name, email, password.
- On submit → `http("/signup", { method: "POST", body: JSON.stringify({ name, email, password }) })`.
- On success → redirect to `/login`.

### 2. Login page
- A form: email, password.
- On submit → `http("/signin", { method: "POST", body: JSON.stringify({ email, password }) })`.
- On success → call `login(token)` from context, redirect to `/laptops`.

### 3. Laptops page (list + add + delete)
- On mount (`useEffect`) → `http("/api/laptops")` → store in state, render the list.
  (GET is the default method, so no options object needed.)
- An "add laptop" form → `http("/api/addlaptop", { method: "POST", body: JSON.stringify({...}) })` → re-fetch.
- A delete button per laptop → `http("/api/deletelaptop/" + id, { method: "DELETE" })` → re-fetch.

> Remember the API quirks: `addlaptop` wants `specs.Storage` (capital S);
> `updatelaptop` wants the body wrapped as `{ data: {...} }`.

### React concepts you'll practice here

- **`useState`** — form inputs, the laptops array.
- **`useEffect`** — fetch laptops when the page loads (run once on mount).
- **Controlled inputs** — React state is the single source of truth for form values.
- **Re-fetching after mutations** — after add/delete, re-fetch so the UI stays in
  sync with the database. (Later you'll learn optimistic updates / React Query.)

### Don't forget loading & error states

Every fetch has 3 states: loading, success, error. Show a spinner while loading and
a message on error. A blank screen during a slow request feels broken.

```jsx
// shape only
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
// setLoading(true) before the call, setLoading(false) in finally,
// setError(msg) in catch
```

---

## Phase 8 — Test the full loop

1. **Sign up** → check the user appears in mongosh (`db.users.find()`).
2. **Log in** → DevTools → Application → Local Storage → see your token.
3. **Decode it** → paste the token into https://jwt.io → see your `userId` payload.
4. **CRUD** → view laptops, add one, delete one. Confirm in mongosh.
5. **The key auth test** → log out (clear token), then visit `/laptops` directly →
   should redirect to `/login`.
6. **Inspect the Network tab** → click a protected request → look at request headers
   → you'll SEE `Authorization: Bearer ...` added automatically by your `http()`
   wrapper. That's the moment the whole concept clicks.

## When something breaks (it will)

| Symptom | Likely cause |
|---------|--------------|
| "blocked by CORS policy" | `cors()` not enabled on backend, or not before routes |
| `401` on every protected call | `http()` wrapper not attaching the token, or token missing |
| `catch` block never runs on a failed request | forgot to check `res.ok` — fetch doesn't throw on 400/500 |
| Logged out after refresh | auth state not initialized from localStorage |
| `req.body` undefined on backend | missing `express.json()` (you have it) / wrong Content-Type |
| Data saved but a field missing | schema typo, e.g. `storage` vs `Storage` |

Read the **exact** error in the browser console + Network tab before guessing.
The error almost always names the failing URL, status code, and reason.

## You're done when...

- [ ] Signup → Login → token in localStorage
- [ ] Laptops list loads with the token attached automatically
- [ ] Add + delete work and reflect in mongosh
- [ ] Logout + direct-visit `/laptops` redirects to login
- [ ] You can explain, out loud, the full path of one request from button click to
      database and back

## Where to go next (after this works)

- Edit/update laptop UI (PATCH with `{ data: {...} }`).
- Pagination UI using the `?page=&limit=` backend support.
- Replace manual re-fetching with **React Query** (caching, auto-refetch).
- A shared layout + navbar showing the logged-in user and a logout button.
- Deploy: frontend to Vercel/Netlify, backend to Render/Railway, switch
  `VITE_API_URL` to the live URL.
