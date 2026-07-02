# Phase 12 — API Pagination (backend + frontend)

> A guide, not copy-paste code. Explains the concept, the two industry approaches,
> how to build offset pagination for YOUR app, and the traps. You write the code.

## Why pagination exists

Right now `GET /api/laptops` returns **every** laptop at once. At 11 rows, fine. At
50,000 rows it's a disaster: huge/slow DB query, huge JSON payload, a browser trying
to render 50,000 table rows. **Every list endpoint in every real app is paginated** —
you return one *page* at a time (e.g. 10 rows), and the client asks for the next page
when needed.

## The two industry approaches (know both — interview gold)

### 1. Offset pagination  ← we build this
"Skip N rows, take the next M." Controlled by `?page=2&limit=10`.
- **Pros:** dead simple, lets you jump to any page ("go to page 5"), show total pages.
- **Cons:** gets **slow at huge offsets** (skipping 1,000,000 rows means the DB still
  walks past them). Rows shifting mid-scroll can cause duplicates/skips.
- **Used by:** admin tables, dashboards, anything with numbered page buttons.

### 2. Cursor pagination  ← know it exists, don't build it yet
"Give me the next 10 rows *after* this specific item (a cursor)." Controlled by
`?limit=10&after=<lastItemId>`.
- **Pros:** fast at any depth, stable during inserts. **Cons:** can't jump to page 5;
  no easy total-pages.
- **Used by:** infinite scroll (Instagram, Twitter, Slack message history).

> **The senior soundbite:** "I used offset pagination because the dashboard needs
> numbered pages; for an infinite-scroll feed I'd use cursor pagination to stay fast
> at depth." Saying that in an interview shows you understand the trade-off.

---

## Backend — offset pagination on `GET /api/laptops`

### Step 1: read + sanitize the query params
Query params arrive as **strings** and can be missing or garbage — always parse and
clamp them:
```js
const page  = Math.max(1, parseInt(req.query.page)  || 1);        // default 1, min 1
const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)); // default 10, cap 100
const skip  = (page - 1) * limit;
```
> **Why cap `limit`?** Without a max, a user could request `?limit=1000000` and DoS
> your DB. Never trust the client — cap it server-side.

### Step 2: query the page AND count the total
You need two things: the rows for this page, and the **total count** (so the client
knows how many pages exist). Keep your **owner-scoping** filter on BOTH:
```js
const filter = { createdBy: req.user.userId };   // ← keep this on both queries!

const laptopData = await Laptop.find(filter)
  .sort({ createdAt: -1 })   // stable order — pagination needs a consistent sort
  .skip(skip)
  .limit(limit);

const total = await Laptop.countDocuments(filter);
```
> **Critical:** the `filter` must be identical on `find` and `countDocuments`, or your
> total won't match the rows. And it must stay owner-scoped — pagination must never
> leak another user's data.

### Step 3: return the data + pagination metadata
The client can't build page controls without knowing where it is. Return a metadata
object:
```js
return res.status(200).json({
  laptopData,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  },
});
```
That `pagination` object is the contract your frontend will drive the buttons from.

---

## Frontend — wiring the table to pages

### State
```js
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
```

### Fetch the current page
Put `page` in the URL, and **refetch whenever `page` changes**:
```js
useEffect(() => {
  getLaptopData();
}, [page]);      // ← page in the dependency array (you know this lesson!)

// inside getLaptopData:
fetch(`http://localhost:3000/api/laptops?page=${page}&limit=10`, { ... })
// then: setLaptopData(data.laptopData); setTotalPages(data.pagination.totalPages);
```

### Page controls (below the table)
- **Prev** button → `setPage(p => p - 1)`, **disabled** when `page <= 1`.
- **Page indicator** → `Page {page} of {totalPages}`.
- **Next** button → `setPage(p => p + 1)`, **disabled** when `page >= totalPages`.

Disabling at the boundaries is what stops the user paging into empty/negative pages.

---

## ⚠️ The trap that will bite you: your stat cards break

Your dashboard stats are computed from the laptop array on the frontend:
```js
Total laptops = laptops.length          // now only counts the CURRENT PAGE (10)!
Total value   = laptops.reduce(...)      // now only sums the current page!
Brands        = new Set(...).size        // now only this page's brands!
```
Once you paginate, `laptops` only holds **one page**, so these go wrong. Two fixes:
1. **Easiest:** for "Total laptops", use `pagination.total` from the response (it's the
   real total). ✅
2. For **Total value** and **Brands**, you need numbers computed over ALL rows, not one
   page — so add a small **backend stats endpoint** (or a Mongo aggregation) that
   returns `{ totalValue, uniqueBrands }` across the user's whole collection.

> This is a great lesson in itself: **pagination has ripple effects on any "derived"
> data.** Anything you calculated from "the full list" must now come from the backend,
> because the frontend no longer *has* the full list.

---

## Search & sort — the same pattern (do after basic paging works)

They're just more query params:
- **Search:** `?search=apple` → backend adds to the filter:
  `if (search) filter.name = { $regex: search, $options: "i" }` (case-insensitive).
- **Sort:** `?sort=price&order=asc` → `.sort({ [sort]: order === "asc" ? 1 : -1 })`.

Combine all three and your table becomes a real data grid. Reset to `page = 1` whenever
the search term changes (or you might be on page 5 of a 1-page result).

---

## Gotchas checklist
- [ ] `parseInt` the query params — they're strings.
- [ ] Default `page=1`, `limit=10`; **cap `limit`** (e.g. 100) so no one abuses it.
- [ ] Same owner-scoped `filter` on `find` AND `countDocuments`.
- [ ] Always `.sort()` by something stable — without a consistent order, pages overlap.
- [ ] Disable Prev/Next at boundaries; don't let `page` go < 1 or > totalPages.
- [ ] Fix the stat cards (use `pagination.total` + a backend aggregate).
- [ ] Reset to page 1 when search/filter changes.

## Build order
1. Backend: add `page`/`limit` to `GET /api/laptops`, return `{ laptopData, pagination }`.
   **Test in Thunder/Postman** with `?page=1&limit=5` before touching the frontend.
2. Frontend: `page` state + refetch on change + Prev/Next controls.
3. Fix the stat cards (total from metadata; add a stats endpoint for value/brands).
4. Add search, then sort.
5. (Later, for the resume) read up on cursor pagination so you can explain the trade-off.

## Test it (ties into your testing phase!)
This is a perfect thing to write a test for later: `GET /api/laptops?page=1&limit=5`
returns at most 5 items and correct `totalPages`. Pagination logic (off-by-one on
`skip`, `totalPages` rounding) is exactly the kind of thing tests catch.
