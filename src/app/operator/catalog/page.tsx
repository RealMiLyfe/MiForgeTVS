"use client";

import { useState, useMemo } from "react";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockAgentCatalog, mockFactoryAgents } from "@/lib/supabase/mocks";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

export default function OperatorCatalogPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const agents = useMemo(() => {
    return mockAgentCatalog.filter(a => {
      if (category !== "all" && a.category !== category) return false;
      if (search) return a.name.toLowerCase().includes(search.toLowerCase()) || a.slug.includes(search.toLowerCase());
      return true;
    });
  }, [category, search]);

  const available = mockAgentCatalog.filter(a => a.status === "available").length;
  const beta = mockAgentCatalog.filter(a => a.status === "beta").length;
  const platformOnly = mockAgentCatalog.filter(a => a.status === "platform_only").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <GradientHeadline size="card" as="h1">Agent Catalog.</GradientHeadline>
          <p className="text-sm text-milyfe-text-muted mt-1">{mockAgentCatalog.length} agents · {available} available · {beta} beta · {platformOnly} platform-only</p>
        </div>
        <Link href="/operator/catalog/new"><Button variant="gradient" size="sm">+ Add Catalog Agent</Button></Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={category} onChange={e => setCategory(e.target.value)} className="h-9 rounded-lg border border-milyfe-border bg-milyfe-surface px-3 text-sm text-milyfe-text">
          <option value="all">All Categories</option>
          <option value="ecommerce_ops">Ecommerce Ops</option>
          <option value="sales_growth">Sales & Growth</option>
          <option value="content">Content</option>
          <option value="client_services">Client Services</option>
          <option value="finance_ops">Finance</option>
          <option value="recruitment">Recruitment</option>
          <option value="platform">Platform</option>
        </select>
        <Input placeholder="Search catalog..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs h-9" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(a => {
          const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{className?: string}>>)[a.icon_name || "Bot"] || LucideIcons.Bot;
          const deployments = mockFactoryAgents.filter(fa => fa.catalog_slug === a.slug).length;
          const statusVariant = a.status === "available" ? "active" : a.status === "beta" ? "checkout" : a.status === "platform_only" ? "demo" : "paused";
          return (
            <div key={a.id} className="rounded-xl border border-milyfe-border bg-milyfe-surface p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon className="h-5 w-5 text-milyfe-cyan" />
                <StatusPill variant={statusVariant}>{a.status === "available" ? "AVAILABLE" : a.status === "beta" ? "BETA" : a.status === "platform_only" ? "PLATFORM" : a.status.toUpperCase().replace("_", " ")}</StatusPill>
              </div>
              <h3 className="font-fraunces text-sm text-milyfe-text mb-1">{a.name}</h3>
              <MonoLabel className="text-[9px] block mb-2">{a.category.replace("_", " ").toUpperCase()}</MonoLabel>
              <p className="text-xs text-milyfe-text-muted line-clamp-2 mb-3">{a.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-milyfe-text-muted">{deployments} deployments</span>
                <Link href={`/operator/catalog/${a.slug}`}><Button variant="ghost" size="sm" className="text-[10px]">Edit →</Button></Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
