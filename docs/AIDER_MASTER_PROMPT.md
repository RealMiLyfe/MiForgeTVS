# AIDER MASTER PROMPT — MiLyfe Venture Titan Studio Full Integration

You are working on MiLyfe Venture Titan Studio, a production autonomous business operating system. The repository has been merged with the MiForge presentation layer into a monorepo. Your job is to merge the framework additions into the live Titan runtime, fix known bugs, create the Bridge API, add memory/learning, and prepare for full unified operation.

---

## SYSTEM CONTEXT — READ CAREFULLY

### Machine State (Live on This Machine)
- **OS:** Ubuntu 26.04
- **Hardware:** ASRock B460 / i9-10900F / RX 7900 XTX
- **Working directory:** `/home/milyfe/Desktop/TVS/`
- **Clients directory:** `/opt/milyfe/clients/` (2 clients: `teresa-grooming`, `ohio-landscaping`)
- **Secrets directory:** `/opt/milyfe/secrets/`
- **Logs directory:** `/opt/milyfe/logs/`
- **Build artifacts:** `/opt/milyfe/build/`

### Running Services (14 currently healthy)
| Service | Port | Notes |
|---------|------|-------|
| PostgreSQL | 5433 | DBs: milyfe_vts, mattermost, langfuse, n8n |
| Ollama | 11434 | 15 models, primary: qwen2.5-coder:14b for agents |
| Mattermost | 8065 | 14 channels, 11 bot accounts |
| ChromaDB | 8001 | Use `/api/v2/` endpoints ONLY |
| n8n | 5679 | 8 active workflows |
| Langfuse | 3004 | Tracing |
| Grafana | 3004 | Monitoring |
| Prometheus | 9091 | Metrics |
| Gotify | 8070 | Push notifications |
| Redis | 6380 | Cache |
| MinIO | 9000 | Object storage |
| Caddy | 443/80 | Reverse proxy |
| Agent Runtime | — | Python process (agents/runtime/agent_runtime.py) |
| **Bridge API** | **8099** | **NEW — you are creating this** |

### Secrets Files (already exist at /opt/milyfe/secrets/)
- `bot-tokens.json` — contains `mattermost_bot_token`, per-agent tokens, `forge-supervisor` token
- `channel-ids.json` — maps channel names to Mattermost channel IDs (keys like `client-teresa-grooming`, `general`, `human-approvals`, `learning-log`)
- `mm-admin-token.txt` — Mattermost admin token
- `mm-team-id.txt` — Mattermost team ID
- `clients.json` — list of all onboarded clients with metadata
- `payment-keys.json` — GoCardless keys
- `bridge-token.txt` — **GENERATE IF MISSING** (32-char hex)

### Agent Mapping (32 MiForge catalog agents → 11 Titan seniors)
```yaml
forge: [supervisor only, orchestration, standups]
calvin: [customer_service, fulfillment_monitor, invoice_followup, abandoned_cart_recovery]
serena: [seo_refresh, lead_qualification, influencer_outreach, candidate_screening]
frank: [ops_reporting, weekly_client_report, financial_weekly_snapshot, project_status_update]
dex: [cold_outbound, email_reactivation, meeting_scheduling, client_onboarding, renewal_retention]
lia: [contract_review, proposal_generation, deliverable_qa]
ian: [product_launch, expense_categorization]
sam: [review_response, onboarding_documentation]
paula: [interview_coordinator]
iris: [vision/OCR infrastructure only]
leo: [blog_content, newsletter, podcast_shownotes, youtube_script, ad_copy, social_content]
```

### Existing Scheduled Workflows (DO NOT MODIFY THESE SCHEDULES)
- 7:00 AM — `daily_standup()` (Forge)
- 9:00 AM — Dex operations check
- 11:00 AM Tuesday — `ian_check_recurring_vendors()` (Ian)
- 6:00 PM — `frank_all_clients_summary()` (Frank)
- 5:00 PM Friday — `weekly_retrospective()` (Leo)
- 9:00 AM Sunday — `leo_weekly_error_report()` (Leo)
- 8:00 AM Monday — `serena_monitor_vendors()` (Serena)

### MiForge Integration (What Calls the Bridge API)
- MiForge Next.js app deployed to Vercel at `milyfe.fun`
- MiForge calls Titan via: `TITAN_BRIDGE_URL` + `TITAN_BRIDGE_TOKEN` env vars
- If Bridge API unreachable, MiForge falls back to Supabase mock data silently
- MiForge TitanClient (TypeScript) expects these response shapes from every endpoint:
  - Health: `{ status, services: {}, agents_online, uptime_seconds }`
  - Agent functions: `{ status: "success"|"error", data: {...}, message: "..." }`
  - Client state: full config.json contents
  - Mattermost messages: `{ messages: [{id, message, user_id, username, create_at}], count, channel }`
  - Ledger: `{ balances: "...", error: null }` or `{ transactions: [...], count }`

---

## PHASE 1 — Fix the Six Known Bugs in `agents/runtime/agent_runtime.py`

**Bug 1: hledger path**
ALL subprocess calls to hledger must use absolute path `["/usr/bin/hledger", "-f", ...]`. Search entire file. Replace every instance of `["hledger"` or `["", "-f"` with `["/usr/bin/hledger"`.

**Bug 2: Serena vendor regex too narrow**
In `serena_monitor_vendors()`, replace:
```python
r"expenses:vendors\s+(\w+)"
```
With multi-line regex that captures full vendor names:
```python
r"(\d{4}[-/]\d{2}[-/]\d{2})\s+(.+)\n\s+expenses:vendors"
```
Use `re.MULTILINE` flag. Extract group 2 as vendor name.

**Bug 3: Dex NoneType on regex**
In `dex_check_overdue_vendors()`, wrap ALL `match.group()` calls in `if match:` guards. Return gracefully when journal has no matching transactions.

**Bug 4: Ian scope bug**
In `ian_check_recurring_vendors()`, the variable `content` is overwritten each loop iteration. Fix: accumulate ALL ledger file contents into a list, then analyze the accumulated data. Preserve per-client attribution.

**Bug 5: Frank subprocess consistency**
Audit every subprocess call in Frank's functions. Ensure they ALL use `/usr/bin/hledger`. Capture both stdout and stderr. Log errors to `/opt/milyfe/logs/agent-runtime.log`.

**Bug 6: General robustness**
- Add `try/except` around EVERY subprocess call to hledger
- Add `try/except` around EVERY `requests.post`/`requests.get` to Mattermost, Ollama, Chroma
- Log all caught exceptions to `/opt/milyfe/logs/agent-runtime.log` with ISO timestamps
- Use this pattern:
```python
import logging
logging.basicConfig(filename='/opt/milyfe/logs/agent-runtime.log', level=logging.INFO, 
                    format='%(asctime)s [%(levelname)s] %(message)s')
```

After fixes, verify: `python3 -m py_compile agents/runtime/agent_runtime.py`

---

## PHASE 2 — Create Bridge API at `agents/api/agent_api.py`

Create a complete FastAPI service. Requirements:

**Server config:**
- Port: 8099
- Host: 0.0.0.0
- Framework: FastAPI + uvicorn
- Log every request to `/opt/milyfe/logs/bridge-api.log`

**Authentication:**
- Read token from `/opt/milyfe/secrets/bridge-token.txt`
- If file missing, fallback to env var `TITAN_BRIDGE_TOKEN`
- If neither exists, run in dev mode (no auth)
- Verify via `Authorization: Bearer <token>` header
- Return 401 on missing/invalid token

**CORS:**
```python
allow_origins=["http://localhost:7800", "http://localhost:3000", 
               "https://milyfe.fun", "https://*.vercel.app"]
```

**Response format (EVERY endpoint):**
```json
{"status": "success", "data": {...}, "message": "description"}
```
On error:
```json
{"status": "error", "data": null, "message": "error description"}
```

**Import from agent_runtime.py:**
```python
sys.path.insert(0, str(Path(__file__).parent.parent / "runtime"))
from agent_runtime import (
    daily_standup, serena_research_company, serena_monitor_vendors,
    frank_client_summary, frank_all_clients_summary, daily_invoice_report,
    leo_weekly_error_report, weekly_retrospective, ian_check_recurring_vendors,
    sam_daily_status, dex_draft_vendor_email, dex_check_overdue_vendors,
    SENIOR_AGENTS
)
```

**Endpoints to implement:**

Health/Status:
- `GET /health` — check Ollama (GET localhost:11434/api/tags), PostgreSQL (psql ping on 5433), Mattermost (GET localhost:8065/api/v4/system/ping), Chroma (GET localhost:8001/api/v2/heartbeat)
- `GET /agents/status` — return all 11 agents with model, last_heartbeat, status

Agent functions:
- `POST /agents/standup` → `daily_standup()`
- `POST /agents/serena/research` body: `{"company": str}` → `serena_research_company(company)`
- `POST /agents/serena/monitor` → `serena_monitor_vendors()`
- `POST /agents/frank/summary` body: `{"client_name": str}` → `frank_client_summary(client_name)`
- `POST /agents/frank/all-clients` → `frank_all_clients_summary()`
- `POST /agents/frank/invoice-report` → `daily_invoice_report()`
- `POST /agents/leo/errors` → `leo_weekly_error_report()`
- `POST /agents/leo/retrospective` → `weekly_retrospective()`
- `POST /agents/ian/recurring` → `ian_check_recurring_vendors()`
- `POST /agents/sam/status` → `sam_daily_status()`
- `POST /agents/dex/draft-email` body: `{"vendor": str, "subject": str, "context": str}` → `dex_draft_vendor_email(vendor, subject, context)`
- `POST /agents/dex/check-overdue` → `dex_check_overdue_vendors()`

Client management:
- `POST /clients/onboard` body: `{"slug": str, "business_name": str, "contact_name": str, "contact_email": str, "niche": str, "platforms": [str], "custom_notes": str, "tier": str, "selected_agents": [str]}` → runs `subprocess.run(["/bin/bash", "/home/milyfe/Desktop/TVS/scripts/onboard-client.sh", slug], ...)`, then writes metadata to `/opt/milyfe/clients/{slug}/config.json`
- `GET /clients/{slug}` → reads `/opt/milyfe/clients/{slug}/config.json`
- `GET /clients` → reads `/opt/milyfe/secrets/clients.json`

Data endpoints:
- `GET /clients/{slug}/mattermost/messages?limit=50` → load `forge-supervisor` token from `/opt/milyfe/secrets/bot-tokens.json`, look up channel_id from `/opt/milyfe/secrets/channel-ids.json` (key: `client-{slug}`), call `GET http://localhost:8065/api/v4/channels/{channel_id}/posts?per_page={limit}`, transform and return
- `GET /clients/{slug}/ledger/summary` → run `/usr/bin/hledger -f /opt/milyfe/clients/{slug}/ledger/{slug}.journal balance --flat --no-total`, return output
- `GET /clients/{slug}/ledger/transactions?limit=100` → run `/usr/bin/hledger -f {journal} register --output-format=json`, parse and return last N
- `GET /clients/{slug}/agents/activity?limit=50` → read recent Mattermost posts from client channel, filter bot/agent posts
- `GET /clients/{slug}/memory/context?query={text}&top_k=5` → query Chroma collection `client_{slug}_memory` using nomic-embed-text embedding from Ollama, return top matches
- `GET /clients/{slug}/sovereignty` → return real sovereignty metadata (see Phase 4)

Webhooks:
- `POST /webhooks/mattermost` — receive Mattermost outbound webhooks (log and acknowledge)
- `POST /webhooks/gocardless` — receive GoCardless webhooks (log, update ledger if payment confirmed)

---

## PHASE 3 — Create Memory Manager at `agents/memory/memory_manager.py`

```python
class MemoryManager:
    def __init__(self):
        # Chroma client: http://localhost:8001 (use v2 API)
        # Ollama embedding: POST http://localhost:11434/api/embeddings 
        #   with model "nomic-embed-text"
    
    def _get_embedding(self, text: str) -> list[float]:
        # POST to Ollama embeddings endpoint
    
    def _ensure_collection(self, name: str):
        # GET /api/v2/collections/{name} — create if 404
    
    def store_client_memory(self, client_slug, agent_name, action_type, content, metadata=None):
        # Collection: client_{client_slug}_memory
        # Generate embedding, store doc with metadata
    
    def query_client_memory(self, client_slug, query_text, top_k=5) -> list[dict]:
        # Query client collection, return top matches
    
    def store_platform_pattern(self, pattern_type, situation, approach, outcome, metadata=None):
        # Collection: platform_patterns
    
    def query_platform_patterns(self, situation, top_k=3) -> list[dict]:
        # Query cross-client patterns
    
    def summarize_client_context(self, client_slug, top_k=20) -> str:
        # Return text summary for prompt injection
```

Integrate into `agent_runtime.py`:
- Import at top: `from agents.memory.memory_manager import MemoryManager`
- Instantiate: `memory = MemoryManager()`
- Calvin: check memory before processing new vendor invoices, store after
- Serena: check if company researched in last 7 days, store new research
- Dex: check for prior emails to same vendor type, store drafts as templates
- Frank: pull client context from memory to inform reports

Add `leo_weekly_learning_cycle()`:
- Reads all client memories from past week
- Extracts patterns using qwen2.5-coder:14b
- Stores to `platform_patterns` collection
- Posts summary to `#learning-log` Mattermost channel
- Schedule: Friday 5:30 PM (add to existing scheduler)

---

## PHASE 4 — Sovereignty Metadata Endpoint

Add to `agent_api.py`:

`GET /clients/{slug}/sovereignty` returns:
```json
{
  "status": "success",
  "data": {
    "data_location": "MiLyfe Venture Titan Studio — On-Premise Hardware",
    "hardware": "ASRock B460 / i9-10900F / RX 7900 XTX / Ubuntu 26.04",
    "ai_models_used": ["qwen2.5-coder:14b (local)", "llava:13b (local)", "nomic-embed-text (local)"],
    "third_party_ai_calls_this_month": 0,
    "data_never_left_hardware": true,
    "ledger_transactions_stored": "<count from hledger>",
    "chat_sessions_stored": "<count from mattermost channel posts>",
    "memory_documents_stored": "<count from chroma collection>",
    "backup_status": "daily encrypted backups",
    "compliance_ready": ["GDPR Article 28", "SOC 2 Type I compatible", "HIPAA compatible with BAA"]
  }
}
```

Get real counts by:
- Ledger: run `hledger -f {journal} stats` and parse transaction count
- Chat: query Mattermost API for post count in client channel
- Memory: query Chroma collection stats

---

## PHASE 5 — Update `scripts/start-milyfe.sh`

Add BEFORE the agent runtime starts:
```bash
# Generate bridge token if missing
if [ ! -f /opt/milyfe/secrets/bridge-token.txt ]; then
  echo "Generating bridge token..."
  openssl rand -hex 32 > /opt/milyfe/secrets/bridge-token.txt
  chmod 600 /opt/milyfe/secrets/bridge-token.txt
  echo "Bridge token created at /opt/milyfe/secrets/bridge-token.txt"
  echo "Add to Vercel as TITAN_BRIDGE_TOKEN:"
  cat /opt/milyfe/secrets/bridge-token.txt
fi
```

Add AFTER the agent runtime start section:
```bash
# Start Bridge API (port 8099)
echo "Starting Bridge API on port 8099..."
cd /home/milyfe/Desktop/TVS
PYTHONUNBUFFERED=1 nohup python3 -u agents/api/agent_api.py \
  > /opt/milyfe/logs/bridge-api.log 2>&1 &
echo $! > /opt/milyfe/build/bridge-api.pid
sleep 3
if curl -sf http://localhost:8099/health > /dev/null; then
  echo "✓ Bridge API healthy on port 8099"
else
  echo "✗ Bridge API failed — check /opt/milyfe/logs/bridge-api.log"
fi
```

---

## PHASE 6 — Update `scripts/onboard-client.sh`

Add support for:
- Second argument: `tier` (default: "standard")
- Third argument: JSON metadata string (optional)
- Write tier + metadata to config.json
- Initialize Chroma collection `client_{slug}_memory` via HTTP:
  ```bash
  curl -X POST http://localhost:8001/api/v2/collections \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"client_${SLUG}_memory\", \"metadata\": {\"client\": \"${SLUG}\"}}"
  ```
- Post Forge welcome message to new Mattermost channel referencing tier
- Log to `/opt/milyfe/logs/onboarding.log`
- Output JSON summary at end:
  ```json
  {"status":"success","slug":"...","channel_id":"...","ledger_path":"...","chroma_collection":"...","config_path":"..."}
  ```

---

## PHASE 7 — Requirements Files

`agents/api/requirements.txt`:
```
fastapi>=0.115.0
uvicorn[standard]>=0.32.0
python-multipart>=0.0.9
httpx>=0.27.0
pydantic>=2.9.0
requests>=2.31.0
```

`agents/memory/requirements.txt`:
```
chromadb-client>=0.5.0
httpx>=0.27.0
requests>=2.31.0
```

Ensure `.env` (root of TVS) contains:
```
BRIDGE_TOKEN=<generated on first start>
BRIDGE_API_PORT=8099
BRIDGE_API_HOST=0.0.0.0
OLLAMA_URL=http://localhost:11434
MATTERMOST_URL=http://localhost:8065
CHROMA_URL=http://localhost:8001
```

Verify `.env` is in `.gitignore`.

---

## PHASE 8 — Create `docs/BRIDGE_API_TESTING.md`

```markdown
# Bridge API Testing

## Start the system
bash /home/milyfe/Desktop/TVS/scripts/start-milyfe.sh

## Get token
TOKEN=$(cat /opt/milyfe/secrets/bridge-token.txt)

## Health
curl http://localhost:8099/health

## Auth test
curl -H "Authorization: Bearer $TOKEN" http://localhost:8099/agents/status

## Standup
curl -X POST -H "Authorization: Bearer $TOKEN" http://localhost:8099/agents/standup

## Client data
curl -H "Authorization: Bearer $TOKEN" http://localhost:8099/clients/teresa-grooming

## Ledger
curl -H "Authorization: Bearer $TOKEN" http://localhost:8099/clients/teresa-grooming/ledger/summary

## Sovereignty
curl -H "Authorization: Bearer $TOKEN" http://localhost:8099/clients/teresa-grooming/sovereignty

## Memory
curl -H "Authorization: Bearer $TOKEN" "http://localhost:8099/clients/teresa-grooming/memory/context?query=grooming+services&top_k=3"

## Serena research
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"company":"PetSmart"}' http://localhost:8099/agents/serena/research

## Dex email
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"vendor":"Teresa Supply Co","subject":"Invoice Follow-up","context":"Invoice #1042 is 15 days overdue"}' \
  http://localhost:8099/agents/dex/draft-email

## Frank report
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"client_name":"teresa-grooming"}' http://localhost:8099/agents/frank/summary
```

---

## PHASE 9 — Create/Update `PROJECT_STATE.md`

```markdown
# MiLyfe Venture Titan Studio — Project State

## Services: 15/15 healthy
- PostgreSQL (5433) ✓
- Ollama (11434) ✓
- Mattermost (8065) ✓
- ChromaDB (8001) ✓
- n8n (5679) ✓
- Langfuse (3004) ✓
- Grafana (3004) ✓
- Prometheus (9091) ✓
- Gotify (8070) ✓
- Redis (6380) ✓
- MinIO (9000) ✓
- Caddy (443/80) ✓
- Agent Runtime ✓
- Bridge API (8099) ✓ [NEW]
- MiForge (Vercel) ✓ [EXTERNAL]

## Agents: 11 seniors active
forge, calvin, serena, frank, dex, lia, ian, sam, paula, iris, leo

## Clients: 2 onboarded
- teresa-grooming
- ohio-landscaping

## Recent Changes
- Bridge API created (port 8099, 18+ endpoints)
- Memory manager added (Chroma + nomic-embed-text)
- 6 critical bugs fixed in agent_runtime.py
- Sovereignty metadata endpoint added
- MiForge integration layer operational
- Learning cycle added (Leo, Friday 5:30 PM)
```

---

## PHASE 10 — Final Verification

Run these and fix any failures:
```bash
python3 -m py_compile agents/runtime/agent_runtime.py
python3 -m py_compile agents/api/agent_api.py
python3 -m py_compile agents/memory/memory_manager.py
bash -n scripts/start-milyfe.sh
bash -n scripts/onboard-client.sh
python3 -c "from agents.runtime.agent_runtime import daily_standup, serena_research_company, frank_client_summary"
python3 -c "from agents.memory.memory_manager import MemoryManager"
```

---

## CONSTRAINTS — DO NOT VIOLATE

1. Do NOT modify existing function signatures (bridge wraps them, doesn't rewrite)
2. Do NOT delete any existing functionality
3. Do NOT change scheduled workflow times
4. Use `/usr/bin/hledger` (absolute path) for ALL hledger subprocess calls
5. Use Chroma v2 API (`/api/v2/`) — NOT v1
6. All new files must be Python 3.10+ compatible
7. All errors must be logged to `/opt/milyfe/logs/` with ISO timestamps
8. Do NOT modify `docker-compose.yml`
9. All secrets in `/opt/milyfe/secrets/` with mode 600
10. `agent_runtime.py` must still run standalone (guard main loop with `if __name__ == "__main__"`)
11. The Bridge API must handle ALL errors gracefully — never crash, always return JSON

---

## WHAT SUCCESS LOOKS LIKE

When done:
- ✅ All 6 bugs fixed, `py_compile` passes
- ✅ Bridge API runs on port 8099 with 18+ endpoints
- ✅ Every endpoint returns consistent `{"status", "data", "message"}` JSON
- ✅ Memory manager integrated into Calvin, Serena, Dex, Frank
- ✅ Leo weekly learning cycle scheduled
- ✅ Sovereignty endpoint returns real hardware data
- ✅ Start script boots bridge API alongside everything else
- ✅ Bridge token auto-generates if missing
- ✅ Onboarding script extended with tier + metadata + Chroma init
- ✅ All Python files compile cleanly
- ✅ All shell scripts pass `bash -n` syntax check
- ✅ Documentation in BRIDGE_API_TESTING.md
- ✅ PROJECT_STATE.md updated

Begin now. Work phases 1→10 in order. Report completion of each phase.
