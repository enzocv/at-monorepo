# Etapa 1: build
FROM node:lts-bullseye AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: servir con Nginx
FROM nginx:alpine
ADD nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /var/www/app/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]