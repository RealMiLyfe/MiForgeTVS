"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Compass } from "lucide-react";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import {
  loadConciergeMessages,
  saveConciergeMessages,
  getDiscoveryToken,
} from "@/lib/concierge/session-manager";
import type { ChatMessage } from "@/lib/supabase/types";

interface ConciergeChatProps {
  initialMessage?: string;
  compact?: boolean;
}

export function ConciergeChat({ initialMessage, compact = false }: ConciergeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialized = useRef(false);

  // Load session on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const saved = loadConciergeMessages();
    if (saved.length > 0) {
      setMessages(saved);
    } else if (initialMessage) {
      // User submitted from homepage — send immediately
      const userMsg: ChatMessage = {
        role: "user",
        content: initialMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages([userMsg]);
      saveConciergeMessages([userMsg]);
      sendToAPI(initialMessage, [userMsg]);
    }
  }, [initialMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streamText]);

  const sendToAPI = useCallback(
    async (text: string, currentMessages: ChatMessage[]) => {
      setStreaming(true);
      setStreamText("");
      try {
        const res = await fetch("/api/concierge/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            session_token: getDiscoveryToken(),
            message_count: currentMessages.filter(
              (m) => m.role === "user"
            ).length,
          }),
        });
        if (!res.ok) throw new Error("Chat failed");

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk
              .split("\n")
              .filter((l) => l.startsWith("data: "));
            for (const line of lines) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.done) {
                  fullText = data.full_text || fullText;
                } else if (data.text) {
                  fullText += data.text;
                  setStreamText(fullText);
                }
              } catch {
                /* skip malformed */
              }
            }
          }
        }

        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: fullText,
          timestamp: new Date().toISOString(),
        };
        const updated = [...currentMessages, assistantMsg];
        setMessages(updated);
        saveConciergeMessages(updated);
      } catch (err) {
        console.error("[Concierge Chat Error]", err);
        const errMsg: ChatMessage = {
          role: "assistant",
          content:
            "I seem to have lost the thread for a moment. Could you try again?",
          timestamp: new Date().toISOString(),
        };
        const updated = [...currentMessages, errMsg];
        setMessages(updated);
        saveConciergeMessages(updated);
      }
      setStreaming(false);
      setStreamText("");
    },
    []
  );

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || streaming) return;
      const userMsg: ChatMessage = {
        role: "user",
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };
      const updated = [...messages, userMsg];
      setMessages(updated);
      saveConciergeMessages(updated);
      setInput("");
      sendToAPI(text.trim(), updated);
    },
    [messages, streaming, sendToAPI]
  );

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${compact ? "text-sm" : ""}`}
      >
        {messages.length === 0 && !streaming && (
          <div className="flex justify-start">
            <div className="max-w-[85%] border-l-2 border-milyfe-emerald/50 pl-4 py-1 text-sm text-milyfe-text whitespace-pre-wrap">
              Hi — I&apos;m the Forge Concierge. Before we talk about what
              MiForge could build for you, I&apos;d rather understand your
              business first.{"\n\n"}What&apos;s going on that made you land
              here today?
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            {msg.role === "user" ? (
              <div className="max-w-[75%] bg-milyfe-surface-2 rounded-2xl rounded-br-sm px-4 py-3 text-sm text-milyfe-text">
                {msg.content}
              </div>
            ) : (
              <div className="max-w-[85%] border-l-2 border-milyfe-emerald/50 pl-4 py-1 text-sm text-milyfe-text whitespace-pre-wrap">
                {msg.content}
              </div>
            )}
          </div>
        ))}

        {streaming && (
          <div className="flex justify-start">
            <div className="max-w-[85%] border-l-2 border-milyfe-emerald pl-4 py-1 text-sm text-milyfe-text whitespace-pre-wrap">
              {streamText || (
                <span className="inline-flex gap-1 text-milyfe-text-muted">
                  <span className="animate-bounce">·</span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  >
                    ·
                  </span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  >
                    ·
                  </span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-milyfe-border p-3">
        {!compact && (
          <MonoLabel className="block mb-2 text-[10px]">
            PRESS ENTER TO SEND · SHIFT+ENTER FOR NEWLINE
          </MonoLabel>
        )}
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Continue the conversation..."
            className="flex-1 resize-none rounded-lg border border-milyfe-border bg-milyfe-surface px-3 py-2 text-sm text-milyfe-text placeholder:text-milyfe-text-muted focus:outline-none focus:ring-1 focus:ring-milyfe-emerald/50 min-h-[40px] max-h-[100px]"
            rows={1}
          />
          <Button
            variant="gradient"
            size="icon"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || streaming}
            className="h-10 w-10 shrink-0"
          >
            {compact ? (
              <Compass className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
