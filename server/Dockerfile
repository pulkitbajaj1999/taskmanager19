# --- Base Image ---
FROM node:lts-bullseye-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g corepack@latest
RUN corepack enable

FROM base AS dependencies
WORKDIR /app

COPY package.json pnpm-*.yaml ./
COPY ./server/package.json ./server/package.json

RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY . .

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/server/node_modules ./server/node_modules

ENV PORT=8000

CMD [ "pnpm", "exec", "turbo", "--filter", "server", "start" ]