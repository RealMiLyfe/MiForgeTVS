"use client";

import { useState, useMemo } from "react";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import { mockBespokeRequests } from "@/lib/supabase/mocks";
import { getRelativeTime } from "@/lib/utils/relative-time";

const columns = ["submitted", "reviewing", "scoping", "quoted", "won", "lost"] as const;
const columnLabels: Record<string, string> = { submitted: "Submitted", reviewing: "Reviewing", scoping: "Scoping", quoted: "Quoted", won: "Won", lost: "Lost" };

export default function OperatorBespokePage() {
  const [view, setView] = useState<"kanban" | "table">("kanban");

  const byStatus = useMemo(() => {
    const map: Record<string, typeof mockBespokeRequests> = {};
    columns.forEach(c => { map[c] = mockBespokeRequests.filter(r => r.status === c); });
    return map;
  }, []);

  const total = mockBespokeRequests.length;
  const newThisWeek = mockBespokeRequests.filter(r => r.status === "submitted").length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <GradientHeadline size="card" as="h1">Bespoke Requests.</GradientHeadline>
          <p className="text-sm text-milyfe-text-muted mt-1">{total} active requests · {newThisWeek} new this week</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("kanban")} className={`px-3 py-1 rounded text-xs ${view === "kanban" ? "bg-milyfe-surface-2 text-milyfe-text" : "text-milyfe-text-muted"}`}>Kanban</button>
          <button onClick={() => setView("table")} className={`px-3 py-1 rounded text-xs ${view === "table" ? "bg-milyfe-surface-2 text-milyfe-text" : "text-milyfe-text-muted"}`}>Table</button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map(col => (
            <div key={col} className="flex-shrink-0 w-[280px]">
              <div className="flex items-center justify-between mb-3">
                <MonoLabel>{columnLabels[col].toUpperCase()}</MonoLabel>
                <span className="text-xs font-mono text-milyfe-text-muted">{byStatus[col].length}</span>
              </div>
              <div className="space-y-2">
                {byStatus[col].map(req => (
                  <div key={req.id} className="rounded-lg border border-milyfe-border bg-milyfe-surface p-4 cursor-pointer hover:border-milyfe-cyan/30 transition-colors">
                    <MonoLabel className="text-[9px] block mb-1">#BF-{String(req.request_number).padStart(3, "0")}</MonoLabel>
                    <p className="text-sm font-medium text-milyfe-text">{req.contact_name}</p>
                    <p className="text-xs text-milyfe-text-muted">{req.business_name}</p>
                    <p className="text-xs text-milyfe-text-muted mt-1 line-clamp-2">{req.role_description.slice(0, 80)}...</p>
                    <div className="flex items-center justify-between mt-2">
                      {req.estimated_forge_fee_low && (
                        <span className="text-[10px] font-mono text-milyfe-cyan">${(req.estimated_forge_fee_low / 1000).toFixed(0)}K-${(req.estimated_forge_fee_high! / 1000).toFixed(0)}K</span>
                      )}
                      <MonoLabel className="text-[9px]">{getRelativeTime(req.created_at)}</MonoLabel>
                    </div>
                  </div>
                ))}
                {byStatus[col].length === 0 && (
                  <p className="text-xs text-milyfe-text-muted text-center py-4 italic">No requests</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-milyfe-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-milyfe-border bg-milyfe-surface">
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">#</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">CONTACT</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">BUSINESS</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">STATUS</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">EST. VALUE</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">SUBMITTED</th>
            </tr></thead>
            <tbody>
              {mockBespokeRequests.map(r => (
                <tr key={r.id} className="border-b border-milyfe-border last:border-0">
                  <td className="p-3 font-mono text-milyfe-text-muted">BF-{String(r.request_number).padStart(3,"0")}</td>
                  <td className="p-3 text-milyfe-text">{r.contact_name}</td>
                  <td className="p-3 text-milyfe-text-muted">{r.business_name}</td>
                  <td className="p-3"><MonoLabel className="text-[9px]">{r.status.toUpperCase()}</MonoLabel></td>
                  <td className="p-3 font-mono text-milyfe-text-muted">{r.estimated_forge_fee_low ? `$${(r.estimated_forge_fee_low/1000).toFixed(0)}K` : "—"}</td>
                  <td className="p-3"><MonoLabel className="text-[9px]">{getRelativeTime(r.created_at)}</MonoLabel></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
