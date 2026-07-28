<script setup lang="ts">
import { IconChevronDown } from "@tabler/icons-vue";
import type { TechnoType } from "~/data/types";
import { getTechnoTypeLabel, technoTypes } from "~/data/types";

interface ContentSkill {
  _id?: string;
  _path?: string;
  title: string;
  type: string;
  url: string;
  icon: string;
}

const currentFilter = ref<TechnoType>("language");
const showAll = ref(false);
const MOBILE_VISIBLE = 4;

const { data: allSkills, pending } = await useLazyAsyncData<ContentSkill[]>(
  "skills",
  async () => {
    return await $fetch<ContentSkill[]>("/api/skills");
  }
);

const filteredSkills = computed(() => {
  if (!allSkills.value) return [];
  return allSkills.value.filter((skill) => skill.type === currentFilter.value);
});

// On mobile (CSS hides extras until expanded); on sm+ all show via the `sm:` variant.
const hasExtra = computed(() => filteredSkills.value.length > MOBILE_VISIBLE);

function filterSkills(type: TechnoType) {
  currentFilter.value = type;
  showAll.value = false;
}
</script>

<template>
  <Section
    anchor="technologies"
    kicker="Stack"
    title="Skills"
    subtitle="Languages, frameworks, and tools I work with."
  >
    <!-- Filter tabs -->
    <div
      class="flex w-fit flex-wrap gap-1 rounded-xl bg-sand-100 p-1 dark:bg-sand-800/60"
      role="tablist"
      aria-label="Filter skills by type"
    >
      <button
        v-for="type in technoTypes"
        :key="type"
        @click="filterSkills(type)"
        role="tab"
        :aria-selected="type === currentFilter"
        class="rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200"
        :class="type === currentFilter
          ? 'bg-white text-sand-900 shadow-soft dark:bg-sand-700 dark:text-sand-100'
          : 'text-sand-500 hover:text-sand-700 dark:text-sand-400 dark:hover:text-sand-200'"
      >
        {{ getTechnoTypeLabel(type) }}
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="pending" class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      <Skeleton v-for="n in 8" :key="n" variant="custom" class="h-24 rounded-xl" />
    </div>

    <!-- Grid -->
    <div
      v-else-if="filteredSkills.length > 0"
      class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
    >
      <a
        v-for="(skill, i) in filteredSkills"
        :key="skill.title"
        :href="skill.url"
        target="_blank"
        rel="noopener noreferrer"
        :title="skill.title"
        class="group flex flex-col items-center gap-2 rounded-xl border border-sand-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-sand-300 hover:shadow-soft dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700"
        :class="[
          !showAll && i >= MOBILE_VISIBLE ? 'hidden sm:flex' : 'flex',
        ]"
      >
        <div class="flex h-10 items-center justify-center">
          <UIcon
            :name="skill.icon"
            class="text-3xl transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <p class="text-center text-xs font-medium text-sand-700 dark:text-sand-300">
          {{ skill.title }}
        </p>
      </a>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="py-8 text-center text-sm text-sand-500 dark:text-sand-400"
    >
      No skills found for this category.
    </div>

    <!-- Show more (mobile only) -->
    <div v-if="hasExtra && !showAll" class="sm:hidden">
      <button
        @click="showAll = true"
        class="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-emerald-600 transition-colors duration-200 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
      >
        <span>Show all {{ filteredSkills.length }}</span>
        <IconChevronDown class="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  </Section>
</template>
