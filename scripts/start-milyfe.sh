#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo -e "${CYAN}  MiLyfe: Venture Titan Studio — Starting  ${NC}"
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo ""

# 1. Start Docker Compose stack
echo "Starting Docker infrastructure..."
cd /opt/milyfe/docker && docker compose up -d 2>/dev/null
echo -e "  ${GREEN}✓${NC} Docker stack started"

# 2. Start standalone containers
for container in milyfe-metabase milyfe-docuseal; do
  docker start $container 2>/dev/null && \
    echo -e "  ${GREEN}✓${NC} $container started" || \
    echo -e "  ${RED}~${NC} $container not available"
done

# 3. Start Next.js dashboard
if curl -s http://localhost:7800/api/health > /dev/null 2>&1; then
  echo -e "  ${GREEN}✓${NC} Dashboard already running on 7800"
else
  echo "  Starting dashboard..."
  cd /home/milyfe/Desktop/TVS
  PYTHONUNBUFFERED=1 nohup npm run dev -- -p 7800 \
    > /opt/milyfe/logs/nextjs.log 2>&1 &
  echo $! > /opt/milyfe/build/nextjs.pid
  sleep 15
  if curl -s http://localhost:7800/api/health > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Dashboard started on 7800"
  else
    echo -e "  ${RED}✗${NC} Dashboard failed to start"
  fi
fi

# 4. Start agent runtime
if pgrep -f "agent_runtime.py" > /dev/null 2>&1; then
  echo -e "  ${GREEN}✓${NC} Agent runtime already running"
else
  echo "  Starting agent runtime..."
  cd /home/milyfe/Desktop/TVS
  PYTHONUNBUFFERED=1 nohup python3 -u agents/runtime/agent_runtime.py \
    > /opt/milyfe/logs/agent-runtime.log 2>&1 &
  echo $! > /opt/milyfe/build/runtime.pid
  sleep 5
  if pgrep -f "agent_runtime.py" > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Agent runtime started"
  else
    echo -e "  ${RED}✗${NC} Agent runtime failed"
  fi
fi

# 5. Refresh Mattermost token
MM_TOKEN=$(curl -s -i -X POST http://localhost:8065/api/v4/users/login \
  -H "Content-Type: application/json" \
  -d '{"login_id":"support@milyfe.fun","password":"VentureTitan2026"}' \
  | grep -i "^token:" | awk '{print $2}' | tr -d '\r')

if [ -n "$MM_TOKEN" ]; then
  echo "$MM_TOKEN" > /opt/milyfe/secrets/mm-admin-token.txt
  echo -e "  ${GREEN}✓${NC} Mattermost token refreshed"
else
  echo -e "  ${RED}✗${NC} Mattermost token refresh failed"
fi

# 6. Service health check
echo ""
echo "Service Status:"
for svc in "Ollama:11434" "Dashboard:7800" "Mattermost:8065" "OpenWebUI:3000" \
           "n8n:5679" "Grafana:3003" "Chroma:8001/api/v2/heartbeat" "Flowise:3005" \
           "Langfuse:3004" "Prometheus:9090" "Gotify:8070" "Argilla:6900" \
           "MLflow:5000" "Metabase:3052"; do
  name="${svc%%:*}"
  port="${svc#*:}"
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "http://localhost:${port}" 2>/dev/null)
  if [[ "$code" =~ ^(200|302|401)$ ]]; then
    echo -e "  ${GREEN}✓${NC} $name (:$port)"
  else
    echo -e "  ${RED}✗${NC} $name (:$port) — $code"
  fi
done

echo ""
echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo -e "${GREEN}  MiLyfe VTS is running.                   ${NC}"
echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo "  Dashboard:   http://localhost:7800"
echo "  Agent Hub:   http://localhost:8065"
echo "  AI Chat:     http://localhost:3000"
echo "  Workflows:   http://localhost:5679"
echo "  Monitoring:  http://localhost:3003"
echo ""

xdg-open http://localhost:7800 2>/dev/null &

