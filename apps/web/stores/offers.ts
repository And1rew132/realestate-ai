import { defineStore } from 'pinia'
import type { Offer } from '~/types'

export const useOffersStore = defineStore('offers', () => {
  const offers = ref<Offer[]>([])
  const currentOffer = ref<Offer | null>(null)
  const loading = ref(false)
  const supabase = useSupabaseClient()

  const fetchOffers = async (filters: { 
    tenant?: boolean 
    landlord?: boolean 
    status?: string 
  } = {}) => {
    loading.value = true
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id
      
      let query = supabase
        .from('offers')
        .select(`
          *,
          listing:listings (
            *,
            property:properties (*)
          )
        `)
        .order('created_at', { ascending: false })

      // Apply filters based on user role
      if (filters.tenant) {
        query = query.eq('tenant_id', userId)
      } else if (filters.landlord) {
        query = query.eq('landlord_id', userId)
      }

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query

      if (error) throw error
      
      offers.value = data || []
      return { data: data || [], error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const fetchOffer = async (id: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          listing:listings (
            *,
            property:properties (*)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      
      currentOffer.value = data
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const createOffer = async (offerData: {
    listing_id: string
    offer_price: number
    deposit_amount?: number
    move_in_date: string
    message?: string
  }) => {
    loading.value = true
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id
      
      // Get listing to extract landlord_id
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .select('landlord_id')
        .eq('id', offerData.listing_id)
        .single()

      if (listingError) throw listingError

      const { data, error } = await supabase
        .from('offers')
        .insert({
          listing_id: offerData.listing_id,
          tenant_id: userId,
          landlord_id: listing.landlord_id,
          offer_price: offerData.offer_price,
          deposit_amount: offerData.deposit_amount,
          move_in_date: offerData.move_in_date,
          message: offerData.message,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error
      
      offers.value.unshift(data)
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const updateOfferStatus = async (id: string, status: 'accepted' | 'declined' | 'countered', counterData?: {
    counter_offer_price?: number
    counter_message?: string
  }) => {
    loading.value = true
    try {
      const updateData: any = { status }
      
      if (counterData) {
        updateData.counter_offer_price = counterData.counter_offer_price
        updateData.counter_message = counterData.counter_message
      }

      const { data, error } = await supabase
        .from('offers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      // Update local state
      if (currentOffer.value?.id === id) {
        currentOffer.value = { ...currentOffer.value, ...data }
      }
      
      const index = offers.value.findIndex(o => o.id === id)
      if (index !== -1) {
        offers.value[index] = { ...offers.value[index], ...data }
      }
      
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const acceptOffer = async (id: string) => {
    return updateOfferStatus(id, 'accepted')
  }

  const declineOffer = async (id: string) => {
    return updateOfferStatus(id, 'declined')
  }

  const counterOffer = async (id: string, counterPrice: number, message?: string) => {
    return updateOfferStatus(id, 'countered', {
      counter_offer_price: counterPrice,
      counter_message: message
    })
  }

  const withdrawOffer = async (id: string) => {
    loading.value = true
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Remove from local state
      offers.value = offers.value.filter(o => o.id !== id)
      if (currentOffer.value?.id === id) {
        currentOffer.value = null
      }
      
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    } finally {
      loading.value = false
    }
  }

  const getOffersByStatus = (status: string) => {
    return computed(() => offers.value.filter(offer => offer.status === status))
  }

  const getOfferStats = () => {
    return computed(() => {
      const pending = offers.value.filter(o => o.status === 'pending').length
      const accepted = offers.value.filter(o => o.status === 'accepted').length
      const declined = offers.value.filter(o => o.status === 'declined').length
      const countered = offers.value.filter(o => o.status === 'countered').length
      
      return { pending, accepted, declined, countered, total: offers.value.length }
    })
  }

  return {
    offers: readonly(offers),
    currentOffer: readonly(currentOffer),
    loading: readonly(loading),
    fetchOffers,
    fetchOffer,
    createOffer,
    updateOfferStatus,
    acceptOffer,
    declineOffer,
    counterOffer,
    withdrawOffer,
    getOffersByStatus,
    getOfferStats
  }
})