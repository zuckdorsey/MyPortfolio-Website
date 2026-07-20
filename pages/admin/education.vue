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

const form = ref({
  institution: '',
  website: '',
  degree: '',
  start_date: '',
  end_date: '',
  location: '',
  content_en: '',
  content_id: ''
})

function getHeaders() {
  return { Authorization: `Bearer ${getToken()}` }
}

async function fetchItems() {
  loading.value = true
  try {
    const res = await $fetch<any[]>('/api/education')
    items.value = res || []
  } catch {
    items.value = []
  }
  loading.value = false
}

function openCreate() {
  editingItem.value = null
  form.value = { institution: '', website: '', degree: '', start_date: '', end_date: '', location: '', content_en: '', content_id: '' }
  showModal.value = true
}

function openEdit(item: any) {
  editingItem.value = item
  form.value = {
    institution: item.institution || '',
    website: item.website || '',
    degree: item.degree || '',
    start_date: item.start_date || '',
    end_date: item.end_date || '',
    location: item.location || '',
    content_en: item.content_en || '',
    content_id: item.content_id || ''
  }
  showModal.value = true
}

function openDelete(item: any) {
  deletingItem.value = item
  showDeleteModal.value = true
}

async function save() {
  if (!form.value.institution) {
    alert('Institution is required')
    return
  }

  saving.value = true
  try {
    if (editingItem.value) {
      await $fetch(`/api/education/${editingItem.value.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: form.value
      })
    } else {
      await $fetch('/api/education', {
        method: 'POST',
        headers: getHeaders(),
        body: form.value
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
    await $fetch(`/api/education/${deletingItem.value.id}`, {
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
        <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">Education</h2>
        <p class="mt-1 text-sm text-neutral-500">Manage your education history</p>
      </div>
      <UButton icon="i-heroicons-plus" color="green" @click="openCreate">Add Education</UButton>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
      <div v-if="loading" class="p-8 text-center text-neutral-500">Loading...</div>
      <div v-else-if="items.length === 0" class="p-8 text-center text-neutral-500">No education found.</div>
      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">ID</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Institution</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Degree</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Period</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Location</th>
            <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700">
          <tr v-for="item in items" :key="item.id" class="hover:bg-neutral-50 dark:hover:bg-neutral-700/30">
            <td class="px-4 py-3 text-sm text-neutral-500">#{{ item.id }}</td>
            <td class="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">
              <a v-if="item.website" :href="item.website" target="_blank" class="hover:underline">{{ item.institution }}</a>
              <span v-else>{{ item.institution }}</span>
            </td>
            <td class="px-4 py-3 text-sm text-neutral-500">{{ item.degree || '—' }}</td>
            <td class="px-4 py-3 text-sm text-neutral-500">{{ item.start_date || '—' }} — {{ item.end_date || '—' }}</td>
            <td class="px-4 py-3">
              <span class="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-600 dark:text-cyan-400">
                {{ item.location || '—' }}
              </span>
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
          {{ editingItem ? 'Edit Education' : 'New Education' }}
        </h3>
        <div class="space-y-4">
          <UFormGroup label="Institution *" required>
            <UInput v-model="form.institution" placeholder="School/University name" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Website">
              <UInput v-model="form.website" placeholder="https://..." />
            </UFormGroup>
            <UFormGroup label="Degree">
              <UInput v-model="form.degree" placeholder="Bachelor of Science, etc." />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Start Date">
              <UInput v-model="form.start_date" placeholder="2020" />
            </UFormGroup>
            <UFormGroup label="End Date">
              <UInput v-model="form.end_date" placeholder="2024" />
            </UFormGroup>
          </div>

          <UFormGroup label="Location">
            <UInput v-model="form.location" placeholder="Bandung, Indonesia" />
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
        <h3 class="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">Delete Education</h3>
        <p class="mb-6 text-sm text-neutral-500">Are you sure you want to delete <strong class="text-neutral-900 dark:text-white">{{ deletingItem?.institution }}</strong>?</p>
        <div class="flex justify-end gap-3">
          <UButton color="gray" @click="showDeleteModal = false">Cancel</UButton>
          <UButton color="red" :loading="saving" @click="confirmDelete">Delete</UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>
