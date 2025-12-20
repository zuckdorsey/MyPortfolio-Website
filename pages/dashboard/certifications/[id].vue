<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const route = useRoute();
const router = useRouter();
const isEditing = computed(() => route.params.id !== 'new');

const form = ref({ title: "", website: "", date: "", icon: "", badge_alt: "", description: "", skills: "" });
const isLoading = ref(false);
const isFetching = ref(false);

onMounted(async () => {
  auth.initAuth();
  if (isEditing.value) {
    isFetching.value = true;
    try { form.value = await $fetch(`/api/certifications/${route.params.id}`); } catch (err) { console.error(err); }
    finally { isFetching.value = false; }
  }
});

const save = async () => {
  isLoading.value = true;
  try {
    await $fetch(isEditing.value ? `/api/certifications/${route.params.id}` : "/api/certifications", { method: isEditing.value ? "PUT" : "POST", body: form.value });
    router.push("/dashboard/certifications");
  } catch (err) { console.error(err); }
  finally { isLoading.value = false; }
};
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-transparent border border-white/10 p-6">
      <div class="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl"></div>
      <div class="relative">
        <NuxtLink to="/dashboard/certifications" class="text-sm text-slate-400 hover:text-white mb-3 inline-flex items-center gap-1.5 transition-colors">
          <i class="i-tabler-arrow-left w-4 h-4"></i> 
          Back to Certifications
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">{{ isEditing ? 'Edit' : 'New' }} Certification</h1>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isFetching" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="save" class="space-y-6">
      <!-- Basic Info Card -->
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 space-y-5">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <i class="i-tabler-certificate w-5 h-5 text-pink-400"></i>
          Certification Details
        </h2>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Title *</label>
          <input v-model="form.title" required class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all placeholder-slate-600" placeholder="e.g. AWS Solutions Architect" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">Website/URL</label>
            <input v-model="form.website" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all placeholder-slate-600" placeholder="https://..." />
          </div>
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">Date</label>
            <input v-model="form.date" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all placeholder-slate-600" placeholder="Dec 2024" />
          </div>
        </div>
      </div>

      <!-- Icon Card -->
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 space-y-5">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <i class="i-tabler-badge w-5 h-5 text-rose-400"></i>
          Badge & Icon
        </h2>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Icon</label>
          <div class="flex gap-3">
            <input v-model="form.icon" placeholder="logos:aws" class="flex-1 px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all placeholder-slate-600" />
            <div v-if="form.icon" class="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl shrink-0">
              <Icon :name="form.icon" class="w-7 h-7" />
            </div>
          </div>
          <p class="text-xs text-slate-500">Use Iconify format, e.g. logos:google-cloud</p>
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Badge Alt Text</label>
          <input v-model="form.badge_alt" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all placeholder-slate-600" placeholder="AWS Certified" />
        </div>
      </div>

      <!-- Details Card -->
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 space-y-5">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <i class="i-tabler-file-text w-5 h-5 text-purple-400"></i>
          Additional Details
        </h2>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Description</label>
          <textarea v-model="form.description" rows="3" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all placeholder-slate-600 resize-none" placeholder="Brief description of the certification"></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Skills</label>
          <textarea v-model="form.skills" rows="3" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all placeholder-slate-600 resize-none" placeholder="Related skills or topics covered"></textarea>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-2">
        <NuxtLink to="/dashboard/certifications" class="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Cancel
        </NuxtLink>
        <button type="submit" :disabled="isLoading" class="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 transition-all shadow-lg shadow-pink-500/20">
          <span v-if="isLoading" class="flex items-center gap-2">
            <i class="i-tabler-loader-2 w-4 h-4 animate-spin"></i>
            Saving...
          </span>
          <span v-else>Save Certification</span>
        </button>
      </div>
    </form>
  </div>
</template>
