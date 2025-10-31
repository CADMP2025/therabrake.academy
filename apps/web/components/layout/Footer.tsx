import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">TheraBrake Academy™</h3>
            <p className="text-sm mb-4 opacity-90">
              Pause, Process, Progress<br />
              Professional CE Credits & Personal Growth
            </p>
            <address className="not-italic text-sm space-y-2 opacity-90">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  6120 College St. Suite D185<br />
                  Beaumont, TX 77707
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <a href="tel:+13462982988" className="hover:text-accent transition">
                  (346) 298-2988
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <a href="mailto:info@therabrake.academy" className="hover:text-accent transition">
                  info@therabrake.academy
                </a>
              </div>
            </address>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Link href="/courses" className="block text-sm hover:text-accent transition opacity-90">
                Browse Courses
              </Link>
              <Link href="/pricing" className="block text-sm hover:text-accent transition opacity-90">
                Pricing
              </Link>
              <Link href="/about" className="block text-sm hover:text-accent transition opacity-90">
                About Us
              </Link>
              <Link href="/contact" className="block text-sm hover:text-accent transition opacity-90">
                Contact
              </Link>
              <Link href="/support" className="block text-sm hover:text-accent transition opacity-90">
                Support
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <nav className="space-y-2">
              <Link href="/terms" className="block text-sm hover:text-accent transition opacity-90">
                Terms of Use
              </Link>
              <Link href="/privacy" className="block text-sm hover:text-accent transition opacity-90">
                Privacy Policy
              </Link>
              <Link href="/refund-policy" className="block text-sm hover:text-accent transition opacity-90">
                Refund Policy
              </Link>
            </nav>
          </div>

          {/* Professional */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Professional</h4>
            <nav className="space-y-2">
              <Link href="/tx-lpc-approved" className="block text-sm hover:text-accent transition opacity-90">
                TX LPC Approved
              </Link>
              <Link href="/become-instructor" className="block text-sm hover:text-accent transition opacity-90">
                Become Instructor
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-dark text-center">
          <p className="text-sm opacity-75">
            © {currentYear} TheraBrake Academy™. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
