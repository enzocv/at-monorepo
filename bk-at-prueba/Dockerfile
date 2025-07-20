# Desarrollo
FROM node:20-alpine

# Instalar dependencias necesarias
RUN apk add --no-cache openssl

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias incluyendo devDependencies
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando para desarrollo con hot-reload
CMD ["npm", "run", "start:dev"]