import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Export the supabase client directly
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Also export a function to create the client (for the register page)
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Export default for other imports
export default supabase
