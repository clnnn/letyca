FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye as builder
WORKDIR /work

COPY package*.json /work/
RUN npm ci

COPY . .
RUN npm run build-frontend


FROM nginx:stable-alpine as nginx-production
WORKDIR /usr/share/nginx/html

COPY ./apps/client/docker-pack/default.conf.template /etc/nginx/templates/
COPY --chown=nginx:nginx --from=builder /work/dist/apps/client .

ENV NGINX_PORT=80
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh", "nginx", "-g", "daemon off;"]
