import type { ChatMessage } from "@/lib/supabase/types";

const STORAGE_PREFIX = "milyfe_chat_";

export function getSessionKey(factorySlug: string, agentSlug: string): string {
  return `${STORAGE_PREFIX}${factorySlug}_${agentSlug}`;
}

export function loadMessages(factorySlug: string, agentSlug: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  const key = getSessionKey(factorySlug, agentSlug);
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  try { return JSON.parse(stored); } catch { return []; }
}

export function saveMessages(factorySlug: string, agentSlug: string, messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  const key = getSessionKey(factorySlug, agentSlug);
  localStorage.setItem(key, JSON.stringify(messages));
}

export function appendMessage(factorySlug: string, agentSlug: string, message: ChatMessage): void {
  const msgs = loadMessages(factorySlug, agentSlug);
  msgs.push(message);
  saveMessages(factorySlug, agentSlug, msgs);
}
