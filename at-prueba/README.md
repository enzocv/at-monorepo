# BetPro - Frontend

## Descripción
BetPro es una plataforma de apuestas deportivas que permite a los usuarios ver eventos deportivos, realizar apuestas y dar seguimiento a sus resultados. Este repositorio contiene el frontend de la aplicación, construido con React y TypeScript.

## Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Backend de BetPro corriendo en el puerto 3002 ([Repositorio del Backend](link-al-repo-backend))

## Tecnologías Principales

- React 18
- TypeScript
- Vite
- Redux Toolkit
- Axios
- Tailwind CSS
- shadcn/ui
- React Router DOM
- React Query
- date-fns

## Estructura del Proyecto

```
src/
├── components/         # Componentes de React
│   ├── ui/            # Componentes de UI reutilizables
│   └── ...            # Componentes específicos
├── contexts/          # Contextos de React
├── hooks/             # Hooks personalizados
├── lib/              # Utilidades y configuraciones
├── pages/            # Componentes de página
├── store/            # Configuración y slices de Redux
│   └── features/     # Slices de Redux
├── types/            # Definiciones de TypeScript
└── ...
```

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd at-prueba
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Configurar variables de entorno:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

## Ejecución

1. Asegurarse de que el backend esté corriendo en http://localhost:3000

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir http://localhost:8080 en el navegador

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run build:dev` - Construye la aplicación para desarrollo
- `npm run preview` - Previsualiza la build de producción localmente
- `npm run lint` - Ejecuta el linter

## Autenticación

La aplicación utiliza autenticación basada en JWT. Las credenciales de prueba son:

- Email: test@example.com
- Contraseña: 123456

El token JWT se almacena en localStorage y se incluye automáticamente en las cabeceras de las peticiones HTTP.

## Características Principales

### Eventos Deportivos
- Lista de eventos deportivos disponibles
- Filtrado por estado (activo/inactivo)
- Indicador de estado del evento (próximo, en vivo, finalizado)
- Cuotas actualizadas

### Apuestas
- Selección de tipo de apuesta (local, visitante, empate)
- Cálculo automático de ganancias potenciales
- Validación de montos y estados
- Historial de apuestas realizadas

## Estado de los Eventos

Los eventos deportivos tienen tres estados posibles:

1. **Próximo** (upcoming):
   - Evento que aún no comienza
   - Se muestra con badge gris
   - Disponible para apuestas si está activo

2. **En Vivo** (live):
   - Evento en curso (15 minutos antes hasta 2 horas después de la hora de inicio)
   - Se muestra con badge rojo y animación pulsante
   - Disponible para apuestas si está activo

3. **Finalizado** (finished):
   - Evento terminado (más de 2 horas después de la hora de inicio)
   - Se muestra con badge por defecto
   - No disponible para apuestas

## Integración con el Backend

La aplicación se comunica con el backend a través de una API REST:

- `POST /auth/login` - Autenticación de usuarios
- `GET /sports` - Obtención de eventos deportivos

La configuración de Axios se encuentra en `src/lib/axios.ts` y maneja automáticamente:
- URL base
- Headers de autenticación
- Interceptores de respuesta

## Manejo de Estado

Se utiliza Redux Toolkit para el manejo del estado global:

- `auth` - Estado de autenticación y usuario
- `sports` - Estado de eventos deportivos

## Consideraciones de Desarrollo

1. **Linting y Formateo**:
   - El proyecto usa ESLint con reglas estrictas
   - Se recomienda usar un editor con soporte para ESLint

2. **TypeScript**:
   - Todas las nuevas características deben incluir tipos
   - Evitar el uso de `any`

3. **Componentes**:
   - Usar componentes funcionales
   - Implementar lazy loading cuando sea posible
   - Seguir el patrón de componentes controlados

4. **Estilos**:
   - Usar las clases de Tailwind
   - Seguir el sistema de diseño establecido
   - Mantener la consistencia con shadcn/ui

## Despliegue

Para construir la aplicación para producción:

```bash
npm run build
```

Los archivos de la build se generarán en el directorio `dist/`.

## Solución de Problemas Comunes

1. **Error de CORS**:
   - Verificar que el backend esté corriendo
   - Comprobar la URL base en el archivo .env
   - Verificar que el backend permita el origen del frontend

2. **Errores de Autenticación**:
   - Limpiar localStorage
   - Verificar que el token no haya expirado
   - Comprobar las credenciales

3. **Problemas de Compilación**:
   - Ejecutar `npm clean-install`
   - Verificar versiones de Node y npm
   - Limpiar la caché de npm

## Contribución

1. Crear una rama para la nueva característica
2. Realizar los cambios siguiendo las guías de estilo
3. Ejecutar los linters y tests
4. Crear un pull request con una descripción detallada

## Recursos Adicionales

- [Documentación de React](https://reactjs.org/)
- [Documentación de Redux Toolkit](https://redux-toolkit.js.org/)
- [Documentación de shadcn/ui](https://ui.shadcn.com/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)

## Licencia

[MIT](LICENSE)
