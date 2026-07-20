<script setup lang="ts">
definePageMeta({
  layout: false
})

const { login, isLoggedIn } = useAdmin()
const router = useRouter()

const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

// Redirect if already logged in
onMounted(() => {
  if (isLoggedIn.value) {
    navigateTo('/admin')
  }
})

async function handleLogin() {
  if (!password.value) {
    error.value = 'Password is required'
    return
  }

  loading.value = true
  error.value = ''

  const success = await login(password.value)

  if (success) {
    navigateTo('/admin')
  } else {
    error.value = 'Invalid password'
  }

  loading.value = false
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-100 dark:bg-neutral-900">
    <div class="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
      <!-- Header -->
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <UIcon name="i-heroicons-shield-check" class="h-8 w-8 text-green-500" />
        </div>
        <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">Admin Login</h1>
        <p class="mt-2 text-sm text-neutral-500">Enter your password to access the admin panel</p>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
      >
        {{ error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Password</label>
            <div class="relative">
              <UInput
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter admin password"
                size="lg"
                icon="i-heroicons-lock-closed"
                @keyup.enter="handleLogin"
              />
              <button
                type="button"
                class="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                @click="showPassword = !showPassword"
              >
                <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="h-5 w-5" />
              </button>
            </div>
          </div>

          <UButton
            type="submit"
            block
            size="lg"
            color="green"
            :loading="loading"
            label="Sign In"
          />
        </div>
      </form>

      <!-- Back link -->
      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
          ← Back to website
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
