#!/usr/bin/env python3
"""
Titan Bridge API — connects MiForge (Vercel frontend) to the live Titan agent runtime.
Runs on port 8099. Authenticated via Bearer token from /opt/milyfe/secrets/bridge-token.txt.

Only imports REAL functions from agent_runtime.py. For agent-specific tasks that don't
have dedicated functions (Serena research, Frank summaries, Dex emails, etc.), we call
ask_ollama() directly with appropriate prompts and system messages.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import subprocess
import json
import os
import logging
from pathlib import Path
from datetime import datetime

# Configure logging
log_dir = Path("/opt/milyfe/logs")
log_dir.mkdir(parents=True, exist_ok=True)
logging.basicConfig(
    filename=str(log_dir / "bridge-api.log"),
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)
logger = logging.getLogger("bridge-api")

# Import ONLY functions that actually exist in agent_runtime.py
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "runtime"))
from agent_runtime import (
    ask_ollama,
    post_to_mattermost,
    daily_standup,
    weekly_retrospective,
    daily_invoice_report,
    announce_all_agents,
    record_to_hledger,
    get_client_for_file,
    AGENTS,
    TOKENS,
    CHANNELS,
    load_secrets,
)

# ============================================================
# APP SETUP
# ============================================================

app = FastAPI(title="Titan Bridge API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:7800",
        "http://localhost:3000",
        "https://milyfe.fun",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# AUTHENTICATION
# ============================================================

def get_token() -> str | None:
    token_path = "/opt/milyfe/secrets/bridge-token.txt"
    if os.path.exists(token_path):
        return Path(token_path).read_text().strip()
    return os.environ.get("TITAN_BRIDGE_TOKEN")


def authenticate(request: Request):
    token = get_token()
    if not token:
        return  # No token configured = open access (dev mode)
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer ") and auth_header[7:] == token:
        return
    raise HTTPException(status_code=401, detail="Unauthorized")


# ============================================================
# REQUEST MODELS
# ============================================================

class SerenaResearchRequest(BaseModel):
    company: str


class FrankClientSummaryRequest(BaseModel):
    client_name: str


class DexDraftEmailRequest(BaseModel):
    vendor: str
    subject: str
    context: str


class OllamaPromptRequest(BaseModel):
    model: str = "qwen2.5:14b"
    prompt: str
    system: str = ""


# ============================================================
# HEALTH ENDPOINTS
# ============================================================

@app.get("/health")
async def health(request: Request):
    authenticate(request)
    try:
        import requests as req
        resp = req.get("http://localhost:11434/api/tags", timeout=5)
        if resp.status_code == 200:
            models = [m["name"] for m in resp.json().get("models", [])]
            return {"status": "healthy", "ollama": "connected", "models_loaded": len(models), "models": models}
        return JSONResponse({"status": "degraded", "ollama": "unhealthy"}, status_code=503)
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=503)


@app.get("/health/models")
async def health_models(request: Request):
    authenticate(request)
    expected = ["hermes3:3b", "hermes3:8b", "qwen2.5:14b", "qwen2.5:7b", "llava:13b", "nomic-embed-text"]
    try:
        import requests as req
        resp = req.get("http://localhost:11434/api/tags", timeout=5)
        loaded = [m["name"] for m in resp.json().get("models", [])] if resp.status_code == 200 else []
        status = {m: (m in loaded) for m in expected}
        return {"status": "success", "models": status, "all_loaded": all(status.values())}
    except Exception as e:
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=503)


# ============================================================
# AGENT STATUS
# ============================================================

@app.get("/agents/status")
async def agents_status(request: Request):
    authenticate(request)
    agents_list = []
    for key, agent in AGENTS.items():
        agents_list.append({
            "id": key,
            "name": agent["name"],
            "model": agent["model"],
            "channel": agent["channel"],
            "role": agent["role"],
            "emoji": agent["emoji"],
            "status": "online"
        })
    return {"status": "success", "agents": agents_list, "count": len(agents_list)}


# ============================================================
# WORKFLOW ENDPOINTS (call real runtime functions)
# ============================================================

@app.post("/agents/standup")
async def trigger_standup(request: Request):
    authenticate(request)
    try:
        daily_standup()
        return {"status": "success", "message": "Daily standup completed"}
    except Exception as e:
        logger.error(f"Standup failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.post("/agents/retrospective")
async def trigger_retrospective(request: Request):
    authenticate(request)
    try:
        weekly_retrospective()
        return {"status": "success", "message": "Weekly retrospective completed"}
    except Exception as e:
        logger.error(f"Retrospective failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.post("/agents/invoice-report")
async def trigger_invoice_report(request: Request):
    authenticate(request)
    try:
        daily_invoice_report()
        return {"status": "success", "message": "Daily invoice report completed"}
    except Exception as e:
        logger.error(f"Invoice report failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.post("/agents/announce")
async def trigger_announce(request: Request):
    authenticate(request)
    try:
        announce_all_agents()
        return {"status": "success", "message": "All agents announced"}
    except Exception as e:
        logger.error(f"Announce failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


# ============================================================
# AGENT-SPECIFIC ENDPOINTS (use ask_ollama directly)
# ============================================================

@app.post("/agents/serena/research")
async def serena_research(request: Request, body: SerenaResearchRequest):
    authenticate(request)
    try:
        prompt = f"Research the company \"{body.company}\". Provide: overview, market position, key products/services, recent news, competitive landscape, and any red flags."
        system = "You are Serena, the Research Lead for MiLyfe: Venture Titan Studio. You provide thorough, factual competitive intelligence reports. Be concise but comprehensive."
        result = ask_ollama("qwen2.5:14b", prompt, system)
        if result:
            post_to_mattermost("serena-research", f"🔍 **Research Report: {body.company}**\n\n{result}", "research-desk")
        return {"status": "success", "agent": "serena", "result": result}
    except Exception as e:
        logger.error(f"Serena research failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.post("/agents/serena/monitor")
async def serena_monitor(request: Request):
    authenticate(request)
    try:
        prompt = "Generate a brief vendor landscape monitoring report. Check for any market shifts, pricing changes, or new competitors that a small business should be aware of this week."
        system = "You are Serena, the Research Lead for MiLyfe: Venture Titan Studio. You monitor markets and vendors for actionable intelligence."
        result = ask_ollama("qwen2.5:14b", prompt, system)
        if result:
            post_to_mattermost("serena-research", f"🔍 **Vendor Monitor Update**\n\n{result}", "research-desk")
        return {"status": "success", "agent": "serena", "result": result}
    except Exception as e:
        logger.error(f"Serena monitor failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.post("/agents/frank/summary")
async def frank_summary(request: Request, body: FrankClientSummaryRequest):
    authenticate(request)
    try:
        # Read the client's ledger if it exists
        journal_path = f"/opt/milyfe/clients/{body.client_name}/ledger/{body.client_name}.journal"
        ledger = ""
        if os.path.exists(journal_path):
            result = subprocess.run(
                ["/usr/bin/hledger", "-f", journal_path, "balance", "--flat", "--no-total"],
                capture_output=True, text=True
            )
            if result.returncode == 0:
                ledger = result.stdout.strip()

        prompt = f'Client summary for "{body.client_name}". Ledger data: {ledger or "No data available"}. Provide financial position and recommendations.'
        system = "You are Frank, the Finance Lead for MiLyfe: Venture Titan Studio. You provide clear, actionable financial summaries and flag any concerns."
        result = ask_ollama("qwen2.5:14b", prompt, system)
        if result:
            post_to_mattermost("frank-finance", f"💰 **Client Summary: {body.client_name}**\n\n{result}", "finance-desk")
        return {"status": "success", "agent": "frank", "result": result}
    except Exception as e:
        logger.error(f"Frank summary failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.post("/agents/frank/all-clients")
async def frank_all_clients(request: Request):
    authenticate(request)
    try:
        clients_dir = Path("/opt/milyfe/clients")
        summaries = []
        if clients_dir.exists():
            for client_dir in clients_dir.iterdir():
                if client_dir.is_dir():
                    journal = client_dir / "ledger" / f"{client_dir.name}.journal"
                    if journal.exists():
                        result = subprocess.run(
                            ["/usr/bin/hledger", "-f", str(journal), "balance", "--flat", "--no-total"],
                            capture_output=True, text=True
                        )
                        if result.returncode == 0 and result.stdout.strip():
                            summaries.append(f"{client_dir.name}: {result.stdout.strip()}")

        ledger_text = "\n".join(summaries) if summaries else "No client ledger data found."
        prompt = f"All-clients financial overview. Current ledger balances:\n{ledger_text}\nProvide a consolidated summary with highlights and concerns."
        system = "You are Frank, the Finance Lead for MiLyfe: Venture Titan Studio. You provide consolidated financial overviews."
        result = ask_ollama("qwen2.5:14b", prompt, system)
        if result:
            post_to_mattermost("frank-finance", f"💰 **All-Clients Financial Overview**\n\n{result}", "finance-desk")
        return {"status": "success", "agent": "frank", "result": result}
    except Exception as e:
        logger.error(f"Frank all-clients failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.post("/agents/leo/errors")
async def leo_errors(request: Request):
    authenticate(request)
    try:
        # Read recent error logs
        log_files = list(Path("/opt/milyfe/logs").glob("*.log"))
        errors = []
        for lf in log_files[:5]:
            try:
                lines = lf.read_text().splitlines()
                error_lines = [l for l in lines if "ERROR" in l or "error" in l.lower()]
                errors.extend(error_lines[-10:])
            except Exception:
                pass

        error_text = "\n".join(errors[:20]) if errors else "No errors found in recent logs."
        prompt = f"Analyze these {len(errors)} errors from the system logs. Categorize them, identify root causes, and suggest fixes:\n{error_text}"
        system = "You are Leo, the Learning Lead for MiLyfe: Venture Titan Studio. You analyze error patterns and propose system improvements."
        result = ask_ollama("qwen2.5:14b", prompt, system)
        if result:
            post_to_mattermost("leo-learning", f"🧠 **Error Analysis Report**\n\n{result}", "learning-log")
        return {"status": "success", "agent": "leo", "result": result, "errors_found": len(errors)}
    except Exception as e:
        logger.error(f"Leo errors failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.post("/agents/leo/retrospective")
async def leo_retrospective(request: Request):
    authenticate(request)
    try:
        weekly_retrospective()
        return {"status": "success", "message": "Weekly retrospective triggered via Leo"}
    except Exception as e:
        logger.error(f"Leo retrospective failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.post("/agents/ian/recurring")
async def ian_recurring(request: Request):
    authenticate(request)
    try:
        prompt = "Check for recurring vendor payments that are due this week. Review the client ledgers for any patterns of monthly or weekly payments that need attention or approval."
        system = "You are Ian, the Inventory Lead for MiLyfe: Venture Titan Studio. You track recurring vendor obligations and flag items needing attention."
        result = ask_ollama("qwen2.5:7b", prompt, system)
        if result:
            post_to_mattermost("ian-inventory", f"📦 **Recurring Vendors Check**\n\n{result}", "operations-desk")
        return {"status": "success", "agent": "ian", "result": result}
    except Exception as e:
        logger.error(f"Ian recurring failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.post("/agents/sam/status")
async def sam_status(request: Request):
    authenticate(request)
    try:
        prompt = "Generate a daily support desk status report. Summarize any open tickets, response times, and customer satisfaction indicators for the day."
        system = "You are Sam, the Support Lead for MiLyfe: Venture Titan Studio. You manage tier-1 support and track customer interactions."
        result = ask_ollama("qwen2.5:7b", prompt, system)
        if result:
            post_to_mattermost("sam-support", f"🎧 **Daily Support Status**\n\n{result}", "support-desk")
        return {"status": "success", "agent": "sam", "result": result}
    except Exception as e:
        logger.error(f"Sam status failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.post("/agents/dex/draft-email")
async def dex_draft_email(request: Request, body: DexDraftEmailRequest):
    authenticate(request)
    try:
        prompt = f'Draft a professional vendor email to "{body.vendor}" regarding "{body.subject}". Context: {body.context}. Keep it professional but friendly.'
        system = "You are Dex, the Operations Lead for MiLyfe: Venture Titan Studio. You draft vendor communications that are professional, clear, and actionable. All drafts require human approval before sending."
        result = ask_ollama("qwen2.5:14b", prompt, system)
        if result:
            post_to_mattermost("dex-ops", f"⚙️ **Draft Email — {body.vendor}**\nSubject: {body.subject}\n\n{result}\n\n_⚠️ DRAFT — requires human approval before sending_", "operations-desk")
        return {"status": "success", "agent": "dex", "result": result}
    except Exception as e:
        logger.error(f"Dex draft email failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.post("/agents/dex/check-overdue")
async def dex_check_overdue(request: Request):
    authenticate(request)
    try:
        prompt = "Check for any overdue vendor payments or outstanding invoices that need follow-up. Flag any that are more than 30 days past due."
        system = "You are Dex, the Operations Lead for MiLyfe: Venture Titan Studio. You track vendor obligations and flag overdue items."
        result = ask_ollama("qwen2.5:14b", prompt, system)
        if result:
            post_to_mattermost("dex-ops", f"⚙️ **Overdue Vendors Check**\n\n{result}", "operations-desk")
        return {"status": "success", "agent": "dex", "result": result}
    except Exception as e:
        logger.error(f"Dex overdue check failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


# ============================================================
# DIRECT OLLAMA ACCESS
# ============================================================

@app.post("/ollama/generate")
async def ollama_generate(request: Request, body: OllamaPromptRequest):
    authenticate(request)
    try:
        result = ask_ollama(body.model, body.prompt, body.system)
        return {"status": "success", "model": body.model, "result": result}
    except Exception as e:
        logger.error(f"Ollama generate failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


# ============================================================
# CLIENT ENDPOINTS
# ============================================================

@app.post("/clients/onboard")
async def client_onboard(request: Request):
    authenticate(request)
    try:
        body = await request.json()
        slug = body.get("slug")
        if not slug:
            raise HTTPException(status_code=400, detail="slug is required")
        script = "/home/milyfe/Desktop/TVS/scripts/onboard-client.sh"
        if os.path.exists(script):
            subprocess.run(["/bin/bash", script, slug], check=True)
        else:
            # Create client directory structure manually
            client_dir = Path(f"/opt/milyfe/clients/{slug}")
            (client_dir / "ledger").mkdir(parents=True, exist_ok=True)
            (client_dir / "config.json").write_text(json.dumps({"slug": slug, "created": datetime.now().isoformat()}, indent=2))
        return {"status": "success", "message": f"Client '{slug}' onboarded"}
    except Exception as e:
        logger.error(f"Client onboard failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.get("/clients")
async def list_clients(request: Request):
    authenticate(request)
    try:
        clients_dir = Path("/opt/milyfe/clients")
        if not clients_dir.exists():
            return {"status": "success", "clients": []}
        clients = []
        for d in clients_dir.iterdir():
            if d.is_dir():
                config_path = d / "config.json"
                if config_path.exists():
                    config = json.loads(config_path.read_text())
                    clients.append(config)
                else:
                    clients.append({"slug": d.name})
        return {"status": "success", "clients": clients}
    except Exception as e:
        logger.error(f"List clients failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.get("/clients/{slug}")
async def get_client(request: Request, slug: str):
    authenticate(request)
    try:
        config_path = Path(f"/opt/milyfe/clients/{slug}/config.json")
        if not config_path.exists():
            raise HTTPException(status_code=404, detail=f"Client '{slug}' not found")
        config = json.loads(config_path.read_text())
        return {"status": "success", "client": config}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get client failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.get("/clients/{slug}/ledger/summary")
async def client_ledger_summary(request: Request, slug: str):
    authenticate(request)
    try:
        journal_path = f"/opt/milyfe/clients/{slug}/ledger/{slug}.journal"
        if not os.path.exists(journal_path):
            raise HTTPException(status_code=404, detail=f"No ledger found for '{slug}'")
        result = subprocess.run(
            ["/usr/bin/hledger", "-f", journal_path, "balance", "--flat", "--no-total"],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            raise Exception(f"hledger error: {result.stderr}")
        return {"status": "success", "slug": slug, "balance": result.stdout.strip()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ledger summary failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


@app.get("/clients/{slug}/ledger/transactions")
async def client_ledger_transactions(request: Request, slug: str):
    authenticate(request)
    try:
        journal_path = f"/opt/milyfe/clients/{slug}/ledger/{slug}.journal"
        if not os.path.exists(journal_path):
            raise HTTPException(status_code=404, detail=f"No ledger found for '{slug}'")
        result = subprocess.run(
            ["/usr/bin/hledger", "-f", journal_path, "register"],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            raise Exception(f"hledger error: {result.stderr}")
        return {"status": "success", "slug": slug, "transactions": result.stdout.strip()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ledger transactions failed: {e}")
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    import uvicorn
    print("=" * 50)
    print("  Titan Bridge API — Starting on port 8099")
    print(f"  {datetime.now()}")
    print("=" * 50)
    uvicorn.run(app, host="0.0.0.0", port=8099)
