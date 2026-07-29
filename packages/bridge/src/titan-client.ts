// TitanClient: Bridge between MiForge (Next.js) and Titan (Python agent runtime)
// When Titan is unreachable, falls back to MiForge's Supabase-driven mock data

export interface ClientState {
  slug: string;
  business_name: string;
  contact_name: string;
  contact_email: string;
  niche: string;
  platforms: string[];
  status: string;
  agents_active: string[];
  created_at: string;
}

export interface LedgerSummary {
  total_transactions: number;
  monthly_revenue: number;
  outstanding_receivables: number;
  last_transaction_date: string;
}

export interface LedgerTransaction {
  date: string;
  description: string;
  account: string;
  amount: number;
  currency: string;
}

export interface AgentActivity {
  id: string;
  agent_name: string;
  senior_agent: string;
  action: string;
  timestamp: string;
  channel: string;
  details?: string;
}

export interface MattermostMessage {
  id: string;
  message: string;
  user_id: string;
  username: string;
  create_at: number;
  channel_id: string;
}

export interface TitanHealth {
  status: "healthy" | "degraded" | "offline";
  services: Record<string, boolean>;
  agents_online: number;
  uptime_seconds: number;
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
  custom_notes?: string;
}

class TitanClient {
  private baseUrl: string;
  private token: string;
  private available: boolean | null = null;

  constructor() {
    this.baseUrl = process.env.TITAN_BRIDGE_URL || "http://localhost:8099";
    this.token = process.env.TITAN_BRIDGE_TOKEN || "";
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T | null> {
    if (!this.token) {
      console.log("[Titan Bridge] No bridge token configured - using placeholder mode");
      return null;
    }

    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json",
          ...options?.headers,
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        console.warn(`[Titan Bridge] ${path} returned ${res.status}`);
        return null;
      }

      this.available = true;
      return await res.json();
    } catch (error) {
      if (this.available !== false) {
        console.warn(`[Titan Bridge] Unreachable at ${this.baseUrl} - falling back to mock data`);
      }
      this.available = false;
      return null;
    }
  }

  async isAvailable(): Promise<boolean> {
    if (this.available !== null) return this.available;
    const health = await this.getHealth();
    return health !== null;
  }

  async getHealth(): Promise<TitanHealth | null> {
    return this.request<TitanHealth>("/health");
  }

  async getClientState(slug: string): Promise<ClientState | null> {
    return this.request<ClientState>(`/clients/${slug}`);
  }

  async getMattermostMessages(slug: string, limit = 20): Promise<MattermostMessage[] | null> {
    return this.request<MattermostMessage[]>(`/clients/${slug}/mattermost/messages?limit=${limit}`);
  }

  async getLedgerSummary(slug: string): Promise<LedgerSummary | null> {
    return this.request<LedgerSummary>(`/clients/${slug}/ledger/summary`);
  }

  async getLedgerTransactions(slug: string, limit = 50): Promise<LedgerTransaction[] | null> {
    return this.request<LedgerTransaction[]>(`/clients/${slug}/ledger/transactions?limit=${limit}`);
  }

  async getAgentActivity(slug: string, limit = 20): Promise<AgentActivity[] | null> {
    return this.request<AgentActivity[]>(`/clients/${slug}/agents/activity?limit=${limit}`);
  }

  async getAgentsStatus(): Promise<Record<string, string> | null> {
    return this.request<Record<string, string>>("/agents/status");
  }

  async triggerAudit(slug: string): Promise<{ success: boolean } | null> {
    return this.request<{ success: boolean }>(`/clients/${slug}/audit`, { method: "POST" });
  }

  async onboardClient(data: OnboardData): Promise<{ success: boolean; slug: string } | null> {
    return this.request<{ success: boolean; slug: string }>("/clients/onboard", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async executeAgent(seniorName: string, payload: Record<string, unknown>): Promise<unknown> {
    return this.request(`/agents/${seniorName}/execute`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async chatWithAgent(slug: string, seniorName: string, message: string, context?: string): Promise<{ response: string } | null> {
    return this.request<{ response: string }>(`/agents/${seniorName}/execute`, {
      method: "POST",
      body: JSON.stringify({ action: "chat", client_slug: slug, message, context }),
    });
  }
}

// Singleton instance
let instance: TitanClient | null = null;

export function getTitanClient(): TitanClient {
  if (!instance) instance = new TitanClient();
  return instance;
}
