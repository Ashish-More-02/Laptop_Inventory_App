# 💻 Laptop Inventory Management App

A full-stack web app to manage a laptop inventory — register an account, then add,
view, update, and delete laptops scoped securely to your own account. Built as a
hands-on, production-minded learning project (not a tutorial clone).

> **Status:** 🚧 In active development. Auth, landing page, and protected routing
> are done; the laptop dashboard (CRUD UI) is in progress.

---

## ✨ Features

- 🔐 **JWT authentication** — signup & login with hashed passwords (bcrypt)
- 🛡️ **Protected routes** — both on the API (middleware) and the frontend (route guard)
- 👤 **Owner-scoped data** — users can only see and modify laptops they created
- 📋 **Laptop CRUD** — create, read, update, delete laptops with specs (RAM, storage, price)
- 🎨 **Responsive UI** — custom-built with Tailwind (no UI kit), mobile-first
- ⚡ **React + Vite** frontend with client-side routing

---

## 🧰 Tech Stack

**Frontend:** React 19 · Vite · React Router · Tailwind CSS · react-icons
**Backend:** Node.js · Express · MongoDB · Mongoose · JWT · bcrypt
**Tooling:** ESLint

---

## 📁 Project Structure

```
Laptop_inventry_app/
├── Laptop_inventry_API/      # Express + MongoDB backend
│   ├── config/               # DB connection
│   ├── controllers/          # Auth + Laptop logic
│   ├── middleware/           # JWT verification
│   ├── models/               # Mongoose schemas (User, Laptop)
│   ├── routes/               # Auth + Laptop routers
│   └── index.js              # App entry
│
└── frontend/                 # React + Vite frontend
    ├── src/
    │   ├── api/              # fetch wrapper
    │   ├── components/       # Reusable UI (Homepage sections, cards)
    │   ├── pages/            # Route-level views (Login, Register, Dashboard)
    │   ├── utils/            # ProtectedRoute
    │   └── assets/           # Images
    └── docs/                 # Build roadmap & reference notes
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A MongoDB database (local or MongoDB Atlas)

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd Laptop_inventry_app
```

### 2. Backend setup
```bash
cd Laptop_inventry_API
npm install
```
Create a `.env` file in `Laptop_inventry_API/`:
```env
PORT=3000
DB_USER=your_mongodb_user
DB_PASSWORD=your_mongodb_password
JWT_SECRET=your_long_random_secret
```
Start the API:
```bash
npm start        # or: node index.js
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:3000
```
Start the dev server:
```bash
npm run dev
```
Open the printed local URL (usually http://localhost:5173).


---

## 📡 API Reference

Base URL: `http://localhost:3000`

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| `POST` | `/signup` | `{ name, email, password }` | Public | Register a new user |
| `POST` | `/signin` | `{ email, password }` | Public | Log in, returns a JWT |
| `GET` | `/api/laptops` | — | 🔒 Bearer | List your laptops |
| `POST` | `/api/addlaptop` | `{ name, brand, price, specs: { ram, Storage } }` | 🔒 Bearer | Add a laptop |
| `PATCH` | `/api/updatelaptop/:id` | `{ data: { ...fields } }` | 🔒 Bearer | Update a laptop |
| `DELETE` | `/api/deletelaptop/:id` | — | 🔒 Bearer | Delete a laptop |

Protected routes require a header: `Authorization: Bearer <token>`

---

## 🗺️ Roadmap

- [x] Auth (signup/signin, JWT, bcrypt)
- [x] Protected routes (API + frontend)
- [x] Landing page (responsive)
- [ ] Laptop dashboard with full CRUD UI
- [ ] Form validation (frontend + backend)
- [ ] Search, filter & pagination
- [ ] Loading / empty / error states
- [ ] Tests
- [ ] Deployment (live demo link)

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
