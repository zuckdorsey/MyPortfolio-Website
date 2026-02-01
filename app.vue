<script setup lang="ts">
const seoTitle = "Ababil Mustaqim - Backend Developer From Bandung";
const seoDescription =
  "Ababil Mustaqim adalah seorang backend developer profesional dari Bandung, berpengalaman dalam membangun sistem backend yang scalable, aman, dan efisien. Temukan portofolio, proyek, dan keahlian teknologi terbaru di sini.";
const siteUrl = "https://ababil.is-not-a.dev";
const ogImageUrl = `${siteUrl}/og-image.svg`;

// JSON-LD handled in separate composable for better hydration performance
useJsonLd();

// Basic head configuration (non-SEO related)
useHead({
  title: seoTitle,
  link: [
    { rel: "canonical", href: siteUrl },
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    { rel: "manifest", href: "/manifest.json" },
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
  <div>
    <NuxtPage />
  </div>
</template>
