import * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface EmptyStateProps extends Omit<HTMLMotionProps<"div">, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"> {
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  actionIcon?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center p-10 sm:p-14 text-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white max-w-xl mx-auto my-6 shadow-sm",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] mb-4 shadow-sm">
          {React.isValidElement(icon)
            ? icon
            : typeof icon === 'function' || (typeof icon === 'object' && icon !== null)
            ? React.createElement(icon as any, { className: "w-6 h-6 text-[#4F46E5]" })
            : icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-[#111827] tracking-tight mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[#64748B] leading-relaxed max-w-md mb-6">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          variant="default"
          onClick={onAction}
          className="font-semibold px-6"
        >
          {actionIcon && <span className="mr-1.5">{actionIcon}</span>}
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
