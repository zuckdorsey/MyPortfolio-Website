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
  const colors: Record<string, string> = {
    language: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    framework: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    tool: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    database: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  };
  return colors[type] || 'text-slate-400 bg-slate-400/10 border-slate-400/20';
};
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Skills</h1>
        <p class="text-slate-400 text-sm mt-1">Manage your technical skills</p>
      </div>
      <NuxtLink 
        to="/dashboard/skills/new" 
        class="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors"
      >
        <i class="i-tabler-plus w-4 h-4"></i>
        New Skill
      </NuxtLink>
    </div>

    <!-- Toolbar -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <i class="i-tabler-search absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search skills..." 
          class="w-full pl-10 pr-4 py-2 bg-[#11141C] border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
        />
      </div>
    </div>

    <!-- Grid Layout for Skills (Better than table for small items) -->
    <div v-if="isLoading" class="p-8 text-center">
      <div class="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
    </div>
    
    <div v-else-if="!filteredSkills.length" class="p-12 text-center bg-[#11141C] border border-white/5 rounded-xl">
      <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="i-tabler-bulb w-6 h-6 text-slate-500"></i>
      </div>
      <h3 class="text-white font-medium mb-1">No skills found</h3>
      <p class="text-slate-500 text-sm">Try adjusting your search or create a new skill.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div 
        v-for="s in filteredSkills" 
        :key="s.id" 
        class="group bg-[#11141C] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="p-2 bg-white/5 rounded-lg border border-white/5">
            <Icon v-if="s.icon" :name="s.icon" class="w-5 h-5 text-white" />
            <i v-else class="i-tabler-code w-5 h-5 text-white"></i>
          </div>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <NuxtLink :to="`/dashboard/skills/${s.id}`" class="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors">
              <i class="i-tabler-edit w-3.5 h-3.5"></i>
            </NuxtLink>
            <button @click="deleteSkill(s.id)" class="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
              <i class="i-tabler-trash w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
        <h3 class="text-white font-medium mb-1">{{ s.title }}</h3>
        <span :class="['inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border', getTypeColor(s.type)]">
          {{ s.type || 'Other' }}
        </span>
      </div>
    </div>
  </div>
</template>
