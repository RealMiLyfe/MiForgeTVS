"use client";

import { HeroSection } from "@/components/miforge/HeroSection";
import { ValuePropsGrid } from "@/components/miforge/ValuePropsGrid";
import { CategoryGrid } from "@/components/miforge/CategoryGrid";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { Button } from "@/components/ui/button";
import { MonoLabel } from "@/components/shared/MonoLabel";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

function HowItWorksPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const steps = [
    { num: "01", title: "Scope", desc: "Describe your business. We map the agents you need." },
    { num: "02", title: "Forge", desc: "We build your factory. Every agent calibrated to your voice, your data, your platforms." },
    { num: "03", title: "Deploy", desc: "Agents go live. Human oversight where it matters. Autonomous everywhere else." },
    { num: "04", title: "Scale", desc: "As your business grows, add agents. Or commission custom ones. The factory expands with you." },
  ];

  return (
    <section className="w-full bg-milyfe-surface py-20 md:py-[120px]" ref={ref}>
      <div className="mx-auto max-w-5xl px-6">
        <motion.div variants={staggerChildren} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <motion.div key={s.num} variants={fadeInUp} className="text-center">
              <div className="font-mono text-2xl text-milyfe-gradient font-bold mb-2">{s.num}</div>
              <h3 className="font-semibold text-milyfe-text mb-1">{s.title}</h3>
              <p className="text-xs text-milyfe-text-muted">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-10">
          <Link href="/miforge/how-it-works">
            <Button variant="ghost">See the Full Process →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function SixLayerStandard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="w-full bg-milyfe-surface py-20 md:py-[120px]" ref={ref}>
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="font-fraunces text-3xl md:text-4xl text-milyfe-text mb-4">
          Every factory is staffed to the business it serves.
        </h2>
        <p className="text-milyfe-text-muted max-w-2xl mx-auto mb-12">
          There is no fixed configuration. Derek&apos;s factory runs 7 agents. Your factory runs exactly what your business needs.
        </p>
        <motion.div variants={staggerChildren} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Derek Adams", niche: "Novelty Ecommerce", agents: 7 },
            { name: "Bloom Beauty", niche: "DTC Beauty", agents: 7 },
            { name: "PulseSaaS", niche: "SaaS Agency", agents: 7 },
          ].map((f) => (
            <motion.div key={f.name} variants={fadeInUp} className="rounded-xl border border-milyfe-border bg-milyfe-bg p-6">
              <MonoLabel className="block mb-2">{f.niche.toUpperCase()}</MonoLabel>
              <h3 className="font-semibold text-milyfe-text mb-1">{f.name}</h3>
              <p className="text-sm text-milyfe-text-muted">{f.agents} agents deployed</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {Array.from({ length: f.agents }).map((_, i) => (
                  <div key={i} className="h-3 w-3 rounded-full bg-milyfe-emerald/30 border border-milyfe-emerald/50" />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function MiForgePage() {
  return (
    <>
      <HeroSection
        headline="MiForge forges agents. Any role. Any business. Any scale."
        subhead="Commission the agents your business needs. We forge them, deploy them, and keep them running. You focus on the work only a human can do."
        primaryCta={{ text: "Browse the Catalog →", href: "/miforge/catalog" }}
        ghostCta={{ text: "See a Live Factory →", href: "/factory/derek-adams" }}
        mono="31 PRE-FORGED AGENTS · UNLIMITED CUSTOM · POWERED BY MILYFE"
      />
      <ValuePropsGrid />
      <CategoryGrid />
      <SixLayerStandard />
      <HowItWorksPreview />
      {/* Closing CTA */}
      <section className="w-full bg-milyfe-bg py-24 md:py-36">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <GradientHeadline size="section">Your factory is waiting to be forged.</GradientHeadline>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/miforge/bespoke"><Button variant="gradient" size="lg">Commission a Forge →</Button></Link>
            <Link href="/miforge/pricing"><Button variant="ghost" size="lg">See Pricing →</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
