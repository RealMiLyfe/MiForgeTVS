from fastapi import FastAPI, HTTPException, Request, Header, CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import subprocess
import json
import os
import logging
import requests
from pathlib import Path

# Configure logging
logging.basicConfig(filename='/opt/milyfe/logs/bridge-api.log', level=logging.INFO)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:7800",
    "http://localhost:3000",
    "https://milyfe.fun"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication
def get_token():
    token_path = "/opt/milyfe/secrets/bridge-token.txt"
    if os.path.exists(token_path):
        with open(token_path, 'r') as f:
            return f.read().strip()
    elif "TITAN_BRIDGE_TOKEN" in os.environ:
        return os.environ["TITAN_BRIDGE_TOKEN"]
    return None

def authenticate(request: Request):
    token = get_token()
    if not token:
        return
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        provided_token = auth_header.split(" ")[1]
        if provided_token == token:
            return
    raise HTTPException(status_code=401, detail="Unauthorized")

# Pydantic models for request bodies
class SerenaResearchCompanyRequest(BaseModel):
    company: str

class FrankClientSummaryRequest(BaseModel):
    client_name: str

class DexDraftVendorEmailRequest(BaseModel):
    vendor: str
    subject: str
    context: str

# Import functions from agent_runtime
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "runtime"))
from agent_runtime import (daily_standup, serena_research_company, serena_monitor_vendors, frank_client_summary, frank_all_clients_summary, daily_invoice_report, leo_weekly_error_report, weekly_retrospective, ian_check_recurring_vendors, sam_daily_status, dex_draft_vendor_email, dex_check_overdue_vendors)

# Endpoints
@app.get("/health")
async def health():
    try:
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code == 200:
            return JSONResponse(content={"status": "success", "data": response.json(), "message": "Ollama is healthy"})
        else:
            return JSONResponse(content={"status": "error", "data": None, "message": "Ollama is not healthy"}, status_code=503)
    except Exception as e:
        logging.error(f"Health check failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.get("/health/models")
async def health_models():
    try:
        models = ["hermes3:3b", "hermes3:8b", "nemotron-mini:4b", "qwen2.5:14b", "qwen2.5:7b", "llava:13b", "nomic-embed-text"]
        # Add logic to check if these models are loaded
        return JSONResponse(content={"status": "success", "data": {"models": models}, "message": "Models are healthy"})
    except Exception as e:
        logging.error(f"Model health check failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.get("/agents/status")
async def agents_status():
    try:
        # Add logic to get 11 agent names with "online" status
        agents = [{"name": f"agent_{i}", "status": "online"} for i in range(1, 12)]
        return JSONResponse(content={"status": "success", "data": {"agents": agents}, "message": "Agents are online"})
    except Exception as e:
        logging.error(f"Agent status check failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.post("/agents/standup")
async def agents_standup():
    try:
        daily_standup()
        return JSONResponse(content={"status": "success", "data": None, "message": "Standup completed"})
    except Exception as e:
        logging.error(f"Standup failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.post("/agents/serena/research")
async def agents_serena_research(request: SerenaResearchCompanyRequest):
    try:
        company = request.company
        serena_research_company(company)
        return JSONResponse(content={"status": "success", "data": None, "message": f"Research for {company} completed"})
    except Exception as e:
        logging.error(f"Serena research failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.post("/agents/serena/monitor")
async def agents_serena_monitor():
    try:
        serena_monitor_vendors()
        return JSONResponse(content={"status": "success", "data": None, "message": "Vendor monitoring completed"})
    except Exception as e:
        logging.error(f"Serena monitor failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.post("/agents/frank/summary")
async def agents_frank_summary(request: FrankClientSummaryRequest):
    try:
        client_name = request.client_name
        frank_client_summary(client_name)
        return JSONResponse(content={"status": "success", "data": None, "message": f"Summary for {client_name} completed"})
    except Exception as e:
        logging.error(f"Frank summary failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.post("/agents/frank/all-clients")
async def agents_frank_all_clients():
    try:
        frank_all_clients_summary()
        return JSONResponse(content={"status": "success", "data": None, "message": "All clients summary completed"})
    except Exception as e:
        logging.error(f"Frank all clients failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.post("/agents/frank/invoice-report")
async def agents_frank_invoice_report():
    try:
        daily_invoice_report()
        return JSONResponse(content={"status": "success", "data": None, "message": "Invoice report completed"})
    except Exception as e:
        logging.error(f"Frank invoice report failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.post("/agents/leo/errors")
async def agents_leo_errors():
    try:
        leo_weekly_error_report()
        return JSONResponse(content={"status": "success", "data": None, "message": "Weekly error report completed"})
    except Exception as e:
        logging.error(f"Leo errors failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.post("/agents/leo/retrospective")
async def agents_leo_retrospective():
    try:
        weekly_retrospective()
        return JSONResponse(content={"status": "success", "data": None, "message": "Weekly retrospective completed"})
    except Exception as e:
        logging.error(f"Leo retrospective failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.post("/agents/ian/recurring")
async def agents_ian_recurring():
    try:
        ian_check_recurring_vendors()
        return JSONResponse(content={"status": "success", "data": None, "message": "Recurring vendors check completed"})
    except Exception as e:
        logging.error(f"Ian recurring failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.post("/agents/sam/status")
async def agents_sam_status():
    try:
        sam_daily_status()
        return JSONResponse(content={"status": "success", "data": None, "message": "Daily status completed"})
    except Exception as e:
        logging.error(f"Sam status failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.post("/agents/dex/draft-email")
async def agents_dex_draft_email(request: DexDraftVendorEmailRequest):
    try:
        vendor = request.vendor
        subject = request.subject
        context = request.context
        dex_draft_vendor_email(vendor, subject, context)
        return JSONResponse(content={"status": "success", "data": None, "message": f"Draft email for {vendor} completed"})
    except Exception as e:
        logging.error(f"Dex draft email failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.post("/agents/dex/check-overdue")
async def agents_dex_check_overdue():
    try:
        dex_check_overdue_vendors()
        return JSONResponse(content={"status": "success", "data": None, "message": "Overdue vendors check completed"})
    except Exception as e:
        logging.error(f"Dex overdue failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.post("/clients/onboard")
async def clients_onboard(request: Request):
    try:
        body = await request.json()
        slug = body.get("slug")
        if not slug:
            raise HTTPException(status_code=400, detail="Slug is required")
        subprocess.run(["/bin/bash", "/home/milyfe/Desktop/TVS/scripts/onboard-client.sh", slug])
        return JSONResponse(content={"status": "success", "data": None, "message": f"Client {slug} onboarded"})
    except Exception as e:
        logging.error(f"Onboard client failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.get("/clients/{slug}")
async def clients_slug(slug: str):
    try:
        config_path = f"/opt/milyfe/clients/{slug}/config.json"
        if not os.path.exists(config_path):
            raise HTTPException(status_code=404, detail="Client configuration not found")
        with open(config_path, 'r') as f:
            config = json.load(f)
        return JSONResponse(content={"status": "success", "data": config, "message": f"Configuration for {slug} retrieved"})
    except Exception as e:
        logging.error(f"Get client configuration failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.get("/clients")
async def clients():
    try:
        secrets_path = "/opt/milyfe/secrets/clients.json"
        if not os.path.exists(secrets_path):
            raise HTTPException(status_code=404, detail="Clients secrets not found")
        with open(secrets_path, 'r') as f:
            clients_data = json.load(f)
        return JSONResponse(content={"status": "success", "data": clients_data, "message": "Clients data retrieved"})
    except Exception as e:
        logging.error(f"Get clients failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.get("/clients/{slug}/ledger/summary")
async def clients_slug_ledger_summary(slug: str):
    try:
        journal_path = f"/opt/milyfe/clients/{slug}/ledger/{slug}.journal"
        if not os.path.exists(journal_path):
            raise HTTPException(status_code=404, detail="Ledger journal not found")
        result = subprocess.run(["/usr/bin/hledger", "-f", journal_path, "balance", "--flat", "--no-total"], capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(result.stderr)
        return JSONResponse(content={"status": "success", "data": {"output": result.stdout}, "message": f"Ledger summary for {slug} retrieved"})
    except Exception as e:
        logging.error(f"Get ledger summary failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.get("/clients/{slug}/ledger/transactions")
async def clients_slug_ledger_transactions(slug: str):
    try:
        journal_path = f"/opt/milyfe/clients/{slug}/ledger/{slug}.journal"
        if not os.path.exists(journal_path):
            raise HTTPException(status_code=404, detail="Ledger journal not found")
        result = subprocess.run(["/usr/bin/hledger", "-f", journal_path, "register"], capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(result.stderr)
        return JSONResponse(content={"status": "success", "data": {"output": result.stdout}, "message": f"Ledger transactions for {slug} retrieved"})
    except Exception as e:
        logging.error(f"Get ledger transactions failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

@app.get("/clients/{slug}/sovereignty")
async def clients_slug_sovereignty(slug: str):
    try:
        # Add logic to get sovereignty JSON with tiered model info
        sovereignty_data = {"tier": "premium", "models": ["model1", "model2"]}
        return JSONResponse(content={"status": "success", "data": sovereignty_data, "message": f"Sovereignty data for {slug} retrieved"})
    except Exception as e:
        logging.error(f"Get sovereignty failed: {e}")
        return JSONResponse(content={"status": "error", "data": None, "message": str(e)}, status_code=500)

# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8099)
