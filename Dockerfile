# syntax=docker/dockerfile:1

# Development stage (used by docker-compose for hot reload)
FROM oven/bun:1 AS dev
WORKDIR /app

# Expose Nitro host/port via environment variables
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source for development
COPY . .

# Nuxt dev server
EXPOSE 3000
CMD ["bun", "run", "dev", "--", "--host", "0.0.0.0"]

# Dependency stage for production build
FROM oven/bun:1 AS deps
WORKDIR /app

# Install dependencies needed to build
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build stage
FROM oven/bun:1 AS builder
WORKDIR /app

# Reuse installed dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Nuxt app
RUN bun run build

# Runtime stage (minimal, non-root)
FROM node:20-slim AS runner
WORKDIR /app

# Runtime environment variables
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
ENV PORT=3000

# Create a non-root user to run the app
RUN useradd --user-group --create-home --shell /usr/sbin/nologin appuser

# Copy only the built output
COPY --from=builder /app/.output ./.output

# Drop privileges
USER appuser

# Expose the app port
EXPOSE 3000

# Start the Nuxt server
CMD ["node", ".output/server/index.mjs"]
