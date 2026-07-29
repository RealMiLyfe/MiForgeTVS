import { MonoLabel } from "@/components/shared/MonoLabel";

export default function UnlockLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-milyfe-bg">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <MonoLabel className="block text-center mb-4">FACTORY ACTIVATION</MonoLabel>
        {children}
      </div>
    </div>
  );
}
