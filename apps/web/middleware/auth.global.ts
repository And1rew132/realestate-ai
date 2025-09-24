export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/listings'
  ]
  
  // Routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/offers',
    '/messages',
    '/settings',
    '/landlord'
  ]
  
  const isPublicRoute = publicRoutes.some(route => 
    to.path === route || to.path.startsWith(route + '/')
  )
  
  const isProtectedRoute = protectedRoutes.some(route => 
    to.path.startsWith(route)
  )
  
  // If it's a protected route and user is not logged in, redirect to login
  if (isProtectedRoute && !authStore.isLoggedIn) {
    return navigateTo('/auth/login')
  }
  
  // Role-based access control
  if (to.path.startsWith('/landlord') && !authStore.isLandlord) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Landlord role required.'
    })
  }
  
  // If user is logged in and trying to access auth pages, redirect to dashboard
  if (authStore.isLoggedIn && to.path.startsWith('/auth/')) {
    return navigateTo('/dashboard')
  }
})