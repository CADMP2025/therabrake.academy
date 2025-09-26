import Link from 'next/link'
import { BookOpen, Users, DollarSign, TrendingUp } from 'lucide-react'

export default function InstructorDashboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Instructor Dashboard</h1>
      
      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 text-secondary" />
            <span className="text-2xl font-bold">$2,450</span>
          </div>
          <p className="text-text-secondary">This Month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">156</span>
          </div>
          <p className="text-text-secondary">Active Students</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold">8</span>
          </div>
          <p className="text-text-secondary">Published Courses</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-action" />
            <span className="text-2xl font-bold">4.8</span>
          </div>
          <p className="text-text-secondary">Avg. Rating</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Course Management</h2>
          <div className="space-y-3">
            <Link href="/instructor/courses/new" className="block bg-primary text-white p-3 rounded-lg text-center hover:bg-primary-hover transition">
              Create New Course
            </Link>
            <Link href="/instructor/courses" className="block border border-primary text-primary p-3 rounded-lg text-center hover:bg-background-secondary transition">
              Manage Existing Courses
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Analytics</h2>
          <div className="space-y-3">
            <Link href="/instructor/analytics" className="block bg-secondary text-white p-3 rounded-lg text-center hover:bg-secondary-hover transition">
              View Analytics
            </Link>
            <Link href="/instructor/revenue" className="block border border-secondary text-secondary p-3 rounded-lg text-center hover:bg-background-secondary transition">
              Revenue Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
