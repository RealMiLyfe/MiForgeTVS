"use client";

import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const members = [
  { name: "You (Derek Adams)", email: "derek@novagoods.com", role: "Owner", lastActive: "Now" },
];

export default function TeamPage() {
  return (
    <div className="space-y-8">
      <GradientHeadline size="card" as="h1">Your Team.</GradientHeadline>
      <p className="text-sm text-milyfe-text-muted">Give team members access to your factory. Control what they can see and do.</p>

      {/* Members */}
      <div className="rounded-xl border border-milyfe-border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-milyfe-border bg-milyfe-surface">
            <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">MEMBER</th>
            <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">ROLE</th>
            <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">LAST ACTIVE</th>
            <th className="p-3"></th>
          </tr></thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={i} className="border-b border-milyfe-border last:border-0">
                <td className="p-3"><div className="text-milyfe-text">{m.name}</div><div className="text-xs text-milyfe-text-muted">{m.email}</div></td>
                <td className="p-3"><MonoLabel>{m.role.toUpperCase()}</MonoLabel></td>
                <td className="p-3 text-milyfe-text-muted">{m.lastActive}</td>
                <td className="p-3">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite */}
      <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6">
        <MonoLabel className="block mb-4">INVITE TEAM MEMBER</MonoLabel>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input placeholder="team@example.com" className="flex-1" />
          <select className="h-10 rounded-lg border border-milyfe-border bg-milyfe-bg px-3 text-sm text-milyfe-text">
            <option value="viewer">Viewer</option>
            <option value="operator">Operator</option>
          </select>
          <Button variant="gradient">Send Invite</Button>
        </div>
      </div>

      {/* Permission reference */}
      <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6">
        <MonoLabel className="block mb-3">PERMISSION REFERENCE</MonoLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div><span className="font-medium text-milyfe-text block mb-1">Owner</span><span className="text-milyfe-text-muted">Everything — agents, billing, team, settings</span></div>
          <div><span className="font-medium text-milyfe-text block mb-1">Operator</span><span className="text-milyfe-text-muted">Manage agents, view billing (read-only), no team</span></div>
          <div><span className="font-medium text-milyfe-text block mb-1">Viewer</span><span className="text-milyfe-text-muted">View dashboard and reports, no changes</span></div>
        </div>
      </div>
    </div>
  );
}
