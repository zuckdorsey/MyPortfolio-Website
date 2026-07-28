<script setup lang="ts">
import {
  IconPlayerPlay,
  IconVideo,
  IconEye,
  IconBrandGithub,
  IconLock,
  IconExternalLink,
  IconCalendar,
  IconCode,
} from '@tabler/icons-vue';

type LocaleType = 'en' | 'id' | 'fr';

interface ContentProject {
  _id?: string;
  _path?: string;
  name: string;
  link: string;
  repo_link: string;
  date: string;
  technos: string[];
  type: string[];
  image?: string;
  imageExt?: string;
  video_url?: string;
  content?: {
    en?: string;
    id?: string;
    fr?: string;
    [key: string]: string | undefined;
  };
}

const currentLocale = 'en';

const props = defineProps<{ project: ContentProject; index?: number }>();

const previewModalOpen = ref(false);
const currentPreviewMode = ref<'live' | 'video'>('live');

// Derive the image src — null when genuinely missing
const projectImage = computed<string | null>(() => {
  if (props.project.image && props.project.image.startsWith('http')) {
    return props.project.image;
  }
  const name = props.project.image
    || props.project.name.toLowerCase().replace(/\s/g, '-').replace(/'/g, '');
  const ext = props.project.imageExt || 'webp';
  return `/projects/${name}.${ext}`;
});

// Track whether the image actually loaded
const imageLoaded = ref(false);
const imageErrored = ref(false);

function onImageLoad() {
  imageLoaded.value = true;
}
function onImageError() {
  imageErrored.value = true;
}

// Show the image strip only when an image source exists and hasn't errored
const showImage = computed(() => projectImage.value && !imageErrored.value);

// Generate a stable accent color per project name (for the no-image placeholder)
const placeholderHue = computed(() => {
  let hash = 0;
  for (let i = 0; i < props.project.name.length; i++) {
    hash = props.project.name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
});

// Initials from project name (up to 2 words)
const initials = computed(() => {
  return props.project.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
});

function hasLivePreview(project: ContentProject): boolean {
  return !!project.link && project.link.trim() !== '' && project.link !== '#';
}

function hasVideoPreview(project: ContentProject): boolean {
  return !!project.video_url && project.video_url.trim() !== '';
}

function hasAnyPreview(project: ContentProject): boolean {
  return hasLivePreview(project) || hasVideoPreview(project);
}

function isClosedSource(project: ContentProject): boolean {
  return !project.repo_link || project.repo_link.startsWith('closed');
}

function getRepoLink(project: ContentProject): string {
  if (isClosedSource(project)) return '/closed';
  return project.repo_link;
}

const getLocalizedContent = computed(() => {
  return props.project.content?.[currentLocale] ?? '';
});

function getSafeVideoEmbed(url: string | undefined): string {
  if (!url) return '';
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const m = url.match(/^.*((youtu.be\/)|(v\/)|(\u002Fu\/\w\/)|(embed\/)|(watch\?))\\??v?=?([^#&?]*).*/);
    if (m && m[7]?.length === 11) {
      return `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${m[7]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
  }
  if (url.includes('vimeo.com')) {
    const m = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
    if (m) {
      return `<iframe width="100%" height="315" src="https://player.vimeo.com/video/${m[1]}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
  }
  return `<p>Video preview not available: ${url}</p>`;
}
</script>

<template>
  <article
    class="project-card group relative flex flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-sand-300 hover:shadow-lift dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700 dark:hover:shadow-lift-dark"
    :style="{ '--card-index': index ?? 0 }"
  >
    <!-- ── Image strip (when image exists and loads) ── -->
    <div
      v-if="showImage"
      class="relative h-44 flex-shrink-0 overflow-hidden bg-sand-100 dark:bg-sand-800"
    >
      <NuxtImg
        v-if="project.image && project.image.startsWith('http')"
        :src="project.image"
        :alt="project.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        width="640"
        height="176"
        loading="lazy"
        :placeholder="[64, 35, 75, 5]"
        @load="onImageLoad"
        @error="onImageError"
      />
      <NuxtImg
        v-else
        :src="projectImage!"
        :alt="project.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        width="640"
        height="176"
        format="webp"
        loading="lazy"
        :placeholder="[64, 35, 75, 5]"
        @load="onImageLoad"
        @error="onImageError"
      />
      <!-- gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent dark:from-sand-900/70" aria-hidden="true" />

      <!-- Date badge -->
      <div class="tnum absolute right-3 top-3 flex items-center gap-1 rounded-full border border-sand-200 bg-white/90 px-2.5 py-1 font-mono text-xs font-medium text-sand-600 backdrop-blur-sm dark:border-sand-700 dark:bg-sand-900/90 dark:text-sand-400">
        <IconCalendar class="h-3 w-3" aria-hidden="true" />
        {{ project.date }}
      </div>

      <!-- Preview hover overlay -->
      <button
        v-if="hasAnyPreview(project)"
        @click="previewModalOpen = true"
        class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-label="Preview project"
      >
        <span class="flex translate-y-2 items-center gap-2 rounded-full border border-sand-200 bg-white/95 px-4 py-2 text-sm font-medium text-sand-800 shadow-lift backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0 dark:border-sand-700 dark:bg-sand-900/95 dark:text-sand-100">
          <IconEye class="h-4 w-4" aria-hidden="true" />
          Preview
        </span>
      </button>
    </div>

    <!-- ── No-image placeholder strip (accent-tinted) ── -->
    <div
      v-else
      class="relative flex h-24 flex-shrink-0 items-center overflow-hidden bg-emerald-50 px-5 dark:bg-emerald-950/40"
    >
      <!-- Dot grid pattern -->
      <svg
        class="absolute inset-0 h-full w-full opacity-[0.15] dark:opacity-[0.2]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern :id="`dots-${index ?? 0}`" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" class="fill-emerald-600 dark:fill-emerald-400" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" :fill="`url(#dots-${index ?? 0})`" />
      </svg>

      <!-- Large faded initials -->
      <span
        class="select-none font-display text-6xl font-bold leading-none tracking-tighter text-emerald-700 opacity-[0.13] dark:text-emerald-300 dark:opacity-[0.12]"
        aria-hidden="true"
      >
        {{ initials }}
      </span>

      <!-- Date badge -->
      <div class="tnum absolute right-3 top-3 flex items-center gap-1 rounded-full border border-sand-200/60 bg-white/80 px-2.5 py-1 font-mono text-xs font-medium text-sand-600 backdrop-blur-sm dark:border-sand-700 dark:bg-sand-900/80 dark:text-sand-400">
        <IconCalendar class="h-3 w-3" aria-hidden="true" />
        {{ project.date }}
      </div>
    </div>

    <!-- ── Card body ── -->
    <div class="flex flex-col flex-1 p-5 gap-4">
      <!-- Name + description -->
      <div class="flex flex-col gap-2">
        <h3 class="font-display text-base font-semibold leading-snug text-sand-900 dark:text-sand-100">
          <a
            v-if="hasLivePreview(project)"
            :href="project.link"
            target="_blank"
            rel="noopener noreferrer"
            class="group/link inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            {{ project.name }}
            <IconExternalLink class="h-3.5 w-3.5 flex-shrink-0 opacity-0 transition-opacity duration-200 group-hover/link:opacity-100" aria-hidden="true" />
          </a>
          <span v-else>{{ project.name }}</span>
        </h3>

        <p
          v-if="getLocalizedContent"
          class="text-xs leading-relaxed text-sand-500 line-clamp-3 dark:text-sand-400"
        >
          {{ getLocalizedContent }}
        </p>
      </div>

      <!-- Tech stack badges -->
      <div class="flex flex-wrap gap-1.5">
        <ClientOnly>
          <Techno
            v-for="techno in project.technos"
            :key="techno"
            :techno="techno"
            size="little"
            class="rounded-md bg-sand-100 px-2 py-0.5 text-xs text-sand-700 dark:bg-sand-800 dark:text-sand-300"
          />
        </ClientOnly>
      </div>

      <!-- Spacer pins CTAs to the bottom so all cards align -->
      <div class="flex-1" />

      <!-- Action buttons -->
      <div class="flex items-center gap-2 border-t border-sand-100 pt-3 dark:border-sand-800">
        <a
          :href="getRepoLink(project)"
          :target="isClosedSource(project) ? '_self' : '_blank'"
          :rel="isClosedSource(project) ? undefined : 'noopener noreferrer'"
          class="inline-flex items-center gap-1.5 rounded-lg bg-sand-900 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-sand-700 dark:bg-sand-100 dark:text-sand-900 dark:hover:bg-sand-300"
        >
          <IconLock v-if="isClosedSource(project)" class="h-3.5 w-3.5" aria-hidden="true" />
          <IconBrandGithub v-else class="h-3.5 w-3.5" aria-hidden="true" />
          {{ isClosedSource(project) ? 'Closed source' : 'Code' }}
        </a>

        <button
          v-if="hasAnyPreview(project)"
          @click="previewModalOpen = true"
          class="inline-flex items-center gap-1.5 rounded-lg border border-sand-200 px-3 py-1.5 text-xs font-medium text-sand-700 transition-colors duration-200 hover:bg-sand-50 dark:border-sand-700 dark:text-sand-300 dark:hover:bg-sand-800"
        >
          <IconEye class="h-3.5 w-3.5" aria-hidden="true" />
          Preview
        </button>
      </div>
    </div>
  </article>

  <!-- Preview Modal -->
  <UModal v-model="previewModalOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-display text-base font-semibold">{{ project.name }}</h3>
          <UButton color="gray" variant="ghost" icon="i-tabler-x" aria-label="Close" @click="previewModalOpen = false" />
        </div>
      </template>

      <div v-if="hasLivePreview(project) && hasVideoPreview(project)" class="mb-4 flex gap-2">
        <UButton @click="currentPreviewMode = 'live'" :variant="currentPreviewMode === 'live' ? 'solid' : 'ghost'">
          <IconPlayerPlay class="mr-1 h-4 w-4" aria-hidden="true" /> Live
        </UButton>
        <UButton @click="currentPreviewMode = 'video'" :variant="currentPreviewMode === 'video' ? 'solid' : 'ghost'">
          <IconVideo class="mr-1 h-4 w-4" aria-hidden="true" /> Video
        </UButton>
      </div>

      <div>
        <div
          v-if="hasLivePreview(project) && (currentPreviewMode === 'live' || !hasVideoPreview(project))"
          class="py-4 text-center"
        >
          <p class="mb-4 text-sm text-sand-600 dark:text-sand-400">Visit the live project:</p>
          <a
            :href="project.link"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-xl bg-sand-900 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-sand-700 dark:bg-sand-100 dark:text-sand-900 dark:hover:bg-sand-300"
          >
            <IconExternalLink class="h-4 w-4" aria-hidden="true" /> Open live project
          </a>
        </div>

        <div
          v-if="hasVideoPreview(project) && (currentPreviewMode === 'video' || !hasLivePreview(project))"
          class="py-2 text-center"
        >
          <p class="mb-3 text-sm text-sand-600 dark:text-sand-400">Video preview</p>
          <div class="aspect-video w-full overflow-hidden rounded-lg" v-html="getSafeVideoEmbed(project.video_url)" />
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<style scoped>
.project-card {
  animation: cardEnter 0.5s ease-out both;
  animation-delay: calc(var(--card-index, 0) * 80ms);
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
