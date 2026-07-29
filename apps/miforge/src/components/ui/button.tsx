import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-milyfe-cyan/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-milyfe-gradient text-white shadow-md hover:shadow-milyfe-emerald/20 hover:shadow-lg",
        ghost:
          "border border-milyfe-cyan/50 text-milyfe-cyan bg-transparent hover:bg-milyfe-cyan/10 hover:border-milyfe-cyan",
        outline:
          "border border-milyfe-border text-milyfe-text bg-transparent hover:bg-milyfe-surface-2 hover:border-milyfe-text-muted",
        gradient:
          "bg-milyfe-gradient text-white shadow-lg shadow-milyfe-emerald/25 hover:shadow-milyfe-emerald/40 hover:shadow-xl",
        mono: "font-mono text-xs bg-milyfe-surface-2 text-milyfe-text-muted border border-milyfe-border hover:text-milyfe-text hover:border-milyfe-text-muted",
        destructive:
          "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20",
        link: "text-milyfe-cyan underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base",
        xl: "h-14 rounded-lg px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
