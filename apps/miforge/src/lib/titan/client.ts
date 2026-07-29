// TitanClient: Bridge between MiForge and Titan operational engine
// Fallback: returns null when Titan unavailable (MiForge uses Supabase mocks)

export interface ClientState {
  slug: string;
  business_name: string;
  contact_name: string;
  niche: string;
  platforms: string[];
  status: string;
  agents_active: string[];
}

export interface LedgerSummary {
  total_transactions: number;
  monthly_revenue: number;
  outstanding_receivables: number;
}

export interface TitanHealth {
  status: "healthy" | "degraded" | "offline";
  services: Record<string, boolean>;
  agents_online: number;
}

export interface OnboardData {
  slug: string;
  business_name: string;
  contact_name: string;
  contact_email: string;
  niche: string;
  platforms: string[];
  tier: string;
  selected_agents: string[];
}

class TitanClient {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = process.env.TITAN_BRIDGE_URL || "http://localhost:8099";
    this.token = process.env.TITAN_BRIDGE_TOKEN || "";
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T | null> {
    if (!this.token || this.token === "PLACEHOLDER") return null;
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json", ...options?.headers },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async isAvailable(): Promise<boolean> {
    return (await this.request("/health")) !== null;
  }

  async getHealth(): Promise<TitanHealth | null> { return this.request("/health"); }
  async getClientState(slug: string): Promise<ClientState | null> { return this.request(`/clients/${slug}`); }
  async getLedgerSummary(slug: string): Promise<LedgerSummary | null> { return this.request(`/clients/${slug}/ledger/summary`); }
  async getAgentsStatus(): Promise<Record<string, string> | null> { return this.request("/agents/status"); }
  async triggerAudit(slug: string): Promise<{ success: boolean } | null> { return this.request(`/clients/${slug}/audit`, { method: "POST" }); }
  async onboardClient(data: OnboardData): Promise<{ success: boolean } | null> { return this.request("/clients/onboard", { method: "POST", body: JSON.stringify(data) }); }
  async getMattermostMessages(slug: string, limit = 20): Promise<unknown[] | null> { return this.request(`/clients/${slug}/mattermost/messages?limit=${limit}`); }
}

let instance: TitanClient | null = null;
export function getTitanClient(): TitanClient {
  if (!instance) instance = new TitanClient();
  return instance;
}
