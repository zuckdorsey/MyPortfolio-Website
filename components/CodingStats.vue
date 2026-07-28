<script setup lang="ts">
import {
  IconCode,
  IconClock,
  IconBrandGithub,
  IconTrendingUp,
  IconCalendarTime,
  IconAlertCircle,
  IconRefresh,
} from "@tabler/icons-vue";

interface WakaTimeStats {
  data: {
    languages: Language[];
    human_readable_total: string;
    human_readable_daily_average: string;
    days_including_holidays: number;
    best_day: { date: string; text: string; seconds: number };
  };
}
interface Language {
  name: string;
  total_seconds: number;
  percent: number;
  text: string;
}

const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref("");
const stats = ref<WakaTimeStats | null>(null);
const refreshing = ref(false);

const formattedBestDay = computed(() => {
  const d = stats.value?.data?.best_day?.date;
  if (!d) return "N/A";
  try {
    return new Date(d).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
});

const formatTime = (seconds: number) => {
  if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) return "0h 0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const getLanguageColor = (language: string) => {
  const colors: Record<string, string> = {
    JavaScript: "bg-yellow-500",
    TypeScript: "bg-blue-600",
    Python: "bg-blue-500",
    PHP: "bg-violet-500",
    Vue: "bg-emerald-500",
    HTML: "bg-orange-600",
    CSS: "bg-sky-400",
    Java: "bg-red-600",
    Markdown: "bg-sand-500",
    JSON: "bg-sand-400",
    Go: "bg-cyan-500",
    Ruby: "bg-red-500",
    Rust: "bg-orange-700",
    Kotlin: "bg-orange-500",
    Swift: "bg-orange-600",
    Dart: "bg-sky-400",
  };
  return colors[language] || "bg-sand-400";
};

const fetchWakaTimeStats = async () => {
  try {
    isLoading.value = true;
    hasError.value = false;
    stats.value = await $fetch<WakaTimeStats>("/api/wakatime");
  } catch (error) {
    console.error("Error fetching WakaTime stats:", error);
    hasError.value = true;
    errorMessage.value = "Couldn't load coding statistics. Try again.";
  } finally {
    isLoading.value = false;
  }
};

const refreshData = async () => {
  if (refreshing.value) return;
  refreshing.value = true;
  await fetchWakaTimeStats();
  setTimeout(() => (refreshing.value = false), 600);
};

onMounted(fetchWakaTimeStats);
</script>

<template>
  <Section
    anchor="coding-stats"
    kicker="Activity"
    title="Coding statistics"
    subtitle="Live data from WakaTime over the last 30 days."
  >
    <template #header-actions>
      <UButton
        size="xs"
        color="gray"
        variant="ghost"
        :loading="refreshing"
        :disabled="isLoading || refreshing"
        @click="refreshData"
        aria-label="Refresh coding statistics"
      >
        <template #icon><IconRefresh class="h-4 w-4" aria-hidden="true" /></template>
        <span class="text-xs">Refresh</span>
      </UButton>
    </template>

    <UCard class="w-full overflow-hidden" :ui="{ body: { padding: 'p-4 sm:p-5' } }">
      <!-- Loading skeleton -->
      <div v-if="isLoading" class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Skeleton v-for="n in 3" :key="n" variant="custom" class="h-16 rounded-lg" />
        </div>
        <Skeleton variant="custom" class="h-14 rounded-lg" />
        <div class="flex flex-col gap-3 pt-1">
          <Skeleton v-for="n in 4" :key="n" variant="line" class="h-3" />
        </div>
      </div>

      <!-- Error -->
      <div
        v-else-if="hasError"
        class="flex flex-col items-center justify-center gap-4 rounded-lg bg-red-50/60 p-8 dark:bg-red-950/30"
      >
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
          <IconAlertCircle class="h-7 w-7 text-red-500" aria-hidden="true" />
        </div>
        <p class="text-center text-sm text-sand-600 dark:text-sand-400">{{ errorMessage }}</p>
        <UButton @click="fetchWakaTimeStats" variant="soft" color="red" icon="i-tabler-refresh">
          Try again
        </UButton>
      </div>

      <!-- Stats -->
      <div v-else-if="stats" class="flex flex-col gap-6">
        <!-- Stat tiles -->
        <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div
            v-for="tile in [
              { icon: IconClock, label: 'Last 30 days', value: stats.data.human_readable_total || '0h 0m' },
              { icon: IconCalendarTime, label: 'Daily average', value: stats.data.human_readable_daily_average || '0h 0m' },
              { icon: IconBrandGithub, label: 'Active days', value: String(stats.data.days_including_holidays ?? 0), suffix: '/30' },
            ]"
            :key="tile.label"
            class="flex items-center gap-3 rounded-lg border border-sand-100 bg-sand-50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft dark:border-sand-800 dark:bg-sand-800/40 sm:p-4"
          >
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              <component :is="tile.icon" class="h-5 w-5" aria-hidden="true" />
            </div>
            <div class="min-w-0">
              <h3 class="text-xs text-sand-500 dark:text-sand-400">{{ tile.label }}</h3>
              <p class="tnum font-mono text-sm font-semibold text-sand-900 dark:text-sand-100">
                {{ tile.value }}<span v-if="tile.suffix" class="text-xs text-sand-400">{{ tile.suffix }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Best day -->
        <div class="flex items-center gap-3 rounded-lg border border-sand-100 bg-sand-50 p-4 transition-colors duration-300 hover:bg-sand-100 dark:border-sand-800 dark:bg-sand-800/40 dark:hover:bg-sand-800/60">
          <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
            <IconTrendingUp class="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-sand-600 dark:text-sand-300">Most productive day</h3>
            <div class="flex flex-wrap items-center gap-2">
              <p class="tnum font-mono text-base font-semibold text-sand-900 dark:text-sand-100">{{ formattedBestDay }}</p>
              <span
                v-if="stats.data.best_day?.text"
                class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
              >
                {{ stats.data.best_day.text }}
              </span>
            </div>
          </div>
        </div>

        <!-- Languages -->
        <div>
          <div class="mb-4 flex border-b border-sand-200 dark:border-sand-800">
            <h3 class="flex items-center border-b-2 border-emerald-500 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-400 dark:text-emerald-300">
              <IconCode class="mr-1 h-4 w-4" aria-hidden="true" />
              Languages
            </h3>
          </div>
          <div class="flex flex-col gap-3">
            <div
              v-for="language in (stats.data.languages || []).slice(0, 5)"
              :key="language.name"
              class="flex flex-col gap-1.5"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="h-3 w-3 rounded-full" :class="getLanguageColor(language.name)" aria-hidden="true" />
                  <span class="text-sm font-medium text-sand-800 dark:text-sand-200">{{ language.name }}</span>
                </div>
                <span class="tnum whitespace-nowrap font-mono text-sm text-sand-700 dark:text-sand-300">
                  {{ language.text || formatTime(language.total_seconds) }}
                  <span class="text-xs text-sand-400">({{ (language.percent ?? 0).toFixed(1) }}%)</span>
                </span>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full bg-sand-200/70 dark:bg-sand-800">
                <div
                  class="h-full rounded-full transition-all duration-500 ease-out"
                  :class="getLanguageColor(language.name)"
                  :style="`width: ${language.percent || 0}%`"
                  role="progressbar"
                  :aria-valuenow="Math.round(language.percent || 0)"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-label="`${language.name} ${(language.percent ?? 0).toFixed(1)}%`"
                />
              </div>
            </div>
            <div
              v-if="!stats.data.languages || stats.data.languages.length === 0"
              class="py-6 text-center text-sm text-sand-500"
            >
              No language data available.
            </div>
          </div>
        </div>

        <div class="mt-1 border-t border-sand-100 pt-3 text-center text-xs text-sand-400 dark:border-sand-800 dark:text-sand-500">
          Data from WakaTime · Last updated:
          <time class="tnum">{{ new Date().toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) }}</time>
        </div>
      </div>
    </UCard>
  </Section>
</template>
