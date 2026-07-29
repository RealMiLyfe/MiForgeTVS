"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MiLyfeLockup } from "@/components/shared/MiLyfeLockup";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { SchematicGrid } from "@/components/shared/SchematicGrid";
import { ConciergeChat } from "@/components/concierge/ConciergeChat";
import { IntentSidebar } from "@/components/concierge/IntentSidebar";
import { PreviewGenerationSequence } from "@/components/concierge/PreviewGenerationSequence";
import { loadConciergeMessages, getDiscoveryToken } from "@/lib/concierge/session-manager";
import type { IntentProfile } from "@/lib/agents/concierge/intent-extraction";
import { PanelRightOpen, PanelRightClose } from "lucide-react";


function DiscoverContent() {
  const searchParams = useSearchParams();
  const initialMsg = searchParams.get("message") || undefined;
  const [intent, setIntent] = useState<IntentProfile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [previewMeta, setPreviewMeta] = useState({ name: "", agents: 0, tier: "" });

  // Periodically extract intent
  useEffect(() => {
    const interval = setInterval(async () => {
      const messages = loadConciergeMessages();
      const userMsgCount = messages.filter(m => m.role === "user").length;
      if (userMsgCount >= 2 && userMsgCount % 2 === 0) {
        try {
          const res = await fetch("/api/concierge/extract-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_token: getDiscoveryToken() }),
          });
          if (res.ok) {
            const data = await res.json();
            setIntent(data);
          }
        } catch { /* silent */ }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGeneratePreview = useCallback(async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/concierge/generate-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_token: getDiscoveryToken() }),
      });
      if (res.ok) {
        const data = await res.json();
        setPreviewMeta({
          name: data.business_name || "Your Business",
          agents: data.agent_count || 6,
          tier: data.tier || "Standard",
        });
        // Simulate generation delay
        setTimeout(() => {
          setPreviewSlug(data.factory_slug || "preview-demo");
          setGenerating(false);
        }, 6000);
      } else {
        setGenerating(false);
      }
    } catch {
      setGenerating(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-milyfe-bg relative overflow-hidden">
      <SchematicGrid opacity={5} />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 h-14 border-b border-milyfe-border bg-milyfe-bg/90 backdrop-blur-md shrink-0">
        <MiLyfeLockup size="sm" />
        <MonoLabel>DISCOVERY SESSION WITH THE FORGE CONCIERGE</MonoLabel>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded hover:bg-milyfe-surface-2 text-milyfe-text-muted hover:text-milyfe-text transition-colors md:hidden"
        >
          {sidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
        </button>
      </header>

      {/* Main area */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Chat */}
        <div className="flex-1 flex flex-col max-w-[720px] mx-auto w-full">
          <ConciergeChat initialMessage={initialMsg} />
        </div>

        {/* Intent Sidebar - desktop */}
        <aside className={`hidden md:block w-[280px] border-l border-milyfe-border bg-milyfe-surface/30 overflow-y-auto shrink-0 transition-all ${sidebarOpen ? "" : "hidden"}`}>
          <IntentSidebar intent={intent} onGeneratePreview={handleGeneratePreview} />
        </aside>
      </div>

      {/* Preview Generation Overlay */}
      <PreviewGenerationSequence
        generating={generating}
        previewSlug={previewSlug}
        businessName={previewMeta.name}
        agentCount={previewMeta.agents}
        tier={previewMeta.tier}
        onClose={() => { setPreviewSlug(null); setGenerating(false); }}
      />
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-milyfe-bg" />}>
      <DiscoverContent />
    </Suspense>
  );
}
