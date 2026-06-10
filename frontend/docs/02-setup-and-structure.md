# Phase 1 & 2 — Scaffold + Folder Structure

## Phase 1 — Scaffold the React app (Vite)

From inside `Laptop_Inventory_app/`, scaffold Vite into the empty `frontend/` folder
using the React template, then install dependencies.

Steps:
1. Scaffold a React app with Vite into `frontend/`.
2. Install base dependencies.
3. Add one library you'll need:
   - **`react-router-dom`** — page navigation (login page, laptops page).
   - (No HTTP library — we're using the browser's built-in **`fetch`**.)
4. Run the dev server and confirm the default page loads at `http://localhost:5173`.

### Why fetch (for now)?

`fetch` is built into every browser — nothing to install. The tradeoff: it has
**no interceptors**, so the "attach the JWT to every request" logic isn't automatic.
We'll solve that by writing our own small **wrapper function** around fetch (see
`03-jwt-management.md`). Building that wrapper by hand is exactly what teaches you
*why* libraries like axios exist — you can switch to axios later and instantly
appreciate what it does for you.

### Why react-router-dom?

A real app has multiple pages (login, signup, laptops). React Router lets you map
URLs (`/login`, `/laptops`) to components, and is what makes **protected routes**
possible.

## Phase 2 — Industry-standard folder structure

Inside `frontend/src/`, organize by **responsibility** (not by dumping everything
into `App.jsx`):

```
src/
├── api/
│   └── http.js             → one fetch wrapper (adds baseURL, token header, 401 handling)
├── context/
│   └── AuthContext.jsx     → global auth state (token, user, login(), logout())
├── components/
│   └── ProtectedRoute.jsx  → guards pages that need login
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── Laptops.jsx         → list + add + delete
├── App.jsx                 → defines the routes
└── main.jsx                → wraps app in <AuthProvider> + <BrowserRouter>
```

### Why this structure?

- **`api/`** — all server communication config in one place. Change the URL once.
- **`context/`** — global state any component can read (is the user logged in?).
- **`components/`** — reusable building blocks (like the route guard).
- **`pages/`** — one file per screen.

Beginners put everything in `App.jsx`. Pros separate by responsibility so that when
the app grows, you always know where a thing lives. This is the single biggest
"looks professional" upgrade you can make.

## Environment variables (best practice from day one)

Don't hardcode the API URL. Create `frontend/.env`:
```
VITE_API_URL=http://localhost:3000
```
- Vite only exposes variables prefixed with **`VITE_`** to your code.
- Read it in code via `import.meta.env.VITE_API_URL`.
- Add `.env` to `.gitignore`.

**Why:** When you deploy, the API URL changes. With an env var you change one line
instead of hunting through files.

## Checklist before moving on

- [ ] Vite app runs at `localhost:5173`
- [ ] `react-router-dom` installed (no HTTP library — using built-in fetch)
- [ ] `src/` folders created (api, context, components, pages)
- [ ] `.env` has `VITE_API_URL` and `.env` is gitignored
