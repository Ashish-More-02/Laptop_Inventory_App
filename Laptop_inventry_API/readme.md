# Backend : Laptop Inventory API (CRUD + Auth + Ownership)

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


