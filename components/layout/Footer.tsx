import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Youtube, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-dark text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">TheraBrake Academy™</h3>
            <p className="text-neutral-medium mb-4">
              Pause, Process, Progress. Your trusted partner in mental health continuing education.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-medium hover:text-accent transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-medium hover:text-accent transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-medium hover:text-accent transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-medium hover:text-accent transition">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/courses/professional" className="text-neutral-medium hover:text-accent transition">
                  CE Courses
                </Link>
              </li>
              <li>
                <Link href="/courses/personal" className="text-neutral-medium hover:text-accent transition">
                  Personal Development
                </Link>
              </li>
              <li>
                <Link href="/courses/sowhat" className="text-neutral-medium hover:text-accent transition">
                  So What Mindset™
                </Link>
              </li>
              <li>
                <Link href="/courses/leap" className="text-neutral-medium hover:text-accent transition">
                  Leap & Launch™
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-neutral-medium hover:text-accent transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/instructors" className="text-neutral-medium hover:text-accent transition">
                  Become an Instructor
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-medium hover:text-accent transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-neutral-medium hover:text-accent transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-accent mt-0.5" />
                <span className="text-neutral-medium">
                  Beaumont, Texas, USA
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-accent" />
                <span className="text-neutral-medium">
                  1-800-THERAPY
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-accent" />
                <a href="mailto:support@therabrake.academy" className="text-neutral-medium hover:text-accent transition">
                  support@therabrake.academy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-medium/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-medium text-sm mb-4 md:mb-0">
              © {currentYear} TheraBrake Academy. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-neutral-medium hover:text-accent transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-neutral-medium hover:text-accent transition">
                Terms of Service
              </Link>
              <Link href="/compliance" className="text-neutral-medium hover:text-accent transition">
                CE Compliance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
