<script setup lang="ts">
import {
  IconBrandGithub,
  IconLock,
  IconArrowUpRight,
  IconExternalLink,
} from '@tabler/icons-vue';

interface ContentProject {
  _id?: string;
  slug?: string;
  id?: number;
  name: string;
  link: string;
  repo_link: string;
  date: string;
  technos: string[];
  type: string[];
  image?: string;
  content?: {
    en?: string;
    id?: string;
    [key: string]: string | undefined;
  };
}

const props = defineProps<{ project: ContentProject; index?: number }>();

const isClosedSource = computed(
  () => !props.project.repo_link || props.project.repo_link.startsWith('closed')
);
const hasLive = computed(
  () => !!props.project.link && props.project.link.trim() !== '' && props.project.link !== '#'
);

const blurb = computed(() => props.project.content?.en?.trim() || '');

// Primary project category label (skips the internal "featured" tag).
const category = computed(() => {
  const t = props.project.type?.find((x) => x !== 'featured');
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : null;
});

const detailHref = computed(() => `/projects/${props.project.slug ?? props.project.id}`);
</script>

<template>
  <article
    class="project-card group relative h-full"
    :style="{ '--card-index': index ?? 0 }"
  >
    <NuxtLink
      :to="detailHref"
      class="flex h-full flex-col gap-3 rounded-2xl border border-sand-200/80 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-sand-300 hover:shadow-lift focus-visible:ring-2 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700 dark:hover:shadow-lift-dark"
    >
      <!-- Top: title + status icons -->
      <div class="flex items-start justify-between gap-3">
        <div class="flex min-w-0 flex-col gap-1">
          <h3 class="font-display text-base font-semibold leading-snug text-sand-900 transition-colors group-hover:text-emerald-700 dark:text-sand-100 dark:group-hover:text-emerald-300">
            {{ project.name }}
          </h3>
          <div class="flex items-center gap-1.5 text-[11px] leading-none">
            <span v-if="category" class="font-medium text-sand-400 dark:text-sand-500">
              {{ category }}
            </span>
            <span v-if="category" class="text-sand-300 dark:text-sand-600">·</span>
            <span class="tnum font-mono text-sand-400 dark:text-sand-500">{{ project.date }}</span>
          </div>
        </div>

        <div class="flex flex-shrink-0 items-center gap-1 text-sand-400 dark:text-sand-500">
          <span
            :title="isClosedSource ? 'Closed source' : 'Open source'"
            class="inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors"
            :class="isClosedSource
              ? 'text-sand-300 dark:text-sand-600'
              : 'text-sand-400 group-hover:text-emerald-600 dark:text-sand-500 dark:group-hover:text-emerald-400'"
          >
            <IconLock v-if="isClosedSource" class="h-4 w-4" aria-hidden="true" />
            <IconBrandGithub v-else class="h-4 w-4" aria-hidden="true" />
          </span>
          <IconExternalLink
            v-if="hasLive"
            class="h-4 w-4 text-sand-300 transition-colors group-hover:text-sand-500 dark:text-sand-600 dark:group-hover:text-sand-400"
            aria-hidden="true"
          />
        </div>
      </div>

      <!-- Description: roomier two-line clamp -->
      <p v-if="blurb" class="line-clamp-2 text-[0.8rem] leading-relaxed text-sand-500 dark:text-sand-400">
        {{ blurb }}
      </p>

      <!-- Tech + open affordance pinned to bottom -->
      <div class="mt-auto flex items-end justify-between gap-3 border-t border-sand-100 pt-3 dark:border-sand-800/70">
        <div class="flex min-w-0 flex-wrap gap-1">
          <span
            v-for="tech in project.technos.slice(0, 4)"
            :key="tech"
            class="rounded bg-sand-100 px-1.5 py-0.5 text-[11px] leading-none text-sand-600 dark:bg-sand-800 dark:text-sand-300"
          >
            {{ tech }}
          </span>
          <span
            v-if="project.technos.length > 4"
            class="rounded bg-sand-100 px-1.5 py-0.5 text-[11px] leading-none text-sand-400 dark:bg-sand-800 dark:text-sand-500"
            :title="project.technos.slice(4).join(', ')"
          >
            +{{ project.technos.length - 4 }}
          </span>
        </div>

        <span class="inline-flex flex-shrink-0 items-center gap-1 text-[11px] font-medium text-sand-400 transition-colors group-hover:text-emerald-600 dark:text-sand-500 dark:group-hover:text-emerald-400">
          Open
          <IconArrowUpRight
            class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.project-card {
  animation: cardEnter 0.45s ease-out both;
  animation-delay: calc(var(--card-index, 0) * 60ms);
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
