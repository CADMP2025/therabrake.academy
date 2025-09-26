'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown, User } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false)

  const courseCategories = [
    { name: 'Professional Development', href: '/courses/professional' },
    { name: 'Personal Growth', href: '/courses/personal' },
    { name: 'Premium Programs', href: '/courses/premium' },
  ]

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">🧠</span>
            <span className="text-xl font-bold">TheraBrake</span>
            <span className="text-accent font-semibold">Academy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-accent transition">
              Home
            </Link>
            
            {/* Courses Dropdown */}
            <div className="relative">
              <button
                className="flex items-center hover:text-accent transition"
                onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                onMouseEnter={() => setCoursesDropdownOpen(true)}
                onMouseLeave={() => setCoursesDropdownOpen(false)}
              >
                Courses
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {coursesDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 bg-white text-text-primary rounded-lg shadow-xl py-2"
                  onMouseEnter={() => setCoursesDropdownOpen(true)}
                  onMouseLeave={() => setCoursesDropdownOpen(false)}
                >
                  <Link href="/courses" className="block px-4 py-2 hover:bg-background-secondary">
                    All Courses
                  </Link>
                  {courseCategories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="block px-4 py-2 hover:bg-background-secondary"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className="hover:text-accent transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-accent transition">
              Contact
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login" className="hover:text-accent transition">
              Login
            </Link>
            <Link 
              href="/auth/register"
              className="bg-accent text-primary px-4 py-2 rounded-lg hover:bg-accent-light transition"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
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
                All Courses
              </Link>
              {courseCategories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="py-2 pl-4 hover:text-accent transition"
                >
                  {category.name}
                </Link>
              ))}
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
                  className="block bg-accent text-primary px-4 py-2 rounded-lg hover:bg-accent-light transition text-center mt-2"
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
