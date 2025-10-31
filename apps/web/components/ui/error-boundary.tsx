"use client"

import React from "react"

type Props = {
  children: React.ReactNode
  fallback?: React.ReactNode
}

type State = {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Optionally report to logging service
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("ErrorBoundary caught error", error, errorInfo)
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            <p className="font-semibold">Something went wrong.</p>
            <p className="mt-1 opacity-80">Please try again or refresh the page.</p>
          </div>
        )
      )
    }
    return this.props.children
  }
}
