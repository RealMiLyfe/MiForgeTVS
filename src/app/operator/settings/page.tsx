"use client";

import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OperatorSettingsPage() {
  return (
    <div className="space-y-8">
      <GradientHeadline size="card" as="h1">Platform Settings.</GradientHeadline>
      <p className="text-sm text-milyfe-text-muted">Configure how MiLyfe operates.</p>

      <Tabs defaultValue="capacity" className="w-full">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="capacity">
          <div className="space-y-6 max-w-2xl">
            <MonoLabel className="block">FORGE CAPACITY</MonoLabel>
            {["December 2025", "January 2026", "February 2026", "March 2026"].map((m, i) => (
              <div key={m} className="rounded-lg border border-milyfe-border p-4 flex items-center justify-between">
                <div><p className="text-sm text-milyfe-text">{m}</p><MonoLabel className="text-[9px]">{i === 0 ? "2 OF 5 USED" : "0 OF 5 USED"}</MonoLabel></div>
                <div className="flex gap-2 items-center">
                  <Input type="number" defaultValue="5" className="w-16 h-8 text-center" />
                  <span className="text-xs text-milyfe-text-muted">slots</span>
                </div>
              </div>
            ))}
            <Button variant="gradient" size="sm">Save Capacity</Button>
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <div className="space-y-6">
            <MonoLabel className="block">PRICING TIERS</MonoLabel>
            {[
              { name: "Specimen", forge: "2,500", retainer: "500", uplift: "5%", min: "2 mo" },
              { name: "Standard", forge: "12,000", retainer: "1,800", uplift: "8%", min: "3 mo" },
              { name: "Sovereign", forge: "35,000", retainer: "4,500", uplift: "10%", min: "6 mo" },
            ].map(t => (
              <div key={t.name} className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-fraunces text-lg text-milyfe-text">{t.name}</h3>
                  <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div><MonoLabel className="text-[9px] block">FORGE FEE</MonoLabel><span className="text-milyfe-text">${t.forge}</span></div>
                  <div><MonoLabel className="text-[9px] block">RETAINER</MonoLabel><span className="text-milyfe-text">${t.retainer}/mo</span></div>
                  <div><MonoLabel className="text-[9px] block">UPLIFT</MonoLabel><span className="text-milyfe-text">{t.uplift}</span></div>
                  <div><MonoLabel className="text-[9px] block">MINIMUM</MonoLabel><span className="text-milyfe-text">{t.min}</span></div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="space-y-6 max-w-2xl">
            <MonoLabel className="block">OPERATOR TEAM</MonoLabel>
            <div className="rounded-lg border border-milyfe-border p-4 flex items-center justify-between">
              <div><p className="text-sm text-milyfe-text">miforge@milyfe.fun</p><MonoLabel className="text-[9px]">ADMIN</MonoLabel></div>
              <span className="text-xs text-milyfe-emerald">Active now</span>
            </div>
            <div className="rounded-lg border border-dashed border-milyfe-border p-4">
              <MonoLabel className="block mb-3">INVITE OPERATOR</MonoLabel>
              <div className="flex gap-2">
                <Input placeholder="email@example.com" className="flex-1" />
                <Button variant="gradient" size="sm">Invite</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="space-y-4">
            <MonoLabel className="block">AI PROVIDERS</MonoLabel>
            {[
              { name: "Anthropic", status: "Placeholder", model: "claude-3-5-haiku-latest" },
              { name: "OpenAI", status: "Placeholder", model: "gpt-4o-mini" },
              { name: "NVIDIA Build", status: "Placeholder", model: "llama-3.3-70b-instruct" },
              { name: "Groq", status: "Placeholder", model: "llama-3.1-8b-instant" },
            ].map(p => (
              <div key={p.name} className="rounded-lg border border-milyfe-border p-4 flex items-center justify-between">
                <div><p className="text-sm text-milyfe-text">{p.name}</p><MonoLabel className="text-[9px]">{p.model}</MonoLabel></div>
                <div className="flex items-center gap-2"><span className="text-xs text-yellow-500">{p.status}</span><Button variant="ghost" size="sm" className="text-[10px]">Configure</Button></div>
              </div>
            ))}
            <MonoLabel className="block mt-6">SERVICES</MonoLabel>
            {["Supabase", "Resend", "Paddle", "GoCardless", "DocuSeal", "Cal.com", "PostHog"].map(s => (
              <div key={s} className="rounded-lg border border-milyfe-border p-4 flex items-center justify-between">
                <span className="text-sm text-milyfe-text">{s}</span>
                <span className="text-xs text-yellow-500">Placeholder</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="space-y-4 max-w-lg">
            <MonoLabel className="block">FEATURE FLAGS</MonoLabel>
            {[
              { label: "Concierge widget", enabled: true },
              { label: "Concierge on homepage", enabled: true },
              { label: "Bespoke Forge flow", enabled: true },
              { label: "Sound design", enabled: false },
              { label: "Real-time updates", enabled: false },
              { label: "Cinematic animations", enabled: true },
              { label: "Referral program", enabled: true },
              { label: "Waitlist system", enabled: true },
              { label: "Sovereign tier", enabled: true },
            ].map(f => (
              <label key={f.label} className="flex items-center justify-between p-3 rounded-lg border border-milyfe-border cursor-pointer hover:border-milyfe-cyan/20">
                <span className="text-sm text-milyfe-text">{f.label}</span>
                <input type="checkbox" defaultChecked={f.enabled} className="accent-milyfe-emerald" />
              </label>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <div className="space-y-4">
            <MonoLabel className="block">AUDIT LOG</MonoLabel>
            <div className="rounded-xl border border-milyfe-border overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-milyfe-border bg-milyfe-surface">
                  <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">TIME</th>
                  <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">ACTOR</th>
                  <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">ACTION</th>
                  <th className="text-left p-3 font-mono text-[10px] text-milyfe-text-muted">TARGET</th>
                </tr></thead>
                <tbody>
                  {[
                    { time: "2 min ago", actor: "miforge@milyfe.fun", action: "Viewed settings", target: "Platform" },
                    { time: "1 hour ago", actor: "miforge@milyfe.fun", action: "Updated capacity", target: "Dec 2025" },
                    { time: "3 hours ago", actor: "miforge@milyfe.fun", action: "Forged factory", target: "Derek Adams" },
                  ].map((e, i) => (
                    <tr key={i} className="border-b border-milyfe-border last:border-0">
                      <td className="p-3 text-milyfe-text-muted">{e.time}</td>
                      <td className="p-3 font-mono text-xs text-milyfe-text-muted">{e.actor}</td>
                      <td className="p-3 text-milyfe-text">{e.action}</td>
                      <td className="p-3 text-milyfe-text-muted">{e.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
