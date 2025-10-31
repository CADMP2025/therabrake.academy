import { cn } from "@/lib/utils"

type SpinnerProps = React.HTMLAttributes<SVGSVGElement> & { size?: number }

export function Spinner({ className, size = 20, ...props }: SpinnerProps) {
  const dimension = `${size}`
  return (
    <svg
      className={cn("animate-spin text-muted-foreground", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={dimension}
      height={dimension}
      {...props}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  )
}
