import * as React from "react"
import { cn } from "@/lib/utils"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  subtext?: string
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, subtext, children, ...props }, ref) => (
    <div className="flex items-center justify-between gap-2">
      <label
        ref={ref}
        className={cn(
          "text-xs font-bold uppercase tracking-wider leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-800 flex items-center gap-1",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-rose-500 font-bold">*</span>}
      </label>
      {subtext && <span className="text-[11px] font-normal text-slate-600">{subtext}</span>}
    </div>
  )
)
Label.displayName = "Label"

export { Label }
