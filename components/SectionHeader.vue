<script setup lang="ts">
import { IconLink } from "@tabler/icons-vue";

const props = withDefaults(
  defineProps<{
    /** Anchor id (also used for aria-labelledby + hover link). */
    anchor?: string;
    /** Small kicker above the title. */
    kicker?: string;
    /** Serif display title. */
    title: string;
    /** Optional supporting line under the title. */
    subtitle?: string;
  }>(),
  { anchor: undefined, kicker: undefined, subtitle: undefined }
);

const headingId = computed(() =>
  props.anchor ? `${props.anchor}-heading` : undefined
);
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <p
      v-if="kicker"
      class="font-mono text-xs font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400"
    >
      {{ kicker }}
    </p>

    <a
      v-if="anchor"
      :href="`#${anchor}`"
      class="group relative w-fit"
      :aria-label="`Link to ${title} section`"
    >
      <IconLink
        class="absolute -left-5 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-sand-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block"
        aria-hidden="true"
      />
      <h2
        :id="headingId"
        class="font-display text-2xl font-semibold tracking-tight text-sand-900 transition-colors duration-200 group-hover:text-emerald-700 dark:text-sand-100 dark:group-hover:text-emerald-300 sm:text-[1.7rem]"
      >
        {{ title }}
      </h2>
    </a>
    <h2
      v-else
      :id="headingId"
      class="font-display text-2xl font-semibold tracking-tight text-sand-900 dark:text-sand-100 sm:text-[1.7rem]"
    >
      {{ title }}
    </h2>

    <p v-if="subtitle" class="text-sm text-sand-500 dark:text-sand-400">
      {{ subtitle }}
    </p>
  </div>
</template>
