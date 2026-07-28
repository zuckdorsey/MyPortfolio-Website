<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { getToken } = useAdmin()

const stats = ref<any>(null)
const loading = ref(true)

const sections = [
  { label: 'Projects', icon: 'i-heroicons-folder', to: '/admin/projects', color: 'blue' },
  { label: 'Skills', icon: 'i-heroicons-cog', to: '/admin/skills', color: 'purple' },
  { label: 'Experiences', icon: 'i-heroicons-briefcase', to: '/admin/experiences', color: 'amber' },
  { label: 'Education', icon: 'i-heroicons-academic-cap', to: '/admin/education', color: 'cyan' },
  { label: 'Certifications', icon: 'i-heroicons-star', to: '/admin/certifications', color: 'emerald' },
]

const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
  blue: { bg: 'bg-blue-500/10', icon: 'text-blue-500', text: 'text-blue-600 dark:text-blue-400' },
  purple: { bg: 'bg-purple-500/10', icon: 'text-purple-500', text: 'text-purple-600 dark:text-purple-400' },
  amber: { bg: 'bg-amber-500/10', icon: 'text-amber-500', text: 'text-amber-600 dark:text-amber-400' },
  cyan: { bg: 'bg-cyan-500/10', icon: 'text-cyan-500', text: 'text-cyan-600 dark:text-cyan-400' },
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
}

async function fetchStats() {
  loading.value = true
  try {
    const res = await $fetch<any>('/api/stats')
    stats.value = res
  } catch {
    stats.value = null
  }
  loading.value = false
}

onMounted(fetchStats)

function getStatCount(label: string): number {
  if (!stats.value) return 0
  const key = label.toLowerCase() as keyof typeof stats.value
  return stats.value[key] || 0
}
</script>

<template>
  <div>
    <!-- Page Title -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard</h2>
      <p class="mt-1 text-sm text-neutral-500">Overview of your portfolio data</p>
    </div>

    <!-- Stats Grid -->
    <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="section in sections"
        :key="section.to"
        class="group cursor-pointer rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
        @click="navigateTo(section.to)"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-neutral-500">{{ section.label }}</p>
            <p class="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">
              <span v-if="loading">—</span>
              <span v-else>{{ getStatCount(section.label) }}</span>
            </p>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-lg"
            :class="colorMap[section.color].bg"
          >
            <UIcon :name="section.icon" class="h-6 w-6" :class="colorMap[section.color].icon" />
          </div>
        </div>
        <div class="mt-3 flex items-center text-xs" :class="colorMap[section.color].text">
          <span class="group-hover:underline">Manage →</span>
        </div>
      </div>
    </div>

    <!-- Quick Info -->
    <div class="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
      <h3 class="mb-3 text-lg font-semibold text-neutral-900 dark:text-white">Quick Info</h3>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <p class="text-sm text-neutral-500">Total Records</p>
          <p class="text-xl font-bold text-neutral-900 dark:text-white">
            <span v-if="loading">—</span>
            <span v-else>{{ stats ? Object.values(stats).reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0) : 0 }}</span>
          </p>
        </div>
        <div>
          <p class="text-sm text-neutral-500">Data source</p>
          <p class="text-xl font-bold text-green-500">Static JSON</p>
        </div>
      </div>
    </div>
  </div>
</template>
