<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const route = useRoute();
const router = useRouter();
const isEditing = computed(() => route.params.id !== 'new');

const form = ref({ title: "", type: "", url: "", icon: "" });
const isLoading = ref(false);
const isFetching = ref(false);

onMounted(async () => {
  auth.initAuth();
  if (isEditing.value) {
    isFetching.value = true;
    try { form.value = await $fetch(`/api/skills/${route.params.id}`); } catch (err) { console.error(err); }
    finally { isFetching.value = false; }
  }
});

const save = async () => {
  isLoading.value = true;
  try {
    await $fetch(isEditing.value ? `/api/skills/${route.params.id}` : "/api/skills", { method: isEditing.value ? "PUT" : "POST", body: form.value });
    router.push("/dashboard/skills");
  } catch (err) { console.error(err); }
  finally { isLoading.value = false; }
};

const skillTypes = ['language', 'framework', 'tool', 'database', 'other'];
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent border border-white/10 p-6">
      <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div class="relative">
        <NuxtLink to="/dashboard/skills" class="text-sm text-slate-400 hover:text-white mb-3 inline-flex items-center gap-1.5 transition-colors">
          <i class="i-tabler-arrow-left w-4 h-4"></i> 
          Back to Skills
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">{{ isEditing ? 'Edit' : 'New' }} Skill</h1>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isFetching" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="save" class="space-y-6">
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 space-y-5">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <i class="i-tabler-bulb w-5 h-5 text-blue-400"></i>
          Skill Details
        </h2>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Title *</label>
          <input v-model="form.title" required class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-600" placeholder="e.g. Python" />
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Type</label>
          <div class="grid grid-cols-5 gap-2">
            <button 
              v-for="t in skillTypes" 
              :key="t"
              type="button"
              @click="form.type = t"
              :class="[
                'px-3 py-2 text-xs font-medium rounded-xl border transition-all capitalize',
                form.type === t 
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
              ]"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">URL</label>
          <input v-model="form.url" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-600" placeholder="https://..." />
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-300">Icon</label>
          <div class="flex gap-3">
            <input v-model="form.icon" placeholder="skill-icons:python" class="flex-1 px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-600" />
            <div v-if="form.icon" class="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl shrink-0">
              <Icon :name="form.icon" class="w-6 h-6" />
            </div>
          </div>
          <p class="text-xs text-slate-500 mt-1">Use Iconify format, e.g. skill-icons:vue-dark</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-2">
        <NuxtLink to="/dashboard/skills" class="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Cancel
        </NuxtLink>
        <button type="submit" :disabled="isLoading" class="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20">
          <span v-if="isLoading" class="flex items-center gap-2">
            <i class="i-tabler-loader-2 w-4 h-4 animate-spin"></i>
            Saving...
          </span>
          <span v-else>Save Skill</span>
        </button>
      </div>
    </form>
  </div>
</template>
