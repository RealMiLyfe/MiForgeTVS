import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-milyfe-border bg-milyfe-surface px-3 py-2 text-sm text-milyfe-text ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-milyfe-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-milyfe-cyan/50 focus-visible:border-milyfe-cyan/50 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
