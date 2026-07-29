"use client";

import { cn } from "@/lib/utils";

interface ScanlineOverlayProps {
  opacity?: number;
  className?: string;
}

export function ScanlineOverlay({
  opacity = 3,
  className,
}: ScanlineOverlayProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-10", className)}
      style={{ opacity: opacity / 100 }}
      aria-hidden="true"
    >
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
          )`,
        }}
      />
    </div>
  );
}
