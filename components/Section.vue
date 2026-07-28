<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Anchor id for the section + its heading. */
    anchor?: string;
    kicker?: string;
    title?: string;
    subtitle?: string;
  }>(),
  { anchor: undefined, kicker: undefined, title: undefined, subtitle: undefined }
);
</script>

<template>
  <section
    :id="anchor"
    :aria-labelledby="anchor ? `${anchor}-heading` : undefined"
    class="flex scroll-mt-20 flex-col gap-8"
  >
    <div class="flex items-start justify-between gap-4">
      <SectionHeader
        v-if="title"
        :anchor="anchor"
        :kicker="kicker"
        :title="title"
        :subtitle="subtitle"
      />
      <div v-if="$slots['header-actions']" class="flex-shrink-0 pt-1">
        <slot name="header-actions" />
      </div>
    </div>
    <slot />
  </section>
</template>
