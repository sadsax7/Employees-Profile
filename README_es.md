# Employees Profile – guía paso a paso para quienes nunca han programado

Bienvenido. Este repositorio contiene el código mínimo necesario para cumplir un reto muy específico: mostrar el perfil de una persona que trabaja en Factored usando un backend en **FastAPI + SQLite** y un frontend en **React + Material UI + Recharts**. Aquí encontrarás la explicación sencilla de qué hace cada parte, cómo encenderla y qué cosas siguen pendientes.\
Prefer English? Open `README.md`.

---

## 1. Resumen del reto

> "Quiero un sistema muy simple con login y una página de perfil que tenga nombre, cargo, avatar, habilidades en forma de gráfico tipo araña, 404, backend y base de datos. Si es posible, dockerízalo y documenta todo para alguien que no sabe programar."

Este repositorio cumple con todo lo pedido: incluye login, perfil con gráfico radar, backend con base de datos, documentación para principiantes y contenedores Docker listos para usarse.

---

## 2. ¿Se cumple lo solicitado?

| Requisito del reto | Estado | ¿Dónde se implementa? |
| --- | --- | --- |
| Login muy básico que lleve al perfil | ✅ | `frontend/src/pages/LoginPage.jsx`
| Página de perfil con nombre, cargo y avatar | ✅ | `frontend/src/pages/ProfilePage.jsx`
| Gráfico tipo araña con habilidades | ✅ Radar Chart con Recharts en `ProfilePage.jsx`
| Base de datos (≥1 persona y ≥5 skills) | ✅ SQLite `backend/employees.db`, modelos en `backend/app/models.py`
| Backend que exponga los datos | ✅ FastAPI en `backend/app/main.py`
| Página 404 | ✅ `frontend/src/pages/NotFoundPage.jsx`
| Documentación clara | ✅ Este README + `backend/README.md` + `frontend/README.md` + `README.md`
| Solución dockerizada | ✅ `docker-compose.yml` + Dockerfiles para backend y frontend

---

## 3. Mapa mental del proyecto

```
employees-profile/
├─ README.md                ← Guía especial en inglés
├─ README_es.md             ← Este documento en español
├─ backend/README.md        ← Documentación técnica del backend FastAPI
├─ frontend/README.md       ← Documentación técnica del frontend React
├─ docker-compose.yml       ← Archivo Compose que inicia backend + frontend
├─ backend/
│  ├─ app/                  ← Paquete FastAPI con rutas, modelos y esquemas
│  │  ├─ __init__.py        ← Indica que la carpeta es un paquete Python
│  │  ├─ database.py        ← Engine/session de SQLAlchemy
│  │  ├─ models.py          ← Modelos ORM Employee y Skill
│  │  ├─ schemas.py         ← Modelos Pydantic para las respuestas
│  │  └─ main.py            ← App FastAPI, CORS, seed y endpoints
│  ├─ employees.db          ← Archivo SQLite con el empleado dummy
│  ├─ requirements.txt      ← Dependencias FastAPI/SQLAlchemy
│  └─ Dockerfile            ← Imagen del backend
└─ frontend/
   ├─ src/                  ← Código React (páginas, router, estilos)
   │  ├─ main.jsx           ← Punto de entrada + React Router
   │  ├─ App.jsx            ← Layout que renderiza `<Outlet />`
   │  ├─ App.css            ← Estilos opcionales del scaffold
   │  ├─ index.css          ← Reset global + fondo
   │  └─ pages/             ← Login, Profile y NotFound
   ├─ package*.json         ← Scripts y dependencias NPM
   ├─ .env.example          ← Ejemplo de `VITE_API_BASE_URL`
   └─ Dockerfile            ← Imagen del frontend
```

---

## 4. Antes de tocar nada

1. **Instala Python 3.11 o superior.** Descárgalo desde [python.org](https://www.python.org/downloads/). Marca la casilla "Add python to PATH" en Windows.
2. **Instala Node.js 20 LTS o superior.** Lo encuentras en [nodejs.org](https://nodejs.org). Viene con `npm`, que usaremos para el frontend.
3. **Ten a mano una terminal.** En Windows puedes usar "PowerShell" o "Terminal". En macOS/Linux usa "Terminal".
4. **(Opcional) Instala un editor.** Visual Studio Code facilita abrir carpetas y archivos.

Con eso basta; no necesitas conocer programación.

---

## 5. Cómo encender el backend (FastAPI + SQLite)

> Hazlo una sola vez siguiendo el orden. Si en algún paso ves un error, copia el mensaje exacto para entender qué falta.

1. Abre una terminal y entra a la carpeta del backend:
   ```bash
   cd employees-profile/backend
   ```
2. Crea un entorno virtual (sirve para no mezclar dependencias con el resto de tu computadora):
   ```bash
   python -m venv .venv
   ```
3. Activa el entorno:
   - En macOS / Linux:
     ```bash
     source .venv/bin/activate
     ```
   - En Windows (PowerShell):
     ```powershell
     .venv\Scripts\Activate
     ```
4. Instala las dependencias del backend:
   ```bash
   pip install -r requirements.txt
   ```
5. Arranca el servidor FastAPI con recarga automática en el puerto 8000:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
6. Mantén esta terminal abierta. Verás mensajes como `Application startup complete`. Mientras esté encendida, el backend responde en `http://127.0.0.1:8000`.

### ¿Cómo sé que funcionó?
- Abre tu navegador y visita `http://127.0.0.1:8000/health`. Deberías ver `{"status":"Ok"}`.
- Visita `http://127.0.0.1:8000/employees/1` y verás el JSON completo del empleado dummy.
- También puedes abrir `http://127.0.0.1:8000/docs` para usar la documentación interactiva de FastAPI.

> Si algún paquete falla al instalar, revisa que `requirements.txt` esté guardado como archivo de texto UTF-8. Si ves caracteres raros al abrirlo, vuelve a guardarlo desde tu editor con la codificación correcta.

---

## 6. Cómo encender el frontend (React + Material UI + Recharts)

1. Abre otra terminal (o pestaña nueva) y navega a la carpeta del frontend:
   ```bash
   cd employees-profile/frontend
   ```
2. Instala las dependencias con npm (solo la primera vez tarda unos minutos):
   ```bash
   npm install
   ```
3. (Opcional pero recomendado) Copia el archivo de ejemplo de variables a uno real para poder apuntar al backend que quieras:
   ```bash
   cp .env.example .env    # En Windows usa: copy .env.example .env
   ```
   Si cambias el puerto o la URL del backend, modifica `VITE_API_BASE_URL` dentro de `.env`.
4. Levanta el servidor de desarrollo de Vite en el puerto 5173:
   ```bash
   npm run dev
   ```
5. Vite te mostrará una URL parecida a `http://localhost:5173`. Entra a ese enlace desde el navegador. El frontend se conectará automáticamente al backend que corre en `http://127.0.0.1:8000`. Puedes visitar `/profile` (empleado `1` por defecto) o `/profile/2`, `/profile/3`, etc., para ver otros IDs.

> Tienes que dejar encendidas **las dos terminales** (backend y frontend). Si cierras alguna, actualiza la página y verás un error.

---

## 7. ¿Qué verás al usar la app?

1. **Login very simple** (`/` o `/login`): formulario hecho con Material UI. El campo “Username” se interpreta como el ID del empleado que quieres consultar (ej. escribe `2` para ir a `/profile/2`). Si lo dejas vacío, utiliza el empleado `1`.
2. **Página de perfil (`/profile` o `/profile/:id`)**:
   - Muestra el **nombre**, **cargo** y **avatar** del empleado solicitado.
   - Tiene un **gráfico tipo araña (RadarChart)** que refleja todas sus habilidades sobre 100 puntos.
   - Debajo verás la lista textual de habilidades para quienes prefieren leer.
3. **Página 404 (`cualquier ruta desconocida`)**: mensaje grande "404" con un botón para volver al login.

Todo el diseño usa componentes de Material UI. El gráfico es de la librería `recharts`. La navegación se maneja con `react-router-dom`.

---

## 8. API y base de datos en palabras simples

- **Base de datos:** Es un archivo `backend/employees.db` tipo SQLite. No necesitas instalar nada extra; es un archivo plano. Al arrancar se insertan varios empleados (Alejandro, Felipe, etc.) para que pruebes `/employees/1`, `/employees/2`, ...
- **Tablas principales:** `employees` y `skills`. Un empleado puede tener varias habilidades.
- **Datos de ejemplo:** Se cargan automáticamente al arrancar FastAPI (`init_db()` dentro de `backend/app/main.py`). Recorre una lista de empleados y crea cada registro con sus skills; puedes editarla para agregar o quitar personas.
- **Endpoints principales:**
  - `GET /health` → responde `{"status": "Ok"}` para saber si vive.
  - `GET /employees/{id}` → devuelve el empleado con sus habilidades en formato JSON, por ejemplo:
    ```json
    {
      "id": 1,
      "full_name": "Alejandro Arango Mejía",
      "position": "Software Engineer",
      "avatar_url": "https://avatars.githubusercontent.com/u/1?v=4",
      "skills": [
        { "id": 1, "name": "Python", "level": 90 },
        { "id": 2, "name": "SQL", "level": 75 },
        { "id": 3, "name": "FastApi", "level": 85 },
        { "id": 4, "name": "Docker", "level": 78 },
        { "id": 5, "name": "Software Engineer", "level": 71 }
      ]
    }
    ```
El **avatar_url** usa Robohash para generar un avatar único para cada empleado.

Si agregas más empleados o habilidades, recuerda reiniciar el servidor para que FastAPI vuelva a leer el archivo.

---

## 9. Pruebas rápidas sin frontend

Si prefieres comprobar con la terminal:

```bash
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/employees/1
curl http://127.0.0.1:8000/employees/2
```

También puedes usar herramientas como Postman o Bruno; solo pegá la URL y presiona "Send".

---

## 10. Limitaciones actuales y siguientes pasos sugeridos

1. **Login sin seguridad real:** Solo navega a `/profile`. Si necesitas autenticación real, habría que crear un endpoint en FastAPI y validar las credenciales.
2. **Ingreso manual de ID:** La UI te pide escribir el ID del empleado. Una mejora futura sería mostrar un listado/selector (por ejemplo con un endpoint `GET /employees`) para no depender de IDs conocidos.
3. **Datos persistentes:** SQLite guarda todo en `backend/employees.db`. Si lo borras, FastAPI lo vuelve a crear con los datos definidos en `init_db()`. Para mantener información distinta entre ejecuciones deberías conservar ese archivo o montar un volumen al correr con Docker.

Todo lo demás funciona conforme al alcance solicitado.

---

## 11. Preguntas frecuentes

- **¿Necesito saber programar?** No. Solo debes seguir las instrucciones tal como están. Si algo falla, copia el error y busca "FastAPI" + el mensaje en Google.
- **¿Puedo cambiar los datos del empleado?** Sí. Edita `init_db()` en `backend/app/main.py`, borra `backend/employees.db` y vuelve a ejecutar el backend para que se regenere con los nuevos datos.
- **¿Cómo cierro todo?** Pulsa `Ctrl + C` en cada terminal (backend y frontend). Luego desactiva el entorno virtual con `deactivate`.
- **¿Puedo usar otro puerto?** Sí, cambia `--port` en Uvicorn y adapta `VITE_API_BASE_URL` (en tu archivo `.env`) para que apunte al nuevo puerto del backend.
- **¿Puedo borrar la base y que se regenere?** Sí. Siempre que `init_db()` tenga los datos que quieres, bastará con borrar `backend/employees.db` (o el volumen en Docker) antes de encender el backend; FastAPI detecta que está vacía y la vuelve a poblar.
- **¿Cómo apunto el frontend a otra URL del backend?** Copia `frontend/.env.example` a `frontend/.env` y reemplaza `VITE_API_BASE_URL` con la URL que corresponda. El proyecto lee ese valor automáticamente en tiempo de compilación.
- **¿Y Docker?** Usa las instrucciones del siguiente apartado; todo ya está dockerizado.

---

## 12. Ejecutar todo con Docker (modo recomendado para mostrar el reto)

> Requisitos previos: Docker Desktop (Windows/macOS) o Docker Engine + Docker Compose Plugin (Linux).

1. Desde la raíz del repo corre:
   ```bash
   docker compose up --build
   ```
2. La primer vez tardará porque construye dos imágenes:
   - `employees-backend`: FastAPI sobre Python 3.11 expuesto en `http://localhost:8000`.
   - `employees-frontend`: build de React + Vite servido con `npm run preview` en `http://localhost:5173`.
3. Cuando veas que ambos servicios dicen `started`, visita:
   - `http://localhost:5173` → login y luego perfil con el gráfico radar (puedes abrir `/profile/2` para el segundo empleado).
   - `http://localhost:8000/docs` → documentación interactiva del backend.
4. Para detenerlos, presiona `Ctrl + C` y luego (opcional) borra los contenedores con:
   ```bash
   docker compose down
   ```
> El archivo Compose compila el frontend con `VITE_API_BASE_URL=http://localhost:8000` para que tu navegador (que corre en el host) llegue al backend. Si corres los contenedores en otro servidor, cambia ese argumento en `docker-compose.yml` para apuntar a la URL pública del backend.

### Personalizaciones rápidas con Docker
- **Cambiar el API base del frontend**: edita `frontend/.env.example` antes de correr `docker compose up`, o pasa un parámetro de build distinto `docker compose build --build-arg VITE_API_BASE_URL=http://... frontend`.
- **Datos distintos en la DB**: modifica `init_db()` y reconstruye la imagen del backend (`docker compose build backend`) para que la próxima ejecución arranque con tu información dummy.

---

Con esto, ya puedes clonar el proyecto y correrlo localmente o con docker, Buena suerte!
