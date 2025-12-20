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
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Projects</h1>
        <p class="text-slate-400 text-sm mt-1">Manage your portfolio projects</p>
      </div>
      <NuxtLink 
        to="/dashboard/projects/new" 
        class="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors"
      >
        <i class="i-tabler-plus w-4 h-4"></i>
        New Project
      </NuxtLink>
    </div>

    <!-- Toolbar -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <i class="i-tabler-search absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search projects..." 
          class="w-full pl-10 pr-4 py-2 bg-[#11141C] border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-[#11141C] border border-white/5 rounded-xl overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center">
        <div class="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
      </div>
      
      <div v-else-if="!filteredProjects.length" class="p-12 text-center">
        <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="i-tabler-briefcase w-6 h-6 text-slate-500"></i>
        </div>
        <h3 class="text-white font-medium mb-1">No projects found</h3>
        <p class="text-slate-500 text-sm">Try adjusting your search or create a new project.</p>
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-white/5 text-xs font-medium text-slate-500 uppercase tracking-wider">
            <th class="px-6 py-4">Project</th>
            <th class="px-6 py-4">Type</th>
            <th class="px-6 py-4">Date</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="p in filteredProjects" :key="p.id" class="group hover:bg-white/[0.02] transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/5">
                  <i class="i-tabler-folder w-4 h-4 text-slate-400"></i>
                </div>
                <div>
                  <div class="font-medium text-white">{{ p.name }}</div>
                  <a v-if="p.link" :href="p.link" target="_blank" class="text-xs text-slate-500 hover:text-primary-400 truncate max-w-[200px] block">{{ p.link }}</a>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1.5">
                <span v-for="t in (typeof p.type === 'string' ? JSON.parse(p.type) : p.type).slice(0, 2)" :key="t" class="px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-slate-300 border border-white/5">
                  {{ t }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-400">{{ p.date }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <NuxtLink :to="`/dashboard/projects/${p.id}`" class="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors">
                  <i class="i-tabler-edit w-4 h-4"></i>
                </NuxtLink>
                <button @click="deleteProject(p.id)" class="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
                  <i class="i-tabler-trash w-4 h-4"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
