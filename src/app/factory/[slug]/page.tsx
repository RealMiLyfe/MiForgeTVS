"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { mockFactories, mockFactoryAgents, mockAgentCatalog, mockActivityEvents } from "@/lib/supabase/mocks";
import { formatFactoryNumber, calculateRecoverableValue } from "@/lib/factory/personalize";
import { MiLyfeLockup } from "@/components/shared/MiLyfeLockup";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { SchematicGrid } from "@/components/shared/SchematicGrid";
import { AgentCanvas } from "@/components/factory/AgentCanvas";
import { AgentChatDrawer } from "@/components/factory/AgentChatDrawer";
import { LiveActivityFeed } from "@/components/factory/LiveActivityFeed";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import Link from "next/link";


export default function FactoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [cinematicDone, setCinematicDone] = useState(false);
  const [skipCinematic, setSkipCinematic] = useState(false);
  const [chatAgent, setChatAgent] = useState<string | null>(null);

  const factory = useMemo(() => mockFactories.find(f => f.slug === slug), [slug]);
  const agents = useMemo(() => mockFactoryAgents.filter(a => a.factory_id === factory?.id), [factory]);
  const agentDetails = useMemo(() => agents.map(a => ({ ...a, catalog: mockAgentCatalog.find(c => c.slug === a.catalog_slug) })), [agents]);
  const events = useMemo(() => mockActivityEvents.filter(e => e.factory_id === factory?.id), [factory]);
  const recoverableValue = factory ? calculateRecoverableValue(factory.lifetime_revenue) : 0;

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCinematicDone(true); setSkipCinematic(true);
    }
  }, []);

  useEffect(() => {
    if (skipCinematic) return;
    const t = setTimeout(() => setCinematicDone(true), 2000);
    return () => clearTimeout(t);
  }, [skipCinematic]);

  useEffect(() => {
    if (cinematicDone) return;
    const skip = () => { setCinematicDone(true); setSkipCinematic(true); };
    window.addEventListener("click", skip); window.addEventListener("scroll", skip);
    return () => { window.removeEventListener("click", skip); window.removeEventListener("scroll", skip); };
  }, [cinematicDone]);

  useEffect(() => {
    fetch(`/api/factory/${slug}/track`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({event_type:"page_view"}) }).catch(() => {});
  }, [slug]);

  if (!factory) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-milyfe-bg px-6 text-center">
        <div><MonoLabel>FACTORY NOT FOUND</MonoLabel><GradientHeadline size="section" className="mt-4">This factory doesn&apos;t exist.</GradientHeadline>
        <Link href="/factories" className="mt-6 inline-block"><Button variant="gradient">Browse Factories</Button></Link></div>
      </main>
    );
  }

  const chatCatalog = chatAgent ? mockAgentCatalog.find(c => c.slug === chatAgent) : undefined;


  return (
    <div className="min-h-screen bg-milyfe-bg relative overflow-hidden">
      <SchematicGrid opacity={5} />

      {/* Cinematic overlay */}
      <AnimatePresence>
        {!cinematicDone && (
          <motion.div key="cinematic" initial={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-milyfe-bg">
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{duration:0.3}}>
              <MiLyfeLockup size="lg" />
            </motion.div>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.15}}>
              <MonoLabel className="mt-4">LOADING {factory.business_name.toUpperCase()}&apos;S FACTORY...</MonoLabel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <motion.header initial={skipCinematic?{}:{y:-20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:skipCinematic?0:0.7,duration:0.3}} className="relative z-10 h-16 border-b border-milyfe-border bg-milyfe-bg/90 backdrop-blur-md flex items-center justify-between px-6">
        <MiLyfeLockup size="sm" />
        <div className="text-center hidden sm:block">
          <h1 className="font-fraunces text-lg text-milyfe-gradient">{factory.business_name}</h1>
          <MonoLabel>FACTORY {formatFactoryNumber(factory.factory_number)} · FORGED FOR {factory.contact_name.toUpperCase()}</MonoLabel>
        </div>
        <div className="flex items-center gap-3">
          <MonoLabel className="hidden md:inline">HEALTH: <span className="text-milyfe-emerald">{factory.health_score}%</span></MonoLabel>
          <StatusPill variant="demo">DEMO MODE</StatusPill>
        </div>
      </motion.header>

      {/* Specimen Banner */}
      {factory.is_specimen && (
        <div className="relative z-10 w-full bg-milyfe-teal/10 border-b border-milyfe-teal/20 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2"><Info className="h-4 w-4 text-milyfe-cyan" /><span className="text-sm text-milyfe-text-muted">SPECIMEN FACTORY · Showcase demonstration.</span></div>
          <Link href="/miforge/bespoke"><Button variant="ghost" size="sm">Forge My Own →</Button></Link>
        </div>
      )}


      {/* Main Layout */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <motion.aside initial={skipCinematic?{}:{x:-20,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:skipCinematic?0:0.9,duration:0.3}} className="w-full lg:w-[280px] border-r border-milyfe-border p-6 hidden lg:block">
          <MonoLabel className="block mb-4">ACTIVATION CHECKLIST</MonoLabel>
          <div className="h-2 bg-milyfe-surface-2 rounded-full mb-6 overflow-hidden"><div className="h-full bg-milyfe-gradient w-0" /></div>
          <div className="space-y-3">
            {agentDetails.map(a => (
              <div key={a.id} className="flex items-center gap-2 text-sm"><span>⏳</span><span className="text-milyfe-text-muted">{a.catalog?.name || a.catalog_slug}</span></div>
            ))}
          </div>
          <div className="mt-8"><Button variant="gradient" className="w-full" onClick={() => window.location.href = `/factory/${slug}/unlock`}>Unlock Full Factory</Button><p className="text-[10px] text-milyfe-text-muted mt-2 text-center">Every module. Every agent. Every connection.</p></div>
        </motion.aside>

        {/* Main Canvas */}
        <main className="flex-1 p-6 md:p-10">
          <AgentCanvas agents={agentDetails} factorySlug={slug} onTalkToAgent={(s) => setChatAgent(s)} />
        </main>

        {/* Right Sidebar */}
        <motion.aside initial={skipCinematic?{}:{x:20,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:skipCinematic?0:0.9,duration:0.3}} className="w-full lg:w-[320px] border-l border-milyfe-border p-6 hidden lg:block">
          <LiveActivityFeed initialEvents={events} factorySlug={slug} />
        </motion.aside>
      </div>

      {/* Bottom Bar */}
      <motion.footer initial={skipCinematic?{}:{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:skipCinematic?0:1.7,duration:0.3}} className="relative z-10 h-12 border-t border-milyfe-border bg-milyfe-bg/90 backdrop-blur-md flex items-center justify-between px-6">
        <div className="flex items-center gap-2"><MonoLabel>RECOVERABLE VALUE (THIS WEEK)</MonoLabel><span className="font-mono text-milyfe-gradient font-bold">${recoverableValue.toLocaleString()}</span></div>
        <MonoLabel className="hidden sm:block">POWERED BY MILYFE · FORGED BY MIFORGE</MonoLabel>
      </motion.footer>

      {/* Chat Drawer */}
      <AgentChatDrawer
        open={!!chatAgent}
        onClose={() => setChatAgent(null)}
        agentSlug={chatAgent || ""}
        catalog={chatCatalog}
        factorySlug={slug}
        businessName={factory.business_name}
      />
    </div>
  );
}
