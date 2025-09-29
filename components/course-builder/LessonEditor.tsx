'use client'

import { FileText, Video, FileImage, PlusCircle, Trash } from 'lucide-react'
import type { Lesson, Resource } from '@/types/course-builder'

interface LessonEditorProps {
  lesson: Lesson
  onUpdate: (updates: Partial<Lesson>) => void
  onDelete: () => void
}

export function LessonEditor({ lesson, onUpdate, onDelete }: LessonEditorProps) {
  const addResource = () => {
    const newResource: Resource = {
      id: `resource-${Date.now()}`,
      title: 'New Resource',
      file_url: '',
      file_type: 'pdf'
    }
    
    onUpdate({
      resources: [...(lesson.resources || []), newResource]
    })
  }

  const updateResource = (resourceId: string, updates: Partial<Resource>) => {
    onUpdate({
      resources: lesson.resources?.map(r =>
        r.id === resourceId ? { ...r, ...updates } : r
      )
    })
  }

  const deleteResource = (resourceId: string) => {
    onUpdate({
      resources: lesson.resources?.filter(r => r.id !== resourceId)
    })
  }

  return (
    <div className="p-4 bg-white rounded-lg border">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Lesson Title</label>
        <input
          type="text"
          value={lesson.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Content Type</label>
        <select
          value={lesson.content_type}
          onChange={(e) => onUpdate({ content_type: e.target.value as Lesson['content_type'] })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="text">Text Content</option>
          <option value="video">Video</option>
          <option value="pdf">PDF Document</option>
          <option value="quiz">Quiz</option>
          <option value="assignment">Assignment</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Duration (minutes)
        </label>
        <input
          type="number"
          value={lesson.duration}
          onChange={(e) => onUpdate({ duration: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={lesson.is_free}
            onChange={(e) => onUpdate({ is_free: e.target.checked })}
            className="rounded text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm font-medium">Free Preview Lesson</span>
        </label>
      </div>

      {/* Resources Section */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Lesson Resources</h3>
          <button
            onClick={addResource}
            className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Add Resource
          </button>
        </div>

        {lesson.resources && lesson.resources.length > 0 ? (
          <div className="space-y-2">
            {lesson.resources.map((resource) => (
              <div key={resource.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                {resource.file_type === 'pdf' && <FileText className="w-4 h-4 text-red-500" />}
                {resource.file_type === 'video' && <Video className="w-4 h-4 text-blue-500" />}
                {resource.file_type === 'image' && <FileImage className="w-4 h-4 text-green-500" />}
                
                <input
                  type="text"
                  value={resource.title}
                  onChange={(e) => updateResource(resource.id, { title: e.target.value })}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                  placeholder="Resource title"
                />
                
                <button
                  onClick={() => deleteResource(resource.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No resources added yet</p>
        )}
      </div>
    </div>
  )
}