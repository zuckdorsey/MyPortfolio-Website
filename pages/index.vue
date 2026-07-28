<script setup lang="ts">
useHead({
  title: "Ababil Mustaqim",
  meta: [
    {
      name: "description",
      content:
        "Portfolio Ababil Mustaqim - Backend Developer berpengalaman dari Bandung. Spesialis Python, Django, Flask, Node.js, PostgreSQL, dan teknologi backend modern.",
    },
    {
      name: "keywords",
      content:
        "ababil mustaqim, backend developer, python developer, django developer, flask, nodejs, postgresql, vue, nuxt, rest api, bandung developer, indonesia developer, portfolio",
    },
    {
      property: "og:title",
      content: "Ababil Mustaqim - Backend Developer Portfolio",
    },
    {
      property: "og:description",
      content:
        "Portfolio Ababil Mustaqim - Backend Developer berpengalaman dari Bandung. Spesialis Python, Django, Flask, Node.js, PostgreSQL, dan teknologi backend modern.",
    },
  ],
});
</script>

<template>
  <div class="mx-auto w-full max-w-3xl px-5 pt-14 sm:px-6 md:pt-20">
    <div class="flex flex-col gap-20 md:gap-24">
      <Header />
      <About />
      <Projects />
      <Experience />
      <Education />
      <Certifications />
      <Skills />
      <CodingStats />
      <NowPlaying />
      <Contact />
      <Footer />
    </div>
  </div>
</template>
