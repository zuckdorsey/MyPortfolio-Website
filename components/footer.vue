<script setup lang="ts">
import { IconHeartFilled } from "@tabler/icons-vue";

const year = new Date().getFullYear();
</script>

<template>
  <footer
    class="mt-12 flex flex-col items-center gap-4 border-t border-sand-200 py-6 dark:border-sand-800"
  >
    <nav
      aria-label="Footer"
      class="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-sand-500 dark:text-sand-400"
    >
      <a href="#me" class="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">Home</a>
      <a href="#projects" class="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">Projects</a>
      <a href="#contact" class="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">Contact</a>
      <NuxtLink to="/privacy" class="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">Privacy</NuxtLink>
    </nav>

    <div class="flex flex-row items-center justify-center gap-1.5 text-xs text-sand-500 dark:text-sand-400">
      <p>
        Made by
        <a
          href="https://github.com/birdfromhell"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-sand-700 transition-colors hover:text-emerald-600 dark:text-sand-200 dark:hover:text-emerald-400"
          >Ababil Mustaqim</a
        >
        with
        <a
          href="https://nuxt.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-sand-700 transition-colors hover:text-emerald-600 dark:text-sand-200 dark:hover:text-emerald-400"
          >Nuxt</a
        >
        and
      </p>
      <IconHeartFilled class="h-3.5 w-3.5 text-emerald-500" aria-label="love" />
    </div>

    <p class="tnum font-mono text-[11px] text-sand-400 dark:text-sand-500">
      © {{ year }} Ababil Mustaqim
    </p>
  </footer>
</template>
