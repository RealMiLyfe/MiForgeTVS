# MiLyfe Unified Architecture

## Overview

MiLyfe operates as a two-layer system:

- **MiForge** (Presentation Layer): Next.js 14 application handling all client-facing surfaces — marketing, factory pages, dashboards, Concierge, and checkout flows.
- **Venture Titan Studio** (Execution Layer): Python-based agent runtime with 11 senior AI agents running on dedicated hardware with PostgreSQL, Mattermost, Ollama, ChromaDB, and 14 total services.

## Data Sovereignty Model

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT-FACING (MiForge)                    │
│  Next.js · Supabase · Vercel · Public marketing/demo data   │
└───────────────────────────┬─────────────────────────────────┘
                            │ Bridge API (port 8099)
                            │ Bearer token auth
┌───────────────────────────┴─────────────────────────────────┐
│              SOVEREIGN CORE (Venture Titan Studio)            │
│  PostgreSQL · Ollama · Mattermost · ChromaDB · hledger       │
│  ALL real client data lives here. Never leaves.              │
└─────────────────────────────────────────────────────────────┘
```

- **Supabase** holds: marketing content, prospect sessions, demo data, Concierge sessions
- **Titan PostgreSQL** holds: real client data, ledger entries, agent memory, chat history
- Client data NEVER touches Supabase or third-party AI clouds

## Agent Architecture

### 32 Catalog Agents (Client-Facing Identities)
What clients see and interact with. Each has a name, personality, and domain focus.

### 11 Senior Agents (Execution Layer)
The actual AI agents doing the work on Titan hardware:
- **Forge** — Supervisor, orchestration
- **Calvin** — Finance (invoices, AR, payments)
- **Serena** — Research (SEO, leads, analysis)
- **Frank** — Reporting (ops reports, financials)
- **Dex** — Operations (email, scheduling, onboarding)
- **Lia** — Legal (contracts, proposals, QA)
- **Ian** — Inventory (products, expenses)
- **Sam** — Support (reviews, documentation)
- **Paula** — HR (interviews, coordination)
- **Iris** — Vision/OCR (document processing)
- **Leo** — Content (blogs, social, newsletters)

### Mapping
Each catalog agent maps to exactly one senior agent. When a client chats with "Email Reactivation Agent," Dex executes the work on Titan using Ollama locally.

## Bridge Layer

The bridge is a FastAPI server (port 8099) that exposes Titan's capabilities as HTTP endpoints. MiForge's TitanClient class handles all communication.

- If Titan is available: real data flows to MiForge
- If Titan is unreachable: MiForge falls back to Supabase mock data
- This dual-mode ensures development works without Titan running

## Deployment Topology

```
Production Machine (Dedicated Hardware)
├── Docker: PostgreSQL, Mattermost, Ollama, ChromaDB, Redis, MinIO, Grafana, Prometheus, Gotify, Caddy, n8n
├── Python: agent_runtime.py (11 senior agents)
├── Python: agent_api.py (bridge API, port 8099)
├── Node.js: MiForge Next.js (port 7800)
└── Caddy: reverse proxy (443 → 7800 for public, 8099 internal only)
```

## Key Design Decisions

1. **Bridge, don't merge** — Both databases remain independent
2. **Fallback gracefully** — MiForge works standalone for development
3. **Sovereign by default** — All client data on dedicated hardware
4. **Identity separation** — Clients see catalog names, Titan uses senior names
5. **One repo, two apps** — Monorepo with `/apps/miforge` + `/apps/titan`
