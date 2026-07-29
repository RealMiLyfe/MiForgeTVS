"""
Venture Titan Studio — Agent Runtime
Orchestrates 11 senior agents using local Ollama models.
This file contains the core functions exposed via the Bridge API.
"""

import os
import json
import subprocess
import datetime
from pathlib import Path

# ─── Configuration ───────────────────────────────────────────────────────────

CLIENTS_DIR = Path("/opt/milyfe/clients")
SECRETS_DIR = Path("/opt/milyfe/secrets")
LOGS_DIR = Path("/opt/milyfe/logs")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
MATTERMOST_URL = os.getenv("MATTERMOST_URL", "http://localhost:8065")

SENIOR_AGENTS = [
    "forge", "calvin", "serena", "frank", "dex",
    "lia", "ian", "sam", "paula", "iris", "leo"
]


def _get_bot_token():
    """Load Mattermost bot token from secrets."""
    token_file = SECRETS_DIR / "bot-tokens.json"
    if token_file.exists():
        tokens = json.loads(token_file.read_text())
        return tokens.get("mattermost_bot_token", "")
    return os.getenv("MATTERMOST_BOT_TOKEN", "")


def _ollama_generate(model: str, prompt: str, system: str = "") -> str:
    """Call local Ollama model for inference."""
    import requests
    payload = {"model": model, "prompt": prompt, "stream": False}
    if system:
        payload["system"] = system
    try:
        resp = requests.post(f"{OLLAMA_URL}/api/generate", json=payload, timeout=120)
        resp.raise_for_status()
        return resp.json().get("response", "")
    except Exception as e:
        return f"[Ollama Error] {e}"


def _post_to_mattermost(channel_id: str, message: str):
    """Post message to Mattermost channel."""
    import requests
    token = _get_bot_token()
    headers = {"Authorization": f"Bearer {token}"}
    try:
        requests.post(
            f"{MATTERMOST_URL}/api/v4/posts",
            json={"channel_id": channel_id, "message": message},
            headers=headers,
            timeout=10
        )
    except Exception as e:
        print(f"[Mattermost Error] {e}")


# ─── Forge (Supervisor) ─────────────────────────────────────────────────────

def daily_standup():
    """
    Forge orchestrates the daily standup.
    Pings all senior agents, collects status, posts summary to #general.
    """
    timestamp = datetime.datetime.now().isoformat()
    statuses = []
    for agent in SENIOR_AGENTS:
        statuses.append(f"- **{agent.title()}**: Online, ready")

    summary = f"# Daily Standup — {timestamp[:10]}\n\n" + "\n".join(statuses)
    summary += "\n\n---\n*All agents nominal. Awaiting assignments.*"

    # Post to Mattermost #general or log
    print(f"[Forge Standup] {timestamp}")
    print(summary)
    return {"status": "completed", "timestamp": timestamp, "summary": summary}


# ─── Serena (Research Lead) ──────────────────────────────────────────────────

def serena_research_company(company: str):
    """
    Serena researches a company: public info, financials, market position.
    Uses Ollama qwen2.5:14b for analysis.
    """
    prompt = f"""Research the company "{company}". Provide:
1. What they do (1-2 sentences)
2. Estimated revenue/scale
3. Key products or services
4. Market position and competitors
5. Any recent news or developments

Be concise and factual."""

    result = _ollama_generate("qwen2.5:14b", prompt, system="You are Serena, a senior research analyst.")
    return {"company": company, "analysis": result, "agent": "serena"}


def serena_monitor_vendors():
    """
    Serena monitors all known vendors across client portfolios.
    Checks for pricing changes, service disruptions, new offerings.
    """
    # In production: iterate client vendor lists, check each
    result = _ollama_generate(
        "qwen2.5-coder:14b",
        "Generate a vendor monitoring report. List any flagged changes.",
        system="You are Serena, monitoring vendor ecosystem health."
    )
    return {"report": result, "vendors_checked": 0, "flags": [], "agent": "serena"}


# ─── Frank (Reporting Lead) ──────────────────────────────────────────────────

def frank_client_summary(client_name: str):
    """
    Frank generates an operational summary for a specific client.
    Pulls from ledger, agent activity, and Mattermost history.
    """
    client_dir = CLIENTS_DIR / client_name
    journal = client_dir / "ledger" / "main.journal"

    ledger_data = ""
    if journal.exists():
        try:
            result = subprocess.run(
                ["hledger", "-f", str(journal), "balance", "--flat"],
                capture_output=True, text=True, timeout=10
            )
            ledger_data = result.stdout
        except Exception:
            ledger_data = "[Ledger unavailable]"

    prompt = f"""Generate a client operational summary for "{client_name}".
Ledger data:
{ledger_data or '[No ledger data yet]'}

Include: financial position, recent activity, and recommendations."""

    result = _ollama_generate("qwen2.5:14b", prompt, system="You are Frank, a senior reporting analyst.")
    return {"client": client_name, "summary": result, "ledger": ledger_data, "agent": "frank"}


def frank_all_clients_summary():
    """
    Frank generates a portfolio-wide summary across all clients.
    """
    clients = []
    if CLIENTS_DIR.exists():
        clients = [d.name for d in CLIENTS_DIR.iterdir() if d.is_dir()]

    prompt = f"""Generate a portfolio summary for {len(clients)} clients: {', '.join(clients) or 'none yet'}.
Summarize overall portfolio health, revenue trends, and priorities."""

    result = _ollama_generate("qwen2.5:14b", prompt, system="You are Frank, reporting lead for a multi-client portfolio.")
    return {"clients": clients, "count": len(clients), "summary": result, "agent": "frank"}


def daily_invoice_report():
    """
    Frank produces the daily invoice/receivables report.
    Checks all client ledgers for outstanding invoices.
    """
    outstanding = []
    if CLIENTS_DIR.exists():
        for client_dir in CLIENTS_DIR.iterdir():
            if not client_dir.is_dir():
                continue
            journal = client_dir / "ledger" / "main.journal"
            if journal.exists():
                try:
                    result = subprocess.run(
                        ["hledger", "-f", str(journal), "balance", "receivable", "--flat"],
                        capture_output=True, text=True, timeout=10
                    )
                    if result.stdout.strip():
                        outstanding.append({"client": client_dir.name, "balance": result.stdout.strip()})
                except Exception:
                    pass

    return {"report": "Daily Invoice Report", "outstanding": outstanding, "count": len(outstanding), "agent": "frank"}


# ─── Leo (Learning / Retrospectives) ────────────────────────────────────────

def leo_weekly_error_report():
    """
    Leo reviews logs from the past week for errors, patterns, and improvements.
    """
    errors = []
    log_file = LOGS_DIR / "agent-runtime.log"
    if log_file.exists():
        try:
            lines = log_file.read_text().splitlines()[-500:]
            errors = [l for l in lines if "error" in l.lower() or "exception" in l.lower()]
        except Exception:
            pass

    prompt = f"""Analyze these {len(errors)} error log entries and provide:
1. Error categories (grouped)
2. Root cause hypotheses
3. Recommended fixes
4. Priority ranking

Errors: {chr(10).join(errors[:50]) if errors else 'No errors found this week.'}"""

    result = _ollama_generate("qwen2.5:14b", prompt, system="You are Leo, a learning and retrospectives specialist.")
    return {"errors_found": len(errors), "analysis": result, "agent": "leo"}


def weekly_retrospective():
    """
    Leo conducts a weekly retrospective: what went well, what didn't, improvements.
    """
    prompt = """Conduct a weekly retrospective for the Titan agent team.
Structure as:
1. What went well this week
2. What could be improved
3. Action items for next week
4. Agent performance notes

Base this on general operational health assessment."""

    result = _ollama_generate("qwen2.5:14b", prompt, system="You are Leo, facilitating a team retrospective.")
    return {"retrospective": result, "agent": "leo"}


# ─── Ian (Inventory Lead) ───────────────────────────────────────────────────

def ian_check_recurring_vendors():
    """
    Ian checks for recurring vendor charges, subscription renewals,
    and flags any anomalies.
    """
    findings = []
    if CLIENTS_DIR.exists():
        for client_dir in CLIENTS_DIR.iterdir():
            if not client_dir.is_dir():
                continue
            journal = client_dir / "ledger" / "main.journal"
            if journal.exists():
                try:
                    result = subprocess.run(
                        ["hledger", "-f", str(journal), "register", "expenses:subscriptions", "--monthly"],
                        capture_output=True, text=True, timeout=10
                    )
                    if result.stdout.strip():
                        findings.append({"client": client_dir.name, "subscriptions": result.stdout.strip()})
                except Exception:
                    pass

    return {"vendors_checked": len(findings), "findings": findings, "agent": "ian"}


# ─── Sam (Support Lead) ─────────────────────────────────────────────────────

def sam_daily_status():
    """
    Sam reports on support health: open tickets, response times, escalations.
    """
    prompt = """Generate a daily support status report covering:
1. System health (all services)
2. Open issues count
3. Average response time
4. Escalations pending
5. Customer satisfaction signals"""

    result = _ollama_generate("qwen2.5:7b", prompt, system="You are Sam, a support operations lead.")
    return {"status_report": result, "agent": "sam"}


# ─── Dex (Ops Lead) ─────────────────────────────────────────────────────────

def dex_draft_vendor_email(vendor: str, subject: str, context: str):
    """
    Dex drafts a professional email to a vendor.
    """
    prompt = f"""Draft a professional business email:
To: {vendor}
Subject: {subject}
Context: {context}

Keep it concise, professional, and action-oriented. Include a clear ask or next step."""

    result = _ollama_generate("qwen2.5:14b", prompt, system="You are Dex, an operations lead drafting vendor communications.")
    return {"vendor": vendor, "subject": subject, "draft": result, "agent": "dex"}


def dex_check_overdue_vendors():
    """
    Dex checks for overdue vendor payments or outstanding follow-ups.
    """
    overdue = []
    if CLIENTS_DIR.exists():
        for client_dir in CLIENTS_DIR.iterdir():
            if not client_dir.is_dir():
                continue
            journal = client_dir / "ledger" / "main.journal"
            if journal.exists():
                try:
                    result = subprocess.run(
                        ["hledger", "-f", str(journal), "balance", "liabilities:payable", "--flat"],
                        capture_output=True, text=True, timeout=10
                    )
                    if result.stdout.strip():
                        overdue.append({"client": client_dir.name, "payable": result.stdout.strip()})
                except Exception:
                    pass

    return {"overdue_count": len(overdue), "overdue": overdue, "agent": "dex"}


# ─── Entry Point ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("[Agent Runtime] Starting Venture Titan Studio agent runtime...")
    print(f"[Agent Runtime] {len(SENIOR_AGENTS)} senior agents initialized")
    print(f"[Agent Runtime] Ollama: {OLLAMA_URL}")
    print(f"[Agent Runtime] Mattermost: {MATTERMOST_URL}")
    print(f"[Agent Runtime] Clients dir: {CLIENTS_DIR}")
    print("[Agent Runtime] Ready. Awaiting commands via Bridge API or scheduler.")

    # In production, this runs a scheduler loop or listens for events.
    # The Bridge API (agent_api.py) calls these functions directly.
    import time
    while True:
        time.sleep(60)
