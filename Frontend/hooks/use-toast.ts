import { useCallback } from "react"

export interface Toast {
  id: string
  message: string
  type?: "success" | "error" | "info" | "warning"
  duration?: number
}

export function useToast() {
  // This is a placeholder. In a real app, you would connect this to your notification system.
  const showToast = useCallback((toast: Toast) => {
    // For now, just log to the console
    console.log(`[${toast.type || "info"}]`, toast.message)
  }, [])

  return { showToast }
}
