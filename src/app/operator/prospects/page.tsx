"use client";

import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";

const prospects = [
  { heat: "hot", firstSeen: "2h ago", lastSeen: "5m ago", factory: "derek-adams", chats: 3, agents: ["customer_service", "email_reactivation"], time: "18m", location: "US, CA" },
  { heat: "warm", firstSeen: "1d ago", lastSeen: "2h ago", factory: "specimen-bloom-beauty", chats: 1, agents: ["social_content"], time: "8m", location: "UK, London" },
  { heat: "cool", firstSeen: "3d ago", lastSeen: "1d ago", factory: "multiple", chats: 0, agents: [], time: "3m", location: "US, NY" },
  { heat: "hot", firstSeen: "4h ago", lastSeen: "20m ago", factory: "specimen-pulse-saas", chats: 4, agents: ["customer_service", "ops_reporting", "email_reactivation"], time: "24m", location: "DE, Berlin" },
  { heat: "warm", firstSeen: "6h ago", lastSeen: "1h ago", factory: "derek-adams", chats: 2, agents: ["social_content"], time: "12m", location: "AU, Sydney" },
];

const heatColors: Record<string, string> = { hot: "bg-red-500", warm: "bg-yellow-500", cool: "bg-milyfe-text-muted" };

export default function OperatorProspectsPage() {
  return (
    <div className="space-y-8">
      <div>
        <GradientHeadline size="card" as="h1">Prospects.</GradientHeadline>
        <p className="text-sm text-milyfe-text-muted mt-1">{prospects.length} unique visitors last 30 days · 2 active right now</p>
      </div>

      {/* Heat legend */}
      <div className="flex items-center gap-4 text-xs text-milyfe-text-muted">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Hot (score &gt;75)</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-500" /> Warm (40-75)</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-milyfe-text-muted" /> Cool (&lt;40)</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-milyfe-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-milyfe-border bg-milyfe-surface">
            <th className="p-3 w-8"></th>
            <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">FIRST SEEN</th>
            <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">LAST SEEN</th>
            <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">FACTORY</th>
            <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">CHATS</th>
            <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">TIME</th>
            <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">LOCATION</th>
          </tr></thead>
          <tbody>
            {prospects.map((p, i) => (
              <tr key={i} className="border-b border-milyfe-border last:border-0 hover:bg-milyfe-surface/50 cursor-pointer">
                <td className="p-3"><span className={`h-2.5 w-2.5 rounded-full inline-block ${heatColors[p.heat]}`} /></td>
                <td className="p-3 text-milyfe-text-muted">{p.firstSeen}</td>
                <td className="p-3 text-milyfe-text">{p.lastSeen}</td>
                <td className="p-3 font-mono text-xs text-milyfe-text-muted">{p.factory}</td>
                <td className="p-3 text-milyfe-text">{p.chats}</td>
                <td className="p-3 text-milyfe-text-muted">{p.time}</td>
                <td className="p-3 text-milyfe-text-muted">{p.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
