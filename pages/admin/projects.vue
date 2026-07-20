<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { getToken } = useAdmin()

const items = ref<any[]>([])
const loading = ref(true)
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingItem = ref<any>(null)
const deletingItem = ref<any>(null)
const saving = ref(false)

// Form
const form = ref({
  name: '',
  link: '',
  repo_link: '',
  date: '',
  image: '' as string,
  image_ext: '',
  technos: '',
  type: '',
  content_en: '',
  content_id: ''
})

const imagePreview = ref('')

function getHeaders() {
  return { Authorization: `Bearer ${getToken()}` }
}

async function fetchItems() {
  loading.value = true
  try {
    const res = await $fetch<any[]>('/api/projects')
    items.value = res || []
  } catch {
    items.value = []
  }
  loading.value = false
}

function openCreate() {
  editingItem.value = null
  form.value = { name: '', link: '', repo_link: '', date: '', image: '', image_ext: '', technos: '', type: '', content_en: '', content_id: '' }
  imagePreview.value = ''
  showModal.value = true
}

function openEdit(item: any) {
  editingItem.value = item
  form.value = {
    name: item.name || '',
    link: item.link || '',
    repo_link: item.repo_link || '',
    date: item.date || '',
    image: item.image || '',
    image_ext: item.image_ext || '',
    technos: Array.isArray(item.technos) ? item.technos.join(', ') : '',
    type: Array.isArray(item.type) ? item.type.join(', ') : '',
    content_en: item.content_en || '',
    content_id: item.content_id || ''
  }
  imagePreview.value = item.image || ''
  showModal.value = true
}

function openDelete(item: any) {
  deletingItem.value = item
  showDeleteModal.value = true
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('Image must be less than 5MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    form.value.image = result
    imagePreview.value = result
  }
  reader.readAsDataURL(file)
}

async function save() {
  if (!form.value.name) {
    alert('Name is required')
    return
  }

  saving.value = true
  try {
    const payload: any = {
      ...form.value,
      technos: form.value.technos ? form.value.technos.split(',').map(s => s.trim()).filter(Boolean) : [],
      type: form.value.type ? form.value.type.split(',').map(s => s.trim()).filter(Boolean) : [],
    }

    if (editingItem.value) {
      await $fetch(`/api/projects/${editingItem.value.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: payload
      })
    } else {
      await $fetch('/api/projects', {
        method: 'POST',
        headers: getHeaders(),
        body: payload
      })
    }

    showModal.value = false
    await fetchItems()
  } catch (err: any) {
    alert(err.data?.message || 'Failed to save')
  }
  saving.value = false
}

async function confirmDelete() {
  if (!deletingItem.value) return
  saving.value = true
  try {
    await $fetch(`/api/projects/${deletingItem.value.id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    showDeleteModal.value = false
    deletingItem.value = null
    await fetchItems()
  } catch (err: any) {
    alert(err.data?.message || 'Failed to delete')
  }
  saving.value = false
}

onMounted(fetchItems)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">Projects</h2>
        <p class="mt-1 text-sm text-neutral-500">Manage your portfolio projects</p>
      </div>
      <UButton icon="i-heroicons-plus" color="green" @click="openCreate">Add Project</UButton>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
      <div v-if="loading" class="p-8 text-center text-neutral-500">Loading...</div>
      <div v-else-if="items.length === 0" class="p-8 text-center text-neutral-500">No projects found. Click "Add Project" to create one.</div>
      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">ID</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Name</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Date</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Technos</th>
            <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700">
          <tr v-for="item in items" :key="item.id" class="hover:bg-neutral-50 dark:hover:bg-neutral-700/30">
            <td class="px-4 py-3 text-sm text-neutral-500">#{{ item.id }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img v-if="item.image" :src="item.image" class="h-10 w-10 rounded-lg object-cover" />
                <span class="text-sm font-medium text-neutral-900 dark:text-white">{{ item.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-neutral-500">{{ item.date || '—' }}</td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tech in (Array.isArray(item.technos) ? item.technos : []).slice(0, 3)"
                  :key="tech"
                  class="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600 dark:text-green-400"
                >
                  {{ tech }}
                </span>
                <span v-if="Array.isArray(item.technos) && item.technos.length > 3" class="text-xs text-neutral-400">
                  +{{ item.technos.length - 3 }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-pencil" @click="openEdit(item)" />
                <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="openDelete(item)" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <UModal v-model="showModal">
      <div class="p-6">
        <h3 class="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
          {{ editingItem ? 'Edit Project' : 'New Project' }}
        </h3>
        <div class="space-y-4">
          <UFormGroup label="Name *" required>
            <UInput v-model="form.name" placeholder="Project name" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Link">
              <UInput v-model="form.link" placeholder="https://..." />
            </UFormGroup>
            <UFormGroup label="Repo Link">
              <UInput v-model="form.repo_link" placeholder="https://github.com/..." />
            </UFormGroup>
          </div>

          <UFormGroup label="Date">
            <UInput v-model="form.date" placeholder="2024" />
          </UFormGroup>

          <UFormGroup label="Technologies (comma separated)">
            <UInput v-model="form.technos" placeholder="Vue, Nuxt, Tailwind" />
          </UFormGroup>

          <UFormGroup label="Type (comma separated)">
            <UInput v-model="form.type" placeholder="Web, Mobile" />
          </UFormGroup>

          <UFormGroup label="Image">
            <div class="space-y-2">
              <input type="file" accept="image/*" class="text-sm text-neutral-500 file:mr-4 file:rounded-lg file:border-0 file:bg-green-500/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-green-600 hover:file:bg-green-500/20 dark:file:text-green-400" @change="handleImageUpload" />
              <img v-if="imagePreview" :src="imagePreview" class="h-32 w-32 rounded-lg object-cover" />
              <p v-if="editingItem && form.image && !form.image.startsWith('data:')" class="text-xs text-neutral-400">Current image from Cloudinary (upload new to replace)</p>
            </div>
          </UFormGroup>

          <UFormGroup label="Content (English)">
            <UTextarea v-model="form.content_en" :rows="4" placeholder="Description in English..." />
          </UFormGroup>

          <UFormGroup label="Content (Indonesian)">
            <UTextarea v-model="form.content_id" :rows="4" placeholder="Deskripsi dalam Bahasa Indonesia..." />
          </UFormGroup>

          <div class="flex justify-end gap-3 pt-2">
            <UButton color="gray" @click="showModal = false">Cancel</UButton>
            <UButton color="green" :loading="saving" @click="save">
              {{ editingItem ? 'Update' : 'Create' }}
            </UButton>
          </div>
        </div>
      </div>
    </UModal>

    <!-- Delete Modal -->
    <UModal v-model="showDeleteModal">
      <div class="p-6">
        <h3 class="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">Delete Project</h3>
        <p class="mb-6 text-sm text-neutral-500">Are you sure you want to delete <strong class="text-neutral-900 dark:text-white">{{ deletingItem?.name }}</strong>? This action cannot be undone.</p>
        <div class="flex justify-end gap-3">
          <UButton color="gray" @click="showDeleteModal = false">Cancel</UButton>
          <UButton color="red" :loading="saving" @click="confirmDelete">Delete</UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>
