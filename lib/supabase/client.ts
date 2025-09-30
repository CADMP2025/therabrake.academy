import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create and export the singleton instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export a function for API routes that need a fresh instance
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Default export
export default supabase
