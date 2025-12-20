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
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Education</h1>
        <p class="text-slate-400 text-sm mt-1">Manage your academic background</p>
      </div>
      <NuxtLink 
        to="/dashboard/education/new" 
        class="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors"
      >
        <i class="i-tabler-plus w-4 h-4"></i>
        New Education
      </NuxtLink>
    </div>

    <div class="bg-[#11141C] border border-white/5 rounded-xl overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center">
        <div class="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
      </div>
      
      <div v-else-if="!education.length" class="p-12 text-center">
        <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="i-tabler-school w-6 h-6 text-slate-500"></i>
        </div>
        <h3 class="text-white font-medium mb-1">No education entries found</h3>
        <p class="text-slate-500 text-sm">Add your academic background.</p>
      </div>

      <div v-else class="divide-y divide-white/5">
        <div v-for="e in education" :key="e.id" class="group p-6 hover:bg-white/[0.02] transition-colors flex items-start justify-between gap-4">
          <div class="flex gap-4">
            <div class="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
              <i class="i-tabler-school w-5 h-5 text-violet-400"></i>
            </div>
            <div>
              <h3 class="text-white font-medium text-lg">{{ e.degree }}</h3>
              <div class="text-slate-400 text-sm mb-2">{{ e.institution }}</div>
              <div class="flex items-center gap-3 text-xs text-slate-500">
                <span class="flex items-center gap-1"><i class="i-tabler-calendar w-3.5 h-3.5"></i> {{ e.start_date }} - {{ e.end_date || 'Present' }}</span>
                <span v-if="e.location" class="flex items-center gap-1"><i class="i-tabler-map-pin w-3.5 h-3.5"></i> {{ e.location }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <NuxtLink :to="`/dashboard/education/${e.id}`" class="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <i class="i-tabler-edit w-4 h-4"></i>
            </NuxtLink>
            <button @click="deleteEdu(e.id)" class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
              <i class="i-tabler-trash w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
