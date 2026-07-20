<script setup lang="ts">
import {
  IconBriefcase,
  IconCalendar,
  IconExternalLink,
  IconChevronDown,
  IconChevronUp,
  IconCode,
} from "@tabler/icons-vue";

type LocaleType = "en" | "id";

interface ContentExperience {
  _id?: string;
  _path?: string;
  company?: string;
  companyUrl?: string;
  position?: string;
  period?: {
    start?: string;
    end?: string;
  };
  type?: string;
  content?: {
    en?: string;
    id?: string;
    [key: string]: string | undefined;
  };
  technologies?: string[];
}

const currentLocale = "en";

const { data: experiences } = await useAsyncData<ContentExperience[]>(
  "experiences",
  async () => {
    const items = await $fetch<any[]>("/api/experiences");
    return items.map((exp) => ({
      ...exp,
      companyUrl: exp.company_url,
      period: {
        start: exp.start_date,
        end: exp.end_date,
      },
      content: {
        en: exp.content_en,
        id: exp.content_id,
      },
      technologies: exp.technologies || [],
    })) as ContentExperience[];
  }
);

const getLocalizedContent = (exp: ContentExperience): string => {
  return exp.content?.[currentLocale] ?? "";
};

const expandedIds = ref<Set<string>>(new Set());
const expandedTech = ref<Set<string>>(new Set());

function expId(exp: ContentExperience, index: number): string {
  return exp._id ?? String(index);
}

function toggleDescription(id: string) {
  const s = new Set(expandedIds.value);
  s.has(id) ? s.delete(id) : s.add(id);
  expandedIds.value = s;
}

function toggleTech(id: string) {
  const s = new Set(expandedTech.value);
  s.has(id) ? s.delete(id) : s.add(id);
  expandedTech.value = s;
}

function isExpanded(id: string): boolean {
  return expandedIds.value.has(id);
}

function isTechExpanded(id: string): boolean {
  return expandedTech.value.has(id);
}

function truncateText(text: string, max = 220): string {
  if (text.length <= max) return text;
  return text.substring(0, max).trimEnd() + "…";
}

function needsTruncation(text: string, max = 220): boolean {
  return text.length > max;
}

const typeLabel: Record<string, string> = {
  apprenticeship: "Apprenticeship",
  internship: "Internship",
  job: "Full-time",
  freelance: "Freelance",
  contract: "Contract",
};
</script>

<template>
  <section class="flex flex-col gap-8" id="experience">
    <!-- Section header -->
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <div class="w-1 h-6 rounded-full bg-primary-500" />
        <a href="#experience" class="group">
          <h2
            class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200"
          >
            Experience
          </h2>
        </a>
      </div>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 pl-3">
        Where I've worked and what I built there.
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
          v-for="(exp, index) in experiences"
          :key="expId(exp, index)"
          class="exp-entry group relative flex gap-5 sm:gap-6"
          :style="{ '--i': index }"
        >
          <!-- Timeline dot -->
          <div
            class="relative z-10 flex-shrink-0 hidden sm:flex items-start pt-0.5"
          >
            <div
              class="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 group-hover:border-primary-300 dark:group-hover:border-primary-700 flex items-center justify-center transition-colors duration-300 shadow-sm"
            >
              <IconBriefcase
                class="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-primary-500 transition-colors duration-300"
              />
            </div>
          </div>

          <!-- Card -->
          <div
            class="flex-1 min-w-0 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-all duration-300 group-hover:shadow-md group-hover:shadow-neutral-100 dark:group-hover:shadow-black/20 overflow-hidden"
          >
            <div class="p-5 flex flex-col gap-3">
              <!-- Top row: company + period -->
              <div
                class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2"
              >
                <!-- Company & position -->
                <div class="flex flex-col gap-0.5">
                  <div class="flex items-center gap-1.5">
                    <a
                      v-if="exp.companyUrl"
                      :href="exp.companyUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-base font-semibold text-neutral-900 dark:text-neutral-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 inline-flex items-center gap-1 group/link"
                    >
                      {{ exp.company }}
                      <IconExternalLink
                        class="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-70 transition-opacity duration-200 flex-shrink-0"
                      />
                    </a>
                    <span
                      v-else
                      class="text-base font-semibold text-neutral-900 dark:text-neutral-100"
                    >
                      {{ exp.company }}
                    </span>
                  </div>

                  <p
                    v-if="exp.position"
                    class="text-sm text-neutral-500 dark:text-neutral-400"
                  >
                    {{ exp.position }}
                  </p>
                </div>

                <!-- Period + type badge -->
                <div class="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  <span
                    v-if="exp.type"
                    class="text-xs font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                  >
                    {{ typeLabel[exp.type] ?? exp.type }}
                  </span>

                  <span
                    v-if="exp.period?.start"
                    class="inline-flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 tabular-nums"
                  >
                    <IconCalendar class="w-3 h-3 flex-shrink-0" />
                    {{ exp.period.start }}
                    <span class="mx-0.5">–</span>
                    {{ exp.period.end ?? "Present" }}
                  </span>
                </div>
              </div>

              <!-- Divider -->
              <div class="h-px bg-neutral-100 dark:bg-neutral-800" />

              <!-- Description -->
              <div v-if="getLocalizedContent(exp)" class="flex flex-col gap-2">
                <p
                  class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
                  v-html="
                    isExpanded(expId(exp, index))
                      ? getLocalizedContent(exp)
                      : truncateText(
                          getLocalizedContent(exp).replace(/<[^>]*>/g, ''),
                          220
                        )
                  "
                />

                <button
                  v-if="
                    needsTruncation(
                      getLocalizedContent(exp).replace(/<[^>]*>/g, ''),
                      220
                    )
                  "
                  @click="toggleDescription(expId(exp, index))"
                  class="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                >
                  <span>{{
                    isExpanded(expId(exp, index)) ? "Show less" : "Read more"
                  }}</span>
                  <IconChevronDown
                    class="w-3.5 h-3.5 transition-transform duration-200"
                    :class="{ 'rotate-180': isExpanded(expId(exp, index)) }"
                  />
                </button>
              </div>

              <!-- Tech stack — inline pills, expandable -->
              <div
                v-if="exp.technologies && exp.technologies.length > 0"
                class="flex flex-wrap items-center gap-1.5 pt-1"
              >
                <ClientOnly>
                  <template
                    v-for="tech in isTechExpanded(expId(exp, index))
                      ? exp.technologies
                      : exp.technologies.slice(0, 4)"
                    :key="tech"
                  >
                    <span
                      class="inline-flex items-center gap-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded-md"
                    >
                      <Techno :techno="tech" size="little" />
                    </span>
                  </template>
                </ClientOnly>

                <button
                  v-if="
                    !isTechExpanded(expId(exp, index)) &&
                    exp.technologies.length > 4
                  "
                  @click="toggleTech(expId(exp, index))"
                  class="inline-flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 px-2 py-1 rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <IconCode class="w-3 h-3" />
                  +{{ exp.technologies.length - 4 }} more
                </button>

                <button
                  v-if="isTechExpanded(expId(exp, index))"
                  @click="toggleTech(expId(exp, index))"
                  class="inline-flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                >
                  <IconChevronUp class="w-3 h-3" />
                  Show less
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
.exp-entry {
  animation: expEnter 0.45s ease-out both;
  animation-delay: calc(var(--i, 0) * 90ms);
}

@keyframes expEnter {
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
