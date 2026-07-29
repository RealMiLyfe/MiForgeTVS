#!/usr/bin/env python3
"""
MiLyfe: Venture Titan Studio — Agent Runtime
All 11 agents running on local Ollama models
"""

import json
import os
import sys
import time
import requests
import schedule
import threading
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
import importlib.util as _ilu
_gc_spec = _ilu.spec_from_file_location("gocardless_handler", "/home/milyfe/Desktop/TVS/agents/payments/gocardless_handler.py")
_gc_mod = _ilu.module_from_spec(_gc_spec)
_gc_spec.loader.exec_module(_gc_mod)
create_payment_with_gocardless = _gc_mod.create_payment_with_gocardless

load_dotenv('/home/milyfe/Desktop/TVS/.env')

# ============================================================
# CONFIGURATION
# ============================================================

MATTERMOST_URL = "http://localhost:8065"
OLLAMA_URL = "http://localhost:11434"
DASHBOARD_URL = "http://localhost:7800"
SECRETS_DIR = "/opt/milyfe/secrets"
DATA_INCOMING = "/opt/milyfe/data/incoming"
LOGS_DIR = "/opt/milyfe/logs"

def load_secrets():
    with open(f"{SECRETS_DIR}/bot-tokens.json") as f:
        tokens = json.load(f)
    with open(f"{SECRETS_DIR}/channel-ids.json") as f:
        channels = json.load(f)
    return tokens, channels

TOKENS, CHANNELS = load_secrets()

def get_client_for_file(file_path: str) -> str:
    """Infer client from path or filename, else default."""
    p = str(file_path).lower()
    if "teresa" in p:
        return "teresa-grooming"
    if "ohio" in p:
        return "ohio-landscaping"
    return "default"

# ============================================================
# AGENT DEFINITIONS
# ============================================================

AGENTS = {
    "forge-supervisor": {
        "name": "Forge",
        "model": "qwen2.5:32b",
        "channel": "daily-ops",
        "role": "Supervisor — routes tasks, identifies conflicts, escalates to human",
        "emoji": "🎯"
    },
    "calvin-ar": {
        "name": "Calvin",
        "model": "qwen2.5:14b",
        "channel": "finance-desk",
        "role": "AR Lead — invoices, payments, reconciliation",
        "emoji": "📊"
    },
    "frank-finance": {
        "name": "Frank",
        "model": "qwen2.5:32b",
        "channel": "finance-desk",
        "role": "Finance Lead — reporting, budgets, cash flow",
        "emoji": "💰"
    },
    "serena-research": {
        "name": "Serena",
        "model": "qwen2.5:14b",
        "channel": "research-desk",
        "role": "Research Lead — competitive intel, market analysis",
        "emoji": "🔍"
    },
    "dex-ops": {
        "name": "Dex",
        "model": "qwen2.5:14b",
        "channel": "operations-desk",
        "role": "Operations Lead — vendor emails, scheduling, contracts",
        "emoji": "⚙️"
    },
    "paula-payroll": {
        "name": "Paula",
        "model": "qwen2.5:14b",
        "channel": "hr-desk",
        "role": "Payroll Lead — payroll calculations, contractor payments",
        "emoji": "💼"
    },
    "lia-legal": {
        "name": "Lia",
        "model": "deepseek-r1:14b",
        "channel": "operations-desk",
        "role": "Legal — NDA drafting, contract review, compliance",
        "emoji": "⚖️"
    },
    "ian-inventory": {
        "name": "Ian",
        "model": "qwen2.5:7b",
        "channel": "operations-desk",
        "role": "Inventory Lead — stock monitoring, reorder alerts",
        "emoji": "📦"
    },
    "sam-support": {
        "name": "Sam",
        "model": "qwen2.5:7b",
        "channel": "support-desk",
        "role": "Support Lead — tier-1 support, ticket routing",
        "emoji": "🎧"
    },
    "iris-vision": {
        "name": "Iris",
        "model": "llava:13b",
        "channel": "finance-desk",
        "role": "Vision Lead — OCR, invoice scanning, document extraction",
        "emoji": "👁️"
    },
    "leo-learning": {
        "name": "Leo",
        "model": "qwen2.5-coder:32b",
        "channel": "learning-log",
        "role": "Learning Lead — error analysis, knowledge base updates",
        "emoji": "🧠"
    }
}

def record_to_hledger(invoice_data):
    """Record invoice data to hledger by appending to journal file."""
    try:
        from pathlib import Path
        client_name = invoice_data.get("client_name", "default")
        journal_path = Path(f"/opt/milyfe/clients/{client_name}/ledger/{client_name}.journal")
        journal_path.parent.mkdir(parents=True, exist_ok=True)
        if not journal_path.exists():
            journal_path.write_text(f"; {client_name} Ledger\n\n")
        date = invoice_data.get("date", datetime.now().strftime("%Y-%m-%d"))
        vendor = invoice_data.get("vendor_name", "Unknown")
        amount = float(invoice_data.get("amount", 0))
        entry = f"""
{date} {vendor}
    expenses:vendors    ${amount:.2f}
    assets:checking

"""
        with open(journal_path, "a") as f:
            f.write(entry)
        print(f"[INFO] Invoice recorded to hledger: {vendor} ${amount:.2f}")
    except Exception as e:
        print(f"[ERROR] Failed to record invoice to hledger: {e}")

# ============================================================
# CORE FUNCTIONS
# ============================================================

def post_to_mattermost(bot_username: str, message: str, channel_name: str = None):
    """Post a message to Mattermost as a specific bot."""
    try:
        token = TOKENS[bot_username]["token"]
        if channel_name is None:
            channel_name = AGENTS[bot_username]["channel"]
        channel_id = CHANNELS.get(channel_name, "")
        
        if not channel_id:
            print(f"[ERROR] Channel not found: {channel_name}")
            return False
        
        response = requests.post(
            f"{MATTERMOST_URL}/api/v4/posts",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            },
            json={
                "channel_id": channel_id,
                "message": message
            },
            timeout=10
        )
        return response.status_code == 201
    except Exception as e:
        print(f"[ERROR] Failed to post as {bot_username}: {e}")
        return False

# ============================================================
# AKAUNTING INTEGRATION
# ============================================================

AKAUNTING_URL = "http://localhost:8081"
AKAUNTING_TOKEN = None

def akaunting_get_token():
    """Authenticate with Akaunting API and store the token."""
    global AKAUNTING_TOKEN
    try:
        response = requests.post(
            f"{AKAUNTING_URL}/api/v1/auth/login",
            json={
                "email": os.getenv("AKAUNTING_EMAIL"),
                "password": os.getenv("AKAUNTING_PASSWORD")
            },
            timeout=10
        )
        if response.status_code == 200:
            AKAUNTING_TOKEN = response.json().get("token")
            return True
        else:
            print(f"[ERROR] Failed to authenticate with Akaunting: {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] Akaunting authentication error: {e}")
        return False

def akaunting_check_vendor(vendor_name):
    """Search for a vendor in Akaunting."""
    try:
        response = requests.get(
            f"{AKAUNTING_URL}/api/v1/vendors",
            headers={
                "Authorization": f"Bearer {AKAUNTING_TOKEN}"
            },
            params={"search": vendor_name},
            timeout=10
        )
        if response.status_code == 200:
            vendors = response.json().get("data", [])
            return vendors[0] if vendors else None
        else:
            print(f"[ERROR] Failed to check vendor in Akaunting: {response.status_code}")
            return None
    except Exception as e:
        print(f"[ERROR] Akaunting vendor check error: {e}")
        return None

def akaunting_create_vendor(vendor_data):
    """Create a new vendor in Akaunting."""
    try:
        response = requests.post(
            f"{AKAUNTING_URL}/api/v1/vendors",
            headers={
                "Authorization": f"Bearer {AKAUNTING_TOKEN}",
                "Content-Type": "application/json"
            },
            json=vendor_data,
            timeout=10
        )
        if response.status_code == 201:
            return response.json().get("data")
        else:
            print(f"[ERROR] Failed to create vendor in Akaunting: {response.status_code}")
            return None
    except Exception as e:
        print(f"[ERROR] Akaunting vendor creation error: {e}")
        return None

def akaunting_create_invoice(invoice_data):
    """Create a new invoice (bill) in Akaunting."""
    try:
        response = requests.post(
            f"{AKAUNTING_URL}/api/v1/bills",
            headers={
                "Authorization": f"Bearer {AKAUNTING_TOKEN}",
                "Content-Type": "application/json"
            },
            json=invoice_data,
            timeout=10
        )
        if response.status_code == 201:
            return response.json().get("data")
        else:
            print(f"[ERROR] Failed to create invoice in Akaunting: {response.status_code}")
            return None
    except Exception as e:
        print(f"[ERROR] Akaunting invoice creation error: {e}")
        return None

def akaunting_get_invoices():
    """List recent invoices from Akaunting."""
    try:
        response = requests.get(
            f"{AKAUNTING_URL}/api/v1/bills",
            headers={
                "Authorization": f"Bearer {AKAUNTING_TOKEN}"
            },
            timeout=10
        )
        if response.status_code == 200:
            return response.json().get("data", [])
        else:
            print(f"[ERROR] Failed to get invoices from Akaunting: {response.status_code}")
            return []
    except Exception as e:
        print(f"[ERROR] Akaunting invoice retrieval error: {e}")
        return []

def ask_ollama(model: str, prompt: str, system: str = "") -> str:
    """Ask a question to a local Ollama model."""
    try:
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False
        }
        if system:
            payload["system"] = system
        
        response = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json=payload,
            timeout=120
        )
        if response.status_code == 200:
            return response.json().get("response", "")
        return ""
    except Exception as e:
        print(f"[ERROR] Ollama error with {model}: {e}")
        return ""

from pathlib import Path
import subprocess

def log_to_dashboard(message: str, severity: str = "info", source: str = "runtime"):
    """Log a message to the MiLyfe dashboard."""
    try:
        requests.post(
            f"{DASHBOARD_URL}/api/logs",
            json={"message": message, "severity": severity, "source": source},
            timeout=5
        )
    except:
        pass

# ============================================================
# WORKFLOW 1: DAILY STANDUP (7am)
# ============================================================

def daily_standup():
    """Each agent posts their morning status."""
    print(f"[{datetime.now()}] Running daily standup...")
    
    standups = {
        "calvin-ar": "📊 **Calvin — Morning Check-in**\nMonitoring accounts receivable. Checking for overdue invoices and new documents in incoming folder.",
        "frank-finance": "💰 **Frank — Morning Check-in**\nFinancial monitoring active. Ready to generate reports on request.",
        "serena-research": "🔍 **Serena — Morning Check-in**\nCompetitive intelligence systems online. Monitoring market for significant changes.",
        "dex-ops": "⚙️ **Dex — Morning Check-in**\nOperations desk active. Monitoring vendor communications and scheduling queue.",
        "paula-payroll": "💼 **Paula — Morning Check-in**\nPayroll systems online. No pending payroll runs at this time.",
        "lia-legal": "⚖️ **Lia — Morning Check-in**\nLegal review queue clear. Ready to review contracts and flag compliance issues.",
        "ian-inventory": "📦 **Ian — Morning Check-in**\nInventory monitoring active. No critical stock alerts at this time.",
        "sam-support": "🎧 **Sam — Morning Check-in**\nSupport desk online. Ready to handle tier-1 customer inquiries.",
        "leo-learning": "🧠 **Leo — Morning Check-in**\nLearning systems active. Monitoring error logs for patterns and improvement opportunities."
    }
    
    standup_channel = "agent-standup"
    for bot, message in standups.items():
        post_to_mattermost(bot, message, standup_channel)
        time.sleep(2)
    
    # Forge summarizes
    summary = ask_ollama(
        "qwen2.5:7b",
        "Write a brief 3-sentence morning briefing for a small business AI workforce. All 10 specialist agents have checked in and are online. Mention that the system is ready for the day's tasks.",
        "You are Forge, the supervisor agent for MiLyfe: Venture Titan Studio. You are professional, concise, and focused on business operations."
    )
    
    if summary:
        post_to_mattermost(
            "forge-supervisor",
            f"🎯 **Forge — Daily Brief**\n\n{summary}\n\n_All agents online. Monitoring active._",
            "daily-ops"
        )
    
    log_to_dashboard("Daily standup completed — all agents checked in", "info", "forge-supervisor")
    print(f"[{datetime.now()}] Daily standup complete")

# ============================================================
# WORKFLOW 2: INVOICE WATCHER (Calvin)
# ============================================================

def watch_incoming_files():
    """Calvin watches for new files in the incoming folder."""
    import hashlib
    seen_files = set()
    incoming = Path(DATA_INCOMING)
    
    print(f"[{datetime.now()}] Calvin watching {DATA_INCOMING}...")
    
    while True:
        try:
            for file_path in incoming.glob("*"):
                if file_path.is_file():
                    file_key = str(file_path)
                    if file_key not in seen_files:
                        seen_files.add(file_key)
                        print(f"[Calvin] New file detected: {file_path.name}")
                        
                        # Calvin processes the file
                        suffix = Path(file_path).suffix.lower()
                        if suffix == ".pdf" or suffix in [".jpg", ".png", ".jpeg"]:
                            result = subprocess.run(["/usr/bin/hledger", "-f", str(file_path)], capture_output=True, text=True)
                            parsed = json.loads(result.stdout) if result.returncode == 0 and "error" not in result.stdout else {}
                            
                            vendor_name = parsed.get("vendor_name", "Unknown")
                            amount = float(parsed.get("amount", 0))
                            date = parsed.get("date", datetime.now().strftime("%Y-%m-%d"))
                            description = parsed.get("description", "No description provided")
                        elif suffix == ".txt":
                            with open(file_path, 'r') as file:
                                content = file.read()
                            
                            # Extract vendor name, amount, date, description
                            import re
                            vendor_match = re.search(r"(\d{4}[-/]\d{2}[-/]\d{2})\s+(.+)\n\s+expenses:vendors", content, re.MULTILINE)
                            amount_match = re.search(r"(?im)^\s*(amount|total|total due|subtotal)\s*:\s*\$?\s*([0-9][0-9,]*\.?[0-9]*)$", content)
                            date_match = re.search(r"(?im)^\s*(date|invoice date)\s*:\s*(.+)$", content)
                            desc_match = re.search(r"(?im)^\s*(description|item|items)\s*:\s*(.+)$", content)
                            
                            vendor_name = vendor_match.group(2).strip() if vendor_match else "Unknown"
                            amount = float(amount_match.group(2).replace(",", "")) if amount_match else 0.0
                            date = date_match.group(2).strip() if date_match else datetime.now().strftime("%Y-%m-%d")
                            description = desc_match.group(2).strip() if desc_match else "No description provided"
                        else:
                            print(f"[ERROR] Unsupported file type: {suffix}")
                            continue
                        
                        client_name = get_client_for_file(str(file_path))
                        record_to_hledger({
                            'date': date,
                            'vendor_name': vendor_name,
                            'amount': amount,
                            'client_name': client_name
                        })
                        
                        if 0 < amount < 500:
                            payment_id = create_payment_with_gocardless(vendor_name, int(amount * 100), description)
                            if payment_id:
                                post_to_mattermost("calvin-ar", f"Payment of ${amount} processed via GoCardless. Payment ID: {payment_id}", "finance-desk")
                            else:
                                post_to_mattermost("calvin-ar", f"GoCardless payment failed for vendor - flagging for manual review", "finance-desk")
                        elif amount >= 500:
                            post_to_mattermost("calvin-ar", f"APPROVAL REQUIRED - Invoice from {vendor_name} for ${amount}", "human-approvals")
                        
                        message = (f"📥 **New Document Received**\n\n"
                                   f"**File:** `{file_path.name}`\n"
                                   f"**Detected:** {datetime.now().strftime('%H:%M:%S')}\n"
                                   f"**Vendor:** {vendor_name}\n"
                                   f"**Amount:** ${amount}\n"
                                   f"**Date:** {date}\n"
                                   f"**Description:** {description}\n\n"
                                   f"_Processing initiated. Human review required if amount exceeds $500._")
                        post_to_mattermost("calvin-ar", message)
                        log_to_dashboard(f"Calvin processing new file: {file_path.name}", "info", "calvin-ar")
        
        except Exception as e:
            print(f"[ERROR] File watcher error: {e}")
        
        time.sleep(30)

# ============================================================
# WORKFLOW 4: WEEKLY RETROSPECTIVE (Leo — Fridays)
# ============================================================

def weekly_retrospective():
    """Leo analyzes the week and posts retrospective."""
    print(f"[{datetime.now()}] Leo running weekly retrospective...")
    
    retrospective = ask_ollama(
        "qwen2.5-coder:32b",
        "Write a brief weekly retrospective for a small business AI workforce system. Include: what types of tasks were handled this week, any patterns in the work, and one suggestion for improvement. Keep it under 200 words.",
        "You are Leo, the Learning Lead for MiLyfe: Venture Titan Studio. You analyze patterns, log corrections, and help the system improve over time."
    )
    
    if retrospective:
        post_to_mattermost(
            "leo-learning",
            f"🧠 **Weekly Retrospective — {datetime.now().strftime('%B %d, %Y')}**\n\n{retrospective}\n\n_Next retrospective: Friday at 5pm_",
            "weekly-retrospective"
        )
    
    log_to_dashboard("Weekly retrospective posted by Leo", "info", "leo-learning")

# ============================================================
# WORKFLOW 5: DAILY INVOICE REPORT (Frank — Daily)
# ============================================================

def daily_invoice_report():
    """Frank generates a daily hledger report."""
    print(f"[{datetime.now()}] Frank generating daily invoice report...")

    try:
        client_ledgers = list(Path("/opt/milyfe/clients").glob("*/ledger/*.journal"))
        if not client_ledgers:
            post_to_mattermost(
                "frank-finance",
                "Daily Finance Report - No client ledgers found.",
                "finance-desk"
            )
            return

        report_lines = [
            f"📅 **Daily Finance Report — {datetime.now().strftime('%B %d, %Y')}**",
            ""
        ]

        for ledger in client_ledgers:
            client_name = ledger.stem

            balance = subprocess.run(["/usr/bin/hledger", "-f", str(ledger), "balance"], capture_output=True, text=True)
            register = subprocess.run(["/usr/bin/hledger", "-f", str(ledger), "register"], capture_output=True, text=True)

            report_lines.append(f"**Client:** {client_name}")

            if balance.returncode == 0:
                report_lines.append("**Balance:**")
                report_lines.append(f"```\n{balance.stdout.strip()}\n```")
            else:
                report_lines.append(f"Balance error: {balance.stderr.strip()}")

            if register.returncode == 0 and register.stdout.strip():
                report_lines.append("**Recent Transactions:**")
                report_lines.append(f"```\n{register.stdout.strip()[:1500]}\n```")
            else:
                report_lines.append("No recent transactions.")

            report_lines.append("")

        post_to_mattermost(
            "frank-finance",
            "\n".join(report_lines),
            "finance-desk"
        )
        log_to_dashboard("Daily invoice report posted by Frank", "info", "frank-finance")

    except Exception as e:
        print(f"[ERROR] Daily invoice report failed: {e}")

# Schedule daily invoice report
schedule.every().day.at("18:00").do(daily_invoice_report)

# ============================================================
# AGENT ONLINE ANNOUNCEMENTS
# ============================================================

def announce_all_agents():
    """Have each agent announce they are online."""
    print("Announcing all agents online...")
    
    announcements = [
        ("serena-research", "research-desk", 
         "🔍 **Serena — Research Lead | Online**\n\nCompetitive intelligence systems active. I monitor market trends, competitor pricing, and industry news. Tag me for research requests.\n\n— Serena"),
        ("dex-ops", "operations-desk",
         "⚙️ **Dex — Operations Lead | Online**\n\nVendor management and operations desk active. I handle vendor emails, draft contracts, and manage scheduling. All contracts are flagged to Lia before sending.\n\n— Dex"),
        ("paula-payroll", "hr-desk",
         "💼 **Paula — Payroll Lead | Online**\n\nPayroll systems initialized. Every payroll run requires human approval before processing. I never process payments without a signed timesheet on file.\n\n— Paula"),
        ("lia-legal", "operations-desk",
         "⚖️ **Lia — Legal Lead | Online**\n\nContract review and compliance monitoring active. All documents I produce are marked DRAFT until a human approves. I flag but never give legal advice.\n\n— Lia"),
        ("sam-support", "support-desk",
         "🎧 **Sam — Support Lead | Online**\n\nTier-1 support desk active. I draft responses but humans send them externally. I never make refund commitments.\n\n— Sam"),
        ("leo-learning", "learning-log",
         "🧠 **Leo — Learning Lead | Online**\n\nError analysis and knowledge base systems active. I watch all logs and propose improvements every Friday. No prompt updates without human approval.\n\n— Leo"),
        ("frank-finance", "finance-desk",
         "💰 **Frank — Finance Lead | Online**\n\nFinancial reporting systems active. Monthly reports require human sign-off. I flag any expense category spike over 20%.\n\n— Frank"),
        ("ian-inventory", "operations-desk",
         "📦 **Ian — Inventory Lead | Online**\n\nInventory monitoring active. I flag discrepancies over 5% immediately. No reorders placed without human approval.\n\n— Ian"),
        ("iris-vision", "finance-desk",
         "👁️ **Iris — Vision Lead | Online**\n\nOCR and document scanning systems active. I process invoices and receipts and always output structured JSON. Low-confidence extractions are flagged.\n\n— Iris")
    ]
    
    for bot, channel, message in announcements:
        result = post_to_mattermost(bot, message, channel)
        status = "✓" if result else "✗"
        print(f"  {status} {bot} → #{channel}")
        time.sleep(3)

# ============================================================
# MAIN RUNTIME
# ============================================================

def main():
    print("=" * 60)
    print("  MiLyfe: Venture Titan Studio — Agent Runtime")
    print(f"  Starting: {datetime.now()}")
    print("=" * 60)
    
    # Announce all agents online
    announce_all_agents()
    
    # Start file watcher in background thread
    watcher_thread = threading.Thread(
        target=watch_incoming_files,
        daemon=True,
        name="calvin-file-watcher"
    )
    watcher_thread.start()
    print("✓ Calvin file watcher started")
    
    # Schedule workflows
    schedule.every().day.at("07:00").do(daily_standup)
    schedule.every().friday.at("17:00").do(weekly_retrospective)
    
    print("✓ Schedules configured:")
    print("  → Daily standup: 7:00am")
    print("  → Weekly retrospective: Friday 5:00pm")
    print("")
    print("✓ Agent runtime fully active")
    print("  Watching for tasks...")
    print("")
    
    log_to_dashboard("MiLyfe VTS agent runtime started — all 11 agents online", "info", "system")
    
    # Run standup immediately on start
    daily_standup()
    
    # Keep running
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    main()
