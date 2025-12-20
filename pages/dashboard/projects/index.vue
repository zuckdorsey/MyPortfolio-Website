<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const projects = ref([]);
const isLoading = ref(true);
const searchQuery = ref("");

onMounted(async () => {
  auth.initAuth();
  try {
    projects.value = await $fetch("/api/projects");
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const filteredProjects = computed(() => {
  if (!searchQuery.value) return projects.value;
  const query = searchQuery.value.toLowerCase();
  return projects.value.filter((p: any) => 
    p.name.toLowerCase().includes(query) || 
    (p.type && p.type.toLowerCase().includes(query))
  );
});

const deleteProject = async (id: number) => {
  if (!confirm("Delete this project?")) return;
  await $fetch(`/api/projects/${id}`, { method: "DELETE" });
  projects.value = projects.value.filter((p: any) => p.id !== id);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Gradient -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent border border-white/10 p-6">
      <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Projects</h1>
          <p class="text-slate-400 text-sm mt-1">Manage your portfolio projects</p>
        </div>
        <NuxtLink 
          to="/dashboard/projects/new" 
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium text-sm rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
        >
          <i class="i-tabler-plus w-4 h-4"></i>
          New Project
        </NuxtLink>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1 max-w-md">
        <i class="i-tabler-search absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search projects..." 
          class="w-full pl-11 pr-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
        />
      </div>
      <div class="flex items-center gap-2 text-sm text-slate-400">
        <span>{{ filteredProjects.length }} projects</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="!filteredProjects.length" class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-12 text-center">
      <div class="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i class="i-tabler-briefcase w-8 h-8 text-purple-400"></i>
      </div>
      <h3 class="text-white font-semibold text-lg mb-2">No projects found</h3>
      <p class="text-slate-400 text-sm mb-6">Get started by creating your first project.</p>
      <NuxtLink 
        to="/dashboard/projects/new"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-medium text-sm rounded-xl hover:bg-white/20 transition-all border border-white/10"
      >
        <i class="i-tabler-plus w-4 h-4"></i>
        Create Project
      </NuxtLink>
    </div>

    <!-- Projects Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div 
        v-for="p in filteredProjects" 
        :key="p.id" 
        class="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
      >
        <!-- Glow Effect -->
        <div class="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div class="relative">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10">
              <i class="i-tabler-folder w-6 h-6 text-purple-400"></i>
            </div>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <NuxtLink :to="`/dashboard/projects/${p.id}`" class="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <i class="i-tabler-edit w-4 h-4"></i>
              </NuxtLink>
              <button @click="deleteProject(p.id)" class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <i class="i-tabler-trash w-4 h-4"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <h3 class="text-white font-semibold mb-2 truncate">{{ p.name }}</h3>
          
          <!-- Tags -->
          <div class="flex flex-wrap gap-1.5 mb-4">
            <span 
              v-for="t in (typeof p.type === 'string' ? JSON.parse(p.type) : p.type).slice(0, 3)" 
              :key="t" 
              class="px-2 py-0.5 rounded-md text-xs font-medium bg-white/10 text-slate-300 border border-white/5"
            >
              {{ t }}
            </span>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-4 border-t border-white/5">
            <span class="text-xs text-slate-500">{{ p.date }}</span>
            <a v-if="p.link" :href="p.link" target="_blank" class="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              <i class="i-tabler-external-link w-3 h-3"></i>
              View
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
