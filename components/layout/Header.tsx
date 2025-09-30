'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Menu, X, LogOut, User as UserIcon, BookOpen, GraduationCap } from 'lucide-react'

export function Header() {
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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo/logo.png"
              alt="TheraBrake Academy"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/courses" 
              className={pathname === '/courses' ? 'nav-link-active' : 'nav-link'}
            >
              <BookOpen className="inline-block w-4 h-4 mr-1" />
              Courses
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={pathname === '/dashboard' ? 'nav-link-active' : 'nav-link'}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/profile" 
                  className={pathname === '/profile' ? 'nav-link-active' : 'nav-link'}
                >
                  <UserIcon className="inline-block w-4 h-4 mr-1" />
                  Profile
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="nav-link flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="nav-link">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fadeIn">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/courses" 
                className={pathname === '/courses' ? 'nav-link-active' : 'nav-link'}
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className={pathname === '/dashboard' ? 'nav-link-active' : 'nav-link'}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    className={pathname === '/profile' ? 'nav-link-active' : 'nav-link'}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="nav-link text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login" 
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="btn-primary text-center"
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
