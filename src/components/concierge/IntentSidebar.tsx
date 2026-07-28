"use client";

import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import type { IntentProfile } from "@/lib/agents/concierge/intent-extraction";

interface IntentSidebarProps {
  intent: IntentProfile | null;
  onGeneratePreview?: () => void;
}

export function IntentSidebar({ intent, onGeneratePreview }: IntentSidebarProps) {
  if (!intent || intent.confidence < 0.1) {
    return (
      <div className="p-4 text-center">
        <MonoLabel className="block mb-2">EMERGING INTENT</MonoLabel>
        <p className="text-xs text-milyfe-text-muted italic">
          Intent will surface here as the conversation deepens.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <MonoLabel>EMERGING INTENT</MonoLabel>
        <span className="text-[10px] font-mono text-milyfe-emerald">
          {Math.round(intent.confidence * 100)}% confidence
        </span>
      </div>

      {/* Confidence bar */}
      <div className="h-1 bg-milyfe-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-milyfe-gradient rounded-full transition-all duration-700"
          style={{ width: `${intent.confidence * 100}%` }}
        />
      </div>

      <div className="space-y-3 text-xs">
        {intent.business_type && (
          <IntentField label="BUSINESS TYPE" value={intent.business_type} />
        )}
        {intent.business_stage && (
          <IntentField label="CURRENT STAGE" value={capitalize(intent.business_stage)} />
        )}
        {intent.primary_pain && (
          <IntentField label="PRIMARY PAIN" value={intent.primary_pain} />
        )}
        {intent.secondary_pains.length > 0 && (
          <IntentField
            label="SECONDARY BOTTLENECKS"
            value={intent.secondary_pains.join(", ")}
          />
        )}
        {intent.desired_outcomes.length > 0 && (
          <IntentField
            label="DESIRED OUTCOME"
            value={intent.desired_outcomes.join(", ")}
          />
        )}
        {intent.emotional_state && (
          <IntentField label="EMOTIONAL STATE" value={capitalize(intent.emotional_state)} />
        )}
        {intent.business_scale && (
          <IntentField label="SCALE" value={capitalize(intent.business_scale.replace("_", " "))} />
        )}
        {intent.existing_infrastructure.length > 0 && (
          <IntentField
            label="INFRASTRUCTURE"
            value={intent.existing_infrastructure.join(", ")}
          />
        )}
        {intent.time_horizon && (
          <IntentField label="TIME HORIZON" value={capitalize(intent.time_horizon)} />
        )}
      </div>

      {/* Generate Preview CTA - appears at high confidence */}
      {intent.confidence >= 0.75 && onGeneratePreview && (
        <div className="pt-3 border-t border-milyfe-border">
          <p className="text-xs text-milyfe-text-muted mb-3">
            Ready to see what your factory could look like?
          </p>
          <Button
            variant="gradient"
            size="sm"
            className="w-full"
            onClick={onGeneratePreview}
          >
            Generate Preview Factory →
          </Button>
        </div>
      )}
    </div>
  );
}

function IntentField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <MonoLabel className="text-[9px] block mb-0.5">{label}</MonoLabel>
      <p className="text-milyfe-text">{value}</p>
    </div>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
