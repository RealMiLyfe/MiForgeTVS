// Agent mapping resolver: 32 catalog agents → 11 Titan senior agents

export interface SeniorAgent {
  name: string;
  displayName: string;
  ollamaModel: string | null;
  catalogAgentsManaged: string[];
}

const SENIOR_AGENTS: SeniorAgent[] = [
  { name: "forge", displayName: "Forge (Supervisor)", ollamaModel: null, catalogAgentsManaged: [] },
  { name: "calvin", displayName: "Calvin (Finance Lead)", ollamaModel: "qwen2.5-coder:14b", catalogAgentsManaged: ["customer_service", "fulfillment_monitor", "invoice_followup", "abandoned_cart_recovery"] },
  { name: "serena", displayName: "Serena (Research Lead)", ollamaModel: "qwen2.5-coder:14b", catalogAgentsManaged: ["seo_refresh", "lead_qualification", "influencer_outreach", "candidate_screening"] },
  { name: "frank", displayName: "Frank (Reporting Lead)", ollamaModel: "qwen2.5-coder:14b", catalogAgentsManaged: ["ops_reporting", "weekly_client_report", "financial_weekly_snapshot", "project_status_update"] },
  { name: "dex", displayName: "Dex (Ops Lead)", ollamaModel: "qwen2.5-coder:14b", catalogAgentsManaged: ["cold_outbound", "email_reactivation", "meeting_scheduling", "client_onboarding", "renewal_retention"] },
  { name: "lia", displayName: "Lia (Legal Lead)", ollamaModel: "qwen2.5-coder:14b", catalogAgentsManaged: ["contract_review", "proposal_generation", "deliverable_qa"] },
  { name: "ian", displayName: "Ian (Inventory Lead)", ollamaModel: "qwen2.5:7b", catalogAgentsManaged: ["product_launch", "expense_categorization"] },
  { name: "sam", displayName: "Sam (Support Lead)", ollamaModel: "qwen2.5:7b", catalogAgentsManaged: ["review_response", "onboarding_documentation"] },
  { name: "paula", displayName: "Paula (HR Lead)", ollamaModel: "qwen2.5-coder:14b", catalogAgentsManaged: ["interview_coordinator"] },
  { name: "iris", displayName: "Iris (Vision/OCR)", ollamaModel: "llava:13b", catalogAgentsManaged: [] },
  { name: "leo", displayName: "Leo (Learning/Retrospectives)", ollamaModel: "qwen2.5-coder:14b", catalogAgentsManaged: ["blog_content", "newsletter", "podcast_shownotes", "youtube_script", "ad_copy", "social_content"] },
];

// Catalog slug → Senior agent name
const CATALOG_TO_SENIOR: Record<string, string> = {};
SENIOR_AGENTS.forEach(senior => {
  senior.catalogAgentsManaged.forEach(slug => {
    CATALOG_TO_SENIOR[slug] = senior.name;
  });
});

export function resolveSeniorForCatalog(catalogSlug: string): string | null {
  return CATALOG_TO_SENIOR[catalogSlug] || null;
}

export function getCatalogsForSenior(seniorName: string): string[] {
  const senior = SENIOR_AGENTS.find(s => s.name === seniorName);
  return senior?.catalogAgentsManaged || [];
}

export function getSeniorAgent(name: string): SeniorAgent | undefined {
  return SENIOR_AGENTS.find(s => s.name === name);
}

export function getAllSeniorAgents(): SeniorAgent[] {
  return SENIOR_AGENTS;
}

export function getExecutionContext(catalogSlug: string, businessContext: {
  businessName: string;
  niche: string;
  platforms?: string[];
}): { seniorName: string; model: string | null; prompt: string } {
  const seniorName = resolveSeniorForCatalog(catalogSlug) || "forge";
  const senior = getSeniorAgent(seniorName);

  const prompt = `You are acting as the "${catalogSlug}" worker identity within the MiForge factory for ${businessContext.businessName} (${businessContext.niche}).

Your execution is handled by ${senior?.displayName || "Forge"} using the ${senior?.ollamaModel || "default"} model on sovereign hardware.

Business context:
- Business: ${businessContext.businessName}
- Niche: ${businessContext.niche}
- Platforms: ${businessContext.platforms?.join(", ") || "N/A"}

Execute the task as the catalog identity while leveraging the senior agent's full capabilities.`;

  return { seniorName, model: senior?.ollamaModel || null, prompt };
}
