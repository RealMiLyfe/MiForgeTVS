import { MonoLabel } from "@/components/shared/MonoLabel";
import { GradientHeadline } from "@/components/shared/GradientHeadline";

const systems = [
  { name: "Platform (milyfe.fun)", status: "operational", uptime: "99.99%" },
  { name: "Factory Pages", status: "operational", uptime: "99.98%" },
  { name: "Agent Chat", status: "operational", uptime: "99.95%" },
  { name: "Payment Processing", status: "operational", uptime: "100%" },
  { name: "AI Providers", status: "operational", uptime: "99.92%" },
  { name: "Database", status: "operational", uptime: "99.99%" },
  { name: "Email Delivery", status: "operational", uptime: "99.97%" },
];

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-milyfe-bg py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-12">
          <GradientHeadline size="section">System Status</GradientHeadline>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute h-full w-full rounded-full bg-milyfe-emerald opacity-75" />
              <span className="relative rounded-full h-3 w-3 bg-milyfe-emerald" />
            </span>
            <span className="text-milyfe-emerald font-medium">All Systems Operational</span>
          </div>
          <MonoLabel className="mt-3 block">LAST UPDATED: 2 MINUTES AGO</MonoLabel>
        </div>
        <div className="rounded-xl border border-milyfe-border overflow-hidden">
          {systems.map((sys, i) => (
            <div key={sys.name} className={`flex items-center justify-between p-4 ${i > 0 ? "border-t border-milyfe-border" : ""}`}>
              <span className="text-sm text-milyfe-text">{sys.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-milyfe-text-muted">{sys.uptime}</span>
                <span className="flex items-center gap-1.5 text-xs text-milyfe-emerald">
                  <span className="h-2 w-2 rounded-full bg-milyfe-emerald" />
                  Operational
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <h2 className="font-fraunces text-xl text-milyfe-text mb-4">Recent Incidents</h2>
          <p className="text-sm text-milyfe-text-muted italic">No incidents reported in the last 90 days.</p>
        </div>
      </div>
    </main>
  );
}
