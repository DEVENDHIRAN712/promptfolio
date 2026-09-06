import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "warning" | "info"

export interface ToastItem {
  id: string
  title: string
  description?: string
  type?: ToastType
  duration?: number
}

interface ToastContextValue {
  toast: (options: Omit<ToastItem, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback(
    ({ title, description, type = "info", duration = 4000 }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [...prev, { id, title, description, type, duration }])

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id)
        }, duration)
      }
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Floating Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2 sm:p-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border bg-white border-[#E2E8F0] shadow-xl text-[#111827] relative overflow-hidden",
                t.type === "success" && "border-[#D1FAE5] bg-white",
                t.type === "error" && "border-[#FEE2E2] bg-white",
                t.type === "warning" && "border-[#FEF3C7] bg-white",
                t.type === "info" && "border-[#E0E7FF] bg-white"
              )}
            >
              <div className="shrink-0 mt-0.5">
                {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                {t.type === "error" && <XCircle className="w-5 h-5 text-[#EF4444]" />}
                {t.type === "warning" && <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />}
                {t.type === "info" && <Info className="w-5 h-5 text-[#4F46E5]" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#111827] tracking-tight">
                  {t.title}
                </p>
                {t.description && (
                  <p className="text-xs font-semibold text-[#475569] mt-0.5 leading-relaxed">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="shrink-0 text-[#64748B] hover:text-[#111827] rounded-md p-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used inside a ToastProvider")
  }
  return context
}
