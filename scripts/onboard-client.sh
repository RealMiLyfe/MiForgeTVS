#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <client_name>"
  exit 1
fi

CLIENT_NAME=$1
GREEN='\033[0;32m'
NC='\033[0m'

echo "Onboarding client: $CLIENT_NAME"

# 1. Create directories
mkdir -p /opt/milyfe/clients/${CLIENT_NAME}/{incoming,processed,rejected,logs,ledger}
echo "  ✓ Directories created"

# 2. Create hledger journal
LEDGER_FILE="/opt/milyfe/clients/${CLIENT_NAME}/ledger/${CLIENT_NAME}.journal"
if [ ! -f "$LEDGER_FILE" ]; then
  cat > "$LEDGER_FILE" << LEDGER
; ${CLIENT_NAME} — MiLyfe VTS Ledger
; Managed by Calvin AR Lead

$(date +%Y-%m-%d) Opening Balance
    assets:checking    \$0.00
    equity:opening

LEDGER
fi
echo "  ✓ hledger journal created"

# 3. Get fresh Mattermost token
MM_TOKEN=$(curl -s -i -X POST http://localhost:8065/api/v4/users/login \
  -H "Content-Type: application/json" \
  -d '{"login_id":"support@milyfe.fun","password":"VentureTitan2026"}' \
  | grep -i "^token:" | awk '{print $2}' | tr -d '\r')
echo $MM_TOKEN > /opt/milyfe/secrets/mm-admin-token.txt
MM_TEAM_ID=$(cat /opt/milyfe/secrets/mm-team-id.txt)

# 4. Create Mattermost channel
CHANNEL_NAME="client-$(echo $CLIENT_NAME | tr '[:upper:]' '[:lower:]' | tr ' ' '-')"
CHANNEL_RESPONSE=$(curl -s -X POST http://localhost:8065/api/v4/channels \
  -H "Authorization: Bearer $MM_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"team_id\":\"$MM_TEAM_ID\",\"name\":\"$CHANNEL_NAME\",\"display_name\":\"Client $CLIENT_NAME\",\"type\":\"O\"}")

if echo "$CHANNEL_RESPONSE" | grep -q '"id"'; then
  CHANNEL_ID=$(echo "$CHANNEL_RESPONSE" | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])")
  echo "  ✓ Mattermost channel created: #$CHANNEL_NAME"
else
  # Channel may already exist
  CHANNEL_ID=$(curl -s "http://localhost:8065/api/v4/teams/$MM_TEAM_ID/channels/name/$CHANNEL_NAME" \
    -H "Authorization: Bearer $MM_TOKEN" | python3 -c "import json,sys; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)
  if [ -z "$CHANNEL_ID" ]; then
    echo "  ✗ Failed to create or find Mattermost channel"
    exit 1
  fi
  echo "  ~ Mattermost channel already exists: #$CHANNEL_NAME"
fi

# 5. Add forge bot to channel
FORGE_USER_ID=$(python3 -c "import json; d=json.load(open('/opt/milyfe/secrets/bot-tokens.json')); print(d['forge-supervisor']['user_id'])")
curl -s -X POST "http://localhost:8065/api/v4/channels/${CHANNEL_ID}/members" \
  -H "Authorization: Bearer $MM_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"$FORGE_USER_ID\"}" > /dev/null
echo "  ✓ Forge bot added to channel"

# 6. Post welcome message as forge
FORGE_TOKEN=$(python3 -c "import json; d=json.load(open('/opt/milyfe/secrets/bot-tokens.json')); print(d['forge-supervisor']['token'])")
RESULT=$(curl -s -X POST http://localhost:8065/api/v4/posts \
  -H "Authorization: Bearer $FORGE_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"channel_id\":\"$CHANNEL_ID\",\"message\":\"🚀 **$CLIENT_NAME is now onboarded to MiLyfe VTS.**\\n\\nYour dedicated AI crew is standing by:\\n- 📊 Calvin is watching your incoming folder\\n- 💰 Frank will generate financial reports\\n- 🔍 Serena is monitoring your market\\n\\nDrop any invoice into your incoming folder and the crew handles the rest.\"}")

if echo "$RESULT" | grep -q '"id"'; then
  echo "  ✓ Welcome message posted by Forge"
else
  echo "  ~ Welcome post issue: $(echo $RESULT | python3 -c 'import json,sys; print(json.load(sys.stdin).get(\"message\",\"unknown\"))' 2>/dev/null)"
fi

# 7. Create Chroma collection
curl -s -X DELETE \
  "http://localhost:8001/api/v2/tenants/default_tenant/databases/default_database/collections/client_${CLIENT_NAME}_knowledge" \
  2>/dev/null > /dev/null

CHROMA=$(curl -s -X POST \
  "http://localhost:8001/api/v2/tenants/default_tenant/databases/default_database/collections" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"client_${CLIENT_NAME}_knowledge\",\"metadata\":{\"client\":\"$CLIENT_NAME\",\"platform\":\"milyfe-vts\"}}")

if echo "$CHROMA" | grep -q '"id"'; then
  echo "  ✓ Chroma knowledge collection created"
else
  echo "  ~ Chroma: $(echo $CHROMA | python3 -c 'import json,sys; print(json.load(sys.stdin).get(\"message\",\"unknown\"))' 2>/dev/null)"
fi

# 8. Update clients registry
python3 << PYEOF
import json, os
from datetime import datetime
registry_path = '/opt/milyfe/secrets/clients.json'
clients = {}
if os.path.exists(registry_path):
    with open(registry_path) as f:
        clients = json.load(f)
clients['$CLIENT_NAME'] = {
    'client_name': '$CLIENT_NAME',
    'created_at': datetime.now().isoformat(),
    'mattermost_channel': '$CHANNEL_NAME',
    'channel_id': '$CHANNEL_ID',
    'chroma_collection': 'client_${CLIENT_NAME}_knowledge',
    'ledger': '$LEDGER_FILE',
    'active': True
}
with open(registry_path, 'w') as f:
    json.dump(clients, f, indent=2)
print('  ✓ Client registry updated')
PYEOF

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ $CLIENT_NAME onboarded successfully${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo "  Mattermost: #$CHANNEL_NAME"
echo "  Ledger:     $LEDGER_FILE"
echo "  Knowledge:  client_${CLIENT_NAME}_knowledge"
echo ""

