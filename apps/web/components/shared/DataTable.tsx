"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowDownUp } from "lucide-react"

export type Column<T> = {
  key: keyof T | string
  header: React.ReactNode
  className?: string
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
}

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  keyField?: keyof T
  className?: string
  emptyText?: string
  onSortChange?: (key: string, direction: "asc" | "desc") => void
}

export function DataTable<T extends Record<string, any>>({ columns, data, keyField, className, emptyText = "No results", onSortChange }: DataTableProps<T>) {
  const [sort, setSort] = React.useState<{ key: string; dir: "asc" | "desc" } | null>(null)

  const onSort = (c: Column<T>) => {
    if (!c.sortable) return
    const key = String(c.key)
    const dir = sort && sort.key === key && sort.dir === "asc" ? "desc" : "asc"
    setSort({ key, dir })
    onSortChange?.(key, dir)
  }

  return (
    <div className={cn("w-full overflow-x-auto rounded-md border", className)}>
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            {columns.map((c, idx) => (
              <th
                key={idx}
                className={cn("px-3 py-2 text-left font-medium", c.className, c.sortable && "cursor-pointer select-none")}
                onClick={() => onSort(c)}
              >
                <div className="inline-flex items-center gap-1">
                  {c.header}
                  {c.sortable ? <ArrowDownUp className="h-3.5 w-3.5 opacity-60" /> : null}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-6 text-center text-muted-foreground">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={String(keyField ? row[keyField] : i)} className="border-t hover:bg-muted/30">
                {columns.map((c, j) => (
                  <td key={j} className={cn("px-3 py-2", c.className)}>
                    {c.cell ? c.cell(row) : String(row[c.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
