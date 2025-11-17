# Employees Profile – step-by-step guide for people who have never coded

Welcome! This repository contains the minimum code required to complete a very specific challenge: show the profile of a Factored employee using a **FastAPI + SQLite** backend and a **React + Material UI + Recharts** frontend. The goal is to explain, in plain language, what every part does, how to start it, and what to watch out for.\
¿Prefieres leer en español? Usa `README_es.md`.

---

## 1. Challenge recap

> "I need a very simple system with a login and a profile page that shows the name, role, avatar, spider/radar skill chart, a backend, and a database. Please dockerize it and document everything for someone with zero engineering background."

This repository meets all of those requirements: you get the login, the profile page with radar chart, the backend + database, beginner-friendly documentation, and Docker containers ready to run.

---

## 2. Requirements checklist

| Requirement | Status | Where to find it? |
| --- | --- | --- |
| Basic login that redirects to the profile | ✅ | `frontend/src/pages/LoginPage.jsx`
| Profile page with name, role, and avatar | ✅ | `frontend/src/pages/ProfilePage.jsx`
| Spider/radar chart showing skills | ✅ RadarChart built with Recharts | `ProfilePage.jsx` 
| Database with ≥1 person and ≥5 skills | ✅ SQLite db, SQLAlchemy models | `backend/employees.db` and `backend/app/models.py`
| Backend that exposes the data | ✅ FastAPI endpoints | `backend/app/main.py`
| 404 page | ✅ Not found page | `frontend/src/pages/NotFoundPage.jsx`
| Clear documentation | ✅ This README and --> | `backend/README.md` + `frontend/README.md` + `README_es.md`
| Dockerized solution | ✅ `docker-compose.yml` + Dockerfiles for backend and frontend | `./docker-compose.yml`

---

## 3. Project map

```
employees-profile/
├─ README.md                ← This document (English, beginner-friendly)
├─ README_es.md             ← Spanish translation for non-English speakers
├─ backend/README.md        ← Technical deep dive for the FastAPI service
├─ frontend/README.md       ← Technical deep dive for the React app
├─ docker-compose.yml       ← Docker Compose file wiring backend + frontend
├─ backend/
│  ├─ app/                  ← FastAPI package with routes, models, schemas
│  │  ├─ __init__.py        ← Marks the folder as a Python package
│  │  ├─ database.py        ← SQLAlchemy engine/session factory
│  │  ├─ models.py          ← ORM definitions for Employee and Skill
│  │  ├─ schemas.py         ← Pydantic models for API responses
│  │  └─ main.py            ← FastAPI app, CORS, seeding, endpoints
│  ├─ employees.db          ← SQLite file with the dummy employee
│  ├─ requirements.txt      ← FastAPI/SQLAlchemy dependencies list
│  └─ Dockerfile            ← Builds the backend container
└─ frontend/
   ├─ src/                  ← React source (pages, router, styles)
   │  ├─ main.jsx           ← Entry point + React Router config
   │  ├─ App.jsx            ← Layout wrapper rendering `<Outlet />`
   │  ├─ App.css            ← Optional styles from Vite scaffold
   │  ├─ index.css          ← Global reset/background styles
   │  └─ pages/             ← Login/Profile/NotFound components
   ├─ package*.json         ← NPM metadata + scripts + dependencies
   ├─ .env.example          ← Sample `VITE_API_BASE_URL`
   └─ Dockerfile            ← Builds the frontend container
```

---

## 4. Before you start

1. **Install Python 3.11 or newer.** Download it from [python.org](https://www.python.org/downloads/) and (on Windows) check "Add python to PATH".
2. **Install Node.js 20 LTS or newer.** Grab it from [nodejs.org](https://nodejs.org); it includes `npm`.
3. **Open a terminal.** PowerShell or Windows Terminal on Windows, Terminal app on macOS/Linux.
4. **(Optional) Install a code editor.** Visual Studio Code is perfect for browsing the files.

That is all you need—no previous programming knowledge required.

---

## 5. Start the backend (FastAPI + SQLite)

> Run these commands once in this exact order. If something fails, copy the error message; it will tell you what is missing.

1. Open a terminal and move into the backend folder:
   ```bash
   cd employees-profile/backend
   ```
2. Create a virtual environment (keeps backend dependencies isolated):
   ```bash
   python -m venv .venv
   ```
3. Activate it:
   - macOS / Linux:
     ```bash
     source .venv/bin/activate
     ```
   - Windows (PowerShell):
     ```powershell
     .venv\Scripts\Activate
     ```
4. Install the backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Start FastAPI with auto-reload on port 8000:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
6. Leave this terminal open. You should see `Application startup complete`; while it is running, the API lives at `http://127.0.0.1:8000`.

### How to verify it worked
- Visit `http://127.0.0.1:8000/health` → you should see `{"status":"Ok"}`.
- Visit `http://127.0.0.1:8000/employees/1` → you should see the dummy employee JSON.
- Visit `http://127.0.0.1:8000/docs` → FastAPI's Swagger UI lets you test endpoints.

> If `pip` complains about weird characters, make sure `requirements.txt` is saved as a UTF-8 text file. (Already fixed in this repo.)

---

## 6. Start the frontend (React + Material UI + Recharts)

1. Open a second terminal and move into the frontend folder:
   ```bash
   cd employees-profile/frontend
   ```
2. Install dependencies (first time only):
   ```bash
   npm install
   ```
3. (Optional but useful) Copy the sample environment file so you can point to any backend URL:
   ```bash
   cp .env.example .env    # On Windows: copy .env.example .env
   ```
   Edit `VITE_API_BASE_URL` inside `.env` if your backend runs on another port/host.
4. Start the Vite dev server on port 5173:
   ```bash
   npm run dev
   ```
5. Vite prints a URL like `http://localhost:5173`. Open it in the browser: the frontend will call the backend running on `http://127.0.0.1:8000` (or whatever you set in the `.env`). You can navigate to `/profile` (defaults to employee `1`) or `/profile/2`, `/profile/3`, etc., for other IDs.

> Keep both terminals running (backend + frontend). If you close one, refresh the browser and you will see an error.

---

## 7. What you will see

1. **Login ( `/` or `/login` )** – Material UI form with username/password inputs. The username field is treated as the employee ID you want to view (e.g., enter `2` to jump to `/profile/2`). If you leave it empty, it defaults to employee `1`.
2. **Profile (`/profile` or `/profile/:id`)** – Shows the requested employee’s name, role, avatar, a radar chart (Recharts) indicating all skill levels, and a textual list of the same skills. Visiting `/profile` without an ID falls back to the first employee in the database.
3. **404 (`anything else`)** – Friendly “404” message with a button that sends you back to the login page.

Everything uses Material UI components for a consistent look & feel, Recharts for the graph, and `react-router-dom` for navigation.

---

## 8. API + database in plain words

- **Database** – `backend/employees.db` is a SQLite file. No extra server required. At startup the app seeds multiple employees (currently Alejandro and Felipe) so you can test `/employees/1`, `/employees/2`, etc.
- **Tables** – `employees` and `skills` with a one-to-many relationship.
- **Dummy data** – Loaded at startup in `init_db()` (`backend/app/main.py`). It iterates over a list of employees and inserts each with its skills; edit that list to add/remove people.
- **Key endpoints**
  - `GET /health` → returns `{"status": "Ok"}`.
  - `GET /employees/{id}` → returns the employee and their skills, e.g.:
    ```json
    {
      "id": 1,
      "full_name": "Alejandro Arango Mejía",
      "position": "Software Engineer",
      "avatar_url": "https://robohash.org/alejandro-arango-mejia.png",
      "skills": [
        { "id": 1, "name": "Python", "level": 90 },
        { "id": 2, "name": "SQL", "level": 75 },
        { "id": 3, "name": "FastApi", "level": 85 },
        { "id": 4, "name": "Docker", "level": 78 },
        { "id": 5, "name": "Software Engineer", "level": 71 }
      ]
    }
    ```
**Note:** The **avatar_url** uses Robohash so each employee gets a unique generated avatar.
Restart the backend whenever you modify the seed data so FastAPI reloads the file.

---

## 9. Quick tests without the frontend

```bash
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/employees/1
curl http://127.0.0.1:8000/employees/2
```

Tools like Postman or Bruno work too; just paste the URL and hit "Send".

---

## 10. Current limitations + next steps

1. **No real authentication** – The login is purely navigational. To add real auth, create FastAPI endpoints and store hashed credentials.
2. **Manual ID entry** – The UI expects you to type the employee ID manually. A future enhancement could list available employees (e.g., a dropdown fed by `GET /employees`) so users don’t need to remember IDs.
3. **SQLite file persistence** – Data lives in `backend/employees.db`. Deleting the file regenerates it with whatever `init_db()` defines. To persist custom data across runs, keep the file (or mount a Docker volume).

Everything else matches the challenge scope.

---

## 11. FAQ

- **Do I need to know how to code?** Nope. Follow the instructions; if something fails, copy the exact error and search “FastAPI” + that message.
- **Can I change the dummy profile?** Yes. Edit `init_db()` in `backend/app/main.py`, delete `backend/employees.db`, and restart the backend.
- **How do I stop everything?** Press `Ctrl + C` in both terminals, then deactivate the virtual environment with `deactivate`.
- **Can I change the backend port?** Sure. Adjust the `--port` parameter when running Uvicorn *and* update `VITE_API_BASE_URL` (your `.env` file) so the frontend knows the new URL.
- **Can I delete the database and let it regenerate?** Yes. As long as `init_db()` contains the data you want, removing `backend/employees.db` (or the Docker volume) before starting the backend will recreate it automatically.
- **How do I point the frontend somewhere else?** Copy `.env.example` to `.env` and edit `VITE_API_BASE_URL`. Vite injects that value at build time.
- **What about Docker?** See the next section—everything is already containerized.

---

## 12. Run everything with Docker (recommended for demos)

> Prerequisite: install Docker Desktop (Windows/macOS) or Docker Engine + Compose plugin (Linux).

1. From the repo root run:
   ```bash
   docker compose up --build
   ```
2. The first run builds two images:
   - `employees-backend` → FastAPI (Python 3.11) exposed at `http://localhost:8000`.
   - `employees-frontend` → React build served by `npm run preview` at `http://localhost:5173`.
3. Once both say `started`, open:
   - `http://localhost:5173` → login + profile with the radar chart (use `/profile/2` to see the second employee).
   - `http://localhost:8000/docs` → interactive API docs.
4. Stop everything with `Ctrl + C`, then optionally remove containers with:
   ```bash
   docker compose down
   ```
> The Compose file builds the frontend with `VITE_API_BASE_URL=http://localhost:8000` so your browser (running on the host) can reach the API. If you run these containers on a remote server, change that build arg in `docker-compose.yml` to match the public URL of your backend.

### Quick Docker tweaks
- **Different backend URL for the frontend** – edit `frontend/.env.example` before running compose, or rebuild with `docker compose build --build-arg VITE_API_BASE_URL=http://... frontend`.
- **Different seed data** – edit `init_db()`, then `docker compose build backend` so the new data ships inside the backend image.

---

With this guide you can clone the repo, run it locally or via Docker, Good luck!
