'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, User, LogOut, LogIn } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // TODO: Replace with actual auth state
  const [isAuthenticated] = useState(false)

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">TheraBrake Academy™</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/courses/professional" className="hover:text-accent transition">
              CE Courses
            </Link>
            <Link href="/courses/personal" className="hover:text-accent transition">
              Personal Development
            </Link>
            <Link href="/about" className="hover:text-accent transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-accent transition">
              Contact
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="bg-secondary hover:bg-secondary-hover px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <button className="hover:text-accent transition flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-accent transition flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-action hover:bg-action-hover px-4 py-2 rounded-lg transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link href="/courses/professional" className="hover:text-accent transition">
                CE Courses
              </Link>
              <Link href="/courses/personal" className="hover:text-accent transition">
                Personal Development
              </Link>
              <Link href="/about" className="hover:text-accent transition">
                About
              </Link>
              <Link href="/contact" className="hover:text-accent transition">
                Contact
              </Link>
              <div className="pt-4 border-t border-white/20 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="block bg-secondary hover:bg-secondary-hover px-4 py-2 rounded-lg transition"
                    >
                      Dashboard
                    </Link>
                    <button className="block w-full text-left hover:text-accent transition">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block hover:text-accent transition">
                      Login
                    </Link>
                    <Link 
                      href="/auth/register" 
                      className="block bg-action hover:bg-action-hover px-4 py-2 rounded-lg transition text-center"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
