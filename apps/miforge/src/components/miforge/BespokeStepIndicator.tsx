"use client";

export function BespokeStepIndicator({ currentStep, totalSteps = 5 }: { currentStep: number; totalSteps?: number }) {
  return (
    <div className="flex items-center justify-center gap-3 py-6">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
            i + 1 === currentStep
              ? "bg-milyfe-emerald shadow-lg shadow-milyfe-emerald/50 scale-125"
              : i + 1 < currentStep
              ? "bg-milyfe-gradient"
              : "bg-milyfe-surface-2 border border-milyfe-border"
          }`}
        />
      ))}
    </div>
  );
}
