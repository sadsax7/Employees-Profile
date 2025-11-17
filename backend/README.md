# Backend Technical Guide (FastAPI + SQLite)

This document explains every moving part inside `backend/`. It is meant for engineers who want to understand how the FastAPI service is wired, how the SQLite database is prepared, and how requests flow through SQLAlchemy and Pydantic before reaching the frontend.

---

## 1. High-level architecture

```
backend/
├─ app/                     ← FastAPI package
│  ├─ __init__.py           ← Marks the folder as a Python package
│  ├─ database.py           ← SQLAlchemy engine/session helpers
│  ├─ models.py             ← ORM tables (Employee, Skill)
│  ├─ schemas.py            ← Pydantic response models
│  └─ main.py               ← FastAPI app, routes, seeding
├─ employees.db             ← SQLite file created/seeded at startup
├─ requirements.txt         ← Backend dependencies (FastAPI, SQLAlchemy, etc.)
└─ Dockerfile               ← Container definition for the API
```

- **FastAPI** provides the HTTP layer, mounted in `app/main.py`.
- **SQLAlchemy 2.0** models + session management live in `app/database.py` and `app/models.py`.
- **Pydantic v2** response models (a.k.a. schemas) sit in `app/schemas.py` to keep persistence objects separate from payloads.
- **SQLite** persists the data in `employees.db`. The file is created/seeded automatically at startup so the service always has one employee with five skills available.

---

## 2. Database layer

### 2.1 `app/database.py`
Defines the SQLAlchemy engine and session factory:

- `SQLALCHEMY_DATABASE_URL = "sqlite:///./employees.db"` stores the DB file next to `backend/app`.
- `engine = create_engine(..., connect_args={"check_same_thread": False})` allows SQLite to be used safely with FastAPI's async-ish environment.
- `SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)` is injected into endpoints via the `get_db()` dependency generator.
- `Base = declarative_base()` is imported by `models.py` to declare ORM tables.

### 2.2 `app/models.py`
Holds the SQLAlchemy ORM classes:

- `Employee` maps to the `employees` table and exposes `id`, `full_name`, `position`, `avatar_url`, plus a `skills` relationship.
- `Skill` maps to the `skills` table with columns `id`, `name`, `level` (0–100), and `employee_id` as a foreign key. Each `Skill` references its parent through `employee = relationship("Employee", back_populates="skills")`.

The bidirectional relationship lets FastAPI return an employee together with every related skill in one query.

### 2.3 `app/schemas.py`
Contains the Pydantic models used for request/response validation:

- `SkillBase` defines the `name` and `level` fields; `Skill` extends it with the immutable `id` and `Config.from_attributes = True` so ORM objects can be serialized automatically.
- `EmployeeBase` carries `full_name`, `position`, and optional `avatar_url`; `Employee` adds the `id` and a list of `Skill` schemas. Default `skills: list[Skill] = []` ensures FastAPI always responds with an array.

These schemas act as a contract between backend and frontend; FastAPI uses them to generate OpenAPI docs and to filter out any unexpected columns.

---

## 3. Application bootstrap (`app/main.py`)

1. **Metadata creation** – `Base.metadata.create_all(bind=engine)` ensures the SQLite file has the `employees` and `skills` tables each time the service starts (idempotent).
2. **Seed data** – `init_db()` opens a session (`SessionLocal()`), checks whether at least one `Employee` exists, and if not, iterates over `seed_employees`, a list of dictionaries that describe multiple dummy users (e.g., Alejandro and Felipe). For each entry it creates an `Employee`, calls `db.flush()` to obtain the generated `id` without committing yet, then bulk-inserts the related `Skill` rows. Once every employee/skill has been staged, it calls `db.commit()` and closes the session in a `finally` block.
3. **FastAPI app** – `app = FastAPI(title="Employees Profile API")` sets up CORS for localhost origins (3000/5173) to match the React dev server and the Dockerized deployment.
4. **Endpoints**
   - `GET /health` returns `{"status": "Ok"}` for readiness checks.
   - `GET /employees/{employee_id}` injects the database session via `Depends(get_db)`, runs a query with SQLAlchemy ORM, and raises `HTTPException(404)` if the employee does not exist. Successful responses are serialized through `schemas.Employee` so the payload always includes `skills`.

Because seeding happens before the app instance is created, running `uvicorn app.main:app --reload --port 8000` is enough to get a fully populated API.

---

## 4. Request flow walkthrough

When the frontend (or `curl`) calls `GET /employees/1`:

1. FastAPI resolves the route in `main.py` and executes `get_employee()`.
2. The `db` argument receives a `Session` from `get_db()` (dependency injection).
3. SQLAlchemy builds a query against `models.Employee`. Because the relationship `skills` is lazy-loaded by default, accessing it later will issue a follow-up query, but the JSON response ends up containing both the employee data and every related skill.
4. The ORM instance is passed into the Pydantic schema `schemas.Employee`. With `Config.from_attributes = True`, Pydantic reads the ORM attributes (including the `skills` relationship) and produces plain Python data structures.
5. FastAPI serializes the schema into JSON and returns it to the caller.

This pipeline guarantees a clean separation between persistence (SQLAlchemy) and transport (Pydantic/FastAPI), and it keeps validation centralized.

---

## 5. Dependencies and runtime

- Listed in `backend/requirements.txt`: `fastapi==0.121.2`, `uvicorn[standard]==0.38.0`, and `SQLAlchemy==2.0.44`.
- Docker setup (`backend/Dockerfile`) installs the same requirements on top of `python:3.11-slim` and launches `uvicorn app.main:app --host 0.0.0.0 --port 8000`.
- `employees.db` is intentionally excluded from the Docker build context via `.dockerignore`. When the container starts, `Base.metadata.create_all` plus `init_db()` recreate and seed the file automatically inside the container.

---

## 6. Local development tips

1. `cd backend && python -m venv .venv && source .venv/bin/activate` (PowerShell: `.venv\Scripts\Activate`).
2. `pip install -r requirements.txt`.
3. `uvicorn app.main:app --reload --port 8000`.
4. Test endpoints with:
   ```bash
   curl http://127.0.0.1:8000/health
   curl http://127.0.0.1:8000/employees/1
   ```

To change the dummy data, edit `init_db()` in `app/main.py`, delete `employees.db`, and restart the server.

---

## 7. Extensibility notes

- **More employees** – add insert logic to `init_db()` or expose a `POST /employees` endpoint that writes new rows via SQLAlchemy.
- **Extra fields** – update `models.py` and `schemas.py` together; drop `employees.db` (in dev) so `create_all()` recreates it with the new columns.
- **Authentication** – the current login is purely navigational; to introduce real auth you would add FastAPI routes plus hashed credentials and update the frontend to call them.

With this map you can safely modify, extend, or troubleshoot any portion of the backend service.
