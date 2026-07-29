"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { MonoLabel } from "@/components/shared/MonoLabel";
import {
  MessageSquare,
  Mail,
  Share2,
  Package,
  BarChart3,
  Star,
} from "lucide-react";

const modules = [
  { icon: MessageSquare, name: "Customer Service", description: "Handles support tickets autonomously" },
  { icon: Mail, name: "Email Reactivation", description: "Wins back churned customers" },
  { icon: Share2, name: "Social Content", description: "Creates platform-native posts" },
  { icon: Package, name: "Fulfillment Monitor", description: "Tracks and flags shipments" },
  { icon: BarChart3, name: "Ops Reporting", description: "Generates daily intelligence" },
  { icon: Star, name: "Review Responder", description: "Crafts review responses" },
];

export function LiveAssemblyCinematic() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full bg-milyfe-surface py-20 md:py-[120px]">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-fraunces text-3xl md:text-4xl text-milyfe-text mb-16">
          What we build.
        </h2>

        <motion.div
          ref={ref}
          variants={staggerChildren}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {modules.map((module, i) => (
            <motion.div
              key={module.name}
              variants={fadeInUp}
              custom={i}
              className="relative rounded-xl border border-milyfe-border bg-milyfe-bg p-6 group hover:border-milyfe-cyan/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <module.icon className="h-5 w-5 text-milyfe-cyan" />
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-milyfe-emerald opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-milyfe-emerald" />
                  </span>
                  <MonoLabel className="text-milyfe-emerald">LIVE</MonoLabel>
                </div>
              </div>
              <h3 className="font-semibold text-milyfe-text mb-1">{module.name}</h3>
              <p className="text-sm text-milyfe-text-muted">{module.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Connection lines SVG */}
        {isInView && (
          <div className="relative mt-8 flex justify-center">
            <svg className="w-64 h-8 opacity-40" viewBox="0 0 256 32">
              <motion.path
                d="M 0 16 Q 64 0, 128 16 T 256 16"
                fill="none"
                stroke="url(#grad)"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0B1D3A" />
                  <stop offset="45%" stopColor="#1B7A8F" />
                  <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        <div className="text-center mt-8 space-y-4">
          <MonoLabel>FACTORY ASSEMBLY — REAL TIME</MonoLabel>
          <p className="text-milyfe-text-muted max-w-lg mx-auto">
            This is what your factory looks like on Day One. Every agent, deployed. Every connection, wired.
          </p>
        </div>
      </div>
    </section>
  );
}
