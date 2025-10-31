"use client"

// Simple modal that wraps Dialog with sensible defaults
import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "./dialog"

type ModalProps = {
  title?: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
}

export function Modal({ title, description, open, onOpenChange, trigger, footer, children }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent>
        {(title || description) && (
          <DialogHeader>
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
        )}
        {children}
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  )
}

export { DialogClose as ModalClose } from "./dialog"
