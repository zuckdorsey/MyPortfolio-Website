<script setup lang="ts">
useHead({
  meta: [
    {
      name: "description",
      content:
        "Portfolio of Ababil Mustaqim, an experienced backend developer from Bandung. Specializing in Python, Django, Flask, Node.js, PostgreSQL, and modern backend technologies.",
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
        "Portfolio of Ababil Mustaqim, an experienced backend developer from Bandung. Specializing in Python, Django, Flask, Node.js, PostgreSQL, and modern backend technologies.",
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
