"use client";

import { useState, useMemo } from "react";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockFactories, mockFactoryAgents } from "@/lib/supabase/mocks";
import { formatFactoryNumber, formatRevenue } from "@/lib/factory/personalize";
import { getRelativeTime } from "@/lib/utils/relative-time";
import Link from "next/link";

export default function OperatorFactoriesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");

  const factories = useMemo(() => {
    return mockFactories.filter(f => {
      if (statusFilter !== "all" && f.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return f.business_name.toLowerCase().includes(q) || f.contact_name.toLowerCase().includes(q) || f.slug.includes(q);
      }
      return true;
    });
  }, [statusFilter, search]);

  const active = mockFactories.filter(f => f.status === "activated").length;
  const demo = mockFactories.filter(f => f.status === "demo").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <GradientHeadline size="card" as="h1">Factories.</GradientHeadline>
          <p className="text-sm text-milyfe-text-muted mt-1">{mockFactories.length} total · {active} active · {demo} demo</p>
        </div>
        <Button variant="gradient" size="sm">+ Forge New Factory</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-lg border border-milyfe-border bg-milyfe-surface px-3 text-sm text-milyfe-text">
          <option value="all">All Status</option>
          <option value="demo">Demo</option>
          <option value="activated">Activated</option>
          <option value="paused">Paused</option>
        </select>
        <Input placeholder="Search factories..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs h-9" />
        <div className="ml-auto flex gap-1">
          <button onClick={() => setView("grid")} className={`px-2 py-1 rounded text-xs ${view === "grid" ? "bg-milyfe-surface-2 text-milyfe-text" : "text-milyfe-text-muted"}`}>Grid</button>
          <button onClick={() => setView("table")} className={`px-2 py-1 rounded text-xs ${view === "table" ? "bg-milyfe-surface-2 text-milyfe-text" : "text-milyfe-text-muted"}`}>Table</button>
        </div>
      </div>

      {/* Grid */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {factories.map(f => (
            <div key={f.id} className="rounded-xl border border-milyfe-border bg-milyfe-surface p-5">
              <div className="flex items-center justify-between mb-3">
                <MonoLabel>{formatFactoryNumber(f.factory_number)}</MonoLabel>
                <StatusPill variant={f.status === "activated" ? "active" : f.status === "demo" ? "demo" : "paused"} />
              </div>
              <h3 className="font-fraunces text-base text-milyfe-text mb-1">{f.business_name}</h3>
              <p className="text-xs text-milyfe-text-muted">{f.contact_name} · {f.niche}</p>
              <div className="h-px bg-milyfe-border my-3" />
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-milyfe-text-muted">{mockFactoryAgents.filter(a => a.factory_id === f.id).length} agents</span>
                <MonoLabel className="text-[9px]">{getRelativeTime(f.created_at)}</MonoLabel>
              </div>
              <Link href={`/operator/factories/${f.slug}`} className="mt-3 block">
                <Button variant="ghost" size="sm" className="w-full text-xs">View Factory →</Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-milyfe-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-milyfe-border bg-milyfe-surface">
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">#</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">BUSINESS</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">CONTACT</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">STATUS</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">AGENTS</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">REVENUE</th>
              <th className="p-3"></th>
            </tr></thead>
            <tbody>
              {factories.map(f => (
                <tr key={f.id} className="border-b border-milyfe-border last:border-0 hover:bg-milyfe-surface/50">
                  <td className="p-3 font-mono text-milyfe-text-muted">{formatFactoryNumber(f.factory_number)}</td>
                  <td className="p-3 text-milyfe-text">{f.business_name}</td>
                  <td className="p-3 text-milyfe-text-muted">{f.contact_name}</td>
                  <td className="p-3"><StatusPill variant={f.status === "activated" ? "active" : "demo"} /></td>
                  <td className="p-3 font-mono text-milyfe-text-muted">{mockFactoryAgents.filter(a => a.factory_id === f.id).length}</td>
                  <td className="p-3 font-mono text-milyfe-text-muted">{formatRevenue(f.lifetime_revenue)}</td>
                  <td className="p-3"><Link href={`/operator/factories/${f.slug}`}><Button variant="ghost" size="sm" className="text-[10px]">View</Button></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
