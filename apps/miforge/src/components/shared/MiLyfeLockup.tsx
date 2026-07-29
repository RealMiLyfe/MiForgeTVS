"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface MiLyfeLockupProps {
  size?: "sm" | "md" | "lg";
  format?: "milyfe-only" | "milyfe-miforge" | "custom-product";
  productName?: string;
  className?: string;
}

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export function MiLyfeLockup({
  size = "md",
  format = "milyfe-only",
  productName,
  className,
}: MiLyfeLockupProps) {
  return (
    <Link href="/" className={cn("inline-flex items-baseline gap-1", className)}>
      <span
        className={cn(
          "font-fraunces font-bold text-milyfe-gradient",
          sizeClasses[size]
        )}
      >
        MiLyfe
      </span>
      {format === "milyfe-miforge" && (
        <>
          <span className={cn("text-milyfe-text-muted mx-1", size === "sm" ? "text-xs" : "text-sm")}>:</span>
          <span className={cn("font-fraunces font-semibold text-milyfe-emerald", sizeClasses[size])}>
            MiForge
          </span>
        </>
      )}
      {format === "custom-product" && productName && (
        <>
          <span className={cn("text-milyfe-text-muted mx-1", size === "sm" ? "text-xs" : "text-sm")}>:</span>
          <span className={cn("font-fraunces font-semibold text-milyfe-cyan", sizeClasses[size])}>
            {productName}
          </span>
        </>
      )}
    </Link>
  );
}
