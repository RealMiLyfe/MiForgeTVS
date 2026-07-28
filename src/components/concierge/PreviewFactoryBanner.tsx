"use client";

import { MonoLabel } from "@/components/shared/MonoLabel";
import { Compass } from "lucide-react";

interface PreviewFactoryBannerProps {
  contactName: string;
  expiresAt?: string | null;
}

export function PreviewFactoryBanner({ contactName, expiresAt }: PreviewFactoryBannerProps) {
  const daysRemaining = expiresAt
    ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 30;

  return (
    <div className="relative z-10 w-full bg-milyfe-emerald/5 border-b border-milyfe-emerald/20 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Compass className="h-4 w-4 text-milyfe-emerald" />
        <span className="text-sm text-milyfe-text-muted">
          PREVIEW FACTORY · Built for {contactName} from your discovery session. Explore freely — commission activation whenever you&apos;re ready.
        </span>
      </div>
      <MonoLabel className="text-milyfe-emerald shrink-0 hidden sm:block">
        EXPIRES IN {daysRemaining} DAYS
      </MonoLabel>
    </div>
  );
}
