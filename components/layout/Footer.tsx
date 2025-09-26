import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-text-primary text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              TheraBrake <span className="text-accent">Academy™</span>
            </h3>
            <p className="text-gray-300">Pause, Process, Progress</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/courses/professional" className="text-gray-300 hover:text-accent">CE Courses</Link></li>
              <li><Link href="/courses/personal" className="text-gray-300 hover:text-accent">Personal Development</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-accent">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-accent">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/auth/login" className="text-gray-300 hover:text-accent">Student Login</Link></li>
              <li><Link href="/instructor/login" className="text-gray-300 hover:text-accent">Instructor Portal</Link></li>
              <li><Link href="/help" className="text-gray-300 hover:text-accent">Help Center</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-accent">Terms & Privacy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2">
              <p className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                info@therabrake.academy
              </p>
              <p className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2" />
                1-800-THERAPY
              </p>
              <p className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-2" />
                6120 College St. Suite D185<br />
                Beaumont, TX 77707
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 TheraBrake Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
