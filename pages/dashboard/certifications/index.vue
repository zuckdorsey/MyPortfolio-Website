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
  <div class="space-y-6">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-transparent border border-white/10 p-6">
      <div class="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl"></div>
      <div class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Certifications</h1>
          <p class="text-slate-400 text-sm mt-1">Manage your credentials</p>
        </div>
        <NuxtLink 
          to="/dashboard/certifications/new" 
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg shadow-pink-500/20"
        >
          <i class="i-tabler-plus w-4 h-4"></i>
          New Certification
        </NuxtLink>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
    </div>
    
    <!-- Empty -->
    <div v-else-if="!certifications.length" class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-12 text-center">
      <div class="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i class="i-tabler-certificate w-8 h-8 text-pink-400"></i>
      </div>
      <h3 class="text-white font-semibold text-lg mb-2">No certifications found</h3>
      <p class="text-slate-400 text-sm mb-6">Add your certifications and credentials.</p>
      <NuxtLink 
        to="/dashboard/certifications/new"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-medium text-sm rounded-xl hover:bg-white/20 transition-all border border-white/10"
      >
        <i class="i-tabler-plus w-4 h-4"></i>
        Add Certification
      </NuxtLink>
    </div>

    <!-- Certifications Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="c in certifications" 
        :key="c.id" 
        class="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
      >
        <!-- Glow -->
        <div class="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div class="relative">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center border border-white/10">
              <Icon v-if="c.icon" :name="c.icon" class="w-7 h-7 text-white" />
              <i v-else class="i-tabler-certificate w-7 h-7 text-pink-400"></i>
            </div>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <NuxtLink :to="`/dashboard/certifications/${c.id}`" class="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <i class="i-tabler-edit w-4 h-4"></i>
              </NuxtLink>
              <button @click="deleteCert(c.id)" class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <i class="i-tabler-trash w-4 h-4"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <h3 class="text-white font-semibold mb-2">{{ c.title }}</h3>
          <div class="flex items-center gap-2 text-sm text-slate-400">
            <i class="i-tabler-calendar w-4 h-4"></i>
            {{ c.date }}
          </div>
          
          <!-- Link -->
          <a v-if="c.url" :href="c.url" target="_blank" class="mt-4 inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 transition-colors">
            <i class="i-tabler-external-link w-3.5 h-3.5"></i>
            View Certificate
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
