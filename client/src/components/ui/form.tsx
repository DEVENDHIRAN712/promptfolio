import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  required?: boolean
  subtext?: string
  error?: string
  description?: string
  children: React.ReactNode
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  subtext,
  error,
  description,
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("space-y-1.5 w-full", className)} {...props}>
      {label && (
        <Label required={required} subtext={subtext}>
          {label}
        </Label>
      )}
      <div className="relative">
        {children}
      </div>
      {description && !error && (
        <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-destructive font-medium animate-in fade-in-50 duration-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
