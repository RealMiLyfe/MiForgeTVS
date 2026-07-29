# MiForge ↔ Titan Integration Guide

## Bridge API

The Titan Bridge API runs on port 8099 and exposes:

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Service health check |
| GET | /agents/status | All 11 senior agent statuses |
| GET | /clients | List all provisioned clients |
| GET | /clients/:slug | Single client full state |
| POST | /clients/onboard | Trigger onboard-client.sh |
| POST | /clients/:slug/audit | Trigger cold audit sequence |
| GET | /clients/:slug/mattermost/messages | Channel messages for activity feed |
| GET | /clients/:slug/ledger/summary | hledger balance summary |
| GET | /clients/:slug/ledger/transactions | Transaction history |
| GET | /clients/:slug/agents/activity | Agent action log |
| POST | /agents/:senior_name/execute | Trigger any senior agent function |

## Authentication

Bearer token stored in `/opt/milyfe/secrets/bridge-token.txt` (Titan side) and `TITAN_BRIDGE_TOKEN` env var (MiForge side).

```
Authorization: Bearer <token>
```

## MiForge Environment Variables

```env
TITAN_BRIDGE_URL=http://localhost:8099
TITAN_BRIDGE_TOKEN=<shared-secret>
```

## Fallback Behavior

When `TITAN_BRIDGE_TOKEN` is unset or Titan is unreachable:
- Factory pages use Supabase/mock data (existing behavior)
- Activity feeds use generated events (existing behavior)
- Chat uses cloud AI providers (existing behavior)
- No error shown to users — seamless fallback

## Data Flow Examples

### Factory Page Load
1. MiForge checks Titan for client: `GET /clients/{slug}`
2. If exists → hydrate with real data (ledger, agents, activity)
3. If not → use Supabase demo data (specimens)

### Agent Chat (Titan-backed client)
1. User sends message in chat drawer
2. MiForge resolves catalog agent → senior agent via mapping
3. MiForge calls `POST /agents/{senior}/execute` with chat payload
4. Titan's senior agent responds using local Ollama model
5. Response streamed back to MiForge, displayed to user

### Client Onboarding
1. User completes 5-step unlock flow in MiForge
2. Step 5 ignition cinematic triggers `POST /clients/onboard`
3. Titan runs `onboard-client.sh` (creates dirs, ledger, Mattermost channel)
4. On completion, factory page hydrates from Titan automatically

## Error Handling

- Bridge timeout: 10 seconds per request
- On failure: log warning, return null, fall back to mock data
- Critical path (onboarding): queue in Supabase if Titan down, process when back
