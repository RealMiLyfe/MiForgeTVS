"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAgentCatalog, mockFactoryAgents } from "@/lib/supabase/mocks";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

export default function CatalogAgentEditPage() {
  const params = useParams();
  const slug = params.slug as string;
  const agent = useMemo(() => mockAgentCatalog.find(a => a.slug === slug), [slug]);
  const deployments = mockFactoryAgents.filter(fa => fa.catalog_slug === slug).length;

  if (!agent) return <div className="py-20 text-center"><MonoLabel>AGENT NOT FOUND</MonoLabel></div>;

  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{className?: string}>>)[agent.icon_name || "Bot"] || LucideIcons.Bot;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/operator/catalog" className="text-xs text-milyfe-text-muted hover:text-milyfe-cyan mb-2 block">← Catalog</Link>
          <div className="flex items-center gap-3">
            <Icon className="h-8 w-8 text-milyfe-cyan" />
            <div>
              <GradientHeadline size="card" as="h1">{agent.name}</GradientHeadline>
              <div className="flex items-center gap-2 mt-1">
                <MonoLabel>{agent.category.replace("_"," ").toUpperCase()}</MonoLabel>
                <StatusPill variant="active">{agent.status.toUpperCase()}</StatusPill>
                <MonoLabel className="text-milyfe-text-muted">{deployments} deployments</MonoLabel>
              </div>
            </div>
          </div>
        </div>
        <Button variant="gradient" size="sm">Save Changes</Button>
      </div>

      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="prompt">System Prompt</TabsTrigger>
          <TabsTrigger value="routing">Model Routing</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="basics">
          <div className="max-w-2xl space-y-4">
            <div><MonoLabel className="block mb-1">NAME</MonoLabel><Input defaultValue={agent.name} /></div>
            <div><MonoLabel className="block mb-1">SLUG</MonoLabel><Input defaultValue={agent.slug} /><p className="text-[10px] text-milyfe-text-muted mt-1">Warning: changing slug affects all existing deployments</p></div>
            <div><MonoLabel className="block mb-1">CATEGORY</MonoLabel>
              <select defaultValue={agent.category} className="w-full h-10 rounded-lg border border-milyfe-border bg-milyfe-surface px-3 text-sm text-milyfe-text">
                <option value="ecommerce_ops">Ecommerce Ops</option><option value="sales_growth">Sales & Growth</option><option value="content">Content</option><option value="client_services">Client Services</option><option value="finance_ops">Finance</option><option value="recruitment">Recruitment</option><option value="platform">Platform</option>
              </select>
            </div>
            <div><MonoLabel className="block mb-1">DESCRIPTION</MonoLabel><Textarea defaultValue={agent.description || ""} /></div>
            <div><MonoLabel className="block mb-1">CAPABILITIES</MonoLabel><Textarea defaultValue={agent.capabilities?.join("\n") || ""} placeholder="One capability per line" /></div>
            <div><MonoLabel className="block mb-1">IDEAL FOR</MonoLabel><Textarea defaultValue={agent.ideal_for?.join("\n") || ""} placeholder="One business type per line" /></div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-milyfe-text-muted"><input type="checkbox" defaultChecked={agent.starter} className="accent-milyfe-emerald" /> Starter agent (included in default sets)</label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="prompt">
          <div className="space-y-4">
            <MonoLabel className="block">SYSTEM PROMPT (ADMIN ONLY)</MonoLabel>
            <Textarea defaultValue={`You are the ${agent.name}, operating within a MiForge factory.\n\nYour role: ${agent.description}\n\nCapabilities: ${agent.capabilities?.join(", ")}\n\n[Full production prompt would be here]`} className="min-h-[400px] font-mono text-xs" />
            <div className="flex gap-3">
              <Button variant="gradient" size="sm">Save Version</Button>
              <Button variant="ghost" size="sm">Test with Mock Business</Button>
              <Button variant="ghost" size="sm">View Version History</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="routing">
          <div className="max-w-lg space-y-4">
            <MonoLabel className="block">MODEL CONFIGURATION</MonoLabel>
            <div className="grid grid-cols-2 gap-4">
              <div><MonoLabel className="block text-[9px] mb-1">PRIMARY PROVIDER</MonoLabel>
                <select className="w-full h-9 rounded-lg border border-milyfe-border bg-milyfe-surface px-3 text-sm text-milyfe-text">
                  <option>Anthropic</option><option>OpenAI</option><option>NVIDIA</option><option>Groq</option>
                </select></div>
              <div><MonoLabel className="block text-[9px] mb-1">PRIMARY MODEL</MonoLabel><Input defaultValue="claude-3-5-haiku-latest" /></div>
              <div><MonoLabel className="block text-[9px] mb-1">FALLBACK PROVIDER</MonoLabel>
                <select className="w-full h-9 rounded-lg border border-milyfe-border bg-milyfe-surface px-3 text-sm text-milyfe-text">
                  <option>NVIDIA</option><option>OpenAI</option><option>Anthropic</option><option>Groq</option>
                </select></div>
              <div><MonoLabel className="block text-[9px] mb-1">FALLBACK MODEL</MonoLabel><Input defaultValue="meta/llama-3.3-70b-instruct" /></div>
            </div>
            <div><MonoLabel className="block text-[9px] mb-1">TEMPERATURE</MonoLabel><input type="range" min="0" max="100" defaultValue="70" className="w-full accent-milyfe-emerald" /><span className="text-xs text-milyfe-text-muted">0.7</span></div>
            <div><MonoLabel className="block text-[9px] mb-1">MAX TOKENS</MonoLabel><Input type="number" defaultValue="1024" /></div>
            <Button variant="gradient" size="sm">Save Routing</Button>
          </div>
        </TabsContent>

        <TabsContent value="actions">
          <div className="max-w-lg space-y-4">
            <MonoLabel className="block">QUICK ACTION CHIPS</MonoLabel>
            <p className="text-xs text-milyfe-text-muted">These appear as starter suggestions in the chat drawer.</p>
            <Textarea defaultValue={`Show me a sample response\nHow do you handle edge cases?\nGenerate a template\nWhat's your process?`} placeholder="One action per line" className="min-h-[120px]" />
            <Button variant="gradient" size="sm">Save Actions</Button>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg border border-milyfe-border p-4"><MonoLabel className="block text-[9px] mb-1">TOTAL DEPLOYMENTS</MonoLabel><span className="font-mono text-xl text-milyfe-gradient">{deployments}</span></div>
            <div className="rounded-lg border border-milyfe-border p-4"><MonoLabel className="block text-[9px] mb-1">CHAT SESSIONS (30D)</MonoLabel><span className="font-mono text-xl text-milyfe-text">{Math.floor(Math.random() * 50 + 10)}</span></div>
            <div className="rounded-lg border border-milyfe-border p-4"><MonoLabel className="block text-[9px] mb-1">AVG MSGS/SESSION</MonoLabel><span className="font-mono text-xl text-milyfe-text">{(Math.random() * 6 + 3).toFixed(1)}</span></div>
          </div>
          <p className="text-sm text-milyfe-text-muted text-center py-8">Detailed analytics charts will populate with production usage data.</p>
        </TabsContent>

        <TabsContent value="connections">
          <div className="space-y-4">
            <MonoLabel className="block">INTERCONNECTION RULES</MonoLabel>
            <p className="text-xs text-milyfe-text-muted">Select which agents this agent connects to in the factory visualization.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {mockAgentCatalog.filter(a => a.slug !== slug && a.category !== "platform").map(a => (
                <label key={a.slug} className="flex items-center gap-2 p-2 rounded border border-milyfe-border text-sm text-milyfe-text-muted hover:border-milyfe-cyan/30 cursor-pointer">
                  <input type="checkbox" defaultChecked={a.slug === "ops_reporting"} className="accent-milyfe-emerald" />
                  {a.name}
                </label>
              ))}
            </div>
            <Button variant="gradient" size="sm">Save Connections</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
