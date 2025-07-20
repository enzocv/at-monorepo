<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Sistema de Apuestas Deportivas

## Descripción Técnica General

Este proyecto es una API REST desarrollada con NestJS para gestionar apuestas deportivas. El sistema permite:

- Gestión de usuarios y autenticación mediante JWT
- Creación y gestión de eventos deportivos
- Sistema de apuestas con múltiples estados (Pendiente, Ganada, Perdida, Cash Out, Reembolsada)
- Funcionalidad de Cash Out con porcentaje configurable
- Sistema de cuotas para diferentes tipos de apuestas (Local, Empate, Visitante)

### Tecnologías Principales

- NestJS (Framework)
- PostgreSQL (Base de datos)
- TypeORM (ORM)
- JWT (Autenticación)
- Class Validator (Validación de DTOs)
- Docker y Docker Compose (Containerización)

## Cómo Levantar el Proyecto

### Prerrequisitos

- Node.js (v14 o superior)
- Docker y Docker Compose
- npm o yarn

### Configuración con Docker (Recomendado)

1. Primero, asegúrate de tener Docker y Docker Compose instalados:
```bash
docker --version
docker-compose --version
```

2. Configura el archivo `.env` en la raíz del proyecto:
```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_DATABASE=bk_at_prueba

# JWT Configuration
JWT_SECRET=tu_secreto_super_secreto

# App Configuration
PORT=3000
NODE_ENV=development
```

Este archivo `.env` se utilizará tanto para la configuración de Docker como para la aplicación NestJS.

3. El proyecto incluye un `docker-compose.yml` configurado con:
   - PostgreSQL 14 Alpine (imagen ligera)
   - Variables de entorno tomadas del archivo `.env`
   - Volumen para persistencia de datos
   - Red dedicada para futura escalabilidad

4. Iniciar el contenedor de PostgreSQL:
```bash
# Iniciar en segundo plano
docker-compose up --build -d

# Ver logs si es necesario
docker-compose logs -f
```

5. Verificar que el contenedor está corriendo:
```bash
docker-compose ps
```

### Comandos Docker Útiles

```bash
# Detener los contenedores
docker-compose down

# Detener y eliminar volúmenes (¡cuidado! esto eliminará los datos)
docker-compose down -v

# Ver logs
docker-compose logs

# Reiniciar el servicio
docker-compose restart postgres

# Entrar al contenedor de PostgreSQL
docker exec -it bk-at-prueba-db psql -U postgres -d bk_at_prueba

# Ver el estado de la base de datos
docker exec -it bk-at-prueba-db psql -U postgres -d bk_at_prueba -c '\dt'
```

### Configuración Alternativa (Sin Docker)

Si prefieres no usar Docker, puedes instalar PostgreSQL directamente:

1. Instalar PostgreSQL en tu sistema operativo
2. Crear la base de datos:
```sql
CREATE DATABASE bk_at_prueba;
```

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd bk-at-prueba
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Crear archivo `.env` en la raíz del proyecto
   - Copiar contenido de `.env.example`
   - Ajustar valores según tu entorno

4. Iniciar la base de datos:
```bash
# Iniciar el contenedor de PostgreSQL
docker-compose up -d

# Verificar que el contenedor está corriendo
docker ps
```

5. Inicializar la base de datos:
```bash
# Ejecutar migraciones para crear la estructura de la base de datos
npm run migration:run

# Cargar datos iniciales
npm run seed:run
```

6. Iniciar el servidor:
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

> **IMPORTANTE**: Los pasos 4 y 5 son esenciales para tener una base de datos funcional con datos de prueba.

### ¿Qué incluyen las migraciones y seeds?

- **Migraciones**: 
  - Crean todas las tablas necesarias (usuarios, eventos deportivos, apuestas, etc.)
  - Configuran relaciones entre tablas
  - Establecen índices y restricciones

- **Seeds**: 
  - Cargan eventos deportivos de ejemplo
  - Configuran cuotas predefinidas
  - Agregan otros datos necesarios para pruebas

### Solución de Problemas Comunes

Si encuentras errores durante la instalación:

1. Verificar el estado de Docker:
```bash
docker ps | grep bk_at_prueba_db
```

2. Si necesitas empezar desde cero:
```bash
# Detener y limpiar todo
docker-compose down -v

# Iniciar de nuevo
docker-compose up -d

# Esperar unos segundos y ejecutar migraciones y seeds
npm run migration:run && npm run seed:run
```

## Rutas Disponibles (API REST)

### Autenticación

#### Registro de Usuario
```http
POST /auth/register
Content-Type: application/json

{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123",
    "firstName": "Nombre",
    "lastName": "Apellido"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
}
```

### Eventos Deportivos

#### Listar Eventos
```http
GET /sports
```

#### Crear Evento (requiere autenticación)
```http
POST /sports
Content-Type: application/json

{
    "name": "Liga Ejemplo - Jornada 1",
    "homeTeam": "Equipo Local",
    "awayTeam": "Equipo Visitante",
    "eventDate": "2025-07-20T15:00:00Z",
    "homeTeamOdds": 1.85,
    "drawOdds": 3.25,
    "awayTeamOdds": 4.50
}
```

### Apuestas

#### Crear Apuesta
```http
POST /bets
Content-Type: application/json
Authorization: Bearer <tu_token>

{
    "sportEventId": "uuid-del-evento",
    "betType": "HOME",
    "amount": 100.50
}
```

#### Realizar Cash Out
```http
POST /bets/cash-out
Content-Type: application/json
Authorization: Bearer <tu_token>

{
    "betId": "uuid-de-la-apuesta"
}
```

#### Actualizar Estado de Apuesta
```http
PUT /bets/status
Content-Type: application/json
Authorization: Bearer <tu_token>

{
    "betId": "uuid-de-la-apuesta",
    "status": "WON"  // WON, LOST, REFUNDED
}
```

Para reembolsos, incluir razón:
```http
{
    "betId": "uuid-de-la-apuesta",
    "status": "REFUNDED",
    "refundReason": "Evento cancelado por lluvia"
}
```

#### Listar Apuestas del Usuario
```http
GET /bets
Authorization: Bearer <tu_token>
```

## Usuario Demo

Para pruebas, puedes usar el siguiente usuario demo:

```json
{
    "email": "demo@example.com",
    "password": "Demo123!"
}
```

### Notas sobre el Usuario Demo:
- Tiene acceso a todas las funcionalidades básicas
- Viene con algunas apuestas preexistentes para pruebas
- No tiene permisos de administrador

### Ejemplos de Flujos Comunes

1. **Realizar una apuesta y hacer cash out:**
```javascript
// 1. Login
POST /auth/login
{
    "email": "demo@example.com",
    "password": "Demo123!"
}

// 2. Ver eventos disponibles
GET /sports

// 3. Crear apuesta
POST /bets
{
    "sportEventId": "evento-id",
    "betType": "HOME",
    "amount": 100
}

// 4. Hacer cash out
POST /bets/cash-out
{
    "betId": "apuesta-id"
}
```

2. **Reembolsar una apuesta:**
```javascript
PUT /bets/status
{
    "betId": "apuesta-id",
    "status": "REFUNDED",
    "refundReason": "Evento cancelado"
}
```

### Consideraciones de Seguridad
- Todas las rutas de apuestas requieren autenticación
- Los tokens JWT expiran en 24 horas
- Las contraseñas se almacenan hasheadas
- Los montos se manejan con precisión decimal para evitar errores de redondeo
