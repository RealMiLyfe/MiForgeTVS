"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const categories = [
  { name: "Ecommerce Operations", count: 10, description: "Customer service, email, content, SEO, fulfillment, and more.", slug: "ecommerce_ops" },
  { name: "Sales & Growth", count: 5, description: "Outbound, qualification, scheduling, proposals, retention.", slug: "sales_growth" },
  { name: "Content & Marketing", count: 5, description: "Blog, newsletter, ads, YouTube, podcast, and more.", slug: "content" },
  { name: "Client Services", count: 4, description: "Onboarding, reporting, QA, project updates.", slug: "client_services" },
  { name: "Finance & Operations", count: 4, description: "Invoicing, expenses, financial snapshots, contract review.", slug: "finance_ops" },
  { name: "Recruitment & HR", count: 3, description: "Screening, coordination, onboarding documentation.", slug: "recruitment" },
];

export function CategoryGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="w-full bg-milyfe-bg py-20 md:py-[120px]">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <h2 className="text-center font-fraunces text-3xl md:text-4xl text-milyfe-text mb-16">
          Six categories. Thirty-one agents. Infinite combinations.
        </h2>
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          {categories.map((cat) => (
            <motion.div key={cat.slug} variants={fadeInUp}>
              <Link href={`/miforge/catalog?category=${cat.slug}`} className="block rounded-xl border border-milyfe-border bg-milyfe-surface p-6 hover:border-milyfe-cyan/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-milyfe-text">{cat.name}</h3>
                  <span className="font-mono text-xs text-milyfe-cyan">{cat.count} agents</span>
                </div>
                <p className="text-sm text-milyfe-text-muted">{cat.description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        {/* Bespoke wide card */}
        <motion.div variants={fadeInUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <div className="rounded-xl border-2 border-transparent bg-milyfe-surface p-8 text-center" style={{ borderImage: "linear-gradient(90deg, #0B1D3A, #1B7A8F, #22C55E) 1" }}>
            <h3 className="font-fraunces text-2xl text-milyfe-text mb-2">Bespoke Forge</h3>
            <p className="text-milyfe-text-muted mb-4">Don&apos;t see the agent you need? Describe it. We&apos;ll forge it.</p>
            <Link href="/miforge/bespoke">
              <Button variant="gradient">Commission a Custom Agent →</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
