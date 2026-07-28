"use client";

import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";

const connected = [
  { name: "Shopify", status: "connected", lastSync: "2 min ago" },
  { name: "Klaviyo", status: "connected", lastSync: "15 min ago" },
];

const available = [
  { name: "TikTok Shop" }, { name: "Amazon" }, { name: "Meta Ads" },
  { name: "Google Ads" }, { name: "HubSpot" }, { name: "Notion" },
  { name: "Slack" }, { name: "Stripe" }, { name: "Custom API" },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <GradientHeadline size="card" as="h1">Your Integrations.</GradientHeadline>
        <p className="text-sm text-milyfe-text-muted mt-1">Connect the platforms your agents work with.</p>
      </div>

      <div>
        <MonoLabel className="block mb-4">{connected.length} CONNECTED</MonoLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connected.map(p => (
            <div key={p.name} className="rounded-xl border border-milyfe-border bg-milyfe-surface p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-milyfe-text">{p.name}</h3>
                <StatusPill variant="active">CONNECTED</StatusPill>
              </div>
              <p className="text-xs text-milyfe-text-muted mb-3">Last synced {p.lastSync}</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs">Manage</Button>
                <Button variant="ghost" size="sm" className="text-xs">Test</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <MonoLabel className="block mb-4">{available.length} AVAILABLE</MonoLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {available.map(p => (
            <div key={p.name} className="rounded-xl border border-dashed border-milyfe-border bg-milyfe-surface/50 p-5 flex items-center justify-between">
              <span className="text-sm text-milyfe-text-muted">{p.name}</span>
              <Button variant="ghost" size="sm" className="text-xs">+ Connect</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
