<script setup lang="ts">
import { IconLock, IconMail, IconCode, IconBrain, IconInfoCircle } from '@tabler/icons-vue';

definePageMeta({
  layout: 'default'
});

useHead({
  title: 'Closed Source Projects'
});

function getRandomClosedSourceQuote(): string {
  const quotes = [
    "Closed source is just code playing hide and seek, but with really good hiding spots.",
    "Some code is like a secret recipe - if I told you, I'd have to debug you.",
    "This code is so exclusive, even most of the bugs haven't seen it.",
    "The first rule of closed source projects: You don't talk about closed source projects.",
    "It's not hidden, it's just in stealth mode for strategic reasons.",
    "This code is like a magic trick - a magician never reveals their secrets.",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

onMounted(() => {
  setTimeout(() => {
    document.querySelector('.page-content')?.classList.add('show');
  }, 100);
});
</script>

<template>
  <div class="mx-auto max-w-3xl px-5 py-12 sm:py-16">
    <div class="page-content">
      <NuxtLink
        to="/"
        class="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
      >
        ← Back home
      </NuxtLink>

      <!-- Header -->
      <div class="mb-8 flex items-center gap-4">
        <div class="inline-flex rounded-2xl bg-sand-100 p-4 dark:bg-sand-800">
          <IconLock class="text-3xl text-sand-500 dark:text-sand-400" aria-hidden="true" />
        </div>
        <div>
          <h1 class="font-display text-2xl font-semibold tracking-tight text-sand-900 dark:text-sand-100 sm:text-3xl">
            Closed source projects
          </h1>
          <p class="mt-1 text-sm text-sand-500 dark:text-sand-400">
            Project access restricted
          </p>
        </div>
      </div>

      <!-- Main card -->
      <div class="rounded-2xl border border-sand-200 bg-white p-6 shadow-soft dark:border-sand-800 dark:bg-sand-900 sm:p-8">
        <div class="flex flex-col gap-8">
          <!-- Why -->
          <div class="rounded-lg border-l-4 border-emerald-500 bg-emerald-50/60 p-5 dark:bg-emerald-950/20">
            <h2 class="mb-2 flex items-center gap-2 font-display text-lg font-semibold text-sand-900 dark:text-sand-100">
              <IconInfoCircle class="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              Why are some projects closed source?
            </h2>
            <p class="text-sm leading-relaxed text-sand-600 dark:text-sand-400">
              Some projects are closed source due to client requirements, proprietary code, or other restrictions. While I believe in open source software, not all projects can be shared publicly.
            </p>
          </div>

          <!-- Note -->
          <div class="flex flex-col items-center p-2 text-center">
            <IconBrain class="mb-2 text-2xl text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <p class="max-w-md text-sm italic text-sand-600 dark:text-sand-400">
              Sometimes the most interesting engineering happens behind closed doors. The skills gained from solving complex problems remain, even when the code cannot be shared.
            </p>
          </div>

          <!-- Quote -->
          <div class="text-center">
            <p class="inline-block rounded-md bg-sand-100 px-6 py-3 text-sm italic text-sand-600 dark:bg-sand-800 dark:text-sand-300">
              "{{ getRandomClosedSourceQuote() }}"
            </p>
          </div>

          <!-- Contact -->
          <div class="rounded-lg bg-sand-50 p-6 dark:bg-sand-800/50">
            <h3 class="font-display text-lg font-semibold text-sand-900 dark:text-sand-100">Want to know more?</h3>
            <p class="mb-4 mt-1 text-sm text-sand-600 dark:text-sand-400">
              If you're interested in learning more about these projects or would like to discuss them further, get in touch.
            </p>
            <div class="flex flex-col gap-3 pt-1 sm:flex-row">
              <UButton to="/#contact" variant="solid" color="primary" class="w-full sm:w-auto">
                <IconMail class="mr-1 h-4 w-4" aria-hidden="true" /> Contact me
              </UButton>
              <UButton to="/#projects" variant="outline" color="gray" class="w-full sm:w-auto">
                <IconCode class="mr-1 h-4 w-4" aria-hidden="true" /> See public projects
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Examples -->
      <div class="mt-12">
        <h2 class="mb-6 text-center font-display text-xl font-semibold tracking-tight text-sand-900 dark:text-sand-100">
          Examples of closed source projects
        </h2>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div class="rounded-2xl border border-sand-200 bg-white p-5 transition-all duration-300 hover:shadow-soft dark:border-sand-800 dark:bg-sand-900">
            <h3 class="font-display font-semibold text-sand-900 dark:text-sand-100">SeleraRasaSunda</h3>
            <p class="tnum mb-3 mt-1 font-mono text-xs text-sand-500 dark:text-sand-400">Client project · 2024</p>
            <div class="mb-4 flex flex-wrap gap-2">
              <span class="rounded-md bg-sand-100 px-2 py-1 text-xs text-sand-600 dark:bg-sand-800 dark:text-sand-400">Laravel</span>
              <span class="rounded-md bg-sand-100 px-2 py-1 text-xs text-sand-600 dark:bg-sand-800 dark:text-sand-400">PHP</span>
              <span class="rounded-md bg-sand-100 px-2 py-1 text-xs text-sand-600 dark:bg-sand-800 dark:text-sand-400">MySQL</span>
            </div>
            <p class="text-sm text-sand-600 dark:text-sand-400">A clean and responsive landing page for a food catering business with focus on user engagement and conversion.</p>
          </div>

          <div class="rounded-2xl border border-sand-200 bg-white p-5 transition-all duration-300 hover:shadow-soft dark:border-sand-800 dark:bg-sand-900">
            <h3 class="font-display font-semibold text-sand-900 dark:text-sand-100">Accountant Software</h3>
            <p class="tnum mb-3 mt-1 font-mono text-xs text-sand-500 dark:text-sand-400">Client project · 2022</p>
            <div class="mb-4 flex flex-wrap gap-2">
              <span class="rounded-md bg-sand-100 px-2 py-1 text-xs text-sand-600 dark:bg-sand-800 dark:text-sand-400">Laravel</span>
              <span class="rounded-md bg-sand-100 px-2 py-1 text-xs text-sand-600 dark:bg-sand-800 dark:text-sand-400">Bootstrap</span>
              <span class="rounded-md bg-sand-100 px-2 py-1 text-xs text-sand-600 dark:bg-sand-800 dark:text-sand-400">Vue.js</span>
            </div>
            <p class="text-sm text-sand-600 dark:text-sand-400">Proprietary accounting software developed for a client with custom reporting and financial management features.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-content {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.page-content.show {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .page-content {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
