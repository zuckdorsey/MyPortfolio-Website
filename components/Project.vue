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
    class="project-card group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-500 hover:shadow-xl hover:shadow-neutral-200/60 dark:hover:shadow-black/40 hover:-translate-y-1"
    :style="{ '--card-index': index ?? 0 }"
  >
    <!-- ── Image strip (when image exists and loads) ── -->
    <div
      v-if="showImage"
      class="relative h-44 overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0"
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
      <div class="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent dark:from-neutral-900/70" />

      <!-- Date badge -->
      <div class="absolute top-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-neutral-600 dark:text-neutral-400 text-xs font-medium px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-700">
        <IconCalendar class="w-3 h-3" />
        {{ project.date }}
      </div>

      <!-- Preview hover overlay -->
      <button
        v-if="hasAnyPreview(project)"
        @click="previewModalOpen = true"
        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Preview project"
      >
        <span class="flex items-center gap-2 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm text-neutral-800 dark:text-neutral-100 text-sm font-medium px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <IconEye class="w-4 h-4" />
          Preview
        </span>
      </button>
    </div>

    <!-- ── No-image placeholder strip ── -->
    <div
      v-else
      class="relative h-24 flex-shrink-0 overflow-hidden flex items-center px-5"
      :style="{
        background: `linear-gradient(135deg, hsl(${placeholderHue},18%,94%) 0%, hsl(${placeholderHue},12%,89%) 100%)`,
      }"
      :class="'dark:[background:linear-gradient(135deg,hsl(var(--placeholder-h,220),15%,16%)_0%,hsl(var(--placeholder-h,220),10%,12%)_100%)]'"
    >
      <!-- Dot grid pattern -->
      <svg
        class="absolute inset-0 w-full h-full opacity-[0.18] dark:opacity-[0.25]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" :fill="`hsl(${placeholderHue},30%,50%)`" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      <!-- Large faded initials -->
      <span
        class="select-none font-bold tracking-tighter leading-none text-6xl opacity-10 dark:opacity-[0.08]"
        :style="{ color: `hsl(${placeholderHue},40%,30%)` }"
        aria-hidden="true"
      >
        {{ initials }}
      </span>

      <!-- Date badge -->
      <div class="absolute top-3 right-3 flex items-center gap-1 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm text-neutral-600 dark:text-neutral-400 text-xs font-medium px-2.5 py-1 rounded-full border border-neutral-200/60 dark:border-neutral-700">
        <IconCalendar class="w-3 h-3" />
        {{ project.date }}
      </div>
    </div>

    <!-- ── Card body ── -->
    <div class="flex flex-col flex-1 p-5 gap-4">
      <!-- Name + description -->
      <div class="flex flex-col gap-2">
        <h3 class="text-base font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
          <a
            v-if="hasLivePreview(project)"
            :href="project.link"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 inline-flex items-center gap-1.5 group/link"
          >
            {{ project.name }}
            <IconExternalLink class="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 flex-shrink-0" />
          </a>
          <span v-else>{{ project.name }}</span>
        </h3>

        <p
          v-if="getLocalizedContent"
          class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3"
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
            class="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded-md text-xs"
          />
        </ClientOnly>
      </div>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Action buttons -->
      <div class="flex items-center gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
        <a
          :href="getRepoLink(project)"
          :target="isClosedSource(project) ? '_self' : '_blank'"
          :rel="isClosedSource(project) ? undefined : 'noopener noreferrer'"
          class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors duration-200"
        >
          <IconLock v-if="isClosedSource(project)" class="w-3.5 h-3.5" />
          <IconBrandGithub v-else class="w-3.5 h-3.5" />
          {{ isClosedSource(project) ? 'Closed source' : 'Code' }}
        </a>

        <button
          v-if="hasAnyPreview(project)"
          @click="previewModalOpen = true"
          class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-200"
        >
          <IconEye class="w-3.5 h-3.5" />
          Preview
        </button>
      </div>
    </div>
  </article>

  <!-- Preview Modal -->
  <UModal v-model="previewModalOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-neutral-100 dark:divide-neutral-800', rounded: 'rounded-2xl' }">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-base font-semibold">{{ project.name }}</h3>
          <UButton color="gray" variant="ghost" icon="i-tabler-x" @click="previewModalOpen = false" />
        </div>
      </template>

      <div v-if="hasLivePreview(project) && hasVideoPreview(project)" class="flex gap-2 mb-4">
        <UButton @click="currentPreviewMode = 'live'" :variant="currentPreviewMode === 'live' ? 'solid' : 'ghost'">
          <IconPlayerPlay class="w-4 h-4 mr-1" /> Live
        </UButton>
        <UButton @click="currentPreviewMode = 'video'" :variant="currentPreviewMode === 'video' ? 'solid' : 'ghost'">
          <IconVideo class="w-4 h-4 mr-1" /> Video
        </UButton>
      </div>

      <div>
        <div
          v-if="hasLivePreview(project) && (currentPreviewMode === 'live' || !hasVideoPreview(project))"
          class="text-center py-4"
        >
          <p class="mb-4 text-sm text-neutral-600 dark:text-neutral-400">Visit the live project:</p>
          <a
            :href="project.link"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors duration-200"
          >
            <IconExternalLink class="w-4 h-4" /> Open live project
          </a>
        </div>

        <div
          v-if="hasVideoPreview(project) && (currentPreviewMode === 'video' || !hasLivePreview(project))"
          class="text-center py-2"
        >
          <p class="mb-3 text-sm text-neutral-600 dark:text-neutral-400">Video preview</p>
          <div class="aspect-video w-full rounded-lg overflow-hidden" v-html="getSafeVideoEmbed(project.video_url)" />
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
