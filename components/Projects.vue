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
  <section class="flex flex-col gap-8" id="projects">
    <!-- Section header -->
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <div class="w-1 h-6 rounded-full bg-primary-500" />
        <a href="#projects" class="group">
          <h2 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            Projects
          </h2>
        </a>
      </div>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 pl-3">
        Things I've built — from side experiments to production work.
      </p>
    </div>

    <!-- Controls row -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <!-- Filter tabs (segmented control style) -->
      <div class="flex flex-wrap gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl w-fit">
        <button
          v-for="type in projectTypes"
          :key="type"
          @click="setFilter(type)"
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200"
          :class="type === currentFilter
            ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'"
        >
          {{ getProjectTypeLabel(type) }}
        </button>
      </div>

      <!-- Tech filter button -->
      <button
        @click="techFilterModalOpen = true"
        class="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border transition-all duration-200 w-fit"
        :class="selectedTechFilters.length > 0
          ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-600'"
      >
        <IconFilter class="w-3.5 h-3.5" />
        Filter by tech
        <span
          v-if="selectedTechFilters.length > 0"
          class="bg-primary-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none"
        >
          {{ selectedTechFilters.length }}
        </span>
      </button>
    </div>

    <!-- Active tech filter chips -->
    <div v-if="selectedTechFilters.length > 0" class="flex flex-wrap gap-2 -mt-4">
      <span
        v-for="tech in selectedTechFilters"
        :key="tech"
        class="inline-flex items-center gap-1 text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 px-2.5 py-1 rounded-full"
      >
        {{ tech }}
        <button
          @click="toggleTechFilter(tech)"
          class="hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
          :aria-label="`Remove ${tech} filter`"
        >
          <IconX class="w-3 h-3" />
        </button>
      </span>
      <button
        @click="clearTechFilters"
        class="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors underline underline-offset-2"
      >
        Clear all
      </button>
    </div>

    <!-- Project grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
      class="flex flex-col items-center justify-center py-16 gap-4 text-center"
    >
      <div class="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        <IconFolderOpen class="w-7 h-7 text-neutral-400 dark:text-neutral-500" />
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-sm font-medium text-neutral-700 dark:text-neutral-300">No projects match these filters</p>
        <p class="text-xs text-neutral-400 dark:text-neutral-500">Try a different category or clear your tech filters.</p>
      </div>
      <button
        @click="clearTechFilters"
        class="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline underline-offset-2 transition-colors"
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
        class="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors duration-200 group"
      >
        <span>Show all {{ projectsList.length }} projects</span>
        <IconArrowDown class="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-200" />
      </button>
      <button
        v-else-if="projectsList.length > defaultNumberOfProjects"
        @click="currentNumberOfProjects = defaultNumberOfProjects"
        class="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors duration-200 group"
      >
        <span>Show less</span>
        <IconArrowUp class="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
      </button>
    </div>

    <!-- Tech filter modal -->
    <UModal v-model="techFilterModalOpen" :ui="{ width: 'sm:max-w-md' }">
      <UCard :ui="{ rounded: 'rounded-2xl', ring: '' }">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <IconFilter class="w-4 h-4 text-neutral-500" />
              <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Filter by tech stack</h3>
            </div>
            <UButton color="gray" variant="ghost" icon="i-tabler-x" @click="techFilterModalOpen = false" />
          </div>
        </template>

        <div class="max-h-[55vh] overflow-y-auto">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tech in availableTechnologies"
              :key="tech"
              @click="toggleTechFilter(tech)"
              class="text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150"
              :class="selectedTechFilters.includes(tech)
                ? 'bg-primary-500 border-primary-500 text-white'
                : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-600'"
            >
              {{ tech }}
            </button>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between items-center">
            <button
              @click="clearTechFilters"
              class="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              :class="{ 'opacity-40 pointer-events-none': selectedTechFilters.length === 0 }"
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
  </section>
</template>
