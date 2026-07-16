import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-[#E0E7FF] bg-[#EEF2FF] text-[#4F46E5]",
        secondary:
          "border-[#E2E8F0] bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]",
        destructive:
          "border-[#FEE2E2] bg-[#FEF2F2] text-[#EF4444]",
        outline: "text-[#111827] border-[#E2E8F0] bg-white",
        success: "border-[#D1FAE5] bg-[#ECFDF5] text-[#10B981]",
        cyan: "border-[#E0E7FF] bg-[#EEF2FF] text-[#4F46E5]",
        amber: "border-[#FEF3C7] bg-[#FFFBEB] text-[#F59E0B]",
        glass: "border-[#E2E8F0] bg-white text-[#111827]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  showDot?: boolean
  dotColor?: string
}

function Badge({ className, variant, showDot = false, dotColor, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {showDot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            dotColor ? dotColor : variant === "success" ? "bg-[#10B981]" : variant === "cyan" ? "bg-[#4F46E5]" : variant === "amber" ? "bg-[#F59E0B]" : variant === "destructive" ? "bg-[#EF4444]" : "bg-[#4F46E5]"
          )}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
