"use client";

import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";

const liveSessions = [
  { id: "disc_a1b2", started: "12 min ago", messages: 6, intent: "Ecommerce · customer service overwhelm", confidence: 0.62 },
  { id: "disc_c3d4", started: "4 min ago", messages: 2, intent: "SaaS · exploring automation", confidence: 0.18 },
];

const recentCompleted = [
  { id: "disc_e5f6", duration: "22 min", messages: 14, outcome: "Preview Generated", tier: "Standard", user: "anonymous" },
  { id: "disc_g7h8", duration: "8 min", messages: 5, outcome: "Abandoned", tier: "—", user: "anonymous" },
  { id: "disc_i9j0", duration: "35 min", messages: 18, outcome: "Bespoke Submitted", tier: "Sovereign", user: "jane@brandco.com" },
];

export default function OperatorConciergePage() {
  return (
    <div className="space-y-8">
      <div>
        <GradientHeadline size="card" as="h1">The Forge Concierge.</GradientHeadline>
        <p className="text-sm text-milyfe-text-muted mt-1">Every discovery conversation. Every extracted intent. Every generated preview.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "SESSIONS THIS WEEK", value: "23", delta: "+8 vs last week" },
          { label: "CONVERSION RATE", value: "34%", delta: "Sessions → Preview" },
          { label: "AVG SESSION DEPTH", value: "9.2 msgs", delta: "14 min avg" },
          { label: "TOP INTENT", value: "Ecommerce", delta: "47% of sessions" },
        ].map(m => (
          <div key={m.label} className="rounded-xl border border-milyfe-border bg-milyfe-surface p-5">
            <MonoLabel className="block text-[10px] mb-1">{m.label}</MonoLabel>
            <div className="font-mono text-xl font-bold text-milyfe-gradient">{m.value}</div>
            <p className="text-xs text-milyfe-text-muted mt-1">{m.delta}</p>
          </div>
        ))}
      </div>

      {/* Live Sessions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-milyfe-emerald opacity-75" /><span className="relative rounded-full h-2 w-2 bg-milyfe-emerald" /></span>
          <MonoLabel>LIVE ACTIVE SESSIONS</MonoLabel>
        </div>
        <div className="space-y-2">
          {liveSessions.map(s => (
            <div key={s.id} className="rounded-lg border border-milyfe-border bg-milyfe-surface p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <MonoLabel className="text-[9px]">{s.id}</MonoLabel>
                  <span className="text-sm text-milyfe-text">Started {s.started} · {s.messages} messages</span>
                </div>
                <p className="text-xs text-milyfe-text-muted mt-1">{s.intent}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-milyfe-cyan">{Math.round(s.confidence * 100)}%</span>
                <Button variant="ghost" size="sm" className="text-xs">Watch Live →</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Completed */}
      <div>
        <MonoLabel className="block mb-4">RECENT COMPLETED SESSIONS</MonoLabel>
        <div className="rounded-xl border border-milyfe-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-milyfe-border bg-milyfe-surface">
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">SESSION</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">DURATION</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">MESSAGES</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">OUTCOME</th>
              <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">TIER</th>
              <th className="p-3"></th>
            </tr></thead>
            <tbody>
              {recentCompleted.map(s => (
                <tr key={s.id} className="border-b border-milyfe-border last:border-0">
                  <td className="p-3"><MonoLabel className="text-[9px]">{s.id}</MonoLabel><br /><span className="text-xs text-milyfe-text-muted">{s.user}</span></td>
                  <td className="p-3 text-milyfe-text-muted">{s.duration}</td>
                  <td className="p-3 font-mono text-milyfe-text">{s.messages}</td>
                  <td className="p-3"><span className={`text-xs ${s.outcome.includes("Generated") || s.outcome.includes("Submitted") ? "text-milyfe-emerald" : "text-milyfe-text-muted"}`}>{s.outcome}</span></td>
                  <td className="p-3"><MonoLabel className="text-[9px]">{s.tier}</MonoLabel></td>
                  <td className="p-3"><Button variant="ghost" size="sm" className="text-[10px]">Transcript</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
