import { NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const serviceEndpoints: Record<string, string> = {
  "Ollama": "http://localhost:11434/api/tags",
  "OpenWebUI": "http://localhost:3000",
  "AnythingLLM": "http://localhost:3022",
  "Metabase": "http://localhost:3052",
  "Grafana": "http://localhost:3003",
  "Langfuse": "http://localhost:3004",
  "Flowise": "http://localhost:3005",
  "n8n": "http://localhost:5679",
  "Chroma": "http://localhost:8001/api/v2/heartbeat",
  "Mattermost": "http://localhost:8065",
  "Prometheus": "http://localhost:9090",
  "Argilla": "http://localhost:6900",
  "MLflow": "http://localhost:5000",
  "Gotify": "http://localhost:8070",
};

export async function GET() {
  const results = [];

  for (const [name, url] of Object.entries(serviceEndpoints)) {
    let status: "healthy" | "degraded" | "unhealthy" = "unhealthy";
    let message = "";

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(url, {
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeout);

      if (res.ok || res.status === 401 || res.status === 302) {
        status = "healthy";
        message = `HTTP ${res.status}`;
      } else {
        status = "degraded";
        message = `HTTP ${res.status}`;
      }
    } catch (err: unknown) {
      status = "unhealthy";
      message = err instanceof Error ? err.message : "unreachable";
    }

    await db
      .update(services)
      .set({ status, lastChecked: new Date() })
      .where(eq(services.name, name));

    results.push({ name, status, message, url });
  }

  return NextResponse.json({
    results,
    checkedAt: new Date().toISOString(),
    healthy: results.filter((r) => r.status === "healthy").length,
    total: results.length,
  });
}
