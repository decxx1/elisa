FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80
ENV DATABASE_PATH=/app/data/app.db

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/scripts ./scripts

RUN mkdir -p /app/data
VOLUME ["/app/data"]
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

CMD ["node", "./dist/server/entry.mjs"]
