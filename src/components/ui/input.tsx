import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const fieldClasses =
  "w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 " +
  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-zinc-100";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldClasses, "h-10", className)} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldClasses, "py-2", className)} rows={3} {...props} />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldClasses, "h-10", className)} {...props}>
      {children}
    </select>
  )
);
Select.displayName = "Select";
