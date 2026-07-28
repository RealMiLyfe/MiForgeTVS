"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { isOperator } from "@/lib/auth/roles";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import { mockFactories, mockBespokeRequests, mockActivityEvents } from "@/lib/supabase/mocks";
import { getRelativeTime } from "@/lib/utils/relative-time";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Factory, DollarSign, Users, AlertCircle } from "lucide-react";

export default function OperatorOverview() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isOperator(user))) router.push("/");
  }, [user, loading, router]);

  if (loading || !user || !isOperator(user)) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const activeFactories = mockFactories.filter(f => f.status === "activated" || f.status === "demo").length;
  const pendingBespoke = mockBespokeRequests.filter(r => r.status === "submitted").length;

  const metrics = [
    { icon: Factory, label: "IN THE FIELD", value: String(activeFactories), delta: "+2 this week", href: "/operator/factories" },
    { icon: DollarSign, label: "MRR", value: "$4,491", delta: "+8% vs last month", href: "/operator/revenue" },
    { icon: Users, label: "LIVE ENGAGEMENT", value: "7", delta: "sessions today", href: "/operator/prospects" },
    { icon: AlertCircle, label: "NEEDS ATTENTION", value: String(pendingBespoke), delta: "pending actions", href: "/operator/bespoke" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <GradientHeadline size="card" as="h1">Good {greeting}, {user.full_name?.split(" ")[0] || "Operator"}.</GradientHeadline>
        <MonoLabel>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</MonoLabel>
      </div>
      <p className="text-sm text-milyfe-text-muted">{mockActivityEvents.length} events since your last visit · {pendingBespoke} pending actions</p>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => (
          <Link key={m.label} href={m.href} className="rounded-xl border border-milyfe-border bg-milyfe-surface p-5 hover:border-milyfe-cyan/30 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <m.icon className="h-4 w-4 text-milyfe-cyan" />
              <MonoLabel>{m.label}</MonoLabel>
            </div>
            <div className="font-mono text-2xl font-bold text-milyfe-gradient">{m.value}</div>
            <p className="text-xs text-milyfe-text-muted mt-1">{m.delta}</p>
          </Link>
        ))}
      </div>

      {/* Activity Stream */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <MonoLabel>PLATFORM ACTIVITY</MonoLabel>
          <MonoLabel className="text-milyfe-emerald">LIVE</MonoLabel>
        </div>
        <div className="space-y-2">
          {mockActivityEvents.slice(0, 10).map(e => (
            <div key={e.id} className="flex items-center justify-between rounded-lg border border-milyfe-border p-3 hover:border-milyfe-cyan/20 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-milyfe-cyan">{e.catalog_slug.replace(/_/g, " ")}</span>
                <span className="text-sm text-milyfe-text-muted">{e.event_text}</span>
              </div>
              <MonoLabel className="text-[10px] shrink-0">{getRelativeTime(e.created_at)}</MonoLabel>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <MonoLabel className="block mb-4">QUICK ACTIONS</MonoLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "Forge New Factory", href: "/operator/factories" },
            { label: "Review Concierge Sessions", href: "/operator/concierge" },
            { label: "Process Bespoke Requests", href: "/operator/bespoke" },
            { label: "Invite from Waitlist", href: "/operator/waitlist" },
            { label: "View Revenue Report", href: "/operator/revenue" },
            { label: "Manage Agent Catalog", href: "/operator/catalog" },
          ].map(a => (
            <Link key={a.href} href={a.href} className="rounded-lg border border-milyfe-border p-4 hover:border-milyfe-cyan/30 transition-colors">
              <span className="text-sm font-medium text-milyfe-text">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
