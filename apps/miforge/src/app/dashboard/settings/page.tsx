"use client";

import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/providers/AuthProvider";
import { mockFactories } from "@/lib/supabase/mocks";

export default function SettingsPage() {
  const { user } = useAuth();
  const factory = mockFactories.find(f => f.owner_user_id === user?.id) || mockFactories[0];

  return (
    <div className="space-y-10 max-w-2xl">
      <GradientHeadline size="card" as="h1">Your Settings.</GradientHeadline>

      {/* Business Profile */}
      <section className="space-y-4">
        <MonoLabel className="block">BUSINESS PROFILE</MonoLabel>
        <Input defaultValue={factory.business_name} placeholder="Business name" />
        <Input defaultValue={factory.contact_name} placeholder="Contact name" />
        <Input defaultValue={factory.niche || ""} placeholder="Niche / industry" />
        <Textarea defaultValue={factory.custom_notes || ""} placeholder="Custom notes (visible to operators)" />
        <Button variant="gradient" size="sm">Save Profile</Button>
      </section>

      {/* Brand Assets */}
      <section className="space-y-4">
        <MonoLabel className="block">BRAND ASSETS</MonoLabel>
        <Input placeholder="Logo URL" />
        <Input defaultValue={factory.brand_voice_sample || ""} placeholder="Brand voice sample URL" />
        <Button variant="ghost" size="sm">Upload Logo</Button>
      </section>

      {/* Notifications */}
      <section className="space-y-4">
        <MonoLabel className="block">NOTIFICATIONS</MonoLabel>
        <div className="space-y-2">
          {["Weekly reports", "Agent alerts", "Billing events", "Referral rewards", "Team activity"].map(n => (
            <label key={n} className="flex items-center justify-between">
              <span className="text-sm text-milyfe-text-muted">{n}</span>
              <input type="checkbox" defaultChecked className="accent-milyfe-emerald" />
            </label>
          ))}
        </div>
      </section>

      {/* Factory Preferences */}
      <section className="space-y-4">
        <MonoLabel className="block">FACTORY PREFERENCES</MonoLabel>
        <select className="w-full h-10 rounded-lg border border-milyfe-border bg-milyfe-surface px-3 text-sm text-milyfe-text">
          <option>UTC (Default)</option>
          <option>US Eastern</option>
          <option>US Pacific</option>
          <option>UK (GMT/BST)</option>
          <option>EU Central</option>
        </select>
        <select className="w-full h-10 rounded-lg border border-milyfe-border bg-milyfe-surface px-3 text-sm text-milyfe-text">
          <option>Balanced tone</option>
          <option>Formal</option>
          <option>Casual</option>
        </select>
      </section>

      {/* Account */}
      <section className="space-y-4">
        <MonoLabel className="block">ACCOUNT</MonoLabel>
        <Input defaultValue={user?.email || ""} placeholder="Email" disabled />
        <Button variant="ghost" size="sm">Change Password</Button>
      </section>

      {/* Danger Zone */}
      <section className="rounded-xl border border-red-500/30 p-6 space-y-4">
        <MonoLabel className="text-red-400 block">DANGER ZONE</MonoLabel>
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" size="sm" className="text-red-400 border-red-500/30">Archive Factory</Button>
          <Button variant="ghost" size="sm" className="text-red-400 border-red-500/30">Export All Data</Button>
          <Button variant="ghost" size="sm" className="text-red-400 border-red-500/30">Delete Account</Button>
        </div>
      </section>
    </div>
  );
}
