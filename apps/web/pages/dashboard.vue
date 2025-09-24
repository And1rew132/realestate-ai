<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">
              Real Estate Platform
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">
              Welcome, {{ authStore.user?.first_name || 'User' }}
            </span>
            <button
              @click="authStore.signOut"
              class="btn btn-secondary text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900">
            Dashboard
          </h2>
          <p class="mt-1 text-sm text-gray-600">
            Welcome to your {{ authStore.isLandlord ? 'landlord' : 'tenant' }} dashboard
          </p>
        </div>

        <!-- Role-specific content -->
        <div v-if="authStore.isLandlord" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Landlord Dashboard -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Properties</h3>
            <p class="text-sm text-gray-600 mb-4">Manage your property portfolio</p>
            <NuxtLink to="/landlord/properties" class="btn btn-primary">
              View Properties
            </NuxtLink>
          </div>

          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Listings</h3>
            <p class="text-sm text-gray-600 mb-4">Create and manage property listings</p>
            <NuxtLink to="/landlord/listings" class="btn btn-primary">
              View Listings
            </NuxtLink>
          </div>

          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Offers</h3>
            <p class="text-sm text-gray-600 mb-4">Review tenant offers and applications</p>
            <NuxtLink to="/offers" class="btn btn-primary">
              View Offers
            </NuxtLink>
          </div>

          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Messages</h3>
            <p class="text-sm text-gray-600 mb-4">Communicate with tenants</p>
            <NuxtLink to="/messages" class="btn btn-primary">
              View Messages
            </NuxtLink>
          </div>

          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Payments</h3>
            <p class="text-sm text-gray-600 mb-4">Track rent payments and collections</p>
            <NuxtLink to="/landlord/payments" class="btn btn-primary">
              View Payments
            </NuxtLink>
          </div>

          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Analytics</h3>
            <p class="text-sm text-gray-600 mb-4">View KPIs and performance metrics</p>
            <NuxtLink to="/landlord/analytics" class="btn btn-primary">
              View Analytics
            </NuxtLink>
          </div>
        </div>

        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Tenant Dashboard -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Browse Properties</h3>
            <p class="text-sm text-gray-600 mb-4">Find your perfect home</p>
            <NuxtLink to="/listings" class="btn btn-primary">
              Browse Listings
            </NuxtLink>
          </div>

          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">My Offers</h3>
            <p class="text-sm text-gray-600 mb-4">Track your applications and offers</p>
            <NuxtLink to="/offers" class="btn btn-primary">
              View Offers
            </NuxtLink>
          </div>

          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Messages</h3>
            <p class="text-sm text-gray-600 mb-4">Chat with landlords</p>
            <NuxtLink to="/messages" class="btn btn-primary">
              View Messages
            </NuxtLink>
          </div>

          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Rent Payments</h3>
            <p class="text-sm text-gray-600 mb-4">Pay rent and view payment history</p>
            <NuxtLink to="/payments" class="btn btn-primary">
              View Payments
            </NuxtLink>
          </div>

          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">My Tenancy</h3>
            <p class="text-sm text-gray-600 mb-4">View lease details and documents</p>
            <NuxtLink to="/tenancy" class="btn btn-primary">
              View Tenancy
            </NuxtLink>
          </div>

          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Settings</h3>
            <p class="text-sm text-gray-600 mb-4">Update your profile and preferences</p>
            <NuxtLink to="/settings" class="btn btn-primary">
              View Settings
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

// Initialize auth store
onMounted(() => {
  authStore.initialize()
})

// Protect the page
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Dashboard - Real Estate Platform'
})
</script>