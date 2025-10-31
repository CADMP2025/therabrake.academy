'use client'

import { Clock, Users, Award, CheckCircle } from 'lucide-react'
import type { CourseModule } from '@/types/course-builder'

interface PreviewPanelProps {
  modules: CourseModule[]
  courseTitle: string
  courseDescription: string
}

export function PreviewPanel({ 
  modules, 
  courseTitle, 
  courseDescription 
}: PreviewPanelProps) {
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const estimatedHours = Math.ceil(totalLessons * 0.5) // Estimate 30 min per lesson
  
  return (
    <div className="p-6">
      {/* Course Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{courseTitle || 'Untitled Course'}</h1>
        <p className="text-gray-600 text-lg mb-6">
          {courseDescription || 'No description provided'}
        </p>
        
        {/* Course Stats */}
        <div className="flex gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{estimatedHours} hours</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>{estimatedHours} CE Credits</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{totalLessons} lessons</span>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Course Content</h2>
        
        {modules.map((module, moduleIndex) => (
          <div key={module.id} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Module {moduleIndex + 1}: {module.title}
                </h3>
                <span className="text-sm text-gray-500">
                  {module.lessons.length} lessons
                </span>
              </div>
              {module.description && (
                <p className="text-sm text-gray-600 mt-2">{module.description}</p>
              )}
            </div>
            
            <div className="divide-y">
              {module.lessons.map((lesson, lessonIndex) => (
                <div key={lesson.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-gray-300" />
                      <span>
                        {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {lesson.is_free && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Preview
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {lesson.duration || 15} min
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}