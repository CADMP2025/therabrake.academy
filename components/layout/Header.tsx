'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Menu, X, LogOut, User as UserIcon, BookOpen, GraduationCap, Home, Info, Phone } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand Name */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src="/images/logo/logo.png"
              alt="TheraBrake Academy"
              width={40}
              height={40}
              className="h-10 w-10 transition-transform group-hover:scale-110"
              priority
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">
                TheraBrake Academy<sup className="text-xs ml-0.5">™</sup>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`font-medium transition-all duration-200 ${
                pathname === '/' 
                  ? 'text-accent' 
                  : 'text-white hover:text-accent'
              }`}
            >
              Home
            </Link>
            
            <Link 
              href="/courses" 
              className={`font-medium transition-all duration-200 ${
                pathname.startsWith('/courses') 
                  ? 'text-accent' 
                  : 'text-white hover:text-accent'
              }`}
            >
              Courses
            </Link>

            <Link 
              href="/pricing" 
              className={`font-medium transition-all duration-200 ${
                pathname === '/pricing' 
                  ? 'text-accent' 
                  : 'text-white hover:text-accent'
              }`}
            >
              Memberships
            </Link>

            <Link 
              href="/about" 
              className={`font-medium transition-all duration-200 ${
                pathname === '/about' 
                  ? 'text-accent' 
                  : 'text-white hover:text-accent'
              }`}
            >
              About
            </Link>

            <Link 
              href="/contact" 
              className={`font-medium transition-all duration-200 ${
                pathname === '/contact' 
                  ? 'text-accent' 
                  : 'text-white hover:text-accent'
              }`}
            >
              Contact
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`font-medium transition-all duration-200 ${
                    pathname === '/dashboard' 
                      ? 'text-accent' 
                      : 'text-white hover:text-accent'
                  }`}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="font-medium text-white hover:text-accent transition-all duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="font-medium text-white hover:text-accent transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="px-4 py-2 bg-action text-white rounded-lg font-medium hover:bg-action/90 transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white hover:text-accent transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-dark">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className={`px-4 py-2 rounded font-medium transition-all duration-200 ${
                  pathname === '/' 
                    ? 'text-accent' 
                    : 'text-white hover:text-accent'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link 
                href="/courses" 
                className={`px-4 py-2 rounded font-medium transition-all duration-200 ${
                  pathname.startsWith('/courses') 
                    ? 'text-accent' 
                    : 'text-white hover:text-accent'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>

              <Link 
                href="/pricing" 
                className={`px-4 py-2 rounded font-medium transition-all duration-200 ${
                  pathname === '/pricing' 
                    ? 'text-accent' 
                    : 'text-white hover:text-accent'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Memberships
              </Link>

              <Link 
                href="/about" 
                className={`px-4 py-2 rounded font-medium transition-all duration-200 ${
                  pathname === '/about' 
                    ? 'text-accent' 
                    : 'text-white hover:text-accent'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              <Link 
                href="/contact" 
                className={`px-4 py-2 rounded font-medium transition-all duration-200 ${
                  pathname === '/contact' 
                    ? 'text-accent' 
                    : 'text-white hover:text-accent'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              <hr className="my-2 border-primary-dark" />
              
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`px-4 py-2 rounded font-medium transition-all duration-200 ${
                      pathname === '/dashboard' 
                        ? 'text-accent' 
                        : 'text-white hover:text-accent'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded font-medium text-left text-white hover:text-accent transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login" 
                    className="px-4 py-2 rounded font-medium text-white hover:text-accent transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="px-4 py-2 bg-action text-white rounded-lg font-medium text-center hover:bg-action/90 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
