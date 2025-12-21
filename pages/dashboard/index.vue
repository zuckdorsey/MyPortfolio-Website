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

// Animated counters
const animatedStats = ref({ projects: 0, skills: 0, experiences: 0, education: 0, certifications: 0 });
const activeTimers = ref<NodeJS.Timeout[]>([]);

const animateCounter = (key: keyof typeof animatedStats.value, target: number) => {
  const duration = 1000;
  const steps = 30;
  const stepTime = duration / steps;
  const increment = target / steps;
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      animatedStats.value[key] = target;
      clearInterval(timer);
    } else {
      animatedStats.value[key] = Math.floor(current);
    }
  }, stepTime);
  
  activeTimers.value.push(timer);
};

onUnmounted(() => {
  activeTimers.value.forEach(timer => clearInterval(timer));
  activeTimers.value = [];
});

onMounted(async () => {
  auth.initAuth();
  try {
    const result = await $fetch("/api/stats");
    stats.value = result;
    // Animate counters
    Object.keys(stats.value).forEach((key) => {
      animateCounter(key as keyof typeof animatedStats.value, stats.value[key as keyof typeof stats.value]);
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
  } finally {
    isLoading.value = false;
  }
});

const quickActions = [
  { label: 'New Project', icon: 'i-tabler-plus', to: '/dashboard/projects/new', color: 'from-purple-500 to-blue-500' },
  { label: 'New Skill', icon: 'i-tabler-plus', to: '/dashboard/skills/new', color: 'from-blue-500 to-teal-500' },
  { label: 'New Experience', icon: 'i-tabler-plus', to: '/dashboard/experiences/new', color: 'from-teal-500 to-emerald-500' },
];

const recentActivity = [
  { action: 'Dashboard loaded', time: 'Just now', icon: 'i-tabler-check' },
];
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10 border border-white/10 p-6 lg:p-8">
      <div class="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent"></div>
      <div class="relative">
        <h1 class="text-2xl lg:text-3xl font-bold text-white mb-2">
          Welcome back, <span class="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{{ user?.name || 'Admin' }}</span>! 👋
        </h1>
        <p class="text-slate-400">Here's what's happening with your portfolio today.</p>
      </div>
    </div>

    <!-- Bento Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      
      <!-- Stats Cards -->
      <NuxtLink 
        to="/dashboard/projects"
        class="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
      >
        <div class="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-colors"></div>
        <div class="relative">
          <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3">
            <i class="i-tabler-briefcase w-5 h-5 text-purple-400"></i>
          </div>
          <div class="text-3xl font-bold text-white mb-1">{{ animatedStats.projects }}</div>
          <div class="text-sm text-slate-400">Projects</div>
        </div>
      </NuxtLink>

      <NuxtLink 
        to="/dashboard/skills"
        class="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
      >
        <div class="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-colors"></div>
        <div class="relative">
          <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
            <i class="i-tabler-bulb w-5 h-5 text-blue-400"></i>
          </div>
          <div class="text-3xl font-bold text-white mb-1">{{ animatedStats.skills }}</div>
          <div class="text-sm text-slate-400">Skills</div>
        </div>
      </NuxtLink>

      <NuxtLink 
        to="/dashboard/experiences"
        class="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
      >
        <div class="absolute top-0 right-0 w-20 h-20 bg-teal-500/20 rounded-full blur-2xl group-hover:bg-teal-500/30 transition-colors"></div>
        <div class="relative">
          <div class="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center mb-3">
            <i class="i-tabler-building-skyscraper w-5 h-5 text-teal-400"></i>
          </div>
          <div class="text-3xl font-bold text-white mb-1">{{ animatedStats.experiences }}</div>
          <div class="text-sm text-slate-400">Experiences</div>
        </div>
      </NuxtLink>

      <NuxtLink 
        to="/dashboard/certifications"
        class="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
      >
        <div class="absolute top-0 right-0 w-20 h-20 bg-pink-500/20 rounded-full blur-2xl group-hover:bg-pink-500/30 transition-colors"></div>
        <div class="relative">
          <div class="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center mb-3">
            <i class="i-tabler-certificate w-5 h-5 text-pink-400"></i>
          </div>
          <div class="text-3xl font-bold text-white mb-1">{{ animatedStats.certifications }}</div>
          <div class="text-sm text-slate-400">Certifications</div>
        </div>
      </NuxtLink>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Quick Actions - Takes 2 columns -->
      <div class="lg:col-span-2 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white">Quick Actions</h2>
          <span class="text-xs text-slate-500">Add new content</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NuxtLink 
            v-for="action in quickActions" 
            :key="action.to"
            :to="action.to"
            class="group relative overflow-hidden rounded-xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
          >
            <div :class="['absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity', action.color]"></div>
            <div class="relative flex flex-col items-center text-center gap-3">
              <div :class="['w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center', action.color]">
                <i :class="[action.icon, 'w-6 h-6 text-white']"></i>
              </div>
              <span class="text-sm font-medium text-white">{{ action.label }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Activity Feed -->
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white">Activity</h2>
          <span class="relative flex h-2 w-2">
            <span class="animate-[ping_2s_ease-out_3] absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <div class="space-y-4">
          <div v-for="(activity, i) in recentActivity" :key="i" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <i :class="[activity.icon, 'w-4 h-4 text-emerald-400']"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white truncate">{{ activity.action }}</p>
              <p class="text-xs text-slate-500">{{ activity.time }}</p>
            </div>
          </div>
          <div class="pt-2 text-center">
            <p class="text-xs text-slate-500">All systems operational</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Education Stats -->
      <NuxtLink 
        to="/dashboard/education"
        class="group rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <i class="i-tabler-school w-6 h-6 text-amber-400"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-white">{{ animatedStats.education }}</div>
              <div class="text-sm text-slate-400">Education Records</div>
            </div>
          </div>
          <i class="i-tabler-chevron-right w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all"></i>
        </div>
      </NuxtLink>

      <!-- System Status -->
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="relative">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <i class="i-tabler-server w-6 h-6 text-emerald-400"></i>
              </div>
              <span class="absolute -top-1 -right-1 flex h-3 w-3">
                <span class="animate-[ping_2s_ease-out_3] absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div class="text-sm font-medium text-white">System Status</div>
              <div class="text-xs text-emerald-400">All services operational</div>
            </div>
          </div>
          <div class="text-right">
            <div class="px-3 py-1 rounded-full bg-emerald-500/20 text-xs font-medium text-emerald-400">Online</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
