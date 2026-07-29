"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SchematicGridProps {
  opacity?: number;
  className?: string;
}

export function SchematicGrid({ opacity = 8, className }: SchematicGridProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ opacity: opacity / 100 }}
      aria-hidden="true"
    >
      <motion.svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        animate={{
          x: [0, -10, 0],
          y: [0, -5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <defs>
          <pattern
            id="schematic-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-milyfe-cyan"
            />
          </pattern>
        </defs>
        <rect width="200%" height="200%" fill="url(#schematic-grid)" />
      </motion.svg>
    </div>
  );
}
