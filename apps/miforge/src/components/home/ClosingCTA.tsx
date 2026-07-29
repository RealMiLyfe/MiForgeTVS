"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeInUp } from "@/lib/motion";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ClosingCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="w-full bg-milyfe-surface py-24 md:py-36" ref={ref}>
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mx-auto max-w-3xl px-6 text-center"
      >
        <GradientHeadline size="section">
          You didn&apos;t stumble here. You were looking for this.
        </GradientHeadline>

        <div className="mt-10">
          <Link href="/factory/derek-adams">
            <Button variant="gradient" size="xl">
              See a Live Factory →
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
