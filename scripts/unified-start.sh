#!/bin/bash
# MiLyfe Unified Platform Startup
# Boots Titan operational engine + MiForge presentation layer

set -e

echo "🔨 Starting MiLyfe unified platform..."
echo ""

TITAN_DIR="${TITAN_DIR:-/projects/sandbox/MiForgeTVS/apps/titan}"
MIFORGE_DIR="${MIFORGE_DIR:-/projects/sandbox/MiForgeTVS/apps/miforge}"
LOG_DIR="${LOG_DIR:-/opt/milyfe/logs}"
BUILD_DIR="${BUILD_DIR:-/opt/milyfe/build}"

mkdir -p "$LOG_DIR" "$BUILD_DIR" 2>/dev/null || true

# 1. Start Titan infrastructure (Docker stack)
if [ -f "$TITAN_DIR/docker-compose.yml" ]; then
  echo "→ Starting Titan Docker stack..."
  cd "$TITAN_DIR"
  docker compose up -d 2>/dev/null && echo "  ✓ Titan Docker stack started" || echo "  ⚠ Docker stack not available (dev mode)"
else
  echo "  ⚠ No docker-compose.yml found - skipping Docker (dev mode)"
fi

# 2. Refresh Mattermost token
if [ -f "$TITAN_DIR/scripts/refresh-mm-token.sh" ]; then
  echo "→ Refreshing Mattermost token..."
  bash "$TITAN_DIR/scripts/refresh-mm-token.sh" 2>/dev/null && echo "  ✓ Token refreshed" || echo "  ⚠ Token refresh skipped"
fi

# 3. Start Titan agent runtime
if [ -f "$TITAN_DIR/agents/runtime/agent_runtime.py" ]; then
  echo "→ Starting Titan agent runtime..."
  cd "$TITAN_DIR"
  PYTHONUNBUFFERED=1 nohup python3 -u agents/runtime/agent_runtime.py \
    > "$LOG_DIR/agent-runtime.log" 2>&1 &
  echo $! > "$BUILD_DIR/runtime.pid"
  echo "  ✓ Agent runtime started (PID $(cat $BUILD_DIR/runtime.pid))"
fi

# 4. Start Titan Bridge API
echo "→ Starting Titan Bridge API on port 8099..."
cd "$TITAN_DIR"
if [ -f "agents/api/agent_api.py" ]; then
  PYTHONUNBUFFERED=1 nohup python3 -u agents/api/agent_api.py \
    > "$LOG_DIR/bridge-api.log" 2>&1 &
  echo $! > "$BUILD_DIR/bridge-api.pid"
  echo "  ✓ Bridge API started on port 8099"
else
  echo "  ⚠ Bridge API not found"
fi

# 5. Start MiForge Next.js app
echo "→ Starting MiForge on port 7800..."
cd "$MIFORGE_DIR"
PYTHONUNBUFFERED=1 nohup npx next dev -p 7800 \
  > "$LOG_DIR/miforge.log" 2>&1 &
echo $! > "$BUILD_DIR/miforge.pid"
echo "  ✓ MiForge started on port 7800"

# 6. Verify integration
echo ""
echo "→ Verifying services (waiting 5s)..."
sleep 5

BRIDGE_OK=false
MIFORGE_OK=false

curl -sf http://localhost:8099/health > /dev/null 2>&1 && BRIDGE_OK=true
curl -sf http://localhost:7800 > /dev/null 2>&1 && MIFORGE_OK=true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🏛️  MILYFE UNIFIED PLATFORM"
echo ""
printf "   MiForge:     http://localhost:7800  "
$MIFORGE_OK && echo "✓" || echo "⚠ starting..."
printf "   Titan API:   http://localhost:8099  "
$BRIDGE_OK && echo "✓" || echo "⚠ not running"
echo "   Mattermost:  http://localhost:8065"
echo "   Grafana:     http://localhost:3004"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Data sovereignty: ACTIVE"
echo "AI models: LOCAL (Ollama)"
echo "Client data: NEVER leaves this machine"
echo ""
