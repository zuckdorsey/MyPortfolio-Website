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

const expTypes = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-white/10 p-6">
      <div class="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl"></div>
      <div class="relative">
        <NuxtLink to="/dashboard/experiences" class="text-sm text-slate-400 hover:text-white mb-3 inline-flex items-center gap-1.5 transition-colors">
          <i class="i-tabler-arrow-left w-4 h-4"></i> 
          Back to Experiences
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">{{ isEditing ? 'Edit' : 'New' }} Experience</h1>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isFetching" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="save" class="space-y-6">
      <!-- Company Card -->
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 space-y-5">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <i class="i-tabler-building w-5 h-5 text-teal-400"></i>
          Company Details
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">Company Name *</label>
            <input v-model="form.company" required class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder-slate-600" placeholder="e.g. Google" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">Company URL</label>
            <input v-model="form.company_url" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder-slate-600" placeholder="https://..." />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Position *</label>
          <input v-model="form.position" required class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder-slate-600" placeholder="e.g. Senior Software Engineer" />
        </div>
      </div>

      <!-- Duration Card -->
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 space-y-5">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <i class="i-tabler-calendar w-5 h-5 text-emerald-400"></i>
          Duration & Type
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">Start Date</label>
            <input v-model="form.start_date" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder-slate-600" placeholder="Jan 2023" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">End Date</label>
            <input v-model="form.end_date" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder-slate-600" placeholder="Present (leave empty for current)" />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Employment Type</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="t in expTypes" 
              :key="t"
              type="button"
              @click="form.type = t"
              :class="[
                'px-4 py-2 text-xs font-medium rounded-xl border transition-all capitalize',
                form.type === t 
                  ? 'bg-teal-500/20 border-teal-500/50 text-teal-400' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
              ]"
            >
              {{ t }}
            </button>
          </div>
        </div>
      </div>

      <!-- Technologies Card -->
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 space-y-5">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <i class="i-tabler-code w-5 h-5 text-blue-400"></i>
          Technologies Used
        </h2>

        <div class="space-y-1.5">
          <input v-model="techInput" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder-slate-600" placeholder="React, Node.js, PostgreSQL (comma separated)" />
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
          <textarea v-model="form.content_en" rows="4" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder-slate-600 resize-none"></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Indonesian</label>
          <textarea v-model="form.content_id" rows="4" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder-slate-600 resize-none"></textarea>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-2">
        <NuxtLink to="/dashboard/experiences" class="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Cancel
        </NuxtLink>
        <button type="submit" :disabled="isLoading" class="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-teal-500/20">
          <span v-if="isLoading" class="flex items-center gap-2">
            <i class="i-tabler-loader-2 w-4 h-4 animate-spin"></i>
            Saving...
          </span>
          <span v-else>Save Experience</span>
        </button>
      </div>
    </form>
  </div>
</template>
