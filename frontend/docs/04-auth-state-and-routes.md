# Phase 5 & 6 — Global Auth State + Protected Routes

## Phase 5 — Global auth state (`context/AuthContext.jsx`)

Use React's **Context API** to hold auth state in one place that any component can read.

What the context holds:
- `token` — the JWT (initialized FROM localStorage so refresh doesn't log you out)
- `user` — optional decoded info
- `login(token)` — saves token to localStorage + state
- `logout()` — clears token from localStorage + state

Then wrap your whole app in `<AuthProvider>` in `main.jsx`.

```jsx
// main.jsx (shape only)
<AuthProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</AuthProvider>
```

### Why Context?

Many components need to know "is the user logged in?" — the navbar, the route guard,
the logout button. Without Context you'd pass props down through every level
("**prop drilling**"). Context is a global store any component reads directly via a
hook (`useAuth()`).

### Key best practice: initialize from localStorage

When the app first loads, read the token from localStorage into your state:
```js
const [token, setToken] = useState(localStorage.getItem("token"));
```
**Why:** without this, a page refresh would reset auth state to "logged out" even
though a valid token is sitting in localStorage. This keeps the user logged in
across refreshes.

---

## Phase 6 — Protected routes (`components/ProtectedRoute.jsx`)

A wrapper component: if there's no token → redirect to `/login`; otherwise → render
the page.

```jsx
// shape only
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return children;
}
```

Use it in your router to wrap protected pages:
```jsx
<Route path="/laptops" element={
  <ProtectedRoute><Laptops /></ProtectedRoute>
} />
```

### Why TWO layers of protection?

Your **backend middleware already** rejects no-token requests — that's the real
security gate. So why guard on the frontend too?

- **Backend guard = security.** It's the real lock; never trust the client.
- **Frontend guard = UX.** It stops a logged-out user from even *seeing* a broken
  protected page, and redirects them smoothly to login.

**Golden rule:** Frontend checks are for *user experience*. The backend is the
*real* gate. Never rely on the frontend alone for security — anyone can bypass it
with DevTools or by calling your API directly.

## Checklist before moving on

- [ ] `AuthContext` provides token, login(), logout()
- [ ] app wrapped in `<AuthProvider>` and `<BrowserRouter>`
- [ ] token initialized from localStorage (survives refresh)
- [ ] `ProtectedRoute` redirects to `/login` when no token
- [ ] visiting `/laptops` while logged out redirects to login
