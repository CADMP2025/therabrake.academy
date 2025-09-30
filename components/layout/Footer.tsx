import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube, Award, Shield, Clock } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-text-primary to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/logo/logo.png"
                alt="TheraBrake Academy"
                width={40}
                height={40}
                className="brightness-0 invert"
              />
              <div>
                <h3 className="font-bold text-xl">TheraBrake</h3>
                <p className="text-xs text-gray-300 uppercase tracking-wider">Academy</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Professional development and CE credits for mental health professionals in Texas.
              Empowering therapists with knowledge and skills.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent rounded-full"></span>
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link href="/instructors" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent rounded-full"></span>
                  Become an Instructor
                </Link>
              </li>
              <li>
                <Link href="/programs/so-what-mindset" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent rounded-full"></span>
                  So What Mindset Program
                </Link>
              </li>
              <li>
                <Link href="/programs/leap-and-launch" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent rounded-full"></span>
                  Leap & Launch Program
                </Link>
              </li>
              <li>
                <Link href="/memberships" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent rounded-full"></span>
                  Annual Memberships
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-secondary" />
              Legal & Compliance
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-gray-300 hover:text-white transition-colors">
                  CE Compliance
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-gray-300 hover:text-white transition-colors">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-300 hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-action" />
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-300">Email Support</p>
                  <a href="mailto:support@therabrake.com" className="text-white hover:text-accent transition-colors">
                    support@therabrake.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-300">Phone Support</p>
                  <a href="tel:1-800-THERAPY" className="text-white hover:text-accent transition-colors">
                    1-800-THERAPY
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-300">Headquarters</p>
                  <p className="text-white">Austin, TX 78701</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-300">Support Hours</p>
                  <p className="text-white">Mon-Fri 9AM-6PM CST</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              <p className="text-sm text-gray-300">
                © {currentYear} TheraBrake Academy. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-secondary" />
                Texas Provider #CE-001
              </span>
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-accent" />
                NBCC Approved Provider
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
