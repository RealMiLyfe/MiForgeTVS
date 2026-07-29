"use client";

import { useState, useMemo } from "react";
import { HeroSection } from "@/components/miforge/HeroSection";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockFactories, mockFactoryAgents } from "@/lib/supabase/mocks";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

export default function FactoriesPage() {
  const [industry, setIndustry] = useState("all");
  const [sort, setSort] = useState("recent");
  const [search, setSearch] = useState("");

  const factories = useMemo(() => {
    let filtered = mockFactories.filter(f => f.is_specimen || f.slug === "derek-adams");
    if (industry !== "all") filtered = filtered.filter(f => f.niche?.toLowerCase().includes(industry));
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(f => f.business_name.toLowerCase().includes(q) || f.contact_name.toLowerCase().includes(q) || f.niche?.toLowerCase().includes(q));
    }
    if (sort === "alpha") filtered.sort((a, b) => a.business_name.localeCompare(b.business_name));
    if (sort === "agents") filtered.sort((a, b) => getAgentCount(b.id) - getAgentCount(a.id));
    return filtered;
  }, [industry, sort, search]);

  const totalAgents = mockFactoryAgents.length;

  return (
    <>
      <HeroSection
        headline="Factories in the field."
        subhead="Every operator forges a factory shaped to their business. Here are some of them."
        mono={`${factories.length} SPECIMEN FACTORIES · ${totalAgents} AGENTS DEPLOYED`}
      />
      {/* Filter Bar */}
      <div className="sticky top-0 z-30 w-full bg-milyfe-bg/95 backdrop-blur-md border-b border-milyfe-border py-4">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center gap-3">
          <select value={industry} onChange={e => setIndustry(e.target.value)} className="h-9 rounded-lg border border-milyfe-border bg-milyfe-surface px-3 text-sm text-milyfe-text">
            <option value="all">All Industries</option>
            <option value="ecommerce">Ecommerce</option>
            <option value="saas">SaaS</option>
            <option value="legal">Legal</option>
            <option value="consulting">Consulting</option>
            <option value="content">Content</option>
            <option value="fintech">Fintech</option>
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="h-9 rounded-lg border border-milyfe-border bg-milyfe-surface px-3 text-sm text-milyfe-text">
            <option value="recent">Recently Forged</option>
            <option value="alpha">Alphabetical</option>
            <option value="agents">Agent Count</option>
          </select>
          <Input placeholder="Search factories..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs h-9" />
        </div>
      </div>
      {/* Grid */}
      <section className="w-full bg-milyfe-bg py-12">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatePresence mode="wait">
            {factories.length > 0 ? (
              <motion.div key="grid" layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {factories.map(f => (
                  <motion.div key={f.id} variants={fadeInUp} initial="hidden" animate="visible" exit="hidden" layout>
                    <Link href={`/factory/${f.slug}`} className="block rounded-xl border border-milyfe-border bg-milyfe-surface p-6 hover:border-milyfe-cyan/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-milyfe-emerald/5 transition-all">
                      <div className="flex justify-between mb-3">
                        <MonoLabel>#{String(f.factory_number).padStart(3, "0")}</MonoLabel>
                        <MonoLabel className="text-milyfe-teal">SPECIMEN</MonoLabel>
                      </div>
                      <h3 className="font-fraunces text-xl text-milyfe-text mb-1">{f.business_name}</h3>
                      <p className="text-sm text-milyfe-text-muted mb-1">{f.contact_name}</p>
                      <p className="text-xs text-milyfe-text-muted mb-3">{f.niche}</p>
                      <div className="h-px bg-milyfe-border my-3" />
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-milyfe-emerald opacity-75" /><span className="relative rounded-full h-2 w-2 bg-milyfe-emerald" /></span>
                        <MonoLabel>{getAgentCount(f.id)} AGENTS ACTIVE</MonoLabel>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <GradientHeadline size="card">No factories match those filters.</GradientHeadline>
                <p className="text-milyfe-text-muted mt-2">Adjust your filters, or commission a factory built for your specific needs.</p>
                <Link href="/miforge/bespoke" className="mt-4 inline-block"><Button variant="gradient">Commission a Forge →</Button></Link>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
      {/* Closing CTA */}
      <section className="w-full bg-milyfe-surface py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <GradientHeadline size="section">Your factory belongs here too.</GradientHeadline>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/miforge/bespoke"><Button variant="gradient" size="lg">Commission a Forge →</Button></Link>
            <Link href="/miforge/pricing"><Button variant="ghost" size="lg">See Pricing →</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}

function getAgentCount(factoryId: string): number {
  return mockFactoryAgents.filter(a => a.factory_id === factoryId).length;
}
