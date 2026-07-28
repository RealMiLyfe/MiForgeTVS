"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/shared/StatusPill";
import { mockFactories, mockFactoryAgents, mockActivityEvents } from "@/lib/supabase/mocks";
import { getRelativeTime } from "@/lib/utils/relative-time";
import Link from "next/link";
import { BarChart3, DollarSign, Clock, Heart } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Get user's factory (demo: Derek's factory for any logged in user)
  const factory = useMemo(() => {
    if (!user) return null;
    return mockFactories.find(f => f.owner_user_id === user.id) || mockFactories[0];
  }, [user]);

  const agents = useMemo(() => factory ? mockFactoryAgents.filter(a => a.factory_id === factory.id) : [], [factory]);
  const events = useMemo(() => factory ? mockActivityEvents.filter(e => e.factory_id === factory.id) : [], [factory]);

  if (loading) return <div className="flex items-center justify-center py-20"><MonoLabel>LOADING...</MonoLabel></div>;
  if (!user) return null;

  if (!factory) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <GradientHeadline size="section">You don&apos;t have a factory yet.</GradientHeadline>
        <p className="text-milyfe-text-muted mt-3">Every operator starts with a forge. Commission yours in 5 minutes.</p>
        <div className="flex gap-4 mt-8">
          <Link href="/miforge/bespoke"><Button variant="gradient" size="lg">Commission a Forge →</Button></Link>
          <Link href="/factory/derek-adams"><Button variant="ghost" size="lg">See What&apos;s Possible →</Button></Link>
        </div>
      </div>
    );
  }

  const metrics = [
    { icon: BarChart3, label: "THIS WEEK", value: "1,247", title: "Autonomous Tasks", delta: "↑ 12% vs. last week" },
    { icon: DollarSign, label: "RECOVERED / GENERATED", value: "$18,340", title: "Revenue Attributable", delta: "↑ 8% vs. last week" },
    { icon: Clock, label: "HOURS REPLACED", value: "168", title: "Hours Reclaimed", delta: "↑ 4 hrs vs. last week" },
    { icon: Heart, label: "OPERATIONAL HEALTH", value: `${factory.health_score}%`, title: "Factory Health", delta: "Stable" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <GradientHeadline size="card" as="h1">Welcome back, {user.full_name?.split(" ")[0] || "Operator"}.</GradientHeadline>
          <p className="text-sm text-milyfe-text-muted mt-1">Here&apos;s what your factory did while you were away.</p>
        </div>
        <MonoLabel>LAST UPDATED: 3 MIN AGO</MonoLabel>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.title} className="rounded-xl border border-milyfe-border bg-milyfe-surface p-5">
            <div className="flex items-center gap-2 mb-2">
              <m.icon className="h-4 w-4 text-milyfe-cyan" />
              <MonoLabel>{m.label}</MonoLabel>
            </div>
            <div className="font-mono text-2xl font-bold text-milyfe-gradient">{m.value}</div>
            <p className="text-xs text-milyfe-text-muted mt-1">{m.delta}</p>
          </div>
        ))}
      </div>

      {/* Agent Status */}
      <div>
        <h2 className="font-fraunces text-lg text-milyfe-text mb-4">Agent Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {agents.map((a) => {
            const catalog = mockFactories.length > 0 ? require("@/lib/supabase/mocks").mockAgentCatalog.find((c: { slug: string }) => c.slug === a.catalog_slug) : null;
            return (
              <div key={a.id} className="rounded-lg border border-milyfe-border bg-milyfe-surface p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-milyfe-text">{catalog?.name || a.catalog_slug}</p>
                  <p className="text-xs text-milyfe-text-muted">Tasks this week: {Math.floor(Math.random() * 200 + 50)}</p>
                </div>
                <StatusPill variant={a.status === "active" ? "active" : "demo"} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="font-fraunces text-lg text-milyfe-text mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {events.slice(0, 8).map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-lg border border-milyfe-border p-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-milyfe-cyan">{e.catalog_slug.replace(/_/g, " ")}</span>
                <span className="text-sm text-milyfe-text-muted">{e.event_text}</span>
              </div>
              <MonoLabel className="text-[10px]">{getRelativeTime(e.created_at)}</MonoLabel>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-fraunces text-lg text-milyfe-text mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link href={`/factory/${factory.slug}`} className="rounded-lg border border-milyfe-border p-4 hover:border-milyfe-cyan/30 transition-colors">
            <p className="text-sm font-medium text-milyfe-text">View Factory</p>
            <p className="text-xs text-milyfe-text-muted">See your live factory page</p>
          </Link>
          <Link href="/miforge/catalog" className="rounded-lg border border-milyfe-border p-4 hover:border-milyfe-cyan/30 transition-colors">
            <p className="text-sm font-medium text-milyfe-text">Add New Agent</p>
            <p className="text-xs text-milyfe-text-muted">Browse the agent catalog</p>
          </Link>
          <Link href="/contact" className="rounded-lg border border-milyfe-border p-4 hover:border-milyfe-cyan/30 transition-colors">
            <p className="text-sm font-medium text-milyfe-text">Get Support</p>
            <p className="text-xs text-milyfe-text-muted">Contact MiForge operators</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
