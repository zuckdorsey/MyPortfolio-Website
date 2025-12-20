<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const route = useRoute();
const router = useRouter();
const isEditing = computed(() => route.params.id !== 'new');

const form = ref({ company: "", company_url: "", position: "", start_date: "", end_date: "", type: "", technologies: [] as string[], content_en: "", content_id: "" });
const techInput = ref("");
const isLoading = ref(false);
const isFetching = ref(false);

onMounted(async () => {
  auth.initAuth();
  if (isEditing.value) {
    isFetching.value = true;
    try {
      const e = await $fetch(`/api/experiences/${route.params.id}`);
      form.value = { ...e };
      const techs = typeof form.value.technologies === 'string' ? JSON.parse(form.value.technologies) : form.value.technologies;
      techInput.value = Array.isArray(techs) ? techs.join(", ") : "";
    } catch (err) { console.error(err); }
    finally { isFetching.value = false; }
  }
});

const save = async () => {
  isLoading.value = true;
  form.value.technologies = techInput.value.split(",").map(t => t.trim()).filter(t => t);
  try {
    await $fetch(isEditing.value ? `/api/experiences/${route.params.id}` : "/api/experiences", { method: isEditing.value ? "PUT" : "POST", body: form.value });
    router.push("/dashboard/experiences");
  } catch (err) { console.error(err); }
  finally { isLoading.value = false; }
};
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-8">
      <NuxtLink to="/dashboard/experiences" class="text-sm text-slate-500 hover:text-white mb-4 inline-flex items-center gap-1 transition-colors"><i class="i-tabler-arrow-left w-4 h-4"></i> Back to Experiences</NuxtLink>
      <h1 class="text-2xl font-bold text-white tracking-tight">{{ isEditing ? 'Edit' : 'New' }} Experience</h1>
    </div>

    <div v-if="isFetching" class="flex justify-center py-12"><div class="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div></div>

    <form v-else @submit.prevent="save" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Company</label>
          <input v-model="form.company" required class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Company URL</label>
          <input v-model="form.company_url" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" />
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-slate-300">Position</label>
        <input v-model="form.position" required class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Start Date</label>
          <input v-model="form.start_date" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">End Date</label>
          <input v-model="form.end_date" placeholder="Present" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Type</label>
          <select v-model="form.type" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all">
            <option value="">Select...</option>
            <option>full-time</option>
            <option>part-time</option>
            <option>contract</option>
            <option>internship</option>
            <option>freelance</option>
          </select>
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-slate-300">Technologies</label>
        <input v-model="techInput" placeholder="React, Node.js" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" />
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
        <NuxtLink to="/dashboard/experiences" class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">Cancel</NuxtLink>
        <button type="submit" :disabled="isLoading" class="px-6 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors">
          {{ isLoading ? 'Saving...' : 'Save Experience' }}
        </button>
      </div>
    </form>
  </div>
</template>
