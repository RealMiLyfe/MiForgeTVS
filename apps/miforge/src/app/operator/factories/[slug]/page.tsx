"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { mockFactories, mockFactoryAgents, mockAgentCatalog, mockActivityEvents } from "@/lib/supabase/mocks";
import { formatFactoryNumber, formatRevenue, formatValuationRange } from "@/lib/factory/personalize";
import { getRelativeTime } from "@/lib/utils/relative-time";
import Link from "next/link";

export default function OperatorFactoryDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const factory = useMemo(() => mockFactories.find(f => f.slug === slug), [slug]);
  const agents = useMemo(() => factory ? mockFactoryAgents.filter(a => a.factory_id === factory.id).map(a => ({ ...a, catalog: mockAgentCatalog.find(c => c.slug === a.catalog_slug) })) : [], [factory]);
  const events = useMemo(() => factory ? mockActivityEvents.filter(e => e.factory_id === factory.id) : [], [factory]);

  if (!factory) return <div className="text-center py-20"><MonoLabel>FACTORY NOT FOUND</MonoLabel></div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Link href="/operator/factories" className="text-xs text-milyfe-text-muted hover:text-milyfe-cyan mb-2 block">← Factories</Link>
          <GradientHeadline size="card" as="h1">{factory.business_name}</GradientHeadline>
          <p className="text-sm text-milyfe-text-muted mt-1">{factory.contact_name} · {factory.contact_email} · {formatFactoryNumber(factory.factory_number)}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill variant={factory.status === "activated" ? "active" : "demo"} />
          <Link href={`/factory/${slug}`} target="_blank"><Button variant="ghost" size="sm">View Public</Button></Link>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6 space-y-4">
              <MonoLabel className="block">FACTORY METADATA</MonoLabel>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-milyfe-text-muted">Niche:</span> <span className="text-milyfe-text">{factory.niche}</span></div>
                <div><span className="text-milyfe-text-muted">Revenue:</span> <span className="text-milyfe-text">{formatRevenue(factory.lifetime_revenue)}</span></div>
                <div><span className="text-milyfe-text-muted">Margin:</span> <span className="text-milyfe-text">{factory.margin ? `${(factory.margin * 100).toFixed(0)}%` : "—"}</span></div>
                <div><span className="text-milyfe-text-muted">Customers:</span> <span className="text-milyfe-text">{factory.customer_count?.toLocaleString() || "—"}</span></div>
                <div><span className="text-milyfe-text-muted">Valuation:</span> <span className="text-milyfe-text">{formatValuationRange(factory.broker_valuation_low, factory.broker_valuation_high)}</span></div>
                <div><span className="text-milyfe-text-muted">Platforms:</span> <span className="text-milyfe-text">{factory.platforms?.join(", ") || "—"}</span></div>
                <div><span className="text-milyfe-text-muted">Health:</span> <span className="text-milyfe-emerald">{factory.health_score}%</span></div>
                <div><span className="text-milyfe-text-muted">Specimen:</span> <span className="text-milyfe-text">{factory.is_specimen ? "Yes" : "No"}</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6 space-y-4">
              <MonoLabel className="block">OPERATOR NOTES</MonoLabel>
              <Textarea placeholder="Private operator notes about this factory..." className="min-h-[120px]" defaultValue={factory.custom_notes || ""} />
              <Button variant="ghost" size="sm">Save Notes</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="agents">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {agents.map(a => (
              <div key={a.id} className="rounded-lg border border-milyfe-border bg-milyfe-surface p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-milyfe-text">{a.catalog?.name || a.catalog_slug}</p>
                  <MonoLabel className="text-[9px]">{a.status.toUpperCase()}</MonoLabel>
                </div>
                <StatusPill variant={a.status === "active" ? "active" : "demo"} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="space-y-2">
            {events.map(e => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-milyfe-border p-3">
                <div className="flex items-center gap-3">
                  <MonoLabel className="text-[9px]">{e.catalog_slug}</MonoLabel>
                  <span className="text-sm text-milyfe-text-muted">{e.event_text}</span>
                </div>
                <MonoLabel className="text-[9px]">{getRelativeTime(e.created_at)}</MonoLabel>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6 space-y-4">
            <MonoLabel className="block">FINANCIAL SUMMARY</MonoLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><MonoLabel className="text-[9px] block mb-1">FORGE FEE</MonoLabel><span className="font-mono text-milyfe-text">$7,500</span></div>
              <div><MonoLabel className="text-[9px] block mb-1">RETAINER</MonoLabel><span className="font-mono text-milyfe-text">$1,497/mo</span></div>
              <div><MonoLabel className="text-[9px] block mb-1">TOTAL LTV</MonoLabel><span className="font-mono text-milyfe-text">$11,979</span></div>
              <div><MonoLabel className="text-[9px] block mb-1">UPLIFT OWED</MonoLabel><span className="font-mono text-milyfe-text">$0</span></div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="actions">
          <div className="space-y-3 max-w-lg">
            <MonoLabel className="block mb-4">OPERATOR ACTIONS</MonoLabel>
            {[
              { label: "Trigger Event Generation", desc: "Re-run activity event generation for this factory" },
              { label: "Reset to Demo Mode", desc: "Remove activation, keep all data" },
              { label: "Send Test Email", desc: "Verify email deliverability to contact" },
              { label: "Export Factory Data", desc: "Download all data as JSON" },
              { label: "Regenerate Slug", desc: "Change the factory URL slug" },
            ].map(a => (
              <div key={a.label} className="flex items-center justify-between rounded-lg border border-milyfe-border p-4">
                <div><p className="text-sm text-milyfe-text">{a.label}</p><p className="text-xs text-milyfe-text-muted">{a.desc}</p></div>
                <Button variant="ghost" size="sm">Run</Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
