<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const route = useRoute();
const router = useRouter();
const isEditing = computed(() => route.params.id !== 'new');

const form = ref({ institution: "", website: "", degree: "", start_date: "", end_date: "", location: "", content_en: "", content_id: "" });
const isLoading = ref(false);
const isFetching = ref(false);

onMounted(async () => {
  auth.initAuth();
  if (isEditing.value) {
    isFetching.value = true;
    try { form.value = await $fetch(`/api/education/${route.params.id}`); } catch (err) { console.error(err); }
    finally { isFetching.value = false; }
  }
});

const save = async () => {
  isLoading.value = true;
  try {
    await $fetch(isEditing.value ? `/api/education/${route.params.id}` : "/api/education", { method: isEditing.value ? "PUT" : "POST", body: form.value });
    router.push("/dashboard/education");
  } catch (err) { console.error(err); }
  finally { isLoading.value = false; }
};
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent border border-white/10 p-6">
      <div class="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl"></div>
      <div class="relative">
        <NuxtLink to="/dashboard/education" class="text-sm text-slate-400 hover:text-white mb-3 inline-flex items-center gap-1.5 transition-colors">
          <i class="i-tabler-arrow-left w-4 h-4"></i> 
          Back to Education
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">{{ isEditing ? 'Edit' : 'New' }} Education</h1>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isFetching" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="save" class="space-y-6">
      <!-- Institution Card -->
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 space-y-5">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <i class="i-tabler-school w-5 h-5 text-violet-400"></i>
          Institution Details
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">Institution *</label>
            <input v-model="form.institution" required class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-slate-600" placeholder="e.g. Harvard University" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">Website</label>
            <input v-model="form.website" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-slate-600" placeholder="https://..." />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Degree *</label>
          <input v-model="form.degree" required class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-slate-600" placeholder="e.g. Bachelor of Science in Computer Science" />
        </div>
      </div>

      <!-- Duration Card -->
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 space-y-5">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <i class="i-tabler-calendar w-5 h-5 text-purple-400"></i>
          Duration & Location
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">Start Date</label>
            <input v-model="form.start_date" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-slate-600" placeholder="Sep 2020" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">End Date</label>
            <input v-model="form.end_date" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-slate-600" placeholder="Jun 2024 (or Present)" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">Location</label>
            <input v-model="form.location" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-slate-600" placeholder="Cambridge, MA" />
          </div>
        </div>
      </div>

      <!-- Description Card -->
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 space-y-5">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <i class="i-tabler-file-text w-5 h-5 text-pink-400"></i>
          Description
        </h2>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">English</label>
          <textarea v-model="form.content_en" rows="4" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-slate-600 resize-none"></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Indonesian</label>
          <textarea v-model="form.content_id" rows="4" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-slate-600 resize-none"></textarea>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-2">
        <NuxtLink to="/dashboard/education" class="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Cancel
        </NuxtLink>
        <button type="submit" :disabled="isLoading" class="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 transition-all shadow-lg shadow-violet-500/20">
          <span v-if="isLoading" class="flex items-center gap-2">
            <i class="i-tabler-loader-2 w-4 h-4 animate-spin"></i>
            Saving...
          </span>
          <span v-else>Save Education</span>
        </button>
      </div>
    </form>
  </div>
</template>
