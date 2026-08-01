#!/usr/bin/env python3
"""Load campaign knowledge into ChromaDB using v2 API"""

import requests
import json
import uuid
import os

CHROMA = "http://localhost:8001"
OLLAMA = "http://localhost:11434/api/embeddings"
COLLECTION = "milyfe_campaign"

def get_embedding(text):
    try:
        r = requests.post(OLLAMA, json={
            "model": "nomic-embed-text",
            "prompt": text[:2000]
        })
        return r.json().get("embedding")
    except Exception as e:
        print(f"Embedding error: {e}")
        return None

def ensure_collection():
    # ChromaDB v2 API
    url = f"{CHROMA}/api/v2/tenants/default_tenant/databases/default_database/collections"
    try:
        # Check if exists
        r = requests.get(url)
        collections = r.json()
        names = [c.get('name') for c in collections] if isinstance(collections, list) else []
        
        if COLLECTION not in names:
            # Create it
            r = requests.post(url, json={"name": COLLECTION})
            print(f"✅ Collection created: {COLLECTION}")
        else:
            print(f"✅ Collection exists: {COLLECTION}")
        return True
    except Exception as e:
        print(f"Collection error: {e}")
        return False

def load_documents():
    campaign_dir = os.path.dirname(__file__) + '/campaign'
    
    if not ensure_collection():
        print("Cannot create collection — loading as files only")
        return
    
    # Get collection ID
    url = f"{CHROMA}/api/v2/tenants/default_tenant/databases/default_database/collections"
    r = requests.get(url)
    collections = r.json()
    collection_id = None
    for c in collections:
        if c.get('name') == COLLECTION:
            collection_id = c.get('id')
            break
    
    if not collection_id:
        print("Could not find collection ID")
        return

    docs_url = f"{CHROMA}/api/v2/tenants/default_tenant/databases/default_database/collections/{collection_id}/upsert"
    
    for filename in sorted(os.listdir(campaign_dir)):
        if not filename.endswith('.md'):
            continue
            
        filepath = os.path.join(campaign_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()
        
        embedding = get_embedding(content)
        doc_id = str(uuid.uuid4())
        
        payload = {
            "ids": [doc_id],
            "documents": [content],
            "metadatas": [{"source": filename, "type": "campaign"}]
        }
        
        if embedding:
            payload["embeddings"] = [embedding]
        
        try:
            r = requests.post(docs_url, json=payload)
            if r.status_code in [200, 201]:
                print(f"✅ Loaded: {filename}")
            else:
                print(f"⚠️  {filename}: {r.status_code} - {r.text[:100]}")
        except Exception as e:
            print(f"❌ {filename}: {e}")

    print("\n✅ Campaign knowledge loaded into ChromaDB")
    print("Agents can now query campaign context via RAG")

if __name__ == "__main__":
    load_documents()
