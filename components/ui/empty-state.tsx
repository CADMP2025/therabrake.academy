import { cn } from "@/lib/utils"
import { Button } from "./button"
import { LucideIcon, Inbox } from "lucide-react"

type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: { label: string; onClick: () => void; variant?: React.ComponentProps<typeof Button>["variant"] }
  className?: string
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 rounded-lg border bg-background p-8 text-center", className)}>
      <Icon className="h-10 w-10 text-muted-foreground" />
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? <p className="max-w-prose text-sm text-muted-foreground">{description}</p> : null}
      {action ? (
        <Button className="mt-2" onClick={action.onClick} variant={action.variant ?? "default"}>
          {action.label}
        </Button>
      ) : null}
    </div>
  )
}
