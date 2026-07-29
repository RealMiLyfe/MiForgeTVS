"use client";

import { useState, useEffect } from "react";

interface TitanStatus {
  available: boolean;
  loading: boolean;
}

// Client-side hook to check if Titan is backing a specific factory
export function useTitanStatus(factorySlug: string): TitanStatus {
  const [status, setStatus] = useState<TitanStatus>({ available: false, loading: true });

  useEffect(() => {
    // Check via API route (server-side bridge check)
    fetch(`/api/titan/check/${factorySlug}`)
      .then(res => res.json())
      .then(data => setStatus({ available: data.titanBacked || false, loading: false }))
      .catch(() => setStatus({ available: false, loading: false }));
  }, [factorySlug]);

  return status;
}

// Client-side hook for Titan activity stream
export function useTitanActivity(factorySlug: string, enabled: boolean) {
  const [messages, setMessages] = useState<unknown[]>([]);

  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/titan/activity/${factorySlug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.messages?.length) setMessages(data.messages);
        }
      } catch { /* Titan unavailable, use fallback */ }
    }, 10000);
    return () => clearInterval(interval);
  }, [factorySlug, enabled]);

  return messages;
}
