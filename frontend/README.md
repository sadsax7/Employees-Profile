# Frontend Technical Guide (React + Vite + Material UI)

This document explains how the UI inside `frontend/` is organized, how routing works, and how data flows from the backend into visual components. Use it as a reference when extending the interface or wiring it to a different API.

---

## 1. Project scaffold

```
frontend/
├─ src/                     ← React source code
│  ├─ main.jsx              ← Entry point + router
│  ├─ App.jsx               ← Layout wrapper
│  ├─ App.css               ← Optional scaffold styles
│  ├─ index.css             ← Global reset/background
│  └─ pages/                ← Route-level components
│     ├─ LoginPage.jsx      ← Login form + navigation
│     ├─ ProfilePage.jsx    ← Fetches data + renders radar chart
│     └─ NotFoundPage.jsx   ← 404 screen
├─ public/                  ← Static assets served by Vite
├─ package.json             ← Scripts + dependencies
├─ vite.config.js           ← Vite setup
├─ eslint.config.js         ← ESLint rules
├─ Dockerfile               ← Frontend container build
└─ .env.example             ← Sample environment variables (`VITE_API_BASE_URL`)
```

- Created with `npm create vite@latest` (React variant).
- Uses `react-router-dom` for navigation, Material UI (`@mui/material` + Emotion) for UI components, and `recharts` for the radar chart.
- `package.json` scripts: `dev` (Vite dev server), `build`, `preview`, `lint`.

---

## 2. Entry point and routing

### 2.1 `src/main.jsx`

```jsx
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/:id" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
```

- `<App />` acts as a shared layout (see next section).
- Key routes:
  - `/` and `/login` render the login form.
  - `/profile` shows the default employee (ID `1`).
  - `/profile/:id` shows whichever employee ID is present in the URL.
  - Any unknown path falls back to the 404 page.

### 2.2 `src/App.jsx`
Provides a minimal layout wrapper that centers the content and renders the active child route via `<Outlet />`. Styling uses inline styles to keep the file dependency-free.

---

## 3. Pages and components

### 3.1 `pages/LoginPage.jsx`

- Uses `useState` to hold the `username` field and `useNavigate` to change routes after submit.
- The form is client-side only: on submit it prevents the default action and redirects to `/profile/<username>`. If the input is empty it falls back to `/profile/1`, so you can jump directly to any employee ID seeded in the database.
- UI elements (`TextField`, `Button`, `Paper`, etc.) come from Material UI for instant styling.

### 3.2 `pages/ProfilePage.jsx`

Responsible for fetching employee data and visualizing it.

- Constants:
  ```jsx
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
  ```
  `VITE_API_BASE_URL` can be overridden by copying `.env.example` to `.env` and editing the value. Vite injects the variable at build time (during `npm run dev` or `npm run build`).

- Data fetching:
  ```jsx
  const { id } = useParams();
  const employeeId = id || 1;

  useEffect(() => {
    const fetchEmployee = async () => {
      const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`);
      ...
    };
    fetchEmployee();
  }, [employeeId]);
  ```
  The hook handles loading/error/success and re-runs whenever the route parameter changes. Visiting `/profile` without an ID still displays employee `1`.

- Radar chart:
  Converts `employee.skills` into the format expected by Recharts and renders `RadarChart` + `PolarGrid` + `Radar`. The `domain` is fixed to `[0, 100]` because skill levels are stored as percentages.

- Details list:
  After the chart, a Material UI `List` displays each skill with its score for accessibility.

### 3.3 `pages/NotFoundPage.jsx`

Shows a friendly 404 message with a button to return the user to `/login` using `navigate()`.

---

## 4. Styling

- `src/index.css` applies a light reset, sets the system font stack, and paints the page background (`#202124`).
- `src/App.css` contains boilerplate styles from Vite; only the `#root` centering rules are relevant if you import this file elsewhere.
- Material UI components bring consistent padding/typography without a custom theme, keeping the bundle small.

---

## 5. Data flow summary

1. User opens `/login`, fills the form, and hits “Login”.
2. The username input is treated as the employee ID, so React Router redirects to `/profile/<id>` (or `/profile` if empty, which implies `1`).
3. `ProfilePage` reads the `id` param (default `1`) and calls `GET {VITE_API_BASE_URL}/employees/{id}`.
4. FastAPI responds with the employee object (see `backend/app/main.py`).
5. The page renders the avatar, metadata, radar chart, and skill list.
6. If the request fails, an error message is displayed instead of the profile.

---

## 6. Environment variables

- `.env.example` defines `VITE_API_BASE_URL=http://127.0.0.1:8000`.
- Copy it to `.env` to customize the backend URL locally: `cp .env.example .env` (Windows: `copy .env.example .env`).
- When building Docker images, pass the desired API URL through the `VITE_API_BASE_URL` build arg (see `docker-compose.yml`, which sets it to `http://localhost:8000` so the host browser can reach the backend).

---

## 7. Running and building

- **Development**: `npm install && npm run dev` (served on `http://localhost:5173`). Requires the backend running on `VITE_API_BASE_URL`.
- **Production build**: `npm run build` emits static assets in `dist/`. `npm run preview -- --host 0.0.0.0 --port 4173` reproduces the production server; this is the same command executed inside the Docker container.

With this guide you can confidently extend components, adjust routing, or plug the UI into a different API while keeping the current behavior intact.
