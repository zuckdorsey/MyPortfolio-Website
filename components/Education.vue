<script setup lang="ts">
import {
  IconSchool,
  IconCalendar,
  IconMapPin,
  IconExternalLink,
  IconChevronDown,
} from "@tabler/icons-vue";

type LocaleType = "en" | "id";

interface ContentEducation {
  _id?: string;
  _path?: string;
  institution?: string;
  website?: string;
  degree?: string;
  period?: {
    start?: string;
    end?: string;
  };
  location?: string;
  content?: {
    en?: string;
    id?: string;
    [key: string]: string | undefined;
  };
}

const currentLocale = "en";

const { data: education } = await useAsyncData<ContentEducation[]>(
  "education",
  async () => {
    const items = await $fetch<any[]>("/api/education");
    return items.map((edu) => ({
      ...edu,
      period: {
        start: edu.start_date,
        end: edu.end_date,
      },
      content: {
        en: edu.content_en,
        id: edu.content_id,
      },
    })) as ContentEducation[];
  }
);

const getLocalizedContent = (edu: ContentEducation): string => {
  return edu.content?.[currentLocale] ?? "";
};

const expandedIds = ref<Set<string>>(new Set());

function eduId(edu: ContentEducation, index: number): string {
  return edu._id ?? String(index);
}

function toggleDescription(id: string) {
  const s = new Set(expandedIds.value);
  s.has(id) ? s.delete(id) : s.add(id);
  expandedIds.value = s;
}

function isExpanded(id: string): boolean {
  return expandedIds.value.has(id);
}

function truncateText(text: string, max = 220): string {
  if (text.length <= max) return text;
  return text.substring(0, max).trimEnd() + "…";
}

function needsTruncation(text: string, max = 220): boolean {
  return text.length > max;
}
</script>

<template>
  <section class="flex flex-col gap-8" id="education">
    <!-- Section header -->
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <div class="w-1 h-6 rounded-full bg-primary-500" />
        <a href="#education" class="group">
          <h2
            class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200"
          >
            Education
          </h2>
        </a>
      </div>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 pl-3">
        Where I studied and what I focused on.
      </p>
    </div>

    <!-- Timeline -->
    <div class="relative">
      <!-- Vertical line -->
      <div
        class="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-neutral-300 via-neutral-200 to-transparent dark:from-neutral-700 dark:via-neutral-800 hidden sm:block"
      />

      <div class="flex flex-col gap-6">
        <article
          v-for="(edu, index) in education"
          :key="eduId(edu, index)"
          class="edu-entry group relative flex gap-5 sm:gap-6"
          :style="{ '--i': index }"
        >
          <!-- Timeline dot -->
          <div
            class="relative z-10 flex-shrink-0 hidden sm:flex items-start pt-0.5"
          >
            <div
              class="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 group-hover:border-primary-300 dark:group-hover:border-primary-700 flex items-center justify-center transition-colors duration-300 shadow-sm"
            >
              <IconSchool
                class="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-primary-500 transition-colors duration-300"
              />
            </div>
          </div>

          <!-- Card -->
          <div
            class="flex-1 min-w-0 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-all duration-300 group-hover:shadow-md group-hover:shadow-neutral-100 dark:group-hover:shadow-black/20 overflow-hidden"
          >
            <div class="p-5 flex flex-col gap-3">

              <!-- Top row: institution + period -->
              <div
                class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2"
              >
                <!-- Institution & degree -->
                <div class="flex flex-col gap-0.5">
                  <div class="flex items-center gap-1.5">
                    <a
                      v-if="edu.website"
                      :href="edu.website"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-base font-semibold text-neutral-900 dark:text-neutral-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 inline-flex items-center gap-1 group/link"
                    >
                      {{ edu.institution }}
                      <IconExternalLink
                        class="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-70 transition-opacity duration-200 flex-shrink-0"
                      />
                    </a>
                    <span
                      v-else
                      class="text-base font-semibold text-neutral-900 dark:text-neutral-100"
                    >
                      {{ edu.institution }}
                    </span>
                  </div>

                  <p
                    v-if="edu.degree"
                    class="text-sm text-neutral-500 dark:text-neutral-400"
                  >
                    {{ edu.degree }}
                  </p>
                </div>

                <!-- Period + location -->
                <div class="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  <span
                    v-if="edu.location"
                    class="inline-flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500"
                  >
                    <IconMapPin class="w-3 h-3 flex-shrink-0" />
                    {{ edu.location }}
                  </span>

                  <span
                    v-if="edu.period?.start"
                    class="inline-flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 tabular-nums"
                  >
                    <IconCalendar class="w-3 h-3 flex-shrink-0" />
                    {{ edu.period.start }}
                    <span class="mx-0.5">–</span>
                    {{ edu.period.end ?? "Present" }}
                  </span>
                </div>
              </div>

              <!-- Divider -->
              <div class="h-px bg-neutral-100 dark:bg-neutral-800" />

              <!-- Description -->
              <div v-if="getLocalizedContent(edu)" class="flex flex-col gap-2">
                <p
                  class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
                  v-html="
                    isExpanded(eduId(edu, index))
                      ? getLocalizedContent(edu)
                      : truncateText(
                          getLocalizedContent(edu).replace(/<[^>]*>/g, ''),
                          220
                        )
                  "
                />

                <button
                  v-if="
                    needsTruncation(
                      getLocalizedContent(edu).replace(/<[^>]*>/g, ''),
                      220
                    )
                  "
                  @click="toggleDescription(eduId(edu, index))"
                  class="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                >
                  <span>{{
                    isExpanded(eduId(edu, index)) ? "Show less" : "Read more"
                  }}</span>
                  <IconChevronDown
                    class="w-3.5 h-3.5 transition-transform duration-200"
                    :class="{ 'rotate-180': isExpanded(eduId(edu, index)) }"
                  />
                </button>
              </div>

            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.edu-entry {
  animation: eduEnter 0.45s ease-out both;
  animation-delay: calc(var(--i, 0) * 90ms);
}

@keyframes eduEnter {
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
