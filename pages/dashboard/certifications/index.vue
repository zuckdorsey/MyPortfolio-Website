<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const certifications = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  auth.initAuth();
  try {
    certifications.value = await $fetch("/api/certifications");
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const deleteCert = async (id: number) => {
  if (!confirm("Delete this certification?")) return;
  await $fetch(`/api/certifications/${id}`, { method: "DELETE" });
  certifications.value = certifications.value.filter((c: any) => c.id !== id);
};
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Certifications</h1>
        <p class="text-slate-400 text-sm mt-1">Manage your credentials</p>
      </div>
      <NuxtLink 
        to="/dashboard/certifications/new" 
        class="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors"
      >
        <i class="i-tabler-plus w-4 h-4"></i>
        New Certification
      </NuxtLink>
    </div>

    <div class="bg-[#11141C] border border-white/5 rounded-xl overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center">
        <div class="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
      </div>
      
      <div v-else-if="!certifications.length" class="p-12 text-center">
        <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="i-tabler-certificate w-6 h-6 text-slate-500"></i>
        </div>
        <h3 class="text-white font-medium mb-1">No certifications found</h3>
        <p class="text-slate-500 text-sm">Add your certifications.</p>
      </div>

      <div v-else class="divide-y divide-white/5">
        <div v-for="c in certifications" :key="c.id" class="group p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
              <Icon v-if="c.icon" :name="c.icon" class="w-6 h-6 text-white" />
              <i v-else class="i-tabler-certificate w-6 h-6 text-rose-400"></i>
            </div>
            <div>
              <h3 class="text-white font-medium text-lg">{{ c.title }}</h3>
              <div class="text-slate-400 text-sm">{{ c.date }}</div>
            </div>
          </div>
          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <NuxtLink :to="`/dashboard/certifications/${c.id}`" class="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <i class="i-tabler-edit w-4 h-4"></i>
            </NuxtLink>
            <button @click="deleteCert(c.id)" class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
              <i class="i-tabler-trash w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
