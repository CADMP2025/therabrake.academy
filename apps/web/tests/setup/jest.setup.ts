import '@testing-library/jest-dom'

// Provide sane defaults for env vars in unit tests if not defined
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'service-role-key'
process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'
