"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { Layers, Zap, Infinity } from "lucide-react";

const props = [
  { icon: Layers, headline: "Forges Any Agent Role", body: "From customer service to legal intake to creative pipelines. If a human could do it repeatedly, we can forge an agent for it." },
  { icon: Zap, headline: "Deploys in Days, Not Months", body: "Every factory activates in 60-90 days. Custom agents typically ship in under three weeks. Speed is engineered into the process." },
  { icon: Infinity, headline: "Runs Without You", body: "Agents operate autonomously with human oversight only where it matters. Your factory produces work while you sleep, ship, or scale." },
];

export function ValuePropsGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="w-full bg-milyfe-surface py-20 md:py-[120px]">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <h2 className="text-center font-fraunces text-3xl md:text-4xl text-milyfe-text mb-16">
          Three things MiForge does that nothing else does.
        </h2>
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {props.map((p) => (
            <motion.div key={p.headline} variants={fadeInUp} className="rounded-xl border border-milyfe-border bg-milyfe-bg p-8">
              <p.icon className="h-6 w-6 text-milyfe-cyan mb-4" />
              <h3 className="font-semibold text-lg text-milyfe-text mb-2">{p.headline}</h3>
              <p className="text-sm text-milyfe-text-muted leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
