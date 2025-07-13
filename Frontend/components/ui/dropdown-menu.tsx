export function DropdownMenuLabel({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider", className)} {...props}>{children}</div>;
}

export function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn("my-2 border-t border-gray-200", className)} {...props} />;
}
import * as React from "react";
import { cn } from "@/lib/utils";

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-block text-left">{children}</div>;
}
export function DropdownMenuTrigger({ children }: { children: React.ReactNode }) {
  return <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">{children}</button>;
}
export function DropdownMenuContent({ children, align }: { children: React.ReactNode; align?: string }) {
  return <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">{children}</div>;
}
export function DropdownMenuItem({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer", className)} {...props}>{children}</div>;
}
