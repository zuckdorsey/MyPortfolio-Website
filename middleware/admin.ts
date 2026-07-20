export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/admin/login') return

  const token = localStorage.getItem('admin_token')
  if (!token) {
    return navigateTo('/admin/login')
  }
})
