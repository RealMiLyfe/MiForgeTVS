# Sovereign Positioning

## What "Sovereign" Means

MiLyfe operates on dedicated hardware that we own and control. Client data never touches:
- Third-party AI clouds (OpenAI, Anthropic, Google)
- Shared cloud databases
- Multi-tenant SaaS infrastructure

## Technical Implementation

- **AI Models**: Ollama running locally (qwen2.5-coder:14b, qwen2.5:7b, llava:13b)
- **Database**: PostgreSQL on dedicated hardware (port 5433)
- **Agent Memory**: ChromaDB on dedicated hardware
- **Communications**: Self-hosted Mattermost
- **File Storage**: Self-hosted MinIO
- **Monitoring**: Self-hosted Grafana + Prometheus

## Client Data Sovereignty

For every activated client:
- Dedicated directory: `/opt/milyfe/clients/{slug}/`
- Dedicated ledger journal (hledger format)
- Dedicated Mattermost channel
- Dedicated Chroma collection for agent memory
- All data encrypted at rest

## Transparency Features

Clients see in their dashboard:
- Which agents ran and when
- What data was accessed
- Where data is stored
- Backup status
- Encryption status

## Compliance Readiness

Sovereign infrastructure enables:
- GDPR Article 28 compliance (no sub-processors for core AI)
- Data residency guarantees (physical location known)
- Right to erasure (single directory deletion)
- Audit trail (hledger immutable journal)

## Marketing Language

Key phrases for client-facing copy:
- "Your data never leaves our hardware"
- "Sovereign by default"
- "No third-party AI clouds"
- "Local AI models on dedicated infrastructure"
- "You can audit everything — we hide nothing"

## Pricing Differentiation

Sovereign positioning justifies premium pricing:
- Sovereign Factory: $75,000 forge fee, $6,500/mo retainer, 12% uplift
- Standard/Specimen: Use cloud AI providers (Anthropic, OpenAI) for cost efficiency
- Sovereign: Runs entirely on local models — higher cost, complete privacy
