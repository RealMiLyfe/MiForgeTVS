"use client";

import { useState } from "react";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";

const transactions = [
  { date: "Dec 1", factory: "Derek's Business", provider: "GoCardless", type: "Retainer", amount: "$1,497", status: "Paid" },
  { date: "Nov 28", factory: "Ridgeline & Ember", provider: "Paddle", type: "Additional Agent", amount: "$1,500", status: "Paid" },
  { date: "Nov 15", factory: "Sable & Cove", provider: "GoCardless", type: "Retainer", amount: "$2,400", status: "Failed" },
  { date: "Nov 1", factory: "Derek's Business", provider: "GoCardless", type: "Retainer", amount: "$1,497", status: "Paid" },
  { date: "Oct 15", factory: "Halberd Supply", provider: "Paddle", type: "Forge Fee", amount: "$12,000", status: "Paid" },
  { date: "Oct 1", factory: "Derek's Business", provider: "Paddle", type: "Forge Fee", amount: "$7,500", status: "Paid" },
];

export default function OperatorRevenuePage() {
  const [dateRange, setDateRange] = useState("30d");

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <GradientHeadline size="card" as="h1">Revenue.</GradientHeadline>
          <p className="text-sm text-milyfe-text-muted mt-1">December performance · $4,491 recurring · $26,991 all-time</p>
        </div>
        <div className="flex gap-2">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="h-9 rounded-lg border border-milyfe-border bg-milyfe-surface px-3 text-sm text-milyfe-text">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <Button variant="ghost" size="sm">Export</Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: "MRR", value: "$4,491", delta: "+12% vs last month" },
          { label: "ARR", value: "$53,892", delta: "Annualized" },
          { label: "FORGE FEES", value: "$22,500", delta: "All-time collected" },
          { label: "UPLIFT OWED", value: "$0", delta: "Pending assessment" },
          { label: "ACTIVE RETAINERS", value: "3", delta: "$4,491/mo total" },
          { label: "CHURN (30D)", value: "0", delta: "0% churn rate" },
        ].map(m => (
          <div key={m.label} className="rounded-xl border border-milyfe-border bg-milyfe-surface p-4">
            <MonoLabel className="block text-[9px] mb-1">{m.label}</MonoLabel>
            <div className="font-mono text-lg font-bold text-milyfe-gradient">{m.value}</div>
            <p className="text-[10px] text-milyfe-text-muted mt-1">{m.delta}</p>
          </div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6">
          <MonoLabel className="block mb-4">REVENUE OVER TIME</MonoLabel>
          <div className="h-48 flex items-center justify-center border border-dashed border-milyfe-border rounded-lg">
            <div className="text-center">
              <div className="flex items-end justify-center gap-1 h-32">
                {[20, 35, 28, 45, 52, 48, 65, 72, 68, 85, 92, 100].map((h, i) => (
                  <div key={i} className="w-4 bg-milyfe-gradient rounded-t" style={{ height: `${h}%` }} />
                ))}
              </div>
              <MonoLabel className="mt-2 text-[9px]">JAN — DEC 2025</MonoLabel>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6">
          <MonoLabel className="block mb-4">REVENUE BY TIER</MonoLabel>
          <div className="h-48 flex items-center justify-center">
            <div className="space-y-3 w-full max-w-xs">
              <div><div className="flex justify-between text-xs mb-1"><span className="text-milyfe-text-muted">Standard</span><span className="text-milyfe-text">68%</span></div><div className="h-3 bg-milyfe-surface-2 rounded-full"><div className="h-full w-[68%] bg-milyfe-gradient rounded-full" /></div></div>
              <div><div className="flex justify-between text-xs mb-1"><span className="text-milyfe-text-muted">Sovereign</span><span className="text-milyfe-text">24%</span></div><div className="h-3 bg-milyfe-surface-2 rounded-full"><div className="h-full w-[24%] bg-milyfe-teal rounded-full" /></div></div>
              <div><div className="flex justify-between text-xs mb-1"><span className="text-milyfe-text-muted">Specimen</span><span className="text-milyfe-text">8%</span></div><div className="h-3 bg-milyfe-surface-2 rounded-full"><div className="h-full w-[8%] bg-milyfe-cyan rounded-full" /></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <MonoLabel>TRANSACTIONS</MonoLabel>
          <Button variant="ghost" size="sm" className="text-xs">Export CSV</Button>
        </div>
        <div className="rounded-xl border border-milyfe-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-milyfe-border bg-milyfe-surface">
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">DATE</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">FACTORY</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">PROVIDER</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">TYPE</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">AMOUNT</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">STATUS</th>
            </tr></thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} className="border-b border-milyfe-border last:border-0 hover:bg-milyfe-surface/50">
                  <td className="p-3 text-milyfe-text-muted">{t.date}</td>
                  <td className="p-3 text-milyfe-text">{t.factory}</td>
                  <td className="p-3 text-milyfe-text-muted">{t.provider}</td>
                  <td className="p-3 text-milyfe-text-muted">{t.type}</td>
                  <td className="p-3 font-mono text-milyfe-text">{t.amount}</td>
                  <td className="p-3"><span className={`text-xs ${t.status === "Paid" ? "text-milyfe-emerald" : "text-red-400"}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
        <MonoLabel className="text-yellow-500 block mb-3">REQUIRES ATTENTION</MonoLabel>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-milyfe-text">Failed payment: Sable & Cove - $2,400</span>
            <Button variant="ghost" size="sm" className="text-xs">Retry</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
