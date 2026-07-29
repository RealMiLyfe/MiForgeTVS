"use client";

import { cn } from "@/lib/utils";

interface StatusPillProps {
  variant: "demo" | "active" | "paused" | "checkout";
  children?: React.ReactNode;
  className?: string;
}

const variantStyles = {
  demo: "bg-milyfe-cyan/10 text-milyfe-cyan border-milyfe-cyan/30",
  active: "bg-milyfe-emerald/10 text-milyfe-emerald border-milyfe-emerald/30",
  paused: "bg-milyfe-text-muted/10 text-milyfe-text-muted border-milyfe-text-muted/30",
  checkout: "bg-milyfe-teal/10 text-milyfe-teal border-milyfe-teal/30",
};

const variantLabels = {
  demo: "DEMO",
  active: "LIVE",
  paused: "PAUSED",
  checkout: "CHECKOUT",
};

export function StatusPill({ variant, children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border",
        variantStyles[variant],
        className
      )}
    >
      {variant === "active" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-milyfe-emerald opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-milyfe-emerald" />
        </span>
      )}
      {children || variantLabels[variant]}
    </span>
  );
}
