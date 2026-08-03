# Graph Report - MyPortfolio-Website  (2026-08-03)

## Corpus Check
- 74 files · ~29,554 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 517 nodes · 507 edges · 76 communities (62 shown, 14 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 44 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `28e51b0b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Projects Section Component
- Nuxt Dependencies
- Icon Libraries
- GitHub Contributions Widget
- Project Documentation
- Project Detail Component
- Admin Projects Page
- Coding Stats Widget
- Admin Certifications Page
- Admin Education Page
- Admin Experiences Page
- Admin Skills Page
- Experience Section Component
- Now Playing Widget
- Contact Form Component
- System Tools Widget
- Education Section Component
- PWA Manifest
- Admin Dashboard Page
- Admin Login Page
- Certifications Component
- News Project Screenshot
- OG Social Image
- Image Migration Script
- Migration Verification Script
- Admin Layout
- Resume Page
- Portfolio Screenshot
- Learning Types
- Vercel Config
- Settings Component
- Techno Component
- Blog Project Screenshot
- Selerarasasunda Screenshot
- Database Seed Script
- Spotify API Integration
- About Component
- Profile Photo
- ERKA Dashboard Screenshot
- Payment Landing Screenshot
- Root TSConfig
- Server TSConfig
- GitHub API Endpoint
- Confetti Button
- Flappy Bird Screenshot
- Currency API Endpoint
- Agent Workflow Skills
- Footer Component
- Header Component
- Favicon

## God Nodes (most connected - your core abstractions)
1. `Portfolio Website | Ababil Mustaqim` - 12 edges
2. `Perbaikan SEO yang Telah Dilakukan` - 9 edges
3. `README - Portfolio Website | Ababil Mustaqim` - 8 edges
4. `SEO Optimization - Ababil Mustaqim Portfolio` - 7 edges
5. `SEO Optimization Report` - 7 edges
6. `scripts` - 6 edges
7. `Architecture overview` - 6 edges
8. `Cara Test SEO` - 6 edges
9. `Environment notes` - 5 edges
10. `Files yang Dibuat/Dimodifikasi` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Vercel Deployment` --semantically_similar_to--> `Docker Compose Web Service`  [INFERRED] [semantically similar]
  README.md → docker-compose.yml
- `Docker Runtime Environment Config` --conceptually_related_to--> `Static JSON Data Layer (Database Removal)`  [AMBIGUOUS]
  docker-compose.yml → CLAUDE.md
- `SEO Optimization Report` --conceptually_related_to--> `Architecture overview`  [INFERRED]
  SEO_OPTIMIZATION.md → CLAUDE.md
- `Docker Runtime Environment Config` --shares_data_with--> `Environment notes`  [INFERRED]
  docker-compose.yml → CLAUDE.md
- `public/robots.txt Crawl Rules` --conceptually_related_to--> `JWT-Protected Admin Write APIs`  [INFERRED]
  public/robots.txt → CLAUDE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Shared Environment Variable Configuration Across Docs** — claude_environment_notes, readme_environment_variables, docker_compose_environment [INFERRED 0.85]
- **SEO Crawl Control Stack (Robots + Sitemap)** — seo_optimization_robots_txt, public_robots_rules, public__robots_rules, seo_optimization_sitemap [INFERRED 0.85]
- **Third-Party Runtime API Integrations** — claude_nitro_api_integrations, readme_github_integration, readme_spotify_integration [INFERRED 0.85]

## Communities (76 total, 14 thin omitted)

### Community 0 - "Projects Section Component"
Cohesion: 0.07
Nodes (27): availableTechnologies, ContentProject, currentFilter, currentNumberOfProjects, { data: allProjects }, projectsList, selectedTechFilters, techFilterModalOpen (+19 more)

### Community 1 - "Nuxt Dependencies"
Cohesion: 0.06
Nodes (31): @iconify-json/fluent-emoji-flat, @iconify-json/tabler, isomorphic-dompurify, jose, js-confetti, marked, nuxt, @nuxt/image (+23 more)

### Community 2 - "Icon Libraries"
Cohesion: 0.07
Nodes (29): @iconify-json/devicon, @iconify-json/fa6-brands, @iconify-json/logos, @iconify-json/material-symbols, @iconify-json/material-symbols-light, @iconify-json/octicon, @iconify-json/simple-icons, @iconify-json/skill-icons (+21 more)

### Community 3 - "GitHub Contributions Widget"
Cohesion: 0.06
Nodes (31): 1. **Domain Configuration** 🔄, 1. **Google PageSpeed Insights**, 1. **Meta Tags Lengkap** ✅, 2. **Content Optimization** 📝, 2. **Google Search Console**, 2. **Structured Data (JSON-LD)** ✅, 3. **Analytics** 📊, 3. **Favicon dan Icons** ✅ (+23 more)

### Community 5 - "Project Documentation"
Cohesion: 0.10
Nodes (28): Architecture overview, Development commands, CLAUDE.md - Project Guidance for Claude Code, Environment notes, Graphify, Graphify Knowledge Graph Workflow, JWT-Protected Admin Write APIs, Nitro API Runtime Integrations (GitHub / Spotify / WakaTime) (+20 more)

### Community 6 - "Project Detail Component"
Cohesion: 0.25
Nodes (7): blurb, category, ContentProject, detailHref, hasLive, isClosedSource, props

### Community 7 - "Admin Projects Page"
Cohesion: 0.13
Nodes (14): confirmDelete(), deletingItem, editingItem, fetchItems(), form, getHeaders(), { getToken }, imagePreview (+6 more)

### Community 8 - "Coding Stats Widget"
Cohesion: 0.17
Nodes (10): errorMessage, fetchWakaTimeStats(), formattedBestDay, hasError, isLoading, Language, refreshData(), refreshing (+2 more)

### Community 9 - "Admin Certifications Page"
Cohesion: 0.15
Nodes (13): confirmDelete(), deletingItem, editingItem, fetchItems(), form, getHeaders(), { getToken }, items (+5 more)

### Community 10 - "Admin Education Page"
Cohesion: 0.15
Nodes (13): confirmDelete(), deletingItem, editingItem, fetchItems(), form, getHeaders(), { getToken }, items (+5 more)

### Community 11 - "Admin Experiences Page"
Cohesion: 0.15
Nodes (13): confirmDelete(), deletingItem, editingItem, fetchItems(), form, getHeaders(), { getToken }, items (+5 more)

### Community 12 - "Admin Skills Page"
Cohesion: 0.15
Nodes (13): confirmDelete(), deletingItem, editingItem, fetchItems(), form, getHeaders(), { getToken }, items (+5 more)

### Community 13 - "Experience Section Component"
Cohesion: 0.10
Nodes (13): { data: rawEducation }, items, LocaleType, { data: rawExperiences }, items, LocaleType, typeLabel, expanded (+5 more)

### Community 14 - "Now Playing Widget"
Cohesion: 0.19
Nodes (12): currentProgress, error, fetchNowPlaying(), handleVisibilityChange(), isHovering, isLoading, lastFetchTime, localProgress (+4 more)

### Community 15 - "Contact Form Component"
Cohesion: 0.18
Nodes (8): ContactFormData, errorMessage, formState, hasError, isSubmitted, isSubmitting, schema, socialLinks

### Community 16 - "System Tools Widget"
Cohesion: 0.10
Nodes (18): bodySource, { data: projects, pending: projectsPending }, hasLivePreview, imageErrored, imageLoaded, initials, isClosedSource, isDark (+10 more)

### Community 17 - "Education Section Component"
Cohesion: 0.12
Nodes (16): 📝 Adding Content, 🔄 API Integration, 📧 Contact, 🌐 Deployment, ✨ Features, 🚀 Getting Started, GitHub Contributions, Installation (+8 more)

### Community 18 - "PWA Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 19 - "Admin Dashboard Page"
Cohesion: 0.25
Nodes (5): colorMap, { getToken }, loading, sections, stats

### Community 20 - "Admin Login Page"
Cohesion: 0.25
Nodes (6): error, loading, { login, isLoggedIn }, password, router, showPassword

### Community 21 - "Certifications Component"
Cohesion: 0.25
Nodes (3): ContentCertification, { data: certifications }, selected

### Community 22 - "News Project Screenshot"
Cohesion: 0.38
Nodes (7): News Card Grid Layout, Category Filter Tabs, Dark Theme UI with Orange Accents, The Guardian and BBC News Sources, Headline Search Bar, News Aggregator Project Screenshot, News Aggregator Web App

### Community 23 - "OG Social Image"
Cohesion: 0.67
Nodes (6): Ababil Mustaqim (Portfolio Owner), Backend Developer Role, Bandung, Indonesia (Location), Open Graph Social Share Image, portfolio.ababilmustaqim.dev (Website URL), Tech Stack (Python, Django, Flask, Node.js, PostgreSQL, Vue.js, Nuxt.js, REST API, Docker)

### Community 24 - "Image Migration Script"
Cohesion: 0.33
Nodes (4): code, is404, props, title

### Community 25 - "Migration Verification Script"
Cohesion: 0.50
Nodes (4): parseGitHubRepo(), ProjectRecord, projects, repo_linkIsClosed()

### Community 26 - "Admin Layout"
Cohesion: 0.40
Nodes (4): { isLoggedIn, logout }, navItems, route, sidebarOpen

### Community 27 - "Resume Page"
Cohesion: 0.40
Nodes (4): hasResume, resumeFile, resumeLink, runtimeConfig

### Community 28 - "Portfolio Screenshot"
Cohesion: 0.60
Nodes (5): Dark Theme UI Design, Hero Section with CTA Buttons and Social Links, Portfolio Website Project Screenshot, Featured Projects Card Grid, Right Sidebar Widgets (Now Playing, System Tools, Coding Activity)

### Community 30 - "Vercel Config"
Cohesion: 0.40
Nodes (4): buildCommand, framework, outputDirectory, routes

### Community 32 - "Techno Component"
Cohesion: 0.50
Nodes (3): ContentSkill, props, technoData

### Community 33 - "Blog Project Screenshot"
Cohesion: 0.67
Nodes (4): Blog Project Screenshot, Blog Listing UI, Dark Theme Design, Portfolio Project Showcase Image

### Community 34 - "Selerarasasunda Screenshot"
Cohesion: 0.67
Nodes (4): Menu Card List Layout Pattern, Selera Rasa Sunda App Screenshot, Sundanese Food Ordering UI Concept, Warm Earth-Tone Traditional Aesthetic

### Community 36 - "Spotify API Integration"
Cohesion: 0.50
Nodes (3): SpotifyCurrentlyPlayingResponse, SpotifyTokenResponse, tokenStorage

### Community 38 - "Profile Photo"
Cohesion: 1.00
Nodes (3): Profile Photo (photo.jpeg), Portrait of a Young Man, Portfolio Profile/Avatar Image

### Community 39 - "ERKA Dashboard Screenshot"
Cohesion: 1.00
Nodes (3): ERKA Project Screenshot, ERKA Dashboard UI (Enterprise Resource Knowledge Architecture), Project Management System Concept

### Community 40 - "Payment Landing Screenshot"
Cohesion: 1.00
Nodes (3): Dark-Themed SaaS Landing Page Layout Pattern, Payment Gateway Landing Page Screenshot, Payment Gateway Landing Page (Fictional SaaS Product)

## Ambiguous Edges - Review These
- `Static JSON Data Layer (Database Removal)` → `Docker Runtime Environment Config`  [AMBIGUOUS]
  docker-compose.yml · relation: conceptually_related_to

## Knowledge Gaps
- **273 isolated node(s):** `isExpanded`, `ContentCertification`, `{ data: certifications }`, `selected`, `WakaTimeStats` (+268 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Static JSON Data Layer (Database Removal)` and `Docker Runtime Environment Config`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `dependencies` connect `Nuxt Dependencies` to `Icon Libraries`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `Portfolio Website | Ababil Mustaqim` connect `Education Section Component` to `Project Documentation`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `isExpanded`, `ContentCertification`, `{ data: certifications }` to the rest of the system?**
  _273 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Projects Section Component` be split into smaller, more focused modules?**
  _Cohesion score 0.06951871657754011 - nodes in this community are weakly interconnected._
- **Should `Nuxt Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `Icon Libraries` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._