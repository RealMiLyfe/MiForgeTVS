"""
Venture Titan Studio — Bridge API
FastAPI service on port 8099 exposing the agent runtime as HTTP endpoints.
Authenticated via bearer token from /opt/milyfe/secrets/bridge-token.txt.
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add runtime to path so we can import agent functions
sys.path.insert(0, str(Path(__file__).parent.parent / "runtime"))

from agent_runtime import (
    daily_standup,
    serena_research_company,
    serena_monitor_vendors,
    frank_client_summary,
    frank_all_clients_summary,
    daily_invoice_report,
    leo_weekly_error_report,
    weekly_retrospective,
    ian_check_recurring_vendors,
    sam_daily_status,
    dex_draft_vendor_email,
    dex_check_overdue_vendors,
    SENIOR_AGENTS,
)

# ─── App Setup ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="Titan Bridge API",
    description="Exposes Venture Titan Studio agent runtime as HTTP endpoints",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:7800",
        "http://localhost:3000",
        "https://milyfe.fun",
        "https://www.milyfe.fun",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Auth ────────────────────────────────────────────────────────────────────

BRIDGE_TOKEN = ""
_token_path = Path("/opt/milyfe/secrets/bridge-token.txt")
if _token_path.exists():
    BRIDGE_TOKEN = _token_path.read_text().strip()
else:
    BRIDGE_TOKEN = os.getenv("TITAN_BRIDGE_TOKEN", "")

if not BRIDGE_TOKEN:
    print("[WARNING] No bridge token configured. API is unprotected.")


def verify_token(authorization: Optional[str] = Header(None)):
    """Verify bearer token on every protected request."""
    if not BRIDGE_TOKEN:
        return  # No token configured = dev mode, allow all
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Bearer token required")
    token = authorization.split(" ", 1)[1]
    if token != BRIDGE_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid token")


# ─── Request Models ──────────────────────────────────────────────────────────

class ResearchRequest(BaseModel):
    company: str


class DraftEmailRequest(BaseModel):
    vendor: str
    subject: str
    context: str


class ClientSummaryRequest(BaseModel):
    client_name: str


class OnboardRequest(BaseModel):
    slug: str


# ─── Health & Status ─────────────────────────────────────────────────────────

@app.get("/health")
async def health_check():
    """System health check. No auth required."""
    ollama_ok = _check_ollama()
    return {
        "status": "healthy" if ollama_ok else "degraded",
        "ollama": "connected" if ollama_ok else "unreachable",
        "agents": len(SENIOR_AGENTS),
        "clients_dir": str(Path("/opt/milyfe/clients")),
        "clients_dir_exists": Path("/opt/milyfe/clients").exists(),
    }


@app.get("/agents/status", dependencies=[Depends(verify_token)])
async def agents_status():
    """Returns status of all 11 senior agents."""
    ollama_ok = _check_ollama()
    statuses = {}
    for agent in SENIOR_AGENTS:
        statuses[agent] = {
            "status": "online" if ollama_ok else "degraded",
            "ollama_connected": ollama_ok,
            "last_heartbeat": "now",
        }
    return {"agents": statuses, "total": len(SENIOR_AGENTS)}


# ─── Agent Endpoints ─────────────────────────────────────────────────────────

@app.post("/agents/standup", dependencies=[Depends(verify_token)])
async def endpoint_standup():
    """Forge orchestrates daily standup."""
    result = daily_standup()
    return result


@app.post("/agents/serena/research", dependencies=[Depends(verify_token)])
async def endpoint_serena_research(req: ResearchRequest):
    """Serena researches a company."""
    result = serena_research_company(req.company)
    return result


@app.post("/agents/serena/monitor", dependencies=[Depends(verify_token)])
async def endpoint_serena_monitor():
    """Serena monitors all vendors."""
    result = serena_monitor_vendors()
    return result


@app.post("/agents/frank/summary", dependencies=[Depends(verify_token)])
async def endpoint_frank_summary(req: ClientSummaryRequest):
    """Frank generates client summary."""
    result = frank_client_summary(req.client_name)
    return result


@app.post("/agents/frank/all-clients", dependencies=[Depends(verify_token)])
async def endpoint_frank_all_clients():
    """Frank generates portfolio-wide summary."""
    result = frank_all_clients_summary()
    return result


@app.post("/agents/frank/invoice-report", dependencies=[Depends(verify_token)])
async def endpoint_frank_invoice_report():
    """Frank produces daily invoice report."""
    result = daily_invoice_report()
    return result


@app.post("/agents/leo/errors", dependencies=[Depends(verify_token)])
async def endpoint_leo_errors():
    """Leo reviews weekly error report."""
    result = leo_weekly_error_report()
    return result


@app.post("/agents/leo/retrospective", dependencies=[Depends(verify_token)])
async def endpoint_leo_retrospective():
    """Leo conducts weekly retrospective."""
    result = weekly_retrospective()
    return result


@app.post("/agents/ian/recurring", dependencies=[Depends(verify_token)])
async def endpoint_ian_recurring():
    """Ian checks recurring vendor charges."""
    result = ian_check_recurring_vendors()
    return result


@app.post("/agents/sam/status", dependencies=[Depends(verify_token)])
async def endpoint_sam_status():
    """Sam reports daily support status."""
    result = sam_daily_status()
    return result


@app.post("/agents/dex/draft-email", dependencies=[Depends(verify_token)])
async def endpoint_dex_draft_email(req: DraftEmailRequest):
    """Dex drafts a vendor email."""
    result = dex_draft_vendor_email(req.vendor, req.subject, req.context)
    return result


@app.post("/agents/dex/check-overdue", dependencies=[Depends(verify_token)])
async def endpoint_dex_check_overdue():
    """Dex checks for overdue vendor payments."""
    result = dex_check_overdue_vendors()
    return result


# ─── Client Management ───────────────────────────────────────────────────────

@app.post("/clients/onboard", dependencies=[Depends(verify_token)])
async def onboard_client(req: OnboardRequest):
    """Runs onboard-client.sh for the given slug."""
    script = Path("/opt/milyfe/scripts/onboard-client.sh")
    if not script.exists():
        raise HTTPException(status_code=500, detail="Onboard script not found at /opt/milyfe/scripts/onboard-client.sh")

    try:
        result = subprocess.run(
            ["bash", str(script), req.slug],
            capture_output=True, text=True, timeout=120
        )
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Onboard failed: {result.stderr}")
        return {"success": True, "slug": req.slug, "output": result.stdout}
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Onboard script timed out (120s)")


@app.get("/clients/{slug}", dependencies=[Depends(verify_token)])
async def get_client(slug: str):
    """Reads client config.json."""
    config_path = Path(f"/opt/milyfe/clients/{slug}/config.json")
    if not config_path.exists():
        raise HTTPException(status_code=404, detail=f"Client '{slug}' not found")
    try:
        config = json.loads(config_path.read_text())
        return config
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid config.json")


@app.get("/clients/{slug}/mattermost/messages", dependencies=[Depends(verify_token)])
async def get_client_messages(slug: str, limit: int = 50):
    """Reads last N messages from the client's Mattermost channel."""
    import requests as req_lib

    # Load bot token
    token_file = Path("/opt/milyfe/secrets/bot-tokens.json")
    if not token_file.exists():
        raise HTTPException(status_code=500, detail="Bot tokens file not found")

    tokens = json.loads(token_file.read_text())
    bot_token = tokens.get("mattermost_bot_token", "")
    if not bot_token:
        raise HTTPException(status_code=500, detail="Mattermost bot token not configured")

    mm_url = os.getenv("MATTERMOST_URL", "http://localhost:8065")

    # Find the channel for this client (named: client-{slug})
    channel_name = f"client-{slug}"
    team_name = tokens.get("mattermost_team", "milyfe")

    try:
        # Get channel by name
        headers = {"Authorization": f"Bearer {bot_token}"}
        ch_resp = req_lib.get(
            f"{mm_url}/api/v4/teams/name/{team_name}/channels/name/{channel_name}",
            headers=headers, timeout=10
        )
        if ch_resp.status_code != 200:
            return {"messages": [], "error": f"Channel '{channel_name}' not found"}

        channel_id = ch_resp.json()["id"]

        # Get posts
        posts_resp = req_lib.get(
            f"{mm_url}/api/v4/channels/{channel_id}/posts?per_page={limit}",
            headers=headers, timeout=10
        )
        if posts_resp.status_code != 200:
            return {"messages": [], "error": "Failed to fetch posts"}

        posts_data = posts_resp.json()
        order = posts_data.get("order", [])
        posts = posts_data.get("posts", {})

        messages = []
        for post_id in order:
            post = posts.get(post_id, {})
            messages.append({
                "id": post.get("id"),
                "message": post.get("message", ""),
                "user_id": post.get("user_id", ""),
                "username": post.get("username", post.get("user_id", "unknown")),
                "create_at": post.get("create_at", 0),
            })

        return {"messages": messages, "count": len(messages), "channel": channel_name}

    except req_lib.exceptions.ConnectionError:
        return {"messages": [], "error": "Mattermost unreachable"}
    except Exception as e:
        return {"messages": [], "error": str(e)}


@app.get("/clients/{slug}/ledger/summary", dependencies=[Depends(verify_token)])
async def get_ledger_summary(slug: str):
    """Runs hledger balance on the client's journal."""
    journal = Path(f"/opt/milyfe/clients/{slug}/ledger/main.journal")
    if not journal.exists():
        return {"balances": "", "error": f"No ledger found for '{slug}'"}

    try:
        result = subprocess.run(
            ["hledger", "-f", str(journal), "balance", "--flat", "--no-total"],
            capture_output=True, text=True, timeout=10
        )
        return {"balances": result.stdout.strip(), "error": result.stderr.strip() or None}
    except FileNotFoundError:
        return {"balances": "", "error": "hledger not installed"}
    except subprocess.TimeoutExpired:
        return {"balances": "", "error": "hledger timed out"}


@app.get("/clients/{slug}/ledger/transactions", dependencies=[Depends(verify_token)])
async def get_ledger_transactions(slug: str, limit: int = 50):
    """Runs hledger register on the client's journal."""
    journal = Path(f"/opt/milyfe/clients/{slug}/ledger/main.journal")
    if not journal.exists():
        return {"transactions": "", "error": f"No ledger found for '{slug}'"}

    try:
        result = subprocess.run(
            ["hledger", "-f", str(journal), "register", "--output-format=json"],
            capture_output=True, text=True, timeout=10
        )
        # Try to parse JSON output
        try:
            txns = json.loads(result.stdout)
            return {"transactions": txns[-limit:], "count": len(txns)}
        except json.JSONDecodeError:
            # Fall back to plain text
            return {"transactions": result.stdout.strip(), "format": "text"}
    except FileNotFoundError:
        return {"transactions": "", "error": "hledger not installed"}
    except subprocess.TimeoutExpired:
        return {"transactions": "", "error": "hledger timed out"}


# ─── Utilities ───────────────────────────────────────────────────────────────

def _check_ollama() -> bool:
    """Check if Ollama is reachable."""
    import requests as req_lib
    try:
        resp = req_lib.get(f"{os.getenv('OLLAMA_URL', 'http://localhost:11434')}/api/tags", timeout=3)
        return resp.status_code == 200
    except Exception:
        return False


# ─── Entry Point ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("BRIDGE_API_PORT", "8099"))
    print(f"[Bridge API] Starting on port {port}")
    print(f"[Bridge API] Token configured: {'YES' if BRIDGE_TOKEN else 'NO (dev mode)'}")
    print(f"[Bridge API] Clients dir: /opt/milyfe/clients")

    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
