# syntax=docker/dockerfile:1

# Development stage (used by docker-compose for hot reload)
FROM node:20-slim AS dev
WORKDIR /app

# Expose Nitro host/port via environment variables (no secrets here)
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Install dependencies (use lockfile when present)
COPY package.json package-lock.json* npm-shrinkwrap.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source for development
COPY . .

# Nuxt dev server
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Dependency stage for production build
FROM node:20-slim AS deps
WORKDIR /app

# Install dependencies needed to build
COPY package.json package-lock.json* npm-shrinkwrap.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Build stage
FROM node:20-slim AS builder
WORKDIR /app

# Reuse installed dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Nuxt app
RUN npm run build

# Runtime stage (minimal, non-root)
FROM node:20-slim AS runner
WORKDIR /app

# Runtime environment variables (override at runtime as needed)
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
