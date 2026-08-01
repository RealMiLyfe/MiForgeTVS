#!/usr/bin/env python3
"""
Load all campaign knowledge into ChromaDB memory
so all 11 agents can access it via RAG
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)) + '/memory')
from memory_manager import MemoryManager

mm = MemoryManager()

# Load all campaign documents
campaign_dir = os.path.dirname(__file__) + '/campaign'

for filename in os.listdir(campaign_dir):
    if filename.endswith('.md'):
        filepath = os.path.join(campaign_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Store in ChromaDB under campaign collection
        mm.store_client_memory(
            client_slug='milyfe-campaign',
            agent_name='system',
            action_type='knowledge-load',
            content=content,
            metadata={
                'source': filename,
                'type': 'campaign-knowledge',
                'loaded': '2026-08-01'
            }
        )
        print(f"✅ Loaded: {filename}")

print("\n✅ All campaign knowledge loaded into ChromaDB")
print("All 11 agents now have campaign context via RAG")
