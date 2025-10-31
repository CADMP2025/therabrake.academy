import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@therabrake/shared-types'

export interface SupabaseConfig {
  url: string
  anonKey: string
  storage?: any // For React Native AsyncStorage
}

let supabaseInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function initializeSupabase(config: SupabaseConfig) {
  supabaseInstance = createSupabaseClient<Database>(
    config.url,
    config.anonKey,
    {
      auth: config.storage ? {
        storage: config.storage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      } : undefined,
    }
  )
  return supabaseInstance
}

export function getSupabase() {
  if (!supabaseInstance) {
    throw new Error('Supabase not initialized. Call initializeSupabase() first.')
  }
  return supabaseInstance
}
