"use client";

import { motion } from "framer-motion";
import { staggerChildren, fadeInUp } from "@/lib/motion";
import { MiLyfeLockup } from "@/components/shared/MiLyfeLockup";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { SchematicGrid } from "@/components/shared/SchematicGrid";
import { Button } from "@/components/ui/button";
import { AuthAvatar } from "@/components/shared/AuthAvatar";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Background */}
      <SchematicGrid opacity={8} />

      {/* Floating gradient pins */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg className="h-full w-full opacity-20">
          <circle cx="15%" cy="30%" r="2" fill="#22C55E" className="animate-pulse" />
          <circle cx="80%" cy="20%" r="1.5" fill="#14B8B8" className="animate-pulse" />
          <circle cx="70%" cy="70%" r="2" fill="#1B7A8F" className="animate-pulse" />
          <circle cx="25%" cy="75%" r="1.5" fill="#22C55E" className="animate-pulse" />
        </svg>
      </div>

      {/* Top navigation bar */}
      <div className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12">
        <MiLyfeLockup size="sm" />
        <div className="flex items-center gap-4">
          <AuthAvatar />
          <Link href="/miforge/bespoke">
            <Button variant="ghost" size="sm">Commission a Forge</Button>
          </Link>
        </div>
      </div>

      {/* Hero content */}
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center"
      >
        <motion.div variants={fadeInUp}>
          <GradientHeadline size="hero" as="h1" className="max-w-4xl text-balance">
            Businesses used to be built with people. Now they&apos;re forged.
          </GradientHeadline>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="mt-6 max-w-xl text-lg text-milyfe-text-muted"
        >
          MiLyfe forges autonomous businesses. Staffed by agents. Built to run without you.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          <Link href="/factory/derek-adams">
            <Button variant="gradient" size="lg">See a Live Factory</Button>
          </Link>
          <Link href="/miforge/bespoke">
            <Button variant="ghost" size="lg">Commission a Forge</Button>
          </Link>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-12">
          <MonoLabel>MILYFE — HOUSE OF AUTONOMOUS INFRASTRUCTURE</MonoLabel>
        </motion.div>
      </motion.div>
    </section>
  );
}
