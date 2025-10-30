import { CourseModule, Lesson } from '@/types/course-builder'
import DOMPurify from 'dompurify'

export interface ParseOptions {
  onImageFound?: (src: string, element: HTMLImageElement) => Promise<string>
  preserveTables?: boolean
  preserveLists?: boolean
  cleanWordFormatting?: boolean
  cleanGoogleDocsFormatting?: boolean
}

export class ContentParser {
  /**
   * Parse HTML content into structured course modules
   * Enhanced to handle Word and Google Docs formatting
   */
  static async parse(
    html: string,
    options: ParseOptions = {}
  ): Promise<CourseModule[]> {
    const {
      onImageFound,
      preserveTables = true,
      preserveLists = true,
      cleanWordFormatting = true,
      cleanGoogleDocsFormatting = true
    } = options

    // Clean and prepare HTML
    let cleanHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'strong', 'b', 'em', 'i', 'u', 'strike', 's',
        'ul', 'ol', 'li',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'a', 'img',
        'blockquote', 'pre', 'code'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'style', 'class']
    })

    // Clean Word-specific formatting
    if (cleanWordFormatting) {
      cleanHtml = this.cleanWordHTML(cleanHtml)
    }

    // Clean Google Docs-specific formatting
    if (cleanGoogleDocsFormatting) {
      cleanHtml = this.cleanGoogleDocsHTML(cleanHtml)
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(cleanHtml, 'text/html')

    // Process images if handler provided
    if (onImageFound) {
      await this.processImages(doc, onImageFound)
    }

    // Preserve table formatting
    if (preserveTables) {
      this.preserveTableFormatting(doc)
    }

    // Preserve list formatting
    if (preserveLists) {
      this.preserveListFormatting(doc)
    }

    return this.extractModules(doc)
  }

  /**
   * Clean Word HTML formatting
   */
  private static cleanWordHTML(html: string): string {
    return html
      // Remove Word-specific classes
      .replace(/class="?Mso[a-zA-Z0-9]*"?/gi, '')
      // Remove Word-specific styles
      .replace(/style="[^"]*mso-[^"]*"/gi, '')
      // Remove conditional comments
      .replace(/<!--\[if[^\]]*\]>[\s\S]*?<!\[endif\]-->/gi, '')
      // Remove Word XML namespace declarations
      .replace(/<\?xml[^>]*>/gi, '')
      // Remove empty spans
      .replace(/<span[^>]*>\s*<\/span>/gi, '')
      // Remove Word list numbering
      .replace(/<p[^>]*class="?MsoListParagraph"?[^>]*>/gi, '<li>')
      // Remove excessive line breaks from Word
      .replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim()
  }

  /**
   * Clean Google Docs HTML formatting
   */
  private static cleanGoogleDocsHTML(html: string): string {
    return html
      // Remove Google Docs IDs
      .replace(/id="?docs-internal-guid-[^"]*"?/gi, '')
      // Remove Google Docs specific styles
      .replace(/style="[^"]*-docs-[^"]*"/gi, '')
      // Remove b tags with normal weight (Google Docs quirk)
      .replace(/<b\s+style="font-weight:\s*normal;?"[^>]*>/gi, '')
      .replace(/<\/b>/gi, '')
      // Convert Google Docs spans to proper formatting
      .replace(/<span\s+style="font-weight:\s*700;?"[^>]*>/gi, '<strong>')
      .replace(/<span\s+style="font-style:\s*italic;?"[^>]*>/gi, '<em>')
      // Remove empty spans
      .replace(/<span[^>]*>\s*<\/span>/gi, '')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim()
  }

  /**
   * Process and upload images found in content
   */
  private static async processImages(
    doc: Document,
    onImageFound: (src: string, element: HTMLImageElement) => Promise<string>
  ): Promise<void> {
    const images = doc.querySelectorAll('img')
    
    for (const img of Array.from(images)) {
      try {
        const src = img.getAttribute('src')
        if (!src) continue

        // Skip if already an absolute URL
        if (src.startsWith('http://') || src.startsWith('https://')) {
          continue
        }

        // Process data URLs or relative paths
        const newSrc = await onImageFound(src, img)
        img.setAttribute('src', newSrc)
      } catch (error) {
        console.error('Failed to process image:', error)
        // Remove image if upload fails
        img.remove()
      }
    }
  }

  /**
   * Preserve table formatting during parsing
   */
  private static preserveTableFormatting(doc: Document): void {
    const tables = doc.querySelectorAll('table')
    
    tables.forEach(table => {
      // Ensure table has proper structure
      if (!table.querySelector('thead') && table.querySelector('tr')) {
        const firstRow = table.querySelector('tr')
        if (firstRow) {
          const thead = doc.createElement('thead')
          thead.appendChild(firstRow.cloneNode(true))
          table.insertBefore(thead, table.firstChild)
        }
      }

      // Add basic styling attributes for TipTap
      table.setAttribute('data-table', 'true')
    })
  }

  /**
   * Preserve list formatting during parsing
   */
  private static preserveListFormatting(doc: Document): void {
    const lists = doc.querySelectorAll('ul, ol')
    
    lists.forEach(list => {
      // Ensure all list items are properly structured
      const items = list.querySelectorAll('li')
      items.forEach((item, index) => {
        if (!item.textContent?.trim()) {
          item.remove()
        } else {
          item.setAttribute('data-list-item', 'true')
        }
      })

      // Mark list for preservation
      list.setAttribute('data-list', list.tagName.toLowerCase())
    })
  }

  /**
   * Extract modules and lessons from document
   */
  private static extractModules(doc: Document): CourseModule[] {
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
          this.isModuleHeading(element, text)) {
        
        if (currentModule) {
          modules.push(currentModule)
        }
        
        currentModule = {
          id: `module-${Date.now()}-${moduleIndex++}`,
          title: this.cleanTitle(text, /^(module|section|chapter|unit)\s+\d+:\s*/i),
          description: '',
          order_index: moduleIndex,
          lessons: [],
          is_preview: false,
          estimated_duration: 0
        }
        lessonIndex = 0
      }
      // Detect lessons (H2 or numbered patterns)
      else if (currentModule && this.isLessonHeading(element, text, tagName)) {
        
        const lesson: Lesson = {
          id: `lesson-${Date.now()}-${lessonIndex++}`,
          title: this.cleanTitle(text, /^(lesson|topic|chapter)\s+\d+:\s*/i)
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
        currentLesson.content += element.outerHTML + '\n'
      }
      // Add to module description if no lessons yet
      else if (currentModule) {
        currentModule.description += element.outerHTML + '\n'
      }
    })
    
    // Don't forget the last module
    if (currentModule) {
      modules.push(currentModule)
    }
    
    // If no structure detected, create a single module with content
    if (modules.length === 0) {
      const bodyHTML = doc.body.innerHTML
      modules.push({
        id: `module-${Date.now()}`,
        title: 'Module 1',
        description: this.getFirstParagraph(doc) || 'Imported content',
        order_index: 0,
        lessons: [{
          id: `lesson-${Date.now()}`,
          title: 'Lesson 1',
          content_type: 'text',
          content: bodyHTML,
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

  /**
   * Check if element is a module heading
   */
  private static isModuleHeading(element: Element, text: string): boolean {
    const tagName = element.tagName.toLowerCase()
    
    // Check for Word/Google Docs heading styles
    const style = element.getAttribute('style') || ''
    const hasHeadingStyle = 
      style.includes('font-size: 2') || 
      style.includes('font-weight: 700') ||
      style.includes('font-weight: bold')
    
    // Check for module patterns
    const hasModulePattern = /^(module|section|chapter|unit)\s+\d+/i.test(text)
    
    return (
      tagName === 'h1' ||
      (hasHeadingStyle && hasModulePattern) ||
      (tagName === 'p' && hasModulePattern && text.length < 100)
    )
  }

  /**
   * Check if element is a lesson heading
   */
  private static isLessonHeading(element: Element, text: string, tagName: string): boolean {
    // Check for Word/Google Docs subheading styles
    const style = element.getAttribute('style') || ''
    const hasSubheadingStyle = 
      style.includes('font-size: 1.5') || 
      style.includes('font-weight: 600')
    
    // Check for lesson patterns
    const hasLessonPattern = 
      /^(lesson|topic|chapter)\s+\d+/i.test(text) ||
      /^\d+\.\s+/.test(text)
    
    return (
      tagName === 'h2' ||
      (hasSubheadingStyle && hasLessonPattern) ||
      (tagName === 'p' && hasLessonPattern && text.length < 100)
    )
  }

  /**
   * Clean title text
   */
  private static cleanTitle(text: string, pattern: RegExp): string {
    return text
      .replace(pattern, '')
      .replace(/^\d+\.\s+/, '')
      .trim()
  }

  /**
   * Get first paragraph for description
   */
  private static getFirstParagraph(doc: Document): string {
    const firstP = doc.querySelector('p')
    return firstP?.textContent?.trim().substring(0, 200) || ''
  }
}