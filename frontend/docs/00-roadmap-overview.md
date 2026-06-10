# Frontend Roadmap — Overview

Goal: build a minimal React frontend for the Laptop Inventory API and learn
**how to integrate a frontend with a JWT-protected backend**.

## The phases (build in this order)

| Phase | What | Doc |
|-------|------|-----|
| 0 | Prep the backend (CORS + fix password bug) | `01-backend-prep.md` |
| 1 | Scaffold the React app (Vite) | `02-setup-and-structure.md` |
| 2 | Industry-standard folder structure | `02-setup-and-structure.md` |
| 3 | The API layer (one fetch wrapper) | `03-jwt-management.md` |
| 4 | JWT management (storage + interceptors) | `03-jwt-management.md` |
| 5 | Global auth state (Context) | `04-auth-state-and-routes.md` |
| 6 | Protected routes | `04-auth-state-and-routes.md` |
| 7 | Build the pages | `05-pages-and-testing.md` |
| 8 | Test the full loop | `05-pages-and-testing.md` |

## Your immediate next 3 steps

1. **Backend:** install `cors`, enable it, fix the signin password check.
2. **Frontend:** scaffold Vite, install `react-router-dom` (we use built-in `fetch`),
   confirm it runs.
3. **First integration:** build *just* the Login page + the `http()` fetch wrapper,
   log in, confirm the token lands in `localStorage`.

> Get the token into localStorage first. Once you SEE it there, everything else is
> just repeating the same pattern.

## Industry best-practices checklist (hold yourself to these)

- [ ] **Env variables** — API URL in `.env` as `VITE_API_URL`, not hardcoded.
- [ ] **One API wrapper** — never scatter raw `fetch("http://localhost:3000...")` everywhere; call your `http()` helper.
- [ ] **Loading & error states** — every fetch shows a spinner while loading, a message on error.
- [ ] **Never trust the client** — frontend validation is for UX; the backend is the real guard.
- [ ] **Mind localStorage's XSS tradeoff** — don't store more than the token there.
- [ ] **Clean separation** — API / state / UI in different files.
- [ ] **`.gitignore`** — never commit `node_modules` or `.env`.

## The API contract (what you're integrating against)

Backend runs on `http://localhost:3000`.

| Route | Body | Returns | Auth? |
|-------|------|---------|-------|
| `POST /signup` | `{name,email,password}` | `{message, user}` | public |
| `POST /signin` | `{email,password}` | `{token}` | public |
| `GET /api/laptops` | — | `{laptopData:[...]}` | 🔒 |
| `POST /api/addlaptop` | `{name,brand,price,specs:{ram,Storage}}` | `{message, laptopData}` | 🔒 |
| `DELETE /api/deletelaptop/:id` | — | `{message, data}` | 🔒 |
| `PATCH /api/updatelaptop/:id` | `{data:{...}}` | `{message, data}` | 🔒 |

> ⚠️ Note the quirks: `addlaptop` expects `specs.Storage` with a **capital S**,
> and `updatelaptop` expects the fields wrapped in a `data` object: `{ data: {...} }`.
