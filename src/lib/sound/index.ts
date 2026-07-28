// Sound design manager - placeholder mode logs to console

const STORAGE_KEY = "milyfe_sound_enabled";

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function toggleSound(): boolean {
  const next = !isSoundEnabled();
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, String(next));
  return next;
}

export function playSound(event: string): void {
  if (!isSoundEnabled()) return;
  // Check prefers-reduced-motion
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  console.log(`[Sound] Would play: ${event}`);
}
