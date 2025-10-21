'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const supabase = createClient()
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Attempting login for:', credentials.email)

      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password,
      })

      if (signInError) {
        console.error('Sign in error:', signInError)
        throw signInError
      }

      if (!data.user) {
        throw new Error('No user data returned')
      }

      console.log('Login successful, user ID:', data.user.id)

      // Get user profile to determine role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name, email')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error('Profile error:', profileError)
        // Profile might not exist yet, default to student dashboard
        router.push('/dashboard')
        router.refresh()
        return
      }

      console.log('Profile loaded:', { role: profile.role, name: profile.full_name })

      // Redirect based on role
      let redirectPath = '/dashboard'
      
      switch (profile.role) {
        case 'admin':
          redirectPath = '/admin'
          break
        case 'instructor':
          redirectPath = '/instructor'
          break
        case 'student':
        default:
          redirectPath = '/dashboard'
          break
      }

      console.log('Redirecting to:', redirectPath)
      
      // Use window.location for a hard redirect to ensure middleware runs
      window.location.href = redirectPath
      
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'Invalid email or password. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your TheraBrake Academy account</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pr-10"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="text-center">
          <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-700 text-sm">
            Forgot Password?
          </Link>
        </div>
        
        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Test Accounts Help */}
        <div className="mt-6 pt-6 border-t">
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700 font-medium mb-2">
              Test Accounts (Development)
            </summary>
            <div className="mt-2 space-y-2 pl-2 text-left bg-gray-50 p-3 rounded">
              <div>
                <p className="font-medium text-gray-700">Students:</p>
                <p className="text-xs">• sarah.mitchell@therabrake.academy (Personal only)</p>
                <p className="text-xs">• marcus.thompson@therabrake.academy (All courses)</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Instructors:</p>
                <p className="text-xs">• jennifer.rodriguez@therabrake.academy (LMFT)</p>
                <p className="text-xs">• david.chen@therabrake.academy (PhD)</p>
              </div>
              <p className="font-medium mt-2 text-gray-900">Password: GReen!!00</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}