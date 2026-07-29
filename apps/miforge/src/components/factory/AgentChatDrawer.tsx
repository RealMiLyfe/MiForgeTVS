"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { loadMessages, saveMessages } from "@/lib/chat/session-manager";
import type { AgentCatalogEntry, ChatMessage } from "@/lib/supabase/types";
import * as LucideIcons from "lucide-react";

interface AgentChatDrawerProps {
  open: boolean;
  onClose: () => void;
  agentSlug: string;
  catalog: AgentCatalogEntry | undefined;
  factorySlug: string;
  businessName: string;
}

const quickActions: Record<string, string[]> = {
  customer_service: ["Show me a sample response", "How do you handle refund requests?", "What's your resolution rate?", "Draft an escalation template"],
  email_reactivation: ["Generate a reactivation sequence", "Write a win-back email", "Suggest subject lines", "Segment my customer list"],
  social_content: ["Create a TikTok content plan", "Write Instagram captions", "Generate hashtag sets", "Draft a content calendar"],
  default: ["Show me what you can do", "Generate a sample output", "What platforms do you support?", "How autonomous are you?"],
};

export function AgentChatDrawer({ open, onClose, agentSlug, catalog, factorySlug, businessName }: AgentChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[catalog?.icon_name || "Bot"] || LucideIcons.Bot;

  const chips = quickActions[agentSlug] || quickActions.default;
  const showChips = messages.length <= 1;

  useEffect(() => {
    if (!open) return;
    const saved = loadMessages(factorySlug, agentSlug);
    if (saved.length > 0) { setMessages(saved); return; }
    const opening: ChatMessage = { role: "assistant", content: `Hi! I'm the ${catalog?.name || "Agent"} for ${businessName}. I can help with ${catalog?.description?.toLowerCase() || "your business operations"}. What would you like me to do?`, timestamp: new Date().toISOString() };
    setMessages([opening]);
    saveMessages(factorySlug, agentSlug, [opening]);
  }, [open, agentSlug, factorySlug, catalog, businessName]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streamText]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return;
    const userMsg: ChatMessage = { role: "user", content: text.trim(), timestamp: new Date().toISOString() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    saveMessages(factorySlug, agentSlug, updated);
    setInput("");
    setStreaming(true);
    setStreamText("");

    try {
      const res = await fetch(`/api/agents/${factorySlug}/${agentSlug}/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), session_token: "anon" }),
      });
      if (!res.ok) { throw new Error(await res.text()); }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
          for (const line of lines) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) { fullText = data.full_text || fullText; }
              else if (data.text) { fullText += data.text; setStreamText(fullText); }
            } catch { /* skip malformed */ }
          }
        }
      }

      const assistantMsg: ChatMessage = { role: "assistant", content: fullText, timestamp: new Date().toISOString() };
      const finalMsgs = [...updated, assistantMsg];
      setMessages(finalMsgs);
      saveMessages(factorySlug, agentSlug, finalMsgs);
    } catch (err) {
      const errMsg: ChatMessage = { role: "assistant", content: "Signal interrupted. Try again.", timestamp: new Date().toISOString() };
      setMessages([...updated, errMsg]);
      console.error("[Chat Error]", err);
    }
    setStreaming(false);
    setStreamText("");
  }, [messages, streaming, factorySlug, agentSlug]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 md:bg-transparent" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full md:w-[480px] bg-milyfe-bg border-l border-milyfe-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-milyfe-border">
              <div className="flex items-center gap-3">
                <Icon className="h-6 w-6 text-milyfe-cyan" />
                <div>
                  <h3 className="font-fraunces text-sm text-milyfe-text">{catalog?.name}</h3>
                  <MonoLabel>AGENT FOR {businessName.toUpperCase()}</MonoLabel>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill variant="active">LIVE</StatusPill>
                <button onClick={onClose} className="p-1 rounded hover:bg-milyfe-surface-2"><X className="h-4 w-4" /></button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  {msg.role === "user" ? (
                    <div className="max-w-[75%] bg-milyfe-surface-2 rounded-2xl rounded-br-sm px-4 py-3 text-sm text-milyfe-text">{msg.content}</div>
                  ) : (
                    <div className="max-w-[85%] border-l-2 border-milyfe-gradient pl-4 py-1 text-sm text-milyfe-text whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
              ))}
              {streaming && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] border-l-2 border-milyfe-emerald pl-4 py-1 text-sm text-milyfe-text">
                    {streamText || <span className="inline-flex gap-1"><span className="animate-bounce">·</span><span className="animate-bounce" style={{animationDelay:"0.1s"}}>·</span><span className="animate-bounce" style={{animationDelay:"0.2s"}}>·</span></span>}
                  </div>
                </div>
              )}
              {/* Quick actions */}
              {showChips && !streaming && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {chips.map((chip) => (
                    <button key={chip} onClick={() => sendMessage(chip)} className="px-3 py-1.5 text-xs rounded-full border border-milyfe-border text-milyfe-text-muted hover:border-milyfe-cyan hover:text-milyfe-cyan transition-colors">
                      {chip}
                    </button>
                  ))}
                </div>
              )}
              {/* Unlock prompt after 5 messages */}
              {messages.filter(m => m.role === "user").length >= 5 && (
                <div className="rounded-xl border border-milyfe-emerald/30 bg-milyfe-emerald/5 p-4 mt-4">
                  <p className="text-xs text-milyfe-text-muted">Ready to make this real? {catalog?.name} can be connected to your live systems today.</p>
                  <Button variant="gradient" size="sm" className="mt-2" onClick={() => window.location.href = `/factory/${factorySlug}/unlock?module=${agentSlug}`}>
                    Unlock This Module →
                  </Button>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-milyfe-border p-4">
              <MonoLabel className="block mb-2 text-[10px]">PRESS ENTER TO SEND · SHIFT+ENTER FOR NEWLINE</MonoLabel>
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={`Ask ${catalog?.name || "the agent"} something...`}
                  className="flex-1 resize-none rounded-lg border border-milyfe-border bg-milyfe-surface px-3 py-2 text-sm text-milyfe-text placeholder:text-milyfe-text-muted focus:outline-none focus:ring-1 focus:ring-milyfe-cyan/50 min-h-[40px] max-h-[120px]"
                  rows={1}
                />
                <Button variant="gradient" size="icon" onClick={() => sendMessage(input)} disabled={!input.trim() || streaming} className="h-10 w-10">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
