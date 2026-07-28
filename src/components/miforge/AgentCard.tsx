"use client";

import { StatusPill } from "@/components/shared/StatusPill";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import type { AgentCatalogEntry } from "@/lib/supabase/types";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

const categoryColors: Record<string, string> = {
  ecommerce_ops: "text-milyfe-cyan",
  sales_growth: "text-milyfe-teal",
  content: "text-milyfe-emerald",
  client_services: "text-milyfe-cyan",
  finance_ops: "text-milyfe-teal",
  recruitment: "text-milyfe-emerald",
  bespoke: "text-milyfe-emerald",
};

export function AgentCard({ agent }: { agent: AgentCatalogEntry }) {
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[agent.icon_name || "Bot"] || LucideIcons.Bot;
  const colorClass = categoryColors[agent.category] || "text-milyfe-cyan";
  const statusVariant = agent.status === "available" ? "active" : agent.status === "beta" ? "checkout" : "paused";

  return (
    <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6 flex flex-col h-full hover:border-milyfe-cyan/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <IconComponent className={`h-5 w-5 ${colorClass}`} />
        <StatusPill variant={statusVariant}>
          {agent.status === "available" ? "AVAILABLE" : agent.status === "beta" ? "BETA" : "COMING SOON"}
        </StatusPill>
      </div>
      <h3 className="font-fraunces text-lg text-milyfe-text mb-1">{agent.name}</h3>
      <div className="mb-2">
        <MonoLabel>{agent.category.replace("_", " ").toUpperCase()}</MonoLabel>
      </div>
      <p className="text-sm text-milyfe-text-muted mb-3 flex-1">{agent.description}</p>
      {agent.ideal_for && agent.ideal_for.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {agent.ideal_for.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-milyfe-surface-2 text-milyfe-text-muted border border-milyfe-border">
              {tag}
            </span>
          ))}
        </div>
      )}
      <Link href={`/miforge/bespoke?prefill_agent=${agent.slug}`}>
        <Button variant="ghost" size="sm" className="w-full">Add to My Factory →</Button>
      </Link>
    </div>
  );
}
