<script setup lang="ts">
import { IconArrowDown, IconArrowUp, IconFilter, IconLayoutGrid, IconX, IconFolderOpen } from "@tabler/icons-vue";
import type { ProjectType } from "~/data/types";
import { getProjectTypeLabel, projectTypes } from "~/data/types";

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
  content?: {
    en?: string;
    id?: string;
    fr?: string;
    [key: string]: string | undefined;
  };
}

const currentFilter = ref<ProjectType>("featured");
const defaultNumberOfProjects = 6;
const currentNumberOfProjects = ref(0);
const techFilterModalOpen = ref(false);
const selectedTechFilters = ref<string[]>([]);

const { data: allProjects } = await useAsyncData<ContentProject[]>(
  "projects",
  async () => {
    const items = await $fetch<any[]>("/api/projects");
    return items.map(project => ({
      ...project,
      content: {
        en: project.content_en || '',
        id: project.content_id || ''
      }
    })) as ContentProject[];
  }
);

const availableTechnologies = computed(() => {
  if (!allProjects.value) return [];
  const techSet = new Set<string>();
  allProjects.value.forEach((project) => {
    if (project.technos && Array.isArray(project.technos)) {
      project.technos.forEach((tech) => techSet.add(tech));
    }
  });
  return Array.from(techSet).sort();
});

const projectsList = computed(() => {
  if (!allProjects.value) return [];
  return allProjects.value.filter((project) => {
    const typeMatch =
      project.type &&
      Array.isArray(project.type) &&
      project.type.includes(currentFilter.value);
    if (selectedTechFilters.value.length === 0) {
      return typeMatch;
    }
    const techMatch =
      project.technos &&
      Array.isArray(project.technos) &&
      selectedTechFilters.value.every((tech) => project.technos.includes(tech));
    return typeMatch && techMatch;
  });
});

function toggleTechFilter(tech: string) {
  if (selectedTechFilters.value.includes(tech)) {
    selectedTechFilters.value = selectedTechFilters.value.filter((t) => t !== tech);
  } else {
    selectedTechFilters.value.push(tech);
  }
}

function clearTechFilters() {
  selectedTechFilters.value = [];
}

function setFilter(type: ProjectType) {
  currentFilter.value = type;
  currentNumberOfProjects.value = Math.min(projectsList.value.length, defaultNumberOfProjects);
}

watchEffect(() => {
  currentNumberOfProjects.value =
    projectsList.value.length > defaultNumberOfProjects
      ? defaultNumberOfProjects
      : projectsList.value.length;
});
</script>

<template>
  <Section
    anchor="projects"
    kicker="Work"
    title="Projects"
    subtitle="Things I've built — from side experiments to production work."
  >
    <!-- Controls row -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <!-- Filter tabs (segmented control style) -->
      <div
        class="flex w-fit flex-wrap gap-1 rounded-xl bg-sand-100 p-1 dark:bg-sand-800/60"
        role="tablist"
        aria-label="Filter projects by type"
      >
        <button
          v-for="type in projectTypes"
          :key="type"
          @click="setFilter(type)"
          role="tab"
          :aria-selected="type === currentFilter"
          class="rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200"
          :class="type === currentFilter
            ? 'bg-white text-sand-900 shadow-soft dark:bg-sand-700 dark:text-sand-100'
            : 'text-sand-500 hover:text-sand-700 dark:text-sand-400 dark:hover:text-sand-200'"
        >
          {{ getProjectTypeLabel(type) }}
        </button>
      </div>

      <!-- Tech filter button -->
      <button
        @click="techFilterModalOpen = true"
        class="inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200"
        :class="selectedTechFilters.length > 0
          ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
          : 'border-sand-200 text-sand-600 hover:border-sand-300 dark:border-sand-700 dark:text-sand-400 dark:hover:border-sand-600'"
      >
        <IconFilter class="h-3.5 w-3.5" aria-hidden="true" />
        Filter by tech
        <span
          v-if="selectedTechFilters.length > 0"
          class="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-xs leading-none text-white dark:bg-emerald-500"
        >
          {{ selectedTechFilters.length }}
        </span>
      </button>
    </div>

    <!-- Active tech filter chips -->
    <div v-if="selectedTechFilters.length > 0" class="-mt-4 flex flex-wrap gap-2">
      <span
        v-for="tech in selectedTechFilters"
        :key="tech"
        class="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
      >
        {{ tech }}
        <button
          @click="toggleTechFilter(tech)"
          class="transition-colors hover:text-emerald-900 dark:hover:text-emerald-100"
          :aria-label="`Remove ${tech} filter`"
        >
          <IconX class="h-3 w-3" aria-hidden="true" />
        </button>
      </span>
      <button
        @click="clearTechFilters"
        class="text-xs text-sand-400 underline underline-offset-2 transition-colors hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300"
      >
        Clear all
      </button>
    </div>

    <!-- Project grid -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Project
        v-for="(project, index) in projectsList.slice(0, currentNumberOfProjects)"
        :key="project._id || index"
        :project="project"
        :index="index"
      />
    </div>

    <!-- Empty state -->
    <div
      v-if="projectsList.length === 0"
      class="flex flex-col items-center justify-center gap-4 py-16 text-center"
    >
      <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-sand-100 dark:bg-sand-800">
        <IconFolderOpen class="h-7 w-7 text-sand-400 dark:text-sand-500" aria-hidden="true" />
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-sm font-medium text-sand-700 dark:text-sand-300">No projects match these filters</p>
        <p class="text-xs text-sand-400 dark:text-sand-500">Try a different category or clear your tech filters.</p>
      </div>
      <button
        @click="clearTechFilters"
        class="text-xs font-medium text-emerald-600 underline-offset-2 transition-colors hover:underline dark:text-emerald-400"
      >
        Clear filters
      </button>
    </div>

    <!-- Show more / less -->
    <div
      v-if="projectsList.length > 0"
      class="flex justify-center"
    >
      <button
        v-if="currentNumberOfProjects < projectsList.length"
        @click="currentNumberOfProjects = projectsList.length"
        class="group inline-flex items-center gap-2 text-xs font-medium text-sand-500 transition-colors duration-200 hover:text-sand-800 dark:text-sand-400 dark:hover:text-sand-200"
      >
        <span>Show all {{ projectsList.length }} projects</span>
        <IconArrowDown class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
      </button>
      <button
        v-else-if="projectsList.length > defaultNumberOfProjects"
        @click="currentNumberOfProjects = defaultNumberOfProjects"
        class="group inline-flex items-center gap-2 text-xs font-medium text-sand-500 transition-colors duration-200 hover:text-sand-800 dark:text-sand-400 dark:hover:text-sand-200"
      >
        <span>Show less</span>
        <IconArrowUp class="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" aria-hidden="true" />
      </button>
    </div>

    <!-- Tech filter modal -->
    <UModal v-model="techFilterModalOpen" :ui="{ width: 'sm:max-w-md' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <IconFilter class="h-4 w-4 text-sand-500" aria-hidden="true" />
              <h3 class="font-display text-sm font-semibold text-sand-900 dark:text-sand-100">Filter by tech stack</h3>
            </div>
            <UButton color="gray" variant="ghost" icon="i-tabler-x" aria-label="Close" @click="techFilterModalOpen = false" />
          </div>
        </template>

        <div class="max-h-[55vh] overflow-y-auto">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tech in availableTechnologies"
              :key="tech"
              @click="toggleTechFilter(tech)"
              :aria-pressed="selectedTechFilters.includes(tech)"
              class="rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150"
              :class="selectedTechFilters.includes(tech)
                ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500'
                : 'border-sand-200 text-sand-600 hover:border-sand-300 dark:border-sand-700 dark:text-sand-400 dark:hover:border-sand-600'"
            >
              {{ tech }}
            </button>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-between">
            <button
              @click="clearTechFilters"
              class="text-xs text-sand-500 transition-colors hover:text-sand-700 dark:hover:text-sand-300"
              :class="{ 'pointer-events-none opacity-40': selectedTechFilters.length === 0 }"
            >
              Clear all
            </button>
            <UButton size="sm" @click="techFilterModalOpen = false">
              Apply ({{ projectsList.length }} results)
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </Section>
</template>
