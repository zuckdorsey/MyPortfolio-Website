<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const experiences = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  auth.initAuth();
  try {
    experiences.value = await $fetch("/api/experiences");
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const deleteExp = async (id: number) => {
  if (!confirm("Delete this experience?")) return;
  await $fetch(`/api/experiences/${id}`, { method: "DELETE" });
  experiences.value = experiences.value.filter((e: any) => e.id !== id);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-white/10 p-6">
      <div class="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl"></div>
      <div class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Experiences</h1>
          <p class="text-slate-400 text-sm mt-1">Manage your work history</p>
        </div>
        <NuxtLink 
          to="/dashboard/experiences/new" 
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium text-sm rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg shadow-teal-500/20"
        >
          <i class="i-tabler-plus w-4 h-4"></i>
          New Experience
        </NuxtLink>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
    </div>
    
    <!-- Empty -->
    <div v-else-if="!experiences.length" class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-12 text-center">
      <div class="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i class="i-tabler-building-skyscraper w-8 h-8 text-teal-400"></i>
      </div>
      <h3 class="text-white font-semibold text-lg mb-2">No experiences found</h3>
      <p class="text-slate-400 text-sm mb-6">Add your first work experience.</p>
      <NuxtLink 
        to="/dashboard/experiences/new"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-medium text-sm rounded-xl hover:bg-white/20 transition-all border border-white/10"
      >
        <i class="i-tabler-plus w-4 h-4"></i>
        Add Experience
      </NuxtLink>
    </div>

    <!-- Timeline List -->
    <div v-else class="relative">
      <!-- Timeline Line -->
      <div class="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/50 via-white/10 to-transparent hidden sm:block"></div>

      <div class="space-y-4">
        <div 
          v-for="e in experiences" 
          :key="e.id" 
          class="group relative sm:pl-14"
        >
          <!-- Timeline Dot -->
          <div class="hidden sm:flex absolute left-0 top-6 w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 items-center justify-center border border-white/10">
            <i class="i-tabler-building w-5 h-5 text-teal-400"></i>
          </div>

          <!-- Card -->
          <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-white font-semibold text-lg">{{ e.position }}</h3>
                  <span v-if="!e.end_date" class="px-2 py-0.5 rounded-md text-xs font-medium bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    Current
                  </span>
                </div>
                <p class="text-slate-300 mb-3">{{ e.company }}</p>
                <div class="flex flex-wrap items-center gap-3 text-sm">
                  <span class="flex items-center gap-1.5 text-slate-400">
                    <i class="i-tabler-calendar w-4 h-4"></i>
                    {{ e.start_date }} - {{ e.end_date || 'Present' }}
                  </span>
                  <span v-if="e.type" class="px-2 py-0.5 rounded-md text-xs font-medium bg-white/10 text-slate-300 border border-white/5 capitalize">
                    {{ e.type }}
                  </span>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <NuxtLink :to="`/dashboard/experiences/${e.id}`" class="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <i class="i-tabler-edit w-4 h-4"></i>
                </NuxtLink>
                <button @click="deleteExp(e.id)" class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <i class="i-tabler-trash w-4 h-4"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
