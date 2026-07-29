"use client";

import { HeroSection } from "@/components/miforge/HeroSection";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import Link from "next/link";

const phases = [
  {
    phase: "PHASE 1", title: "SCOPING", days: "Days 0-7",
    what: "We meet. We map your operational surface. We define which agents your factory needs and how they'll work together.",
    deliverables: ["Scoping call", "Written scope document", "Agent selection", "Timeline confirmation"],
    involvement: "2-3 hours across two calls",
  },
  {
    phase: "PHASE 2", title: "FORGING", days: "Days 7-30",
    what: "We build. Every agent calibrated to your business context. Brand voice trained. Platforms wired. Test runs against sandboxed data.",
    deliverables: ["All agents built", "Integration wiring complete", "Test suite passing", "Brand voice validated"],
    involvement: "Minimal — you approve outputs, we handle everything else",
  },
  {
    phase: "PHASE 3", title: "DEPLOYMENT", days: "Days 30-60",
    what: "Agents go live one by one. We monitor closely. You oversee outputs. We tune based on real-world performance.",
    deliverables: ["Sequential agent activation", "Weekly optimization cycles", "Human review checkpoints", "Refinement iterations"],
    involvement: "3-5 hours per week reviewing agent outputs",
  },
  {
    phase: "PHASE 4", title: "AUTONOMY", days: "Days 60-90+",
    what: "Your factory is running. Human oversight drops to under 5 hours per week. Weekly reports keep you informed without requiring involvement.",
    deliverables: ["Full autonomous operation", "Weekly ops reports", "Ongoing optimization", "Custom agent additions on demand"],
    involvement: "3-5 hours per week reviewing reports and approving strategy",
  },
];

const differentiators = [
  { title: "Bespoke, Not Templated", body: "Every factory is built for one operator. Nothing is generic." },
  { title: "Living Systems", body: "Agents improve continuously. Weekly optimization is standard." },
  { title: "Human Where It Matters", body: "We don't replace judgment. We remove repetition." },
];

const guarantees = [
  { title: "7-Day Refund Window", body: "If we haven't earned it, you don't pay." },
  { title: "Cancel Anytime After Minimum", body: "Retainer is month-to-month after your tier's commitment." },
  { title: "You Own the Outputs", body: "Everything your agents produce is yours. Full IP, no lock-in." },
];

export default function HowItWorksPage() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(timelineRef, { once: true, margin: "-50px" });

  return (
    <>
      <HeroSection
        headline="How a factory is forged."
        subhead="A precise, deliberate process. Sixty to ninety days from commission to full autonomy."
      />

      {/* Timeline */}
      <section className="w-full bg-milyfe-bg py-20 md:py-[120px]" ref={timelineRef}>
        <div className="mx-auto max-w-4xl px-6">
          <motion.div variants={staggerChildren} initial="hidden" animate={isInView ? "visible" : "hidden"} className="relative">
            {/* Gradient line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-milyfe-navy via-milyfe-teal to-milyfe-emerald" />

            <div className="space-y-12">
              {phases.map((p) => (
                <motion.div key={p.phase} variants={fadeInUp} className="relative pl-12 md:pl-20">
                  <div className="absolute left-2 md:left-6 top-2 h-4 w-4 rounded-full bg-milyfe-gradient border-2 border-milyfe-bg" />
                  <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <MonoLabel className="text-milyfe-cyan">{p.phase}</MonoLabel>
                      <MonoLabel>{p.days}</MonoLabel>
                    </div>
                    <h3 className="font-fraunces text-2xl text-milyfe-text mb-3">{p.title}</h3>
                    <p className="text-milyfe-text-muted mb-4">{p.what}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <MonoLabel className="block mb-2">DELIVERABLES</MonoLabel>
                        <ul className="space-y-1">
                          {p.deliverables.map((d) => (
                            <li key={d} className="text-sm text-milyfe-text-muted flex items-center gap-2">
                              <span className="text-milyfe-emerald">·</span> {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <MonoLabel className="block mb-2">YOUR INVOLVEMENT</MonoLabel>
                        <p className="text-sm text-milyfe-text-muted">{p.involvement}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="w-full bg-milyfe-surface py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-fraunces text-3xl text-milyfe-text mb-12">What Makes It Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {differentiators.map((d) => (
              <div key={d.title} className="text-center p-6">
                <h3 className="font-semibold text-milyfe-text mb-2">{d.title}</h3>
                <p className="text-sm text-milyfe-text-muted">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="w-full bg-milyfe-bg py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guarantees.map((g) => (
              <div key={g.title} className="rounded-lg border border-milyfe-border p-5 text-center">
                <h4 className="font-medium text-milyfe-text text-sm mb-1">{g.title}</h4>
                <p className="text-xs text-milyfe-text-muted">{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="w-full bg-milyfe-surface py-24">
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
