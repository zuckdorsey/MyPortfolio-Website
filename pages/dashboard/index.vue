<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const { user } = auth;

const stats = ref({ projects: 0, skills: 0, experiences: 0, education: 0, certifications: 0 });
const isLoading = ref(true);

onMounted(async () => {
  auth.initAuth();
  try {
    const result = await $fetch("/api/stats");
    stats.value = result;
  } catch (err) {
    console.error("Error fetching stats:", err);
  } finally {
    isLoading.value = false;
  }
});

const quickActions = [
  { label: 'New Project', icon: 'i-tabler-briefcase', to: '/dashboard/projects/new' },
  { label: 'New Skill', icon: 'i-tabler-bulb', to: '/dashboard/skills/new' },
  { label: 'New Experience', icon: 'i-tabler-building-skyscraper', to: '/dashboard/experiences/new' },
];
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-10 border-b border-slate-800 pb-6">
      <h1 class="text-3xl font-bold text-white tracking-tight mb-2">Overview</h1>
      <p class="text-slate-400">Welcome back, {{ user?.name || 'Admin' }}. System status is normal.</p>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      <div v-for="i in 4" :key="i" class="h-40 bg-slate-900 rounded-xl border border-slate-800"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
      
      <!-- Main Stats (Outline Style) -->
      <NuxtLink to="/dashboard/projects" class="group relative p-6 bg-transparent border border-slate-800 rounded-xl hover:border-slate-600 transition-all duration-300">
        <div class="flex flex-col h-full justify-between">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 border border-slate-800 rounded-lg text-slate-400 group-hover:text-white group-hover:border-slate-600 transition-colors">
              <i class="i-tabler-briefcase w-5 h-5"></i>
            </div>
            <i class="i-tabler-arrow-up-right w-5 h-5 text-slate-600 group-hover:text-white transition-colors"></i>
          </div>
          <div>
            <div class="text-4xl font-bold text-white mb-1">{{ stats.projects }}</div>
            <div class="text-sm font-medium text-slate-500 group-hover:text-slate-400">Total Projects</div>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/dashboard/skills" class="group relative p-6 bg-transparent border border-slate-800 rounded-xl hover:border-slate-600 transition-all duration-300">
        <div class="flex flex-col h-full justify-between">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 border border-slate-800 rounded-lg text-slate-400 group-hover:text-white group-hover:border-slate-600 transition-colors">
              <i class="i-tabler-bulb w-5 h-5"></i>
            </div>
            <i class="i-tabler-arrow-up-right w-5 h-5 text-slate-600 group-hover:text-white transition-colors"></i>
          </div>
          <div>
            <div class="text-4xl font-bold text-white mb-1">{{ stats.skills }}</div>
            <div class="text-sm font-medium text-slate-500 group-hover:text-slate-400">Skills Mastered</div>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/dashboard/experiences" class="group relative p-6 bg-transparent border border-slate-800 rounded-xl hover:border-slate-600 transition-all duration-300">
        <div class="flex flex-col h-full justify-between">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 border border-slate-800 rounded-lg text-slate-400 group-hover:text-white group-hover:border-slate-600 transition-colors">
              <i class="i-tabler-building-skyscraper w-5 h-5"></i>
            </div>
            <i class="i-tabler-arrow-up-right w-5 h-5 text-slate-600 group-hover:text-white transition-colors"></i>
          </div>
          <div>
            <div class="text-4xl font-bold text-white mb-1">{{ stats.experiences }}</div>
            <div class="text-sm font-medium text-slate-500 group-hover:text-slate-400">Experiences</div>
          </div>
        </div>
      </NuxtLink>

      <!-- Quick Actions (Outline Style) -->
      <div class="md:row-span-2 bg-transparent border border-slate-800 rounded-xl p-6 flex flex-col">
        <h3 class="text-lg font-semibold text-white mb-6">Quick Actions</h3>
        <div class="space-y-3 flex-1">
          <NuxtLink 
            v-for="action in quickActions" 
            :key="action.to" 
            :to="action.to"
            class="flex items-center gap-3 p-3 rounded-lg border border-slate-800 hover:border-slate-600 hover:bg-slate-900/50 transition-all group"
          >
            <div class="p-2 rounded-md bg-slate-900 border border-slate-800 group-hover:border-slate-700">
              <i :class="[action.icon, 'w-4 h-4 text-slate-400 group-hover:text-white']"></i>
            </div>
            <span class="text-sm font-medium text-slate-400 group-hover:text-white">{{ action.label }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Secondary Stats -->
      <NuxtLink to="/dashboard/education" class="group relative p-6 bg-transparent border border-slate-800 rounded-xl hover:border-slate-600 transition-all duration-300">
        <div class="flex flex-col h-full justify-between">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 border border-slate-800 rounded-lg text-slate-400 group-hover:text-white group-hover:border-slate-600 transition-colors">
              <i class="i-tabler-school w-5 h-5"></i>
            </div>
            <i class="i-tabler-arrow-up-right w-5 h-5 text-slate-600 group-hover:text-white transition-colors"></i>
          </div>
          <div>
            <div class="text-4xl font-bold text-white mb-1">{{ stats.education }}</div>
            <div class="text-sm font-medium text-slate-500 group-hover:text-slate-400">Education</div>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/dashboard/certifications" class="group relative p-6 bg-transparent border border-slate-800 rounded-xl hover:border-slate-600 transition-all duration-300">
        <div class="flex flex-col h-full justify-between">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 border border-slate-800 rounded-lg text-slate-400 group-hover:text-white group-hover:border-slate-600 transition-colors">
              <i class="i-tabler-certificate w-5 h-5"></i>
            </div>
            <i class="i-tabler-arrow-up-right w-5 h-5 text-slate-600 group-hover:text-white transition-colors"></i>
          </div>
          <div>
            <div class="text-4xl font-bold text-white mb-1">{{ stats.certifications }}</div>
            <div class="text-sm font-medium text-slate-500 group-hover:text-slate-400">Certifications</div>
          </div>
        </div>
      </NuxtLink>

      <!-- System Status -->
      <div class="md:col-span-2 bg-transparent border border-slate-800 rounded-xl p-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <h3 class="text-white font-medium">System Operational</h3>
            <p class="text-sm text-slate-500">Database connected via NeonDB</p>
          </div>
        </div>
        <div class="flex gap-2">
           <div class="px-3 py-1 rounded-md border border-slate-800 text-xs font-medium text-slate-400">v1.0.0</div>
        </div>
      </div>

    </div>
  </div>
</template>
