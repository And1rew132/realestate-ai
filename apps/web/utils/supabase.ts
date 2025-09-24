import { createClient } from '@supabase/supabase-js'

export const useSupabaseClient = () => {
  const config = useRuntimeConfig()
  
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )
  
  return supabase
}

export const useSupabaseServiceClient = () => {
  const config = useRuntimeConfig()
  
  // This should only be used on server-side
  if (process.client) {
    throw new Error('Service client should only be used on server-side')
  }
  
  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey
  )
  
  return supabase
}