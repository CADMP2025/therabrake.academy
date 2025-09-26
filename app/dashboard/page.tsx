import Link from 'next/link'
import { BookOpen, Award, Clock, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Welcome Back, Student!</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">3</span>
          </div>
          <p className="text-text-secondary">Active Courses</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <Award className="h-8 w-8 text-secondary" />
            <span className="text-2xl font-bold">12</span>
          </div>
          <p className="text-text-secondary">CE Credits Earned</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold">24</span>
          </div>
          <p className="text-text-secondary">Hours Completed</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-action" />
            <span className="text-2xl font-bold">85%</span>
          </div>
          <p className="text-text-secondary">Avg. Quiz Score</p>
        </div>
      </div>

      {/* Current Courses */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Ethics for Professional Counselors</h3>
              <span className="text-sm text-text-secondary">65% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div className="bg-primary h-2 rounded-full" style={{width: '65%'}}></div>
            </div>
            <Link href="/dashboard/course/1" className="text-primary hover:text-primary-hover font-semibold">
              Continue →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/courses" className="bg-primary text-white p-6 rounded-lg text-center hover:bg-primary-hover transition">
          <BookOpen className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">Browse Courses</p>
        </Link>
        
        <Link href="/dashboard/certificates" className="bg-secondary text-white p-6 rounded-lg text-center hover:bg-secondary-hover transition">
          <Award className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">My Certificates</p>
        </Link>
        
        <Link href="/dashboard/profile" className="bg-action text-white p-6 rounded-lg text-center hover:bg-action-hover transition">
          <TrendingUp className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">View Progress</p>
        </Link>
      </div>
    </div>
  )
}
