import { defineStore } from 'pinia'
import type { User } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const supabase = useSupabaseClient()

  const isLoggedIn = computed(() => !!user.value)
  const isLandlord = computed(() => user.value?.role === 'landlord')
  const isTenant = computed(() => user.value?.role === 'tenant')

  const signUp = async (email: string, password: string, role: 'landlord' | 'tenant', userData: Partial<User> = {}) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            ...userData
          }
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      user.value = null
      await navigateTo('/auth/login')
    } catch (error: any) {
      console.error('Sign out error:', error.message)
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        // Fetch additional user data from profiles table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        user.value = profile || {
          id: authUser.id,
          email: authUser.email!,
          role: authUser.user_metadata.role || 'tenant',
          created_at: authUser.created_at,
          updated_at: authUser.updated_at || authUser.created_at
        }
      } else {
        user.value = null
      }
    } catch (error: any) {
      console.error('Fetch user error:', error.message)
      user.value = null
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user.value) return { error: 'No user logged in' }

    loading.value = true
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.value.id)
        .select()
        .single()

      if (error) throw error
      user.value = { ...user.value, ...data }
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }

  // Initialize auth state
  const initialize = async () => {
    await fetchUser()
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await fetchUser()
      } else if (event === 'SIGNED_OUT') {
        user.value = null
      }
    })
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    isLoggedIn,
    isLandlord,
    isTenant,
    signUp,
    signIn,
    signOut,
    fetchUser,
    updateProfile,
    initialize
  }
})