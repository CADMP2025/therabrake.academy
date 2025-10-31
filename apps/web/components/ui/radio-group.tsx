import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioGroupContextValue {
  value?: string
  onValueChange?: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({})

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange }}>
        <div ref={ref} className={cn("grid gap-2", className)} {...props} />
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value: itemValue, ...props }, ref) => {
    const { value, onValueChange } = React.useContext(RadioGroupContext)
    
    return (
      <input
        type="radio"
        ref={ref}
        checked={value === itemValue}
        onChange={() => onValueChange?.(itemValue)}
        className={cn(
          "h-4 w-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer",
          className
        )}
        {...props}
      />
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
