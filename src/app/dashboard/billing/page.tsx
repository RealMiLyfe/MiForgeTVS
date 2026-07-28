"use client";

import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";

const invoices = [
  { date: "Dec 1, 2025", desc: "Monthly Retainer - Nov", amount: "$1,497", status: "Paid" },
  { date: "Nov 15, 2025", desc: "Additional Agent: Product Launch", amount: "$1,500", status: "Paid" },
  { date: "Nov 1, 2025", desc: "Monthly Retainer - Oct", amount: "$1,497", status: "Paid" },
  { date: "Oct 1, 2025", desc: "Forge Fee - Standard Factory", amount: "$7,500", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <GradientHeadline size="card" as="h1">Your Billing.</GradientHeadline>

      {/* Status card */}
      <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div><MonoLabel className="block text-[10px] mb-1">TIER</MonoLabel><p className="font-medium text-milyfe-text">Standard Factory</p></div>
        <div><MonoLabel className="block text-[10px] mb-1">RETAINER</MonoLabel><p className="font-mono text-milyfe-text">$1,497 /mo</p></div>
        <div><MonoLabel className="block text-[10px] mb-1">NEXT BILLING</MonoLabel><p className="text-milyfe-text">Jan 1, 2026</p></div>
        <div><MonoLabel className="block text-[10px] mb-1">PAYMENT</MonoLabel><p className="text-milyfe-text">Card ····4242</p></div>
      </div>

      {/* Invoice history */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <MonoLabel>INVOICE HISTORY</MonoLabel>
          <Button variant="ghost" size="sm" className="text-xs">Export CSV</Button>
        </div>
        <div className="rounded-xl border border-milyfe-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-milyfe-border bg-milyfe-surface">
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">DATE</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">DESCRIPTION</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">AMOUNT</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">STATUS</th>
              <th className="p-3"></th>
            </tr></thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={i} className="border-b border-milyfe-border last:border-0">
                  <td className="p-3 text-milyfe-text-muted">{inv.date}</td>
                  <td className="p-3 text-milyfe-text">{inv.desc}</td>
                  <td className="p-3 font-mono text-milyfe-text">{inv.amount}</td>
                  <td className="p-3"><span className="text-milyfe-emerald text-xs">{inv.status}</span></td>
                  <td className="p-3"><Button variant="ghost" size="sm" className="text-[10px]">PDF</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Retainer controls */}
      <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6">
        <MonoLabel className="block mb-4">RETAINER MANAGEMENT</MonoLabel>
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" size="sm">Pause Retainer</Button>
          <Button variant="ghost" size="sm">Change Tier</Button>
          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">Cancel Retainer</Button>
        </div>
      </div>
    </div>
  );
}
