# 🧪 Problem 1: Laptop Inventory API (CRUD + Auth + Ownership)

## 🎯 Goal

Build a backend where users can manage **their own laptops**

we can relate this to , if a user wants to have a VM similar to a laptop he can do that by creating laptops of his own. 
only after login in. 

---

## 🧱 Requirements

### 📦 Model: Laptop

```js
{
  brand: String,        // Apple, Dell
  model: String,        // MacBook M2
  price: Number,
  specs: {
    ram: Number,        // in GB
    storage: Number     // in GB
  },
  createdBy: ObjectId   // reference to User
}
```

---

## 🔐 Rules (IMPORTANT)

* Only **logged-in users** can create laptops
* Each laptop belongs to a user (`createdBy`)
* Users can:

  * ✅ Create laptops
  * ✅ View their laptops
  * ✅ Update their laptops
  * ❌ Cannot update others' laptops
  * ❌ Cannot delete others' laptops

---

## 🔌 API Requirements

### 1. Create laptop

```http
POST /api/laptops
```

* Protected route
* Attach `createdBy = req.user.userId`

---

### 2. Get all laptops (ONLY own)

```http
GET /api/laptops
```

👉 Return only laptops created by logged-in user

---

### 3. Get single laptop

```http
GET /api/laptops/:id
```

👉 Only allow if it belongs to user

---

### 4. Update laptop

```http
PUT /api/laptops/:id
```

👉 Check:

```js
if (laptop.createdBy.toString() !== req.user.userId)
```

---

### 5. Delete laptop

```http
DELETE /api/laptops/:id
```

---

## 🧠 What this tests

* JWT auth
* Middleware usage
* Ownership logic (VERY important in real apps)
* Mongo queries
* Route structure

---

## 🔥 Bonus (do this if you want growth)

* Add filtering:

```http
GET /api/laptops?brand=Apple&maxPrice=100000
```

---

---

# 🧪 Problem 2: “Idea Vault” (More Realistic + Interesting)

This is closer to startup-level backend logic.

---

## 🎯 Goal

Users can:

* Save ideas
* Mark them as public/private
* Like others’ public ideas

---

## 🧱 Model: Idea

```js
{
  title: String,
  description: String,
  isPublic: Boolean,
  likes: Number,
  likedBy: [ObjectId],   // users who liked
  createdBy: ObjectId
}
```

---

## 🔐 Rules

### Ownership

* Only owner can edit/delete

---

### Visibility

* Private ideas → only owner can see
* Public ideas → everyone can see

---

### Likes system

* A user can like an idea ONLY ONCE
* Cannot like own idea
* Can unlike

---

## 🔌 API Requirements

---

### 1. Create idea

```http
POST /api/ideas
```

* Protected
* Default: `isPublic = false`

---

### 2. Get my ideas

```http
GET /api/ideas/me
```

👉 Return all ideas (public + private)

---

### 3. Get public ideas

```http
GET /api/ideas/public
```

👉 No auth required

---

### 4. Update idea

```http
PUT /api/ideas/:id
```

👉 Only owner

---

### 5. Delete idea

```http
DELETE /api/ideas/:id
```

---

### 6. Like idea

```http
POST /api/ideas/:id/like
```

Logic:

```js
if (idea.likedBy.includes(req.user.userId)) {
  return error;
}
```

---

### 7. Unlike idea

```http
POST /api/ideas/:id/unlike
```

---

## 🧠 What this tests

* Complex logic
* Array updates in MongoDB
* Auth + authorization
* Edge cases
* Real-world thinking

---

# ⚠️ Constraints (IMPORTANT)

While solving:

* ❌ Don’t copy-paste blindly
* ❌ Don’t skip auth checks
* ❌ Don’t ignore edge cases

---

# 🧭 How to approach (this matters more than code)

For each API:

1. Who can access it?
2. What data is needed?
3. What validations are required?
4. What edge cases exist?

---

# 🧠 Example thinking (Problem 2)

For “like idea”:

* Is user logged in?
* Does idea exist?
* Is it public?
* Is user liking own idea?
* Already liked?

👉 This is **real backend thinking**

---

# 🚀 Final challenge (important)

Don’t just build — **test properly**

Use:

* Postman / Thunder Client

Test:

* invalid token
* missing fields
* wrong user
* duplicate like

---

# 🧭 If you want next level after this

Once you finish these, I’ll push you to:

* Pagination + search
* Rate limiting
* Refresh tokens
* Scalable architecture

---

If you get stuck anywhere, don’t jump to solution immediately.

Come and ask:
👉 “I’m stuck here, this is my thinking”

That’s how you actually level up.
