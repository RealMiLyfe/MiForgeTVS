// Discovery session lifecycle management
import type { ChatMessage } from "@/lib/supabase/types";

const SESSION_COOKIE = "milyfe_discovery_session";
const STORAGE_PREFIX = "milyfe_concierge_";

export function getDiscoveryToken(): string {
  if (typeof window === "undefined") return "";
  let token = getCookie(SESSION_COOKIE);
  if (!token) {
    token = `disc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    setCookie(SESSION_COOKIE, token, 30);
  }
  return token;
}

export function loadConciergeMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  const token = getDiscoveryToken();
  const stored = localStorage.getItem(`${STORAGE_PREFIX}${token}`);
  if (!stored) return [];
  try { return JSON.parse(stored); } catch { return []; }
}

export function saveConciergeMessages(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  const token = getDiscoveryToken();
  localStorage.setItem(`${STORAGE_PREFIX}${token}`, JSON.stringify(messages));
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}
