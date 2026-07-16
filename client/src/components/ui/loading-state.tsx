import * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { Cpu } from "lucide-react"

export interface LoadingStateProps extends Omit<HTMLMotionProps<"div">, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"> {
  title?: string
  description?: string
  step?: string
  icon?: React.ReactNode
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = "Processing Intelligence...",
  description = "Synthesizing career metrics and structuring architectural payloads.",
  step,
  icon,
  className,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "p-8 sm:p-12 rounded-2xl bg-surface-1/80 border border-border/80 backdrop-blur-xl text-center space-y-5 max-w-lg mx-auto shadow-xl relative overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Orbital Icon Spinner */}
      <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-dashed border-primary/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-xl border border-primary/20 bg-surface-2 flex items-center justify-center text-primary shadow-inner"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative z-10 text-primary animate-pulse">
          {icon || <Cpu className="w-6 h-6" />}
        </div>
      </div>

      <div className="space-y-1.5 relative z-10">
        {step && (
          <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold block">
            {step}
          </span>
        )}
        <h4 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Linear Shimmer Bar */}
      <div className="w-48 h-1 bg-surface-3 rounded-full mx-auto overflow-hidden relative z-10">
        <motion.div
          className="w-full h-full bg-gradient-to-r from-primary via-brand-cyan to-primary origin-left"
          animate={{ scaleX: [0, 1, 0], x: ["-100%", "0%", "100%"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  )
}
