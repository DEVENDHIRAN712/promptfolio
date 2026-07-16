import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface-2/70 animate-pulse transition-all",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
