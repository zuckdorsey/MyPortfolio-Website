<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const education = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  auth.initAuth();
  try {
    education.value = await $fetch("/api/education");
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const deleteEdu = async (id: number) => {
  if (!confirm("Delete this entry?")) return;
  await $fetch(`/api/education/${id}`, { method: "DELETE" });
  education.value = education.value.filter((e: any) => e.id !== id);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent border border-white/10 p-6">
      <div class="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl"></div>
      <div class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Education</h1>
          <p class="text-slate-400 text-sm mt-1">Manage your academic background</p>
        </div>
        <NuxtLink 
          to="/dashboard/education/new" 
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium text-sm rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all shadow-lg shadow-violet-500/20"
        >
          <i class="i-tabler-plus w-4 h-4"></i>
          New Education
        </NuxtLink>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
    </div>
    
    <!-- Empty -->
    <div v-else-if="!education.length" class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-12 text-center">
      <div class="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i class="i-tabler-school w-8 h-8 text-violet-400"></i>
      </div>
      <h3 class="text-white font-semibold text-lg mb-2">No education entries found</h3>
      <p class="text-slate-400 text-sm mb-6">Add your academic background.</p>
      <NuxtLink 
        to="/dashboard/education/new"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-medium text-sm rounded-xl hover:bg-white/20 transition-all border border-white/10"
      >
        <i class="i-tabler-plus w-4 h-4"></i>
        Add Education
      </NuxtLink>
    </div>

    <!-- Education Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div 
        v-for="e in education" 
        :key="e.id" 
        class="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
      >
        <!-- Glow -->
        <div class="absolute top-0 right-0 w-20 h-20 bg-violet-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div class="relative flex gap-4">
          <!-- Icon -->
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shrink-0">
            <i class="i-tabler-school w-6 h-6 text-violet-400"></i>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h3 class="text-white font-semibold text-lg mb-1">{{ e.degree }}</h3>
                <p class="text-slate-300 mb-2">{{ e.institution }}</p>
              </div>
              
              <!-- Actions -->
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <NuxtLink :to="`/dashboard/education/${e.id}`" class="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <i class="i-tabler-edit w-4 h-4"></i>
                </NuxtLink>
                <button @click="deleteEdu(e.id)" class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <i class="i-tabler-trash w-4 h-4"></i>
                </button>
              </div>
            </div>
            
            <div class="flex flex-wrap items-center gap-3 text-sm">
              <span class="flex items-center gap-1.5 text-slate-400">
                <i class="i-tabler-calendar w-4 h-4"></i>
                {{ e.start_date }} - {{ e.end_date || 'Present' }}
              </span>
              <span v-if="e.location" class="flex items-center gap-1.5 text-slate-400">
                <i class="i-tabler-map-pin w-4 h-4"></i>
                {{ e.location }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
