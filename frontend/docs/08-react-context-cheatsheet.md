# React Context — The Forever Cheat-Sheet

> Read this top-to-bottom whenever you need Context. It's the SAME 3 steps every
> time: **Create → Provide → Consume.** Memorize those three words.

## The mental model (read this first)

**Problem Context solves:** "prop drilling" — passing a value down through 5
components that don't even use it, just to reach the one that does.

**The analogy:** Context is a **Wi-Fi router** for data.
- You **set up the router** once (create context).
- You **switch it on for a building** (wrap components in a Provider).
- Any device **inside that building connects directly** (useContext) — no running
  cables (props) through every room.

So anything inside the Provider can grab the value directly, no matter how deep.

---

## Step 1 — How to CREATE context

One file, one call. `createContext()` makes the "router."

```jsx
// context/AuthContext.jsx
import { createContext } from "react";

export const AuthContext = createContext();   // the "router" — export it
```

That's the whole creation step. The interesting part is the **Provider** (Step 3).

---

## Step 2 — How to USE (consume) it

Any component inside the Provider reads the value with the `useContext` hook:

```jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);   // grab what you need
  return isLoggedIn ? <button onClick={logout}>Logout</button> : <LoginButton />;
}
```

**Remember:** `useContext(TheContext)` returns whatever you put in the Provider's
`value={...}`. No props passed in — it reaches up and grabs it.

---

## Step 3 — How to UPDATE it (the key part)

Context by itself is just a value. To make it *changeable*, you put **state inside
a Provider component**, and pass both the state AND the functions that change it
into `value`. Updating the state re-renders every consumer automatically.

```jsx
// context/AuthContext.jsx  (same file, add the Provider)
import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // the functions that UPDATE the state live here, next to the state
  const login = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // expose state + updater functions to everyone inside
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

Then wrap your app **once** (usually in `main.jsx` or `App.jsx`):

```jsx
// main.jsx
<AuthProvider>
  <App />
</AuthProvider>
```

Now ANY component can `login(token)` or `logout()`, and the navbar, dashboard,
everything updates together — no prop drilling, no stale snapshots.

> **Why this fixes your old Navbar bug:** before, each component read localStorage
> once on mount (a stale snapshot). Now there's ONE shared `isLoggedIn` state — call
> `logout()` anywhere and every consumer re-renders instantly.

---

## Step 4 — Best practices

1. **One file per context.** Keep `createContext`, the `Provider`, and (optionally)
   a custom hook all in `context/XyzContext.jsx`.
2. **Put state + its updater functions together** in the Provider. Consumers should
   call `login()` / `logout()`, never poke at the raw setter.
3. **Make a custom hook** so consumers don't import two things every time:
   ```jsx
   export const useAuth = () => useContext(AuthContext);
   // then in components:  const { isLoggedIn, logout } = useAuth();
   ```
   Bonus: you can throw a clear error if it's used outside the Provider.
4. **Don't put EVERYTHING in one giant context.** Group by concern: `AuthContext`,
   `ThemeContext`, `CartContext`. One context = one job.
5. **Don't overuse Context.** It's for *global-ish, shared* state (auth, theme,
   current user). For data used by one component, plain `useState` is better.
6. **Performance gotcha:** every consumer re-renders when the `value` changes. Don't
   stuff rapidly-changing or huge data in a context that wraps the whole app. (Not a
   worry for auth — it changes rarely.)
7. **Provider goes high enough** to cover every component that needs it — but no
   higher. Auth = top of the app. A cart drawer's context might only wrap the shop.

---

## The 30-second skeleton (copy this shape from memory)

```jsx
// 1. CREATE
export const XContext = createContext();

// 2. PROVIDE (state + updaters live here)
export function XProvider({ children }) {
  const [value, setValue] = useState(initial);
  const doSomething = () => setValue(...);
  return (
    <XContext.Provider value={{ value, doSomething }}>
      {children}
    </XContext.Provider>
  );
}

// 3. CONSUME (anywhere inside the provider)
const { value, doSomething } = useContext(XContext);
```

**Three words, every time: Create → Provide → Consume.**
```
