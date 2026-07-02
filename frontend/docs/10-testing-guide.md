# Phase 10 — Testing Guide (start here for tests)

> A reference + plan. Write the tests yourself; this explains the tools, the
> shape of a test, and what to test first.

## The tooling — clear up the confusion

You don't choose "Jest OR React Testing Library." They do different jobs:

| Tool | What it is | Used for |
|------|-----------|----------|
| **Vitest** (or Jest) | The test **runner** — gives you `describe`/`it`/`expect` | Runs ALL tests |
| **React Testing Library** | Renders + queries React components | Frontend component tests |
| **Supertest** | Fires HTTP requests at your Express app | Backend API tests |

You pick a **runner**, then add RTL (frontend) or Supertest (backend) on top.

**Our choice: Vitest** — because this app uses Vite, Vitest needs almost zero
config, its API is identical to Jest (so all Jest tutorials apply), and one tool
covers backend + frontend.

---

## Setup & Installation

### A) Backend setup (`Laptop_inventry_API/`)

**1. Install the dev dependencies:**
```bash
cd Laptop_inventry_API
npm i -D vitest supertest
```

**2. Add a test script** to `Laptop_inventry_API/package.json`:
```json
"scripts": {
  "test": "vitest"
}
```
(No `vitest.config.js` needed — Vitest defaults to the `node` environment, which is
exactly right for backend tests.)

**3. Refactor so the app is importable (the important step).** Right now your
`index.js` *creates* the app AND calls `app.listen()` in the same file. A test must
import the app **without** booting a real server. So split it in two:

```js
// app.js  — builds and EXPORTS the app (no listen, no DB connect)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/AuthRouter");
const laptopRoutes = require("./routes/LaptopRouter");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.get("/hello", (req, res) => res.json({ message: "hello world" }));
app.use("/", authRoutes);
app.use("/api", laptopRoutes);

module.exports = app;          // ← tests import THIS
```

```js
// index.js  — the real server: import app, connect DB, listen
const app = require("./app");
const { connectDB } = require("./config/dbConfig");

const PORT = process.env.PORT;
connectDB();
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
```

Now a test can `require("./app")` and hit routes with Supertest — no port opened.

**4. Test database — don't test against your real data.** Your tests will create
and delete records. Three options, easiest → cleanest:
- **Easiest:** point a separate `MONGO_TEST_URI` at a throwaway test database, and
  load it in test setup. Your dev data stays safe.
- **Cleaner (later):** `npm i -D mongodb-memory-server` — spins up a real in-memory
  Mongo per test run, wiped automatically. Zero risk, no shared state.
- **For pure-logic tests** (validation, no DB) you don't need a DB at all.

> Start by testing routes that *don't* write to the DB (e.g. `/signin` with a wrong
> password → 401, `GET /api/laptops` without a token → 401). Zero DB-cleanup hassle,
> and they cover your most important logic.

### B) Frontend setup (`frontend/`)

**1. Install:**
```bash
cd frontend
npm i -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**2. Add the test config** to your existing `vite.config.js` (Vitest reads it):
```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",        // a fake browser DOM to render into
    globals: true,               // use describe/it/expect without importing
    setupFiles: "./src/test/setup.js",
  },
});
```

**3. Create the setup file** `frontend/src/test/setup.js` — adds nice matchers like
`toBeInTheDocument()`:
```js
import "@testing-library/jest-dom";
```

**4. Add the script** to `frontend/package.json`:
```json
"scripts": {
  "test": "vitest"
}
```

### Running tests
```bash
npm test            # watch mode — re-runs on save
npm test -- run     # run once and exit (for CI)
```
Vitest auto-finds files named `*.test.js` / `*.test.jsx` (or in a `__tests__/`
folder). Put a backend test at `Laptop_inventry_API/tests/auth.test.js` and a
frontend one next to the component it tests.

---

## The anatomy of EVERY test — "AAA" (Arrange, Act, Assert)

```js
import { describe, it, expect } from "vitest";

describe("addNumbers", () => {          // a group of related tests
  it("adds two positive numbers", () => {  // one specific behavior
    // Arrange — set up inputs
    const a = 2, b = 3;
    // Act — run the thing
    const result = addNumbers(a, b);
    // Assert — check the outcome
    expect(result).toBe(5);
  });
});
```

Read a test as a sentence: *"it adds two positive numbers."* If you can't write
that sentence, you don't yet know what you're testing.

## What to test (and what NOT to)

**DO test:**
- **Logic with branches** — auth (right vs wrong password), validation, owner-scoping.
- **Pure functions** — your `calculateTotalBrands`, `calculateTotalValue` (perfect
  first targets: input array → expected number, no mocking needed).
- **Critical paths** — login works, a protected route 401s without a token.

**DON'T test:**
- Trivial code (a getter that returns a field).
- Implementation details (that a function called another function). Test *behavior*
  — what the user/caller observes — not *how* it's done.
- Third-party libraries (Express, Mongoose already have their own tests).

> Rule of thumb: test the things that, if they broke, would actually hurt. A typo in
> auth is a disaster; a typo in a label is not.

## Where to START — backend API tests (easiest, highest value)

Backend tests are the friendliest on-ramp: send a request, assert the response.
No DOM, no rendering. And they validate your most important code (auth, CRUD).

Install (you run these): `npm i -D vitest supertest`
Add to package.json scripts: `"test": "vitest"`

To make the app testable, your Express `app` needs to be **exported separately from
`app.listen()`** (so the test can import `app` without starting a real server).
Small refactor: put `app` in one file, the `.listen()` in another (or export `app`).

Shape of a backend test (Supertest):
```js
import request from "supertest";
import app from "../app";   // your exported express app

describe("POST /signin", () => {
  it("rejects a wrong password with 401", async () => {
    const res = await request(app)
      .post("/signin")
      .send({ email: "test@test.com", password: "WRONG" });

    expect(res.status).toBe(401);
  });
});
```

> First test to write: the **signin-wrong-password → 401** case. It directly proves
> the security bug you fixed long ago stays fixed forever. That's the whole point of
> tests — they're a tripwire so a future edit can't silently reintroduce a bug.

## Frontend component tests (do this second)

Install: `npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom`
(Set `environment: "jsdom"` in a `vitest.config.js` so there's a fake DOM to render into.)

Shape (React Testing Library):
```js
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

it("shows an error when email is invalid", async () => {
  render(<RegisterPage />);
  await userEvent.type(screen.getByLabelText(/email/i), "notanemail");
  await userEvent.click(screen.getByRole("button", { name: /register/i }));
  expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
});
```

RTL's philosophy: **query the screen the way a USER would** — by visible text, label,
role — not by class names or component internals. If a test breaks only because you
renamed a CSS class, the test was too coupled.

## The testing pyramid (how much of each)

```
        /\        few    E2E (whole app in a real browser — Playwright/Cypress)
       /  \
      /----\    some   Integration (API routes, multi-component flows)
     /      \
    /--------\  many   Unit (pure functions, single components)
```

Lots of cheap, fast unit tests at the bottom; a few slow end-to-end tests at the
top. Don't invert it.

## Suggested order for this project
1. **Backend unit/integration** (Vitest + Supertest): signin 401, signup validation,
   `GET /api/laptops` 401-without-token, owner-scoping on delete.
2. **Frontend pure functions** (Vitest): your stat calculators — easiest wins.
3. **Frontend components** (Vitest + RTL): the register validation, the login flow.

Start small — **one passing test** is a bigger milestone than it sounds. Green is green.
