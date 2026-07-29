"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SchematicGrid } from "@/components/shared/SchematicGrid";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const statusMessages = [
  "Analyzing your intent...",
  "Selecting agents calibrated to your business...",
  "Wiring integration architecture...",
  "Generating activity patterns...",
  "Personalizing brand voice calibration...",
  "Finalizing your command center...",
];

interface PreviewGenerationSequenceProps {
  generating: boolean;
  previewSlug: string | null;
  businessName: string | null;
  agentCount: number;
  tier: string | null;
  onClose: () => void;
}

export function PreviewGenerationSequence({
  generating,
  previewSlug,
  businessName,
  agentCount,
  tier,
  onClose,
}: PreviewGenerationSequenceProps) {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (!generating) return;
    setStatusIndex(0);
    const interval = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev >= statusMessages.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [generating]);

  return (
    <AnimatePresence>
      {(generating || previewSlug) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-milyfe-bg"
        >
          <SchematicGrid opacity={generating ? 12 : 5} />

          <div className="relative z-10 text-center max-w-xl px-6">
            {generating && !previewSlug && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <MonoLabel>FORGING YOUR PREVIEW...</MonoLabel>
                <div className="h-1 bg-milyfe-surface-2 rounded-full overflow-hidden max-w-xs mx-auto">
                  <motion.div
                    className="h-full bg-milyfe-gradient rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((statusIndex + 1) / statusMessages.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-sm text-milyfe-text-muted italic">
                  {statusMessages[statusIndex]}
                </p>
              </motion.div>
            )}

            {previewSlug && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <GradientHeadline size="hero">
                  Your factory is ready to explore.
                </GradientHeadline>
                <p className="text-milyfe-text-muted max-w-lg mx-auto">
                  This is a preview built specifically for you. Every agent, every
                  connection, every simulation is calibrated to what you shared.
                </p>

                <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6 text-left max-w-sm mx-auto space-y-2">
                  <MonoLabel className="block">YOUR PREVIEW FACTORY</MonoLabel>
                  <p className="text-sm text-milyfe-text">
                    Business context: {businessName || "Your Business"}
                  </p>
                  <p className="text-sm text-milyfe-text-muted">
                    Recommended agents: {agentCount} from the catalog
                  </p>
                  <p className="text-sm text-milyfe-text-muted">
                    Recommended tier: {tier || "Standard"}
                  </p>
                  <p className="text-[10px] text-milyfe-text-muted mt-3">
                    This preview expires in 30 days. Commission activation to make it permanent.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/factory/${previewSlug}`}>
                    <Button variant="gradient" size="lg">
                      Enter Your Factory →
                    </Button>
                  </Link>
                  <Button variant="ghost" size="lg" onClick={onClose}>
                    Return to Concierge
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
