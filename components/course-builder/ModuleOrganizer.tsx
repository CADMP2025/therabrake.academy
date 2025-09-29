'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ChevronDown, ChevronRight, Plus, Trash,
  GripVertical, FileText, Video, Eye
} from 'lucide-react'
import type { CourseModule, Lesson } from '@/types/course-builder'

interface ModuleOrganizerProps {
  modules: CourseModule[]
  selectedModuleId: string | null
  selectedLessonId: string | null
  onSelectModule: (id: string) => void
  onSelectLesson: (id: string) => void
  onUpdateModule: (id: string, updates: Partial<CourseModule>) => void
  onDeleteModule: (id: string) => void
  onAddLesson: (moduleId: string) => void
  onDeleteLesson: (moduleId: string, lessonId: string) => void
  onReorderModules: (modules: CourseModule[]) => void
}

function SortableModule({
  module,
  isSelected,
  isExpanded,
  onToggle,
  onSelect,
  onDelete,
  onAddLesson,
  children
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-2 ${isDragging ? 'z-50' : ''}`}
    >
      <div
        className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
        } border`}
      >
        <button
          className="cursor-grab hover:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>
        
        <button onClick={onToggle} className="p-0">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        <div
          className="flex-1 text-left"
          onClick={onSelect}
        >
          <div className="font-medium">{module.title}</div>
          <div className="text-xs text-gray-500">
            {module.lessons.length} lessons
          </div>
        </div>
        
        {module.is_preview && (
          <Eye className="w-4 h-4 text-green-500" />
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddLesson()
          }}
          className="text-blue-500 hover:text-blue-600"
        >
          <Plus className="w-4 h-4" />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="text-red-500 hover:text-red-600"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
      
      {isExpanded && children}
    </div>
  )
}

export function ModuleOrganizer({
  modules,
  selectedModuleId,
  selectedLessonId,
  onSelectModule,
  onSelectLesson,
  onUpdateModule,
  onDeleteModule,
  onAddLesson,
  onDeleteLesson,
  onReorderModules
}: ModuleOrganizerProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(modules.map(m => m.id))
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = modules.findIndex(m => m.id === active.id)
      const newIndex = modules.findIndex(m => m.id === over.id)
      
      const newModules = arrayMove(modules, oldIndex, newIndex).map((m, i) => ({
        ...m,
        order_index: i
      }))
      
      onReorderModules(newModules)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={modules.map(m => m.id)}
        strategy={verticalListSortingStrategy}
      >
        <div>
          {modules.map((module) => (
            <SortableModule
              key={module.id}
              module={module}
              isSelected={selectedModuleId === module.id}
              isExpanded={expandedModules.has(module.id)}
              onToggle={() => toggleModule(module.id)}
              onSelect={() => onSelectModule(module.id)}
              onDelete={() => onDeleteModule(module.id)}
              onAddLesson={() => onAddLesson(module.id)}
            >
              <div className="ml-8 mt-2 space-y-1">
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.id)}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                      selectedLessonId === lesson.id
                        ? 'bg-blue-200'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {lesson.content_type === 'video' ? (
                      <Video className="w-4 h-4 text-gray-400" />
                    ) : (
                      <FileText className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="flex-1 text-sm">{lesson.title}</span>
                    {lesson.is_free && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        Free
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteLesson(module.id, lesson.id)
                      }}
                      className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </SortableModule>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}