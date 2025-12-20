<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const skills = ref([]);
const isLoading = ref(true);
const searchQuery = ref("");

onMounted(async () => {
  auth.initAuth();
  try {
    skills.value = await $fetch("/api/skills");
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const filteredSkills = computed(() => {
  if (!searchQuery.value) return skills.value;
  const query = searchQuery.value.toLowerCase();
  return skills.value.filter((s: any) => 
    s.title.toLowerCase().includes(query) || 
    (s.type && s.type.toLowerCase().includes(query))
  );
});

const deleteSkill = async (id: number) => {
  if (!confirm("Delete this skill?")) return;
  await $fetch(`/api/skills/${id}`, { method: "DELETE" });
  skills.value = skills.value.filter((s: any) => s.id !== id);
};

const getTypeColor = (type: string) => {
  const colors: Record<string, { bg: string, text: string, glow: string }> = {
    language: { bg: 'from-blue-500/20 to-cyan-500/20', text: 'text-blue-400', glow: 'bg-blue-500/20' },
    framework: { bg: 'from-purple-500/20 to-pink-500/20', text: 'text-purple-400', glow: 'bg-purple-500/20' },
    tool: { bg: 'from-amber-500/20 to-orange-500/20', text: 'text-amber-400', glow: 'bg-amber-500/20' },
    database: { bg: 'from-emerald-500/20 to-teal-500/20', text: 'text-emerald-400', glow: 'bg-emerald-500/20' },
  };
  return colors[type] || { bg: 'from-slate-500/20 to-slate-400/20', text: 'text-slate-400', glow: 'bg-slate-500/20' };
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent border border-white/10 p-6">
      <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Skills</h1>
          <p class="text-slate-400 text-sm mt-1">Manage your technical skills</p>
        </div>
        <NuxtLink 
          to="/dashboard/skills/new" 
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-sm rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg shadow-blue-500/20"
        >
          <i class="i-tabler-plus w-4 h-4"></i>
          New Skill
        </NuxtLink>
      </div>
    </div>

    <!-- Search -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1 max-w-md">
        <i class="i-tabler-search absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search skills..." 
          class="w-full pl-11 pr-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>
      <div class="flex items-center gap-2 text-sm text-slate-400">
        <span>{{ filteredSkills.length }} skills</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
    
    <!-- Empty -->
    <div v-else-if="!filteredSkills.length" class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-12 text-center">
      <div class="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i class="i-tabler-bulb w-8 h-8 text-blue-400"></i>
      </div>
      <h3 class="text-white font-semibold text-lg mb-2">No skills found</h3>
      <p class="text-slate-400 text-sm mb-6">Add your first skill to get started.</p>
      <NuxtLink 
        to="/dashboard/skills/new"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-medium text-sm rounded-xl hover:bg-white/20 transition-all border border-white/10"
      >
        <i class="i-tabler-plus w-4 h-4"></i>
        Add Skill
      </NuxtLink>
    </div>

    <!-- Skills Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <div 
        v-for="s in filteredSkills" 
        :key="s.id" 
        class="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
      >
        <!-- Glow -->
        <div :class="['absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity', getTypeColor(s.type).glow]"></div>
        
        <div class="relative">
          <!-- Icon -->
          <div :class="['w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 border border-white/10', getTypeColor(s.type).bg]">
            <Icon v-if="s.icon" :name="s.icon" class="w-6 h-6 text-white" />
            <i v-else class="i-tabler-code w-6 h-6 text-white"></i>
          </div>

          <!-- Content -->
          <h3 class="text-white font-medium text-sm mb-2 truncate">{{ s.title }}</h3>
          <span :class="['inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-white/10 border border-white/5', getTypeColor(s.type).text]">
            {{ s.type || 'Other' }}
          </span>

          <!-- Actions -->
          <div class="absolute top-0 right-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <NuxtLink :to="`/dashboard/skills/${s.id}`" class="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <i class="i-tabler-edit w-3.5 h-3.5"></i>
            </NuxtLink>
            <button @click="deleteSkill(s.id)" class="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
              <i class="i-tabler-trash w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
