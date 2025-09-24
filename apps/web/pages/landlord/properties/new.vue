<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center space-x-4">
          <button
            @click="goBack"
            class="p-2 text-gray-600 hover:text-gray-900"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Add New Property</h1>
            <p class="mt-1 text-sm text-gray-600">
              Add a new property to your portfolio
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PropertyForm
        @submit="handleSubmit"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Property } from '~/types'

const propertiesStore = usePropertiesStore()
const router = useRouter()

const goBack = () => {
  router.push('/landlord/properties')
}

const handleSubmit = async (propertyData: Partial<Property>) => {
  const { data, error } = await propertiesStore.createProperty(propertyData as Omit<Property, 'id' | 'landlord_id' | 'created_at' | 'updated_at'>)
  
  if (error) {
    alert('Error creating property: ' + error)
  } else {
    // Redirect to properties list with success message
    router.push('/landlord/properties?success=Property created successfully')
  }
}

// Protect the page - only landlords can access
definePageMeta({
  middleware: ['auth', 'landlord']
})

useHead({
  title: 'Add Property - Real Estate Platform'
})
</script>