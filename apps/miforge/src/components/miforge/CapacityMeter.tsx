"use client";

import { MonoLabel } from "@/components/shared/MonoLabel";

interface CapacityMeterProps {
  month: string;
  slotsTotal: number;
  slotsUsed: number;
}

export function CapacityMeter({ month, slotsTotal, slotsUsed }: CapacityMeterProps) {
  const remaining = slotsTotal - slotsUsed;
  const percent = (slotsUsed / slotsTotal) * 100;

  return (
    <div className="w-full bg-milyfe-bg py-8">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <MonoLabel>FORGE CAPACITY — {month.toUpperCase()}</MonoLabel>
        <div className="mt-4 h-2 bg-milyfe-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-milyfe-gradient rounded-full transition-all duration-1000"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-milyfe-text-muted">
          <span className="text-milyfe-emerald font-mono">{remaining}</span> of{" "}
          <span className="font-mono">{slotsTotal}</span> slots remaining this month.
          New slots open first week of each month.
        </p>
      </div>
    </div>
  );
}
