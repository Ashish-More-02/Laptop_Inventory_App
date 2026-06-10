# Mongoose Schema & Model Basics

> Covers ~90% of schemas you'll ever write.

## The 3 steps (always the same)

```js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// 1. Define the shape (the blueprint / rulebook)
const userSchema = new Schema({ /* fields */ }, { timestamps: true });

// 2. Compile it into a Model (the worker that talks to MongoDB)
const User = model("User", userSchema);

// 3. Export it
module.exports = User;
```

- **Schema** = rules for what a document looks like.
- **Model** = the thing you call `.find()`, `.create()` on.
- The string `"User"` → Mongoose makes a collection called **`users`** (lowercased + pluralized).

## Field definitions

```js
const productSchema = new Schema({
  // shorthand: just the type
  name: String,

  // full form: type + rules
  email: {
    type: String,
    required: true,      // must be provided
    unique: true,        // no duplicates (creates a DB index)
    lowercase: true,     // auto-transform before saving
    trim: true,          // strip whitespace
  },

  price: {
    type: Number,
    required: true,
    min: 0,              // validation
    max: 1000000,
    default: 0,          // used if not provided
  },

  inStock: { type: Boolean, default: true },

  role: {
    type: String,
    enum: ["user", "admin"],   // only these values allowed
    default: "user",
  },

  // nested object
  specs: {
    ram: Number,
    storage: Number,
  },

  // array of primitives
  tags: [String],

  // RELATIONSHIP: store another document's _id (like a SQL foreign key)
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",         // tells populate() which model to look up
  },

  // array of relationships
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],

  createdAt: { type: Date, default: Date.now },
});
```

## The field types you'll actually use

`String` · `Number` · `Boolean` · `Date` · `Schema.Types.ObjectId` · arrays `[Type]` · nested objects `{}`

## `timestamps: true` (use it almost always)

```js
new Schema({ ... }, { timestamps: true });
```
Auto-adds and maintains `createdAt` and `updatedAt`. Free. Always turn it on.

## The 4 validation rules you'll reach for most

| Rule | Meaning |
|------|---------|
| `required: true` | field must exist |
| `unique: true` | no two docs share this value |
| `enum: [...]` | value must be one of the list |
| `default: x` | fallback when not provided |

## Gotcha to remember

- Schemas are **strict by default**: any field you send that's NOT in the schema is **silently dropped**. (This is why a typo like `storage` vs `Storage` makes data vanish.)
- `unique: true` is an **index**, not a validator — duplicate inserts throw a DB error (code `11000`), not a normal validation error.
