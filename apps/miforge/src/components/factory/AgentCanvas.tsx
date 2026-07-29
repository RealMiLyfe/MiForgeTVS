"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { staggerChildren, fadeInUp } from "@/lib/motion";
import { AgentCard } from "./AgentCard";
import { ConnectionPins } from "./ConnectionPins";
import { AddCustomAgentCard } from "./AddCustomAgentCard";
import { getConnections } from "@/lib/factory/connections";
import { calculateGridLayout } from "@/lib/factory/grid-layout";
import type { FactoryAgent, AgentCatalogEntry } from "@/lib/supabase/types";
import { Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AgentCanvasProps {
  agents: (FactoryAgent & { catalog?: AgentCatalogEntry })[];
  factorySlug: string;
  onTalkToAgent: (slug: string) => void;
}

export function AgentCanvas({ agents, factorySlug, onTalkToAgent }: AgentCanvasProps) {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  const slugs = agents.map((a) => a.catalog_slug);
  const connections = useMemo(() => getConnections(slugs), [slugs]);
  const layout = useMemo(() => calculateGridLayout(slugs, typeof window !== "undefined" ? window.innerWidth : 1200), [slugs]);

  const posMap = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    layout.positions.forEach((p) => m.set(p.slug, { x: p.x, y: p.y }));
    return m;
  }, [layout]);

  const connectedSlugs = useMemo(() => {
    if (!hoveredAgent) return new Set<string>();
    const s = new Set<string>();
    connections.forEach((c) => {
      if (c.from === hoveredAgent) s.add(c.to);
      if (c.to === hoveredAgent) s.add(c.from);
    });
    return s;
  }, [hoveredAgent, connections]);

  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Hammer className="h-12 w-12 text-milyfe-cyan mb-4" />
        <h2 className="font-fraunces text-2xl text-milyfe-text mb-2">This factory is unforged.</h2>
        <p className="text-milyfe-text-muted mb-6">Commission your first agent to begin.</p>
        <Link href={`/miforge/bespoke?prefill_factory=${factorySlug}`}>
          <Button variant="gradient">Start Forging →</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <ConnectionPins
        connections={connections}
        positions={posMap}
        hoveredAgent={hoveredAgent}
        cardWidth={280}
        cardHeight={200}
        gap={32}
      />
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className={`grid gap-6 ${
          layout.columns === 1 ? "grid-cols-1" :
          layout.columns === 2 ? "grid-cols-1 sm:grid-cols-2" :
          layout.columns === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" :
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }`}
      >
        {agents.map((agent) => (
          <motion.div key={agent.id} variants={fadeInUp}>
            <AgentCard
              agent={agent}
              factorySlug={factorySlug}
              onTalk={onTalkToAgent}
              isHovered={hoveredAgent === agent.catalog_slug}
              onHover={setHoveredAgent}
              connectedTo={connectedSlugs.has(agent.catalog_slug)}
            />
          </motion.div>
        ))}
        <motion.div variants={fadeInUp}>
          <AddCustomAgentCard factorySlug={factorySlug} />
        </motion.div>
      </motion.div>
    </div>
  );
}
