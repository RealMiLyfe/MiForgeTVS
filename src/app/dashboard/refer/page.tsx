"use client";

import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";

export default function ReferPage() {
  const link = "milyfe.fun/discover?ref=derek-adams";

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${link}`);
    toast.success("Referral link copied");
  };

  return (
    <div className="space-y-8">
      <GradientHeadline size="card" as="h1">Refer Another Operator.</GradientHeadline>
      <p className="text-sm text-milyfe-text-muted">When someone you refer commissions a factory, you both receive a month of retainer credit.</p>

      {/* Link card */}
      <div className="rounded-xl border border-milyfe-emerald/30 bg-milyfe-emerald/5 p-6">
        <MonoLabel className="block mb-3">YOUR REFERRAL LINK</MonoLabel>
        <div className="flex items-center gap-3">
          <code className="flex-1 font-mono text-sm text-milyfe-text bg-milyfe-surface rounded-lg px-4 py-2 border border-milyfe-border truncate">{link}</code>
          <Button variant="gradient" onClick={copyLink}>Copy</Button>
        </div>
      </div>

      {/* Rewards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-5 text-center">
          <MonoLabel className="block text-[10px] mb-1">SUCCESSFUL REFERRALS</MonoLabel>
          <span className="font-mono text-2xl text-milyfe-gradient font-bold">0</span>
        </div>
        <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-5 text-center">
          <MonoLabel className="block text-[10px] mb-1">CREDITS EARNED</MonoLabel>
          <span className="font-mono text-2xl text-milyfe-text font-bold">$0</span>
        </div>
        <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-5 text-center">
          <MonoLabel className="block text-[10px] mb-1">CREDITS REMAINING</MonoLabel>
          <span className="font-mono text-2xl text-milyfe-text font-bold">$0</span>
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6">
        <MonoLabel className="block mb-3">HOW IT WORKS</MonoLabel>
        <ul className="text-sm text-milyfe-text-muted space-y-2">
          <li>• Share your link — referral tracks via URL parameter</li>
          <li>• They sign up and commission a factory</li>
          <li>• 30 days after their activation, both of you receive 1 month retainer credit</li>
          <li>• Credits auto-apply to your next invoice</li>
          <li>• Maximum: 12 months of your retainer per year</li>
        </ul>
      </div>
    </div>
  );
}
