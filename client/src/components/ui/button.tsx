import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.99]",
  {
    variants: {
      variant: {
        default:
          "bg-[#4F46E5] text-white shadow-sm hover:bg-[#4338CA] border border-transparent",
        linear:
          "bg-white border border-[#E2E8F0] text-[#111827] shadow-sm hover:bg-[#F8FAFC] hover:border-[#CBD5E1]",
        glow:
          "bg-[#4F46E5] text-white shadow-sm hover:bg-[#4338CA] border border-transparent font-bold",
        glass:
          "bg-white border border-[#E2E8F0] text-[#111827] hover:bg-[#F8FAFC] shadow-sm",
        destructive:
          "bg-[#EF4444] text-white shadow-sm hover:bg-[#DC2626]",
        outline:
          "border border-[#E2E8F0] bg-white shadow-sm hover:bg-[#F8FAFC] hover:border-[#CBD5E1] text-[#111827]",
        secondary:
          "bg-[#F1F5F9] text-[#111827] shadow-sm hover:bg-[#E2E8F0]",
        ghost: "hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#111827]",
        link: "text-[#4F46E5] underline-offset-4 hover:underline font-semibold",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-lg px-5 text-sm",
        xl: "h-11 rounded-xl px-6 text-base font-semibold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-1.5 h-4 w-4 animate-spin text-current" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
