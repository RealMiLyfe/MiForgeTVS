// MiLyfe: Venture Titan Studio - Complete Build Specification

export interface TaskData {
  taskNumber: string;
  description: string;
}

export interface HealthCheckData {
  checkName: string;
  description: string;
}

export interface PhaseData {
  phaseNumber: number;
  name: string;
  target: string;
  tasks: TaskData[];
  healthChecks: HealthCheckData[];
}

export interface AgentData {
  agentNumber: number;
  name: string;
  codeName: string;
  role: string;
  model: string;
  mattermostBot: string;
  tools: string[];
  hardRules: string[];
}

export interface WorkflowData {
  workflowNumber: number;
  name: string;
  description: string;
  trigger: string;
}

export interface ServiceData {
  name: string;
  port: number;
  category: string;
  description: string;
}

export interface ChannelData {
  name: string;
  description: string;
  category: string;
}

export const phasesData: PhaseData[] = [
  {
    phaseNumber: 1,
    name: "FOUNDATION LAYER",
    target: "Core infrastructure running and healthy",
    tasks: [
      { taskNumber: "1.1", description: "Create directory structure (/opt/milyfe/ with all subdirectories)" },
      { taskNumber: "1.2", description: "Install and configure Docker + Compose" },
      { taskNumber: "1.3", description: "Install and configure ROCm for RX 7900 XTX" },
      { taskNumber: "1.4", description: "Verify Ollama is running and all models respond" },
      { taskNumber: "1.5", description: "Set up HashiCorp Vault for secrets management" },
      { taskNumber: "1.6", description: "Initialize build state tracking system" },
      { taskNumber: "1.7", description: "Set up automated backup schedule" },
    ],
    healthChecks: [
      { checkName: "directories", description: "All directories exist with correct permissions" },
      { checkName: "docker", description: "Docker daemon running" },
      { checkName: "rocm", description: "ROCm detecting GPU correctly" },
      { checkName: "ollama", description: "Ollama responds to API ping on port 11434" },
      { checkName: "models", description: "All 5 models respond to test prompt" },
      { checkName: "vault", description: "Vault initialized and unsealed" },
      { checkName: "state", description: "state.json readable and writable" },
    ],
  },
  {
    phaseNumber: 2,
    name: "VECTOR MEMORY LAYER",
    target: "Persistent memory system for all agents",
    tasks: [
      { taskNumber: "2.1", description: "Deploy Chroma vector database (Docker)" },
      { taskNumber: "2.2", description: "Deploy mem0 memory layer" },
      { taskNumber: "2.3", description: "Configure nomic-embed-text as embedding model" },
      { taskNumber: "2.4", description: "Deploy AnythingLLM with Ollama connection" },
      { taskNumber: "2.5", description: "Create agent knowledge collections (7 collections)" },
      { taskNumber: "2.6", description: "Ingest base knowledge documents" },
      { taskNumber: "2.7", description: "Configure LanceDB as secondary vector store" },
      { taskNumber: "2.8", description: "Test semantic search across all collections" },
    ],
    healthChecks: [
      { checkName: "chroma", description: "Chroma API responds on port 8000" },
      { checkName: "mem0", description: "mem0 API responds" },
      { checkName: "anythingllm", description: "AnythingLLM UI loads on port 3001" },
      { checkName: "collections", description: "All 7 collections exist with document count > 0" },
      { checkName: "search", description: "Semantic search returns relevant results" },
      { checkName: "embedding", description: "Embedding model processes test document" },
      { checkName: "persistence", description: "Memory persistence survives container restart" },
    ],
  },
  {
    phaseNumber: 3,
    name: "COMMUNICATION HUB LAYER",
    target: "Mattermost running as the agent Slack",
    tasks: [
      { taskNumber: "3.1", description: "Deploy Mattermost server (Docker)" },
      { taskNumber: "3.2", description: "Configure PostgreSQL backend for Mattermost" },
      { taskNumber: "3.3", description: "Create MiLyfe workspace" },
      { taskNumber: "3.4", description: "Create channel structure (14 channels)" },
      { taskNumber: "3.5", description: "Create bot accounts for each agent (11 bots)" },
      { taskNumber: "3.6", description: "Configure bot API tokens (stored in Vault)" },
      { taskNumber: "3.7", description: "Set up webhook integrations" },
      { taskNumber: "3.8", description: "Configure notification routing rules" },
    ],
    healthChecks: [
      { checkName: "mattermost", description: "Mattermost loads on port 8065" },
      { checkName: "channels", description: "All 14 channels exist" },
      { checkName: "bots", description: "All 11 bot accounts created and active" },
      { checkName: "messaging", description: "Test message posts successfully from each bot" },
      { checkName: "webhooks", description: "Webhooks receive and route correctly" },
      { checkName: "approvals", description: "Human approval channel pinged with test item" },
    ],
  },
  {
    phaseNumber: 4,
    name: "ACCOUNTING & ERP BACKEND LAYER",
    target: "ERPNext running as business data backbone",
    tasks: [
      { taskNumber: "4.1", description: "Deploy ERPNext (Docker Compose)" },
      { taskNumber: "4.2", description: "Configure MariaDB backend" },
      { taskNumber: "4.3", description: "Set up MiLyfe company profile" },
      { taskNumber: "4.4", description: "Configure Chart of Accounts (standard SMB structure)" },
      { taskNumber: "4.5", description: "Set up invoice templates" },
      { taskNumber: "4.6", description: "Configure payment terms (Net-30 default)" },
      { taskNumber: "4.7", description: "Set up vendor management module" },
      { taskNumber: "4.8", description: "Configure expense categories (7 categories)" },
      { taskNumber: "4.9", description: "Deploy Akaunting as lightweight alternative" },
      { taskNumber: "4.10", description: "Configure ERPNext REST API access" },
      { taskNumber: "4.11", description: "Set up automated transaction categorization rules" },
      { taskNumber: "4.12", description: "Configure hledger for plaintext accounting backup" },
      { taskNumber: "4.13", description: "Set up invoice2data for PDF invoice parsing" },
      { taskNumber: "4.14", description: "Configure PaddleOCR for receipt scanning" },
    ],
    healthChecks: [
      { checkName: "erpnext", description: "ERPNext loads on port 8080" },
      { checkName: "api", description: "API returns valid JSON on test endpoint" },
      { checkName: "coa", description: "Chart of Accounts has minimum 40 categories" },
      { checkName: "invoice", description: "Test invoice creates and saves successfully" },
      { checkName: "vendor", description: "Test vendor creates and saves successfully" },
      { checkName: "ocr", description: "OCR processes test receipt image correctly" },
      { checkName: "invoice2data", description: "invoice2data extracts fields from test PDF" },
      { checkName: "hledger", description: "hledger reads and validates test ledger file" },
    ],
  },
  {
    phaseNumber: 5,
    name: "AGENT CREW LAYER",
    target: "All 11 agents defined, configured, running",
    tasks: [
      { taskNumber: "5.1", description: "Generate all 11 identity documents" },
      { taskNumber: "5.2", description: "Configure all system prompts" },
      { taskNumber: "5.3", description: "Connect all agents to Mattermost bots" },
      { taskNumber: "5.4", description: "Configure all tool belt connections" },
      { taskNumber: "5.5", description: "Set up agent memory namespaces" },
      { taskNumber: "5.6", description: "Configure confidence scoring system" },
      { taskNumber: "5.7", description: "Configure four-tier action classification" },
      { taskNumber: "5.8", description: "Test each agent with 5 sample tasks" },
      { taskNumber: "5.9", description: "Verify escalation routing works end to end" },
    ],
    healthChecks: [
      { checkName: "agents", description: "All 11 agents respond to test prompts" },
      { checkName: "posting", description: "Each agent posts correctly to its channel" },
      { checkName: "confidence", description: "Confidence scoring returns tier classification" },
      { checkName: "escalation", description: "Escalation routes correctly to #human-approvals" },
      { checkName: "memory", description: "Memory persists between agent calls" },
      { checkName: "tools", description: "Tool connections return valid responses" },
    ],
  },
  {
    phaseNumber: 6,
    name: "AUTOMATION & WORKFLOW LAYER",
    target: "n8n running all business workflows",
    tasks: [
      { taskNumber: "6.1", description: "Deploy n8n (Docker)" },
      { taskNumber: "6.2", description: "Build Workflow 1: Daily 7am Standup" },
      { taskNumber: "6.3", description: "Build Workflow 2: Invoice Watch" },
      { taskNumber: "6.4", description: "Build Workflow 3: Payment Chase" },
      { taskNumber: "6.5", description: "Build Workflow 4: Weekly Retrospective" },
      { taskNumber: "6.6", description: "Build Workflow 5: Vendor Email Handler" },
      { taskNumber: "6.7", description: "Build Workflow 6: New Client Onboarding" },
      { taskNumber: "6.8", description: "Build Workflow 7: Research Alert" },
      { taskNumber: "6.9", description: "Build Workflow 8: Monthly Business Review" },
      { taskNumber: "6.10", description: "Configure all workflow error handlers" },
      { taskNumber: "6.11", description: "Set up workflow execution logging" },
      { taskNumber: "6.12", description: "Test all 8 workflows end to end" },
    ],
    healthChecks: [
      { checkName: "n8n", description: "n8n loads on port 5678" },
      { checkName: "workflows", description: "All 8 workflows exist and are active" },
      { checkName: "execution", description: "Each workflow executes without errors on test" },
      { checkName: "logging", description: "Workflow logs are being written" },
      { checkName: "errors", description: "Error notifications route to #error-log" },
    ],
  },
  {
    phaseNumber: 7,
    name: "UI & DASHBOARD LAYER",
    target: "Human operator dashboard fully functional",
    tasks: [
      { taskNumber: "7.1", description: "Configure OpenWebUI as primary LLM interface (port 3000)" },
      { taskNumber: "7.2", description: "Deploy Metabase for business intelligence (port 3002)" },
      { taskNumber: "7.3", description: "Deploy Grafana for system monitoring (port 3003)" },
      { taskNumber: "7.4", description: "Deploy Prometheus for metrics collection" },
      { taskNumber: "7.5", description: "Configure Langfuse for agent observability (port 3004)" },
      { taskNumber: "7.6", description: "Configure Flowise as visual agent builder (port 3005)" },
      { taskNumber: "7.7", description: "Build Morning Brief dashboard in Metabase (7 panels)" },
      { taskNumber: "7.8", description: "Build System Health dashboard in Grafana (6 panels)" },
      { taskNumber: "7.9", description: "Configure approval queue in Mattermost" },
      { taskNumber: "7.10", description: "Set up Gotify for mobile notifications" },
    ],
    healthChecks: [
      { checkName: "openwebui", description: "OpenWebUI loads and connects to all models" },
      { checkName: "metabase", description: "Metabase loads and shows live ERPNext data" },
      { checkName: "grafana", description: "Grafana shows live system metrics" },
      { checkName: "langfuse", description: "Langfuse captures agent traces" },
      { checkName: "flowise", description: "Flowise loads and connects to Ollama" },
      { checkName: "morning_brief", description: "Morning Brief dashboard renders correctly" },
      { checkName: "system_health", description: "System Health dashboard renders correctly" },
      { checkName: "approval_queue", description: "Approval queue test item shows and responds" },
      { checkName: "gotify", description: "Gotify delivers test push notification" },
    ],
  },
  {
    phaseNumber: 8,
    name: "SECURITY & AUDIT LAYER",
    target: "All data protected, all actions auditable",
    tasks: [
      { taskNumber: "8.1", description: "Configure data classification tagging" },
      { taskNumber: "8.2", description: "Set up encrypted client namespace isolation" },
      { taskNumber: "8.3", description: "Configure audit log for all agent actions" },
      { taskNumber: "8.4", description: "Set up Keycloak or Authentik for SSO" },
      { taskNumber: "8.5", description: "Configure network isolation (Docker networks)" },
      { taskNumber: "8.6", description: "Set up automated backup with encryption" },
      { taskNumber: "8.7", description: "Configure Vault for all credential storage" },
      { taskNumber: "8.8", description: "Set up fail2ban for API endpoint protection" },
      { taskNumber: "8.9", description: "Configure HTTPS with Caddy for all services" },
      { taskNumber: "8.10", description: "Document the Zero Cloud Guarantee" },
    ],
    healthChecks: [
      { checkName: "https", description: "All services behind HTTPS" },
      { checkName: "vault", description: "Vault unseals on startup" },
      { checkName: "audit", description: "Audit log records test agent action" },
      { checkName: "backup", description: "Backup runs successfully and is encrypted" },
      { checkName: "isolation", description: "Client namespaces cannot read each other's data" },
      { checkName: "sso", description: "SSO login works for human operator" },
      { checkName: "fail2ban", description: "Fail2ban active on all public endpoints" },
    ],
  },
  {
    phaseNumber: 9,
    name: "LEARNING & FLYWHEEL LAYER",
    target: "System gets smarter from every correction",
    tasks: [
      { taskNumber: "9.1", description: "Deploy Argilla for dataset management" },
      { taskNumber: "9.2", description: "Configure Leo to watch all error logs" },
      { taskNumber: "9.3", description: "Set up correction capture workflow" },
      { taskNumber: "9.4", description: "Set up MLflow for experiment tracking" },
      { taskNumber: "9.5", description: "Configure weekly prompt regression testing" },
      { taskNumber: "9.6", description: "Set up Axolotl for future fine-tuning" },
      { taskNumber: "9.7", description: "Deploy deepeval for agent output evaluation" },
      { taskNumber: "9.8", description: "Configure RAGAS for RAG quality scoring" },
      { taskNumber: "9.9", description: "Set up the proprietary dataset structure" },
    ],
    healthChecks: [
      { checkName: "argilla", description: "Argilla loads and accepts test annotation" },
      { checkName: "leo", description: "Leo processes test error log correctly" },
      { checkName: "correction", description: "Correction workflow runs end to end" },
      { checkName: "mlflow", description: "MLflow records test experiment" },
      { checkName: "deepeval", description: "deepeval scores test agent output" },
      { checkName: "flywheel", description: "Flywheel directory structure exists and writable" },
      { checkName: "versioning", description: "Version history shows initial commit" },
    ],
  },
  {
    phaseNumber: 10,
    name: "INTEGRATION & FINAL VALIDATION",
    target: "All systems connected and working as one",
    tasks: [
      { taskNumber: "10.1", description: "Run full end-to-end scenario test: New invoice arrives" },
      { taskNumber: "10.2", description: "Run multi-agent collaboration test: Vendor contract" },
      { taskNumber: "10.3", description: "Run learning loop test: Calvin categorization correction" },
      { taskNumber: "10.4", description: "Generate completion report" },
      { taskNumber: "10.5", description: "Post completion report to #build-log" },
      { taskNumber: "10.6", description: "Notify human operator that system is live" },
    ],
    healthChecks: [
      { checkName: "scenario1", description: "Invoice scenario passes completely (under 3 min)" },
      { checkName: "scenario2", description: "Vendor contract scenario passes (under 5 min)" },
      { checkName: "scenario3", description: "Learning loop scenario passes (under 24 hr)" },
      { checkName: "report", description: "Completion report generated and posted" },
      { checkName: "phases", description: "All 10 phases show STATUS: COMPLETE" },
      { checkName: "errors", description: "Zero unresolved errors in error.log" },
      { checkName: "notification", description: "Human operator receives final notification" },
    ],
  },
];

export const agentsData: AgentData[] = [
  {
    agentNumber: 1,
    name: "Forge",
    codeName: "FORGE",
    role: "Supervisor - Reads all pod outputs, routes tasks, identifies conflicts, escalates to human",
    model: "qwen2.5:32b",
    mattermostBot: "@forge-supervisor",
    tools: ["All channel read access", "state.json", "task queue manager"],
    hardRules: [
      "Never override a human decision",
      "Always log delegation reasoning",
      "Escalate anything touching >$500",
    ],
  },
  {
    agentNumber: 2,
    name: "Calvin",
    codeName: "CALVIN",
    role: "AR Lead - Invoice generation, payment chasing, transaction categorization, reconciliation",
    model: "qwen2.5:14b",
    mattermostBot: "@calvin-ar",
    tools: ["ERPNext API", "email sender", "accounting knowledge base"],
    hardRules: [
      "Never send payment instructions without document match",
      "Flag all transactions over $500 to human",
      "Never close reconciliation with unmatched items",
    ],
  },
  {
    agentNumber: 3,
    name: "Frank",
    codeName: "FRANK",
    role: "Finance Pod Lead - Financial reporting, budget monitoring, cash flow analysis, monthly summaries",
    model: "qwen2.5:32b",
    mattermostBot: "@frank-finance",
    tools: ["ERPNext API", "hledger", "report generator"],
    hardRules: [
      "Monthly report requires human sign-off",
      "Flag any expense category spike over 20%",
    ],
  },
  {
    agentNumber: 4,
    name: "Serena",
    codeName: "SERENA",
    role: "Research Lead - Competitive intelligence, market research, pricing analysis, trend monitoring",
    model: "qwen2.5:14b",
    mattermostBot: "@serena-research",
    tools: ["Playwright browser", "web scraper", "research knowledge base"],
    hardRules: [
      "No data fabrication — cite sources always",
      "Flag unverifiable claims before reporting",
    ],
  },
  {
    agentNumber: 5,
    name: "Dex",
    codeName: "DEX",
    role: "Operations Lead - Vendor email drafting, negotiation support, scheduling, contract first drafts",
    model: "qwen2.5:14b",
    mattermostBot: "@dex-ops",
    tools: ["Email", "calendar", "contract templates", "vendor knowledge base"],
    hardRules: [
      "All contracts flagged to Lia for review",
      "Never commit to terms without human approval",
    ],
  },
  {
    agentNumber: 6,
    name: "Paula",
    codeName: "PAULA",
    role: "Payroll Lead - Payroll calculations, contractor payments, payroll schedule management",
    model: "qwen2.5:14b",
    mattermostBot: "@paula-payroll",
    tools: ["ERPNext Payroll module", "hledger"],
    hardRules: [
      "Every payroll run requires human approval",
      "Never process payment without signed timesheet",
    ],
  },
  {
    agentNumber: 7,
    name: "Lia",
    codeName: "LIA",
    role: "Legal & Contracts - NDA drafting, contract review, compliance flagging, legal risk assessment",
    model: "deepseek-r1:14b",
    mattermostBot: "@lia-legal",
    tools: ["Contract template library", "legal knowledge base", "document generator"],
    hardRules: [
      "Always flag — never give legal advice",
      "Flag any clause with liability implications",
      "All documents marked DRAFT until human approves",
    ],
  },
  {
    agentNumber: 8,
    name: "Ian",
    codeName: "IAN",
    role: "Inventory Lead - Stock level monitoring, reorder alerts, POS reconciliation, vendor restocking",
    model: "qwen2.5:7b",
    mattermostBot: "@ian-inventory",
    tools: ["ERPNext Inventory", "POS connectors"],
    hardRules: [
      "Never place reorder without human approval",
      "Flag discrepancies over 5% immediately",
    ],
  },
  {
    agentNumber: 9,
    name: "Sam",
    codeName: "SAM",
    role: "Support Lead - Tier-1 customer support, ticket routing, complaint classification, response drafting",
    model: "qwen2.5:7b",
    mattermostBot: "@sam-support",
    tools: ["Email", "support ticket system", "FAQ base"],
    hardRules: [
      "Never make refund commitments",
      "Escalate all complaints with legal language",
      "Response drafts only — human sends externally",
    ],
  },
  {
    agentNumber: 10,
    name: "Iris",
    codeName: "IRIS",
    role: "Vision & OCR Lead - Receipt/invoice scanning, document type classification, data extraction",
    model: "llava:13b",
    mattermostBot: "@iris-vision",
    tools: ["PaddleOCR", "pytesseract", "doctr", "watch folder"],
    hardRules: [
      "Flag low-confidence extractions (below 80%)",
      "Always output structured JSON, never free text",
    ],
  },
  {
    agentNumber: 11,
    name: "Leo",
    codeName: "LEO",
    role: "Learning Lead - Error log analysis, correction capture, knowledge base updates, weekly retrospective",
    model: "qwen2.5-coder:32b",
    mattermostBot: "@leo-learning",
    tools: ["All log files", "knowledge base writer", "Argilla dataset manager"],
    hardRules: [
      "Never update prompts without human approval",
      "All knowledge updates versioned and reversible",
      "Weekly retrospective posted every Friday 5pm",
    ],
  },
];

export const workflowsData: WorkflowData[] = [
  {
    workflowNumber: 1,
    name: "Daily 7am Standup",
    description: "Each pod lead posts status, Forge creates daily brief, human gets digest",
    trigger: "Cron 7:00am",
  },
  {
    workflowNumber: 2,
    name: "Invoice Watch",
    description: "New file → Iris OCR → Calvin categorizes → ERPNext record → Human approval if >$500",
    trigger: "New file in /data/incoming",
  },
  {
    workflowNumber: 3,
    name: "Payment Chase",
    description: "Check overdue invoices → Draft follow-up emails (day 7, 14, 30) → Post for review",
    trigger: "Cron daily 9am",
  },
  {
    workflowNumber: 4,
    name: "Weekly Retrospective",
    description: "Leo pulls logs → Classifies errors → Generates report → Posts to channel",
    trigger: "Cron Friday 5pm",
  },
  {
    workflowNumber: 5,
    name: "Vendor Email Handler",
    description: "New [vendor] email → Dex classifies → Drafts response → Human approves",
    trigger: "New email tagged [vendor]",
  },
  {
    workflowNumber: 6,
    name: "New Client Onboarding",
    description: "Create namespace → Ingest docs → Create channel → Run 2-week shadow mode",
    trigger: "Manual or form submission",
  },
  {
    workflowNumber: 7,
    name: "Research Alert",
    description: "Serena runs competitive scan → Posts summary → Flags significant changes",
    trigger: "Cron weekly Monday 8am",
  },
  {
    workflowNumber: 8,
    name: "Monthly Business Review",
    description: "Frank P&L → Serena snapshot → Dex vendor calendar → Combined report",
    trigger: "Cron 1st of month 9am",
  },
];

export const servicesData: ServiceData[] = [
  { name: "Ollama", port: 11434, category: "LLM", description: "Local LLM serving" },
  { name: "OpenWebUI", port: 3000, category: "UI", description: "Primary LLM interface" },
  { name: "AnythingLLM", port: 3022, category: "RAG", description: "RAG and knowledge management" },
  { name: "Metabase", port: 3002, category: "UI", description: "Business intelligence dashboard" },
  { name: "Grafana", port: 3003, category: "Monitoring", description: "System monitoring" },
  { name: "Langfuse", port: 3004, category: "Observability", description: "Agent observability" },
  { name: "Flowise", port: 3005, category: "UI", description: "Visual agent builder" },
  { name: "n8n", port: 5678, category: "Automation", description: "Workflow automation" },
  { name: "Chroma", port: 8000, category: "Vector DB", description: "Vector database" },
  { name: "Mattermost", port: 8065, category: "Communication", description: "Team chat hub" },
  { name: "ERPNext", port: 8080, category: "ERP", description: "Business data backbone" },
  { name: "Vault", port: 8200, category: "Security", description: "Secrets management" },
  { name: "Prometheus", port: 9090, category: "Monitoring", description: "Metrics collection" },
  { name: "Argilla", port: 6900, category: "Learning", description: "Dataset management" },
  { name: "MLflow", port: 5000, category: "Learning", description: "Experiment tracking" },
  { name: "Gotify", port: 8070, category: "Notifications", description: "Push notifications" },
  { name: "Keycloak", port: 8443, category: "Security", description: "SSO authentication" },
  { name: "Akaunting", port: 8081, category: "ERP", description: "Accounting and invoicing backend" },
];

export const channelsData: ChannelData[] = [
  { name: "daily-ops", description: "Daily operations and briefings", category: "Operations" },
  { name: "finance-desk", description: "Finance team communications", category: "Finance" },
  { name: "research-desk", description: "Research and intelligence", category: "Research" },
  { name: "operations-desk", description: "Vendor and operations", category: "Operations" },
  { name: "hr-desk", description: "HR and payroll communications", category: "HR" },
  { name: "support-desk", description: "Customer support queue", category: "Support" },
  { name: "build-log", description: "Build progress and deployment logs", category: "System" },
  { name: "error-log", description: "Error notifications and alerts", category: "System" },
  { name: "learning-log", description: "Learning and improvement logs", category: "Learning" },
  { name: "human-approvals", description: "Items requiring human approval", category: "Approvals" },
  { name: "agent-standup", description: "Daily agent status updates", category: "Operations" },
  { name: "weekly-retrospective", description: "Weekly review and improvements", category: "Learning" },
  { name: "partner-reports", description: "Partner and client reports", category: "Reports" },
  { name: "milyfe-demo", description: "Example client channel", category: "Clients" },
];
