"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { getRelativeTime } from "@/lib/utils/relative-time";
import { dispatchAgentEvent } from "@/lib/factory/event-bus";
import { Radio } from "lucide-react";
import type { ActivityEvent } from "@/lib/supabase/types";
import * as LucideIcons from "lucide-react";

const typeColors: Record<string, string> = {
  action: "border-milyfe-emerald",
  handoff: "border-milyfe-cyan",
  milestone: "border-milyfe-emerald",
  alert: "border-yellow-500",
};

const filters = ["all", "action", "handoff", "milestone", "alert"] as const;

interface LiveActivityFeedProps {
  initialEvents: ActivityEvent[];
  factorySlug: string;
}

export function LiveActivityFeed({ initialEvents, factorySlug }: LiveActivityFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>(initialEvents);
  const [filter, setFilter] = useState<string>("all");
  const [, setTick] = useState(0);
  const startedRef = useRef(false);

  // Timestamp updater
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(i);
  }, []);

  // Real-time event generation after 30s
  const addEvent = useCallback((event: ActivityEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, 50));
    dispatchAgentEvent(event.catalog_slug, event);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      startedRef.current = true;
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/factory/${factorySlug}/next-event`, { method: "POST" });
          if (res.ok) { const ev = await res.json(); if (ev?.id) addEvent(ev); }
        } catch { /* silent */ }
      }, 8000 + Math.random() * 6000);
      return () => clearInterval(interval);
    }, 30000);
    return () => clearTimeout(delay);
  }, [factorySlug, addEvent]);

  const filtered = filter === "all" ? events : events.filter((e) => e.event_type === filter);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Radio className="h-6 w-6 text-milyfe-text-muted mb-2" />
        <MonoLabel>NO ACTIVITY YET</MonoLabel>
        <p className="text-xs text-milyfe-text-muted mt-1">Events will appear here as agents work.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-milyfe-emerald opacity-75" /><span className="relative rounded-full h-2 w-2 bg-milyfe-emerald" /></span>
          <MonoLabel>LIVE ACTIVITY</MonoLabel>
        </div>
        <MonoLabel>{events.length} EVENTS</MonoLabel>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1 mb-3">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded ${filter === f ? "bg-milyfe-cyan/20 text-milyfe-cyan" : "text-milyfe-text-muted hover:text-milyfe-text"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Events */}
      <div className="flex-1 overflow-y-auto space-y-2">
        <AnimatePresence initial={false}>
          {filtered.slice(0, 15).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: ActivityEvent }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)["Zap"] || LucideIcons.Zap;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={`rounded-lg bg-milyfe-surface p-3 border-l-2 ${typeColors[event.event_type] || typeColors.action}`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3 w-3 text-milyfe-cyan" />
          <span className="text-[11px] font-medium text-milyfe-text">{event.catalog_slug.replace(/_/g, " ")}</span>
        </div>
        <MonoLabel className="text-[9px]">{getRelativeTime(event.created_at)}</MonoLabel>
      </div>
      <p className="text-xs text-milyfe-text-muted">{event.event_text}</p>
    </motion.div>
  );
}
