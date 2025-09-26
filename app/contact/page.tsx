import Link from 'next/link'
import { Mail, Phone, MapPin, Sparkles, Send, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | TheraBrake Academy™',
  description: 'Let\'s Connect & Move Forward Together. Every question, every story, and every step forward matters at TheraBrake Academy™.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center">
              Let&apos;s Connect & Move Forward Together <Sparkles className="ml-3 h-8 w-8" />
            </h1>
            <p className="text-xl leading-relaxed opacity-95">
              At <span className="font-semibold">TheraBrake Academy™</span>, every question, every story, 
              and every step forward matters. Whether you&apos;re a professional seeking guidance on CEU courses, 
              an individual starting your journey of healing, or simply curious about how we can support your 
              growth—<span className="font-semibold">we&apos;re here to listen and respond with care</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Message Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
              <div className="text-center mb-8">
                <Send className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  📩 Reach out to us anytime
                </h2>
                <p className="text-lg text-text-secondary">
                  Your message isn&apos;t just an inquiry—it&apos;s the beginning of progress.
                </p>
                <p className="text-lg text-text-secondary mt-2">
                  Together, let&apos;s turn challenges into opportunities and take the next step toward your goals.
                </p>
              </div>

              {/* Contact Methods Grid - Now 2 columns */}
              <div className="grid md:grid-cols-2 gap-6 mt-12">
                {/* Email */}
                <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl hover:shadow-lg transition-all duration-300">
                  <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                  <a 
                    href="mailto:info@therabrake.academy" 
                    className="text-primary hover:text-primary-hover transition font-medium"
                  >
                    info@therabrake.academy
                  </a>
                </div>

                {/* Phone */}
                <div className="text-center p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl hover:shadow-lg transition-all duration-300">
                  <Phone className="h-10 w-10 text-secondary mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                  <a 
                    href="tel:+13462982988" 
                    className="text-secondary hover:text-secondary-hover transition font-medium"
                  >
                    (346) 298-2988
                  </a>
                  <p className="text-sm text-text-secondary mt-1">Monday-Friday, 9AM-6PM CST</p>
                </div>
              </div>

              {/* Mailing Address - Separate Section */}
              <div className="mt-8 text-center p-6 bg-gray-50 rounded-xl">
                <MapPin className="h-8 w-8 text-action mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Mailing Address</h3>
                <address className="not-italic text-text-secondary">
                  6120 College St. Suite D185<br />
                  Beaumont, TX 77707
                </address>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-center mb-8">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition"
                    required
                  >
                    <option value="">Select a topic...</option>
                    <option value="ceu-courses">CEU Courses Information</option>
                    <option value="personal-development">Personal Development Programs</option>
                    <option value="premium-programs">Premium Programs (So What Mindset / Leap & Launch)</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="other">Other Inquiries</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-action hover:bg-action-hover text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center"
                  >
                    Send Message <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Additional Info Cards */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6">
                <h3 className="font-bold text-xl mb-3">Office Hours</h3>
                <div className="space-y-2 text-text-secondary">
                  <p><span className="font-medium">Monday - Friday:</span> 9:00 AM - 6:00 PM CST</p>
                  <p><span className="font-medium">Saturday:</span> 10:00 AM - 2:00 PM CST</p>
                  <p><span className="font-medium">Sunday:</span> Closed</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl p-6">
                <h3 className="font-bold text-xl mb-3">Response Time</h3>
                <p className="text-text-secondary">
                  We typically respond to all inquiries within 24-48 business hours. 
                  For urgent matters related to course access or technical issues, 
                  please call us directly during office hours.
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-12 text-center">
              <h3 className="font-bold text-xl mb-4">Quick Links</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/courses" 
                  className="text-primary hover:text-primary-hover font-medium transition"
                >
                  Browse Courses
                </Link>
                <span className="text-gray-400">•</span>
                <Link 
                  href="/about" 
                  className="text-primary hover:text-primary-hover font-medium transition"
                >
                  About Us
                </Link>
                <span className="text-gray-400">•</span>
                <Link 
                  href="/auth/register" 
                  className="text-primary hover:text-primary-hover font-medium transition"
                >
                  Get Started
                </Link>
                <span className="text-gray-400">•</span>
                <Link 
                  href="/dashboard" 
                  className="text-primary hover:text-primary-hover font-medium transition"
                >
                  Student Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
