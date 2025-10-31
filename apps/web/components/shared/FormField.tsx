import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

type FormFieldProps = {
  label?: string
  description?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
  labelFor?: string
}

export function FormField({ label, description, error, required, children, className, labelFor }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <div className="flex items-center gap-2">
          <Label htmlFor={labelFor}>
            {label}
            {required ? <span className="ml-0.5 text-destructive">*</span> : null}
          </Label>
        </div>
      ) : null}
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label?: string
  description?: string
  containerClassName?: string
}

export function InputWithError({ error, label, description, containerClassName, id, ...props }: InputProps) {
  return (
    <FormField label={label} description={description} error={error} labelFor={id} className={containerClassName}>
      <input
        id={id}
        {...props}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive"
        )}
      />
    </FormField>
  )
}
