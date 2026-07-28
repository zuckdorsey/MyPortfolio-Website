<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number; message?: string } }>();

const is404 = computed(() => props.error?.statusCode === 404);
const title = computed(() => (is404.value ? "Page not found" : "Something went wrong"));
const code = computed(() => props.error?.statusCode ?? 500);

const handleError = () => clearError({ redirect: "/" });

useHead({ title: `${code.value} — Ababil Mustaqim` });
</script>

<template>
  <div class="grain ambient flex min-h-dvh items-center justify-center bg-sand-50 px-5 dark:bg-sand-950">
    <div class="flex max-w-md flex-col items-center text-center">
      <p class="tnum font-mono text-sm font-medium tracking-widest text-emerald-600 dark:text-emerald-400">
        {{ code }}
      </p>
      <h1 class="mt-3 font-display text-4xl font-semibold tracking-tight text-sand-900 dark:text-sand-100 sm:text-5xl">
        {{ title }}
      </h1>
      <p class="mt-4 text-[0.95rem] leading-relaxed text-sand-600 dark:text-sand-400">
        <template v-if="is404">
          The page you're looking for doesn't exist — it may have been moved, or the link is broken.
        </template>
        <template v-else>
          Something didn't work on my end. Try heading back and reloading.
        </template>
      </p>
      <button
        @click="handleError"
        class="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 ease-spring hover:-translate-y-0.5 hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600"
      >
        Back home
      </button>
    </div>
  </div>
</template>
