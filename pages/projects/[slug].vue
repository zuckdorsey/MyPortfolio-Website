<script setup lang="ts">
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import {
  IconArrowLeft,
  IconBrandGithub,
  IconExternalLink,
  IconLock,
  IconCalendar,
  IconFileText,
  IconSun,
  IconMoon,
} from '@tabler/icons-vue';

interface ProjectRecord {
  id: number;
  slug?: string;
  name: string;
  link: string;
  repo_link: string;
  date: string;
  image?: string;
  technos: string[];
  type: string[];
  content_en?: string | null;
  content_id?: string | null;
}

const route = useRoute();
const slug = computed(() => String(route.params.slug || ''));

const { data: projects, pending: projectsPending } = await useAsyncData<ProjectRecord[]>(
  'all-projects',
  () => $fetch<ProjectRecord[]>('/api/projects')
);

const project = computed<ProjectRecord | null>(() => {
  if (!projects.value) return null;
  return (
    projects.value.find((p) => p.slug === slug.value) ||
    projects.value.find((p) => String(p.id) === slug.value) ||
    null
  );
});

// Pull the README from GitHub (server-side endpoint, cached). Non-fatal if it 404s.
const { data: readme, status: readmeStatus } = await useAsyncData(
  () => `project-readme:${slug.value}`,
  async () => {
    try {
      return await $fetch<{ source: string; markdown: string }>(
        `/api/projects/${slug.value}/readme`
      );
    } catch {
      return null;
    }
  },
  { watch: [slug] }
);

const isLoading = computed(
  () => projectsPending.value || readmeStatus.value === 'pending'
);

const hasLivePreview = computed(
  () => !!project.value?.link && project.value.link.trim() !== '' && project.value.link !== '#'
);
const isClosedSource = computed(
  () => !project.value?.repo_link || project.value.repo_link.startsWith('closed')
);
const repoLink = computed(() =>
  isClosedSource.value ? null : project.value?.repo_link
);

const imageLoaded = ref(false);
const imageErrored = ref(false);
const showImage = computed(
  () => !!project.value?.image && project.value.image.startsWith('http') && !imageErrored.value
);

const initials = computed(() =>
  (project.value?.name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
);

const placeholderHue = computed(() => {
  const name = project.value?.name || '';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
});

const localBody = computed(() => project.value?.content_en || '');

const renderedMarkdown = computed(() => {
  if (readme.value?.source === 'github' && readme.value.markdown) {
    const html = marked.parse(readme.value.markdown, { async: false }) as string;
    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  }
  return null;
});

const bodySource = computed<'github' | 'local'>(() =>
  renderedMarkdown.value ? 'github' : 'local'
);

// SEO
useHead(() => ({
  title: project.value ? `${project.value.name} — Projects` : 'Project',
  link: project.value
    ? [{ rel: 'canonical', href: `https://ababil.is-not-a.dev/projects/${slug.value}` }]
    : [],
}));
useSeoMeta(() => ({
  description: project.value
    ? (project.value.content_en || `Details for ${project.value.name}`).slice(0, 155)
    : 'Project detail',
  ogTitle: project.value ? `${project.value.name} — Ababil Mustaqim` : 'Project',
  ogDescription: project.value?.content_en || undefined,
  ogImage: project.value?.image,
}));

const isDark = ref(false);
onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark');
});
function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
}
</script>

<template>
  <div class="mx-auto max-w-3xl overflow-x-hidden px-5 py-10 sm:py-14">
    <!-- Loading skeleton -->
    <div v-if="isLoading" class="animate-pulse space-y-5">
      <div class="h-3 w-24 rounded bg-sand-200 dark:bg-sand-800" />
      <div class="h-9 w-2/3 rounded-lg bg-sand-200 dark:bg-sand-800" />
      <div class="flex gap-2">
        <div class="h-5 w-14 rounded-full bg-sand-200 dark:bg-sand-800" />
        <div class="h-5 w-20 rounded-full bg-sand-200 dark:bg-sand-800" />
        <div class="h-5 w-16 rounded-full bg-sand-200 dark:bg-sand-800" />
      </div>
      <div class="h-36 rounded-2xl bg-sand-100 dark:bg-sand-800/70" />
      <div class="space-y-3 pt-4">
        <div class="h-3 rounded bg-sand-200 dark:bg-sand-800" />
        <div class="h-3 w-11/12 rounded bg-sand-200 dark:bg-sand-800" />
        <div class="h-3 w-4/5 rounded bg-sand-200 dark:bg-sand-800" />
      </div>
    </div>

    <!-- Not found -->
    <div v-else-if="!project" class="flex flex-col items-center gap-5 py-24 text-center">
      <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-sand-100 dark:bg-sand-800">
        <IconFileText class="h-7 w-7 text-sand-400" aria-hidden="true" />
      </div>
      <div>
        <h1 class="font-display text-2xl font-semibold text-sand-900 dark:text-sand-100">
          Project not found
        </h1>
        <p class="mt-1.5 text-sm text-sand-500 dark:text-sand-400">
          This project may have been removed or the link is wrong.
        </p>
      </div>
      <NuxtLink
        to="/#projects"
        class="inline-flex items-center gap-1.5 rounded-lg bg-sand-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sand-700 dark:bg-sand-100 dark:text-sand-900 dark:hover:bg-sand-300"
      >
        <IconArrowLeft class="h-4 w-4" aria-hidden="true" />
        Back to projects
      </NuxtLink>
    </div>

    <!-- Article -->
    <article v-else>
      <!-- Top bar -->
      <div class="flex items-center justify-between">
        <NuxtLink
          to="/#projects"
          class="group inline-flex items-center gap-1.5 text-sm font-medium text-sand-500 transition-colors hover:text-sand-900 dark:text-sand-400 dark:hover:text-sand-100"
        >
          <IconArrowLeft
            class="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to projects
        </NuxtLink>
        <button
          @click="toggleTheme"
          class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-sand-200 text-sand-500 transition-colors hover:bg-sand-100 dark:border-sand-700 dark:text-sand-400 dark:hover:bg-sand-800"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <IconSun v-if="isDark" class="h-4 w-4" aria-hidden="true" />
          <IconMoon v-else class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <!-- Header -->
      <header class="mt-7">
        <div class="flex items-center gap-2.5 text-xs text-sand-500 dark:text-sand-400">
          <span class="tnum inline-flex items-center gap-1 font-mono">
            <IconCalendar class="h-3.5 w-3.5" aria-hidden="true" />
            {{ project.date }}
          </span>
          <span class="text-sand-300 dark:text-sand-600">·</span>
          <span
            class="rounded-full px-2 py-0.5 font-medium"
            :class="isClosedSource
              ? 'bg-sand-100 text-sand-500 dark:bg-sand-800 dark:text-sand-400'
              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'"
          >
            {{ isClosedSource ? 'Closed source' : 'Open source' }}
          </span>
        </div>

        <h1 class="mt-3 font-display text-[2rem] font-semibold leading-[1.15] tracking-tightest text-sand-900 dark:text-sand-100 sm:text-4xl">
          {{ project.name }}
        </h1>

        <p v-if="localBody" class="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-sand-500 dark:text-sand-400">
          {{ localBody }}
        </p>

        <div v-if="project.technos?.length" class="mt-4 flex flex-wrap gap-1.5">
          <span
            v-for="tech in project.technos"
            :key="tech"
            class="rounded-md bg-sand-100 px-2 py-0.5 text-xs text-sand-600 dark:bg-sand-800 dark:text-sand-300"
          >
            {{ tech }}
          </span>
        </div>

        <div class="mt-5 flex flex-wrap items-center gap-2.5">
          <a
            v-if="hasLivePreview"
            :href="project.link"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 rounded-lg bg-sand-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-sand-700 active:scale-[0.98] dark:bg-sand-100 dark:text-sand-900 dark:hover:bg-sand-300"
          >
            <IconExternalLink class="h-4 w-4" aria-hidden="true" />
            Visit live site
          </a>
          <a
            v-if="repoLink"
            :href="repoLink"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 rounded-lg border border-sand-200 px-4 py-2 text-sm font-medium text-sand-700 transition-colors duration-200 hover:bg-sand-50 active:scale-[0.98] dark:border-sand-700 dark:text-sand-300 dark:hover:bg-sand-800"
          >
            <IconBrandGithub class="h-4 w-4" aria-hidden="true" />
            View source
          </a>
          <span
            v-else-if="isClosedSource"
            class="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-sand-300 px-4 py-2 text-sm font-medium text-sand-400 dark:border-sand-700 dark:text-sand-500"
          >
            <IconLock class="h-4 w-4" aria-hidden="true" />
            Source private
          </span>
        </div>
      </header>

      <!-- Hero media -->
      <figure class="mt-8 overflow-hidden rounded-2xl border border-sand-200/80 dark:border-sand-800">
        <Transition name="fade">
          <NuxtImg
            v-if="showImage"
            :key="'img'"
            :src="project.image!"
            :alt="project.name"
            class="aspect-[16/9] w-full object-cover"
            width="1200"
            height="675"
            format="webp"
            loading="eager"
            :class="{ 'opacity-0': !imageLoaded, 'opacity-100 transition-opacity duration-500': imageLoaded }"
            @load="imageLoaded = true"
            @error="imageErrored = true"
          />
        </Transition>
        <div
          v-if="!showImage"
          class="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden"
          :style="{ backgroundColor: `hsl(${placeholderHue} 30% 92%)` }"
        >
          <svg class="absolute inset-0 h-full w-full opacity-[0.12]" aria-hidden="true">
            <defs>
              <pattern id="hero-dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.4" :fill="`hsl(${placeholderHue} 40% 30%)`" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-dots)" />
          </svg>
          <span
            class="select-none font-display text-8xl font-bold leading-none tracking-tighter"
            :style="{ color: `hsl(${placeholderHue} 35% 30% / 0.18)` }"
            aria-hidden="true"
          >
            {{ initials }}
          </span>
        </div>
      </figure>

      <!-- Body -->
      <div class="mt-10">
        <p class="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-sand-400 dark:text-sand-500">
          <IconFileText class="h-3.5 w-3.5" aria-hidden="true" />
          {{ bodySource === 'github' ? 'From the repository README' : 'About this project' }}
        </p>

        <!-- README content -->
        <div
          v-if="renderedMarkdown"
          class="readme-body"
          v-html="renderedMarkdown"
        />

        <!-- Local fallback -->
        <div v-else class="max-w-prose">
          <p class="text-[0.95rem] leading-relaxed text-sand-600 dark:text-sand-300">
            {{ localBody }}
          </p>
          <p
            v-if="isClosedSource"
            class="mt-4 rounded-xl border border-sand-200 bg-sand-50 px-4 py-3 text-sm text-sand-500 dark:border-sand-800 dark:bg-sand-900/60 dark:text-sand-400"
          >
            The source code for this project is private, so there is no public README to display.
          </p>
        </div>
      </div>

      <!-- Footer nav -->
      <div class="mt-14 border-t border-sand-200 pt-6 dark:border-sand-800">
        <NuxtLink
          to="/#projects"
          class="group inline-flex items-center gap-1.5 text-sm font-medium text-sand-500 transition-colors hover:text-sand-900 dark:text-sand-400 dark:hover:text-sand-100"
        >
          <IconArrowLeft
            class="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to all projects
        </NuxtLink>
      </div>
    </article>
  </div>
</template>

<style scoped>
.fade-enter-active { transition: opacity 0.4s ease; }
.fade-enter-from { opacity: 0; }
.fade-enter-to { opacity: 1; }
</style>
