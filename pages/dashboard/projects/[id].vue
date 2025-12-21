<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const route = useRoute();
const router = useRouter();
const isEditing = computed(() => route.params.id !== 'new');

const form = ref({ name: "", link: "", repo_link: "", date: "", image: "", image_ext: "png", technos: [] as string[], type: [] as string[], content_en: "", content_id: "" });
const typeInput = ref("");
const isLoading = ref(false);
const isFetching = ref(false);
const imagePreview = ref("");
const availableSkills = ref<any[]>([]);

onMounted(async () => {
  auth.initAuth();
  isFetching.value = true;
  try {
    // Fetch available skills
    availableSkills.value = await $fetch("/api/skills");
    
    if (isEditing.value) {
      const p = await $fetch(`/api/projects/${route.params.id}`);
      form.value = { ...p };
      
      // Ensure arrays and support legacy comma-separated technos strings
      if (typeof form.value.technos === 'string') {
        let parsedTechnos: unknown;
        try {
          parsedTechnos = JSON.parse(form.value.technos);
        } catch {
          // Parsing failed, likely a comma-separated string - handle below
          parsedTechnos = null;
        }
        if (Array.isArray(parsedTechnos)) {
          form.value.technos = parsedTechnos as string[];
        } else {
          form.value.technos = form.value.technos
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);
        }
      } else {
        form.value.technos = form.value.technos || [];
      }
      
      form.value.type = typeof form.value.type === 'string' ? JSON.parse(form.value.type) : (form.value.type || []);
      
      const type = form.value.type;
      typeInput.value = Array.isArray(type) ? type.join(", ") : "";
      
      // Set preview if image exists
      if (form.value.image && form.value.image.startsWith('http')) {
        imagePreview.value = form.value.image;
      }
    }
  } catch (err) { console.error(err); }
  finally { isFetching.value = false; }
});

const handleImageSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    // TODO: Replace with toast notification for better UX
    alert('Image size must be less than 5MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target?.result as string;
    imagePreview.value = result;
    form.value.image = result;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext && ['png', 'jpg', 'jpeg', 'webp'].includes(ext)) {
       form.value.image_ext = ext === 'jpeg' ? 'jpg' : ext;
    }
  };
  reader.readAsDataURL(file);
};

const toggleSkill = (skillTitle: string) => {
  if (form.value.technos.includes(skillTitle)) {
    form.value.technos = form.value.technos.filter(t => t !== skillTitle);
  } else {
    form.value.technos.push(skillTitle);
  }
};

const save = async () => {
  isLoading.value = true;
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
           <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-300">Project Image</label>
            <div class="flex items-start gap-4">
               <div v-if="imagePreview" class="relative group w-24 h-24 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                <img :src="imagePreview" alt="Preview" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <!-- TODO: Replace confirm() with proper modal component for better UX -->
                   <button type="button" @click="() => { if (confirm('Remove the current project image?')) { imagePreview = ''; form.image = ''; } }" class="text-white hover:text-red-400 transition-colors"><i class="i-tabler-trash w-5 h-5"></i></button>
                </div>
              </div>
              <div class="flex-1">
                <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-purple-500/50 hover:bg-white/5 transition-all">
                    <div class="flex flex-col items-center justify-center pt-2 pb-3">
                        <i class="i-tabler-cloud-upload w-6 h-6 text-slate-400 mb-1"></i>
                        <p class="text-xs text-slate-400">Click to upload image</p>
                    </div>
                    <input type="file" class="hidden" accept="image/*" aria-label="Upload project image" @change="handleImageSelect" />
                </label>
              </div>
            </div>
            <p class="text-xs text-slate-500 mt-1">Supported formats: PNG, JPG, WEBP</p>
          </div>

          <div class="space-y-4">
             <div class="space-y-1.5">
                <label class="block text-sm font-medium text-slate-300">Date</label>
                <input v-model="form.date" class="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-slate-600" placeholder="2024" />
             </div>
             <input type="hidden" v-model="form.image_ext" />
          </div>
        </div>
      </div>

      <!-- Tags Card -->
      <div class="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 space-y-5">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <i class="i-tabler-tags w-5 h-5 text-teal-400"></i>
          Tags & Technologies
        </h2>

        <div class="space-y-3">
          <label class="block text-sm font-medium text-slate-300">Technologies</label>
          
          <div v-if="availableSkills.length" class="flex flex-wrap gap-2">
            <button 
              type="button"
              v-for="skill in availableSkills"
              :key="skill.id"
              @click="toggleSkill(skill.title)"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
                form.technos.includes(skill.title) 
                  ? 'bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/25' 
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/10'
              ]"
            >
              {{ skill.title }}
            </button>
          </div>
          <p v-else class="text-sm text-slate-500">No skills found. Add skills first.</p>
          
          <div class="text-xs text-slate-500 mt-2">
            Selected: {{ form.technos.join(', ') || 'None' }}
          </div>
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
