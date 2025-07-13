import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({ children, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("block w-full rounded-md border border-input bg-background px-3 py-2 text-sm", className)} {...props}>
      {children}
    </select>
  );
}

export function SelectTrigger({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("relative w-full", className)} {...props}>{children}</div>;
}

export function SelectValue({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>;
}

export function SelectContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("absolute z-10 mt-1 w-full rounded-md bg-background shadow-lg", className)} {...props}>{children}</div>;
}

export function SelectItem({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("cursor-pointer px-4 py-2 hover:bg-accent", className)} {...props}>{children}</div>;
}
