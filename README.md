# 🧩 AT-Prueba Monorepo

Este repositorio contiene dos proyectos principales:

- **Frontend (React + Vite)**: ubicado en `at-prueba/`
- **Backend (NestJS + PostgreSQL)**: ubicado en `bk-at-prueba/`

---

## 🚀 Requisitos

- [Node.js](https://nodejs.org/) v18 o superior
- [Docker y Docker Compose](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/)

---

## 🔧 Configuración del entorno

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/at-monorepo.git
cd at-monorepo
```

---
### 2. Clonar el repositorio

```bash
cd at-prueba && npm install
cd ../bk-at-prueba && npm install
```

---
### 3. Configurar las variables de entorno
FRONT
```bash
VITE_API_URL=http://localhost:3000
```

BACK
```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=bk_at_prueba
PORT=3002
NODE_ENV=development
```


---
### 4. Levantar la aplicación con Docker Compose
Desde la raíz del monorepo:
```bash
docker compose up -d --build
```

Esto hará:

- Levantar el contenedor de PostgreSQL

- Ejecutar las migraciones y seeders del backend

- Iniciar el backend (NestJS)

- Iniciar el frontend (React)

---
### 🌐 Acceso a la aplicación
Frontend: http://localhost:5173

Backend API: http://localhost:3000


---

### 📂 Estructura del repositorio
```bash
at-monorepo/
│
├── at-prueba/           # Proyecto frontend (React + Vite)
│   ├── .env.example
│   └── ...
│
├── bk-at-prueba/        # Proyecto backend (NestJS + PostgreSQL)
│   ├── .env.example
│   └── ...
│
├── docker-compose.yml   # Docker Compose principal del monorepo
└── README.md
```

---
# ✅ Recomendaciones adicionales

- Si vas a trabajar fuera de Docker, asegúrate de que PostgreSQL esté corriendo localmente con los mismos valores del .env.

- Si usas WSL2/Windows, asegúrate de configurar correctamente Docker Desktop para que las redes internas funcionen entre contenedores.