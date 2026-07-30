# MiLyfe: Venture Titan Studio

Autonomous business operating system. Sovereign AI agents running on dedicated hardware, connected to a client-facing presentation layer.

## Architecture

```
apps/
  miforge/        Next.js 14 frontend (75 routes, deployed to Vercel)
  titan/          Python agent runtime + Bridge API (runs on operator hardware)
    agents/
      api/        FastAPI bridge on port 8099
      runtime/    11 senior agents orchestrated via Ollama
      memory/     ChromaDB vector memory manager
      ocr/        Iris vision/invoice processor
      payments/   GoCardless payment handler
    scripts/      System startup and client onboarding

packages/
  bridge/         TypeScript client for MiForge <-> Titan communication
  agent-mapping/  32 catalog agents -> 11 senior agent resolver

scripts/          Unified platform startup
docs/             Architecture, deployment, and API documentation
```

## Running

### MiForge (Frontend)

```bash
cd apps/miforge
npm install
npm run dev
```

Deployed to Vercel with `rootDirectory: apps/miforge`. Works standalone in placeholder/mock mode without Titan.

### Titan (Agent Engine)

Runs on the operator machine at `/home/milyfe/Desktop/TVS`.

```bash
# Start everything
bash apps/titan/scripts/start-milyfe.sh

# Or start bridge API only
cd apps/titan
python3 agents/api/agent_api.py
```

Requires: Ollama (port 11434), PostgreSQL (port 5433), Mattermost (port 8065), ChromaDB (port 8001).

## Infrastructure (Operator Machine)

| Service | Port | Status |
|---------|------|--------|
| Ollama | 11434 | 20 models loaded |
| Bridge API | 8099 | FastAPI, token-authenticated |
| Mattermost | 8065 | 14 channels, 11 bots |
| PostgreSQL | 5433 | Titan operational data |
| ChromaDB | 8001 | Agent memory / RAG |
| MiForge (local) | 7800 | Next.js dev server |

## AI Models (Local Ollama)

| Tier | Model | Purpose |
|------|-------|---------|
| Instant | hermes3:3b | Sub-500ms greetings |
| Voice | hermes3:8b | Client-facing conversation |
| Orchestration | nemotron-mini:4b | Function calling, routing |
| Reasoning | qwen2.5:14b | Backend business analysis |
| Triage | qwen2.5:7b | Quick lightweight decisions |
| Vision | llava:13b | Invoice OCR, documents |
| Embeddings | nomic-embed-text | Memory and retrieval |

No 32B models in default routing. No third-party AI clouds for client data.

## Connecting MiForge to Titan

Set these environment variables in Vercel:

```
TITAN_BRIDGE_URL=https://your-tunnel.trycloudflare.com  (or public IP:8099)
TITAN_BRIDGE_TOKEN=<contents of /opt/milyfe/secrets/bridge-token.txt>
```

MiForge falls back to mock data when Titan is unreachable.

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production monorepo (MiForge + Titan bridge + docs) |
| `tvs-source` | Raw Titan machine snapshot (full git history, no node_modules) |

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Bridge API Testing](docs/BRIDGE_API_TESTING.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Model Architecture](docs/MODEL_ARCHITECTURE.md)
- [Integration Guide](docs/INTEGRATION.md)
- [Sovereign Positioning](docs/SOVEREIGN_POSITIONING.md)
- [Launch Checklist](docs/LAUNCH_CHECKLIST.md)

## Data Sovereignty

- All client data stays on operator hardware
- AI inference runs locally via Ollama
- Zero third-party AI API calls for production workloads
- Supabase used only for marketing/prospect data (no real client data)
- Bridge API authenticated with per-deployment tokens
