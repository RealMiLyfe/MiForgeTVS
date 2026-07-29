"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const products = [
  {
    name: "MiForge",
    tagline: "SaaS Factory. Forges and deploys AI agents into live businesses.",
    status: "active" as const,
    badge: "LIVE",
    mono: "31 AGENTS · UNLIMITED CUSTOM",
    href: "/miforge",
    ctaText: "Explore MiForge →",
  },
  {
    name: "MiVault",
    tagline: "Autonomous financial operations for owner-operators.",
    status: "paused" as const,
    badge: "SOON",
    mono: null,
    href: "/miforge/pricing#waitlist",
    ctaText: "Join Waitlist →",
  },
  {
    name: "MiSignal",
    tagline: "Real-time intelligence layer for autonomous businesses.",
    status: "paused" as const,
    badge: "SOON",
    mono: null,
    href: "/miforge/pricing#waitlist",
    ctaText: "Join Waitlist →",
  },
  {
    name: "MiReach",
    tagline: "Outbound growth systems, forged and deployed.",
    status: "paused" as const,
    badge: "SOON",
    mono: null,
    href: "/miforge/pricing#waitlist",
    ctaText: "Join Waitlist →",
  },
];

export function ProductsShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="w-full bg-milyfe-surface py-20 md:py-[120px]">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <h2 className="text-center font-fraunces text-3xl md:text-4xl text-milyfe-text mb-16">
          What lives inside MiLyfe.
        </h2>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product.name}
              variants={fadeInUp}
              className="relative rounded-xl border border-milyfe-border bg-milyfe-bg p-6 md:p-8 flex flex-col"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <StatusPill variant={product.status}>
                  {product.badge}
                </StatusPill>
              </div>

              {/* Content */}
              <h3 className="font-fraunces text-2xl text-milyfe-text mb-2">
                {product.name}
              </h3>
              <p className="text-milyfe-text-muted mb-4 flex-1">
                {product.tagline}
              </p>
              {product.mono && (
                <div className="mb-4">
                  <MonoLabel>{product.mono}</MonoLabel>
                </div>
              )}
              <Link href={product.href}>
                <Button variant={product.status === "active" ? "gradient" : "ghost"} size="sm">
                  {product.ctaText}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
