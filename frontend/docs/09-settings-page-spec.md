# Phase 9 — Settings Page Spec (basic, no dark mode 😄)

> A blueprint, not code. Build it yourself; this says *what* goes where and which
> parts need new backend routes. Keep it SCOPED — resist gold-plating.

## Layout — a single scrolling column of "section cards"

The modern settings pattern is simple: a vertical stack of cards, each card = one
concern, with a heading + its fields. Reuse your existing dark card style
(`bg-[#272727] border border-[#3d3d3d] rounded-4xl p-4`) and your input styles from
the forms. No new design language needed — consistency *is* the design.

```
Settings
 ┌─────────────────────────────────────────┐
 │ 👤 Profile                               │
 │   Name:  [ Ashish ........ ] [Save]      │
 │   Email: learn@... (read-only)           │
 ├─────────────────────────────────────────┤
 │ 🔒 Security                              │
 │   Change password → old + new [Update]   │
 ├─────────────────────────────────────────┤
 │ ⚙️ Preferences  (frontend-only)          │
 │   Rows per page:  [ 10 ▼ ]               │
 │   Currency:       [ $ ▼ ]                │
 ├─────────────────────────────────────────┤
 │ ⚠️ Danger Zone                           │
 │   [ Log out ]   [ Delete account ]       │
 └─────────────────────────────────────────┘
```

On mobile it just stacks (it already is a single column). Wrap it in the same
`overflow-y-auto` scroll container pattern you used for the table.

---

## Section 1 — Profile  (start here, easiest)

- Show **name** (editable) and **email** (read-only — email is the login identity,
  don't let it change casually).
- Where does the data come from? You already built a "who am I" endpoint
  (`/getuseremail` → ideally refactored to a protected `GET /me`). Read name+email
  from that, or from your `AuthContext` if you store the user there.
- **Editing name** → needs a small **new backend route**: `PATCH /me` (protected),
  reads `req.user.userId`, updates the name, returns the updated user. Mirror your
  laptop-update pattern.
- Reuse your `notify()` toast for the success/error message.

## Section 2 — Security: change password  (needs backend)

- Two fields: **current password** + **new password**.
- **New backend route** `PATCH /change-password` (protected):
  1. Find the user by `req.user.userId`.
  2. `bcrypt.compare(currentPassword, user.password)` — reject if wrong (401).
  3. Hash the new password, save it.
- This is great practice — it re-uses *everything* you learned in auth (bcrypt,
  compare, owner-scoping). Apply the same frontend validation regex you wrote for
  register.

## Section 3 — Preferences  (frontend-only, NO backend — do this second)

Pure client-side settings, stored in `localStorage` (or a small `SettingsContext`):

- **Rows per page** (10 / 25 / 50) — this directly feeds the **pagination** you're
  about to build. Nice tie-in: the setting here controls the page size there.
- **Currency symbol** ($ / ₹ / €) — replaces the hardcoded `$` in your table.

No server needed — read the value on load, write it on change. This is the *easy*
section and a good confidence win between the two backend ones.

## Section 4 — Danger Zone  (stretch / optional)

- **Log out** — you already have this (`AuthContext.logout()` + redirect). Just place
  it here too.
- **Delete account** — needs a **new backend route** `DELETE /me` (protected) that
  removes the user AND their laptops (owner-scoped cleanup). **Always confirm first**
  (reuse your `DeleteConfirmation` modal!). This one's advanced — save for last.

---

## What needs new backend work (so you can scope)

| Section | Backend route needed? |
|---------|----------------------|
| Profile (read) | No — reuse `/me` |
| Profile (edit name) | Yes — `PATCH /me` |
| Change password | Yes — `PATCH /change-password` |
| Preferences | **No** — frontend/localStorage only |
| Logout | No — already done |
| Delete account | Yes — `DELETE /me` |

## Suggested build order (smallest win first)
1. **Profile (read-only)** — just display name + email. Proves the data flow.
2. **Preferences** — rows-per-page + currency in localStorage. Frontend-only, fast win.
3. **Profile edit** — add the `PATCH /me` route + Save button.
4. **Change password** — the meatiest, reuses all your auth skills.
5. *(stretch)* **Delete account** with confirmation.

## Don't over-build
A basic settings page = Profile + Preferences + Change Password. That's plenty for a
portfolio. Skip avatars, 2FA, email verification, notification settings — those are
scope-creep for a learning project. Ship the basics, move to pagination.

## The 4 states (again — it matters)
The Profile section fetches data → handle **loading / error / success**. A settings
page that flashes empty inputs then pops in values looks broken. Show a subtle
loading state until the user data arrives.
