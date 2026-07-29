"use client";

import { useState } from "react";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AgentPreviewPanel } from "@/components/miforge/AgentPreviewPanel";
import { useAuth } from "@/components/providers/AuthProvider";
import { mockFactories } from "@/lib/supabase/mocks";

export default function DashboardBespokePage() {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const factory = mockFactories.find(f => f.owner_user_id === user?.id) || mockFactories[0];

  const handleSubmit = async () => {
    await fetch("/api/bespoke/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, businessName: factory.business_name, contactEmail: user?.email }),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-20 space-y-4">
        <GradientHeadline size="section">Request submitted.</GradientHeadline>
        <p className="text-milyfe-text-muted">An operator will follow up within 24 hours to confirm scope and timeline.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <GradientHeadline size="card" as="h1">Forge a Custom Agent.</GradientHeadline>
        <p className="text-sm text-milyfe-text-muted mt-1">Describe the role in your own words. Your factory context is included automatically.</p>
      </div>

      <div className="rounded-lg border border-milyfe-border bg-milyfe-surface p-4">
        <MonoLabel className="block mb-1">FACTORY CONTEXT (AUTO-INCLUDED)</MonoLabel>
        <p className="text-xs text-milyfe-text-muted">{factory.business_name} · {factory.niche} · {mockFactories.length} agents active</p>
      </div>

      <Textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="I need an agent that can..."
        className="min-h-[160px]"
      />

      <AgentPreviewPanel preview={description.length > 30 ? { agent_name: "Custom Agent", capabilities: ["Based on your description", "Calibrated to your factory"], recommended_tier: "Standard" } : null} loading={false} />

      <Button variant="gradient" onClick={handleSubmit} disabled={description.length < 20}>Submit Bespoke Request</Button>
    </div>
  );
}
