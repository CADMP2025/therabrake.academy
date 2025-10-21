import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'default'
  size?: 'sm' | 'md' | 'lg' | 'default'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      default: 'bg-primary text-white hover:bg-blue-600 focus:ring-primary',
      primary: 'bg-primary text-white hover:bg-blue-600 focus:ring-primary',
      secondary: 'bg-secondary text-white hover:bg-green-600 focus:ring-secondary',
      accent: 'bg-accent text-neutral-dark hover:bg-yellow-400 focus:ring-accent',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
      ghost: 'hover:bg-gray-100 text-neutral-dark'
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      default: 'px-6 py-3 text-base'
    }
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
export { Button }
