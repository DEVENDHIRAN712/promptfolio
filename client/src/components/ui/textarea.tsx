import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  hasError?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError = false, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[96px] w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#111827] shadow-sm transition-all duration-150 placeholder:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:border-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-50 leading-relaxed border-[#E2E8F0] hover:border-[#CBD5E1]",
          hasError ? "border-[#EF4444] focus-visible:ring-[#EF4444]/20 focus-visible:border-[#EF4444]" : "border-[#E2E8F0] hover:border-[#CBD5E1]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
