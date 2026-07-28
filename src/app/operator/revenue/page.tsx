"use client";

import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";

export default function OperatorRevenuePage() {
  return (
    <div className="space-y-8">
      <GradientHeadline size="card" as="h1">Revenue.</GradientHeadline>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "MRR", value: "$4,491" },
          { label: "FORGE FEES (LIFETIME)", value: "$22,500" },
          { label: "UPLIFT SHARE (LIFETIME)", value: "$0" },
          { label: "TOTAL REVENUE", value: "$26,991" },
        ].map(m => (
          <div key={m.label} className="rounded-xl border border-milyfe-border bg-milyfe-surface p-5">
            <MonoLabel className="block text-[10px] mb-1">{m.label}</MonoLabel>
            <div className="font-mono text-2xl font-bold text-milyfe-gradient">{m.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6 text-center">
        <MonoLabel className="block mb-2">REVENUE BREAKDOWN</MonoLabel>
        <p className="text-sm text-milyfe-text-muted">Detailed revenue analytics coming with full activation data.</p>
      </div>
    </div>
  );
}
