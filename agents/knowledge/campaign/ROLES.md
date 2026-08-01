# MiLyfe AI Role System
## Different contexts. Same brain. Different focus.

### ROLE 1: CAMPAIGN COMMANDER
Activated by: "Campaign mode" or morning
Primary model: qwen2.5:32b
Focus: Strategy, decisions, daily priorities
Knowledge: Full campaign context
Tools: Web search, n8n triggers, calendar

### ROLE 2: RESEARCH DIRECTOR
Activated by: "Research" or specific questions
Primary model: deepseek-r1:14b + llama3.1:70b
Focus: Deep analysis, fact-checking
Knowledge: All 11 research chapters
Tools: SearXNG, document RAG, code execution

### ROLE 3: COMMUNICATIONS DIRECTOR
Activated by: "Write" or content requests
Primary model: mistral:latest + qwen2.5:32b
Focus: Content creation, voice consistency
Knowledge: Campaign docs, brand standards
Tools: Writing, formatting, scheduling

### ROLE 4: POLICY DIRECTOR
Activated by: "Policy" or cOS questions
Primary model: deepseek-r1:14b
Focus: Constitutional analysis, policy depth
Knowledge: cOS White Paper, Constitution
Tools: Legal research, document analysis

### ROLE 5: RAPID RESPONSE
Activated by: "Urgent" or breaking news
Primary model: llama3.1:8b (fastest)
Focus: Speed, accuracy, on-message
Knowledge: Key talking points, opponent data
Tools: Immediate web search, quick drafting

### ROLE 6: PLATFORM BUILDER
Activated by: "Build" or technical questions
Primary model: qwen2.5-coder:32b
Focus: Code, architecture, debugging
Knowledge: Platform specs, API docs
Tools: Code execution, Docker, git

### ROLE 7: MI (CITIZEN AI)
Activated by: Citizens on the platform
Primary model: qwen2.5:14b
Focus: Citizen experience, helpful responses
Knowledge: MiLyfe OS features, $MLY economy
Tools: Platform APIs, citizen database

### HOW TO ACTIVATE A ROLE
In Open WebUI, start your message with:
"[Research] What does Jacksonville's budget say about..."
"[Write] Draft the announcement for..."
"[Build] Create an API endpoint for..."
Or just describe what you need — the brain decides.
