<script setup lang="ts">
const seoTitle = "Ababil Mustaqim - Backend Developer From Bandung";
const seoDescription =
  "Ababil Mustaqim is a professional backend developer from Bandung, experienced in building scalable, secure, and efficient backend systems. Explore projects, skills, and experience here.";
const siteUrl = "https://ababil.is-not-a.dev";
const ogImageUrl = `${siteUrl}/og-image.png`;

// JSON-LD handled in separate composable for better hydration performance
useJsonLd();

// Per-page canonical derived from the current route
useHead({
  link: [
    { rel: 'canonical', href: `https://ababil.is-not-a.dev${useRoute().path === '/' ? '' : useRoute().path}` }
  ]
});

// Basic head configuration (non-SEO related)
useHead({
  title: seoTitle,
  link: [
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    { rel: "manifest", href: "/manifest.json" },
    // Fonts: Fraunces (display serif), Outfit (sans), JetBrains Mono
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Outfit:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
    },
    // Preconnect to external API providers to reduce DNS/TLS latency
    { rel: "preconnect", href: "https://api.spotify.com" },
    { rel: "preconnect", href: "https://accounts.spotify.com" },
    { rel: "preconnect", href: "https://wakatime.com" },
    { rel: "preconnect", href: "https://api.github.com" },
    { rel: "dns-prefetch", href: "https://i.scdn.co" }, // Spotify album art CDN
  ],
  htmlAttrs: {
    lang: "en",
  },
});

// All SEO meta tags in one place (no duplication)
useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  keywords:
    "backend developer, python, django, flask, nodejs, postgresql, vue, nuxt, rest api, bandung, indonesia",
  author: "Ababil Mustaqim",
  robots: "index, follow",

  // Open Graph
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: "website",
  ogUrl: siteUrl,
  ogImage: ogImageUrl,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "Ababil Mustaqim - Backend Developer Portfolio",
  ogLocale: "en_US",
  ogSiteName: "Ababil Mustaqim Portfolio",

  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: ogImageUrl,
  twitterImageAlt: "Ababil Mustaqim - Backend Developer Portfolio",

  // Additional
  themeColor: "#0f172a",
  applicationName: "Ababil Mustaqim Portfolio",
  appleMobileWebAppTitle: "Ababil Mustaqim",
  appleMobileWebAppCapable: "yes",
  appleMobileWebAppStatusBarStyle: "black-translucent",
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
