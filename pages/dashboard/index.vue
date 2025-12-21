<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const { user } = auth;

const stats = ref({ projects: 0, skills: 0, experiences: 0, education: 0, certifications: 0 });
const recentProjects = ref<any[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  auth.initAuth();
  try {
    // Fetch stats from database
    const statsResult = await $fetch("/api/stats");
    stats.value = statsResult as typeof stats.value;
    
    // Fetch recent projects from database
    const projectsResult = await $fetch("/api/projects");
    recentProjects.value = (projectsResult as any[]).slice(0, 5); // Show last 5 projects
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
    isLoading.value = false;
  }
});

const categories = computed(() => [
  { label: 'Projects', count: stats.value.projects, icon: 'i-tabler-briefcase', to: '/dashboard/projects', color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Skills', count: stats.value.skills, icon: 'i-tabler-bulb', to: '/dashboard/skills', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Experiences', count: stats.value.experiences, icon: 'i-tabler-building-skyscraper', to: '/dashboard/experiences', color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Education', count: stats.value.education, icon: 'i-tabler-school', to: '/dashboard/education', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Certifications', count: stats.value.certifications, icon: 'i-tabler-certificate', to: '/dashboard/certifications', color: 'text-pink-600', bg: 'bg-pink-50' },
]);

const getProjectTypes = (p: any) => {
  if (!p.type) return [];
  return Array.isArray(p.type) ? p.type : (typeof p.type === 'string' ? JSON.parse(p.type) : []);
}
</script>

<template>
  <div class="space-y-10">
    
    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
    </div>

    <template v-else>
      <!-- Overview Stats -->
      <section>
          <h2 class="text-lg font-bold text-slate-800 mb-4">Overview</h2>
          <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <NuxtLink 
                  v-for="cat in categories" 
                  :key="cat.label"
                  :to="cat.to"
                  class="group flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-purple-100"
              >
                  <div :class="['w-12 h-12 rounded-xl flex items-center justify-center transition-colors', cat.bg, cat.color]">
                      <i :class="[cat.icon, 'w-6 h-6']"></i>
                  </div>
                  <div>
                       <p class="text-2xl font-bold text-slate-800">{{ cat.count }}</p>
                      <p class="text-sm font-medium text-slate-500 group-hover:text-purple-600 transition-colors">{{ cat.label }}</p>
                  </div>
              </NuxtLink>
          </div>
      </section>

      <!-- Recent Projects (from Database) -->
      <section>
           <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-slate-800">Recent Projects</h2>
              <NuxtLink to="/dashboard/projects/new" class="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 flex items-center gap-2">
                  <i class="i-tabler-plus w-4 h-4"></i> New Project
              </NuxtLink>
          </div>

          <div v-if="recentProjects.length === 0" class="bg-white p-8 rounded-2xl border border-gray-100 text-center">
              <div class="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i class="i-tabler-folder w-8 h-8 text-purple-400"></i>
              </div>
              <h3 class="font-bold text-slate-800 mb-1">No projects yet</h3>
              <p class="text-sm text-slate-500 mb-4">Create your first project to get started.</p>
              <NuxtLink to="/dashboard/projects/new" class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-all">
                  <i class="i-tabler-plus w-4 h-4"></i> Add Project
              </NuxtLink>
          </div>

          <div v-else class="space-y-3">
               <NuxtLink 
                   v-for="project in recentProjects" 
                   :key="project.id" 
                   :to="`/dashboard/projects/${project.id}`"
                   class="group bg-white p-4 rounded-2xl border border-gray-100 hover:shadow-md hover:border-purple-100 transition-all flex flex-col sm:flex-row sm:items-center gap-4"
               >
                   <!-- Icon/Image -->
                   <div class="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img v-if="project.image" :src="project.image" class="w-full h-full object-cover" alt="Project">
                        <i v-else class="i-tabler-folder w-5 h-5 text-purple-600"></i>
                   </div>

                   <!-- Main Info -->
                   <div class="flex-1 min-w-0">
                       <h3 class="text-slate-800 font-bold text-sm truncate mb-1">{{ project.name }}</h3>
                       <div class="flex flex-wrap gap-2">
                          <span 
                              v-for="type in getProjectTypes(project).slice(0, 2)" 
                              :key="type" 
                              class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-slate-500"
                          >
                              {{ type }}
                          </span>
                      </div>
                   </div>

                   <!-- Date -->
                    <div class="hidden sm:block text-xs font-medium text-slate-400">
                      {{ project.date || 'N/A' }}
                   </div>

                   <!-- Arrow -->
                   <i class="i-tabler-chevron-right w-5 h-5 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all"></i>
               </NuxtLink>

               <NuxtLink 
                   to="/dashboard/projects" 
                   class="block text-center py-3 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors"
               >
                   View all projects →
               </NuxtLink>
          </div>
      </section>

      <!-- Quick Actions -->
      <section>
          <h2 class="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <NuxtLink 
                  to="/dashboard/projects/new" 
                  class="group bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md hover:border-purple-100 transition-all text-center"
              >
                  <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-100 transition-colors">
                      <i class="i-tabler-folder-plus w-6 h-6 text-purple-600"></i>
                  </div>
                  <p class="font-bold text-slate-800 text-sm">New Project</p>
              </NuxtLink>
              <NuxtLink 
                  to="/dashboard/skills/new" 
                  class="group bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all text-center"
              >
                  <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                      <i class="i-tabler-bulb w-6 h-6 text-blue-600"></i>
                  </div>
                  <p class="font-bold text-slate-800 text-sm">New Skill</p>
              </NuxtLink>
              <NuxtLink 
                  to="/dashboard/experiences/new" 
                  class="group bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md hover:border-teal-100 transition-all text-center"
              >
                  <div class="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-100 transition-colors">
                      <i class="i-tabler-building w-6 h-6 text-teal-600"></i>
                  </div>
                  <p class="font-bold text-slate-800 text-sm">New Experience</p>
              </NuxtLink>
              <NuxtLink 
                  to="/dashboard/certifications/new" 
                  class="group bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md hover:border-pink-100 transition-all text-center"
              >
                  <div class="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-pink-100 transition-colors">
                      <i class="i-tabler-certificate w-6 h-6 text-pink-600"></i>
                  </div>
                  <p class="font-bold text-slate-800 text-sm">New Certification</p>
              </NuxtLink>
          </div>
      </section>
    </template>
  </div>
</template>
