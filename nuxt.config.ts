// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/sitemap',
    '@nuxt/image'
  ],
  devtools: { enabled: true },

  // Image optimization configuration
  image: {
    quality: 80,
    format: ['webp', 'avif'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  nitro: {
    compressPublicAssets: true,
    minify: true,
  },

  runtimeConfig: {
    // Konfigurasi yang tersedia di client
    public: {
      apiBase: '/api',
      resumeUrl: process.env.NUXT_PUBLIC_RESUME_URL || ''
    }
  },

  tailwindcss: {
    configPath: 'tailwind.config.js',
    cssPath: '~/assets/css/main.css'
  },

  ui: {},

  // SEO Configuration
  site: {
    url: 'https://your-domain.com', // Ganti dengan domain Anda
    name: 'Ababil Mustaqim',
    description: 'Ababil Mustaqim adalah seorang backend developer profesional dari Bandung, berpengalaman dalam membangun sistem backend yang scalable, aman, dan efisien.',
    defaultLocale: 'en'
  },

  sitemap: {
    urls: [
      '/',
      '/resume',
      '/privacy'
    ]
  },

  routeRules: {
    '/': { headers: { 'cache-control': 's-maxage=31536000' } },
    '/resume': { headers: { 'cache-control': 's-maxage=31536000' } },
    '/closed': { ssr: false },
    '/admin/**': { ssr: false },
    // Project detail pages are cached (README fetched server-side, 6h Nitro cache)
    '/projects/**': { headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
    // Cache API responses at Nitro level
    '/api/skills': { cache: { maxAge: 3600 } },
    '/api/certifications': { cache: { maxAge: 3600 } },
    '/api/education': { cache: { maxAge: 3600 } },
    '/api/experiences': { cache: { maxAge: 3600 } },
    '/api/projects': { cache: { maxAge: 3600 } },
    '/api/projects/**': { cache: { maxAge: 21600 } },
  },

  compatibilityDate: '2025-05-09'
});
