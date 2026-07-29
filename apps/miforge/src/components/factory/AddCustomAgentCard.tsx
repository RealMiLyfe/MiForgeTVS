"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

export function AddCustomAgentCard({ factorySlug }: { factorySlug: string }) {
  return (
    <Link
      href={`/miforge/bespoke?prefill_factory=${factorySlug}&ref=factory_page`}
      className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-milyfe-border p-5 hover:border-milyfe-cyan/40 transition-colors min-h-[200px] cursor-pointer"
    >
      <Plus className="h-8 w-8 text-milyfe-gradient mb-3" />
      <span className="font-fraunces text-base text-milyfe-text">Add an Agent</span>
      <span className="text-xs text-milyfe-text-muted mt-1">Or forge a custom one</span>
    </Link>
  );
}
