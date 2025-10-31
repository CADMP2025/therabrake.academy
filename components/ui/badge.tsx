import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-primary text-white',
      secondary: 'bg-secondary text-white',
      outline: 'border border-gray-300 text-gray-700',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'
export { Badge }