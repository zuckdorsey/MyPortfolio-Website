<script setup lang="ts">
import {
  IconCertificate,
  IconExternalLink,
  IconCalendar,
  IconBuildingSkyscraper,
  IconListDetails,
} from "@tabler/icons-vue";

interface ContentCertification {
  _id?: string;
  id?: number;
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

// Selected cert for the detail modal (null = closed)
const selected = ref<ContentCertification | null>(null);

function open(cert: ContentCertification) {
  selected.value = cert;
}
function close() {
  selected.value = null;
}

// Split a pipe-separated skills string into trimmed topic chips.
function topicsOf(skills?: string): string[] {
  if (!skills) return [];
  return skills
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean);
}

// Human label for the provider, derived from the icon when present.
function providerOf(cert: ContentCertification): string {
  if (!cert.icon) return "Certificate";
  const raw = cert.icon.split(":")[1] || cert.icon;
  const name = raw.replace(/^brand-/, "");
  return name.charAt(0).toUpperCase() + name.slice(1);
}
</script>

<template>
  <Section
    anchor="certifications"
    kicker="Credentials"
    title="Certifications"
    subtitle="Courses and credentials I've completed."
  >
    <!-- Compact grid -->
    <div
      v-if="certifications && certifications.length > 0"
      class="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <article
        v-for="(cert, index) in certifications"
        :key="cert._id ?? cert.id ?? index"
        class="cert-entry group flex cursor-pointer flex-col gap-2.5 rounded-2xl border border-sand-200/80 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-sand-300 hover:shadow-soft focus-visible:ring-2 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700"
        :style="{ '--i': index }"
        role="button"
        tabindex="0"
        :aria-label="`View details for ${cert.title}`"
        @click="open(cert)"
        @keydown.enter.prevent="open(cert)"
        @keydown.space.prevent="open(cert)"
      >
        <!-- Top: icon + title + date -->
        <div class="flex items-start gap-3">
          <div
            class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-sand-100 transition-colors group-hover:bg-emerald-50 dark:bg-sand-800 dark:group-hover:bg-emerald-950/50"
          >
            <UIcon v-if="cert.icon" :name="cert.icon" class="text-xl" :title="cert.badge_alt" />
            <IconCertificate v-else class="h-4 w-4 text-sand-400 dark:text-sand-500" aria-hidden="true" />
          </div>

          <div class="flex min-w-0 flex-1 flex-col gap-0.5">
            <h3 class="truncate text-sm font-semibold leading-snug text-sand-900 transition-colors group-hover:text-emerald-700 dark:text-sand-100 dark:group-hover:text-emerald-300">
              {{ cert.title }}
            </h3>
            <span class="text-[11px] leading-none text-sand-400 dark:text-sand-500">
              {{ providerOf(cert) }}
            </span>
          </div>

          <span class="tnum inline-flex flex-shrink-0 items-center gap-1 whitespace-nowrap font-mono text-[11px] text-sand-400 dark:text-sand-500">
            <IconCalendar class="h-3 w-3" aria-hidden="true" />
            {{ cert.date }}
          </span>
        </div>

        <!-- Clamped description -->
        <p
          v-if="cert.description"
          class="line-clamp-2 text-xs leading-relaxed text-sand-500 dark:text-sand-400"
        >
          {{ cert.description }}
        </p>

        <!-- Footer hint -->
        <div class="mt-auto flex items-center justify-between gap-3 border-t border-sand-100 pt-2.5 dark:border-sand-800/70">
          <span class="inline-flex items-center gap-1 text-[11px] text-sand-400 dark:text-sand-500">
            <IconListDetails class="h-3.5 w-3.5" aria-hidden="true" />
            {{ topicsOf(cert.skills).length }} topics
          </span>
          <span class="inline-flex items-center gap-1 text-[11px] font-medium text-sand-400 transition-colors group-hover:text-emerald-600 dark:text-sand-500 dark:group-hover:text-emerald-400">
            Details
            <IconExternalLink class="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </div>
      </article>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="certifications !== null"
      class="flex flex-col items-center justify-center gap-3 py-16 text-center"
    >
      <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-sand-100 dark:bg-sand-800">
        <IconCertificate class="h-6 w-6 text-sand-400 dark:text-sand-500" aria-hidden="true" />
      </div>
      <p class="text-sm text-sand-500 dark:text-sand-400">No certifications yet.</p>
    </div>

    <!-- ── Detail modal ── -->
    <UModal
      :model-value="selected !== null"
      @update:model-value="(v) => { if (!v) close() }"
      :ui="{ width: 'sm:max-w-lg' }"
    >
      <UCard v-if="selected">
        <template #header>
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-start gap-3">
              <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sand-100 dark:bg-sand-800">
                <UIcon v-if="selected.icon" :name="selected.icon" class="text-2xl" :title="selected.badge_alt" />
                <IconCertificate v-else class="h-5 w-5 text-sand-400 dark:text-sand-500" aria-hidden="true" />
              </div>
              <div class="flex flex-col gap-1">
                <h3 class="font-display text-base font-semibold leading-snug text-sand-900 dark:text-sand-100">
                  {{ selected.title }}
                </h3>
                <!-- Meta row -->
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-sand-500 dark:text-sand-400">
                  <span class="inline-flex items-center gap-1">
                    <IconBuildingSkyscraper class="h-3.5 w-3.5" aria-hidden="true" />
                    {{ providerOf(selected) }}
                  </span>
                  <span class="tnum inline-flex items-center gap-1 font-mono">
                    <IconCalendar class="h-3.5 w-3.5" aria-hidden="true" />
                    {{ selected.date }}
                  </span>
                </div>
              </div>
            </div>
            <button
              @click="close"
              class="rounded-lg p-1 text-sand-400 transition-colors hover:bg-sand-100 hover:text-sand-600 dark:hover:bg-sand-800 dark:hover:text-sand-300"
              aria-label="Close details"
            >
              <UIcon name="i-tabler-x" class="h-5 w-5" />
            </button>
          </div>
        </template>

        <!-- Full description -->
        <p v-if="selected.description" class="text-sm leading-relaxed text-sand-600 dark:text-sand-300">
          {{ selected.description }}
        </p>

        <!-- Topics -->
        <div v-if="topicsOf(selected.skills).length" class="mt-5">
          <p class="mb-2.5 text-xs font-medium uppercase tracking-wide text-sand-400 dark:text-sand-500">
            Topics covered
          </p>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="topic in topicsOf(selected.skills)"
              :key="topic"
              class="rounded-md bg-sand-100 px-2.5 py-1 text-xs leading-none text-sand-700 dark:bg-sand-800 dark:text-sand-300"
            >
              {{ topic }}
            </span>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-end">
            <a
              v-if="selected.website"
              :href="selected.website"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 rounded-lg bg-sand-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-sand-700 active:scale-[0.98] dark:bg-sand-100 dark:text-sand-900 dark:hover:bg-sand-300"
            >
              <IconExternalLink class="h-4 w-4" aria-hidden="true" />
              View credential
            </a>
          </div>
        </template>
      </UCard>
    </UModal>
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
