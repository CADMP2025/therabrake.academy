"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/utils"

export const AlertDialog = AlertDialogPrimitive.Root
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger
export const AlertDialogPortal = AlertDialogPrimitive.Portal
export const AlertDialogOverlay = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>) => (
  <AlertDialogPrimitive.Overlay className={cn("fixed inset-0 z-50 bg-black/50 backdrop-blur-sm", className)} {...props} />
)
export const AlertDialogContent = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content className={cn("fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg", className)} {...props} />
  </AlertDialogPortal>
)
export const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
)
export const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
export const AlertDialogTitle = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>) => (
  <AlertDialogPrimitive.Title className={cn("text-lg font-semibold", className)} {...props} />
)
export const AlertDialogDescription = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>) => (
  <AlertDialogPrimitive.Description className={cn("text-sm text-muted-foreground", className)} {...props} />
)
export const AlertDialogAction = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>) => (
  <AlertDialogPrimitive.Action className={cn("inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", className)} {...props} />
)
export const AlertDialogCancel = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>) => (
  <AlertDialogPrimitive.Cancel className={cn("inline-flex h-9 items-center justify-center rounded-md border bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", className)} {...props} />
)
