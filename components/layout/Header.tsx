'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="bg-primary text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">TheraBrake</span>
            <span className="text-accent">Academy™</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-accent transition">Home</Link>
            
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center hover:text-accent transition"
              >
                Courses <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-xl py-2">
                  <Link href="/courses/professional" className="block px-4 py-2 text-text-primary hover:bg-background-secondary">
                    Professional CE Courses
                  </Link>
                  <Link href="/courses/personal" className="block px-4 py-2 text-text-primary hover:bg-background-secondary">
                    Personal Development
                  </Link>
                  <Link href="/courses/premium" className="block px-4 py-2 text-text-primary hover:bg-background-secondary">
                    Premium Programs
                  </Link>
                </div>
              )}
            </div>

            <Link href="/about" className="hover:text-accent transition">About</Link>
            <Link href="/contact" className="hover:text-accent transition">Contact</Link>
            <Link href="/auth/login" className="hover:text-accent transition">Login</Link>
            <Link href="/auth/register" className="bg-action hover:bg-action-hover px-4 py-2 rounded-lg transition">
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            <Link href="/" className="block py-2 hover:text-accent">Home</Link>
            <Link href="/courses" className="block py-2 hover:text-accent">Courses</Link>
            <Link href="/about" className="block py-2 hover:text-accent">About</Link>
            <Link href="/contact" className="block py-2 hover:text-accent">Contact</Link>
            <Link href="/auth/login" className="block py-2 hover:text-accent">Login</Link>
            <Link href="/auth/register" className="block py-2 bg-action rounded-lg text-center">Get Started</Link>
          </nav>
        )}
      </div>
    </header>
  )
}
