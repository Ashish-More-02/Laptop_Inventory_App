# Phase 6 — Landing Page (Homepage) Spec

> A blueprint, not code. Build each section yourself; this tells you *what* goes
> where and *why*. Copy text is a starting point — reword it in your own voice.

## The product in one line (write this down first)

> **"Laptop Inventory Management — track every laptop your business owns in one
> place: stock, specs, prices, and who has what."**

Every section should support that promise. A landing page has ONE job: get a
visitor to **sign up / log in**. Every section is a nudge toward that button.

---

## Section order (top → bottom)

```
1. Navbar            (sticky top)
2. Hero              (the headline + main CTA + image)
3. Stats / trust bar (small, optional)
4. Features          (3–6 cards: icon + title + text)
5. How it works      (3 steps)
6. Product preview   (a screenshot/mockup of the dashboard)
7. Final CTA band    (one last "Get started")
8. Footer            (links + copyright)
```

You don't need all 8 for v1. **Minimum viable landing = Navbar + Hero + Features
+ Footer.** Add the rest once those look good.

---

## 1. Navbar (sticky)

- **Left:** logo — reuse your `<MdLaptop />` icon + "Laptop Inventory" text.
- **Center (optional):** anchor links — `Features`, `How it works` (scroll to those sections with `href="#features"`).
- **Right:** `Login` (text link → `/login`) + `Register` (filled button → `/register`).
- **Layout hint:** `flex items-center justify-between`, `sticky top-0`, a subtle bottom border like your forms (`border-[#333333]`), maybe a slight backdrop blur.

## 2. Hero (the most important section)

The first screen. Visitor decides in ~3 seconds whether to stay.

- **Headline (big, bold):** *"Stop losing track of your laptops."* or *"Every laptop your business owns — in one dashboard."*
- **Subheadline (1–2 lines, grey text):** *"Add, search, and manage your entire laptop inventory — brand, specs, price, and stock — without spreadsheets."*
- **Primary CTA button:** `Get started free` → `/register`
- **Secondary CTA (text/outline):** `Login` → `/login`
- **Image:** `src/assets/hero-laptops.jpg` (or the dashboard preview) on the right, or full-width below the text.
- **Layout hint:** two-column on desktop (`grid md:grid-cols-2`), text left + image right; stacks to one column on mobile.

## 3. Stats / trust bar (optional, small)

A thin strip with 3–4 numbers to build credibility (use believable demo numbers):

- `500+ laptops tracked`  ·  `99.9% uptime`  ·  `Setup in 2 minutes`
- **Layout hint:** `flex justify-around`, big bold number + small grey label under each.

## 4. Features (the "why use this" section)

3–6 cards. Each card = **one react-icon + a short title + 1–2 line description.**
Pull features straight from what your app actually does:

| Icon (react-icons) | Title | Description |
|---|---|---|
| `MdInventory` / `MdLaptop` | Full inventory at a glance | See every laptop with brand, specs and price in one list. |
| `MdAddCircleOutline` | Add in seconds | Register a new laptop with name, brand, price and specs. |
| `MdSearch` | Search & filter | Find any device fast (add this to your app later 😉). |
| `MdSecurity` | Secure & private | JWT-protected — only you can see and edit your inventory. |
| `MdEdit` | Edit & update | Update prices or specs anytime; changes save instantly. |
| `MdDelete` | Clean up easily | Remove laptops you no longer own, owner-scoped & safe. |

- **Layout hint:** `grid md:grid-cols-3 gap-6`. Each card: same dark panel style as
  your forms (`bg-[#1b1c1c] border border-[#333333] rounded-2xl p-6`), icon in a
  colored circle on top.
- Browse icons at https://react-icons.github.io/react-icons/ — search "laptop",
  "inventory", "search", "lock".

## 5. How it works (3 steps)

A simple numbered flow — reduces "is this hard to use?" anxiety.

1. **Create your account** — sign up in seconds.
2. **Add your laptops** — enter brand, specs and price.
3. **Manage everything** — search, edit, and track from one dashboard.

- **Layout hint:** 3 columns, each with a big number (1/2/3) in a circle, title, one line.

## 6. Product preview

Show, don't just tell. A framed image of the dashboard.

- Use `src/assets/dashboard-preview.jpg` for now; replace with a **real screenshot
  of your `/dashboard`** once you build the laptop list (much more convincing).
- **Layout hint:** centered, `rounded-2xl border border-[#333333] shadow-2xl`,
  maybe a short heading above it: *"Your whole inventory, one screen."*

## 7. Final CTA band

One last push right before the footer.

- **Heading:** *"Ready to organize your laptop inventory?"*
- **Button:** `Create your free account` → `/register`
- **Layout hint:** full-width strip, centered text + button, slightly different bg
  to stand out.

## 8. Footer

- Left: logo + one-line tagline + tiny copyright (`© 2026 Laptop Inventory`).
- Columns of links (can be dummy `#` for now): `Product` (Features, Login, Register),
  `Resources` (Docs, GitHub), `Legal` (Privacy, Terms).
- Social icons via react-icons (`FaGithub`, `FaLinkedin`, `FaXTwitter`).
- **Layout hint:** `grid md:grid-cols-4`, top border, muted grey text.

---

## Images & icons — where things come from

**Already downloaded** (in `src/assets/`, free placeholders — swap later):
- `hero-laptops.jpg` — hero
- `dashboard-preview.jpg` — product preview (replace with a real screenshot ASAP)
- `inventory-shelf.jpg` — spare, use anywhere

**Icons:** use **react-icons** (already installed) for ALL feature/footer icons —
no image files needed. This is the pro move: crisp at any size, recolorable with
`className`, zero extra downloads.

**For production-quality images later (free, no attribution headaches):**
- Photos: https://unsplash.com  /  https://pexels.com — search "laptop", "office desk", "computer store"
- Illustrations (great for SaaS, recolorable SVGs): https://undraw.co
- Placeholders on the fly: https://picsum.photos or https://loremflickr.com

> Import images in React like: `import hero from "../assets/hero-laptops.jpg"` then
> `<img src={hero} />`. (Don't hardcode `/src/assets/...` paths — let Vite bundle them.)

---

## Build order (so you're never overwhelmed)

1. Navbar
2. Hero (text + image + CTAs)
3. Features grid
4. Footer
5. → looks good? Add Stats, How-it-works, Preview, Final CTA.

## Checklist
- [x] Navbar links to `/login` and `/register`
- [x] Hero headline + subline + primary CTA visible without scrolling
- [x] Status/trust bar 3–4 numbers to build credibility
- [x] Features pulled from real app capabilities, react-icons used
- [x] Images imported (not hardcoded paths), `alt` text on every `<img>`
- [x] Footer
- [x] Looks OK on mobile (stacks to one column) — test with DevTools device toolbar
- [x] Footer with copyright + links
```
