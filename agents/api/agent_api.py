"""Titan Bridge API — Port 8099. Wraps the REAL agent_runtime.py."""
import sys, os, json, subprocess, logging, re
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import requests as http_req

logging.basicConfig(filename='/opt/milyfe/logs/bridge-api.log', level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')

sys.path.insert(0, str(Path(__file__).parent.parent / "runtime"))
from agent_runtime import daily_standup, weekly_retrospective, daily_invoice_report, ask_ollama, post_to_mattermost, AGENTS

app = FastAPI(title="Titan Bridge API")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:7800","http://localhost:3000","https://milyfe.fun"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

def get_token():
    p = Path("/opt/milyfe/secrets/bridge-token.txt")
    return p.read_text().strip() if p.exists() else os.getenv("TITAN_BRIDGE_TOKEN","")

@app.middleware("http")
async def auth(request: Request, call_next):
    if request.url.path.startswith("/health"):
        return await call_next(request)
    token = get_token()
    if not token:
        return await call_next(request)
    if request.headers.get("Authorization") == f"Bearer {token}":
        return await call_next(request)
    return JSONResponse(status_code=401, content={"status":"error","data":None,"message":"Unauthorized"})

class Company(BaseModel):
    company: str
class ClientName(BaseModel):
    client_name: str
class EmailDraft(BaseModel):
    vendor: str
    subject: str
    context: str
class Slug(BaseModel):
    slug: str

def ok(data=None, msg="OK"):
    return {"status":"success","data":data,"message":msg}
def fail(msg):
    return {"status":"error","data":None,"message":msg}

# ─── Health ──────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    try:
        r = http_req.get("http://localhost:11434/api/tags", timeout=5)
        return ok({"ollama":r.status_code==200,"agents":len(AGENTS)},"Bridge running")
    except:
        return ok({"ollama":False,"agents":len(AGENTS)},"Bridge running, Ollama down")

@app.get("/health/models")
async def health_models():
    need = ["hermes3:3b","hermes3:8b","nemotron-mini:4b","qwen2.5:14b","qwen2.5:7b","llava:13b","nomic-embed-text"]
    try:
        r = http_req.get("http://localhost:11434/api/tags", timeout=5)
        have = [m["name"] for m in r.json().get("models",[])]
        missing = [m for m in need if not any(m in n for n in have)]
        return ok({"loaded":have,"missing":missing})
    except Exception as e:
        return fail(str(e))

# ─── Agent Status ────────────────────────────────────────────────────────
@app.get("/agents/status")
async def agents_status():
    return ok({k:{"name":v.get("name",k),"model":v.get("model",""),"status":"online"} for k,v in AGENTS.items()})

# ─── Existing Runtime Functions ──────────────────────────────────────────
@app.post("/agents/standup")
async def ep_standup():
    try: daily_standup(); return ok(msg="Standup done")
    except Exception as e: return fail(str(e))

@app.post("/agents/frank/invoice-report")
async def ep_invoice():
    try: daily_invoice_report(); return ok(msg="Invoice report done")
    except Exception as e: return fail(str(e))

@app.post("/agents/leo/retrospective")
async def ep_retro():
    try: weekly_retrospective(); return ok(msg="Retrospective done")
    except Exception as e: return fail(str(e))

# ─── Ollama-Powered Agent Functions ─────────────────────────────────────
@app.post("/agents/serena/research")
async def ep_serena(req: Company):
    try:
        r = ask_ollama("qwen2.5:14b", f'Research "{req.company}": what they do, scale, products, market position, news. Concise.', "You are Serena, senior research analyst.")
        return ok({"company":req.company,"analysis":r})
    except Exception as e: return fail(str(e))

@app.post("/agents/serena/monitor")
async def ep_serena_monitor():
    try:
        r = ask_ollama("qwen2.5:14b", "Vendor monitoring report. Flag pricing changes, disruptions, new offerings.", "You are Serena monitoring vendor ecosystem.")
        return ok({"report":r})
    except Exception as e: return fail(str(e))

@app.post("/agents/frank/summary")
async def ep_frank(req: ClientName):
    try:
        journal = Path(f"/opt/milyfe/clients/{req.client_name}/ledger/{req.client_name}.journal")
        ledger = ""
        if journal.exists():
            p = subprocess.run(["/usr/bin/hledger","-f",str(journal),"balance","--flat"], capture_output=True, text=True, timeout=10)
            ledger = p.stdout
        r = ask_ollama("qwen2.5:14b", f'Client summary for "{req.client_name}". Ledger: . Financial position + recommendations.'


        return ok({"client":req.client_name,"summary":r,"ledger":ledger})
    except Exception as e: return fail(str(e))

@app.post("/agents/frank/all-clients")
async def ep_frank_all():
    try:
        cd = Path("/opt/milyfe/clients")
        clients = [d.name for d in cd.iterdir() if d.is_dir()] if cd.exists() else []
        r = ask_ollama("qwen2.5:14b", f'Portfolio summary for {len(clients)} clients: {", ".join(clients) or "none"}. Health and priorities.', "You are Frank, reporting lead.")
        return ok({"clients":clients,"summary":r})
    except Exception as e: return fail(str(e))

@app.post("/agents/leo/errors")
async def ep_leo_errors():
    try:
        lf = Path("/opt/milyfe/logs/agent-runtime.log")
        errors = []
        if lf.exists():
            errors = [l for l in lf.read_text().splitlines()[-200:] if "error" in l.lower()]
        r = ask_ollama("qwen2.5:14b", f'Analyze {len(errors)} errors. Categorize, root causes, fixes. ' + (chr(10).join(errors[:20]) if errors else "No errors."), "You are Leo, learning specialist.")
        return ok({"errors_found":len(errors),"analysis":r})
    except Exception as e: return fail(str(e))

@app.post("/agents/ian/recurring")
async def ep_ian():
    try:
        findings = []
        cd = Path("/opt/milyfe/clients")
        if cd.exists():
            for d in cd.iterdir():
                if not d.is_dir(): continue
                j = d / "ledger" / f"{d.name}.journal"
                if j.exists():
                    p = subprocess.run(["/usr/bin/hledger","-f",str(j),"register","expenses"], capture_output=True, text=True, timeout=10)
                    if p.stdout.strip(): findings.append({"client":d.name,"data":p.stdout.strip()[:500]})
        return ok({"checked":len(findings),"findings":findings})
    except Exception as e: return fail(str(e))

@app.post("/agents/sam/status")
async def ep_sam():
    try:
        r = ask_ollama("qwen2.5:7b", "Daily support status: system health, issues, response time, escalations.", "You are Sam, support lead.")
        return ok({"report":r})
    except Exception as e: return fail(str(e))

@app.post("/agents/dex/draft-email")
async def ep_dex(req: EmailDraft):
    try:
        r = ask_ollama("hermes3:8b", f'Draft email to {req.vendor}. Subject: {req.subject}. Context: {req.context}. Concise, professional.', "You are Dex, operations lead.")
        return ok({"vendor":req.vendor,"subject":req.subject,"draft":r})
    except Exception as e: return fail(str(e))

@app.post("/agents/dex/check-overdue")
async def ep_dex_overdue():
    try:
        overdue = []
        cd = Path("/opt/milyfe/clients")
        if cd.exists():
            for d in cd.iterdir():
                if not d.is_dir(): continue
                j = d / "ledger" / f"{d.name}.journal"
                if j.exists():
                    p = subprocess.run(["/usr/bin/hledger","-f",str(j),"balance","liabilities","--flat"], capture_output=True, text=True, timeout=10)
                    if p.stdout.strip(): overdue.append({"client":d.name,"payable":p.stdout.strip()})
        return ok({"overdue_count":len(overdue),"overdue":overdue})
    except Exception as e: return fail(str(e))

# ─── Client Management ───────────────────────────────────────────────────
@app.post("/clients/onboard")
async def ep_onboard(req: Slug):
    try:
        p = subprocess.run(["/bin/bash","/home/milyfe/Desktop/TVS/scripts/onboard-client.sh",req.slug], capture_output=True, text=True, timeout=120)
        if p.returncode != 0: return fail(p.stderr)
        return ok({"slug":req.slug,"output":p.stdout})
    except Exception as e: return fail(str(e))

@app.get("/clients/{slug}")
async def ep_client(slug: str):
    try:
        p = Path(f"/opt/milyfe/clients/{slug}/config.json")
        if not p.exists(): return fail(f"'{slug}' not found")
        return ok(json.loads(p.read_text()))
    except Exception as e: return fail(str(e))

@app.get("/clients")
async def ep_clients():
    try:
        p = Path("/opt/milyfe/secrets/clients.json")
        return ok(json.loads(p.read_text()) if p.exists() else {})
    except Exception as e: return fail(str(e))

@app.get("/clients/{slug}/ledger/summary")
async def ep_ledger(slug: str):
    try:
        j = Path(f"/opt/milyfe/clients/{slug}/ledger/{slug}.journal")
        if not j.exists(): return ok({"balances":""},"No ledger")
        p = subprocess.run(["/usr/bin/hledger","-f",str(j),"balance","--flat","--no-total"], capture_output=True, text=True, timeout=10)
        return ok({"balances":p.stdout.strip()})
    except Exception as e: return fail(str(e))

@app.get("/clients/{slug}/ledger/transactions")
async def ep_txns(slug: str):
    try:
        j = Path(f"/opt/milyfe/clients/{slug}/ledger/{slug}.journal")
        if not j.exists(): return ok({"transactions":""},"No ledger")
        p = subprocess.run(["/usr/bin/hledger","-f",str(j),"register"], capture_output=True, text=True, timeout=10)
        return ok({"transactions":p.stdout.strip()})
    except Exception as e: return fail(str(e))

@app.get("/clients/{slug}/sovereignty")
async def ep_sov(slug: str):
    try:
        j = Path(f"/opt/milyfe/clients/{slug}/ledger/{slug}.journal")
        tc = 0
        if j.exists():
            p = subprocess.run(["/usr/bin/hledger","-f",str(j),"stats"], capture_output=True, text=True, timeout=10)
            m = re.search(r"Transactions:\s+(\d+)", p.stdout)
            if m: tc = int(m.group(1))
        return ok({"location":"MiLyfe VTS On-Premise","hardware":"ASRock B460/i9-10900F/RX7900XTX","models":{"instant":"hermes3:3b","voice":"hermes3:8b","reasoning":"qwen2.5:14b","triage":"qwen2.5:7b","vision":"llava:13b","embed":"nomic-embed-text"},"third_party_calls":0,"sovereign":True,"transactions":tc})
    except Exception as e: return fail(str(e))

@app.post("/webhooks/mattermost")
async def wh_mm(request: Request):
    logging.info("MM webhook"); return ok()

@app.post("/webhooks/gocardless")
async def wh_gc(request: Request):
    logging.info("GC webhook"); return ok()

if __name__ == "__main__":
    import uvicorn
    print(f"[Bridge API] Port 8099 | Token: {'YES' if get_token() else 'DEV MODE'}")
    uvicorn.run(app, host="0.0.0.0", port=8099)
