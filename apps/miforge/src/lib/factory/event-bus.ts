// Simple pub/sub event bus for agent card visual sync

type Callback = (data: unknown) => void;
const listeners: Map<string, Set<Callback>> = new Map();

export function subscribeToAgent(slug: string, cb: Callback): () => void {
  if (!listeners.has(slug)) listeners.set(slug, new Set());
  listeners.get(slug)!.add(cb);
  return () => { listeners.get(slug)?.delete(cb); };
}

export function dispatchAgentEvent(slug: string, data: unknown): void {
  listeners.get(slug)?.forEach((cb) => cb(data));
}
