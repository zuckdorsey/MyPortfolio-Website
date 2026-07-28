<script setup lang="ts">
useHead({
  title: "Privacy — Ababil Mustaqim",
  meta: [
    {
      name: "description",
      content: "Privacy policy for Ababil Mustaqim's portfolio website.",
    },
    { name: "robots", content: "index, follow" },
  ],
});
</script>

<template>
  <div class="mx-auto w-full max-w-2xl px-5 py-16 sm:px-6">
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
    >
      ← Back home
    </NuxtLink>

    <h1 class="mt-6 font-display text-3xl font-semibold tracking-tight text-sand-900 dark:text-sand-100">
      Privacy
    </h1>
    <p class="mt-2 text-sm text-sand-500 dark:text-sand-400">
      Last updated · <time class="tnum">July 2026</time>
    </p>

    <div class="mt-8 flex max-w-prose flex-col gap-5 text-[0.95rem] leading-relaxed text-sand-600 dark:text-sand-400">
      <p>
        This is a personal portfolio. It collects as little data as possible, and none of it is sold or shared with advertisers.
      </p>

      <h2 class="font-display text-lg font-semibold text-sand-900 dark:text-sand-100">What I collect</h2>
      <p>
        <strong class="font-medium text-sand-800 dark:text-sand-200">Contact form.</strong> If you message me, your name, email, and message are sent to my inbox via a form service so I can reply. That's it.
      </p>
      <p>
        <strong class="font-medium text-sand-800 dark:text-sand-200">Analytics.</strong> This site uses privacy-friendly, aggregated analytics (Vercel Analytics) to understand traffic. It doesn't use cookies or track you across other sites.
      </p>

      <h2 class="font-display text-lg font-semibold text-sand-900 dark:text-sand-100">Third-party embeds</h2>
      <p>
        The "now playing" and "coding stats" sections pull live data from Spotify and WakaTime. Loading those sections means your browser contacts those services, which have their own privacy policies.
      </p>

      <h2 class="font-display text-lg font-semibold text-sand-900 dark:text-sand-100">Questions</h2>
      <p>
        Anything unclear? Email me at
        <a href="mailto:ababilmustaqim@proton.me" class="text-emerald-600 underline-offset-2 hover:underline dark:text-emerald-400">ababilmustaqim@proton.me</a>.
      </p>
    </div>
  </div>
</template>
