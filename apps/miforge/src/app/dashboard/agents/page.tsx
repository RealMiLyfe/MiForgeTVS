"use client";

import { useState, useMemo } from "react";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockFactories, mockFactoryAgents, mockAgentCatalog } from "@/lib/supabase/mocks";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

export default function AgentsPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");

  const factory = useMemo(() => {
    if (!user) return null;
    return mockFactories.find(f => f.owner_user_id === user.id) || mockFactories[0];
  }, [user]);

  const agents = useMemo(() => {
    if (!factory) return [];
    return mockFactoryAgents
      .filter(a => a.factory_id === factory.id)
      .map(a => ({ ...a, catalog: mockAgentCatalog.find(c => c.slug === a.catalog_slug) }));
  }, [factory]);

  const filtered = useMemo(() => {
    return agents.filter(a => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (categoryFilter !== "all" && a.catalog?.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return a.catalog?.name.toLowerCase().includes(q) || a.catalog_slug.includes(q);
      }
      return true;
    });
  }, [agents, statusFilter, categoryFilter, search]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <GradientHeadline size="card" as="h1">Your Agents.</GradientHeadline>
          <p className="text-sm text-milyfe-text-muted mt-1">{agents.length} agents active in your factory. Chat with any of them, review their work, or add more.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/agents/add"><Button variant="ghost" size="sm">+ Add from Catalog</Button></Link>
          <Link href="/dashboard/agents/bespoke"><Button variant="gradient" size="sm">+ Forge Custom Agent</Button></Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-lg border border-milyfe-border bg-milyfe-surface px-3 text-sm text-milyfe-text">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="demo">Demo</option>
          <option value="paused">Paused</option>
        </select>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="h-9 rounded-lg border border-milyfe-border bg-milyfe-surface px-3 text-sm text-milyfe-text">
          <option value="all">All Categories</option>
          <option value="ecommerce_ops">Ecommerce Ops</option>
          <option value="sales_growth">Sales & Growth</option>
          <option value="content">Content</option>
          <option value="client_services">Client Services</option>
          <option value="finance_ops">Finance</option>
          <option value="recruitment">Recruitment</option>
        </select>
        <Input placeholder="Search agents..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs h-9" />
        <MonoLabel className="ml-auto">{filtered.length} AGENTS</MonoLabel>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(a => {
          const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{className?: string}>>)[a.catalog?.icon_name || "Bot"] || LucideIcons.Bot;
          return (
            <div key={a.id} className="rounded-xl border border-milyfe-border bg-milyfe-surface p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-milyfe-cyan" />
                  <span className="font-fraunces text-sm text-milyfe-text">{a.catalog?.name || a.catalog_slug}</span>
                </div>
                <StatusPill variant={a.status === "active" ? "active" : a.status === "paused" ? "paused" : "demo"} />
              </div>
              <div className="flex gap-4 text-xs font-mono text-milyfe-text-muted mb-3">
                <span>{Math.floor(Math.random() * 200 + 50)} tasks/wk</span>
                <span>~{Math.floor(Math.random() * 5 + 1)}s avg</span>
              </div>
              <div className="mt-auto flex gap-2">
                <Link href={`/dashboard/agents/${a.catalog_slug}`} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full text-xs">Manage →</Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add agent callout */}
      <div className="rounded-xl border-2 border-dashed border-milyfe-border p-8 text-center">
        <h3 className="font-fraunces text-lg text-milyfe-text mb-2">Want to add more agents?</h3>
        <p className="text-sm text-milyfe-text-muted mb-4">Browse the catalog for pre-forged agents, or commission a custom one.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard/agents/add"><Button variant="ghost">Browse Catalog</Button></Link>
          <Link href="/dashboard/agents/bespoke"><Button variant="gradient">Forge Custom</Button></Link>
        </div>
      </div>
    </div>
  );
}
