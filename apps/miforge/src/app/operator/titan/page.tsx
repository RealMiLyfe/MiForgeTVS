"use client";

import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { StatusPill } from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";

const services = [
  { name: "PostgreSQL (5433)", status: "operational" },
  { name: "Mattermost (8065)", status: "operational" },
  { name: "Ollama (11434)", status: "operational" },
  { name: "ChromaDB (8001)", status: "operational" },
  { name: "n8n (5678)", status: "operational" },
  { name: "Grafana (3004)", status: "operational" },
  { name: "Prometheus (9091)", status: "operational" },
  { name: "Gotify (8070)", status: "operational" },
  { name: "Redis (6380)", status: "operational" },
  { name: "MinIO (9000)", status: "operational" },
  { name: "Bridge API (8099)", status: "operational" },
  { name: "Agent Runtime", status: "operational" },
  { name: "Caddy (443/80)", status: "operational" },
  { name: "MiForge (7800)", status: "operational" },
];

export default function OperatorTitanPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <GradientHeadline size="card" as="h1">Titan Operations.</GradientHeadline>
          <p className="text-sm text-milyfe-text-muted mt-1">Sovereign infrastructure status. 14 services across dedicated hardware.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">Force Agent Standup</Button>
          <Button variant="ghost" size="sm">Refresh Tokens</Button>
        </div>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "AGENTS ONLINE", value: "11/11" },
          { label: "ACTIONS TODAY", value: "247" },
          { label: "LEDGER TXN TODAY", value: "18" },
          { label: "GPU UTILIZATION", value: "34%" },
        ].map(m => (
          <div key={m.label} className="rounded-xl border border-milyfe-border bg-milyfe-surface p-4">
            <MonoLabel className="block text-[9px] mb-1">{m.label}</MonoLabel>
            <span className="font-mono text-xl font-bold text-milyfe-gradient">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Services Grid */}
      <div>
        <MonoLabel className="block mb-4">INFRASTRUCTURE SERVICES</MonoLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {services.map(s => (
            <div key={s.name} className="flex items-center justify-between rounded-lg border border-milyfe-border p-3">
              <span className="text-sm text-milyfe-text">{s.name}</span>
              <StatusPill variant="active">OPERATIONAL</StatusPill>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <MonoLabel className="block mb-4">QUICK ACTIONS</MonoLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "Restart All Services", desc: "docker compose restart" },
            { label: "View Agent Logs", desc: "tail agent-runtime.log" },
            { label: "Refresh Mattermost Token", desc: "refresh-mm-token.sh" },
            { label: "Run Health Check", desc: "health-check.sh" },
            { label: "Force Standup", desc: "Trigger all agents standup" },
            { label: "Backup All Data", desc: "backup-clients.sh" },
          ].map(a => (
            <div key={a.label} className="rounded-lg border border-milyfe-border p-4">
              <p className="text-sm font-medium text-milyfe-text">{a.label}</p>
              <p className="text-[10px] font-mono text-milyfe-text-muted mt-1">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sovereign Badge */}
      <div className="rounded-xl border border-milyfe-emerald/30 bg-milyfe-emerald/5 p-6 text-center">
        <MonoLabel className="text-milyfe-emerald">🔒 SOVEREIGN INFRASTRUCTURE</MonoLabel>
        <p className="text-sm text-milyfe-text-muted mt-2">All data on dedicated hardware. No third-party AI clouds. Full client data sovereignty.</p>
      </div>
    </div>
  );
}
