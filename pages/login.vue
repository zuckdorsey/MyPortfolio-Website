<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "auth",
});

import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const email = ref("");
const password = ref("");
const error = ref("");
const isPending = ref(false);

onMounted(() => {
  auth.initAuth();
});

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = "Please enter both email and password";
    return;
  }

  isPending.value = true;
  error.value = "";

  try {
    const result = await auth.login(email.value, password.value);
    if (result.success) {
      navigateTo("/dashboard");
    } else {
      error.value = result.message || "Login failed";
    }
  } catch (e) {
    error.value = "An unexpected error occurred";
    console.error(e);
  } finally {
    isPending.value = false;
  }
};
</script>

<template>
  <div>
    <!-- Logo and Title -->
    <div class="mb-8 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
        <i class="i-tabler-command w-8 h-8 text-white"></i>
      </div>
      <h2 class="text-2xl font-bold text-white">Welcome Back</h2>
      <p class="mt-2 text-slate-400 text-sm">
        Sign in to your admin dashboard
      </p>
    </div>

    <!-- Login Form Card -->
    <div class="bg-[#0d1117] border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm">
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email Field -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i class="i-tabler-mail w-5 h-5 text-slate-500"></i>
            </div>
            <input
              v-model="email"
              type="email"
              placeholder="admin@example.com"
              autocomplete="email"
              required
              class="w-full bg-[#161b22] border border-slate-800 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Password</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i class="i-tabler-lock w-5 h-5 text-slate-500"></i>
            </div>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              required
              class="w-full bg-[#161b22] border border-slate-800 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
        >
          <i class="i-tabler-alert-circle w-5 h-5 flex-shrink-0"></i>
          <span>{{ error }}</span>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isPending"
          class="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
        >
          <i v-if="isPending" class="i-tabler-loader-2 w-5 h-5 animate-spin"></i>
          <span>{{ isPending ? 'Signing in...' : 'Sign In' }}</span>
        </button>

        <!-- Demo Credentials -->
        <div class="text-center pt-2">
          <p class="text-xs text-slate-500">
            Demo: <span class="text-slate-400">admin@example.com</span> / <span class="text-slate-400">password</span>
          </p>
        </div>
      </form>
    </div>

    <!-- Return to Portfolio -->
    <div class="mt-6 text-center">
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <i class="i-tabler-arrow-left w-4 h-4"></i>
        Return to Portfolio
      </NuxtLink>
    </div>
  </div>
</template>
