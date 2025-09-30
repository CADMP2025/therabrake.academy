'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Menu, X, LogOut, User as UserIcon, BookOpen, GraduationCap } from 'lucide-react'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

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
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navLinks = [
    { href: '/courses', label: 'Browse Courses', icon: BookOpen },
    { href: '/about', label: 'About', icon: null },
    { href: '/contact', label: 'Contact', icon: null },
  ]

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Image */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 transition-transform group-hover:scale-105">
              <Image
                src="/images/logo/logo.png"
                alt="TheraBrake Academy"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TheraBrake
              </span>
              <span className="text-xs text-text-secondary uppercase tracking-wider">Academy</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-primary ${
                  pathname === link.href
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-text-secondary hover:translate-y-[-2px]'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-alert transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-text-primary" />
            ) : (
              <Menu className="h-6 w-6 text-text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slideDown">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserIcon className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-alert text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-text-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 bg-primary text-white rounded-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
