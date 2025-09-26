import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-text-primary text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold">🧠</span>
              <span className="text-xl font-bold">TheraBrake</span>
            </div>
            <p className="text-gray-300 mb-4">
              Texas' Premier Mental Health Education Platform
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-gray-300 hover:text-white transition">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/instructors" className="text-gray-300 hover:text-white transition">
                  Become an Instructor
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Course Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses/professional" className="text-gray-300 hover:text-white transition">
                  Professional CE Credits
                </Link>
              </li>
              <li>
                <Link href="/courses/personal" className="text-gray-300 hover:text-white transition">
                  Personal Growth
                </Link>
              </li>
              <li>
                <Link href="/courses/premium/so-what" className="text-gray-300 hover:text-white transition">
                  So What Mindset
                </Link>
              </li>
              <li>
                <Link href="/courses/premium/leap-launch" className="text-gray-300 hover:text-white transition">
                  Leap & Launch
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-accent" />
                <span className="text-gray-300">
                  Austin, Texas
                </span>
              </li>
              <li>
                <a href="mailto:support@therabrake.academy" className="flex items-center text-gray-300 hover:text-white transition">
                  <Mail className="h-5 w-5 mr-2 text-accent" />
                  support@therabrake.academy
                </a>
              </li>
              <li>
                <a href="tel:+15125551234" className="flex items-center text-gray-300 hover:text-white transition">
                  <Phone className="h-5 w-5 mr-2 text-accent" />
                  (512) 555-1234
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 TheraBrake Academy. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition">
                Terms of Service
              </Link>
              <Link href="/compliance" className="text-gray-400 hover:text-white text-sm transition">
                Texas LPC Compliance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
