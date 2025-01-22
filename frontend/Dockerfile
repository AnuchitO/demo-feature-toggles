FROM oven/bun:1.1.34-alpine AS base
RUN apk update
RUN apk add libstdc++

WORKDIR /app

ARG VITE_BACKEND_BASE_URL
ARG VITE_API_KEY
ARG VITE_AUTH_DOMAIN
ARG VITE_PROJECT_ID
ARG VITE_APP_ID

COPY package*.json .
COPY *.lockb .

RUN bun install --frozen-lockfile
ENV VITE_BACKEND_BASE_URL=https://demo-ft-api.anuchito.com \
    VITE_API_KEY=${VITE_API_KEY} \
    VITE_AUTH_DOMAIN=${VITE_AUTH_DOMAIN} \
    VITE_PROJECT_ID=${VITE_PROJECT_ID} \
    VITE_APP_ID=${VITE_APP_ID}

COPY . .

RUN bun run build:test

FROM oven/bun:1.1.34-alpine AS production
WORKDIR /app

COPY --from=base /app/.next-test/standalone/ /app
COPY --from=base /app/public/ /app/public
COPY --from=base /app/.next-test/static/ /app/.next-test/static

EXPOSE 5173

CMD ["bun", "run", "dev"]
