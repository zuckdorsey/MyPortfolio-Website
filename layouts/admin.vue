<script setup lang="ts">
useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

const { isLoggedIn, logout } = useAdmin()
const route = useRoute()

const sidebarOpen = ref(true)

const navItems = [
  { label: 'Dashboard', icon: 'i-heroicons-home', to: '/admin' },
  { label: 'Projects', icon: 'i-heroicons-folder', to: '/admin/projects' },
  { label: 'Skills', icon: 'i-heroicons-cog', to: '/admin/skills' },
  { label: 'Experiences', icon: 'i-heroicons-briefcase', to: '/admin/experiences' },
  { label: 'Education', icon: 'i-heroicons-academic-cap', to: '/admin/education' },
  { label: 'Certifications', icon: 'i-heroicons-star', to: '/admin/certifications' },
]
</script>

<template>
  <div class="min-h-screen dark:bg-neutral-900">
    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="fixed top-0 left-0 z-40 h-screen w-64 border-r border-neutral-200 bg-white transition-transform dark:border-neutral-700 dark:bg-neutral-800"
      :class="{ '-translate-x-full lg:translate-x-0': !sidebarOpen }"
    >
      <div class="flex h-full flex-col">
        <!-- Logo -->
        <div class="flex h-16 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-700">
          <NuxtLink to="/admin" class="flex items-center gap-2 text-lg font-semibold dark:text-white">
            <UIcon name="i-heroicons-shield-check" class="text-green-500" />
            <span>Admin Panel</span>
          </NuxtLink>
          <button
            class="rounded p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 lg:hidden"
            @click="sidebarOpen = false"
          >
            <UIcon name="i-heroicons-x-mark" class="h-5 w-5" />
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto p-3">
          <ul class="space-y-1">
            <li v-for="item in navItems" :key="item.to">
              <NuxtLink
                :to="item.to"
                class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
                :class="[
                  route.path === item.to
                    ? 'bg-green-500/10 font-medium text-green-600 dark:text-green-400'
                    : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700/50'
                ]"
              >
                <UIcon :name="item.icon" class="h-5 w-5 flex-shrink-0" />
                <span>{{ item.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Footer -->
        <div class="border-t border-neutral-200 p-3 dark:border-neutral-700">
          <NuxtLink
            to="/"
            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700/50"
          >
            <UIcon name="i-heroicons-arrow-left" class="h-5 w-5" />
            <span>Back to Site</span>
          </NuxtLink>
          <button
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
            @click="logout"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="lg:pl-64">
      <!-- Top bar -->
      <header class="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white/80 px-4 backdrop-blur dark:border-neutral-700 dark:bg-neutral-800/80">
        <button
          class="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 lg:hidden"
          @click="sidebarOpen = true"
        >
          <UIcon name="i-heroicons-bars-3" class="h-5 w-5" />
        </button>
        <h1 class="text-sm font-medium text-neutral-500">
          {{ route.meta.title || 'Admin' }}
        </h1>
      </header>

      <!-- Page Content -->
      <main class="p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
