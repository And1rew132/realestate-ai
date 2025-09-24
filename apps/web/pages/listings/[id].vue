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
            <h1 class="text-2xl font-bold text-gray-900">Property Details</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-sm text-gray-600">Loading property details...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="currentListing" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Property Details -->
        <div class="lg:col-span-2">
          <!-- Photo Gallery -->
          <div class="card mb-6">
            <div v-if="currentListing.property?.photos && currentListing.property.photos.length > 0" class="mb-4">
              <img
                :src="currentListing.property.photos[0]"
                :alt="currentListing.property.title"
                class="w-full h-64 md:h-96 object-cover rounded-lg"
              />
              <div v-if="currentListing.property.photos.length > 1" class="grid grid-cols-4 gap-2 mt-2">
                <img
                  v-for="(photo, index) in currentListing.property.photos.slice(1, 5)"
                  :key="index"
                  :src="photo"
                  :alt="`Property photo ${index + 2}`"
                  class="w-full h-16 object-cover rounded cursor-pointer hover:opacity-75"
                  @click="showPhoto(photo)"
                />
              </div>
            </div>
            <div v-else class="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <!-- Description -->
          <div class="card mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <p class="text-gray-700 whitespace-pre-line">
              {{ currentListing.description || currentListing.property?.description || 'No description available.' }}
            </p>
          </div>

          <!-- Property Features -->
          <div class="card mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Property Features</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-if="currentListing.property?.bedrooms" class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ currentListing.property.bedrooms }}</div>
                <div class="text-sm text-gray-600">Bedroom{{ currentListing.property.bedrooms !== 1 ? 's' : '' }}</div>
              </div>
              <div v-if="currentListing.property?.bathrooms" class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ currentListing.property.bathrooms }}</div>
                <div class="text-sm text-gray-600">Bathroom{{ currentListing.property.bathrooms !== 1 ? 's' : '' }}</div>
              </div>
              <div v-if="currentListing.property?.square_feet" class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ currentListing.property.square_feet.toLocaleString() }}</div>
                <div class="text-sm text-gray-600">Sq Ft</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600 capitalize">{{ currentListing.property?.property_type }}</div>
                <div class="text-sm text-gray-600">Type</div>
              </div>
            </div>
          </div>

          <!-- Amenities -->
          <div v-if="currentListing.property?.amenities && currentListing.property.amenities.length > 0" class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div
                v-for="amenity in currentListing.property.amenities"
                :key="amenity"
                class="flex items-center space-x-2"
              >
                <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-gray-700">{{ amenity }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <!-- Price & Actions -->
          <div class="card mb-6 sticky top-6">
            <div class="text-center mb-6">
              <div class="text-3xl font-bold text-blue-600">
                ${{ currentListing.price?.toLocaleString() }}
                <span class="text-lg text-gray-500">{{ currentListing.listing_type === 'rent' ? '/month' : '' }}</span>
              </div>
              <div class="text-sm text-gray-600 mt-1">
                {{ currentListing.listing_type === 'rent' ? 'Monthly Rent' : 'Sale Price' }}
              </div>
            </div>

            <div v-if="currentListing.deposit" class="mb-4 p-3 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-600">Security Deposit</div>
              <div class="text-lg font-semibold text-gray-900">${{ currentListing.deposit.toLocaleString() }}</div>
            </div>

            <div class="mb-6">
              <div class="text-sm text-gray-600 mb-1">Available From</div>
              <div class="text-lg font-semibold text-gray-900">{{ formatDate(currentListing.available_from) }}</div>
            </div>

            <div v-if="authStore.isLoggedIn && authStore.isTenant" class="space-y-3">
              <button
                @click="contactLandlord"
                class="btn btn-primary w-full"
              >
                Contact Landlord
              </button>
              <button
                @click="makeOffer"
                class="btn btn-secondary w-full"
              >
                Make an Offer
              </button>
            </div>
            <div v-else-if="!authStore.isLoggedIn" class="space-y-3">
              <NuxtLink to="/auth/login" class="btn btn-primary w-full">
                Sign in to Contact
              </NuxtLink>
              <p class="text-xs text-gray-500 text-center">
                Sign in to contact the landlord or make an offer
              </p>
            </div>
            <div v-else class="p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-700 text-center">
                Switch to tenant account to contact landlord
              </p>
            </div>
          </div>

          <!-- Location -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Location</h3>
            <div class="space-y-2">
              <div class="text-sm text-gray-600">Address</div>
              <div class="text-gray-900">{{ currentListing.property?.address }}</div>
              <div class="text-gray-900">
                {{ currentListing.property?.city }}, {{ currentListing.property?.state }} {{ currentListing.property?.zip_code }}
              </div>
              <div class="text-gray-900">{{ currentListing.property?.country }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Property not found</h3>
        <p class="mt-1 text-sm text-gray-500">The property you're looking for doesn't exist or is no longer available.</p>
        <div class="mt-6">
          <button @click="goBack" class="btn btn-primary">
            Back to Listings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const listingsStore = useListingsStore()
const authStore = useAuthStore()

const { currentListing, loading } = storeToRefs(listingsStore)

const goBack = () => {
  router.push('/listings')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const showPhoto = (photoUrl: string) => {
  // Implement photo gallery modal (simplified for now)
  window.open(photoUrl, '_blank')
}

const contactLandlord = () => {
  // Navigate to messaging page
  router.push(`/messages?landlord=${currentListing.value?.landlord_id}&property=${currentListing.value?.property_id}`)
}

const makeOffer = () => {
  // Navigate to offer creation page
  router.push(`/offers/new?listing=${route.params.id}`)
}

// Load listing on mount
onMounted(async () => {
  await authStore.initialize()
  await listingsStore.fetchListing(route.params.id as string)
})

useHead({
  title: () => currentListing.value ? `${currentListing.value.property?.title} - Real Estate Platform` : 'Property Details - Real Estate Platform'
})
</script>