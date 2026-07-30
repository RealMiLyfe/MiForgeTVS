# Bridge API Testing

The Titan Bridge API runs on port 8099 on the operator machine.

## Quick Start

```bash
# Get your auth token
TOKEN=$(cat /opt/milyfe/secrets/bridge-token.txt)

# Health (no auth required)
curl http://localhost:8099/health

# Authenticated endpoints
curl -H "Authorization: Bearer $TOKEN" http://localhost:8099/agents/status
```

## Endpoints

### Health & Status

```bash
# System health + Ollama connectivity
curl http://localhost:8099/health

# Verify required models are loaded
curl http://localhost:8099/health/models

# All 11 senior agent statuses
curl -H "Authorization: Bearer $TOKEN" http://localhost:8099/agents/status
```

### Agent Operations

```bash
# Daily standup (all agents post morning check-in)
curl -X POST -H "Authorization: Bearer $TOKEN" http://localhost:8099/agents/standup

# Serena: research a company
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"company":"PetSmart"}' http://localhost:8099/agents/serena/research

# Frank: client financial summary
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"client_name":"teresa-grooming"}' http://localhost:8099/agents/frank/summary

# Frank: invoice report
curl -X POST -H "Authorization: Bearer $TOKEN" http://localhost:8099/agents/frank/invoice-report

# Dex: draft vendor email
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"vendor":"Supply Co","subject":"Invoice Follow-up","context":"Invoice #1042 overdue 15 days"}' \
  http://localhost:8099/agents/dex/draft-email

# Leo: weekly retrospective
curl -X POST -H "Authorization: Bearer $TOKEN" http://localhost:8099/agents/leo/retrospective

# Sam: daily status
curl -X POST -H "Authorization: Bearer $TOKEN" http://localhost:8099/agents/sam/status

# Ian: check recurring vendors
curl -X POST -H "Authorization: Bearer $TOKEN" http://localhost:8099/agents/ian/recurring
```

### Client Data

```bash
# List all clients
curl -H "Authorization: Bearer $TOKEN" http://localhost:8099/clients

# Get specific client config
curl -H "Authorization: Bearer $TOKEN" http://localhost:8099/clients/teresa-grooming

# Client ledger balance
curl -H "Authorization: Bearer $TOKEN" http://localhost:8099/clients/teresa-grooming/ledger/summary

# Client transactions
curl -H "Authorization: Bearer $TOKEN" http://localhost:8099/clients/teresa-grooming/ledger/transactions

# Sovereignty report
curl -H "Authorization: Bearer $TOKEN" http://localhost:8099/clients/teresa-grooming/sovereignty
```

### Client Onboarding

```bash
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"slug":"new-client"}' http://localhost:8099/clients/onboard
```

## Response Format

All endpoints return:

```json
{
  "status": "success" | "error",
  "data": { ... },
  "message": "description"
}
```

## Auth

Bearer token read from `/opt/milyfe/secrets/bridge-token.txt`. If file doesn't exist, generate one:

```bash
openssl rand -hex 32 > /opt/milyfe/secrets/bridge-token.txt
chmod 600 /opt/milyfe/secrets/bridge-token.txt
```

Add the same token to Vercel as `TITAN_BRIDGE_TOKEN` environment variable.
