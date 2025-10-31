import * as React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function ContentCard({ className, header, actions, children }: { className?: string; header?: React.ReactNode; actions?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Card className={cn("p-0", className)}>
      {(header || actions) && (
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="font-medium">{header}</div>
          <div className="flex items-center gap-2">{actions}</div>
        </div>
      )}
      <div className="p-4">{children}</div>
    </Card>
  )
}

export function StatCard({ label, value, hint, className }: { label: string; value: React.ReactNode; hint?: string; className?: string }) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
    </Card>
  )
}
