"use client";

import { motion } from "framer-motion";
import { staggerChildren, fadeInUp } from "@/lib/motion";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { SchematicGrid } from "@/components/shared/SchematicGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroSectionProps {
  headline: string;
  subhead: string;
  mono?: string;
  primaryCta?: { text: string; href: string };
  ghostCta?: { text: string; href: string };
}

export function HeroSection({ headline, subhead, mono, primaryCta, ghostCta }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden py-24 md:py-32">
      <SchematicGrid opacity={8} />
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <motion.div variants={fadeInUp}>
          <GradientHeadline size="hero" as="h1" className="text-balance">
            {headline}
          </GradientHeadline>
        </motion.div>
        <motion.p variants={fadeInUp} className="mt-6 max-w-2xl mx-auto text-lg text-milyfe-text-muted">
          {subhead}
        </motion.p>
        {(primaryCta || ghostCta) && (
          <motion.div variants={fadeInUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {primaryCta && (
              <Link href={primaryCta.href}>
                <Button variant="gradient" size="lg">{primaryCta.text}</Button>
              </Link>
            )}
            {ghostCta && (
              <Link href={ghostCta.href}>
                <Button variant="ghost" size="lg">{ghostCta.text}</Button>
              </Link>
            )}
          </motion.div>
        )}
        {mono && (
          <motion.div variants={fadeInUp} className="mt-10">
            <MonoLabel>{mono}</MonoLabel>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
