export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  
  if (!authStore.isLandlord) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Landlord role required.'
    })
  }
})