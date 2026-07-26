# MiLyfe: Venture Titan Studio — Aider Build Mission

## SYSTEM STATE
- Next.js app running on port 7800
- PostgreSQL 18 on port 5433 (NOT 5432)
- DATABASE_URL=postgresql://milyfe:milyfe_vts_2026@127.0.0.1:5433/milyfe_vts
- All 8 database tables exist and seeded
- 10 phases, 93 tasks, 11 agents, 8 workflows, 17 services in DB

## RUNNING SERVICES (use these exact ports)
- 11434 = Ollama (15 models loaded)
- 3000  = milyfe-openwebui
- 3003  = milyfe-grafana
- 3004  = milyfe-langfuse
- 3005  = milyfe-flowise
- 3010  = mijaxx-mi (OpenWebUI)
- 3011  = mijaxx-git (Gitea)
- 3020  = mijaxx-flowise
- 3022  = mijaxx-rag (AnythingLLM)
- 3052  = milyfe-metabase
- 5000  = milyfe-mlflow
- 5678  = mijaxx-automation (n8n)
- 6900  = milyfe-argilla
- 7800  = MiLyfe Next.js dashboard
- 8001  = milyfe-chroma
- 8065  = milyfe-mattermost
- 8070  = milyfe-gotify
- 8889  = mijaxx-vault
- 9090  = milyfe-prometheus

## YOUR AGENTS (all 11 defined in database)
1. Forge (qwen2.5:32b) - Supervisor
2. Calvin (qwen2.5:14b) - Accounts Receivable
3. Frank (qwen2.5:32b) - Finance Lead
4. Serena (qwen2.5:14b) - Research Lead
5. Dex (qwen2.5:14b) - Operations Lead
6. Paula (qwen2.5:14b) - Payroll Lead
7. Lia (deepseek-r1:14b) - Legal & Contracts
8. Ian (qwen2.5:7b) - Inventory Lead
9. Sam (qwen2.5:7b) - Support Lead
10. Iris (llava:13b) - Vision & OCR Lead
11. Leo (qwen2.5-coder:32b) - Learning Lead

## BUILD TASKS — Complete ALL of these

### TASK 1: Real Service Health Checking
Create src/app/api/services/health/route.ts
- Ping every service on its actual port
- Update database with real status
- Return JSON with all results

### TASK 2: Live Dashboard Updates  
Update src/app/page.tsx
- Poll /api/services/health every 30 seconds
- Real-time green/red status dots
- Show actual port numbers
- Add "Hours Saved" counter widget

### TASK 3: Ollama Model Integration
Update src/app/api/agents/route.ts
- Call http://localhost:11434/api/tags
- Match each agent to their assigned model
- Show model loaded/not loaded status
- Show model size in GB

### TASK 4: Phase Task Management
Update src/app/page.tsx phases tab
- Expandable phases with task checkboxes
- Click task to mark complete
- Progress bar per phase
- Auto-mark phase complete when all tasks done
- Run health checks when phase completes

### TASK 5: Live Build Log Stream
Update src/app/api/logs/route.ts
- Return last 50 logs with pagination
- Severity color coding
Update src/app/page.tsx
- Auto-refresh logs every 10 seconds
- Severity badges (info/warning/error/critical)
- Filter by severity

### TASK 6: Mattermost Setup Script
Create scripts/setup-mattermost.sh
- Wait for Mattermost to be healthy on 8065
- Create team: milyfe-vts
- Create all 14 channels
- Create all 11 bot accounts
- Save tokens to /opt/milyfe/secrets/bot-tokens.json
- Log progress to database via API

### TASK 7: Python Agent Runtime
Create agents/runtime/agent_runtime.py
- Install: pip3 install ollama requests python-dotenv
- Load agent configs from http://localhost:7800/api/agents
- Each agent has its Ollama model assigned
- Daily standup at 7am posts to Mattermost
- Calvin monitors /opt/milyfe/data/incoming for new files
- Leo monitors /opt/milyfe/logs for errors
- All agents post to their Mattermost channels

### TASK 8: Docker Compose Fixes
Create scripts/fix-docker.sh
- Check mattermost logs and fix restart loop
- Check langfuse logs and fix restart loop
- Verify all containers healthy
- Output status report

### TASK 9: Agent Identity Documents
Create /opt/milyfe/agents/{name}/identity.md for each agent
- Full personality profile
- Hard rules
- Tool belt
- Escalation paths
- Sample interactions

### TASK 10: System Startup Script
Create scripts/start-milyfe.sh
- Start Next.js on 7800 if not running
- Start Docker stack if not running
- Run health checks
- Start Python agent runtime
- Open dashboard in browser
- Print full status report

## COMPLETION CRITERIA
The build is complete when:
- All API routes return real data
- Dashboard shows live service status
- All 13 Docker containers running
- Mattermost has all channels and bots
- Python agents are posting to Mattermost
- Calvin processes a test invoice file
- Health check script shows 14+ green

## INSTRUCTIONS FOR AIDER
- Work through tasks 1-10 in order
- After each task, tell me what to run to verify
- If a task fails, fix it before moving to next
- Use TypeScript for all Next.js files
- Use Python 3 for agent runtime
- Use bash for scripts
- Never skip error handling
- Always verify your changes work
