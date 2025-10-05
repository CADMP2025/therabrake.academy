import { createBrowserClient } from '@supabase/ssr'

// Main function to create Supabase client
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Export as 'supabase' for backward compatibility
export const supabase = createClient()

// Also export as createSupabaseClient for compatibility
export const createSupabaseClient = createClient

// Default export
export default createClient
