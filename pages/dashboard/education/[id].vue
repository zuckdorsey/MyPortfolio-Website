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
  <div class="max-w-2xl mx-auto">
    <div class="mb-8">
      <NuxtLink to="/dashboard/education" class="text-sm text-slate-500 hover:text-white mb-4 inline-flex items-center gap-1 transition-colors"><i class="i-tabler-arrow-left w-4 h-4"></i> Back to Education</NuxtLink>
      <h1 class="text-2xl font-bold text-white tracking-tight">{{ isEditing ? 'Edit' : 'New' }} Education</h1>
    </div>

    <div v-if="isFetching" class="flex justify-center py-12"><div class="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div></div>

    <form v-else @submit.prevent="save" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Institution</label>
          <input v-model="form.institution" required class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Website</label>
          <input v-model="form.website" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" />
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-slate-300">Degree</label>
        <input v-model="form.degree" required class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Start Date</label>
          <input v-model="form.start_date" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">End Date</label>
          <input v-model="form.end_date" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Location</label>
          <input v-model="form.location" class="w-full px-4 py-2.5 bg-[#11141C] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder-slate-600" />
        </div>
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
        <NuxtLink to="/dashboard/education" class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">Cancel</NuxtLink>
        <button type="submit" :disabled="isLoading" class="px-6 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors">
          {{ isLoading ? 'Saving...' : 'Save Education' }}
        </button>
      </div>
    </form>
  </div>
</template>
