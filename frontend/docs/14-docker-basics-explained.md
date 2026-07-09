# Phase 14 — Docker Basics, Explained From Scratch

> A "teach me Docker" companion to [13-docker-and-deploy-guide.md](./13-docker-and-deploy-guide.md).
> That guide tells you *what to do* to deploy. This one explains *why every line works*,
> using your own `Laptop_inventry_API/Dockerfile` as the example. Read this first if the
> Dockerfile in Part B felt like magic.

---

## 1. The mental model — what problem Docker solves

Your app doesn't run in a vacuum. To run `node index.js`, a machine needs:

- The right **Node version** (20)
- All your **npm dependencies** installed
- Your **source code**
- The right **environment variables**
- An **OS** underneath it all

On your laptop all of that happens to be set up. On Render's server, or a teammate's
machine, it might not be — different Node version, missing packages. That's the classic
**"works on my machine"** problem.

**Docker's fix:** you write a recipe (the `Dockerfile`) that says "start from a clean Linux
with Node 20, install exactly these deps, copy in my code, run it this way." Docker follows
that recipe to build a sealed **image** — a frozen snapshot of OS + Node + deps + your code.
That image runs *identically* anywhere Docker is installed.

### The two words people always confuse

| Term | What it is | Analogy |
|------|-----------|---------|
| **Image** | The frozen blueprint you build from the Dockerfile | A class definition, or a `.iso` install disc |
| **Container** | A *running instance* of an image | An object created from the class |

You **build** an image once. You **run** it to get a container. You can run many containers
from one image.

---

## 2. The only ~7 instructions you need to know

A Dockerfile is a plain text file, read **top to bottom**. Each line is
`INSTRUCTION arguments`. These are essentially all the instructions you'll use 95% of the time:

| Instruction | What it does | Plain English |
|-------------|-------------|---------------|
| `FROM` | Picks the base image to start from | "Start with a Linux that already has Node 20" |
| `WORKDIR` | Sets the current folder inside the container | "cd into /app; do everything here" |
| `COPY` | Copies files from your machine → into the image | "Put my code inside the box" |
| `RUN` | Executes a command **at build time** | "While building, run `npm install`" |
| `ENV` | Sets an environment variable | "Set NODE_ENV=production" |
| `EXPOSE` | Documents which port the app uses | "This app talks on port 3000" |
| `CMD` | The command run **when the container starts** | "To start me, run `node index.js`" |

### The single most important distinction

> **`RUN` happens once, while *building* the image.**
> **`CMD` happens every time you *start* a container.**
>
> `RUN npm install` → done at build, baked into the image.
> `CMD ["node","index.js"]` → fires when the container boots up.

---

## 3. Your actual Dockerfile, line by line

```dockerfile
FROM node:20-alpine        # (1)
WORKDIR /app               # (2)

COPY package*.json ./      # (3)
RUN npm install            # (4)

COPY . .                   # (5)

EXPOSE 3000                # (6)
CMD ["node", "index.js"]   # (7)
```

1. **`FROM node:20-alpine`** — Start from a pre-made image called `node`, tag `20-alpine`.
   `20` = Node v20. `alpine` = a *tiny* Linux distro (~5MB vs ~100MB), so your image stays
   small. This image already has Node and npm installed — you're building on top of it.

2. **`WORKDIR /app`** — Create/switch into `/app` inside the container. Every command after
   this runs from `/app`. It's just `cd /app` that also creates the folder.

3. **`COPY package*.json ./`** — Copy `package.json` and `package-lock.json` from your
   project folder into `/app` (the `./`). Note: **only** the package files, not the whole app
   yet. (Section 4 explains why.)

4. **`RUN npm install`** — At build time, install all dependencies listed in `package.json`.
   This creates `node_modules` *inside the image*.

5. **`COPY . .`** — *Now* copy everything else (your source code) from your folder into
   `/app`. First `.` = your project on disk, second `.` = `/app` in the container.

6. **`EXPOSE 3000`** — Purely documentation: "this app listens on 3000." It doesn't actually
   open the port (you do that at `docker run` time with `-p`). It's a note for humans and tools.

7. **`CMD ["node", "index.js"]`** — When someone starts a container from this image, run
   `node index.js`. This is your app's entrypoint.

---

## 4. The confusing part — "layers" and why COPY is split in two

This is the part that trips everyone up, so here it is slowly.

Every instruction in a Dockerfile creates a **layer** — a saved snapshot of the filesystem
after that step. Docker **caches** layers. On a rebuild, if nothing that affects a layer
changed, Docker reuses the cached layer instead of redoing the work.

Docker checks the cache top-to-bottom and **stops reusing the moment something changes** —
everything from that point down re-runs.

Now look at the ordering:

```dockerfile
COPY package*.json ./     # deps list
RUN npm install           # SLOW — installs everything
COPY . .                  # your source code
```

- Your **source code changes constantly** (you edit `index.js` 50 times a day).
- Your **dependencies rarely change** (you add a package maybe once a week).

By copying `package.json` *first* and installing *before* copying source:

- You edit `index.js` → only the `COPY . .` layer and below are invalidated.
  `npm install` is **reused from cache**. Rebuild takes ~2 seconds. ⚡
- If instead you did `COPY . .` then `RUN npm install`, *any* code edit would invalidate the
  copy layer, forcing `npm install` to re-run every single time. Rebuild takes ~60 seconds
  every time. 🐌

That's the whole trick. It's a performance optimization, nothing more.

> **Rule of thumb: order your Dockerfile from least-frequently-changing to
> most-frequently-changing.**

---

## 5. `.dockerignore` — the sibling file

Just like `.gitignore`, this tells Docker what to *not* copy into the image:

```
node_modules
.env
npm-debug.log
```

Why each matters:

- **`node_modules`** — you install fresh inside the container (`RUN npm install`). Copying
  your laptop's version could bring in OS-specific binaries that break on Linux. Exclude it.
- **`.env`** — your secrets (DB password, JWT secret). You never want secrets baked into an
  image. You inject them at runtime instead (see next section).

---

## 6. The two commands that actually run Docker

Everything above is the *recipe*. Here's how you use it:

```bash
# BUILD the image from the Dockerfile in the current folder (.)
docker build -t laptop-api .
```

- `-t laptop-api` = "tag/name it `laptop-api`" so you can refer to it later.
- `.` = "the Dockerfile and build context are in this current directory."

```bash
# RUN a container from that image
docker run -p 3000:3000 --env-file .env laptop-api
```

- `-p 3000:3000` = **port mapping** (`hostPort:containerPort`). Connect port 3000 on your
  laptop to 3000 inside the container. *This* is what actually makes the app reachable
  (remember `EXPOSE` was just a note). Without `-p`, the container runs but you can't reach it.
- `--env-file .env` = inject your secrets **at runtime** from `.env`. This is why you didn't
  bake them into the image — you feed them in when starting the container.
- `laptop-api` = which image to run.

**Full lifecycle:** write Dockerfile → `docker build` (make image) → `docker run` (start container).

---

## 7. A minimal skeleton you can write from scratch

For almost any Node app, the pattern is always this shape:

```dockerfile
FROM node:20-alpine       # 1. pick your runtime
WORKDIR /app              # 2. pick a working dir
COPY package*.json ./     # 3. deps manifest first (cache trick)
RUN npm install           # 4. install deps
COPY . .                  # 5. then the code
EXPOSE 3000               # 6. note the port
CMD ["node", "index.js"]  # 7. how to start
```

Change `node:20` for a Python app to `python:3.12`, `npm install` to
`pip install -r requirements.txt`, and `CMD` to `python app.py` — same seven-step skeleton.

Once you see it's *always* **base → workdir → deps → code → start**, Dockerfiles stop being scary.

---

## 8. Quick reference cheat-sheet

| I want to... | Command |
|--------------|---------|
| Build an image | `docker build -t myapp .` |
| Run a container | `docker run -p 3000:3000 --env-file .env myapp` |
| Run in background (detached) | `docker run -d -p 3000:3000 myapp` |
| List running containers | `docker ps` |
| List all containers (incl. stopped) | `docker ps -a` |
| List images | `docker images` |
| Stop a container | `docker stop <container-id>` |
| View a container's logs | `docker logs <container-id>` |
| Open a shell inside a running container | `docker exec -it <container-id> sh` |
| Remove an image | `docker rmi myapp` |

---

### One-paragraph summary (if you only remember one thing)

A **Dockerfile** is a recipe read top-to-bottom. Each line is a step that becomes a cached
**layer**, so you order steps least-changing → most-changing (deps before source). You
`docker build` the recipe into an **image** (a frozen blueprint), then `docker run` the image
into a **container** (a running instance), mapping ports with `-p` and injecting secrets with
`--env-file`. That's Docker.
