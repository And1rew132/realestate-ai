<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ authStore.isLandlord ? 'Property Offers' : 'My Offers' }}
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              {{ authStore.isLandlord ? 'Review and manage offers from tenants' : 'Track your property applications and offers' }}
            </p>
          </div>
          <div class="flex space-x-4">
            <NuxtLink to="/dashboard" class="btn btn-secondary">
              Dashboard
            </NuxtLink>
            <NuxtLink v-if="authStore.isTenant" to="/listings" class="btn btn-primary">
              Browse Properties
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="card text-center">
          <div class="text-2xl font-bold text-yellow-600">{{ offerStats.pending }}</div>
          <div class="text-sm text-gray-600">Pending</div>
        </div>
        <div class="card text-center">
          <div class="text-2xl font-bold text-green-600">{{ offerStats.accepted }}</div>
          <div class="text-sm text-gray-600">Accepted</div>
        </div>
        <div class="card text-center">
          <div class="text-2xl font-bold text-blue-600">{{ offerStats.countered }}</div>
          <div class="text-sm text-gray-600">Countered</div>
        </div>
        <div class="card text-center">
          <div class="text-2xl font-bold text-red-600">{{ offerStats.declined }}</div>
          <div class="text-sm text-gray-600">Declined</div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="mb-6">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.label }}
            <span v-if="tab.count !== undefined" class="ml-2 py-1 px-2 text-xs bg-gray-100 rounded-full">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-sm text-gray-600">Loading offers...</p>
      </div>

      <!-- Offers List -->
      <div v-else-if="filteredOffers.length > 0" class="space-y-4">
        <div
          v-for="offer in filteredOffers"
          :key="offer.id"
          class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
        >
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <!-- Offer Details -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ offer.listing?.property?.title }}
                  </h3>
                  <p class="text-sm text-gray-600">
                    {{ offer.listing?.property?.address }}, {{ offer.listing?.property?.city }}
                  </p>
                </div>
                <span :class="getStatusClass(offer.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ offer.status.charAt(0).toUpperCase() + offer.status.slice(1) }}
                </span>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div class="text-sm text-gray-500">Offer Price</div>
                  <div class="text-lg font-semibold text-gray-900">${{ offer.offer_price?.toLocaleString() }}</div>
                </div>
                <div v-if="offer.deposit_amount">
                  <div class="text-sm text-gray-500">Deposit</div>
                  <div class="text-lg font-semibold text-gray-900">${{ offer.deposit_amount.toLocaleString() }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Move-in Date</div>
                  <div class="text-lg font-semibold text-gray-900">{{ formatDate(offer.move_in_date) }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Submitted</div>
                  <div class="text-lg font-semibold text-gray-900">{{ formatDate(offer.created_at) }}</div>
                </div>
              </div>

              <!-- Original Message -->
              <div v-if="offer.message" class="mb-4">
                <div class="text-sm text-gray-500 mb-1">Message from {{ authStore.isLandlord ? 'tenant' : 'you' }}:</div>
                <div class="text-sm text-gray-700 bg-gray-50 p-3 rounded">{{ offer.message }}</div>
              </div>

              <!-- Counter Offer Details -->
              <div v-if="offer.status === 'countered' && offer.counter_offer_price" class="mb-4 p-4 bg-blue-50 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <div class="text-sm font-medium text-blue-800">Counter Offer</div>
                  <div class="text-lg font-bold text-blue-800">${{ offer.counter_offer_price.toLocaleString() }}</div>
                </div>
                <div v-if="offer.counter_message" class="text-sm text-blue-700">
                  {{ offer.counter_message }}
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-4 lg:mt-0 lg:ml-6 flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-3">
              <!-- Tenant Actions -->
              <template v-if="authStore.isTenant">
                <button
                  v-if="offer.status === 'countered'"
                  @click="acceptCounterOffer(offer.id)"
                  class="btn btn-primary text-sm"
                >
                  Accept Counter
                </button>
                <button
                  v-if="offer.status === 'pending' || offer.status === 'countered'"
                  @click="withdrawOffer(offer.id)"
                  class="btn bg-red-600 text-white hover:bg-red-700 text-sm"
                >
                  Withdraw
                </button>
              </template>

              <!-- Landlord Actions -->
              <template v-if="authStore.isLandlord && offer.status === 'pending'">
                <button
                  @click="acceptOffer(offer.id)"
                  class="btn btn-primary text-sm"
                >
                  Accept
                </button>
                <button
                  @click="showCounterModal(offer)"
                  class="btn btn-secondary text-sm"
                >
                  Counter
                </button>
                <button
                  @click="declineOffer(offer.id)"
                  class="btn bg-red-600 text-white hover:bg-red-700 text-sm"
                >
                  Decline
                </button>
              </template>

              <button
                @click="viewOffer(offer.id)"
                class="btn btn-secondary text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m-6-4h12m0 4h12" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          {{ authStore.isLandlord ? 'No offers received yet' : 'No offers submitted yet' }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ authStore.isLandlord 
              ? 'Offers from tenants will appear here once they submit applications.' 
              : 'Start browsing properties to submit your first offer.' 
          }}
        </p>
        <div v-if="authStore.isTenant" class="mt-6">
          <NuxtLink to="/listings" class="btn btn-primary">
            Browse Properties
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Counter Offer Modal -->
    <div v-if="showCounterOfferModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Counter Offer</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Counter Offer Price *
              </label>
              <input
                v-model.number="counterForm.price"
                type="number"
                required
                class="form-input"
                placeholder="Enter counter offer amount"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Message (Optional)
              </label>
              <textarea
                v-model="counterForm.message"
                rows="3"
                class="form-input"
                placeholder="Explain your counter offer..."
              />
            </div>
          </div>

          <div class="mt-6 flex space-x-4">
            <button
              @click="submitCounterOffer"
              class="btn btn-primary flex-1"
              :disabled="!counterForm.price || counteringOffer"
            >
              <span v-if="counteringOffer">Submitting...</span>
              <span v-else>Submit Counter</span>
            </button>
            <button
              @click="closeCounterModal"
              class="btn btn-secondary flex-1"
              :disabled="counteringOffer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Offer } from '~/types'

const offersStore = useOffersStore()
const authStore = useAuthStore()
const router = useRouter()

const { offers, loading } = storeToRefs(offersStore)

const activeTab = ref('all')
const showCounterOfferModal = ref(false)
const selectedOffer = ref<Offer | null>(null)
const counteringOffer = ref(false)

const counterForm = reactive({
  price: null as number | null,
  message: ''
})

const offerStats = computed(() => offersStore.getOfferStats().value)

const tabs = computed(() => [
  { key: 'all', label: 'All Offers', count: offerStats.value.total },
  { key: 'pending', label: 'Pending', count: offerStats.value.pending },
  { key: 'accepted', label: 'Accepted', count: offerStats.value.accepted },
  { key: 'countered', label: 'Countered', count: offerStats.value.countered },
  { key: 'declined', label: 'Declined', count: offerStats.value.declined }
])

const filteredOffers = computed(() => {
  if (activeTab.value === 'all') {
    return offers.value
  }
  return offers.value.filter(offer => offer.status === activeTab.value)
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800',
    countered: 'bg-blue-100 text-blue-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const viewOffer = (id: string) => {
  router.push(`/offers/${id}`)
}

const acceptOffer = async (id: string) => {
  const { error } = await offersStore.acceptOffer(id)
  if (error) {
    alert('Error accepting offer: ' + error)
  }
}

const declineOffer = async (id: string) => {
  if (confirm('Are you sure you want to decline this offer?')) {
    const { error } = await offersStore.declineOffer(id)
    if (error) {
      alert('Error declining offer: ' + error)
    }
  }
}

const showCounterModal = (offer: Offer) => {
  selectedOffer.value = offer
  counterForm.price = null
  counterForm.message = ''
  showCounterOfferModal.value = true
}

const closeCounterModal = () => {
  showCounterOfferModal.value = false
  selectedOffer.value = null
  counterForm.price = null
  counterForm.message = ''
}

const submitCounterOffer = async () => {
  if (!selectedOffer.value || !counterForm.price) return
  
  counteringOffer.value = true
  const { error } = await offersStore.counterOffer(
    selectedOffer.value.id,
    counterForm.price,
    counterForm.message
  )
  
  if (error) {
    alert('Error submitting counter offer: ' + error)
  } else {
    closeCounterModal()
  }
  
  counteringOffer.value = false
}

const acceptCounterOffer = async (id: string) => {
  if (confirm('Accept this counter offer?')) {
    const { error } = await offersStore.acceptOffer(id)
    if (error) {
      alert('Error accepting counter offer: ' + error)
    }
  }
}

const withdrawOffer = async (id: string) => {
  if (confirm('Are you sure you want to withdraw this offer?')) {
    const { error } = await offersStore.withdrawOffer(id)
    if (error) {
      alert('Error withdrawing offer: ' + error)
    }
  }
}

// Load offers on mount
onMounted(async () => {
  await authStore.initialize()
  
  if (authStore.isLandlord) {
    await offersStore.fetchOffers({ landlord: true })
  } else if (authStore.isTenant) {
    await offersStore.fetchOffers({ tenant: true })
  }
})

// Protect the page
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Offers - Real Estate Platform'
})
</script>