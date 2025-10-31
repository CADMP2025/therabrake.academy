"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type Crumb = { href: string; label: string }

type Props = {
  className?: string
  base?: Crumb
  segments?: Crumb[]
}

export function Breadcrumbs({ className, base, segments }: Props) {
  const pathname = usePathname()
  const autoSegments = React.useMemo<Crumb[]>(() => {
    if (segments) return segments
    const parts = pathname.split("/").filter(Boolean)
    let acc = ""
    return parts.map((p) => {
      acc += `/${p}`
      return { href: acc, label: decodeURIComponent(p.replace(/-/g, " ")) }
    })
  }, [pathname, segments])

  const list: Crumb[] = []
  if (base) list.push(base)
  list.push(...autoSegments)

  return (
    <nav className={cn("text-sm text-muted-foreground", className)} aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        {list.map((c, i) => {
          const last = i === list.length - 1
          return (
            <li key={i} className="inline-flex items-center gap-1">
              {last ? (
                <span className="font-medium text-foreground">{c.label}</span>
              ) : (
                <Link href={c.href} className="hover:underline">
                  {c.label}
                </Link>
              )}
              {!last ? <span className="opacity-60">/</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
