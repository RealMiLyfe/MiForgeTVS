"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAgentCatalog, mockActivityEvents, mockFactories } from "@/lib/supabase/mocks";
import { getRelativeTime } from "@/lib/utils/relative-time";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import * as LucideIcons from "lucide-react";

export default function AgentDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const catalog = useMemo(() => mockAgentCatalog.find(c => c.slug === slug), [slug]);
  const factory = mockFactories[0];
  const events = useMemo(() => mockActivityEvents.filter(e => e.catalog_slug === slug && e.factory_id === factory.id), [slug, factory.id]);

  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{className?: string}>>)[catalog?.icon_name || "Bot"] || LucideIcons.Bot;

  if (!catalog) {
    return <div className="py-20 text-center"><MonoLabel>AGENT NOT FOUND</MonoLabel></div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-milyfe-surface-2 flex items-center justify-center">
            <Icon className="h-6 w-6 text-milyfe-cyan" />
          </div>
          <div>
            <GradientHeadline size="card" as="h1">{catalog.name}</GradientHeadline>
            <div className="flex items-center gap-2 mt-1">
              <MonoLabel>{catalog.category.replace("_", " ").toUpperCase()}</MonoLabel>
              <StatusPill variant="active">ACTIVE</StatusPill>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">Pause Agent</Button>
          <Button variant="gradient" size="sm">Chat with Agent</Button>
        </div>
      </div>

      <p className="text-sm text-milyfe-text-muted">{catalog.description}</p>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "TASKS THIS WEEK", value: String(Math.floor(Math.random() * 200 + 80)) },
          { label: "AVG RESPONSE", value: `${(Math.random() * 4 + 1).toFixed(1)}s` },
          { label: "SUCCESS RATE", value: `${Math.floor(Math.random() * 10 + 88)}%` },
          { label: "HUMAN OVERSIGHT", value: `${Math.floor(Math.random() * 8 + 2)}%` },
        ].map(m => (
          <div key={m.label} className="rounded-lg border border-milyfe-border bg-milyfe-surface p-4">
            <MonoLabel className="block text-[10px] mb-1">{m.label}</MonoLabel>
            <span className="font-mono text-xl font-bold text-milyfe-text">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="chats">Chat History</TabsTrigger>
          <TabsTrigger value="outputs">Outputs</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <div className="space-y-2">
            {events.length > 0 ? events.map(e => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-milyfe-border p-3">
                <span className="text-sm text-milyfe-text-muted">{e.event_text}</span>
                <MonoLabel className="text-[10px]">{getRelativeTime(e.created_at)}</MonoLabel>
              </div>
            )) : (
              <p className="text-sm text-milyfe-text-muted italic py-8 text-center">No activity events recorded yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="chats">
          <div className="text-center py-12">
            <MonoLabel className="block mb-2">CHAT SESSIONS</MonoLabel>
            <p className="text-sm text-milyfe-text-muted">3 chat sessions recorded</p>
            <div className="mt-4 space-y-2 max-w-lg mx-auto text-left">
              {["How do you handle refund requests?", "Generate a sample response for an angry customer", "What's your escalation process?"].map((msg, i) => (
                <div key={i} className="rounded-lg border border-milyfe-border p-3 text-sm text-milyfe-text-muted cursor-pointer hover:border-milyfe-cyan/30">
                  <div className="flex justify-between"><span>{msg}</span><MonoLabel className="text-[9px]">{i + 1}d ago</MonoLabel></div>
                  <span className="text-[10px] text-milyfe-text-muted">{Math.floor(Math.random() * 8 + 3)} messages</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="outputs">
          <div className="text-center py-12">
            <MonoLabel className="block mb-2">AGENT OUTPUTS</MonoLabel>
            <p className="text-sm text-milyfe-text-muted mb-4">Recent outputs from this agent</p>
            <div className="space-y-2 max-w-lg mx-auto text-left">
              {["Resolved 12 customer tickets autonomously", "Drafted escalation template for VIP issues", "Generated FAQ responses for top 5 questions"].map((o, i) => (
                <div key={i} className="rounded-lg border border-milyfe-border p-3 flex justify-between items-center">
                  <span className="text-sm text-milyfe-text">{o}</span>
                  <Button variant="ghost" size="sm" className="text-xs shrink-0">View</Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="config">
          <div className="max-w-lg space-y-6">
            <div>
              <MonoLabel className="block mb-2">BRAND VOICE CALIBRATION</MonoLabel>
              <Textarea placeholder="Paste a sample of your brand's writing style..." className="min-h-[100px]" />
              <Button variant="ghost" size="sm" className="mt-2">Test with Sample Input</Button>
            </div>
            <div>
              <MonoLabel className="block mb-2">ESCALATION RULES</MonoLabel>
              <div className="space-y-2">
                {["Refund requests over $100", "VIP customer complaints", "Technical issues", "Repeat complaints (3+)"].map(rule => (
                  <label key={rule} className="flex items-center gap-2 text-sm text-milyfe-text-muted">
                    <input type="checkbox" defaultChecked className="accent-milyfe-emerald" /> {rule}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <MonoLabel className="block mb-2">RESPONSE LENGTH</MonoLabel>
              <input type="range" min="1" max="5" defaultValue="3" className="w-full accent-milyfe-emerald" />
              <div className="flex justify-between text-[10px] text-milyfe-text-muted"><span>Concise</span><span>Detailed</span></div>
            </div>
            <div>
              <MonoLabel className="block mb-2">CUSTOM INSTRUCTIONS</MonoLabel>
              <Textarea placeholder="Any edge-case rules or special instructions for this agent..." />
            </div>
            <Button variant="gradient">Save Configuration</Button>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="text-center py-12">
            <MonoLabel className="block mb-2">AGENT INSIGHTS</MonoLabel>
            <p className="text-sm text-milyfe-text-muted mb-6">Performance trends and analytics</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="rounded-lg border border-milyfe-border p-4">
                <MonoLabel className="block text-[9px] mb-1">TREND</MonoLabel>
                <p className="text-sm text-milyfe-emerald">↑ 12% tasks vs last week</p>
              </div>
              <div className="rounded-lg border border-milyfe-border p-4">
                <MonoLabel className="block text-[9px] mb-1">RESOLUTION</MonoLabel>
                <p className="text-sm text-milyfe-text">94% autonomous</p>
              </div>
              <div className="rounded-lg border border-milyfe-border p-4">
                <MonoLabel className="block text-[9px] mb-1">ANOMALY</MonoLabel>
                <p className="text-sm text-milyfe-text-muted">None detected</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
