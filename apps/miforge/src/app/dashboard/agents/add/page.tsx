"use client";

import { useState, useMemo } from "react";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockAgentCatalog, mockFactories, mockFactoryAgents } from "@/lib/supabase/mocks";
import { useAuth } from "@/components/providers/AuthProvider";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

export default function AddAgentPage() {
  const { user } = useAuth();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const factory = useMemo(() => {
    if (!user) return null;
    return mockFactories.find(f => f.owner_user_id === user.id) || mockFactories[0];
  }, [user]);

  const activeAgentSlugs = useMemo(() => {
    if (!factory) return new Set<string>();
    return new Set(mockFactoryAgents.filter(a => a.factory_id === factory.id).map(a => a.catalog_slug));
  }, [factory]);

  const agents = useMemo(() => {
    return mockAgentCatalog.filter(a => {
      if (a.category === "platform") return false;
      if (a.status === "bespoke_only") return false;
      if (category !== "all" && a.category !== category) return false;
      if (search) return a.name.toLowerCase().includes(search.toLowerCase());
      return true;
    });
  }, [category, search]);

  return (
    <div className="space-y-8">
      <div>
        <GradientHeadline size="card" as="h1">Add an Agent to Your Factory.</GradientHeadline>
        <p className="text-sm text-milyfe-text-muted mt-1">Every agent shown here is pre-forged and ready to activate within 72 hours.</p>
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
        </select>
        <Input placeholder="Search agents..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs h-9" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(a => {
          const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{className?: string}>>)[a.icon_name || "Bot"] || LucideIcons.Bot;
          const alreadyActive = activeAgentSlugs.has(a.slug);
          return (
            <div key={a.id} className={`rounded-xl border p-5 ${alreadyActive ? "border-milyfe-border/50 opacity-60" : "border-milyfe-border"} bg-milyfe-surface`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className="h-5 w-5 text-milyfe-cyan" />
                {alreadyActive && <MonoLabel className="text-milyfe-emerald">ALREADY ACTIVE</MonoLabel>}
              </div>
              <h3 className="font-fraunces text-sm text-milyfe-text mb-1">{a.name}</h3>
              <p className="text-xs text-milyfe-text-muted mb-3 line-clamp-2">{a.description}</p>
              <Button variant={alreadyActive ? "ghost" : "gradient"} size="sm" className="w-full" disabled={alreadyActive}>
                {alreadyActive ? "Already Active" : "Add to My Factory →"}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <Link href="/dashboard/agents/bespoke"><Button variant="ghost">Need something custom? Forge a Bespoke Agent →</Button></Link>
      </div>
    </div>
  );
}
