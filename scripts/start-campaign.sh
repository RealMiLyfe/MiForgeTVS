#!/bin/bash
echo "🚀 Starting MiLyfe Campaign System..."

cd ~/Desktop/TVS

# Start Bridge API (Titan agents)
if ! curl -s http://localhost:8099/health > /dev/null 2>&1; then
    nohup python3 agents/api/agent_api.py \
      > logs/bridge-api.log 2>&1 &
    echo "✅ Bridge API starting on :8099"
fi

# Start Dashboard (MiForge UI)
if ! curl -s http://localhost:7800 > /dev/null 2>&1; then
    nohup npm run dev -- --port 7800 \
      > logs/dashboard.log 2>&1 &
    echo "✅ Dashboard starting on :7800"
fi

sleep 5

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  CAMPAIGN SYSTEM STATUS                 ║"
curl -s http://localhost:8099 > /dev/null 2>&1 \
  && echo "║  ✅ Bridge API :8099 LIVE              ║" \
  || echo "║  ❌ Bridge API :8099 DOWN              ║"
curl -s http://localhost:7800 > /dev/null 2>&1 \
  && echo "║  ✅ Dashboard :7800 LIVE               ║" \
  || echo "║  ❌ Dashboard :7800 DOWN               ║"
curl -s http://localhost:8001/api/v1/heartbeat > /dev/null 2>&1 \
  && echo "║  ✅ ChromaDB :8001 LIVE                ║" \
  || echo "║  ❌ ChromaDB :8001 DOWN                ║"
curl -s http://localhost:8065 > /dev/null 2>&1 \
  && echo "║  ✅ Mattermost :8065 LIVE              ║" \
  || echo "║  ❌ Mattermost :8065 DOWN              ║"
echo "╠══════════════════════════════════════════╣"
echo "║  Dashboard: http://localhost:7800       ║"
echo "║  Agents:    http://localhost:8099       ║"
echo "║  Mi AI:     http://localhost:3010       ║"
echo "╚══════════════════════════════════════════╝"

xdg-open http://localhost:7800 &
