"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

type FileUploadProps = {
  accept?: string[]
  maxSizeMB?: number
  multiple?: boolean
  onFilesSelected?: (files: File[]) => void
  onUpload?: (files: File[]) => Promise<void> | void
  className?: string
  buttonText?: string
}

export function FileUpload({ accept, maxSizeMB = 25, multiple, onFilesSelected, onUpload, className, buttonText = "Upload files" }: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([])
  const [loading, setLoading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const openPicker = () => {
    inputRef.current?.click()
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    if (!list) return
    const picked = Array.from(list)
    const validated = validateFiles(picked, accept, maxSizeMB)
    setFiles(validated)
    onFilesSelected?.(validated)
  }

  const upload = async () => {
    if (!onUpload || files.length === 0) return
    setLoading(true)
    try {
      await onUpload(files)
      toast.success("Upload complete")
      setFiles([])
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Button type="button" onClick={openPicker} variant="secondary">
          {buttonText}
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          onChange={onChange}
          accept={accept?.join(",")}
        />
        {onUpload ? (
          <Button type="button" onClick={upload} disabled={loading || files.length === 0}>
            {loading ? "Uploading..." : "Start upload"}
          </Button>
        ) : null}
      </div>
      {files.length > 0 ? (
        <ul className="space-y-1 text-sm">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-2 rounded border bg-muted/30 px-2 py-1">
              <span className="truncate">{f.name}</span>
              <span className="text-muted-foreground">{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function validateFiles(files: File[], accept?: string[], maxSizeMB?: number) {
  const maxBytes = (maxSizeMB ?? 25) * 1024 * 1024
  return files.filter((f) => {
    if (f.size > maxBytes) {
      toast.error(`${f.name} exceeds ${maxSizeMB}MB`) 
      return false
    }
    if (accept && accept.length > 0) {
      const ok = accept.some((a) => f.type === a || f.name.toLowerCase().endsWith(a.replace(/^.*\//, ".")))
      if (!ok) {
        toast.error(`${f.name} has an unsupported type`)
        return false
      }
    }
    return true
  })
}
