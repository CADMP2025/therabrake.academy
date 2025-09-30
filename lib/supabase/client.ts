import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Export a function called createClient (what other files expect)
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Also export a singleton instance
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Export the function for dynamic imports
export const createSupabaseClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Default export
export default supabase
