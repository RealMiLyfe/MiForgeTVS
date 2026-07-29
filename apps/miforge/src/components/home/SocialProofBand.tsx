"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { MonoLabel } from "@/components/shared/MonoLabel";

const industries = [
  "Novelty Ecommerce",
  "DTC Beauty",
  "SaaS Agencies",
  "Content Studios",
  "Fintech Ops",
  "Legal",
  "Consulting",
];

const metrics = [
  { value: "13", label: "Factories Forged" },
  { value: "91", label: "Agents Deployed" },
  { value: "2,548", label: "Autonomous Hours Reclaimed / Month" },
];

export function SocialProofBand() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="w-full bg-milyfe-bg py-16 md:py-20" ref={ref}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-8">
          <MonoLabel>CURRENTLY FORGING FOR</MonoLabel>
        </div>

        {/* Industry labels */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12">
          {industries.map((industry, i) => (
            <span key={industry} className="text-sm text-milyfe-text-muted">
              {industry}
              {i < industries.length - 1 && (
                <span className="ml-2 md:ml-4 text-milyfe-border">·</span>
              )}
            </span>
          ))}
        </div>

        {/* Metrics grid */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {metrics.map((metric) => (
            <motion.div
              key={metric.label}
              variants={fadeInUp}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-mono font-bold text-milyfe-gradient mb-2">
                {metric.value}
              </div>
              <p className="text-sm text-milyfe-text-muted">{metric.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
