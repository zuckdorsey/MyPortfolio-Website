<script setup lang="ts">
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const { user, logout } = auth;

onMounted(() => {
  auth.initAuth();
});

const isSidebarOpen = ref(false);
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
</script>

<template>
  <div class="min-h-screen bg-black text-slate-300 font-sans selection:bg-primary-500/30 lg:p-4 lg:flex lg:gap-4 lg:h-screen lg:overflow-hidden">
    
    <!-- Mobile Header (Visible only on mobile) -->
    <nav class="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-[#0B0E14] border-b border-slate-800 px-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="toggleSidebar" class="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
          <i class="i-tabler-menu-2 w-6 h-6"></i>
        </button>
        <span class="font-semibold text-white tracking-tight">Portfolio</span>
      </div>
      <UAvatar :alt="user?.name" size="xs" src="/photo.jpeg" class="ring-2 ring-slate-800" />
    </nav>

    <!-- Sidebar (Desktop: Floating Panel, Mobile: Slide-over) -->
    <aside 
      class="fixed inset-y-0 left-0 z-40 w-64 bg-[#0B0E14] border-r lg:border border-slate-800 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:rounded-2xl lg:flex lg:flex-col lg:h-full"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="h-full flex flex-col">
        <!-- Logo Area -->
        <div class="h-16 lg:h-20 flex items-center px-6 border-b border-slate-800/50">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 flex items-center justify-center">
              <i class="i-tabler-command w-5 h-5 text-white"></i>
            </div>
            <span class="font-bold text-white tracking-tight">Admin</span>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <div class="px-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Menu</div>
          <NuxtLink 
            v-for="item in navItems" 
            :key="item.to" 
            :to="item.to" 
            class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent"
            active-class="!bg-slate-900 !text-white !border-slate-800 shadow-sm"
            :class="$route.path === item.to ? '' : 'text-slate-400 hover:text-white hover:border-slate-800 hover:bg-slate-900/50'"
          >
            <i :class="[item.icon, 'w-5 h-5 transition-colors', $route.path === item.to ? 'text-white' : 'text-slate-500 group-hover:text-slate-300']"></i>
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- User Profile -->
        <div class="p-4 border-t border-slate-800/50">
          <UDropdown 
            :items="[[{ label: 'Sign out', icon: 'i-tabler-logout', click: logout }]]" 
            :popper="{ placement: 'top-end', strategy: 'fixed' }"
            class="w-full"
          >
            <button class="w-full flex items-center gap-3 p-2 rounded-lg border border-transparent hover:border-slate-800 hover:bg-slate-900 transition-all group">
              <UAvatar :alt="user?.name" size="sm" src="/photo.jpeg" class="ring-2 ring-slate-800 group-hover:ring-slate-700 transition-all" />
              <div class="flex-1 text-left min-w-0">
                <p class="text-sm font-medium text-white truncate">{{ user?.name || 'Admin User' }}</p>
                <p class="text-xs text-slate-500 truncate">{{ user?.email || 'admin@example.com' }}</p>
              </div>
              <i class="i-tabler-selector w-4 h-4 text-slate-500 group-hover:text-slate-300"></i>
            </button>
          </UDropdown>
        </div>
      </div>
    </aside>

    <!-- Overlay -->
    <div v-if="isSidebarOpen" @click="toggleSidebar" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"></div>

    <!-- Main Content (Desktop: Floating Panel) -->
    <main class="pt-16 lg:pt-0 min-h-screen lg:min-h-0 lg:h-full lg:flex-1 bg-[#0B0E14] lg:rounded-2xl lg:border border-slate-800 lg:overflow-hidden flex flex-col">
      <div class="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
        <div class="max-w-6xl mx-auto">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<style>
/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
