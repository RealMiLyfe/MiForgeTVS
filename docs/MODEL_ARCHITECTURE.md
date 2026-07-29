# MiLyfe Model Architecture — Tiered Routing

## Overview

MiLyfe uses a tiered Ollama model architecture optimized for the RX 7900 XTX GPU. Models are selected by task type, not by agent identity.

## Tier Definitions

### INSTANT RESPONSE TIER (< 500ms first token)
**Model:** `hermes3:3b` (2GB)
- Concierge greetings
- Agent quick acknowledgments ("On it", "Processing...")
- Standup heartbeats

### CLIENT-FACING VOICE TIER (persona-critical)
**Model:** `hermes3:8b` (5GB)
- Forge Concierge full conversation
- All 11 senior agent public chat
- Bespoke Forge preview generation
- Client dashboard AI interactions
- Dex email drafting (client voice)

### ORCHESTRATION TIER (function calling)
**Model:** `nemotron-mini:4b` (3GB)
- LangGraph node decisions
- Workflow routing
- Multi-agent handoff logic

### BACKEND BUSINESS REASONING TIER
**Model:** `qwen2.5:14b` (9GB)
- Calvin invoice processing
- Serena research and analysis
- Frank financial analysis
- Leo weekly retrospective
- Lia contract review
- Paula HR analysis
- Bespoke scope generation

### FAST TRIAGE TIER
**Model:** `qwen2.5:7b` (5GB)
- Sam daily support status
- Ian recurring vendor checks
- Quick-answer operations

### SPECIALIZED
- **Iris OCR:** `llava:13b` (8GB)
- **Code generation:** `qwen2.5-coder:14b` (9GB) — development only
- **Embeddings:** `nomic-embed-text` (274MB)

## NEVER in Default Routing
- `qwen2.5:32b` — too slow on RX 7900 XTX
- `qwen2.5-coder:32b` — too slow
- Any model 20GB+ — too slow

## Required Models (must all be pulled)
```
hermes3:3b
hermes3:8b
nemotron-mini:4b
qwen2.5:14b
qwen2.5-coder:14b
qwen2.5:7b
llava:13b
nomic-embed-text
```
