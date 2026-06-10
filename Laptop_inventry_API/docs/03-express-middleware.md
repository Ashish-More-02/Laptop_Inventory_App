# Express Middleware Cheat Sheet

## What middleware IS

A function that runs **between** the request arriving and your controller responding.
It gets `(req, res, next)`. It can:
- inspect/modify `req` or `res`
- end the request (send a response), OR
- call `next()` to pass control to the next function

```js
const myMiddleware = (req, res, next) => {
  // ...do something...
  next();           // continue to next middleware/controller
  // OR: res.status(401).json({ error: "blocked" });  // stop here
};
```

> ⚠️ Either call `next()` OR send a response — never both, never neither.
> Neither = request hangs forever. Both = "Cannot set headers after they are sent" crash.

## Order matters

Middleware runs **top to bottom** in the order you register it. `express.json()` must come BEFORE routes that read `req.body`.

```js
app.use(express.json());        // 1. parse JSON bodies
app.use("/api", protectedRoutes); // 2. then routes
app.use(errorHandler);          // 3. error handler LAST
```

## The built-in / library middleware you'll use constantly

```js
app.use(express.json());                 // parse JSON request bodies -> req.body
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(cors());                         // allow browser frontends (npm i cors)
app.use(helmet());                       // security headers (npm i helmet)
app.use(morgan("dev"));                  // log each request (npm i morgan)
```

## Background: what a JWT actually is (so the auth code makes sense)

A JWT (JSON Web Token) is just **a long string with 3 parts joined by dots**:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 . eyJ1c2VySWQiOiI2YTFkLi4uIiwicm9sZSI6InVzZXIifQ . SflKxwRJSMeKKF2QT4f...
└───────── HEADER ─────────┘   └────────── PAYLOAD ──────────┘   └──────── SIGNATURE ───────┘
```

| Part | Contains | Purpose |
|------|----------|---------|
| **Header** | algorithm + type (`{ "alg": "HS256", "typ": "JWT" }`) | how it was signed |
| **Payload** | YOUR data — whatever you put in `jwt.sign(...)` | the actual info (userId, role...) |
| **Signature** | header+payload hashed with your `JWT_SECRET` | proves nobody tampered with it |

Each part is **Base64-encoded, NOT encrypted** — anyone can decode the payload (paste a token into [jwt.io](https://jwt.io) to see it). So **never put passwords or secrets in a JWT.** The signature is what makes it trustworthy: only your server knows `JWT_SECRET`, so only your server can produce a valid signature. If someone edits the payload, the signature no longer matches and `jwt.verify()` throws.

### How the token is created (in your signin controller)

```js
const token = jwt.sign(
  { userId: user._id, role: user.role },  // ← THE PAYLOAD: you choose what goes in
  process.env.JWT_SECRET,                  // ← the secret used to sign
  { expiresIn: "7d" }                      // ← jwt adds this as an expiry timestamp
);
// send this string to the client; they store it and send it back in the Authorization header
```

Whatever object you pass as the first argument **becomes the payload** — that's exactly what `jwt.verify()` gives back later. So if you sign `{ userId, role }`, then `req.user` will have `userId` and `role`. Put in only what you sign, nothing more.

## How the client sends it back

The client puts the token in the `Authorization` header, prefixed with `Bearer `:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQ...
```

That's why the auth middleware does `.split(" ")[1]` — it splits `"Bearer <token>"` on the space and takes index `1` (the token itself, dropping the word "Bearer").

## The 3 middleware patterns you'll write yourself

### 1. Auth check (you already built this)
```js
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "no token" });
  try {
    // verify() checks the signature + expiry, then RETURNS the decoded payload.
    req.user = jwt.verify(token, process.env.JWT_SECRET); // attach payload to req
    next();
  } catch {
    return res.status(401).json({ error: "bad token" });
  }
};
```

**What `req.user` now contains** = exactly the payload you signed (plus two timestamps jwt adds automatically):

```js
req.user = {
  userId: "6a1dc6b21b0a95ad96be777d",  // what you put in jwt.sign()
  role:   "user",                       // what you put in jwt.sign()
  iat:    1717400000,                   // "issued at"  (auto-added by jwt)
  exp:    1718004800,                   // "expires at" (auto-added because of expiresIn)
};
```

So in any later middleware or controller you can read `req.user.userId` and `req.user.role`. (Your token currently only signs `userId` — to use roles, add `role: user.role` to the `jwt.sign()` payload in signin.)

### 2. Role / permission check (runs AFTER auth)
```js
const requireAdmin = (req, res, next) => {
  // works ONLY because the auth middleware already set req.user from the token payload
  if (req.user.role !== "admin")          // req.user.role === "user" | "admin"
    return res.status(403).json({ error: "admins only" });
  next();
};
// usage: router.delete("/users/:id", auth, requireAdmin, deleteUser);
//        run auth FIRST (sets req.user), THEN requireAdmin can read req.user.role
```

### 3. Centralized error handler (special — has 4 args)
```js
// MUST be registered LAST, after all routes. The 4 args is what makes it an error handler.
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
};
app.use(errorHandler);
```
This lets you `throw` in controllers instead of repeating try/catch everywhere
(pair it with a small async-wrapper or `express-async-errors`).

## Where to apply middleware (3 scopes)

The question is really: **"how many routes should this middleware guard?"** You have 3 levels of reach. Think of it like security at a building:

```js
app.use(mw);                          // GLOBAL: every request
router.use(auth);                     // GROUP: every route in this router
router.post("/x", auth, controller);  // SINGLE route (one or many, comma-separated)
```

### 1. GLOBAL — `app.use(mw)` → runs on EVERY request
*Like the front door of the building: everyone who enters passes through it.*

Put things here that EVERY request needs, no matter what. Register these in `index.js` **before** your routes.

```js
app.use(express.json());   // every request: parse JSON body
app.use(cors());           // every request: allow browser frontends
app.use(morgan("dev"));    // every request: log it
```

### 2. GROUP — `router.use(mw)` → runs on every route in THAT router file
*Like a keycard for one floor: everyone on that floor needs it, but it doesn't affect other floors.*

This is **exactly what you did** in `LaptopRouter.js`:

```js
router.use(checkJWTtoken);          // ← every laptop route below is now protected
router.get("/laptops", getAllLaptops);
router.post("/addlaptop", addLaptop);
router.delete("/deletelaptop/:id", deleteLaptop);
```

One line guards all laptop routes. But your `AuthRouter.js` (signup/signin) has NO `router.use(auth)` — because those routes must be **public** (a user can't have a token before they log in!). That's the whole point of group scope: laptop routes = locked, auth routes = open.

### 3. SINGLE ROUTE — list middleware before the controller → runs only on that ONE route
*Like a key to a single locked room on the floor.*

Middleware runs **left to right**. List as many as you want, comma-separated:

```js
//            ┌── runs 1st ──┐ ┌─ runs 2nd ─┐ ┌── runs last ──┐
router.delete("/users/:id",   auth,           requireAdmin,    deleteUser);
//            auth sets req.user → requireAdmin checks req.user.role → controller
```

Here, every other route stays normal, but THIS delete route additionally requires admin rights. Order matters: `auth` must come before `requireAdmin`, because `requireAdmin` reads the `req.user` that `auth` sets.

### How to choose

| Ask yourself... | Use |
|-----------------|-----|
| Does EVERY route in the whole app need it? (json parsing, cors, logging) | **GLOBAL** `app.use` |
| Does every route in ONE file need it? (all laptop routes need login) | **GROUP** `router.use` |
| Does just ONE route need extra protection? (only admin can delete) | **SINGLE** in the route line |

> Reminder: scope is just *reach*. The middleware function itself is identical — you're only deciding how many routes it sits in front of. And whatever the scope, order is still top-to-bottom / left-to-right.

## req — where data comes from (memorize this table)

| Source | What it is | Example |
|--------|-----------|---------|
| `req.body` | JSON the client sent | POST/PATCH payloads |
| `req.params` | values in the path `/:id` | `/laptops/123` → `req.params.id` |
| `req.query` | after the `?` | `/laptops?brand=Apple` → `req.query.brand` |
| `req.headers` | request headers | `req.headers.authorization` |
| `req.user` | **whatever your auth middleware attached** | `req.user.userId` |
