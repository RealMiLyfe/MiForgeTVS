"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeInUp } from "@/lib/motion";
import { ScanlineOverlay } from "@/components/shared/ScanlineOverlay";
import Link from "next/link";

export function ManifestoExcerpt() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="relative w-full bg-milyfe-bg py-24 md:py-40" ref={ref}>
      <ScanlineOverlay opacity={3} />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-20 mx-auto max-w-[900px] px-6 text-center"
      >
        <blockquote className="font-fraunces text-2xl md:text-3xl lg:text-4xl leading-relaxed text-milyfe-gradient">
          &ldquo;The era of hiring humans to do repetitive work is over.
          We&apos;re not automating jobs.
          We&apos;re forging the businesses that come next.&rdquo;
        </blockquote>

        <Link
          href="/manifesto"
          className="inline-block mt-8 text-sm text-milyfe-cyan hover:underline"
        >
          Read the full manifesto →
        </Link>
      </motion.div>
    </section>
  );
}
