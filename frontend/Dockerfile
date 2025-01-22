FROM oven/bun:1.1.34-alpine AS base
RUN apk update
RUN apk add --no-cache libstdc++


WORKDIR /app

ARG VITE_BACKEND_BASE_URL
ARG VITE_API_KEY
ARG VITE_AUTH_DOMAIN
ARG VITE_PROJECT_ID
ARG VITE_APP_ID

COPY package*.json .
COPY *.lockb .
COPY vite.config.ts .


RUN bun install
ENV VITE_BACKEND_BASE_URL=https://demo-ft-api.anuchito.com \
    VITE_API_KEY=${VITE_API_KEY} \
    VITE_AUTH_DOMAIN=${VITE_AUTH_DOMAIN} \
    VITE_PROJECT_ID=${VITE_PROJECT_ID} \
    VITE_APP_ID=${VITE_APP_ID}

COPY . .

RUN bun run build

FROM oven/bun:1.1.34-alpine AS production
WORKDIR /app


COPY --from=base /app/dist/ /app/dist

EXPOSE 3000

# bun run preview
CMD ["bun", "run", "preview"]


