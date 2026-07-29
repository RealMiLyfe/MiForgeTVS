"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BespokeStepIndicator } from "@/components/miforge/BespokeStepIndicator";
import { AgentPreviewPanel } from "@/components/miforge/AgentPreviewPanel";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface BespokeState {
  description: string; businessName: string; industry: string;
  teamSize: string; existingTools: string[]; deploymentSurface: string[];
  timeline: string; prioritySpeed: number; priorityCost: number; priorityAutonomy: number;
  contactName: string; contactEmail: string; contactMethod: string; additionalContext: string;
}
interface PreviewData { agent_name?: string; capabilities?: string[]; integrations?: string[]; timeline_weeks?: string; recommended_tier?: string; estimated_forge_fee_low?: number; estimated_forge_fee_high?: number; }

const tools = ["Shopify","Klaviyo","HubSpot","Salesforce","Notion","Slack","Airtable","TikTok Shop","Meta Ads","Google Ads","Zapier","Other"];
const surfaces = ["Email","Slack","DMs","Custom Dashboard","Voice","SMS","API only"];
const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter(i => i !== v) : [...arr, v];


function BespokeContent() {
  const sp = useSearchParams();
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reqId, setReqId] = useState("");
  const [s, setS] = useState<BespokeState>({
    description: sp.get("prefill") || "", businessName: "", industry: sp.get("industry") || "",
    teamSize: "", existingTools: [], deploymentSurface: [], timeline: "standard",
    prioritySpeed: 50, priorityCost: 50, priorityAutonomy: 50,
    contactName: "", contactEmail: "", contactMethod: "email", additionalContext: "",
  });

  const fetchPreview = useCallback(async (d: string) => {
    if (d.length < 20) return;
    setLoading(true);
    try {
      const r = await fetch("/api/bespoke/preview", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ description: d }) });
      setPreview(await r.json());
    } catch { setPreview(null); }
    setLoading(false);
  }, []);

  useEffect(() => { const t = setTimeout(() => { if (s.description.length >= 20) fetchPreview(s.description); }, 800); return () => clearTimeout(t); }, [s.description, fetchPreview]);

  const submit = async () => {
    const r = await fetch("/api/bespoke/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
    const d = await r.json();
    setReqId(d.request_id || "BF-001"); setSubmitted(true);
  };


  if (submitted) return (
    <main className="min-h-screen bg-milyfe-bg flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-6">
        <GradientHeadline size="section">Your forge request is in.</GradientHeadline>
        <p className="text-milyfe-text-muted">A MiForge operator will reach out within 24 hours.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="gradient" disabled>Book Scoping Call</Button>
          <Link href="/factory/derek-adams"><Button variant="ghost">See a Live Factory</Button></Link>
        </div>
        <MonoLabel>Request #{reqId} · Forged by MiForge · Housed in MiLyfe</MonoLabel>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-milyfe-bg py-12">
      <div className="mx-auto max-w-2xl px-6">
        <BespokeStepIndicator currentStep={step} />
        {step === 1 && (<div className="space-y-6">
          <GradientHeadline size="card">What role should this agent play?</GradientHeadline>
          <p className="text-milyfe-text-muted">Describe the job in your own words.</p>
          <Textarea value={s.description} onChange={e => setS({...s, description: e.target.value})} placeholder="I need something that watches my Instagram DMs, qualifies leads, books calls automatically..." className="min-h-[160px]" />
          <AgentPreviewPanel preview={preview} loading={loading} />
          {preview && <Button variant="gradient" onClick={() => setStep(2)}>Refine Further →</Button>}
        </div>)}


        {step === 2 && (<div className="space-y-6">
          <GradientHeadline size="card">Business Context</GradientHeadline>
          <Input placeholder="Business name" value={s.businessName} onChange={e => setS({...s, businessName: e.target.value})} />
          <Input placeholder="Industry / niche" value={s.industry} onChange={e => setS({...s, industry: e.target.value})} />
          <div><MonoLabel className="block mb-2">TEAM SIZE</MonoLabel>
            <div className="flex flex-wrap gap-2">{["Solo","2-10","11-50","51-200","200+"].map(v => <button key={v} onClick={() => setS({...s, teamSize: v})} className={`px-3 py-1.5 rounded-lg text-sm border ${s.teamSize===v?"border-milyfe-emerald text-milyfe-emerald bg-milyfe-emerald/10":"border-milyfe-border text-milyfe-text-muted"}`}>{v}</button>)}</div></div>
          <div><MonoLabel className="block mb-2">EXISTING TOOLS</MonoLabel>
            <div className="flex flex-wrap gap-2">{tools.map(t => <button key={t} onClick={() => setS({...s, existingTools: toggle(s.existingTools, t)})} className={`px-2 py-1 rounded text-xs border ${s.existingTools.includes(t)?"border-milyfe-cyan text-milyfe-cyan bg-milyfe-cyan/10":"border-milyfe-border text-milyfe-text-muted"}`}>{t}</button>)}</div></div>
          <div><MonoLabel className="block mb-2">DEPLOYMENT SURFACE</MonoLabel>
            <div className="flex flex-wrap gap-2">{surfaces.map(v => <button key={v} onClick={() => setS({...s, deploymentSurface: toggle(s.deploymentSurface, v)})} className={`px-2 py-1 rounded text-xs border ${s.deploymentSurface.includes(v)?"border-milyfe-cyan text-milyfe-cyan bg-milyfe-cyan/10":"border-milyfe-border text-milyfe-text-muted"}`}>{v}</button>)}</div></div>
          <Button variant="gradient" onClick={() => setStep(3)}>Continue →</Button>
        </div>)}


        {step === 3 && (<div className="space-y-6">
          <GradientHeadline size="card">Timeline & Priorities</GradientHeadline>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[{v:"immediate",l:"Immediate",d:"Within 2 weeks"},{v:"standard",l:"Standard",d:"Within 30 days"},{v:"considered",l:"Considered",d:"60-90 days"},{v:"exploring",l:"Exploring",d:"No set timeline"}].map(t => <button key={t.v} onClick={() => setS({...s, timeline: t.v})} className={`p-4 rounded-xl border text-left ${s.timeline===t.v?"border-milyfe-emerald bg-milyfe-emerald/5":"border-milyfe-border"}`}><div className="font-medium text-milyfe-text text-sm">{t.l}</div><div className="text-xs text-milyfe-text-muted">{t.d}</div></button>)}
          </div>
          <div className="space-y-4">
            {[{k:"prioritySpeed" as const,l:"Speed",r:"Customization"},{k:"priorityCost" as const,l:"Cost efficiency",r:"Premium"},{k:"priorityAutonomy" as const,l:"Autonomy",r:"Human oversight"}].map(sl => <div key={sl.k}><div className="flex justify-between text-xs text-milyfe-text-muted mb-1"><span>{sl.l}</span><span>{sl.r}</span></div><input type="range" min="0" max="100" value={s[sl.k]} onChange={e => setS({...s, [sl.k]: +e.target.value})} className="w-full accent-milyfe-emerald" /></div>)}
          </div>
          <Button variant="gradient" onClick={() => setStep(4)}>Review My Forge →</Button>
        </div>)}
        {step === 4 && (<div className="space-y-6">
          <GradientHeadline size="card">Review Generated Scope</GradientHeadline>
          <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6 space-y-3 text-sm">
            <MonoLabel className="block">AGENT SCOPE — {preview?.agent_name||"Custom Agent"}</MonoLabel>
            <p className="text-milyfe-text-muted">{s.description.slice(0,200)}</p>
            {preview?.capabilities && <ul className="text-milyfe-text-muted space-y-1">{preview.capabilities.map((c,i)=><li key={i}>• {c}</li>)}</ul>}
            {preview?.recommended_tier && <p>Tier: <span className="text-milyfe-text">{preview.recommended_tier}</span></p>}
            {preview?.estimated_forge_fee_low && <p>Fee: <span className="text-milyfe-text">${preview.estimated_forge_fee_low.toLocaleString()} – ${preview.estimated_forge_fee_high?.toLocaleString()}</span></p>}
          </div>
          <div className="flex gap-3"><Button variant="gradient" onClick={() => setStep(5)}>Submit This Forge Request</Button><Button variant="ghost" onClick={() => setStep(1)}>Refine Scope</Button></div>
        </div>)}


        {step === 5 && (<div className="space-y-6">
          <GradientHeadline size="card">Contact Details</GradientHeadline>
          <Input placeholder="Your name" value={s.contactName} onChange={e => setS({...s, contactName: e.target.value})} />
          <Input type="email" placeholder="Your email" value={s.contactEmail} onChange={e => setS({...s, contactEmail: e.target.value})} />
          <div><MonoLabel className="block mb-2">CONTACT METHOD</MonoLabel>
            <div className="flex flex-wrap gap-2">{["Email","Phone","Calendly","Slack"].map(m => <button key={m} onClick={() => setS({...s, contactMethod: m.toLowerCase()})} className={`px-3 py-1.5 rounded-lg text-sm border ${s.contactMethod===m.toLowerCase()?"border-milyfe-emerald text-milyfe-emerald":"border-milyfe-border text-milyfe-text-muted"}`}>{m}</button>)}</div></div>
          <Textarea placeholder="Additional context (optional)" value={s.additionalContext} onChange={e => setS({...s, additionalContext: e.target.value})} />
          <Button variant="gradient" onClick={submit} disabled={!s.contactName||!s.contactEmail}>Submit Forge Request</Button>
        </div>)}
      </div>
    </main>
  );
}

export default function BespokePage() {
  return <Suspense fallback={<div className="min-h-screen bg-milyfe-bg" />}><BespokeContent /></Suspense>;
}
