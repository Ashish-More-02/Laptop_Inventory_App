# REST API Cheat Sheet

## HTTP verbs → what they mean

| Verb | Purpose | Example route | Reads from |
|------|---------|---------------|------------|
| GET | read data | `GET /laptops`, `GET /laptops/:id` | `req.query`, `req.params` |
| POST | create new | `POST /laptops` | `req.body` |
| PATCH | update part | `PATCH /laptops/:id` | `req.body` + `req.params` |
| PUT | replace whole | `PUT /laptops/:id` | `req.body` + `req.params` |
| DELETE | remove | `DELETE /laptops/:id` | `req.params` |

## Route naming conventions

- Use **plural nouns**: `/laptops`, not `/getLaptop`.
- The **id goes in the path**, not the query: `/laptops/123`  ✅  not `/laptops?id=123`.
- Query params are for **filtering/sorting/paging**: `/laptops?brand=Apple&sort=price&page=2`.
- Nest related resources: `/users/123/laptops`.

## Status codes worth knowing

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | successful GET / PATCH / DELETE |
| 201 | Created | successful POST |
| 204 | No Content | success, nothing to return |
| 400 | Bad Request | client sent invalid data |
| 401 | Unauthorized | not logged in / bad token |
| 403 | Forbidden | logged in but not allowed |
| 404 | Not Found | resource doesn't exist |
| 409 | Conflict | duplicate (e.g. email taken) |
| 422 | Unprocessable | validation failed |
| 500 | Server Error | YOUR code broke |

Rule of thumb: 4xx = client's fault, 5xx = your fault.

## The standard controller skeleton (copy this shape)

```js
const createThing = async (req, res, next) => {
  try {
    const { a, b } = req.body;              // 1. get input
    if (!a || !b)                           // 2. validate
      return res.status(400).json({ error: "missing fields" });

    const thing = await Thing.create({       // 3. do the DB work
      a, b, createdBy: req.user.userId,      //    scope to the owner
    });

    return res.status(201).json({ data: thing }); // 4. respond
  } catch (err) {
    next(err);                              // 5. forward to error handler
  }
};
```

## Owner-scoping (the #1 security habit)

Every update/delete on a user-owned resource must check ownership:

```js
await Thing.findOneAndDelete({ _id: req.params.id, createdBy: req.user.userId });
```
Returns `null` if it's not theirs → respond 404. Never let a user mutate another user's data by id alone.

## Consistent response shape

Pick one and stick to it across the whole API:
```js
// success
{ "data": { ... } }
// error
{ "error": "human readable message" }
```

## The mental pipeline of one request

```
Client
  → express.json()        (parse body)
  → auth middleware       (verify token, set req.user)
  → role middleware       (optional permission check)
  → controller            (validate → DB → respond)
  → error handler         (if anything threw)
Client gets response
```
