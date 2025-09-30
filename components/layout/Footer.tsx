'use client'

import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <span className="text-primary">Thera</span>
              <span className="text-accent">Brake</span>
            </h3>
            <p className="text-gray-300 text-sm">
              Professional CE courses for mental health practitioners in Texas. 
              Elevate your practice with evidence-based training.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-accent">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link href="/instructor/course-builder" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Course Builder
                </Link>
              </li>
              <li>
                <Link href="/become-instructor" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Become an Instructor
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/tx-lpc-approved" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  TX LPC Approved
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-accent">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/support" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-accent">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">support@therabrake.academy</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">1-800-THERAPY</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Austin, Texas</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs text-gray-300">
                Texas BHEC Provider #1234<br/>
                NBCC Approved Provider
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} TheraBrake Academy. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs mt-2 md:mt-0">
              Built with ❤️ for Mental Health Professionals
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
