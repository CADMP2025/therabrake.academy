'use client'

import { useState, useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import { Highlight } from '@tiptap/extension-highlight'
import { CodeBlock } from '@tiptap/extension-code-block'
import { Youtube } from '@tiptap/extension-youtube'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { useDebouncedCallback } from 'use-debounce'
import DOMPurify from 'dompurify'
import { 
  Save, Eye, Plus, Trash, Copy, ClipboardPaste,
  GripVertical, ChevronDown, ChevronRight, FileText,
  Video, Image as ImageIcon, X, Settings
} from 'lucide-react'
import { ModuleOrganizer } from './ModuleOrganizer'
import { ContentParser } from './ContentParser'
import { PreviewPanel } from './PreviewPanel'
import type { CourseModule, Lesson } from '@/types/course-builder'

interface CourseBuilderProps {
  courseId?: string
  initialData?: {
    title?: string
    description?: string
    modules?: CourseModule[]
  }
  onSave?: (data: any) => void
}

export function CourseBuilder({ 
  courseId, 
  initialData, 
  onSave 
}: CourseBuilderProps) {
  // State Management
  const [courseTitle, setCourseTitle] = useState(initialData?.title || '')
  const [courseDescription, setCourseDescription] = useState(initialData?.description || '')
  const [modules, setModules] = useState<CourseModule[]>(initialData?.modules || [])
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [showPasteModal, setShowPasteModal] = useState(false)
  const [pastedContent, setPastedContent] = useState('')
  const [saving, setSaving] = useState(false)

  // Get current selections
  const selectedModule = modules.find(m => m.id === selectedModuleId)
  const selectedLesson = selectedModule?.lessons.find(l => l.id === selectedLessonId)

  // TipTap Editor Configuration
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] }
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-600'
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      CodeBlock,
      Youtube.configure({
        width: 640,
        height: 480
      }),
      Color,
      TextStyle
    ],
    content: selectedLesson?.content || '',
    onUpdate: ({ editor }) => {
      if (selectedLessonId) {
        updateLessonContent(selectedLessonId, editor.getHTML())
      }
    }
  })

  // Update editor content when selection changes
  useEffect(() => {
    if (editor && selectedLesson) {
      editor.commands.setContent(selectedLesson.content || '')
    }
  }, [selectedLessonId, editor])

  // Auto-save functionality
  const debouncedSave = useDebouncedCallback(
    async () => {
      if (onSave) {
        setSaving(true)
        await onSave({
          title: courseTitle,
          description: courseDescription,
          modules
        })
        setTimeout(() => setSaving(false), 1000)
      }
    },
    2000
  )

  // Trigger auto-save on changes
  useEffect(() => {
    debouncedSave()
  }, [modules, courseTitle, courseDescription])

  // Module Management Functions
  const addModule = () => {
    const newModule: CourseModule = {
      id: `module-${Date.now()}`,
      title: `Module ${modules.length + 1}`,
      description: '',
      order_index: modules.length,
      lessons: [],
      is_preview: false,
      estimated_duration: 0
    }
    setModules([...modules, newModule])
    setSelectedModuleId(newModule.id)
  }

  const updateModule = (moduleId: string, updates: Partial<CourseModule>) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, ...updates } : m
    ))
  }

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId))
    if (selectedModuleId === moduleId) {
      setSelectedModuleId(null)
      setSelectedLessonId(null)
    }
  }

  // Lesson Management Functions
  const addLesson = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId)
    if (!module) return

    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: `Lesson ${module.lessons.length + 1}`,
      content_type: 'text',
      content: '',
      duration: 0,
      order_index: module.lessons.length,
      is_free: false
    }

    updateModule(moduleId, {
      lessons: [...module.lessons, newLesson]
    })
    setSelectedLessonId(newLesson.id)
  }

  const updateLessonContent = (lessonId: string, content: string) => {
    setModules(modules.map(module => ({
      ...module,
      lessons: module.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, content } : lesson
      )
    })))
  }

  const deleteLesson = (moduleId: string, lessonId: string) => {
    const module = modules.find(m => m.id === moduleId)
    if (!module) return

    updateModule(moduleId, {
      lessons: module.lessons.filter(l => l.id !== lessonId)
    })

    if (selectedLessonId === lessonId) {
      setSelectedLessonId(null)
    }
  }

  // Handle Paste Content
  const handlePasteContent = () => {
    const cleanContent = DOMPurify.sanitize(pastedContent)
    const parsedModules = ContentParser.parse(cleanContent)
    
    setModules([...modules, ...parsedModules])
    setShowPasteModal(false)
    setPastedContent('')
  }

  return (
    <div className="h-full bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="Course Title"
              className="text-2xl font-bold w-full border-0 focus:outline-none focus:ring-0 px-0"
            />
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              placeholder="Course Description"
              className="mt-2 w-full border-0 focus:outline-none focus:ring-0 px-0 resize-none text-gray-600"
              rows={2}
            />
          </div>
          
          <div className="flex items-center gap-3">
            {saving && (
              <span className="text-sm text-green-600 flex items-center">
                <Save className="w-4 h-4 mr-1" />
                Saving...
              </span>
            )}
            
            <button
              onClick={() => setShowPasteModal(true)}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 flex items-center gap-2"
            >
              <ClipboardPaste className="w-4 h-4" />
              Paste Content
            </button>
            
            <button
              onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              {mode === 'edit' ? (
                <>
                  <Eye className="w-4 h-4" />
                  Preview
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Edit
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Sidebar - Module/Lesson List */}
        <div className="w-80 border-r bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Course Structure</h3>
              <button
                onClick={addModule}
                className="text-blue-500 hover:text-blue-600"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <ModuleOrganizer
              modules={modules}
              selectedModuleId={selectedModuleId}
              selectedLessonId={selectedLessonId}
              onSelectModule={setSelectedModuleId}
              onSelectLesson={setSelectedLessonId}
              onUpdateModule={updateModule}
              onDeleteModule={deleteModule}
              onAddLesson={addLesson}
              onDeleteLesson={deleteLesson}
              onReorderModules={setModules}
            />
          </div>
        </div>

        {/* Editor/Preview Area */}
        <div className="flex-1 overflow-y-auto">
          {mode === 'edit' ? (
            <div className="h-full">
              {selectedLessonId && editor ? (
                <div className="h-full flex flex-col">
                  {/* Editor Toolbar */}
                  <div className="border-b p-3 bg-gray-50">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`px-3 py-1 rounded ${
                          editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white'
                        }`}
                      >
                        Bold
                      </button>
                      <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`px-3 py-1 rounded ${
                          editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white'
                        }`}
                      >
                        Italic
                      </button>
                      <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`px-3 py-1 rounded ${
                          editor.isActive('underline') ? 'bg-blue-500 text-white' : 'bg-white'
                        }`}
                      >
                        Underline
                      </button>
                      <select
                        onChange={(e) => {
                          const level = parseInt(e.target.value)
                          if (level === 0) {
                            editor.chain().focus().setParagraph().run()
                          } else {
                            editor.chain().focus().toggleHeading({ level: level as any }).run()
                          }
                        }}
                        className="px-3 py-1 rounded border"
                        value={
                          editor.isActive('heading', { level: 1 }) ? 1 :
                          editor.isActive('heading', { level: 2 }) ? 2 :
                          editor.isActive('heading', { level: 3 }) ? 3 : 0
                        }
                      >
                        <option value="0">Paragraph</option>
                        <option value="1">Heading 1</option>
                        <option value="2">Heading 2</option>
                        <option value="3">Heading 3</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Editor Content */}
                  <div className="flex-1 p-6">
                    <EditorContent 
                      editor={editor} 
                      className="prose prose-lg max-w-none min-h-full focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Select a lesson to edit</p>
                    <p className="text-sm mt-2">Or paste content to auto-generate structure</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <PreviewPanel 
              modules={modules}
              courseTitle={courseTitle}
              courseDescription={courseDescription}
            />
          )}
        </div>
      </div>

      {/* Paste Content Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Paste Course Content</h2>
              <button
                onClick={() => setShowPasteModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Paste your content from Word, Google Docs, or any text editor. 
                The system will automatically detect modules and lessons based on formatting.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                <strong>Tip:</strong> Use Heading 1 for modules, Heading 2 for lessons
              </div>
            </div>
            
            <textarea
              value={pastedContent}
              onChange={(e) => setPastedContent(e.target.value)}
              placeholder="Paste your content here..."
              className="w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowPasteModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePasteContent}
                disabled={!pastedContent.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
