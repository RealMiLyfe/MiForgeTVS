"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { HeroSection } from "@/components/miforge/HeroSection";
import { AgentCard } from "@/components/miforge/AgentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { mockAgentCatalog } from "@/lib/supabase/mocks";
import Link from "next/link";
import { Suspense } from "react";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const filteredAgents = useMemo(() => {
    return mockAgentCatalog.filter((agent) => {
      if (category !== "all" && agent.category !== category) return false;
      if (status !== "all" && agent.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          agent.name.toLowerCase().includes(q) ||
          agent.description?.toLowerCase().includes(q) ||
          agent.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [category, status, search]);

  return (
    <>
      <HeroSection
        headline="The Agent Catalog."
        subhead="Thirty-one pre-forged agents ready to deploy. Plus unlimited bespoke commissions."
        mono="31 AGENTS · 6 CATEGORIES · UNLIMITED CUSTOM"
      />

      {/* Filter Bar */}
      <div className="sticky top-0 z-30 w-full bg-milyfe-bg/95 backdrop-blur-md border-b border-milyfe-border py-4">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 rounded-lg border border-milyfe-border bg-milyfe-surface px-3 text-sm text-milyfe-text"
          >
            <option value="all">All Categories</option>
            <option value="ecommerce_ops">Ecommerce Ops</option>
            <option value="sales_growth">Sales & Growth</option>
            <option value="content">Content & Marketing</option>
            <option value="client_services">Client Services</option>
            <option value="finance_ops">Finance & Ops</option>
            <option value="recruitment">Recruitment & HR</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 rounded-lg border border-milyfe-border bg-milyfe-surface px-3 text-sm text-milyfe-text"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="beta">Beta</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
          <Input
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs h-9"
          />
          <span className="text-xs font-mono text-milyfe-text-muted ml-auto">{filteredAgents.length} agents</span>
        </div>
      </div>

      {/* Agent Grid */}
      <section className="w-full bg-milyfe-bg py-12">
        <div className="mx-auto max-w-6xl px-6">
          {filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <GradientHeadline size="card">No agents match those filters.</GradientHeadline>
              <p className="text-milyfe-text-muted mt-2">Adjust your filters, or commission a custom agent.</p>
              <Link href="/miforge/bespoke" className="mt-4 inline-block">
                <Button variant="gradient">Commission a Custom Agent →</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Custom Agent Callout */}
      <section className="w-full bg-milyfe-surface py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-fraunces text-2xl text-milyfe-text mb-2">Need something we haven&apos;t forged yet?</h2>
          <p className="text-milyfe-text-muted mb-6">Describe the role. We&apos;ll design the agent live, in real time.</p>
          <Link href="/miforge/bespoke">
            <Button variant="gradient">Start a Bespoke Forge →</Button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-milyfe-bg" />}>
      <CatalogContent />
    </Suspense>
  );
}
