"use client";

import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";

const waitlistEntries = [
  { email: "jane@brandco.com", name: "Jane Miller", business: "BrandCo", tier: "Standard", status: "waiting", date: "2025-11-12" },
  { email: "mike@agency.com", name: "Mike Torres", business: "Torres Agency", tier: "Sovereign", status: "invited", date: "2025-11-03" },
  { email: "sarah@retail.com", name: "Sarah Chen", business: "RetailFlow", tier: "Standard", status: "waiting", date: "2025-10-28" },
];

export default function OperatorWaitlistPage() {
  return (
    <div className="space-y-8">
      <div>
        <GradientHeadline size="card" as="h1">Waitlist.</GradientHeadline>
        <p className="text-sm text-milyfe-text-muted mt-1">{waitlistEntries.length} people waiting · 1 invited this month</p>
      </div>

      {/* Capacity card */}
      <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6">
        <MonoLabel className="block mb-3">FORGE CAPACITY — CURRENT MONTH</MonoLabel>
        <div className="h-2 bg-milyfe-surface-2 rounded-full overflow-hidden mb-2">
          <div className="h-full w-[40%] bg-milyfe-gradient rounded-full" />
        </div>
        <p className="text-sm text-milyfe-text-muted">2 of 5 slots used · <span className="text-milyfe-emerald">3 remaining</span></p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-milyfe-border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-milyfe-border bg-milyfe-surface">
            <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">DATE</th>
            <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">NAME</th>
            <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">BUSINESS</th>
            <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">TIER INTEREST</th>
            <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">STATUS</th>
            <th className="p-3"></th>
          </tr></thead>
          <tbody>
            {waitlistEntries.map((w, i) => (
              <tr key={i} className="border-b border-milyfe-border last:border-0">
                <td className="p-3 text-milyfe-text-muted">{w.date}</td>
                <td className="p-3"><div className="text-milyfe-text">{w.name}</div><div className="text-xs text-milyfe-text-muted">{w.email}</div></td>
                <td className="p-3 text-milyfe-text-muted">{w.business}</td>
                <td className="p-3"><MonoLabel className="text-[9px]">{w.tier.toUpperCase()}</MonoLabel></td>
                <td className="p-3"><MonoLabel className={`text-[9px] ${w.status === "invited" ? "text-milyfe-cyan" : "text-milyfe-text-muted"}`}>{w.status.toUpperCase()}</MonoLabel></td>
                <td className="p-3"><Button variant="ghost" size="sm" className="text-[10px]" disabled={w.status === "invited"}>{w.status === "invited" ? "Invited" : "Invite"}</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
