import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-milyfe-border bg-milyfe-surface px-3 py-2 text-sm text-milyfe-text ring-offset-background placeholder:text-milyfe-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-milyfe-cyan/50 focus-visible:border-milyfe-cyan/50 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
