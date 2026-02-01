// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
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
    // Konfigurasi yang hanya tersedia di server
    databaseUrl: process.env.DATABASE_URL,

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

  // Content Configuration
  content: {
    documentDriven: true,
    api: {
      baseURL: '/api/_content'
    },
    experimental: {
      stripQueryParameters: false
    }
  },

  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg'
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png'
        },
        {
          rel: 'manifest',
          href: '/manifest.json'
        }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-TileColor', content: '#0f172a' },
        { name: 'theme-color', content: '#0f172a' }
      ],
      htmlAttrs: {
        lang: 'en'
      }
    }
  },

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
      '/resume'
    ]
  },

  routeRules: {
    '/': { headers: { 'cache-control': 's-maxage=31536000' } },
    '/resume': { headers: { 'cache-control': 's-maxage=31536000' } },
    '/dashboard/**': { ssr: false },
    '/login': { ssr: false },
    '/closed': { ssr: false }
  },

  compatibilityDate: '2025-05-09'
});