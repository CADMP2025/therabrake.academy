import { cn } from "@/lib/utils"

type Variant = "default" | "success" | "warning" | "danger" | "info" | "secondary" | "outline"

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border border-input",
  success: "bg-emerald-600/90 text-white",
  warning: "bg-amber-500/90 text-white",
  danger: "bg-red-600/90 text-white",
  info: "bg-sky-600/90 text-white",
}

export function StatusBadge({ className, variant = "default", ...props }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}
