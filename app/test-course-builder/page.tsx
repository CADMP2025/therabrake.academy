'use client'

import { CourseBuilder } from '@/components/course-builder'
import { useState } from 'react'

export default function TestCourseBuilder() {
  const [savedData, setSavedData] = useState<any>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-yellow-900">⚠️ Development Test Route</h2>
          <p className="text-sm text-yellow-700 mt-1">
            This is a test route for course builder development. Remove before production.
          </p>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Course Builder Test Environment</h1>
        
        <CourseBuilder
          onSave={(data) => {
            console.log('Course data saved:', data)
            setSavedData(data)
          }}
        />
        
        {savedData && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Saved Data Preview:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(savedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}