<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">My Properties</h1>
            <p class="mt-1 text-sm text-gray-600">
              {{ properties.length }} properties in your portfolio
            </p>
          </div>
          <div class="flex space-x-4">
            <NuxtLink to="/dashboard" class="btn btn-secondary">
              Dashboard
            </NuxtLink>
            <NuxtLink to="/landlord/properties/new" class="btn btn-primary">
              Add Property
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-sm text-gray-600">Loading properties...</p>
      </div>

      <!-- Properties Grid -->
      <div v-else-if="properties.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="property in properties"
          :key="property.id"
          class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <!-- Property Image -->
          <div class="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center relative">
            <img
              v-if="property.photos && property.photos.length > 0"
              :src="property.photos[0]"
              :alt="property.title"
              class="w-full h-full object-cover rounded-t-lg"
            />
            <div v-else class="text-gray-400">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
              </svg>
            </div>
            
            <!-- Photo count badge -->
            <div v-if="property.photos && property.photos.length > 1" class="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {{ property.photos.length }} photos
            </div>
          </div>

          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ property.title }}
            </h3>
            
            <p class="text-sm text-gray-600 mb-2">
              {{ property.address }}, {{ property.city }}, {{ property.state }}
            </p>
            
            <div class="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span v-if="property.bedrooms">
                {{ property.bedrooms }} bed{{ property.bedrooms !== 1 ? 's' : '' }}
              </span>
              <span v-if="property.bathrooms">
                {{ property.bathrooms }} bath{{ property.bathrooms !== 1 ? 's' : '' }}
              </span>
              <span v-if="property.square_feet">
                {{ property.square_feet.toLocaleString() }} sq ft
              </span>
            </div>
            
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
                {{ property.property_type }}
              </span>
              <span class="text-xs text-gray-500">
                Added {{ formatDate(property.created_at) }}
              </span>
            </div>

            <!-- Amenities -->
            <div v-if="property.amenities && property.amenities.length > 0" class="mb-4">
              <p class="text-xs text-gray-500 mb-1">Amenities:</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="amenity in property.amenities.slice(0, 3)"
                  :key="amenity"
                  class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                >
                  {{ amenity }}
                </span>
                <span
                  v-if="property.amenities.length > 3"
                  class="text-xs text-gray-500"
                >
                  +{{ property.amenities.length - 3 }} more
                </span>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex space-x-2">
              <button
                @click="viewProperty(property.id)"
                class="flex-1 btn btn-primary text-sm py-2"
              >
                View Details
              </button>
              <button
                @click="editProperty(property.id)"
                class="btn btn-secondary text-sm py-2 px-4"
              >
                Edit
              </button>
              <button
                @click="deleteProperty(property.id)"
                class="btn bg-red-600 text-white hover:bg-red-700 text-sm py-2 px-4"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8h4M10 12h4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No properties yet</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by adding your first property.</p>
        <div class="mt-6">
          <NuxtLink to="/landlord/properties/new" class="btn btn-primary">
            Add Your First Property
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-5">Delete Property</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete this property? This action cannot be undone and will also remove all associated listings.
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <div class="flex space-x-4">
              <button
                @click="confirmDelete"
                class="btn bg-red-600 text-white hover:bg-red-700 flex-1"
                :disabled="deletingProperty"
              >
                <span v-if="deletingProperty">Deleting...</span>
                <span v-else>Delete</span>
              </button>
              <button
                @click="cancelDelete"
                class="btn btn-secondary flex-1"
                :disabled="deletingProperty"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const propertiesStore = usePropertiesStore()
const router = useRouter()

const { properties, loading } = storeToRefs(propertiesStore)

const showDeleteModal = ref(false)
const propertyToDelete = ref<string | null>(null)
const deletingProperty = ref(false)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const viewProperty = (id: string) => {
  router.push(`/landlord/properties/${id}`)
}

const editProperty = (id: string) => {
  router.push(`/landlord/properties/${id}/edit`)
}

const deleteProperty = (id: string) => {
  propertyToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!propertyToDelete.value) return
  
  deletingProperty.value = true
  const { error } = await propertiesStore.deleteProperty(propertyToDelete.value)
  
  if (error) {
    alert('Error deleting property: ' + error)
  }
  
  deletingProperty.value = false
  showDeleteModal.value = false
  propertyToDelete.value = null
}

const cancelDelete = () => {
  showDeleteModal.value = false
  propertyToDelete.value = null
}

// Load properties on mount
onMounted(() => {
  propertiesStore.fetchProperties()
})

// Protect the page - only landlords can access
definePageMeta({
  middleware: ['auth', 'landlord']
})

useHead({
  title: 'My Properties - Real Estate Platform'
})
</script>