import * as React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
}

const variantClasses = {
  info: "bg-blue-100 text-blue-800 border-blue-300",
  success: "bg-green-100 text-green-800 border-green-300",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
  error: "bg-red-100 text-red-800 border-red-300",
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant = "info", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-l-4 p-4 rounded-md",
      variantClasses[variant],
      className
    )}
    {...props}
  />
));
Alert.displayName = "Alert";
export { Alert };
