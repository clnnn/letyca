FROM mcr.microsoft.com/devcontainers/typescript-node:20 as builder
WORKDIR /work

COPY package*.json /work/
RUN npm ci

COPY . .
RUN npm run prisma-generate
RUN npm run baml-generate
RUN npm run build-backend

FROM mcr.microsoft.com/devcontainers/typescript-node:20 as production

WORKDIR /app

COPY --from=builder /work/dist/apps/server .
COPY --from=builder /work/node_modules ./node_modules
COPY --from=builder /work/prisma ./prisma

COPY ./apps/server/docker-pack/start.sh ./start.sh

EXPOSE 3000
ENTRYPOINT ["/bin/sh", "start.sh"]
