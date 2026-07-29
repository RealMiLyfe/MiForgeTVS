"use client";

import { useState } from "react";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";

const preferences = [
  { key: "weekly_reports", label: "Weekly reports" },
  { key: "agent_alerts", label: "Agent alerts" },
  { key: "billing", label: "Billing events" },
  { key: "referrals", label: "Referral rewards" },
  { key: "team_activity", label: "Team activity" },
  { key: "platform_updates", label: "Platform updates" },
];

export default function UnsubscribePage() {
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-milyfe-bg px-6 text-center">
        <div>
          <GradientHeadline size="card">Preferences updated.</GradientHeadline>
          <p className="text-sm text-milyfe-text-muted mt-2">Your email preferences have been saved.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-milyfe-bg px-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <GradientHeadline size="card">Email Preferences</GradientHeadline>
          <p className="text-sm text-milyfe-text-muted mt-2">Choose which emails you receive from MiLyfe.</p>
        </div>
        <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6 space-y-3">
          {preferences.map(p => (
            <label key={p.key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-milyfe-text">{p.label}</span>
              <input type="checkbox" defaultChecked className="accent-milyfe-emerald" />
            </label>
          ))}
          <div className="h-px bg-milyfe-border my-3" />
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-red-400">Unsubscribe from all</span>
            <input type="checkbox" className="accent-red-500" />
          </label>
        </div>
        <Button variant="gradient" className="w-full" onClick={() => setSaved(true)}>Save Preferences</Button>
        <p className="text-[10px] text-milyfe-text-muted text-center">
          <MonoLabel>miforge@milyfe.fun · MiLyfe</MonoLabel>
        </p>
      </div>
    </main>
  );
}
