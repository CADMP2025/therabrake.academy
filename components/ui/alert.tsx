import { cn } from "@/lib/utils"

type Variant = "default" | "success" | "warning" | "destructive" | "info"

const map: Record<Variant, string> = {
  default: "border-border bg-muted/40 text-foreground",
  success: "border-emerald-600/30 bg-emerald-600/10 text-emerald-900 dark:text-emerald-100",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100",
  destructive: "border-red-600/30 bg-red-600/10 text-red-900 dark:text-red-100",
  info: "border-sky-600/30 bg-sky-600/10 text-sky-900 dark:text-sky-100",
}

export function Alert({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: Variant }) {
  return <div role="status" className={cn("w-full rounded-md border p-3 text-sm", map[variant], className)} {...props} />
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-1 font-medium", className)} {...props} />
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm opacity-90", className)} {...props} />
}
