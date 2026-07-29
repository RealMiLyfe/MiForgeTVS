"use client";

import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <GradientHeadline size="card" as="h1">Reports.</GradientHeadline>
      <p className="text-sm text-milyfe-text-muted">Weekly operational reports from your factory.</p>

      <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6">
        <MonoLabel className="block mb-3">LATEST WEEKLY REPORT</MonoLabel>
        <p className="text-sm text-milyfe-text mb-2">Week of Dec 9-15, 2025</p>
        <div className="space-y-3 text-sm text-milyfe-text-muted">
          <div><span className="font-medium text-milyfe-text">Revenue:</span> $18,340 (↑ 8% vs. last week)</div>
          <div><span className="font-medium text-milyfe-text">Tasks completed:</span> 1,247 autonomous actions</div>
          <div><span className="font-medium text-milyfe-text">Hours reclaimed:</span> 168 hours of human work replaced</div>
          <div><span className="font-medium text-milyfe-text">Flagged:</span> No issues requiring your attention</div>
        </div>
      </div>

      <div className="text-center py-8">
        <MonoLabel className="block mb-2">PREVIOUS REPORTS</MonoLabel>
        <p className="text-xs text-milyfe-text-muted">Weekly reports generate every Monday. Full history builds over time.</p>
      </div>
    </div>
  );
}
