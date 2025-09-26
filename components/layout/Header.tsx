'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, BookOpen, User, LogIn } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-heading font-bold text-xl text-primary">TheraBrake</span>
              <span className="font-heading font-bold text-xl text-secondary ml-1">Academy</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/courses" className="text-gray-700 hover:text-primary transition-colors">
              Courses
            </Link>
            <Link href="/ce-credits" className="text-gray-700 hover:text-primary transition-colors">
              CE Credits
            </Link>
            <Link href="/instructors" className="text-gray-700 hover:text-primary transition-colors">
              Instructors
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login" className="text-gray-700 hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/auth/register" className="btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/courses" className="text-gray-700 hover:text-primary">
                Courses
              </Link>
              <Link href="/ce-credits" className="text-gray-700 hover:text-primary">
                CE Credits
              </Link>
              <Link href="/instructors" className="text-gray-700 hover:text-primary">
                Instructors
              </Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-primary">
                Sign In
              </Link>
              <Link href="/auth/register" className="btn-primary text-center">
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
