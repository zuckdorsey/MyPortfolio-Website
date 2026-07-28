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
  <Section
    anchor="certifications"
    kicker="Credentials"
    title="Certifications"
    subtitle="Courses and credentials I've completed."
  >
    <!-- Grid -->
    <div
      v-if="certifications && certifications.length > 0"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <article
        v-for="(cert, index) in certifications"
        :key="certId(cert, index)"
        class="cert-entry group flex flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white transition-all duration-300 hover:border-sand-300 hover:shadow-soft dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700"
        :style="{ '--i': index }"
      >
        <div class="flex flex-1 flex-col gap-3 p-5">

          <!-- Top row: icon + title + date -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex min-w-0 items-start gap-3">
              <!-- Provider icon -->
              <div
                class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-sand-100 dark:bg-sand-800"
              >
                <UIcon
                  v-if="cert.icon"
                  :name="cert.icon"
                  class="text-xl"
                  :title="cert.badge_alt"
                />
                <IconCertificate
                  v-else
                  class="h-4 w-4 text-sand-400 dark:text-sand-500"
                  aria-hidden="true"
                />
              </div>

              <!-- Title -->
              <div class="flex min-w-0 flex-col gap-0.5">
                <a
                  v-if="cert.website"
                  :href="cert.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group/link inline-flex items-center gap-1 text-sm font-semibold leading-snug text-sand-900 transition-colors duration-200 hover:text-emerald-700 dark:text-sand-100 dark:hover:text-emerald-300"
                >
                  <span class="text-pretty">{{ cert.title }}</span>
                  <IconExternalLink
                    class="h-3 w-3 flex-shrink-0 opacity-0 transition-opacity duration-200 group-hover/link:opacity-70"
                    aria-hidden="true"
                  />
                </a>
                <span
                  v-else
                  class="text-pretty text-sm font-semibold leading-snug text-sand-900 dark:text-sand-100"
                >
                  {{ cert.title }}
                </span>
              </div>
            </div>

            <!-- Date -->
            <span
              class="tnum inline-flex flex-shrink-0 items-center gap-1 whitespace-nowrap font-mono text-xs text-sand-400 dark:text-sand-500"
            >
              <IconCalendar class="h-3 w-3" aria-hidden="true" />
              {{ cert.date }}
            </span>
          </div>

          <!-- Divider -->
          <div class="h-px bg-sand-100 dark:bg-sand-800" />

          <!-- Description -->
          <p
            v-if="cert.description"
            class="text-xs leading-relaxed text-sand-600 dark:text-sand-400"
          >
            {{ cert.description }}
          </p>

          <!-- Skills — expandable -->
          <div v-if="cert.skills" class="flex flex-col gap-1.5">
            <button
              @click="toggle(certId(cert, index))"
              :aria-expanded="isExpanded(certId(cert, index))"
              class="inline-flex w-fit items-center gap-1 text-xs font-medium text-emerald-600 transition-colors duration-200 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <span>{{ isExpanded(certId(cert, index)) ? "Hide topics" : "Topics covered" }}</span>
              <IconChevronDown
                class="h-3.5 w-3.5 transition-transform duration-200"
                :class="{ 'rotate-180': isExpanded(certId(cert, index)) }"
                aria-hidden="true"
              />
            </button>

            <div
              v-if="isExpanded(certId(cert, index))"
              class="border-l-2 border-sand-200 pl-3 text-xs leading-relaxed text-sand-500 dark:border-sand-700 dark:text-sand-400"
              v-html="cert.skills"
            />
          </div>

        </div>
      </article>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="certifications !== null"
      class="flex flex-col items-center justify-center gap-3 py-16 text-center"
    >
      <div
        class="flex h-12 w-12 items-center justify-center rounded-2xl bg-sand-100 dark:bg-sand-800"
      >
        <IconCertificate class="h-6 w-6 text-sand-400 dark:text-sand-500" aria-hidden="true" />
      </div>
      <p class="text-sm text-sand-500 dark:text-sand-400">
        No certifications yet.
      </p>
    </div>
  </Section>
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
