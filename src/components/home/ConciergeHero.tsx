"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { staggerChildren, fadeInUp } from "@/lib/motion";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { MiLyfeLockup } from "@/components/shared/MiLyfeLockup";
import { SchematicGrid } from "@/components/shared/SchematicGrid";
import { AuthAvatar } from "@/components/shared/AuthAvatar";
import { Button } from "@/components/ui/button";
import { Compass, Send } from "lucide-react";
import Link from "next/link";

export function ConciergeHero() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    router.push(`/discover?message=${encodeURIComponent(message.trim())}`);
  };

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
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
          <GradientHeadline size="hero" as="h1" className="max-w-3xl text-balance">
            What is your business actually asking for?
          </GradientHeadline>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="mt-6 max-w-xl text-lg text-milyfe-text-muted"
        >
          Every autonomous factory starts with a conversation. Not a form.
        </motion.p>

        {/* Concierge invitation card */}
        <motion.div
          variants={fadeInUp}
          className="mt-10 w-full max-w-[720px] rounded-xl border border-milyfe-border bg-milyfe-surface p-8 md:p-10 text-left"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <Compass className="h-5 w-5 text-milyfe-cyan" />
            <MonoLabel>THE FORGE CONCIERGE</MonoLabel>
          </div>

          <p className="font-fraunces text-xl text-milyfe-text mb-2">
            Start with a conversation.
          </p>
          <p className="text-sm text-milyfe-text-muted mb-6">
            Tell me about your business in your own words. I&apos;ll help you see what
            autonomous infrastructure could actually mean for you — and whether
            MiForge is the right fit.
          </p>

          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="What's happening in your business right now?"
              className="w-full resize-none rounded-lg border border-milyfe-border bg-milyfe-bg px-4 py-3 pr-12 text-sm text-milyfe-text placeholder:text-milyfe-text-muted focus:outline-none focus:ring-2 focus:ring-milyfe-emerald/30 focus:border-milyfe-emerald/50 min-h-[56px] max-h-[120px]"
              rows={2}
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="absolute right-3 top-3 h-8 w-8 rounded-lg bg-milyfe-gradient flex items-center justify-center text-white disabled:opacity-30 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <p className="text-[11px] text-milyfe-text-muted mt-3">
            No sign-up required. No email captured. Just a conversation.
          </p>
        </motion.div>

        {/* Alternative CTAs */}
        <motion.div variants={fadeInUp} className="mt-8 flex flex-col sm:flex-row items-center gap-4 text-sm">
          <Link href="/factory/derek-adams" className="text-milyfe-text-muted hover:text-milyfe-cyan transition-colors">
            Or — see a live factory first →
          </Link>
          <span className="hidden sm:inline text-milyfe-border">·</span>
          <Link href="/miforge" className="text-milyfe-text-muted hover:text-milyfe-cyan transition-colors">
            Or — browse what we build →
          </Link>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-12 mb-8">
          <MonoLabel>MILYFE — HOUSE OF AUTONOMOUS INFRASTRUCTURE</MonoLabel>
        </motion.div>
      </motion.div>
    </section>
  );
}
