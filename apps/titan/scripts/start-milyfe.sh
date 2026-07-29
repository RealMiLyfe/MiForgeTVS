#!/bin/bash
# ═══════════════════════════════════════════════════════
# MiLyfe / Venture Titan Studio — Full System Startup
# ═══════════════════════════════════════════════════════

set -e

TITAN_ROOT="${TITAN_ROOT:-/opt/milyfe}"
SCRIPTS_DIR="$TITAN_ROOT/scripts"
LOGS_DIR="$TITAN_ROOT/logs"
BUILD_DIR="$TITAN_ROOT/build"
SECRETS_DIR="$TITAN_ROOT/secrets"
API_DIR="$(dirname "$(realpath "$0")")/../agents/api"
RUNTIME_DIR="$(dirname "$(realpath "$0")")/../agents/runtime"

mkdir -p "$LOGS_DIR" "$BUILD_DIR"

echo "═══════════════════════════════════════════════════════"
echo " MiLyfe — Venture Titan Studio"
echo " Starting all services..."
echo "═══════════════════════════════════════════════════════"
echo ""

# ─── 1. Docker Infrastructure ────────────────────────────────────────────────
echo "→ [1/6] Starting Docker infrastructure..."
if [ -f "$TITAN_ROOT/docker-compose.yml" ]; then
    cd "$TITAN_ROOT"
    docker compose up -d 2>/dev/null && echo "  ✓ Docker stack running" || echo "  ⚠ Docker not available"
else
    echo "  ⚠ No docker-compose.yml found (dev mode)"
fi

# ─── 2. Refresh Mattermost Token ─────────────────────────────────────────────
echo "→ [2/6] Refreshing Mattermost bot token..."
if [ -f "$SCRIPTS_DIR/refresh-mm-token.sh" ]; then
    bash "$SCRIPTS_DIR/refresh-mm-token.sh" 2>/dev/null && echo "  ✓ Token refreshed" || echo "  ⚠ Token refresh failed"
else
    echo "  ⚠ refresh-mm-token.sh not found"
fi

# ─── 3. Agent Runtime ────────────────────────────────────────────────────────
echo "→ [3/6] Starting agent runtime..."
if [ -f "$RUNTIME_DIR/agent_runtime.py" ]; then
    cd "$RUNTIME_DIR"
    PYTHONUNBUFFERED=1 nohup python3 -u agent_runtime.py \
        > "$LOGS_DIR/agent-runtime.log" 2>&1 &
    echo $! > "$BUILD_DIR/runtime.pid"
    echo "  ✓ Agent runtime PID $(cat $BUILD_DIR/runtime.pid)"
else
    echo "  ⚠ agent_runtime.py not found"
fi

# ─── 4. Bridge API (port 8099) ───────────────────────────────────────────────
echo "→ [4/6] Starting Bridge API on port 8099..."
if [ -f "$API_DIR/agent_api.py" ]; then
    cd "$API_DIR"
    PYTHONUNBUFFERED=1 nohup python3 -u agent_api.py \
        > "$LOGS_DIR/bridge-api.log" 2>&1 &
    echo $! > "$BUILD_DIR/bridge-api.pid"
    echo "  ✓ Bridge API PID $(cat $BUILD_DIR/bridge-api.pid)"
else
    echo "  ⚠ agent_api.py not found at $API_DIR"
fi

# ─── 5. MiForge (Next.js on port 7800) ──────────────────────────────────────
echo "→ [5/6] Starting MiForge on port 7800..."
MIFORGE_DIR="$(dirname "$(realpath "$0")")/../../miforge"
if [ -f "$MIFORGE_DIR/package.json" ]; then
    cd "$MIFORGE_DIR"
    PYTHONUNBUFFERED=1 nohup npx next start -p 7800 \
        > "$LOGS_DIR/miforge.log" 2>&1 &
    echo $! > "$BUILD_DIR/miforge.pid"
    echo "  ✓ MiForge PID $(cat $BUILD_DIR/miforge.pid)"
else
    echo "  ⚠ MiForge app not found"
fi

# ─── 6. Health Verification ──────────────────────────────────────────────────
echo "→ [6/6] Verifying services (5s wait)..."
sleep 5

echo ""
echo "═══════════════════════════════════════════════════════"
echo ""
printf "  Bridge API (8099):  "
curl -sf http://localhost:8099/health > /dev/null && echo "✓ ONLINE" || echo "⚠ STARTING..."
printf "  MiForge (7800):     "
curl -sf http://localhost:7800 > /dev/null && echo "✓ ONLINE" || echo "⚠ STARTING..."
printf "  Mattermost (8065):  "
curl -sf http://localhost:8065/api/v4/system/ping > /dev/null && echo "✓ ONLINE" || echo "⚠ CHECK"
printf "  Ollama (11434):     "
curl -sf http://localhost:11434/api/tags > /dev/null && echo "✓ ONLINE" || echo "⚠ CHECK"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  🏛️  MiLyfe Unified Platform ONLINE"
echo ""
echo "  Public:    http://localhost:7800"
echo "  Bridge:    http://localhost:8099"
echo "  MM:        http://localhost:8065"
echo "  Grafana:   http://localhost:3004"
echo ""
echo "  Data:      SOVEREIGN (local hardware only)"
echo "  AI:        LOCAL (Ollama)"
echo "  Logs:      $LOGS_DIR/"
echo ""
echo "═══════════════════════════════════════════════════════"
