#!/bin/bash

# Check if client name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <client_name>"
  exit 1
fi

CLIENT_NAME=$1

# Create directories
mkdir -p /opt/milyfe/clients/${CLIENT_NAME}/{incoming,processed,rejected,logs,ledger}

# Create hledger journal with opening balance entry
LEDGER_FILE="/opt/milyfe/clients/${CLIENT_NAME}/ledger/${CLIENT_NAME}.journal"
if [ ! -f "$LEDGER_FILE" ]; then
  echo "2023-10-01 Opening Balance" > "$LEDGER_FILE"
fi

# Create Mattermost channel
MM_TOKEN=$(cat /opt/milyfe/secrets/mm-admin-token.txt)
MM_TEAM_ID=$(cat /opt/milyfe/secrets/mm-team-id.txt)
CHANNEL_NAME="client-${CLIENT_NAME}"
CHANNEL_RESPONSE=$(curl -s -X POST http://localhost:8065/api/v4/channels \
  -H "Authorization: Bearer $MM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "team_id": "'$MM_TEAM_ID'",
    "name": "'$CHANNEL_NAME'",
    "display_name": "Client '$CLIENT_NAME'",
    "purpose": "Channel for client '$CLIENT_NAME'",
    "header": ""
  }')

if echo "$CHANNEL_RESPONSE" | grep -q '"id"'; then
  CHANNEL_ID=$(echo "$CHANNEL_RESPONSE" | jq -r '.id')
else
  echo "Failed to create Mattermost channel"
  exit 1
fi

# Create Chroma collection
COLLECTION_NAME="client_${CLIENT_NAME}_knowledge"
COLLECTION_RESPONSE=$(curl -s -X POST http://localhost:8001/api/v2/tenants/default_tenant/databases/default_database/collections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "'$COLLECTION_NAME'",
    "metadata": {"client": "milyfe-vts"}
  }')

if echo "$COLLECTION_RESPONSE" | grep -q '"id"'; then
  COLLECTION_ID=$(echo "$COLLECTION_RESPONSE" | jq -r '.id')
else
  echo "Failed to create Chroma collection"
  exit 1
fi

# Post welcome message to new channel as forge-supervisor bot
FORGE_TOKEN=$(jq -r '.forge-supervisor.token' /opt/milyfe/secrets/bot-tokens.json)
WELCOME_MESSAGE="Welcome to the client '$CLIENT_NAME' channel!"
curl -s -X POST http://localhost:8065/api/v4/posts \
  -H "Authorization: Bearer $FORGE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel_id": "'$CHANNEL_ID'",
    "message": "'$WELCOME_MESSAGE'"
  }'

# Print colored success summary
echo -e "\033[32mClient '$CLIENT_NAME' onboarding completed successfully.\033[0m"
