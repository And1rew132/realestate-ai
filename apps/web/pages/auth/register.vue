<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        Create your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <NuxtLink to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
          sign in to existing account
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              I am a:
            </label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  v-model="form.role"
                  type="radio"
                  value="tenant"
                  class="mr-2"
                  :disabled="loading"
                />
                <span>Tenant</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.role"
                  type="radio"
                  value="landlord"
                  class="mr-2"
                  :disabled="loading"
                />
                <span>Landlord</span>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700">
                First name
              </label>
              <div class="mt-1">
                <input
                  id="first_name"
                  v-model="form.first_name"
                  name="first_name"
                  type="text"
                  required
                  class="form-input"
                  :disabled="loading"
                />
              </div>
            </div>

            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700">
                Last name
              </label>
              <div class="mt-1">
                <input
                  id="last_name"
                  v-model="form.last_name"
                  name="last_name"
                  type="text"
                  required
                  class="form-input"
                  :disabled="loading"
                />
              </div>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="form-input"
                :disabled="loading"
              />
            </div>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Phone number
            </label>
            <div class="mt-1">
              <input
                id="phone"
                v-model="form.phone"
                name="phone"
                type="tel"
                class="form-input"
                :disabled="loading"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                class="form-input"
                :disabled="loading"
              />
            </div>
          </div>

          <div>
            <label for="confirm_password" class="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <div class="mt-1">
              <input
                id="confirm_password"
                v-model="form.confirm_password"
                name="confirm_password"
                type="password"
                autocomplete="new-password"
                required
                class="form-input"
                :disabled="loading"
              />
            </div>
          </div>

          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>

          <div>
            <button
              type="submit"
              class="btn btn-primary w-full"
              :disabled="loading"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
              <span v-else>Create account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({
  role: (route.query.role as string) || 'tenant',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  confirm_password: ''
})

const loading = ref(false)
const error = ref('')

const registerSchema = z.object({
  role: z.enum(['tenant', 'landlord']),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"]
})

const handleRegister = async () => {
  error.value = ''
  
  try {
    // Validate form
    registerSchema.parse(form)
    
    loading.value = true
    const { error: signUpError } = await authStore.signUp(
      form.email,
      form.password,
      form.role as 'landlord' | 'tenant',
      {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone
      }
    )
    
    if (signUpError) {
      error.value = signUpError
    } else {
      // Show success message and redirect to login
      await router.push('/auth/login?message=Account created successfully. Please check your email to verify your account.')
    }
  } catch (err: any) {
    if (err.errors) {
      error.value = err.errors[0].message
    } else {
      error.value = 'An error occurred during registration'
    }
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Sign Up - Real Estate Platform'
})
</script>