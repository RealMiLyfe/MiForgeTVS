"use client";

import { MonoLabel } from "@/components/shared/MonoLabel";

interface PreviewData {
  agent_name?: string;
  capabilities?: string[];
  integrations?: string[];
  timeline_weeks?: string;
  recommended_tier?: string;
  estimated_forge_fee_low?: number;
  estimated_forge_fee_high?: number;
}

export function AgentPreviewPanel({ preview, loading }: { preview: PreviewData | null; loading: boolean }) {
  if (!preview && !loading) return null;

  return (
    <div className={`rounded-xl border p-6 mt-6 transition-all ${loading ? "border-milyfe-emerald/50 animate-pulse" : "border-milyfe-border"} bg-milyfe-surface`}>
      <MonoLabel className="text-milyfe-emerald mb-4 block">AGENT PREVIEW</MonoLabel>
      {loading ? (
        <div className="space-y-3">
          <div className="h-4 bg-milyfe-surface-2 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-milyfe-surface-2 rounded w-1/2 animate-pulse" />
          <div className="h-4 bg-milyfe-surface-2 rounded w-2/3 animate-pulse" />
        </div>
      ) : preview ? (
        <div className="space-y-4 text-sm">
          {preview.agent_name && (
            <p className="text-milyfe-text font-medium">{preview.agent_name}</p>
          )}
          <div>
            <p className="text-milyfe-text-muted mb-1">Based on your description, this agent would:</p>
            <ul className="space-y-1">
              {preview.capabilities?.map((cap, i) => (
                <li key={i} className="text-milyfe-text flex items-start gap-2">
                  <span className="text-milyfe-emerald">•</span> {cap}
                </li>
              ))}
            </ul>
          </div>
          {preview.integrations && preview.integrations.length > 0 && (
            <p className="text-milyfe-text-muted">
              <span className="text-milyfe-text">Ideal integrations:</span> {preview.integrations.join(", ")}
            </p>
          )}
          {preview.timeline_weeks && (
            <p className="text-milyfe-text-muted">
              <span className="text-milyfe-text">Estimated activation:</span> {preview.timeline_weeks}
            </p>
          )}
          {preview.recommended_tier && (
            <p className="text-milyfe-text-muted">
              <span className="text-milyfe-text">Recommended tier:</span> {preview.recommended_tier}
            </p>
          )}
          {preview.estimated_forge_fee_low && preview.estimated_forge_fee_high && (
            <p className="text-milyfe-text-muted">
              <span className="text-milyfe-text">Estimated forge fee:</span> ${preview.estimated_forge_fee_low.toLocaleString()} – ${preview.estimated_forge_fee_high.toLocaleString()}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
