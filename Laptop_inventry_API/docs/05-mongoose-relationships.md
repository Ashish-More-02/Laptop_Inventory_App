# Relationships Between Collections (MongoDB + Mongoose)

> How to connect data across collections — MongoDB's version of SQL "foreign keys" and "JOINs".

## The core idea

MongoDB has no built-in foreign keys. Instead, you **store one document's `_id` inside another document**. That stored id is a *reference* — a pointer that says "the full data lives over there".

```
users collection                 laptops collection
┌─────────────────────────┐      ┌──────────────────────────────────┐
│ _id: 6a1d...777d         │◄─────│ _id: 90ff...                     │
│ name: "Ashish"          │      │ name: "MacBook Pro"              │
│ email: "a@b.com"        │      │ createdBy: 6a1d...777d  ← pointer│
└─────────────────────────┘      └──────────────────────────────────┘
```

The laptop doesn't copy the user's name/email. It just remembers the user's `_id`.
Think: a book record stores a borrower's *card number*, not the borrower's whole profile.

---

## Step 1: Declare the reference in the schema

Use `ObjectId` for the type and `ref` to name the model it points to.

```js
const laptopSchema = new Schema({
  name: String,
  createdBy: {
    type: Schema.Types.ObjectId,  // stores an _id
    ref: "User",                  // ...which lives in the User model
  },
});
```

`ref: "User"` is the crucial bit — it's how Mongoose knows *which collection* to look in later. Without it, Mongoose sees an id but has no idea what it points to.

## Step 2: Save the reference

Just store the id (you usually get it from `req.user` after auth):

```js
await Laptop.create({
  name: "MacBook Pro",
  createdBy: req.user.userId,   // an ObjectId
});
```

## Step 3: Read it back with `.populate()` — the "JOIN"

A plain query gives you only the id:

```js
const laptop = await Laptop.findById(id);
// { name: "MacBook Pro", createdBy: "6a1d...777d" }   ← just an id
```

- `.populate()` tells Mongoose: "follow that id and swap in the full document":
- populate gives us the full object in place of the "reference that points other table(collection)"

```js
const laptop = await Laptop.findById(id).populate("createdBy");
// {
//   name: "MacBook Pro",
//   createdBy: { _id: "6a1d...777d", name: "Ashish", email: "a@b.com" }  ← full user!
// }
```

Limit which fields come back (good practice — never leak password hashes):

```js
.populate("createdBy", "name email")   // only these two fields
```

> This is exactly what you did manually with `User.findOne(...)`. `populate()` does it in one line, no extra query in your code.

---

## The 3 relationship types you'll meet

### 1. One-to-One (a user has one profile)

Store the id on whichever side you query most.

```js
const userSchema = new Schema({
  name: String,
  profile: { type: Schema.Types.ObjectId, ref: "Profile" },
});
```

### 2. One-to-Many (a user has many laptops)

This is the most common. **Put the reference on the "many" side** (each laptop points to its one owner) — this is what you already built.

```js
const laptopSchema = new Schema({
  name: String,
  createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // each laptop -> one user
});

// "give me all laptops belonging to this user"
const laptops = await Laptop.find({ createdBy: userId });
```

Why not store an array of laptop ids on the user? You *can*, but the array grows forever and is harder to manage. **Rule: the child points to the parent.**

### 3. Many-to-Many (a student has many courses, a course has many students)

Store an array of ids on one (or both) sides.

```js
const studentSchema = new Schema({
  name: String,
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }], // array of refs
});

const student = await Student.findById(id).populate("courses");
// student.courses is now an array of full course documents
```

---

## There are 2 ways to connect the tables : Referencing vs Embedding (the key design decision)

Two ways to model related data. Choose per use-case.

### Referencing (what we did above) — store an id, populate later
```js
// laptop holds: createdBy: <userId>
```
- ✅ Use when the related data is large, shared, or changes independently (users, products).
- ✅ No duplication — update the user once, everyone sees it.
- ❌ Needs an extra lookup (`populate`) to get the full data.

### Embedding — nest the data directly inside the document
```js
const orderSchema = new Schema({
  items: [{ name: String, price: Number, qty: Number }], // embedded, no ref
  shippingAddress: { street: String, city: String },     // embedded object
});
```
- ✅ Use when the data is small, owned by one parent, and read together (order line-items, an address).
- ✅ One query gets everything — fast, no populate.
- ❌ Duplicated if shared; awkward if it grows huge.

### Quick rule of thumb
| Question | Lean toward |
|----------|-------------|
| Is the data shared by many parents? | **Reference** |
| Does it change on its own / need its own queries? | **Reference** |
| Is it small and always read with the parent? | **Embed** |
| "Contains" relationship (order *contains* items)? | **Embed** |
| "Belongs to / created by" relationship? | **Reference** |

---

## Populate on many documents at once

```js
// every laptop gets its owner filled in
const laptops = await Laptop.find().populate("createdBy", "name email");
```

## Nested / multi-level populate

```js
// laptop -> createdBy (user) -> and that user's company
await Laptop.find().populate({
  path: "createdBy",
  populate: { path: "company", select: "name" },
});
```

---

## Common mistakes

- ❌ Forgetting `ref` → `.populate()` does nothing / errors.
- ❌ Storing the name/email instead of the id → data goes stale when the user updates their profile. Store the **id**, populate for fresh data.
- ❌ `ref` string must match the model name exactly: `model("User", ...)` → `ref: "User"` (case-sensitive).
- ❌ Over-populating — only pull the fields you need with the second arg (`"name email"`), never expose `password`.

---

## TL;DR

1. Type = `Schema.Types.ObjectId`, add `ref: "ModelName"`.
2. Save the related document's `_id`.
3. `.populate("fieldName")` to swap the id for the full document when reading.
4. **Reference** big/shared/independent data; **embed** small/owned/read-together data.
