import Link from 'next/link'
import { 
  CheckCircle, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award,
  DollarSign,
  BarChart3,
  Rocket,
  FileText,
  PlayCircle,
  Monitor,
  MessageCircle,
  ChevronRight,
  Star
} from 'lucide-react'

export default function BecomeInstructorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex justify-center mb-6">
            <Star className="w-12 h-12 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Become an Instructor at TheraBrake Academy™
          </h1>
          <p className="text-2xl text-blue-100 mb-8">
            Share Your Knowledge. Empower Lives. Grow With Us.
          </p>
          <p className="text-lg text-white max-w-3xl mx-auto mb-10">
            At TheraBrake Academy™, we believe that education transforms both the learner and the teacher. 
            If you're a mental health professional, educator, or subject matter expert ready to make an impact, 
            we invite you to join our growing community of instructors.
          </p>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-10">
            Whether you want to teach <strong className="text-white">accredited CEU courses for clinicians</strong> or{' '}
            <strong className="text-white">personal development programs for the public</strong>, 
            we provide the platform, tools, and support to help you succeed.
          </p>
        </div>
      </section>

      {/* Why Teach With Us Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Teach With Us?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "Dual Impact",
                description: "Reach licensed professionals seeking CE credits and individuals looking for personal growth."
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-green-600" />,
                title: "Built-In Audience",
                description: "Your course is showcased in our professional and personal development catalogs."
              },
              {
                icon: <BookOpen className="w-8 h-8 text-orange-600" />,
                title: "Cut & Paste Course Builder",
                description: "Easily upload content, videos, PDFs, and quizzes without coding."
              },
              {
                icon: <DollarSign className="w-8 h-8 text-green-600" />,
                title: "Fair Revenue Sharing",
                description: "Earn from every enrollment, with transparent payment through Stripe."
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
                title: "Instructor Dashboard",
                description: "Manage courses, track students, and view analytics from your own portal."
              },
              {
                icon: <Rocket className="w-8 h-8 text-orange-600" />,
                title: "Marketing Support",
                description: "We promote your courses through email campaigns, featured listings, and social media."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {feature.icon}
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Become an Instructor */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Who Can Become an Instructor?
          </h2>
          <p className="text-center text-lg mb-8 text-gray-700">We welcome:</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Licensed mental health professionals (LPC, LCSW, LMFT, Psychologists)",
              "Wellness practitioners (coaches, educators, trainers)",
              "Subject matter experts (finance, resilience, personal growth, relationships)",
              "Motivational speakers and thought leaders"
            ].map((item, index) => (
              <div key={index} className="flex items-start bg-white p-6 rounded-lg shadow-md">
                <Award className="w-6 h-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 p-8 bg-blue-50 rounded-lg max-w-3xl mx-auto">
            <p className="text-xl text-gray-800">
              If you have <strong className="text-blue-600">expertise + passion to teach</strong>, 
              we'll help you turn it into a course that inspires and earns.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Apply Online",
                description: "Fill out the instructor application with your background, credentials, and course idea."
              },
              {
                step: "2",
                title: "Get Approved",
                description: "Our team reviews for alignment with academy standards."
              },
              {
                step: "3",
                title: "Build Your Course",
                description: "Use our cut & paste builder to upload content, quizzes, and workbooks."
              },
              {
                step: "4",
                title: "Launch & Earn",
                description: "Once live, you'll start earning every time a student enrolls."
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start mb-8">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mr-6 flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 3 && (
                  <ChevronRight className="w-6 h-6 text-gray-400 mt-3 ml-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor Resources */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Instructor Resources
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FileText className="w-8 h-8 text-blue-600" />,
                emoji: "📘",
                title: "Instructor Handbook",
                description: "Step-by-step guide to creating your course."
              },
              {
                icon: <PlayCircle className="w-8 h-8 text-orange-600" />,
                emoji: "🎥",
                title: "Video Tutorials",
                description: "Walkthroughs on using the Course Builder and uploading materials."
              },
              {
                icon: <Monitor className="w-8 h-8 text-green-600" />,
                emoji: "💻",
                title: "Instructor Dashboard",
                description: "Track enrollments, student progress, and earnings."
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
                emoji: "📊",
                title: "Analytics & Reports",
                description: "See what's working and how your students are engaging."
              }
            ].map((resource, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">{resource.emoji}</div>
                <div className="flex justify-center mb-4">
                  {resource.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Quick Links
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { text: "Apply to Teach", href: "/instructor/apply", primary: true },
              { text: "Instructor FAQ", href: "/instructor/faq" },
              { text: "Instructor Dashboard (Login)", href: "/instructor" },
              { text: "Course Builder Tutorial", href: "/instructor/resources/tutorials" },
              { text: "Support for Instructors", href: "/contact" }
            ].map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`
                  flex items-center justify-between px-6 py-4 rounded-lg font-medium transition-all
                  ${link.primary 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }
                `}
              >
                {link.text}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <Rocket className="w-12 h-12 text-white animate-bounce" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to teach, inspire, and grow?
          </h2>
          <p className="text-xl text-green-100 mb-10">
            Join TheraBrake Academy™ as an instructor today and make your knowledge part of someone's progress.
          </p>
          <Link
            href="/instructor/apply"
            className="inline-flex items-center px-10 py-4 bg-white text-green-700 font-bold text-lg rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
          >
            <span className="mr-2">👉</span>
            Apply to Become an Instructor
            <ChevronRight className="w-6 h-6 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}