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
  title: '',
  type: '',
  url: '',
  icon: ''
})

function getHeaders() {
  return { Authorization: `Bearer ${getToken()}` }
}

async function fetchItems() {
  loading.value = true
  try {
    const res = await $fetch<any[]>('/api/skills')
    items.value = res || []
  } catch {
    items.value = []
  }
  loading.value = false
}

function openCreate() {
  editingItem.value = null
  form.value = { title: '', type: '', url: '', icon: '' }
  showModal.value = true
}

function openEdit(item: any) {
  editingItem.value = item
  form.value = {
    title: item.title || '',
    type: item.type || '',
    url: item.url || '',
    icon: item.icon || ''
  }
  showModal.value = true
}

function openDelete(item: any) {
  deletingItem.value = item
  showDeleteModal.value = true
}

async function save() {
  if (!form.value.title) {
    alert('Title is required')
    return
  }

  saving.value = true
  try {
    if (editingItem.value) {
      await $fetch(`/api/skills/${editingItem.value.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: form.value
      })
    } else {
      await $fetch('/api/skills', {
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
    await $fetch(`/api/skills/${deletingItem.value.id}`, {
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
        <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">Skills</h2>
        <p class="mt-1 text-sm text-neutral-500">Manage your skills and technologies</p>
      </div>
      <UButton icon="i-heroicons-plus" color="green" @click="openCreate">Add Skill</UButton>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
      <div v-if="loading" class="p-8 text-center text-neutral-500">Loading...</div>
      <div v-else-if="items.length === 0" class="p-8 text-center text-neutral-500">No skills found.</div>
      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">ID</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Title</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Type</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Icon</th>
            <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700">
          <tr v-for="item in items" :key="item.id" class="hover:bg-neutral-50 dark:hover:bg-neutral-700/30">
            <td class="px-4 py-3 text-sm text-neutral-500">#{{ item.id }}</td>
            <td class="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">{{ item.title }}</td>
            <td class="px-4 py-3">
              <span class="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-600 dark:text-purple-400">
                {{ item.type || '—' }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-neutral-500">{{ item.icon || '—' }}</td>
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
          {{ editingItem ? 'Edit Skill' : 'New Skill' }}
        </h3>
        <div class="space-y-4">
          <UFormGroup label="Title *" required>
            <UInput v-model="form.title" placeholder="Skill name" />
          </UFormGroup>

          <UFormGroup label="Type">
            <UInput v-model="form.type" placeholder="Language, Framework, Tool, etc." />
          </UFormGroup>

          <UFormGroup label="URL">
            <UInput v-model="form.url" placeholder="https://..." />
          </UFormGroup>

          <UFormGroup label="Icon">
            <UInput v-model="form.icon" placeholder="Icon name or URL" />
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
        <h3 class="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">Delete Skill</h3>
        <p class="mb-6 text-sm text-neutral-500">Are you sure you want to delete <strong class="text-neutral-900 dark:text-white">{{ deletingItem?.title }}</strong>?</p>
        <div class="flex justify-end gap-3">
          <UButton color="gray" @click="showDeleteModal = false">Cancel</UButton>
          <UButton color="red" :loading="saving" @click="confirmDelete">Delete</UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>
