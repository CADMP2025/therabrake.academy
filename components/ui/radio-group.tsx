import * as React from "react"
import { cn } from "@/lib/utils/cn"

const RadioGroup = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("grid gap-2", className)} {...props} />
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      type="radio"
      ref={ref}
      className={cn(
        "h-4 w-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-primary",
        className
      )}
      {...props}
    />
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
