# MiLyfe : MiForge — Unified Platform

**MiLyfe forges autonomous businesses. Staffed by agents. Housed on sovereign hardware.**

## Architecture

```
/apps/miforge     → Next.js 14 presentation layer (client-facing)
/apps/titan       → Venture Titan Studio operational engine (agent execution)
/packages/bridge  → Integration layer between MiForge and Titan
/packages/agent-mapping → 32 catalog agents → 11 senior agent resolver
/infrastructure   → Supabase migrations + Docker configs
/docs             → Architecture, integration, and deployment docs
/scripts          → Unified startup and operational scripts
```

## Quick Start

```bash
# Start MiForge only (development without Titan)
cd apps/miforge && npm install && npm run dev

# Start unified platform (requires Titan infrastructure)
bash scripts/unified-start.sh
```

## Data Sovereignty

- **Supabase**: Marketing content, prospect sessions, demo data only
- **Titan PostgreSQL**: Real client data, ledgers, agent memory
- **Ollama**: Local AI models (hermes3:3b/8b voice, nemotron-mini:4b orchestration, qwen2.5:14b reasoning, llava:13b vision)
- Client data NEVER touches third-party clouds

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Integration Guide](docs/INTEGRATION.md)
- [Sovereign Positioning](docs/SOVEREIGN_POSITIONING.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Launch Checklist](docs/LAUNCH_CHECKLIST.md)
