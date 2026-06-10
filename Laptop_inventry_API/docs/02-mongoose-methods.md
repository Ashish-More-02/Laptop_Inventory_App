# Mongoose Methods Cheat Sheet

> These ~12 methods cover ~90% of all API database logic.

## CREATE

```js
await Model.create({ name: "x", price: 10 });   // make one document
await Model.insertMany([ {...}, {...} ]);        // make many at once
```

## READ

```js
await Model.find();                       // ALL documents -> array
await Model.find({ brand: "Apple" });     // filtered -> array (always array, even if 0 or 1)
await Model.findOne({ email: "a@b.com" }); // first match -> single doc or null
await Model.findById(id);                  // by _id -> single doc or null
await Model.countDocuments({ ... });       // how many match -> number
```

> ⚠️ `find()` returns an **array** (`[]` when empty — which is *truthy*!).
> `findOne()` / `findById()` return a **doc or null** (null is falsy — safe to check with `if (!doc)`).

## UPDATE

```js
// by id only
await Model.findByIdAndUpdate(id, { price: 20 }, { new: true, runValidators: true });

// by id + extra conditions (e.g. ownership) -> use findOneAnd...
await Model.findOneAndUpdate(
  { _id: id, createdBy: userId },
  { price: 20 },
  { new: true, runValidators: true }
);

// update many at once
await Model.updateMany({ brand: "Apple" }, { onSale: true });
```

Important options:
- `{ new: true }` → return the **updated** doc (default returns the OLD one).
- `{ runValidators: true }` → re-check schema rules on update (default: OFF) eg(required fields , minimum number , enums, unique etc).

## DELETE

```js
await Model.findByIdAndDelete(id);                          // by id only
await Model.findOneAndDelete({ _id: id, createdBy: userId }); // by id + ownership
await Model.deleteMany({ brand: "Apple" });                // delete many
```

## The golden rule: ById vs One

| You have... | Use |
|-------------|-----|
| ONLY the id | `findById` / `findByIdAndUpdate` / `findByIdAndDelete` |
| id **+ another condition** (ownership!) | `findOne` / `findOneAndUpdate` / `findOneAndDelete` |

`findById...` **ignores** any extra filter fields you pass. For owner-scoped actions, always use the `findOne...` family.

## Query helpers (chain onto find)

```js
await Model.find({ ... })
  .sort({ price: -1 })   // -1 desc, 1 asc
  .limit(10)             // max results
  .skip(20)              // pagination offset
  .select("name price")  // only return these fields
  .populate("createdBy"); // replace ObjectId with the full referenced doc (Mongoose's "JOIN")
```

### sort() — works on ANY field type

`sort()` doesn't care if the field is a number, a date, or text. The direction is always the same: **`1` = ascending (A→Z, old→new, low→high)**, **`-1` = descending (Z→A, new→old, high→low)**. Mongoose just sorts by whatever that field's natural order is.

```js
// by number
.sort({ price: 1 })          // cheapest first
.sort({ price: -1 })         // most expensive first

// by DATE (e.g. createdAt from timestamps:true) — newest-first is the classic feed
.sort({ createdAt: -1 })     // newest first  (most common!)
.sort({ createdAt: 1 })      // oldest first

// ALPHABETICAL (string field) — same 1 / -1
.sort({ name: 1 })           // A → Z
.sort({ name: -1 })          // Z → A

// sort by MULTIPLE fields (tie-breaker): brand A→Z, then within each brand price high→low
.sort({ brand: 1, price: -1 })
```

> A `Date` is stored as a number under the hood, so "sort by date" is really just "sort by number". That's why the same `1`/`-1` works for everything.

### skip() + limit() — how pagination actually works

Your confusion is the key insight: **the API does NOT remember anything between calls.** Each request is independent (this is what "stateless" means). So the *client* must tell the server **which page it wants** every time, usually via a query param like `?page=2`.

- `limit(N)` = page size (how many per page)
- `skip(M)` = how many to jump over before starting

The magic formula: **`skip = (page - 1) * limit`**

```
limit = 10  (10 items per page)

page 1 → skip (1-1)*10 = 0   → items  1–10
page 2 → skip (2-1)*10 = 10  → items 11–20
page 3 → skip (3-1)*10 = 20  → items 21–30
```

So `skip(20)` alone isn't "the next 20" — it means "ignore the first 20, then give me the next `limit`". The client moving from page 2 → page 3 is what advances the window, by sending a bigger `page` number.

### Pagination in a real controller

```js
const getLaptops = async (req, res) => {
  // client sends ?page=2&limit=10  — default to page 1, 10 per page
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip  = (page - 1) * limit;        // the formula

  const laptops = await Laptop.find({ createdBy: req.user.userId })
    .sort({ createdAt: -1 })   // newest first
    .skip(skip)
    .limit(limit);

  // also tell the client how many pages exist (so the frontend can build page buttons)
  const total = await Laptop.countDocuments({ createdBy: req.user.userId });

  return res.status(200).json({
    data: laptops,
    page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
  });
};
```

Test it: `GET /api/laptops?page=1&limit=5`, then `?page=2&limit=5` — you'll see the next 5. The server gave different results only because the **client asked for a different page**, not because it "remembered" the last call.

> ⚠️ Order matters in the chain: Mongoose applies `sort` → `skip` → `limit`. Always `sort` before paginating, or "page 2" could contain items you already saw on page 1.

## Filter operators (go inside the query object)

```js
Model.find({ price: { $gte: 1000, $lte: 5000 } }); // range
Model.find({ brand: { $in: ["Apple", "Dell"] } }); // any of
Model.find({ name: { $regex: "pro", $options: "i" } }); // search, case-insensitive
Model.find({ stock: { $ne: 0 } });                  // not equal
```

| Operator | Meaning |
|----------|---------|
| `$gt` `$gte` | greater than (or equal) |
| `$lt` `$lte` | less than (or equal) |
| `$in` | value is in array |
| `$ne` | not equal |
| `$regex` | text search |

## populate() — the "JOIN" you asked about

```js
// schema must have: createdBy: { type: ObjectId, ref: "User" }
const laptops = await Laptop.find().populate("createdBy", "name email");
// each laptop.createdBy is now the full User doc (only name+email fields), not just an id
```

## Vocabulary

- **document** = a row in a table
- **collection** = a table
- **database** = a database
