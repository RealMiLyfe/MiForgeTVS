# MiLyfe AI Memory System
## How the system remembers everything

### LAYER 1: CONVERSATION MEMORY
Location: Open WebUI database
Scope: Full history of every conversation
Access: Automatic in every response
Persistence: Until manually cleared

### LAYER 2: DOCUMENT RAG
Location: data/knowledge/
Files: All .md files in this folder
Access: Semantic search on any query
Persistence: Permanent (git tracked)

### LAYER 3: DATABASE MEMORY
Location: data/signups.db + data/milyfe.db
Scope: All citizens, wave codes, balances
Access: Via SQL queries in code execution
Persistence: Permanent

### LAYER 4: GIT MEMORY
Location: github.com/RealMiLyfe/MiCity
Scope: All code, docs, configs ever committed
Access: Via git log, git show
Persistence: Permanent (version controlled)

### LAYER 5: PLATFORM MEMORY
Location: Running services (Mastodon, Ghost etc.)
Scope: All posts, articles, social content
Access: Via service APIs
Persistence: Permanent on platform

### ADDING NEW MEMORIES
Any important decision, insight, or fact:
→ Add to data/knowledge/ as a .md file
→ Commit to GitHub
→ The brain knows it forever

### THE FOUNDING CONVERSATION
The entire conversation that created MiLyfe —
from the Growth Paradox research through
the presidential declaration through
the database seeding —
is saved in this system.
It is the founding record of the AI brain.
Everything started July 29, 2026.
More Perfect.
