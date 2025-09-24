import { defineStore } from 'pinia'
import type { Property } from '~/types'

export const usePropertiesStore = defineStore('properties', () => {
  const properties = ref<Property[]>([])
  const currentProperty = ref<Property | null>(null)
  const loading = ref(false)
  const supabase = useSupabaseClient()

  const fetchProperties = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      properties.value = data || []
      return { data: data || [], error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const fetchProperty = async (id: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      currentProperty.value = data
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const createProperty = async (propertyData: Omit<Property, 'id' | 'landlord_id' | 'created_at' | 'updated_at'>) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          landlord_id: (await supabase.auth.getUser()).data.user?.id,
          ...propertyData
        })
        .select()
        .single()

      if (error) throw error
      
      properties.value.unshift(data)
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      // Update local state
      if (currentProperty.value?.id === id) {
        currentProperty.value = { ...currentProperty.value, ...data }
      }
      
      const index = properties.value.findIndex(p => p.id === id)
      if (index !== -1) {
        properties.value[index] = { ...properties.value[index], ...data }
      }
      
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const deleteProperty = async (id: string) => {
    loading.value = true
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Remove from local state
      properties.value = properties.value.filter(p => p.id !== id)
      if (currentProperty.value?.id === id) {
        currentProperty.value = null
      }
      
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    } finally {
      loading.value = false
    }
  }

  const uploadPropertyPhotos = async (propertyId: string, files: File[]) => {
    loading.value = true
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${propertyId}/${Date.now()}.${fileExt}`
        
        const { data, error } = await supabase.storage
          .from('property-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) throw error
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('property-photos')
          .getPublicUrl(fileName)
        
        return publicUrl
      })

      const photoUrls = await Promise.all(uploadPromises)
      
      // Update property with new photo URLs
      const property = properties.value.find(p => p.id === propertyId)
      if (property) {
        const updatedPhotos = [...(property.photos || []), ...photoUrls]
        await updateProperty(propertyId, { photos: updatedPhotos })
      }
      
      return { data: photoUrls, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const removePropertyPhoto = async (propertyId: string, photoUrl: string) => {
    loading.value = true
    try {
      const property = properties.value.find(p => p.id === propertyId)
      if (!property) throw new Error('Property not found')

      // Remove from storage
      const fileName = photoUrl.split('/').pop()
      if (fileName) {
        await supabase.storage
          .from('property-photos')
          .remove([`${propertyId}/${fileName}`])
      }

      // Update property
      const updatedPhotos = property.photos?.filter(url => url !== photoUrl) || []
      await updateProperty(propertyId, { photos: updatedPhotos })
      
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    properties: readonly(properties),
    currentProperty: readonly(currentProperty),
    loading: readonly(loading),
    fetchProperties,
    fetchProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    uploadPropertyPhotos,
    removePropertyPhoto
  }
})