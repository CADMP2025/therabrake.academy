/**
 * Enhanced TipTap Extensions for Course Builder
 * Handles image paste, drag-and-drop, and automatic upload
 */

import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export interface ImageUploadOptions {
  onUpload: (file: File) => Promise<string>
  maxSize?: number // in MB
  acceptedTypes?: string[]
}

export const ImagePasteExtension = Extension.create<ImageUploadOptions>({
  name: 'imagePaste',

  addOptions() {
    return {
      onUpload: async () => '',
      maxSize: 10,
      acceptedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    }
  },

  addProseMirrorPlugins() {
    const { onUpload, maxSize, acceptedTypes } = this.options

    return [
      new Plugin({
        key: new PluginKey('imagePaste'),
        props: {
          handlePaste(view, event, slice) {
            const items = Array.from(event.clipboardData?.items || [])
            
            for (const item of items) {
              if (item.type.indexOf('image') === 0) {
                event.preventDefault()
                
                const file = item.getAsFile()
                if (!file) continue

                // Validate file type
                if (acceptedTypes && !acceptedTypes.includes(file.type)) {
                  console.error(`Unsupported image type: ${file.type}`)
                  continue
                }

                // Validate file size
                const sizeInMB = file.size / (1024 * 1024)
                if (maxSize && sizeInMB > maxSize) {
                  console.error(`Image too large: ${sizeInMB.toFixed(2)}MB (max: ${maxSize}MB)`)
                  continue
                }

                // Upload image
                const uploadImage = async () => {
                  try {
                    const imageUrl = await onUpload(file)
                    
                    // Insert image into editor
                    const { schema } = view.state
                    const node = schema.nodes.image.create({ src: imageUrl })
                    const transaction = view.state.tr.replaceSelectionWith(node)
                    view.dispatch(transaction)
                  } catch (error) {
                    console.error('Image upload failed:', error)
                  }
                }

                uploadImage()
                return true
              }
            }
            
            return false
          },

          handleDrop(view, event, slice, moved) {
            if (!event.dataTransfer) return false

            const files = Array.from(event.dataTransfer.files || [])
            
            for (const file of files) {
              if (file.type.indexOf('image') === 0) {
                event.preventDefault()

                // Validate file type
                if (acceptedTypes && !acceptedTypes.includes(file.type)) {
                  console.error(`Unsupported image type: ${file.type}`)
                  continue
                }

                // Validate file size
                const sizeInMB = file.size / (1024 * 1024)
                if (maxSize && sizeInMB > maxSize) {
                  console.error(`Image too large: ${sizeInMB.toFixed(2)}MB (max: ${maxSize}MB)`)
                  continue
                }

                // Get drop position
                const coordinates = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY
                })

                // Upload image
                const uploadImage = async () => {
                  try {
                    const imageUrl = await onUpload(file)
                    
                    if (coordinates) {
                      const { schema } = view.state
                      const node = schema.nodes.image.create({ src: imageUrl })
                      const transaction = view.state.tr.insert(coordinates.pos, node)
                      view.dispatch(transaction)
                    }
                  } catch (error) {
                    console.error('Image upload failed:', error)
                  }
                }

                uploadImage()
                return true
              }
            }

            return false
          }
        }
      })
    ]
  }
})

/**
 * Preserve formatting when pasting from Word/Google Docs
 */
export const PreserveFormattingExtension = Extension.create({
  name: 'preserveFormatting',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('preserveFormatting'),
        props: {
          transformPasted(slice) {
            // Clean up Word/Google Docs specific formatting
            const cleanNode = (node: any): any => {
              if (node.type.name === 'text') {
                return node
              }

              // Remove Word-specific attributes
              const attrs = { ...node.attrs }
              delete attrs['class']
              delete attrs['id']
              delete attrs['style']
              
              // Preserve important attributes
              if (node.type.name === 'link') {
                attrs['href'] = node.attrs.href
                attrs['target'] = node.attrs.target
              }

              const content = node.content ? node.content.content.map(cleanNode) : undefined

              return node.type.create(attrs, content, node.marks)
            }

            const newContent = slice.content.content.map(cleanNode)
            return slice.constructor.prototype.constructor.call(
              slice.constructor,
              slice.content.replaceChild(0, slice.content.content[0].type.create(null, newContent)),
              slice.openStart,
              slice.openEnd
            )
          }
        }
      })
    ]
  }
})
