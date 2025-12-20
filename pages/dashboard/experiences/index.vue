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
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Experiences</h1>
        <p class="text-slate-400 text-sm mt-1">Manage your work history</p>
      </div>
      <NuxtLink 
        to="/dashboard/experiences/new" 
        class="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors"
      >
        <i class="i-tabler-plus w-4 h-4"></i>
        New Experience
      </NuxtLink>
    </div>

    <div class="bg-[#11141C] border border-white/5 rounded-xl overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center">
        <div class="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
      </div>
      
      <div v-else-if="!experiences.length" class="p-12 text-center">
        <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="i-tabler-building-skyscraper w-6 h-6 text-slate-500"></i>
        </div>
        <h3 class="text-white font-medium mb-1">No experiences found</h3>
        <p class="text-slate-500 text-sm">Add your first work experience.</p>
      </div>

      <div v-else class="divide-y divide-white/5">
        <div v-for="e in experiences" :key="e.id" class="group p-6 hover:bg-white/[0.02] transition-colors flex items-start justify-between gap-4">
          <div class="flex gap-4">
            <div class="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <i class="i-tabler-building w-5 h-5 text-emerald-400"></i>
            </div>
            <div>
              <h3 class="text-white font-medium text-lg">{{ e.position }}</h3>
              <div class="text-slate-400 text-sm mb-2">{{ e.company }}</div>
              <div class="flex items-center gap-3 text-xs text-slate-500">
                <span class="flex items-center gap-1"><i class="i-tabler-calendar w-3.5 h-3.5"></i> {{ e.start_date }} - {{ e.end_date || 'Present' }}</span>
                <span v-if="e.type" class="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400 capitalize">{{ e.type }}</span>
              </div>
            </div>
          </div>
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
</template>
