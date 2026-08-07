# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development commands

This project uses Bun (see `bun.lock`) with Nuxt 3.

- Install dependencies: `bun install`
- Start the development server: `bun run dev`
- Build for production: `bun run build`
- Generate a static build: `bun run generate`
- Preview the production build: `bun run preview`
- Prepare Nuxt types/modules: `bun run postinstall` or `bunx nuxt prepare`
- Run the legacy DB initializer stub: `bun run db:init`

There are currently no lint or test scripts in `package.json`. If adding tests, add the corresponding script before documenting a single-test command.

## Architecture overview

- The app is a Nuxt 3/Vue 3 portfolio site. `app.vue` owns global head metadata, JSON-LD setup, and renders the active page via `<NuxtPage />`.
- The public homepage is `pages/index.vue`, composed from section components in `components/` (`Header`, `About`, `Projects`, `Experience`, `Education`, `Certifications`, `Skills`, `SystemTools`, `CodingStats`, `NowPlaying`, `Contact`, `Footer`).
- Static portfolio data lives in `data/*.json`, with shared TypeScript shapes and label helpers in `data/types.ts`. Read-only server endpoints in `server/api/` import these JSON files directly.
- There is no admin panel and no authentication. Content is edited by changing the JSON files in `data/` directly, so there are no write APIs, JWT handling, or protected routes.
- Database support has been removed. Data is served from static JSON files instead of PostgreSQL.
- Runtime integrations are implemented as Nitro API routes in `server/api/`, including GitHub contributions, Spotify now playing, WakaTime/stats, and seed/check endpoints.
- Global styling is in `assets/css/main.css`; Tailwind customization is in `tailwind.config.js`. Nuxt UI, Nuxt Content, Nuxt Image, and sitemap support are configured in `nuxt.config.ts`.
- SEO/site behavior is split between `app.vue`, `composables/seo.ts`, `composables/useJsonLd.ts`, and `nuxt.config.ts` site/sitemap/route rules.

## Environment notes

README-documented environment variables include:

- `GITHUB_TOKEN`
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`
- `NUXT_PUBLIC_RESUME_URL`

All of these are optional integration credentials for public, read-only features. No auth-related secrets are required.

## Graphify

This project may have a knowledge graph at `graphify-out/`.

- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists.
- Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current when the graph exists.
