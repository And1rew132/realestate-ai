<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Basic Information -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
            Property Title *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="form-input"
            placeholder="e.g., Modern 2BR Apartment Downtown"
            :disabled="loading"
          />
        </div>

        <div>
          <label for="property_type" class="block text-sm font-medium text-gray-700 mb-1">
            Property Type *
          </label>
          <select
            id="property_type"
            v-model="form.property_type"
            required
            class="form-input"
            :disabled="loading"
          >
            <option value="">Select type...</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="studio">Studio</option>
          </select>
        </div>
      </div>

      <div class="mt-6">
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          class="form-input"
          placeholder="Describe your property, its features, and what makes it special..."
          :disabled="loading"
        />
      </div>
    </div>

    <!-- Location -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Location</h3>
      
      <div class="space-y-4">
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <input
            id="address"
            v-model="form.address"
            type="text"
            required
            class="form-input"
            placeholder="123 Main Street"
            :disabled="loading"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              id="city"
              v-model="form.city"
              type="text"
              required
              class="form-input"
              placeholder="New York"
              :disabled="loading"
            />
          </div>

          <div>
            <label for="state" class="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              id="state"
              v-model="form.state"
              type="text"
              required
              class="form-input"
              placeholder="NY"
              :disabled="loading"
            />
          </div>

          <div>
            <label for="zip_code" class="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code *
            </label>
            <input
              id="zip_code"
              v-model="form.zip_code"
              type="text"
              required
              class="form-input"
              placeholder="10001"
              :disabled="loading"
            />
          </div>
        </div>

        <div>
          <label for="country" class="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <input
            id="country"
            v-model="form.country"
            type="text"
            required
            class="form-input"
            placeholder="United States"
            :disabled="loading"
          />
        </div>
      </div>
    </div>

    <!-- Property Details -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label for="bedrooms" class="block text-sm font-medium text-gray-700 mb-1">
            Bedrooms
          </label>
          <input
            id="bedrooms"
            v-model.number="form.bedrooms"
            type="number"
            min="0"
            class="form-input"
            placeholder="2"
            :disabled="loading"
          />
        </div>

        <div>
          <label for="bathrooms" class="block text-sm font-medium text-gray-700 mb-1">
            Bathrooms
          </label>
          <input
            id="bathrooms"
            v-model.number="form.bathrooms"
            type="number"
            min="0"
            step="0.5"
            class="form-input"
            placeholder="1.5"
            :disabled="loading"
          />
        </div>

        <div>
          <label for="square_feet" class="block text-sm font-medium text-gray-700 mb-1">
            Square Feet
          </label>
          <input
            id="square_feet"
            v-model.number="form.square_feet"
            type="number"
            min="0"
            class="form-input"
            placeholder="1200"
            :disabled="loading"
          />
        </div>
      </div>
    </div>

    <!-- Amenities -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Amenities</h3>
      
      <div class="mb-4">
        <div class="flex space-x-2">
          <input
            v-model="newAmenity"
            type="text"
            class="form-input flex-1"
            placeholder="Add an amenity (e.g., Pool, Gym, Parking)"
            @keydown.enter.prevent="addAmenity"
            :disabled="loading"
          />
          <button
            type="button"
            @click="addAmenity"
            class="btn btn-secondary"
            :disabled="loading || !newAmenity.trim()"
          >
            Add
          </button>
        </div>
      </div>

      <div v-if="form.amenities.length > 0" class="flex flex-wrap gap-2">
        <span
          v-for="(amenity, index) in form.amenities"
          :key="index"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
        >
          {{ amenity }}
          <button
            type="button"
            @click="removeAmenity(index)"
            class="ml-2 text-blue-600 hover:text-blue-800"
            :disabled="loading"
          >
            ×
          </button>
        </span>
      </div>
    </div>

    <!-- Photos -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Photos</h3>
      
      <div class="mb-4">
        <input
          ref="fileInput"
          type="file"
          multiple
          accept="image/*"
          class="hidden"
          @change="handleFileUpload"
        />
        <button
          type="button"
          @click="$refs.fileInput?.click()"
          class="btn btn-secondary"
          :disabled="loading || uploading"
        >
          <span v-if="uploading">Uploading...</span>
          <span v-else>Add Photos</span>
        </button>
        <p class="mt-1 text-xs text-gray-500">
          Upload up to 10 photos. JPG, PNG files up to 5MB each.
        </p>
      </div>

      <div v-if="form.photos.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="(photo, index) in form.photos"
          :key="index"
          class="relative group"
        >
          <img
            :src="photo"
            :alt="`Property photo ${index + 1}`"
            class="w-full h-24 object-cover rounded border"
          />
          <button
            type="button"
            @click="removePhoto(index)"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            :disabled="loading"
          >
            ×
          </button>
        </div>
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
        @click="$emit('cancel')"
        class="btn btn-secondary"
        :disabled="loading"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="loading || uploading"
      >
        <span v-if="loading">
          {{ isEdit ? 'Updating...' : 'Creating...' }}
        </span>
        <span v-else>
          {{ isEdit ? 'Update Property' : 'Create Property' }}
        </span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Property } from '~/types'
import { z } from 'zod'

interface Props {
  property?: Property
  isEdit?: boolean
}

interface Emits {
  (e: 'submit', data: Partial<Property>): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits<Emits>()

const loading = ref(false)
const uploading = ref(false)
const error = ref('')
const newAmenity = ref('')

const form = reactive<Partial<Property>>({
  title: props.property?.title || '',
  description: props.property?.description || '',
  property_type: props.property?.property_type || '',
  address: props.property?.address || '',
  city: props.property?.city || '',
  state: props.property?.state || '',
  zip_code: props.property?.zip_code || '',
  country: props.property?.country || 'United States',
  bedrooms: props.property?.bedrooms || undefined,
  bathrooms: props.property?.bathrooms || undefined,
  square_feet: props.property?.square_feet || undefined,
  amenities: [...(props.property?.amenities || [])],
  photos: [...(props.property?.photos || [])]
})

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  property_type: z.enum(['apartment', 'house', 'condo', 'townhouse', 'studio']),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip_code: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  description: z.string().optional(),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  square_feet: z.number().min(0).optional(),
  amenities: z.array(z.string()).optional(),
  photos: z.array(z.string()).optional()
})

const addAmenity = () => {
  const amenity = newAmenity.value.trim()
  if (amenity && !form.amenities.includes(amenity)) {
    form.amenities.push(amenity)
    newAmenity.value = ''
  }
}

const removeAmenity = (index: number) => {
  form.amenities.splice(index, 1)
}

const handleFileUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  // Validate file count
  if (form.photos.length + files.length > 10) {
    error.value = 'Maximum 10 photos allowed'
    return
  }

  uploading.value = true
  error.value = ''

  try {
    // Convert files to base64 URLs for preview (in real implementation, you'd upload to Supabase storage)
    const promises = Array.from(files).map(file => {
      return new Promise<string>((resolve, reject) => {
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          reject(new Error('File size must be less than 5MB'))
          return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          reject(new Error('Only image files are allowed'))
          return
        }

        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    })

    const photoUrls = await Promise.all(promises)
    form.photos.push(...photoUrls)
  } catch (err: any) {
    error.value = err.message || 'Error uploading photos'
  } finally {
    uploading.value = false
    // Clear the input
    ;(event.target as HTMLInputElement).value = ''
  }
}

const removePhoto = (index: number) => {
  form.photos.splice(index, 1)
}

const handleSubmit = async () => {
  error.value = ''
  
  try {
    // Validate form
    propertySchema.parse(form)
    
    loading.value = true
    emit('submit', form)
  } catch (err: any) {
    if (err.errors) {
      error.value = err.errors[0].message
    } else {
      error.value = 'Please check your input and try again'
    }
  } finally {
    loading.value = false
  }
}

// Expose loading state for parent component
defineExpose({
  loading: readonly(loading)
})
</script>