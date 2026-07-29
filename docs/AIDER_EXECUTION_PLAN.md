# AIDER EXECUTION PLAN — MiLyfe Titan Final Build-Out

Run these phases IN ORDER on the Titan machine at `/home/milyfe/Desktop/TVS`.
Clear Aider's chat context between each phase. Commit after all phases complete.

## Prerequisites Check

```bash
cd /home/milyfe/Desktop/TVS
ollama list | grep -E "hermes3|nemotron|qwen2.5|llava|nomic"
python3 --version  # must be 3.10+
pip show fastapi uvicorn requests 2>/dev/null || pip install fastapi uvicorn requests
ls /opt/milyfe/secrets/bot-tokens.json  # must exist
ls /opt/milyfe/secrets/channel-ids.json  # must exist
```

---

## Phase A — Bug Fixes in Agent Runtime

### Launch Command
```bash
cd /home/milyfe/Desktop/TVS && aider \
  --model ollama/qwen2.5-coder:14b \
  --yes-always --no-auto-commits \
  agents/runtime/agent_runtime.py
```

### Prompt to Paste
```
Fix these 6 bugs:

1. Replace ALL subprocess calls ["hledger" or ["", "-f" with ["/usr/bin/hledger", "-f". Search entire file.

2. In serena_monitor_vendors(), change vendor regex from r"expenses:vendors\s+(\w+)" to r"(\d{4}[-/]\d{2}[-/]\d{2})\s+(.+)\n\s+expenses:vendors" with re.MULTILINE. Use group(2) as vendor name.

3. In dex_check_overdue_vendors(), wrap every match.group() in "if match:" guard. Return empty list if no matches.

4. In ian_check_recurring_vendors(), accumulate ALL file contents into a list before analysis (currently only last iteration analyzed). Keep per-client attribution.

5. In ALL Frank functions, ensure subprocess uses ["/usr/bin/hledger", "-f", ...] and captures stderr.

6. Add try/except around EVERY subprocess.run() and EVERY requests.post/get call. Log with:
import logging
logging.basicConfig(filename='/opt/milyfe/logs/agent-runtime.log', level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')

Also add this model routing dict near the top (after SENIOR_AGENTS):

AGENT_MODEL_ROUTING = {
    "concierge_greeting": "hermes3:3b",
    "agent_ack": "hermes3:3b",
    "standup_heartbeat": "hermes3:3b",
    "forge_concierge": "hermes3:8b",
    "calvin_public_chat": "hermes3:8b",
    "serena_public_chat": "hermes3:8b",
    "dex_public_chat": "hermes3:8b",
    "dex_email_drafting": "hermes3:8b",
    "frank_public_chat": "hermes3:8b",
    "leo_public_chat": "hermes3:8b",
    "langgraph_decision": "nemotron-mini:4b",
    "workflow_routing": "nemotron-mini:4b",
    "calvin_invoice_processing": "qwen2.5:14b",
    "serena_research": "qwen2.5:14b",
    "frank_analysis": "qwen2.5:14b",
    "leo_retrospective": "qwen2.5:14b",
    "lia_contract_review": "qwen2.5:14b",
    "sam_triage": "qwen2.5:7b",
    "ian_triage": "qwen2.5:7b",
    "iris_ocr": "llava:13b",
    "embeddings": "nomic-embed-text"
}

def get_model_for_task(task_key, fallback="hermes3:8b"):
    return AGENT_MODEL_ROUTING.get(task_key, fallback)
```

### Validation
```bash
python3 -m py_compile agents/runtime/agent_runtime.py
grep "/usr/bin/hledger" agents/runtime/agent_runtime.py | wc -l  # should be >0
grep '"".*-f' agents/runtime/agent_runtime.py | wc -l  # should be 0
```

### If This Fails
Check for syntax errors in the logging import or the AGENT_MODEL_ROUTING dict. Fix manually if needed.

---

## Phase B — Bridge API

### Launch Command
```bash
cd /home/milyfe/Desktop/TVS && aider \
  --model ollama/qwen2.5-coder:14b \
  --yes-always --no-auto-commits \
  agents/api/agent_api.py
```

### Prompt to Paste
```
Create a complete FastAPI service. Port 8099, host 0.0.0.0.

Auth: Read token from /opt/milyfe/secrets/bridge-token.txt (or env TITAN_BRIDGE_TOKEN). Skip auth if neither exists. Check "Authorization: Bearer <token>" header. Return 401 if wrong.

CORS: ["http://localhost:7800", "http://localhost:3000", "https://milyfe.fun"]

Import functions:
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "runtime"))
from agent_runtime import (daily_standup, serena_research_company, serena_monitor_vendors, frank_client_summary, frank_all_clients_summary, daily_invoice_report, leo_weekly_error_report, weekly_retrospective, ian_check_recurring_vendors, sam_daily_status, dex_draft_vendor_email, dex_check_overdue_vendors)

Every endpoint returns: {"status": "success"|"error", "data": ..., "message": "..."}

Endpoints:
GET /health — check Ollama at localhost:11434/api/tags
GET /health/models — check these models loaded: hermes3:3b, hermes3:8b, nemotron-mini:4b, qwen2.5:14b, qwen2.5:7b, llava:13b, nomic-embed-text
GET /agents/status — return 11 agent names with "online" status
POST /agents/standup — call daily_standup()
POST /agents/serena/research — body {"company":str} — call serena_research_company(company)
POST /agents/serena/monitor — call serena_monitor_vendors()
POST /agents/frank/summary — body {"client_name":str} — call frank_client_summary(client_name)
POST /agents/frank/all-clients — call frank_all_clients_summary()
POST /agents/frank/invoice-report — call daily_invoice_report()
POST /agents/leo/errors — call leo_weekly_error_report()
POST /agents/leo/retrospective — call weekly_retrospective()
POST /agents/ian/recurring — call ian_check_recurring_vendors()
POST /agents/sam/status — call sam_daily_status()
POST /agents/dex/draft-email — body {"vendor":str,"subject":str,"context":str} — call dex_draft_vendor_email(vendor,subject,context)
POST /agents/dex/check-overdue — call dex_check_overdue_vendors()
POST /clients/onboard — body {"slug":str} — subprocess ["/bin/bash","/home/milyfe/Desktop/TVS/scripts/onboard-client.sh",slug]
GET /clients/{slug} — read /opt/milyfe/clients/{slug}/config.json
GET /clients — read /opt/milyfe/secrets/clients.json
GET /clients/{slug}/ledger/summary — subprocess ["/usr/bin/hledger","-f",f"/opt/milyfe/clients/{slug}/ledger/{slug}.journal","balance","--flat","--no-total"]
GET /clients/{slug}/ledger/transactions — subprocess ["/usr/bin/hledger","-f",journal,"register"]
GET /clients/{slug}/sovereignty — return sovereignty JSON with tiered model info

Use Pydantic BaseModel for request bodies. Wrap all in try/except. Log to /opt/milyfe/logs/bridge-api.log.

End: if __name__ == "__main__": import uvicorn; uvicorn.run(app, host="0.0.0.0", port=8099)
```

### Validation
```bash
python3 -m py_compile agents/api/agent_api.py
python3 -c "from agents.api.agent_api import app; print('OK')"
```

---

## Phase C — Memory Manager

### Launch Command
```bash
cd /home/milyfe/Desktop/TVS && aider \
  --model ollama/qwen2.5-coder:14b \
  --yes-always --no-auto-commits \
  agents/memory/memory_manager.py
```

### Prompt to Paste
```
Create a MemoryManager class using Chroma at http://localhost:8001 (v2 API) and Ollama embeddings at http://localhost:11434/api/embeddings with model "nomic-embed-text".

import requests, uuid, json
from datetime import datetime

class MemoryManager:
    def __init__(self):
        self.chroma_url = "http://localhost:8001"
        self.ollama_url = "http://localhost:11434"
        self.embed_model = "nomic-embed-text"

    def _get_embedding(self, text: str) -> list:
        # POST to self.ollama_url/api/embeddings with {"model": self.embed_model, "prompt": text}
        # Return the "embedding" field from response

    def _ensure_collection(self, name: str):
        # Try GET {chroma_url}/api/v2/tenants/default_tenant/databases/default_database/collections/{name}
        # If 404, POST to create it

    def store_client_memory(self, client_slug, agent_name, action_type, content, metadata=None):
        # Collection: client_{client_slug}_memory
        # Generate ID with uuid.uuid4(), get embedding, POST document

    def query_client_memory(self, client_slug, query_text, top_k=5) -> list:
        # Get embedding for query, POST query to collection, return results

    def store_platform_pattern(self, pattern_type, situation, approach, outcome, metadata=None):
        # Collection: platform_patterns

    def query_platform_patterns(self, situation, top_k=3) -> list:
        # Query platform_patterns collection

    def summarize_client_context(self, client_slug, top_k=20) -> str:
        # Get recent memories, concatenate, return as context string

Wrap all methods in try/except. Print errors with [ERROR] prefix.
```

### Validation
```bash
python3 -m py_compile agents/memory/memory_manager.py
python3 -c "from agents.memory.memory_manager import MemoryManager; print('OK')"
```

---

## Phase D — Start Script + Docs

### Launch Command
```bash
cd /home/milyfe/Desktop/TVS && aider \
  --model ollama/qwen2.5-coder:14b \
  --yes-always --no-auto-commits \
  scripts/start-milyfe.sh docs/BRIDGE_API_TESTING.md
```

### Prompt to Paste
```
In scripts/start-milyfe.sh, ADD these sections (do not delete existing content):

Near the top, after Docker startup:
# Generate bridge token if missing
if [ ! -f /opt/milyfe/secrets/bridge-token.txt ]; then
  openssl rand -hex 32 > /opt/milyfe/secrets/bridge-token.txt
  chmod 600 /opt/milyfe/secrets/bridge-token.txt
  echo "Bridge token generated. Add to Vercel as TITAN_BRIDGE_TOKEN:"
  cat /opt/milyfe/secrets/bridge-token.txt
fi

After agent runtime start:
# Start Bridge API (port 8099)
echo "Starting Bridge API on port 8099..."
cd /home/milyfe/Desktop/TVS
PYTHONUNBUFFERED=1 nohup python3 -u agents/api/agent_api.py > /opt/milyfe/logs/bridge-api.log 2>&1 &
echo $! > /opt/milyfe/build/bridge-api.pid
sleep 3
curl -sf http://localhost:8099/health > /dev/null && echo "✓ Bridge API healthy on 8099" || echo "✗ Bridge API failed"

Create docs/BRIDGE_API_TESTING.md with these test commands:
TOKEN=$(cat /opt/milyfe/secrets/bridge-token.txt)
curl http://localhost:8099/health
curl http://localhost:8099/health/models
curl -H "Authorization: Bearer $TOKEN" http://localhost:8099/agents/status
curl -X POST -H "Authorization: Bearer $TOKEN" http://localhost:8099/agents/standup
curl -H "Authorization: Bearer $TOKEN" http://localhost:8099/clients/teresa-grooming
curl -H "Authorization: Bearer $TOKEN" http://localhost:8099/clients/teresa-grooming/ledger/summary
curl -H "Authorization: Bearer $TOKEN" http://localhost:8099/clients/teresa-grooming/sovereignty
```

### Validation
```bash
bash -n scripts/start-milyfe.sh
cat docs/BRIDGE_API_TESTING.md
```

---

## Final Verification

```bash
cd /home/milyfe/Desktop/TVS
python3 -m py_compile agents/runtime/agent_runtime.py
python3 -m py_compile agents/api/agent_api.py
python3 -m py_compile agents/memory/memory_manager.py
bash -n scripts/start-milyfe.sh
echo "All checks passed"
```

## Commit and Push

```bash
git add -A
git commit -m "feat: bridge API, memory manager, tiered voice routing, bug fixes"
git push origin master
```

## Post-Aider Deployment

```bash
# 1. Install deps
pip install fastapi uvicorn requests

# 2. Restart full stack
pkill -f agent_runtime.py 2>/dev/null
pkill -f agent_api.py 2>/dev/null
bash scripts/start-milyfe.sh

# 3. Test bridge
sleep 5
curl http://localhost:8099/health
curl http://localhost:8099/health/models

# 4. Get bridge token for Vercel
echo "Add this to Vercel env as TITAN_BRIDGE_TOKEN:"
cat /opt/milyfe/secrets/bridge-token.txt

# 5. Next: deploy Cloudflare Tunnel, then run Derek Adams Cold Audit
```
