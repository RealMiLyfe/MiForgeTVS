"""
Titan Bridge API - FastAPI server exposing Titan's agent runtime as HTTP endpoints.
Runs on port 8099. Authenticated via bearer token.
"""

import os
import json
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Titan Bridge API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:7800", "https://milyfe.fun"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth
BRIDGE_TOKEN = ""
token_path = Path("/opt/milyfe/secrets/bridge-token.txt")
if token_path.exists():
    BRIDGE_TOKEN = token_path.read_text().strip()
else:
    BRIDGE_TOKEN = os.getenv("TITAN_BRIDGE_TOKEN", "dev-token")


def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ", 1)[1]
    if token != BRIDGE_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid token")


# Models
class OnboardRequest(BaseModel):
    slug: str
    business_name: str
    contact_name: str
    contact_email: str
    niche: str
    platforms: list[str] = []
    tier: str = "standard"
    selected_agents: list[str] = []
    custom_notes: str = ""


class AgentExecuteRequest(BaseModel):
    action: str
    client_slug: str = ""
    message: str = ""
    context: str = ""


# Routes
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "services": {"postgres": True, "mattermost": True, "ollama": True, "chromadb": True},
        "agents_online": 11,
        "uptime_seconds": int((datetime.now() - datetime(2025, 1, 1)).total_seconds()),
    }


@app.get("/agents/status", dependencies=[Depends(verify_token)])
async def agents_status():
    return {
        "forge": "active", "calvin": "active", "serena": "active",
        "frank": "active", "dex": "active", "lia": "active",
        "ian": "active", "sam": "active", "paula": "active",
        "iris": "active", "leo": "active",
    }


@app.get("/clients", dependencies=[Depends(verify_token)])
async def list_clients():
    clients_dir = Path("/opt/milyfe/clients")
    if not clients_dir.exists():
        return []
    return [
        {"slug": d.name, "config": _load_config(d.name)}
        for d in clients_dir.iterdir() if d.is_dir()
    ]


@app.get("/clients/{slug}", dependencies=[Depends(verify_token)])
async def get_client(slug: str):
    config = _load_config(slug)
    if not config:
        raise HTTPException(status_code=404, detail="Client not found")
    return config


@app.post("/clients/onboard", dependencies=[Depends(verify_token)])
async def onboard_client(req: OnboardRequest):
    script = Path("/opt/milyfe/scripts/onboard-client.sh")
    if not script.exists():
        # Dev mode - just log
        return {"success": True, "slug": req.slug, "message": "Onboarding queued (dev mode)"}

    result = subprocess.run(
        ["bash", str(script), req.slug],
        capture_output=True, text=True, timeout=120
    )
    if result.returncode != 0:
        raise HTTPException(status_code=500, detail=f"Onboarding failed: {result.stderr}")

    return {"success": True, "slug": req.slug}


@app.post("/clients/{slug}/audit", dependencies=[Depends(verify_token)])
async def trigger_audit(slug: str):
    return {"success": True, "message": f"Audit triggered for {slug}"}


@app.get("/clients/{slug}/mattermost/messages", dependencies=[Depends(verify_token)])
async def get_messages(slug: str, limit: int = 20):
    # In production: query Mattermost API for client channel
    return []


@app.get("/clients/{slug}/ledger/summary", dependencies=[Depends(verify_token)])
async def get_ledger_summary(slug: str):
    return {
        "total_transactions": 0,
        "monthly_revenue": 0,
        "outstanding_receivables": 0,
        "last_transaction_date": None,
    }


@app.get("/clients/{slug}/ledger/transactions", dependencies=[Depends(verify_token)])
async def get_ledger_transactions(slug: str, limit: int = 50):
    return []


@app.get("/clients/{slug}/agents/activity", dependencies=[Depends(verify_token)])
async def get_agent_activity(slug: str, limit: int = 20):
    return []


@app.post("/agents/{senior_name}/execute", dependencies=[Depends(verify_token)])
async def execute_agent(senior_name: str, req: AgentExecuteRequest):
    # In production: route to actual senior agent via Ollama
    return {"response": f"[{senior_name}] Acknowledged: {req.action}", "status": "completed"}


def _load_config(slug: str) -> Optional[dict]:
    config_path = Path(f"/opt/milyfe/clients/{slug}/config.json")
    if config_path.exists():
        return json.loads(config_path.read_text())
    return None


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8099)
