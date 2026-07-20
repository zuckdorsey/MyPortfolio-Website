const TOKEN_KEY = 'admin_token'

export function useAdmin() {
  const token = useState<string | null>('admin_token', () => null)
  const isLoggedIn = computed(() => !!token.value)

  // Hydrate token from localStorage on init (client-side only)
  onMounted(() => {
    if (process.client && !token.value) {
      const stored = localStorage.getItem(TOKEN_KEY)
      if (stored) {
        token.value = stored
      }
    }
  })

  async function login(password: string): Promise<boolean> {
    try {
      const res = await $fetch<{ token: string }>('/api/admin/login', {
        method: 'POST',
        body: { password }
      })

      if (res.token) {
        token.value = res.token
        if (process.client) {
          localStorage.setItem(TOKEN_KEY, res.token)
        }
        return true
      }
      return false
    } catch {
      return false
    }
  }

  function logout() {
    token.value = null
    if (process.client) {
      localStorage.removeItem(TOKEN_KEY)
    }
    navigateTo('/admin/login')
  }

  function getToken(): string | null {
    if (token.value) return token.value
    if (process.client) {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  }

  return {
    token,
    isLoggedIn,
    login,
    logout,
    getToken
  }
}
