import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-200", className)} {...props}>{children}</div>;
}
export function AvatarImage({ src, alt, className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img src={src} alt={alt} className={cn("h-10 w-10 rounded-full object-cover", className)} {...props} />;
}
export function AvatarFallback({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-white", className)} {...props}>{children}</div>;
}
