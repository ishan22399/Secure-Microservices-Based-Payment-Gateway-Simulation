import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ children, className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("min-w-full divide-y divide-gray-200", className)} {...props}>{children}</table>;
}
export function TableHeader({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-gray-50", className)} {...props}>{children}</thead>;
}
export function TableBody({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("bg-white divide-y divide-gray-200", className)} {...props}>{children}</tbody>;
}
export function TableRow({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("hover:bg-gray-100", className)} {...props}>{children}</tr>;
}
export function TableHead({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", className)} {...props}>{children}</th>;
}
export function TableCell({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-900", className)} {...props}>{children}</td>;
}
