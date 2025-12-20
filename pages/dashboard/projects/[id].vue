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
  <div class="max-w-2xl mx-auto">
    <div class="mb-8">
      <NuxtLink to="/dashboard/projects" class="text-sm text-slate-500 hover:text-white mb-4 inline-flex items-center gap-1 transition-colors"><i class="i-tabler-arrow-left w-4 h-4"></i> Back to Projects</NuxtLink>
      <h1 class="text-2xl font-bold text-white tracking-tight">{{ isEditing ? 'Edit' : 'New' }} Project</h1>
    </div>

    <div v-if="isFetching" class="flex justify-center py-12"><div class="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div></div>

    <form v-else @submit.prevent="save" class="space-y-6">
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-slate-300">Project Name</label>
        <input v-model="form.name" required class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" placeholder="e.g. Portfolio Website" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Live Link</label>
          <input v-model="form.link" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" placeholder="https://..." />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Repository Link</label>
          <input v-model="form.repo_link" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" placeholder="https://github.com/..." />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Date</label>
          <input v-model="form.date" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" placeholder="2024" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Image Name</label>
          <input v-model="form.image" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" placeholder="project-thumb" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Extension</label>
          <select v-model="form.image_ext" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all">
            <option>png</option>
            <option>jpg</option>
            <option>webp</option>
          </select>
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-slate-300">Technologies</label>
        <input v-model="technosInput" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" placeholder="Vue, Nuxt, Tailwind (comma separated)" />
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-slate-300">Type</label>
        <input v-model="typeInput" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" placeholder="web, featured (comma separated)" />
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-slate-300">Description (EN)</label>
        <textarea v-model="form.content_en" rows="4" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600 resize-none"></textarea>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-slate-300">Description (ID)</label>
        <textarea v-model="form.content_id" rows="4" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600 resize-none"></textarea>
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t border-white/5">
        <NuxtLink to="/dashboard/projects" class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">Cancel</NuxtLink>
        <button type="submit" :disabled="isLoading" class="px-6 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors">
          {{ isLoading ? 'Saving...' : 'Save Project' }}
        </button>
      </div>
    </form>
  </div>
</template>
