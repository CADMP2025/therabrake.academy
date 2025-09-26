'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-primary text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">TheraBrake Academy™</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-accent transition">
              Home
            </Link>
            <Link href="/courses" className="hover:text-accent transition">
              Courses
            </Link>
            <Link href="/pricing" className="hover:text-accent transition">
              Pricing
            </Link>
            <Link href="/about" className="hover:text-accent transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-accent transition">
              Contact
            </Link>
            <Link href="/auth/login" className="hover:text-accent transition">
              Login
            </Link>
            <Link 
              href="/auth/register"
              className="bg-action text-white px-4 py-2 rounded-lg hover:bg-action/90 transition"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-dark">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="py-2 hover:text-accent transition">
                Home
              </Link>
              <Link href="/courses" className="py-2 hover:text-accent transition">
                Courses
              </Link>
              <Link href="/pricing" className="py-2 hover:text-accent transition">
                Pricing
              </Link>
              <Link href="/about" className="py-2 hover:text-accent transition">
                About
              </Link>
              <Link href="/contact" className="py-2 hover:text-accent transition">
                Contact
              </Link>
              <div className="pt-4 border-t border-primary-dark">
                <Link href="/auth/login" className="block py-2 hover:text-accent transition">
                  Login
                </Link>
                <Link 
                  href="/auth/register"
                  className="block bg-action text-white px-4 py-2 rounded-lg hover:bg-action/90 transition text-center mt-2"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
