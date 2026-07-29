export function formatRevenue(n: number | null): string {
  if (!n) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

export function formatCustomerCount(n: number | null): string {
  if (!n) return "0";
  if (n >= 100_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

export function formatValuationRange(low: number | null, high: number | null): string {
  if (!low || !high) return "—";
  return `${formatRevenue(low)} - ${formatRevenue(high)}`;
}

export function formatFactoryNumber(n: number): string {
  return `#${String(n).padStart(3, "0")}`;
}

export function calculateRecoverableValue(lifetimeRevenue: number | null): number {
  if (!lifetimeRevenue) return 0;
  return Math.round((lifetimeRevenue / 52) * 0.15);
}
