"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { subscribeToAgent } from "@/lib/factory/event-bus";
import * as LucideIcons from "lucide-react";
import type { AgentCatalogEntry, FactoryAgent } from "@/lib/supabase/types";

interface AgentCardProps {
  agent: FactoryAgent & { catalog?: AgentCatalogEntry };
  factorySlug: string;
  onTalk: (slug: string) => void;
  isHovered: boolean;
  onHover: (slug: string | null) => void;
  connectedTo?: boolean;
}

export function AgentCard({ agent, factorySlug, onTalk, isHovered, onHover, connectedTo }: AgentCardProps) {
  const [pulsing, setPulsing] = useState(false);
  const catalog = agent.catalog;
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[catalog?.icon_name || "Bot"] || LucideIcons.Bot;

  useEffect(() => {
    const unsub = subscribeToAgent(agent.catalog_slug, () => {
      setPulsing(true);
      setTimeout(() => setPulsing(false), 600);
    });
    return unsub;
  }, [agent.catalog_slug]);

  return (
    <motion.div
      layout
      onMouseEnter={() => onHover(agent.catalog_slug)}
      onMouseLeave={() => onHover(null)}
      className={`relative w-full rounded-xl border p-5 transition-all duration-200 cursor-pointer ${
        pulsing ? "border-milyfe-emerald shadow-lg shadow-milyfe-emerald/20" :
        isHovered ? "border-milyfe-cyan/60 -translate-y-0.5 shadow-md shadow-milyfe-emerald/10" :
        connectedTo ? "border-milyfe-cyan/30" :
        "border-milyfe-border"
      } bg-milyfe-surface`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Icon className={`h-5 w-5 text-milyfe-cyan transition-transform duration-200 ${isHovered ? "scale-105" : ""}`} />
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute h-full w-full rounded-full bg-milyfe-emerald opacity-75" />
            <span className="relative rounded-full h-1.5 w-1.5 bg-milyfe-emerald" />
          </span>
          <MonoLabel className="text-milyfe-cyan">LIVE · DEMO</MonoLabel>
        </div>
      </div>

      {/* Name + Description */}
      <h3 className="font-fraunces text-base text-milyfe-text mb-1">{catalog?.name || agent.catalog_slug}</h3>
      <p className="text-xs text-milyfe-text-muted line-clamp-2 mb-3">{catalog?.description}</p>

      {/* Divider */}
      <div className="h-px bg-milyfe-border my-3" />

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="gradient" size="sm" className="flex-1 text-xs" onClick={(e) => { e.stopPropagation(); onTalk(agent.catalog_slug); }}>
          Talk to Agent
        </Button>
        <Button variant="ghost" size="sm" className="text-xs" onClick={(e) => { e.stopPropagation(); window.location.href = `/factory/${factorySlug}/unlock?module=${agent.catalog_slug}`; }}>
          Unlock →
        </Button>
      </div>
    </motion.div>
  );
}
