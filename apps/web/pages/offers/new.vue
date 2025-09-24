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
            <h1 class="text-2xl font-bold text-gray-900">Make an Offer</h1>
            <p class="mt-1 text-sm text-gray-600">
              Submit your offer for this property
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loadingListing" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-sm text-gray-600">Loading property details...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="currentListing" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Offer Form -->
        <div class="lg:col-span-2">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Property Overview -->
            <div class="card">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
              <div class="flex space-x-4">
                <div v-if="currentListing.property?.photos?.[0]" class="flex-shrink-0">
                  <img
                    :src="currentListing.property.photos[0]"
                    :alt="currentListing.property.title"
                    class="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900">{{ currentListing.property?.title }}</h4>
                  <p class="text-sm text-gray-600">
                    {{ currentListing.property?.address }}, {{ currentListing.property?.city }}
                  </p>
                  <p class="text-lg font-bold text-blue-600 mt-2">
                    ${{ currentListing.price?.toLocaleString() }}/month
                  </p>
                </div>
              </div>
            </div>

            <!-- Offer Details -->
            <div class="card">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Your Offer</h3>
              
              <div class="space-y-4">
                <div>
                  <label for="offer_price" class="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Rent Offer *
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      id="offer_price"
                      v-model.number="form.offer_price"
                      type="number"
                      required
                      class="form-input pl-7"
                      :placeholder="currentListing.price?.toString()"
                      :disabled="loading"
                    />
                  </div>
                  <p class="mt-1 text-xs text-gray-500">
                    Listed price: ${{ currentListing.price?.toLocaleString() }}/month
                  </p>
                </div>

                <div>
                  <label for="deposit_amount" class="block text-sm font-medium text-gray-700 mb-1">
                    Security Deposit Offer
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      id="deposit_amount"
                      v-model.number="form.deposit_amount"
                      type="number"
                      class="form-input pl-7"
                      :placeholder="currentListing.deposit?.toString() || 'Optional'"
                      :disabled="loading"
                    />
                  </div>
                  <p v-if="currentListing.deposit" class="mt-1 text-xs text-gray-500">
                    Listed deposit: ${{ currentListing.deposit.toLocaleString() }}
                  </p>
                </div>

                <div>
                  <label for="move_in_date" class="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Move-in Date *
                  </label>
                  <input
                    id="move_in_date"
                    v-model="form.move_in_date"
                    type="date"
                    required
                    class="form-input"
                    :min="minMoveInDate"
                    :disabled="loading"
                  />
                  <p class="mt-1 text-xs text-gray-500">
                    Available from: {{ formatDate(currentListing.available_from) }}
                  </p>
                </div>

                <div>
                  <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
                    Message to Landlord (Optional)
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="4"
                    class="form-input"
                    placeholder="Introduce yourself and explain why you'd be a great tenant..."
                    :disabled="loading"
                  />
                </div>
              </div>
            </div>

            <!-- Terms & Conditions -->
            <div class="card">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Terms & Conditions</h3>
              
              <div class="space-y-3">
                <label class="flex items-start">
                  <input
                    v-model="form.agreeToTerms"
                    type="checkbox"
                    required
                    class="mt-1 mr-3"
                    :disabled="loading"
                  />
                  <span class="text-sm text-gray-700">
                    I agree to the <a href="#" class="text-blue-600 hover:text-blue-500">Terms of Service</a> 
                    and <a href="#" class="text-blue-600 hover:text-blue-500">Privacy Policy</a>
                  </span>
                </label>

                <label class="flex items-start">
                  <input
                    v-model="form.allowContact"
                    type="checkbox"
                    class="mt-1 mr-3"
                    :disabled="loading"
                  />
                  <span class="text-sm text-gray-700">
                    I allow the landlord to contact me via email and phone for this application
                  </span>
                </label>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Error</h3>
                  <p class="mt-1 text-sm text-red-700">{{ error }}</p>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="goBack"
                class="btn btn-secondary"
                :disabled="loading"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="loading || !form.agreeToTerms"
              >
                <span v-if="loading">Submitting Offer...</span>
                <span v-else>Submit Offer</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Sidebar - Offer Summary -->
        <div class="lg:col-span-1">
          <div class="card sticky top-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Offer Summary</h3>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Monthly Rent:</span>
                <span class="text-sm font-medium text-gray-900">
                  ${{ (form.offer_price || currentListing.price || 0).toLocaleString() }}
                </span>
              </div>
              
              <div v-if="form.deposit_amount" class="flex justify-between">
                <span class="text-sm text-gray-600">Security Deposit:</span>
                <span class="text-sm font-medium text-gray-900">
                  ${{ form.deposit_amount.toLocaleString() }}
                </span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Move-in Date:</span>
                <span class="text-sm font-medium text-gray-900">
                  {{ form.move_in_date ? formatDate(form.move_in_date) : 'Not selected' }}
                </span>
              </div>
              
              <hr class="border-gray-200">
              
              <div class="flex justify-between font-medium">
                <span class="text-gray-900">Total First Payment:</span>
                <span class="text-gray-900">
                  ${{ ((form.offer_price || currentListing.price || 0) + (form.deposit_amount || 0)).toLocaleString() }}
                </span>
              </div>
            </div>

            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700">
                    <strong>Note:</strong> Your offer will be sent to the landlord for review. 
                    They may accept, decline, or counter your offer.
                  </p>
                </div>
              </div>
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
        <p class="mt-1 text-sm text-gray-500">The property you're trying to make an offer on doesn't exist or is no longer available.</p>
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
import { z } from 'zod'

const route = useRoute()
const router = useRouter()
const listingsStore = useListingsStore()
const offersStore = useOffersStore()
const authStore = useAuthStore()

const { currentListing, loading: loadingListing } = storeToRefs(listingsStore)

const loading = ref(false)
const error = ref('')

const form = reactive({
  offer_price: null as number | null,
  deposit_amount: null as number | null,
  move_in_date: '',
  message: '',
  agreeToTerms: false,
  allowContact: false
})

const minMoveInDate = computed(() => {
  const availableFrom = currentListing.value?.available_from
  if (!availableFrom) return new Date().toISOString().split('T')[0]
  
  const availableDate = new Date(availableFrom)
  const today = new Date()
  
  return availableDate > today 
    ? availableFrom 
    : new Date().toISOString().split('T')[0]
})

const offerSchema = z.object({
  offer_price: z.number().min(1, 'Offer price is required'),
  deposit_amount: z.number().min(0).optional(),
  move_in_date: z.string().min(1, 'Move-in date is required'),
  message: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms')
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goBack = () => {
  const listingId = route.query.listing as string
  if (listingId) {
    router.push(`/listings/${listingId}`)
  } else {
    router.push('/listings')
  }
}

const handleSubmit = async () => {
  error.value = ''
  
  try {
    // Validate form
    offerSchema.parse(form)
    
    const listingId = route.query.listing as string
    if (!listingId) {
      throw new Error('No listing specified')
    }
    
    loading.value = true
    
    const { error: submitError } = await offersStore.createOffer({
      listing_id: listingId,
      offer_price: form.offer_price!,
      deposit_amount: form.deposit_amount || undefined,
      move_in_date: form.move_in_date,
      message: form.message || undefined
    })
    
    if (submitError) {
      error.value = submitError
    } else {
      // Redirect to offers page with success message
      router.push('/offers?success=Offer submitted successfully')
    }
  } catch (err: any) {
    if (err.errors) {
      error.value = err.errors[0].message
    } else {
      error.value = err.message || 'Please check your input and try again'
    }
  } finally {
    loading.value = false
  }
}

// Load listing on mount
onMounted(async () => {
  await authStore.initialize()
  
  // Check if user is tenant
  if (!authStore.isTenant) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Only tenants can make offers'
    })
  }
  
  const listingId = route.query.listing as string
  if (listingId) {
    await listingsStore.fetchListing(listingId)
    
    // Pre-fill form with listing data
    if (currentListing.value) {
      form.offer_price = currentListing.value.price
      form.deposit_amount = currentListing.value.deposit || null
    }
  }
})

// Protect the page - only tenants can access
definePageMeta({
  middleware: ['auth']
})

useHead({
  title: 'Make an Offer - Real Estate Platform'
})
</script>