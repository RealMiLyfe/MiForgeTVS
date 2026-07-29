"use client";

import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";

const funnel = [
  { stage: "Homepage visits", count: 2840, pct: 100 },
  { stage: "Concierge opened", count: 892, pct: 31 },
  { stage: "Discovery started", count: 547, pct: 19 },
  { stage: "Preview generated", count: 186, pct: 7 },
  { stage: "Preview explored", count: 142, pct: 5 },
  { stage: "Unlock started", count: 48, pct: 2 },
  { stage: "Payment completed", count: 23, pct: 0.8 },
  { stage: "Factory activated", count: 13, pct: 0.5 },
];

export default function OperatorAnalyticsPage() {
  return (
    <div className="space-y-8">
      <GradientHeadline size="card" as="h1">Platform Analytics.</GradientHeadline>
      <p className="text-sm text-milyfe-text-muted">Everything happening across MiLyfe.</p>

      {/* Traffic */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "UNIQUE VISITORS (30D)", value: "2,840" },
          { label: "PAGE VIEWS", value: "12,450" },
          { label: "AVG SESSION", value: "4m 32s" },
          { label: "BOUNCE RATE", value: "42%" },
          { label: "TOP REFERRER", value: "Google" },
        ].map(m => (
          <div key={m.label} className="rounded-lg border border-milyfe-border bg-milyfe-surface p-4">
            <MonoLabel className="block text-[9px] mb-1">{m.label}</MonoLabel>
            <span className="font-mono text-lg font-bold text-milyfe-text">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Conversion Funnel */}
      <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6">
        <MonoLabel className="block mb-6">CONVERSION FUNNEL</MonoLabel>
        <div className="space-y-3">
          {funnel.map((s, i) => (
            <div key={s.stage} className="flex items-center gap-4">
              <span className="w-8 text-xs font-mono text-milyfe-text-muted text-right">{i + 1}.</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-milyfe-text">{s.stage}</span>
                  <span className="font-mono text-milyfe-text-muted">{s.count.toLocaleString()} ({s.pct}%)</span>
                </div>
                <div className="h-2 bg-milyfe-surface-2 rounded-full overflow-hidden">
                  <div className="h-full bg-milyfe-gradient rounded-full transition-all" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Concierge Intelligence */}
      <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6">
        <MonoLabel className="block mb-4">CONCIERGE INTELLIGENCE</MonoLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <MonoLabel className="block text-[9px] mb-2">TOP BUSINESS TYPES</MonoLabel>
            <div className="space-y-1 text-sm text-milyfe-text-muted">
              <div className="flex justify-between"><span>Ecommerce</span><span className="font-mono">47%</span></div>
              <div className="flex justify-between"><span>SaaS</span><span className="font-mono">22%</span></div>
              <div className="flex justify-between"><span>Agency</span><span className="font-mono">18%</span></div>
              <div className="flex justify-between"><span>Content</span><span className="font-mono">8%</span></div>
              <div className="flex justify-between"><span>Other</span><span className="font-mono">5%</span></div>
            </div>
          </div>
          <div>
            <MonoLabel className="block text-[9px] mb-2">TOP PAINS</MonoLabel>
            <div className="space-y-1 text-sm text-milyfe-text-muted">
              <div>Operational overwhelm</div>
              <div>Customer service backlog</div>
              <div>Content production bottleneck</div>
              <div>Scaling without hiring</div>
              <div>Exit preparation</div>
            </div>
          </div>
          <div>
            <MonoLabel className="block text-[9px] mb-2">TIER DISTRIBUTION</MonoLabel>
            <div className="space-y-2">
              <div><div className="flex justify-between text-xs mb-1"><span className="text-milyfe-text-muted">Standard</span><span>62%</span></div><div className="h-2 bg-milyfe-surface-2 rounded-full"><div className="h-full w-[62%] bg-milyfe-gradient rounded-full" /></div></div>
              <div><div className="flex justify-between text-xs mb-1"><span className="text-milyfe-text-muted">Specimen</span><span>28%</span></div><div className="h-2 bg-milyfe-surface-2 rounded-full"><div className="h-full w-[28%] bg-milyfe-cyan rounded-full" /></div></div>
              <div><div className="flex justify-between text-xs mb-1"><span className="text-milyfe-text-muted">Sovereign</span><span>10%</span></div><div className="h-2 bg-milyfe-surface-2 rounded-full"><div className="h-full w-[10%] bg-milyfe-teal rounded-full" /></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Reports Placeholder */}
      <div className="rounded-xl border border-dashed border-milyfe-border p-8 text-center">
        <MonoLabel className="block mb-2">CUSTOM REPORTS</MonoLabel>
        <p className="text-sm text-milyfe-text-muted">Custom report builder coming Q1 2026.</p>
      </div>
    </div>
  );
}
