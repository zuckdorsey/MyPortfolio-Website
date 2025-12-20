<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const route = useRoute();
const router = useRouter();
const isEditing = computed(() => route.params.id !== 'new');

const form = ref({ name: "", link: "", repo_link: "", date: "", image: "", image_ext: "png", technos: [] as string[], type: [] as string[], content_en: "", content_id: "" });
const technosInput = ref("");
const typeInput = ref("");
const isLoading = ref(false);
const isFetching = ref(false);

onMounted(async () => {
  auth.initAuth();
  if (isEditing.value) {
    isFetching.value = true;
    try {
      const p = await $fetch(`/api/projects/${route.params.id}`);
      form.value = { ...p };
      const technos = typeof form.value.technos === 'string' ? JSON.parse(form.value.technos) : form.value.technos;
      const type = typeof form.value.type === 'string' ? JSON.parse(form.value.type) : form.value.type;
      technosInput.value = Array.isArray(technos) ? technos.join(", ") : "";
      typeInput.value = Array.isArray(type) ? type.join(", ") : "";
    } catch (err) { console.error(err); }
    finally { isFetching.value = false; }
  }
});

const save = async () => {
  isLoading.value = true;
  form.value.technos = technosInput.value.split(",").map(t => t.trim()).filter(t => t);
  form.value.type = typeInput.value.split(",").map(t => t.trim()).filter(t => t);
  try {
    await $fetch(isEditing.value ? `/api/projects/${route.params.id}` : "/api/projects", { method: isEditing.value ? "PUT" : "POST", body: form.value });
    router.push("/dashboard/projects");
  } catch (err) { console.error(err); }
  finally { isLoading.value = false; }
};
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent border border-white/10 p-6">
      <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div class="relative">
        <NuxtLink to="/dashboard/projects" class="text-sm text-slate-400 hover:text-white mb-3 inline-flex items-center gap-1.5 transition-colors">
          <i class="i-tabler-arrow-left w-4 h-4"></i> 
          Back to Projects
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">{{ isEditing ? 'Edit' : 'New' }} Project</h1>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isFetching" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="save" class="space-y-6">
      <!-- Basic Info Card -->
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 space-y-5">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <i class="i-tabler-info-circle w-5 h-5 text-purple-400"></i>
          Basic Information
        </h2>
        
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Project Name *</label>
          <input v-model="form.name" required class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-slate-600" placeholder="e.g. Portfolio Website" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">Live Link</label>
            <input v-model="form.link" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-slate-600" placeholder="https://..." />
          </div>
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">Repository Link</label>
            <input v-model="form.repo_link" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-slate-600" placeholder="https://github.com/..." />
          </div>
        </div>
      </div>

      <!-- Media Card -->
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 space-y-5">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <i class="i-tabler-photo w-5 h-5 text-blue-400"></i>
          Media & Metadata
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">Date</label>
            <input v-model="form.date" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-slate-600" placeholder="2024" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">Image Name</label>
            <input v-model="form.image" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-slate-600" placeholder="project-thumb" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">Extension</label>
            <select v-model="form.image_ext" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all">
              <option>png</option>
              <option>jpg</option>
              <option>webp</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tags Card -->
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 space-y-5">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <i class="i-tabler-tags w-5 h-5 text-teal-400"></i>
          Tags & Technologies
        </h2>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Technologies</label>
          <input v-model="technosInput" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-slate-600" placeholder="Vue, Nuxt, Tailwind (comma separated)" />
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Type</label>
          <input v-model="typeInput" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-slate-600" placeholder="web, featured (comma separated)" />
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
          <textarea v-model="form.content_en" rows="4" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-slate-600 resize-none"></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Indonesian</label>
          <textarea v-model="form.content_id" rows="4" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-slate-600 resize-none"></textarea>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-2">
        <NuxtLink to="/dashboard/projects" class="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Cancel
        </NuxtLink>
        <button type="submit" :disabled="isLoading" class="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 transition-all shadow-lg shadow-purple-500/20">
          <span v-if="isLoading" class="flex items-center gap-2">
            <i class="i-tabler-loader-2 w-4 h-4 animate-spin"></i>
            Saving...
          </span>
          <span v-else>Save Project</span>
        </button>
      </div>
    </form>
  </div>
</template>
