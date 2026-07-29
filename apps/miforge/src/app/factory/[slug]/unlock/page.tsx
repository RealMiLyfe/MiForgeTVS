"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { mockFactories, mockFactoryAgents, mockAgentCatalog } from "@/lib/supabase/mocks";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MiLyfeLockup } from "@/components/shared/MiLyfeLockup";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import { formatRevenue, formatValuationRange } from "@/lib/factory/personalize";
import Link from "next/link";

export default function UnlockPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [step, setStep] = useState(1);
  const [paymentDone, setPaymentDone] = useState(false);
  const [contractDone, setContractDone] = useState(false);
  const [ignited, setIgnited] = useState(false);
  const [igniting, setIgniting] = useState(false);

  const factory = mockFactories.find(f => f.slug === slug);
  const agents = mockFactoryAgents.filter(a => a.factory_id === factory?.id);
  const agentDetails = agents.map(a => ({ ...a, catalog: mockAgentCatalog.find(c => c.slug === a.catalog_slug) }));

  if (!factory) return <div className="text-center py-20"><GradientHeadline size="section">Factory not found.</GradientHeadline></div>;

  // Progress bar
  const ProgressBar = () => (
    <div className="flex gap-1 mb-8">
      {[1, 2, 3, 4, 5].map(s => (
        <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-milyfe-gradient" : "bg-milyfe-surface-2"}`} />
      ))}
    </div>
  );

  const handlePay = () => {
    console.log("[Paddle Placeholder] Simulated successful payment for factory:", slug);
    setTimeout(() => { setPaymentDone(true); setStep(3); }, 2000);
  };

  const handleContract = () => {
    setTimeout(() => { setContractDone(true); setStep(4); }, 1500);
  };

  const handleIgnition = () => {
    setIgniting(true);
    setTimeout(() => { setIgniting(false); setIgnited(true); setStep(5); }, 4000);
  };

  if (igniting) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-milyfe-bg">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <MiLyfeLockup size="lg" />
        </motion.div>
        <MonoLabel className="mt-4 animate-pulse">IGNITING FACTORY...</MonoLabel>
        <div className="mt-8 flex gap-2">
          {agentDetails.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0.2 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.4 }} className="h-3 w-3 rounded-full bg-milyfe-emerald" />
          ))}
        </div>
      </div>
    );
  }

  if (ignited) {
    return (
      <div className="text-center py-20 space-y-6">
        <GradientHeadline size="hero">{factory.business_name}&apos;s Factory is Live.</GradientHeadline>
        <p className="text-milyfe-text-muted max-w-lg mx-auto">Your agents are wiring up now. Full activation completes within 72 hours. Book your kickoff call to accelerate.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href={`/factory/${slug}`}><Button variant="gradient">Return to My Factory</Button></Link>
          <Link href="/dashboard"><Button variant="ghost">Visit My Dashboard</Button></Link>
        </div>
        <MonoLabel className="block mt-8">FACTORY ACTIVATED · AGENTS WIRING · STATUS: LIVE</MonoLabel>
      </div>
    );
  }

  return (
    <>
      <ProgressBar />

      {step === 1 && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-8">
          <div className="text-center">
            <GradientHeadline size="section">Activate {factory.business_name}&apos;s Factory.</GradientHeadline>
            <p className="text-milyfe-text-muted mt-2">Review what you&apos;re activating. Confirm to proceed.</p>
          </div>
          <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6 space-y-4">
            <MonoLabel className="block">MODULES ({agentDetails.length})</MonoLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {agentDetails.map(a => (
                <div key={a.id} className="flex items-center gap-2 p-2 rounded border border-milyfe-border text-sm">
                  <input type="checkbox" defaultChecked className="accent-milyfe-emerald" />
                  <span className="text-milyfe-text">{a.catalog?.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6 space-y-2 text-sm">
            <MonoLabel className="block mb-3">PROJECTED OUTCOME</MonoLabel>
            <p className="text-milyfe-text-muted">Return to {formatRevenue(factory.lifetime_revenue ? factory.lifetime_revenue / 12 : null)} monthly baseline</p>
            <p className="text-milyfe-text-muted">Sale-ready valuation: {formatValuationRange(factory.broker_valuation_low, factory.broker_valuation_high)}</p>
            <p className="text-milyfe-text-muted">Recommended tier: <span className="text-milyfe-emerald">Standard Factory</span></p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link href={`/factory/${slug}`}><Button variant="ghost">← Return to Factory</Button></Link>
            <Button variant="gradient" onClick={() => setStep(2)}>Proceed to Payment →</Button>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-8">
          <div className="text-center">
            <GradientHeadline size="section">Choose your payment method.</GradientHeadline>
            <p className="text-milyfe-text-muted mt-2">Both methods are secure. Card is faster. Direct debit is cheaper long-term.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6 space-y-4">
              <MonoLabel>CARD · GLOBAL</MonoLabel>
              <h3 className="font-fraunces text-lg text-milyfe-text">Paddle</h3>
              <ul className="text-sm text-milyfe-text-muted space-y-1"><li>• Instant activation</li><li>• Cards, Apple Pay, Google Pay</li><li>• Global coverage</li></ul>
              <Button variant="gradient" className="w-full" onClick={handlePay} disabled={paymentDone}>{paymentDone ? "✓ Paid" : "Pay with Card →"}</Button>
            </div>
            <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6 space-y-4">
              <MonoLabel>DIRECT DEBIT · ACH</MonoLabel>
              <h3 className="font-fraunces text-lg text-milyfe-text">GoCardless</h3>
              <ul className="text-sm text-milyfe-text-muted space-y-1"><li>• Lower processing fees</li><li>• Best for retainers</li><li>• UK, EU, US, CA</li></ul>
              <Button variant="ghost" className="w-full" onClick={handlePay} disabled={paymentDone}>{paymentDone ? "✓ Mandate Set" : "Set Up Direct Debit →"}</Button>
            </div>
          </div>
          <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-4 text-center font-mono text-sm">
            <p>Forge Fee: <span className="text-milyfe-text">$7,500</span> · Retainer: <span className="text-milyfe-text">$1,497/mo</span> · Uplift: <span className="text-milyfe-text">5%</span></p>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-8">
          <div className="text-center">
            <GradientHeadline size="section">Sign your forge agreement.</GradientHeadline>
            <p className="text-milyfe-text-muted mt-2">Standard scope, timeline, and terms.</p>
          </div>
          <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-8 text-center">
            <MonoLabel className="block mb-4">FORGE AGREEMENT</MonoLabel>
            <div className="h-48 bg-milyfe-surface-2 rounded-lg flex items-center justify-center mb-6">
              <p className="text-milyfe-text-muted italic">Contract document preview</p>
            </div>
            <Button variant="gradient" onClick={handleContract} disabled={contractDone}>{contractDone ? "✓ Signed" : "Sign Agreement"}</Button>
          </div>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-8">
          <div className="text-center">
            <GradientHeadline size="section">Connect your systems.</GradientHeadline>
            <p className="text-milyfe-text-muted mt-2">Provide credentials and access for your agents.</p>
          </div>
          <div className="space-y-4 max-w-lg mx-auto">
            <Input placeholder="Shopify store URL" />
            <Input placeholder="Shopify API key" type="password" />
            <Input placeholder="Klaviyo API key (optional)" type="password" />
            <Input placeholder="Brand voice sample URL" />
            <div className="flex gap-4 justify-center mt-6">
              <Button variant="ghost" onClick={handleIgnition}>I&apos;ll provide these later →</Button>
              <Button variant="gradient" onClick={handleIgnition}>Complete Handoff →</Button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
