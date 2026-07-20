<script setup lang="ts">
import {
  IconCertificate,
  IconExternalLink,
  IconCalendar,
  IconChevronDown,
} from "@tabler/icons-vue";

interface ContentCertification {
  _id?: string;
  _path?: string;
  title: string;
  website?: string;
  date: string;
  icon?: string;
  badge_alt: string;
  description: string;
  skills?: string;
}

const { data: certifications } = await useLazyAsyncData<ContentCertification[]>(
  "certifications",
  async () => {
    const items = await $fetch<ContentCertification[]>("/api/certifications");
    return items;
  }
);

const expandedIds = ref<Set<string>>(new Set());

function certId(cert: ContentCertification, index: number): string {
  return cert._id ?? String(index);
}

function toggle(id: string) {
  const s = new Set(expandedIds.value);
  s.has(id) ? s.delete(id) : s.add(id);
  expandedIds.value = s;
}

function isExpanded(id: string): boolean {
  return expandedIds.value.has(id);
}
</script>

<template>
  <section class="flex flex-col gap-8" id="certifications">
    <!-- Section header -->
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <div class="w-1 h-6 rounded-full bg-primary-500" />
        <a href="#certifications" class="group">
          <h2
            class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200"
          >
            Certifications
          </h2>
        </a>
      </div>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 pl-3">
        Courses and credentials I've completed.
      </p>
    </div>

    <!-- Grid -->
    <div
      v-if="certifications && certifications.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <article
        v-for="(cert, index) in certifications"
        :key="certId(cert, index)"
        class="cert-entry group flex flex-col bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-md hover:shadow-neutral-100 dark:hover:shadow-black/20 overflow-hidden"
        :style="{ '--i': index }"
      >
        <div class="p-5 flex flex-col gap-3 flex-1">

          <!-- Top row: icon + title + date -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3 min-w-0">
              <!-- Provider icon -->
              <div
                class="flex-shrink-0 w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
              >
                <UIcon
                  v-if="cert.icon"
                  :name="cert.icon"
                  class="text-xl"
                  :title="cert.badge_alt"
                />
                <IconCertificate
                  v-else
                  class="w-4 h-4 text-neutral-400 dark:text-neutral-500"
                />
              </div>

              <!-- Title -->
              <div class="min-w-0 flex flex-col gap-0.5">
                <a
                  v-if="cert.website"
                  :href="cert.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 inline-flex items-center gap-1 group/link leading-snug"
                >
                  <span class="text-pretty">{{ cert.title }}</span>
                  <IconExternalLink
                    class="w-3 h-3 flex-shrink-0 opacity-0 group-hover/link:opacity-70 transition-opacity duration-200"
                  />
                </a>
                <span
                  v-else
                  class="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug text-pretty"
                >
                  {{ cert.title }}
                </span>
              </div>
            </div>

            <!-- Date -->
            <span
              class="flex-shrink-0 inline-flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 tabular-nums whitespace-nowrap"
            >
              <IconCalendar class="w-3 h-3" />
              {{ cert.date }}
            </span>
          </div>

          <!-- Divider -->
          <div class="h-px bg-neutral-100 dark:bg-neutral-800" />

          <!-- Description -->
          <p
            v-if="cert.description"
            class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed"
          >
            {{ cert.description }}
          </p>

          <!-- Skills — expandable -->
          <div v-if="cert.skills" class="flex flex-col gap-1.5">
            <button
              @click="toggle(certId(cert, index))"
              class="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            >
              <span>{{ isExpanded(certId(cert, index)) ? "Hide topics" : "Topics covered" }}</span>
              <IconChevronDown
                class="w-3.5 h-3.5 transition-transform duration-200"
                :class="{ 'rotate-180': isExpanded(certId(cert, index)) }"
              />
            </button>

            <div
              v-if="isExpanded(certId(cert, index))"
              class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed border-l-2 border-neutral-200 dark:border-neutral-700 pl-3"
              v-html="cert.skills"
            />
          </div>

        </div>
      </article>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="certifications !== null"
      class="flex flex-col items-center justify-center py-16 gap-3 text-center"
    >
      <div
        class="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
      >
        <IconCertificate class="w-6 h-6 text-neutral-400 dark:text-neutral-500" />
      </div>
      <p class="text-sm text-neutral-500 dark:text-neutral-400">
        No certifications yet.
      </p>
    </div>
  </section>
</template>

<style scoped>
.cert-entry {
  animation: certEnter 0.45s ease-out both;
  animation-delay: calc(var(--i, 0) * 70ms);
}

@keyframes certEnter {
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
