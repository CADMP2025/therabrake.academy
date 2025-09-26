import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-heading font-bold text-xl">TheraBrake Academy</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Pause, Process, Progress - Your destination for continuing education in mental health.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/courses" className="hover:text-white">All Courses</Link></li>
              <li><Link href="/ce-credits" className="hover:text-white">CE Credits</Link></li>
              <li><Link href="/instructors" className="hover:text-white">Become an Instructor</Link></li>
              <li><Link href="/dashboard" className="hover:text-white">My Dashboard</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Texas LPC Info */}
          <div>
            <h3 className="font-semibold mb-4">Texas LPC Approved</h3>
            <p className="text-gray-400 text-sm mb-2">
              Our courses are approved by the Texas State Board of Examiners of Professional Counselors.
            </p>
            <p className="text-gray-400 text-sm">
              Provider #: Coming Soon
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 TheraBrake Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
