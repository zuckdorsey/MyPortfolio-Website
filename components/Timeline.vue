<script setup lang="ts">
import {
  IconBriefcase,
  IconSchool,
  IconCalendar,
  IconMapPin,
  IconExternalLink,
  IconChevronDown,
} from "@tabler/icons-vue";

export interface TimelineItem {
  _id?: string;
  /** Company or institution name. */
  title?: string;
  /** Link for the title. */
  url?: string;
  /** Position or degree. */
  role?: string;
  /** Location (education). */
  location?: string;
  /** Type badge label (experience). */
  badge?: string;
  period?: { start?: string; end?: string };
  /** HTML description (already localized). */
  description?: string;
  technologies?: string[];
}

const props = withDefaults(
  defineProps<{
    items: TimelineItem[];
    /** Icon shown in the timeline node. */
    icon?: "briefcase" | "school";
    /** Show expandable tech pills (experience). */
    showTech?: boolean;
  }>(),
  { icon: "briefcase", showTech: false }
);

const expanded = ref<Set<string>>(new Set());
const expandedTech = ref<Set<string>>(new Set());

function key(item: TimelineItem, i: number): string {
  return item._id ?? String(i);
}
function toggle(id: string) {
  const s = new Set(expanded.value);
  s.has(id) ? s.delete(id) : s.add(id);
  expanded.value = s;
}
function toggleTech(id: string) {
  const s = new Set(expandedTech.value);
  s.has(id) ? s.delete(id) : s.add(id);
  expandedTech.value = s;
}
const isOpen = (id: string) => expanded.value.has(id);
const isTechOpen = (id: string) => expandedTech.value.has(id);

function truncate(text: string, max = 220): string {
  if (text.length <= max) return text;
  return text.substring(0, max).trimEnd() + "…";
}
const plain = (html: string) => html.replace(/<[^>]*>/g, "");
const needsTrunc = (html: string, max = 220) => plain(html).length > max;
</script>

<template>
  <div class="relative">
    <!-- Vertical line -->
    <div
      class="absolute bottom-3 left-[19px] top-3 hidden w-px bg-gradient-to-b from-sand-300 via-sand-200 to-transparent dark:from-sand-700 dark:via-sand-800 sm:block"
      aria-hidden="true"
    />

    <div class="flex flex-col gap-6">
      <article
        v-for="(item, index) in items"
        :key="key(item, index)"
        class="tl-entry group relative flex gap-5 sm:gap-6"
        :style="{ '--i': index }"
      >
        <!-- Node -->
        <div class="relative z-10 hidden flex-shrink-0 items-start pt-0.5 sm:flex">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl border border-sand-200 bg-white shadow-soft transition-colors duration-300 group-hover:border-emerald-300 dark:border-sand-700 dark:bg-sand-900 dark:group-hover:border-emerald-700"
          >
            <IconBriefcase
              v-if="icon === 'briefcase'"
              class="h-4 w-4 text-sand-400 transition-colors duration-300 group-hover:text-emerald-600 dark:text-sand-500"
              aria-hidden="true"
            />
            <IconSchool
              v-else
              class="h-4 w-4 text-sand-400 transition-colors duration-300 group-hover:text-emerald-600 dark:text-sand-500"
              aria-hidden="true"
            />
          </div>
        </div>

        <!-- Card -->
        <div
          class="min-w-0 flex-1 overflow-hidden rounded-2xl border border-sand-200 bg-white transition-all duration-300 group-hover:border-sand-300 group-hover:shadow-soft dark:border-sand-800 dark:bg-sand-900 dark:group-hover:border-sand-700"
        >
          <div class="flex flex-col gap-3 p-5">
            <!-- Top row -->
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div class="flex flex-col gap-0.5">
                <a
                  v-if="item.url"
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group/link inline-flex items-center gap-1 font-display text-base font-semibold text-sand-900 transition-colors duration-200 hover:text-emerald-700 dark:text-sand-100 dark:hover:text-emerald-300"
                >
                  {{ item.title }}
                  <IconExternalLink
                    class="h-3.5 w-3.5 flex-shrink-0 opacity-0 transition-opacity duration-200 group-hover/link:opacity-70"
                    aria-hidden="true"
                  />
                </a>
                <span
                  v-else
                  class="font-display text-base font-semibold text-sand-900 dark:text-sand-100"
                >
                  {{ item.title }}
                </span>
                <p v-if="item.role" class="text-sm text-sand-500 dark:text-sand-400">
                  {{ item.role }}
                </p>
              </div>

              <div class="flex flex-shrink-0 flex-wrap items-center gap-2">
                <span
                  v-if="item.badge"
                  class="rounded-md bg-sand-100 px-2 py-0.5 text-xs font-medium text-sand-600 dark:bg-sand-800 dark:text-sand-400"
                >
                  {{ item.badge }}
                </span>
                <span
                  v-if="item.location"
                  class="inline-flex items-center gap-1 text-xs text-sand-400 dark:text-sand-500"
                >
                  <IconMapPin class="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                  {{ item.location }}
                </span>
                <span
                  v-if="item.period?.start"
                  class="tnum inline-flex items-center gap-1 font-mono text-xs text-sand-400 dark:text-sand-500"
                >
                  <IconCalendar class="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                  {{ item.period.start }}
                  <span class="mx-0.5">–</span>
                  {{ item.period.end ?? "Present" }}
                </span>
              </div>
            </div>

            <div class="h-px bg-sand-100 dark:bg-sand-800" />

            <!-- Description -->
            <div v-if="item.description" class="flex flex-col gap-2">
              <p
                class="text-sm leading-relaxed text-sand-600 dark:text-sand-400"
                v-html="
                  isOpen(key(item, index))
                    ? item.description
                    : truncate(plain(item.description), 220)
                "
              />
              <button
                v-if="needsTrunc(item.description, 220)"
                @click="toggle(key(item, index))"
                :aria-expanded="isOpen(key(item, index))"
                class="inline-flex w-fit items-center gap-1 rounded text-xs font-medium text-emerald-600 transition-colors duration-200 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                <span>{{ isOpen(key(item, index)) ? "Show less" : "Read more" }}</span>
                <IconChevronDown
                  class="h-3.5 w-3.5 transition-transform duration-200"
                  :class="{ 'rotate-180': isOpen(key(item, index)) }"
                  aria-hidden="true"
                />
              </button>
            </div>

            <!-- Tech pills -->
            <div
              v-if="showTech && item.technologies && item.technologies.length > 0"
              class="flex flex-wrap items-center gap-1.5 pt-1"
            >
              <span
                v-for="tech in isTechOpen(key(item, index))
                  ? item.technologies
                  : item.technologies.slice(0, 4)"
                :key="tech"
                class="inline-flex items-center gap-1 rounded-md bg-sand-100 px-2 py-1 text-xs font-medium text-sand-600 dark:bg-sand-800 dark:text-sand-400"
              >
                <Techno :techno="tech" size="little" />
              </span>
              <button
                v-if="!isTechOpen(key(item, index)) && item.technologies.length > 4"
                @click="toggleTech(key(item, index))"
                :aria-expanded="false"
                class="inline-flex items-center gap-1 rounded-md border border-sand-200 px-2 py-1 text-xs text-sand-400 transition-colors duration-200 hover:border-sand-300 hover:text-sand-600 dark:border-sand-700 dark:text-sand-500 dark:hover:border-sand-600 dark:hover:text-sand-300"
              >
                +{{ item.technologies.length - 4 }} more
              </button>
              <button
                v-if="isTechOpen(key(item, index))"
                @click="toggleTech(key(item, index))"
                :aria-expanded="true"
                class="inline-flex items-center gap-1 text-xs text-sand-400 transition-colors duration-200 hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300"
              >
                Show less
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.tl-entry {
  animation: tlEnter 0.45s ease-out both;
  animation-delay: calc(var(--i, 0) * 90ms);
}
@keyframes tlEnter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .tl-entry {
    animation: none;
  }
}
</style>
