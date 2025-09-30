'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Menu, X, LogOut, User as UserIcon, BookOpen, GraduationCap, Home, Info, Phone } from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm shadow-md'
    } border-b-4 border-primary`}>
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
              <span className="text-xl font-bold">
                <span className="text-primary">Thera</span>
                <span className="text-action">Brake</span>
                <sup className="text-xs text-gray-500 ml-0.5">™</sup>
              </span>
              <span className="text-xs text-gray-500 -mt-1">Academy</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`flex items-center space-x-1 font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                pathname === '/' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              href="/courses" 
              className={`flex items-center space-x-1 font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                pathname.startsWith('/courses') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </Link>

            <Link 
              href="/about" 
              className={`flex items-center space-x-1 font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                pathname === '/about' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </Link>

            <Link 
              href="/contact" 
              className={`flex items-center space-x-1 font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                pathname === '/contact' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Contact</span>
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                    pathname === '/dashboard' 
                      ? 'bg-secondary/10 text-secondary' 
                      : 'text-gray-600 hover:text-secondary hover:bg-secondary/5'
                  }`}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 font-medium text-gray-600 hover:text-red-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="font-medium text-gray-600 hover:text-primary transition-all duration-200 px-3 py-2"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="px-5 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-primary transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fadeIn">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  pathname === '/' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link 
                href="/courses" 
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  pathname.startsWith('/courses') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>

              <Link 
                href="/about" 
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  pathname === '/about' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              <Link 
                href="/contact" 
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  pathname === '/contact' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              <hr className="my-2 border-gray-200" />
              
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      pathname === '/dashboard' 
                        ? 'bg-secondary/10 text-secondary' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="px-4 py-3 rounded-lg font-medium text-left text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login" 
                    className="px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="px-4 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium text-center hover:from-blue-600 hover:to-primary transition-all duration-300"
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
