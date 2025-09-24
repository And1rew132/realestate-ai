import { defineStore } from 'pinia'
import type { Listing, Property } from '~/types'

export const useListingsStore = defineStore('listings', () => {
  const listings = ref<Listing[]>([])
  const currentListing = ref<Listing | null>(null)
  const loading = ref(false)
  const supabase = useSupabaseClient()

  const fetchListings = async (filters: {
    city?: string
    minPrice?: number
    maxPrice?: number
    propertyType?: string
    bedrooms?: number
    bathrooms?: number
  } = {}) => {
    loading.value = true
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          property:properties (
            *
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice)
      }
      
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }

      const { data, error } = await query

      if (error) throw error
      
      // Filter by property-specific criteria
      let filteredData = data || []
      
      if (filters.city) {
        filteredData = filteredData.filter(listing => 
          listing.property?.city?.toLowerCase().includes(filters.city!.toLowerCase())
        )
      }
      
      if (filters.propertyType) {
        filteredData = filteredData.filter(listing => 
          listing.property?.property_type === filters.propertyType
        )
      }
      
      if (filters.bedrooms) {
        filteredData = filteredData.filter(listing => 
          listing.property?.bedrooms === filters.bedrooms
        )
      }
      
      if (filters.bathrooms) {
        filteredData = filteredData.filter(listing => 
          listing.property?.bathrooms === filters.bathrooms
        )
      }

      listings.value = filteredData
      return { data: filteredData, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const fetchListing = async (id: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          property:properties (
            *
          )
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) throw error
      
      currentListing.value = data
      
      // Increment view count
      await supabase.rpc('increment_listing_views', { listing_uuid: id })
      
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const createListing = async (propertyId: string, listingData: Partial<Listing>) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('listings')
        .insert({
          property_id: propertyId,
          landlord_id: (await supabase.auth.getUser()).data.user?.id,
          ...listingData
        })
        .select()
        .single()

      if (error) throw error
      
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      // Update local state
      if (currentListing.value?.id === id) {
        currentListing.value = { ...currentListing.value, ...data }
      }
      
      const index = listings.value.findIndex(l => l.id === id)
      if (index !== -1) {
        listings.value[index] = { ...listings.value[index], ...data }
      }
      
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const deleteListing = async (id: string) => {
    loading.value = true
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Remove from local state
      listings.value = listings.value.filter(l => l.id !== id)
      if (currentListing.value?.id === id) {
        currentListing.value = null
      }
      
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    } finally {
      loading.value = false
    }
  }

  const searchListings = async (query: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          property:properties (
            *
          )
        `)
        .eq('is_active', true)
        .textSearch('property.title', query, {
          type: 'websearch',
          config: 'english'
        })

      if (error) throw error
      
      listings.value = data || []
      return { data: data || [], error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    listings: readonly(listings),
    currentListing: readonly(currentListing),
    loading: readonly(loading),
    fetchListings,
    fetchListing,
    createListing,
    updateListing,
    deleteListing,
    searchListings
  }
})