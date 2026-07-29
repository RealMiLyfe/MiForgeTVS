"use client";

import { Button } from "@/components/ui/button";
import { MonoLabel } from "@/components/shared/MonoLabel";
import type { PricingTier } from "@/lib/supabase/types";
import Link from "next/link";
import { Check } from "lucide-react";

export function PricingTierCard({ tier, featured }: { tier: PricingTier; featured?: boolean }) {
  const includes = tier.includes as Record<string, unknown> | null;

  return (
    <div className={`rounded-xl border p-8 flex flex-col ${featured ? "border-milyfe-emerald/40 bg-milyfe-surface shadow-lg shadow-milyfe-emerald/5" : "border-milyfe-border bg-milyfe-surface"}`}>
      {featured && <MonoLabel className="text-milyfe-emerald mb-2">MOST POPULAR</MonoLabel>}
      <h3 className="font-fraunces text-2xl text-milyfe-text mb-1">{tier.name}</h3>
      <p className="text-sm text-milyfe-text-muted mb-4">{tier.positioning}</p>
      <p className="text-xs text-milyfe-text-muted mb-6">Best for: {tier.best_for}</p>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-baseline">
          <MonoLabel>FORGE FEE</MonoLabel>
          <span className="font-mono text-milyfe-text">from ${tier.forge_fee_starting?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <MonoLabel>RETAINER</MonoLabel>
          <span className="font-mono text-milyfe-text">${tier.retainer_starting?.toLocaleString()}/mo</span>
        </div>
        <div className="flex justify-between items-baseline">
          <MonoLabel>UPLIFT SHARE</MonoLabel>
          <span className="font-mono text-milyfe-text">{tier.uplift_share_percent}%</span>
        </div>
      </div>

      <div className="h-px bg-milyfe-border my-4" />

      {includes && (
        <ul className="space-y-2 mb-6 flex-1">
          {Object.entries(includes).map(([key, val]) => (
            <li key={key} className="flex items-center gap-2 text-sm text-milyfe-text-muted">
              <Check className="h-3.5 w-3.5 text-milyfe-emerald flex-shrink-0" />
              <span>{key === "agents" ? `${val} agents` : key === "custom_agents" ? `${val} custom agents` : `${val} ${key}`}</span>
            </li>
          ))}
          {tier.minimum_commitment_months && (
            <li className="flex items-center gap-2 text-sm text-milyfe-text-muted">
              <Check className="h-3.5 w-3.5 text-milyfe-emerald flex-shrink-0" />
              <span>{tier.minimum_commitment_months}-month minimum</span>
            </li>
          )}
        </ul>
      )}

      <Link href={`/contact?tier=${tier.slug}`}>
        <Button variant={featured ? "gradient" : "ghost"} className="w-full">Request Forge</Button>
      </Link>
    </div>
  );
}
