<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Shape presets; 'custom' renders a bare block you size with class. */
    variant?: "card" | "line" | "circle" | "media" | "custom";
  }>(),
  { variant: "line" }
);
</script>

<template>
  <div
    class="animate-pulse bg-sand-200 dark:bg-sand-800"
    :class="{
      'h-4 w-full rounded-md': variant === 'line',
      'h-40 w-full rounded-2xl': variant === 'card',
      'h-12 w-12 rounded-full': variant === 'circle',
      'aspect-video w-full rounded-lg': variant === 'media',
      'rounded-md': variant === 'custom',
    }"
    role="status"
    aria-label="Loading"
  />
</template>
