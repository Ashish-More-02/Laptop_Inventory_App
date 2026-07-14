# Phase 15 — Bash Scripting, From Scratch to "I Can Write Any Script"

> A "teach me bash" guide. By the end you'll understand ~90% of everyday bash and be able
> to write your own `start_all.sh` / `stop_all.sh` for this project — backend
> (`Laptop_inventry_API`, `node index.js`, port 3000) and frontend (`frontend`,
> `npm run dev`, port 5173) — plus almost any other script you'll need.
>
> **How to read this doc:** Start with **Part 0** — it's the dead-simple version of the two
> scripts with every symbol explained in plain English. That alone is enough to use and
> understand the scripts. Parts 1–8 are the deeper reference for when you're ready to go
> further. Don't try to read it all at once; the deep parts are meant to be dipped into.

---

## Part 0 — The simple version (start here)

Forget everything fancy for a moment. Only **4 lines** actually do work. Here are the two
scripts exactly as they live in the project root, followed by a plain-English decode.

### `start.sh`

```bash
#!/bin/bash

# Open a new Terminal window and start the BACKEND
osascript -e 'tell application "Terminal" to do script "cd \"/Users/ashishmore/Desktop/Dev-Workspace/Web Development/Laptop_inventry_app/Laptop_inventry_API\" && node index.js"'

# Open another new Terminal window and start the FRONTEND
osascript -e 'tell application "Terminal" to do script "cd \"/Users/ashishmore/Desktop/Dev-Workspace/Web Development/Laptop_inventry_app/frontend\" && npm run dev"'
```

**Line by line:**

- `#!/bin/bash` — the **shebang**. Says "run this file with bash." Boilerplate; every script
  has one.
- `# ...` — a **comment**. Any line starting with `#` is a note for humans. Bash ignores it.

The one real line, inside-out:

| Piece | Plain English |
|---|---|
| `osascript` | A Mac command meaning "run some Apple automation." It lets bash control other Mac apps. |
| `-e` | "Here comes the instruction to run." (`e` = execute) |
| `'...'` | **Single quotes** wrap the whole instruction as one chunk handed to `osascript`. |
| `tell application "Terminal" to do script "..."` | The Apple instruction: "Terminal, open a new window and type this command into it." |
| `cd \"/Users/.../Laptop_inventry_API\"` | `cd` = "go into this folder." The `\"` is an **escaped quote** — a normal `"` with a `\` in front so it doesn't clash with the surrounding quotes. Needed because the path has a **space** (`Web Development`). |
| `&&` | "And then, only if the previous step worked." Go into the folder **and then** run node. |
| `node index.js` | The actual backend command. |

The second line is the same thing, pointing at `frontend` and running `npm run dev`.

### `stop.sh`

```bash
#!/bin/bash

# Stop the BACKEND (whatever is running on port 3000)
find_PID_on_PORT3000=$(lsof -ti tcp:3000)
kill -9 $find_PID_on_PORT3000 2>/dev/null

# Stop the FRONTEND (whatever is running on port 5173)
find_PID_on_PORT5173=$(lsof -ti tcp:5173)
kill -9 $find_PID_on_PORT5173 2>/dev/null

echo "Stopped backend and frontend."
```

**Line by line:**

| Piece | Plain English |
|---|---|
| `lsof -ti tcp:3000` | "Find the program using port 3000 and give me its ID number." (`lsof` = list open files, `-t` = just the number, `-i tcp:3000` = on that port.) |
| `$( ... )` | "Run the command inside first, and paste its result here." |
| `find_PID_on_PORT3000=$(...)` | Save that ID number into a variable so the next line can use it. |
| `kill -9 $find_PID_on_PORT3000` | "Force-stop the program with that ID." (`-9` = the forceful version.) |
| `2>/dev/null` | "If there's an error message, throw it in the trash." Used because if nothing is running, `kill` complains and we don't care. `/dev/null` is a garbage bin. |

### The two golden rules of variables (learned the hard way)

Almost every beginner hits these two on day one:

1. **No spaces around `=`.** Write `x=5`, never `x = 5`. With spaces, bash thinks `x` is a
   *command* and errors.
2. **`$( )` runs a command; `"..."` just stores text.**
   `find_PID=$(lsof -ti tcp:3000)` runs the finder and stores the *number*.
   `find_PID="lsof -ti tcp:3000"` stores the literal *words* — useless to `kill`.

### The one exception to "always quote your variables"

The general rule is: always wrap variables in quotes — `"$var"` — so spaces don't break
things. **`kill` with PIDs is a rare exception.** A port can have two processes, so the
variable might hold `481 502`:

- `kill -9 "$find_PID_on_PORT3000"` → quotes make `"481 502"` *one weird item* → `kill` fails.
- `kill -9 $find_PID_on_PORT3000` → no quotes → two separate numbers → both get stopped. ✅

Don't memorize the exception — just know that quoting is the safe default and this one spot
is deliberately unquoted.

### Using them

```bash
chmod +x start.sh stop.sh   # one time: make them runnable
./start.sh                  # opens 2 Terminal windows, both apps start
./stop.sh                   # stops both
```

### If something breaks

Run it with `-x` to watch every line execute with values filled in — your #1 debugging tool:

```bash
bash -x start.sh
```

That's the whole thing. Everything below is optional depth for later.

---

## 1. The mental model

A bash script is **a text file full of commands you'd otherwise type in the terminal, run
top-to-bottom.** Everything else is convenience on top of that one idea.

Three things make a text file a runnable script:

1. **A shebang** on line 1 — tells the OS which interpreter to use.
2. **Execute permission** — `chmod +x file.sh`.
3. **The commands** — the same ones you'd type by hand.

```bash
#!/usr/bin/env bash
echo "hello"
```

### Why `#!/usr/bin/env bash`?

On macOS, `/bin/bash` is ancient (v3.2, from 2007). `#!/usr/bin/env bash` finds the
*newer* bash on your `PATH` (e.g. Homebrew's v5) if you have one, and falls back to the
system one otherwise. Portable habit — use it everywhere.

### Three ways to run a script — know the difference

| Command | What happens | Needs `chmod +x`? |
|---|---|---|
| `bash file.sh` | Runs in a *new* bash process | No |
| `./file.sh` | OS reads the shebang and runs it | **Yes** |
| `source file.sh` / `. file.sh` | Runs in your *current* shell (can change your env) | No |

Use `./file.sh` for normal scripts. Use `source` only when a script is meant to modify
your current shell (e.g. exporting env vars).

---

## 2. The 90% of bash you'll actually use

### 2.1 Variables

```bash
name="Ashish"        # NO spaces around = . `name = "x"` is a bug (runs command `name`).
echo "$name"         # use it with $
echo "${name}_app"   # braces when gluing to other text: ${name}_app, not $name_app
```

**The single rule that prevents most bugs: always wrap variables in double quotes** —
`"$var"`. Without quotes, a value containing spaces (like this project's path,
`Web Development`) splits into multiple arguments and breaks things.

```bash
dir="/Users/me/Web Development"
cd $dir      # ❌ tries to cd into "/Users/me/Web", then "Development"
cd "$dir"    # ✅ correct
```

Quotes:
- `"double"` → `$variables` are expanded.
- `'single'` → literal; nothing is expanded.

### 2.2 Command substitution — capture a command's output

```bash
today=$(date +%Y-%m-%d)
count=$(ls | wc -l)
echo "There are $count files, today is $today"
```

Use `$( )`, not the old backticks — it nests cleanly and reads better.

### 2.3 Exit codes — how bash knows success vs failure

Every command returns a number: **0 = success, anything else = failure.** This is the
backbone of all logic.

```bash
mkdir foo
echo $?      # $? = exit code of the last command
```

- `&&` = "and then, only if the previous succeeded."
- `||` = "or else, if it failed."

```bash
cd frontend && npm run dev              # only run dev if cd worked
lsof -ti tcp:3000 || echo "port free"   # echo only if lsof found nothing
```

### 2.4 Conditionals & tests

```bash
if [[ -d "$dir" ]]; then
  echo "folder exists"
elif [[ -f "$file" ]]; then
  echo "it's a file"
else
  echo "not found"
fi
```

**Use `[[ ]]`, not the older `[ ]`** — safer with variables, more features. Common tests:

| Test | True when |
|---|---|
| `-d "$x"` | x is a directory |
| `-f "$x"` | x is a file |
| `-e "$x"` | x exists (file or dir) |
| `-z "$x"` | x is an empty string |
| `-n "$x"` | x is non-empty |
| `"$a" == "$b"` | strings equal |
| `"$a" != "$b"` | strings differ |
| `$a -eq $b` / `-gt` / `-lt` | numeric equal / greater / less |

### 2.5 Loops

```bash
for port in 3000 5173; do
  echo "checking $port"
done

ports=(3000 5173)               # an array
for p in "${ports[@]}"; do      # "${arr[@]}" = all elements, safely quoted
  echo "$p"
done

while read -r line; do
  echo "got: $line"
done < somefile.txt
```

### 2.6 Functions

```bash
greet() {
  local who="$1"      # $1 = first arg. `local` keeps `who` inside the function.
  echo "hi $who"
}
greet "Ashish"
```

- `$1 $2 $3 …` = arguments, `$@` = all args, `$#` = number of args.
- **Always use `local`** inside functions so their variables don't leak out and clobber others.

### 2.7 Script arguments

The same positional variables work for the whole script:

```bash
./deploy.sh staging     # inside deploy.sh, $1 is "staging"
```

### 2.8 The safety header — top of every real script

```bash
set -euo pipefail
```

- `set -e` → exit the moment any command fails.
- `set -u` → error on undefined variables (catches typos like `$fronend`).
- `set -o pipefail` → in `a | b | c`, if any stage fails the whole pipeline fails.

**Caveat:** with `-e`, a command that's *expected* to sometimes fail (like `lsof` finding
nothing) will abort your script. The fix is `|| true`:

```bash
pids=$(lsof -ti tcp:3000 || true)   # "if lsof fails, pretend it succeeded"
```

### 2.9 Comments & output streams

```bash
# this is a comment
echo "normal message"      # -> stdout
echo "error!" >&2          # -> stderr, the correct place for error messages
```

That's genuinely ~90% of everyday bash.

---

## 3. Two macOS-specific tools these scripts need

Bash core doesn't solve two OS-specific problems in this task.

### (a) Open a separate Terminal window and run a command

macOS has no native bash way to do this. You drive **Terminal.app** via AppleScript
through the `osascript` command:

```bash
osascript -e 'tell application "Terminal" to do script "echo hello"'
```

`do script "…"` opens a **new Terminal window** and runs the command in it. That's the key
to launching backend and frontend in two windows.

### (b) Stop them by port

Since each runs in its own window, the reliable way to stop them is **by port**, not by
hunting window PIDs:

```bash
lsof -ti tcp:3000    # -t = PIDs only, -i = network sockets, tcp:3000 = that port
kill -9 <pid>        # force-kill that process
```

Verify the tools exist on your machine:

```bash
command -v osascript && command -v lsof && command -v bash
```

---

## 4. Build `start_all.sh` yourself

Type this out and fill each `# TODO`. Reasoning follows.

```bash
#!/usr/bin/env bash
set -euo pipefail

# 1. Find where this script lives, so it works no matter where you run it from.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 2. Build the two folder paths.
BACKEND_DIR="$ROOT_DIR/Laptop_inventry_API"
FRONTEND_DIR="__TODO__"      # the frontend folder

# 3. Guard clause: if a folder is missing, print to stderr and exit 1.
#    if [[ ! -d "$BACKEND_DIR" ]]; then echo "missing $BACKEND_DIR" >&2; exit 1; fi

# 4. Helper: open a Terminal window that cd's into $1 and runs $2.
open_terminal() {
  local dir="$1"
  local cmd="$2"
  osascript -e "tell application \"Terminal\" to do script \"cd '$dir' && $cmd\""
}

# 5. Call it twice.
open_terminal "$BACKEND_DIR"  "node index.js"
# TODO: the frontend one -> npm run dev

echo "✅ Started. Backend :3000, Frontend :5173"
```

**Why each piece matters:**

- **`ROOT_DIR` via `BASH_SOURCE`** — the most important habit. Never assume the user runs
  the script from the project root. Computing the script's own location means
  `./start_all.sh` works from anywhere. `dirname` gives the folder; `cd … && pwd` makes it
  a clean absolute path.
- **Guard clauses** — fail *early and loudly* with a clear message. A script that silently
  opens a Terminal in the wrong folder wastes 10 minutes of confusion.
- **Quoting in the osascript line (the tricky part)** — quotes inside quotes inside quotes.
  Outer `"…"` for osascript's `-e` (so `$dir` expands), inner escaped `\"…\"` for
  AppleScript's own string, and `'…'` around `$dir` so a path with a space
  (`Web Development`) survives inside Terminal. Get it wrong and you'll see `-1719` or
  "can't get" errors.
- **The helper function** — you do the same thing twice; a function means you write the
  fiddly osascript once and can't get the two calls out of sync. DRY applies to bash too.

---

## 5. Build `stop_all.sh` yourself

```bash
#!/usr/bin/env bash
set -uo pipefail      # NOTE: no -e here. Think about why. (Answer below.)

ports=(3000 5173)

for port in "${ports[@]}"; do
  # 1. Get PIDs on this port. lsof "fails" when nothing is found, which would kill
  #    the script under set -e — so guard it with || true even though -e is off (habit).
  pids=$(lsof -ti "tcp:$port" || true)

  # 2. Empty -> nothing to do. Otherwise kill.
  if [[ -z "$pids" ]]; then
    echo "ℹ️  nothing on port $port"
  else
    echo "🛑 killing $pids on port $port"
    echo "$pids" | xargs kill -9
  fi
done
```

**Why each choice:**

- **No `set -e`** — "no process on the port" is a *normal, expected* outcome, not an error.
  With `-e`, the first free port would abort the script before it checks the second.
  Knowing *when to relax* a safety flag matters as much as knowing to set it.
- **Kill by port, not by name** — `pkill -f node` would nuke *every* node process on your
  machine, including unrelated projects and your editor's language server. Targeting the
  port kills exactly the process bound to it. Precision over convenience.
- **`-z` check before killing** — never pipe an empty string into `kill`.
- **`kill -9` caveat** — `-9` (SIGKILL) is the sledgehammer; the process can't clean up.
  Fine for dev servers. In production you'd send plain `kill` (SIGTERM) first and let it
  shut down gracefully.

---

## 6. Reference solution (check *after* you try)

<details>
<summary>start_all.sh</summary>

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/Laptop_inventry_API"
FRONTEND_DIR="$ROOT_DIR/frontend"

for d in "$BACKEND_DIR" "$FRONTEND_DIR"; do
  if [[ ! -d "$d" ]]; then
    echo "❌ folder not found: $d" >&2
    exit 1
  fi
done

open_terminal() {
  local dir="$1"
  local cmd="$2"
  osascript -e "tell application \"Terminal\" to do script \"cd '$dir' && $cmd\""
}

echo "🚀 backend..."
open_terminal "$BACKEND_DIR"  "node index.js"
echo "🚀 frontend..."
open_terminal "$FRONTEND_DIR" "npm run dev"

echo "✅ Backend :3000  Frontend :5173  (stop with ./stop_all.sh)"
```
</details>

<details>
<summary>stop_all.sh</summary>

```bash
#!/usr/bin/env bash
set -uo pipefail

ports=(3000 5173)

for port in "${ports[@]}"; do
  pids=$(lsof -ti "tcp:$port" || true)
  if [[ -z "$pids" ]]; then
    echo "ℹ️  nothing on port $port"
  else
    echo "🛑 killing $pids on port $port"
    echo "$pids" | xargs kill -9
    echo "✅ freed $port"
  fi
done
echo "✅ done"
```
</details>

---

## 7. Run and debug

```bash
chmod +x start_all.sh stop_all.sh   # one time: make executable
./start_all.sh                      # test start
./stop_all.sh                       # test stop
```

**The debugging tool you'll use forever:**

```bash
bash -x start_all.sh
```

`-x` prints every line as it runs, with variables expanded — so you see exactly what bash
*actually* executed. Your #1 tool when a script "does nothing" or misbehaves.

---

## 8. Best practices & gotchas cheat sheet

| Do this | Because |
|---|---|
| `#!/usr/bin/env bash` | Portable interpreter selection |
| `set -euo pipefail` (relax per-case) | Fail fast instead of limping on errors |
| Quote every variable: `"$var"` | Spaces/paths don't split into extra args |
| `$( )` not backticks | Nests cleanly, readable |
| `[[ ]]` not `[ ]` | Safer, more features |
| Compute `ROOT_DIR` from `BASH_SOURCE` | Script works from any directory |
| Guard clauses that `exit 1` early | Clear failures beat silent wrong behavior |
| `local` in functions | No variable leaks |
| Errors → `>&2` (stderr) | Correct stream; separable from real output |
| Kill by port, not `pkill node` | Don't nuke unrelated processes |
| `\|\| true` on commands allowed to fail | Don't let expected failures abort the script |
| `bash -x` to debug | See exactly what ran |

### Common gotchas

- **Spaces around `=`** → `x = 1` is not assignment; it's a command. Write `x=1`.
- **Unquoted variables with spaces** → the #1 source of "works on my machine, breaks on
  the real path" bugs. This project's path has a space (`Web Development`) — quote always.
- **`cd` without checking it worked** → chain with `&&`, or the next commands run in the
  wrong place. `set -e` also catches this.
- **`set -e` + a command expected to fail** → guard with `|| true`.
- **Forgetting `chmod +x`** → `./script.sh` gives "permission denied". Run `bash script.sh`
  once, or `chmod +x` it.

---

### Where to go next

- `man <command>` (e.g. `man lsof`) — built-in manuals for any command.
- [ShellCheck](https://www.shellcheck.net) — paste a script and it flags quoting/logic bugs
  automatically. Install locally with `brew install shellcheck`, then `shellcheck script.sh`.
