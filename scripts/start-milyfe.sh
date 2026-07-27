#!/bin/bash

# Create scripts directory if it doesn't exist
mkdir -p /opt/milyfe/scripts

# Start Docker Compose services
cd /opt/milyfe/docker && docker compose up -d milyfe-metabase milyfe-docuseal

# Check if Next.js is running on port 7800, start it if not
if ! curl -s http://localhost:7800 > /dev/null; then
  nohup npm run dev -- -p 7800 &
fi

# Check if agent runtime is running, start it if not
if ! pgrep -f "agent_runtime.py" > /dev/null; then
  python3 /opt/milyfe/agents/runtime/agent_runtime.py &
fi

# Refresh Mattermost token and save to /opt/milyfe/secrets/mm-admin-token.txt
MM_REFRESH_TOKEN=$(cat /opt/milyfe/secrets/mm-refresh-token.txt)
MM_RESPONSE=$(curl -s -X POST http://localhost:8065/api/v4/users/token \
  -H "Authorization: Bearer $MM_REFRESH_TOKEN" \
  -H "Content-Type: application/json")

if echo "$MM_RESPONSE" | grep -q '"token"'; then
  NEW_MM_TOKEN=$(echo "$MM_RESPONSE" | jq -r '.token')
  echo "$NEW_MM_TOKEN" > /opt/milyfe/secrets/mm-admin-token.txt
else
  echo "Failed to refresh Mattermost token"
  exit 1
fi

# Print status of all services
echo "Mattermost: $(curl -s http://localhost:8065/api/v4/system/ping | jq -r '.status')"
echo "Next.js: $(if curl -s http://localhost:7800 > /dev/null; then echo "Running"; else echo "Not Running"; fi)"
echo "Agent Runtime: $(if pgrep -f "agent_runtime.py" > /dev/null; then echo "Running"; else echo "Not Running"; fi)"

# Open http://localhost:7800 in browser
xdg-open http://localhost:7800
