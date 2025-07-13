import { cn } from "@/lib/utils"
import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "secondary"
}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-800",
        variant === "secondary" && "bg-red-100 text-red-800",
        className
      )}
      {...props}
    />
  )
}
