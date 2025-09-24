<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Property Listings</h1>
            <p class="mt-1 text-sm text-gray-600">
              {{ listings.length }} properties available
            </p>
          </div>
          <NuxtLink to="/" class="btn btn-secondary">
            Back to Home
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Filter Properties</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              v-model="filters.city"
              type="text"
              placeholder="Enter city..."
              class="form-input"
              @input="debouncedSearch"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select v-model="filters.propertyType" class="form-input" @change="applyFilters">
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="studio">Studio</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
            <input
              v-model.number="filters.minPrice"
              type="number"
              placeholder="Min price..."
              class="form-input"
              @input="debouncedSearch"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
            <input
              v-model.number="filters.maxPrice"
              type="number"
              placeholder="Max price..."
              class="form-input"
              @input="debouncedSearch"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <select v-model="filters.bedrooms" class="form-input" @change="applyFilters">
              <option value="">Any</option>
              <option :value="1">1 Bedroom</option>
              <option :value="2">2 Bedrooms</option>
              <option :value="3">3 Bedrooms</option>
              <option :value="4">4+ Bedrooms</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <select v-model="filters.bathrooms" class="form-input" @change="applyFilters">
              <option value="">Any</option>
              <option :value="1">1 Bathroom</option>
              <option :value="1.5">1.5 Bathrooms</option>
              <option :value="2">2 Bathrooms</option>
              <option :value="2.5">2.5+ Bathrooms</option>
            </select>
          </div>
        </div>
        
        <div class="mt-4 flex space-x-4">
          <button @click="applyFilters" class="btn btn-primary">
            Apply Filters
          </button>
          <button @click="clearFilters" class="btn btn-secondary">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-sm text-gray-600">Loading properties...</p>
      </div>

      <!-- Listings Grid -->
      <div v-else-if="listings.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="listing in listings"
          :key="listing.id"
          class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
          @click="viewListing(listing.id)"
        >
          <!-- Property Image -->
          <div class="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
            <img
              v-if="listing.property?.photos?.[0]"
              :src="listing.property.photos[0]"
              :alt="listing.property?.title"
              class="w-full h-full object-cover rounded-t-lg"
            />
            <div v-else class="text-gray-400">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ listing.property?.title }}
            </h3>
            
            <p class="text-sm text-gray-600 mb-2">
              {{ listing.property?.address }}, {{ listing.property?.city }}, {{ listing.property?.state }}
            </p>
            
            <div class="flex items-center justify-between mb-3">
              <span class="text-2xl font-bold text-blue-600">
                ${{ listing.price?.toLocaleString() }}
                <span class="text-sm text-gray-500">{{ listing.listing_type === 'rent' ? '/month' : '' }}</span>
              </span>
              <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {{ listing.listing_type === 'rent' ? 'For Rent' : 'For Sale' }}
              </span>
            </div>
            
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span v-if="listing.property?.bedrooms">
                {{ listing.property.bedrooms }} bed{{ listing.property.bedrooms !== 1 ? 's' : '' }}
              </span>
              <span v-if="listing.property?.bathrooms">
                {{ listing.property.bathrooms }} bath{{ listing.property.bathrooms !== 1 ? 's' : '' }}
              </span>
              <span v-if="listing.property?.square_feet">
                {{ listing.property.square_feet.toLocaleString() }} sq ft
              </span>
            </div>
            
            <div class="mt-3 flex items-center justify-between">
              <span class="text-xs text-gray-500 capitalize">
                {{ listing.property?.property_type }}
              </span>
              <span class="text-xs text-gray-500">
                Available {{ formatDate(listing.available_from) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8h4M10 12h4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search filters.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const listingsStore = useListingsStore()
const router = useRouter()

const { listings, loading } = storeToRefs(listingsStore)

const filters = reactive({
  city: '',
  propertyType: '',
  minPrice: null as number | null,
  maxPrice: null as number | null,
  bedrooms: null as number | null,
  bathrooms: null as number | null
})

const applyFilters = async () => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
  )
  await listingsStore.fetchListings(cleanFilters)
}

const clearFilters = async () => {
  Object.assign(filters, {
    city: '',
    propertyType: '',
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
    bathrooms: null
  })
  await listingsStore.fetchListings()
}

const debouncedSearch = useDebounceFn(applyFilters, 500)

const viewListing = (id: string) => {
  router.push(`/listings/${id}`)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Load listings on mount
onMounted(() => {
  listingsStore.fetchListings()
})

useHead({
  title: 'Property Listings - Real Estate Platform',
  meta: [
    { name: 'description', content: 'Browse available properties for rent and sale' }
  ]
})
</script>