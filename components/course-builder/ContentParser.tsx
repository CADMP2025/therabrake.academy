import { CourseModule, Lesson } from '@/types/course-builder'
import DOMPurify from 'dompurify'

export class ContentParser {
  static parse(html: string): CourseModule[] {
    const cleanHtml = DOMPurify.sanitize(html)
    const parser = new DOMParser()
    const doc = parser.parseFromString(cleanHtml, 'text/html')
    
    const modules: CourseModule[] = []
    let currentModule: CourseModule | null = null
    let moduleIndex = 0
    let lessonIndex = 0

    // Walk through all elements
    const elements = doc.body.querySelectorAll('*')
    
    elements.forEach((element) => {
      const tagName = element.tagName.toLowerCase()
      const text = element.textContent?.trim() || ''
      
      if (!text) return
      
      // Detect modules (H1 or strong patterns)
      if (tagName === 'h1' || 
          (tagName === 'p' && text.match(/^(module|section|chapter|unit)\s+\d+/i))) {
        
        if (currentModule) {
          modules.push(currentModule)
        }
        
        currentModule = {
          id: `module-${Date.now()}-${moduleIndex++}`,
          title: text.replace(/^(module|section|chapter|unit)\s+\d+:\s*/i, ''),
          description: '',
          order_index: moduleIndex,
          lessons: [],
          is_preview: false,
          estimated_duration: 0
        }
        lessonIndex = 0
      }
      // Detect lessons (H2 or numbered patterns)
      else if (currentModule && 
               (tagName === 'h2' || 
                (tagName === 'p' && text.match(/^(lesson|topic|chapter)\s+\d+/i)) ||
                (tagName === 'p' && text.match(/^\d+\.\s+/)))) {
        
        const lesson: Lesson = {
          id: `lesson-${Date.now()}-${lessonIndex++}`,
          title: text.replace(/^(lesson|topic)\s+\d+:\s*/i, '')
                     .replace(/^\d+\.\s+/, ''),
          content_type: 'text',
          content: '',
          duration: 0,
          order_index: lessonIndex,
          is_free: false
        }
        currentModule.lessons.push(lesson)
      }
      // Add content to current lesson
      else if (currentModule && currentModule.lessons.length > 0) {
        const currentLesson = currentModule.lessons[currentModule.lessons.length - 1]
        currentLesson.content += element.outerHTML
      }
      // Add to module description if no lessons yet
      else if (currentModule) {
        currentModule.description += element.outerHTML
      }
    })
    
    // Don't forget the last module
    if (currentModule) {
      modules.push(currentModule)
    }
    
    // If no structure detected, create a single module with content
    if (modules.length === 0) {
      modules.push({
        id: `module-${Date.now()}`,
        title: 'Module 1',
        description: cleanHtml.substring(0, 200),
        order_index: 0,
        lessons: [{
          id: `lesson-${Date.now()}`,
          title: 'Lesson 1',
          content_type: 'text',
          content: cleanHtml,
          duration: 0,
          order_index: 0,
          is_free: false
        }],
        is_preview: false,
        estimated_duration: 0
      })
    }
    
    return modules
  }
}