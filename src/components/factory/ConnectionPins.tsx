"use client";

import { useEffect, useState } from "react";
import type { Connection } from "@/lib/factory/connections";

interface ConnectionPinsProps {
  connections: Connection[];
  positions: Map<string, { x: number; y: number }>;
  hoveredAgent: string | null;
  cardWidth: number;
  cardHeight: number;
  gap: number;
}

export function ConnectionPins({ connections, positions, hoveredAgent, cardWidth, cardHeight, gap }: ConnectionPinsProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <svg className="absolute inset-0 pointer-events-none z-0 hidden md:block" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="pin-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0B1D3A" />
          <stop offset="45%" stopColor="#1B7A8F" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>
      {connections.map((conn, i) => {
        const from = positions.get(conn.from);
        const to = positions.get(conn.to);
        if (!from || !to) return null;

        const x1 = from.x * (cardWidth + gap) + cardWidth / 2;
        const y1 = from.y * (cardHeight + gap) + cardHeight / 2;
        const x2 = to.x * (cardWidth + gap) + cardWidth / 2;
        const y2 = to.y * (cardHeight + gap) + cardHeight / 2;

        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const isActive = hoveredAgent === conn.from || hoveredAgent === conn.to;

        return (
          <path
            key={i}
            d={`M ${x1} ${y1} Q ${mx} ${my - 30} ${x2} ${y2}`}
            fill="none"
            stroke="url(#pin-gradient)"
            strokeWidth="1.5"
            opacity={isActive ? 1 : 0.35}
            strokeDasharray="8 4"
            className="transition-opacity duration-200"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="12"
              dur={isActive ? "1.5s" : "3s"}
              repeatCount="indefinite"
            />
          </path>
        );
      })}
    </svg>
  );
}
