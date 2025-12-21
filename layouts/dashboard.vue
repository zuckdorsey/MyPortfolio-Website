<script setup lang="ts">
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const { user, logout } = auth;

onMounted(() => {
  auth.initAuth();
});

const isSidebarOpen = ref(false);
const isSidebarExpanded = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const navItems = [
  { icon: "i-tabler-layout-dashboard", label: "Overview", to: "/dashboard" },
  { icon: "i-tabler-briefcase", label: "Projects", to: "/dashboard/projects" },
  { icon: "i-tabler-bulb", label: "Skills", to: "/dashboard/skills" },
  { icon: "i-tabler-building-skyscraper", label: "Experiences", to: "/dashboard/experiences" },
  { icon: "i-tabler-school", label: "Education", to: "/dashboard/education" },
  { icon: "i-tabler-certificate", label: "Certifications", to: "/dashboard/certifications" },
];

const route = useRoute();
const currentPageTitle = computed(() => {
  const path = route.path;
  
  // 1. Explicit meta title, if provided by the route definition
  const metaTitle = (route.meta as any)?.title as string | undefined;
  if (metaTitle) {
    return metaTitle;
  }

  // 2. Exact dashboard overview
  if (path === "/dashboard") {
    return "Overview";
  }

  // 3. Handle nested project routes explicitly
  if (path.startsWith("/dashboard/projects")) {
    const segments = path.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (lastSegment === "projects") {
      return "Projects";
    }

    if (lastSegment === "new") {
      return "New Project";
    }

    // Any other nested project route (e.g. /dashboard/projects/123)
    return "Edit Project";
  }

  // 4. Fall back to the matching nav item label for other sections
  const matchedNavItem = navItems.find((item) => path.startsWith(item.to));
  if (matchedNavItem) {
    return matchedNavItem.label;
  }

  // 5. Final fallback: capitalize the last path segment
  const segment = path.split("/").filter(Boolean).pop();
  return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : "Dashboard";
});
</script>

<template>
  <div class="min-h-screen bg-[#0B0E14] text-slate-300 font-sans selection:bg-primary-500/30">
    
    <!-- Mobile Header -->
    <nav class="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 backdrop-blur-xl bg-[#0B0E14]/80 border-b border-white/5 px-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="toggleSidebar" class="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
          <i class="i-tabler-menu-2 w-5 h-5"></i>
        </button>
        <span class="font-semibold text-white">{{ currentPageTitle }}</span>
      </div>
      <UAvatar :alt="user?.name" size="xs" src="/photo.jpeg" class="ring-2 ring-white/10" />
    </nav>

    <div class="flex">
      <!-- Sidebar -->
      <aside 
        class="fixed inset-y-0 left-0 z-40 bg-[#0B0E14] border-r border-white/5 transform transition-all duration-300 lg:translate-x-0 flex flex-col"
        :class="[
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          isSidebarExpanded ? 'w-64' : 'w-64 lg:w-20'
        ]"
        @mouseenter="isSidebarExpanded = true"
        @mouseleave="isSidebarExpanded = false"
      >
        <!-- Logo -->
        <div class="h-14 lg:h-16 flex items-center px-4 border-b border-white/5">
          <div class="flex items-center gap-3 overflow-hidden">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
              <i class="i-tabler-command w-5 h-5 text-white"></i>
            </div>
            <span 
              class="font-bold text-white whitespace-nowrap transition-opacity duration-300"
              :class="isSidebarExpanded ? 'opacity-100' : 'lg:opacity-0'"
            >
              Admin Panel
            </span>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <NuxtLink 
            v-for="item in navItems" 
            :key="item.to" 
            :to="item.to" 
            class="group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200"
            active-class="!bg-white/10 !text-white"
            :class="$route.path === item.to ? '' : 'text-slate-400 hover:text-white hover:bg-white/5'"
            @focus="isSidebarExpanded = true"
            @blur="isSidebarExpanded = false"
          >
            <i :class="[item.icon, 'w-5 h-5 flex-shrink-0 transition-colors', $route.path === item.to ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300']"></i>
            <span 
              class="whitespace-nowrap transition-opacity duration-300"
              :class="isSidebarExpanded ? 'opacity-100' : 'lg:opacity-0'"
            >
              {{ item.label }}
            </span>
          </NuxtLink>
        </nav>

        <!-- User Profile -->
        <div class="p-3 border-t border-white/5">
          <UDropdown 
            :items="[[{ label: 'Sign out', icon: 'i-tabler-logout', click: logout }]]" 
            :popper="{ placement: 'top-end', strategy: 'fixed' }"
            class="w-full"
          >
            <button class="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group">
              <UAvatar :alt="user?.name" size="sm" src="/photo.jpeg" class="ring-2 ring-white/10 group-hover:ring-white/20 transition-all flex-shrink-0" />
              <div 
                class="flex-1 text-left min-w-0 transition-opacity duration-300"
                :class="isSidebarExpanded ? 'opacity-100' : 'lg:opacity-0'"
              >
                <p class="text-sm font-medium text-white truncate">{{ user?.name || 'Admin' }}</p>
                <p class="text-xs text-slate-500 truncate">{{ user?.email || 'admin@example.com' }}</p>
              </div>
            </button>
          </UDropdown>
        </div>
      </aside>

      <!-- Overlay -->
      <div v-if="isSidebarOpen" @click="toggleSidebar" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"></div>

      <!-- Main Content -->
      <main 
        class="flex-1 min-h-screen pt-14 lg:pt-0 transition-all duration-300"
        :class="isSidebarExpanded ? 'lg:ml-64' : 'lg:ml-20'"
      >
        <!-- Top Header Bar -->
        <header class="hidden lg:flex h-16 items-center justify-between px-8 border-b border-white/5 backdrop-blur-xl bg-[#0B0E14]/50 sticky top-0 z-20">
          <div class="flex items-center gap-4">
            <h1 class="text-xl font-semibold text-white">{{ currentPageTitle }}</h1>
          </div>
          <div class="flex items-center gap-4">
            <!-- TODO: Implement search functionality -->
            <button class="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors" disabled title="Search (coming soon)">
              <i class="i-tabler-search w-5 h-5"></i>
            </button>
            <!-- TODO: Implement notification system -->
            <button class="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors" disabled title="Notifications (coming soon)">
              <i class="i-tabler-bell w-5 h-5"></i>
            </button>
            <div class="w-px h-6 bg-white/10"></div>
            <UAvatar :alt="user?.name" size="sm" src="/photo.jpeg" class="ring-2 ring-white/10" />
          </div>
        </header>

        <!-- Page Content -->
        <div class="px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          <div class="max-w-7xl mx-auto">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
