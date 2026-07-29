"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, X, Minus } from "lucide-react";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { ConciergeChat } from "./ConciergeChat";
import { isConciergeWidgetVisible } from "@/lib/concierge/widget-visibility";

export function ConciergeWidget() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check visibility rules
  if (!isConciergeWidgetVisible(pathname)) return null;
  if (dismissed) return null;

  return (
    <>
      {/* Collapsed floating button */}
      <AnimatePresence>
        {!expanded && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={() => setExpanded(true)}
            className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-milyfe-gradient flex items-center justify-center shadow-lg shadow-milyfe-emerald/20 hover:shadow-milyfe-emerald/40 transition-shadow group"
            aria-label="Talk to the Forge Concierge"
          >
            <Compass className="h-6 w-6 text-white" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping bg-milyfe-emerald/20 pointer-events-none" style={{ animationDuration: "2s" }} />
            {/* Tooltip on hover */}
            <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg bg-milyfe-surface border border-milyfe-border text-xs text-milyfe-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Talk to the Forge Concierge
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded chat panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] h-[600px] max-h-[calc(100vh-6rem)] rounded-xl border border-milyfe-border bg-milyfe-bg shadow-2xl shadow-black/40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-milyfe-border bg-milyfe-surface/50">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Compass className="h-5 w-5 text-milyfe-emerald" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-milyfe-emerald animate-pulse" />
                </div>
                <div>
                  <span className="text-sm font-medium text-milyfe-text">The Forge Concierge</span>
                  <MonoLabel className="block text-[9px]">FIRST CONVERSATION WITH MILYFE</MonoLabel>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setExpanded(false)}
                  className="p-1.5 rounded hover:bg-milyfe-surface-2 text-milyfe-text-muted hover:text-milyfe-text transition-colors"
                  aria-label="Minimize"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { setExpanded(false); setDismissed(true); }}
                  className="p-1.5 rounded hover:bg-milyfe-surface-2 text-milyfe-text-muted hover:text-milyfe-text transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat body */}
            <ConciergeChat compact />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
