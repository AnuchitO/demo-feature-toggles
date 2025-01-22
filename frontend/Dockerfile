FROM --platform=linux/arm64/v8 node:bookworm-slim AS base
# RUN apk update
# RUN apk add --no-cache libstdc++


WORKDIR /app

ARG VITE_BACKEND_BASE_URL
ARG VITE_API_KEY
ARG VITE_AUTH_DOMAIN
ARG VITE_PROJECT_ID
ARG VITE_APP_ID

COPY package*.json .
COPY *.lockb .
COPY vite.config.ts .


RUN npm install --legacy-peer-deps
ENV VITE_BACKEND_BASE_URL=https://demo-ft-api.anuchito.com \
    VITE_API_KEY=${VITE_API_KEY} \
    VITE_AUTH_DOMAIN=${VITE_AUTH_DOMAIN} \
    VITE_PROJECT_ID=${VITE_PROJECT_ID} \
    VITE_APP_ID=${VITE_APP_ID}

COPY . .

RUN npm run build

FROM --platform=linux/arm64/v8 node:bookworm-slim AS production
WORKDIR /app


COPY --from=base /app/dist/ /app/dist

EXPOSE 3000

# run preview
CMD ["npm", "run", "preview"]


