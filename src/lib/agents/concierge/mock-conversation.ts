// Mock conversation templates for placeholder mode
// Covers the full arc: opening -> drill-down -> synthesis -> recommendation -> preview offer

const mockResponses: Record<string, string[]> = {
  opening: [
    "Hi — I'm the Forge Concierge. Before we talk about what MiForge could build for you, I'd rather understand your business first.\n\nWhat's going on that made you land here today?",
  ],
  early_drilldown: [
    "That's a common pattern — the work that made the business successful becomes the work that traps you inside it.\n\nWalk me through what a typical week actually looks like for you. Where does most of your time go?",
    "Interesting. So the bottleneck isn't the business model itself — it's operational capacity.\n\nWhat have you already tried to solve this? Hired? Outsourced? Automated anything?",
    "That makes sense. The challenge with hiring for this kind of work is that the training cycle is long and turnover is expensive.\n\nIf you woke up tomorrow and this was handled — what would you notice first? What would your day actually look like?",
  ],
  mid_conversation: [
    "I'm starting to see the shape of this. Let me ask one more thing — who else is affected when the customer service backlog builds up? Does it flow downstream into fulfillment or retention?",
    "That's the root of it, then. The surface problem is time, but the structural problem is that repetitive operational work is consuming the time you need for strategic decisions.\n\nHave you thought about what autonomous infrastructure could look like for your business specifically?",
    "Fair question. Let me be direct about what MiForge can and can't do.\n\nCan do: handle repetitive operational tasks autonomously — customer service, email campaigns, content creation, fulfillment monitoring, reporting. These agents operate 24/7 and improve over time.\n\nCan't do: replace creative judgment, strategic pivots, relationship-building with key partners, or high-context decisions that require your specific expertise.\n\nThe goal isn't to replace you. It's to remove the 60-70% of your week that shouldn't require you.",
  ],
  synthesis: [
    "Let me reflect back what I'm hearing.\n\nYou're running a growing business that's hit an operational ceiling. You're spending most of your week on repetitive tasks — customer inquiries, email follow-ups, content scheduling, order tracking. The business is profitable but you're the bottleneck.\n\nWhat you actually need isn't more hours. It's infrastructure that handles the repeatable layer so you can focus on growth, product, and the relationships that move the business forward.\n\nDoes that land?",
  ],
  recommendation: [
    "Based on what you've shared, here's what I'd recommend:\n\n**Standard Factory — 6 agents:**\n\n- Customer Service Agent — handles inbound queries and returns\n- Email Reactivation Agent — wins back dormant customers\n- Social Content Agent — creates platform-native content\n- Fulfillment Monitor — tracks orders and flags issues\n- Ops Reporting Agent — generates daily intelligence\n- SEO Refresh Agent — keeps your content ranking\n\n**Timeline:** 60-90 days to full autonomy\n**Tier:** Standard\n**Estimated reclaimed time:** 15-20 hours per week\n\nThis configuration targets the exact bottlenecks you described. Each agent is calibrated to your business context, brand voice, and platforms.\n\nWant me to generate a preview factory you can actually walk through? It takes about 60 seconds.",
  ],
  preview_offer: [
    "Based on what you've shared, I have a clear picture of what your factory could look like. I'll build a personalized preview you can walk through and interact with — real agents calibrated to your business context.\n\nTakes about 60 seconds. Ready?",
  ],
  pricing_response: [
    "MiForge uses a hybrid model:\n\n- **Forge fee** (one-time): covers building and calibrating your factory. Typically $2,500-$15,000 depending on scope.\n- **Monthly retainer**: keeps agents running, tuned, and supported. Ranges from $497-$2,997/mo depending on tier.\n- **Uplift share**: a percentage of measurable outcomes your factory produces. Typically 0-8%.\n\nThe alignment is deliberate — if your factory doesn't produce measurable results, we don't earn the uplift share. We only win when you win.\n\nBased on what you've described, you'd likely fall in the Standard tier range. Want me to be more specific?",
  ],
  not_a_fit: [
    "I want to be honest with you — based on what you're describing, MiForge might not be the right fit right now.\n\nYour business sounds like it needs foundational systems first — a proper CRM, defined processes, maybe a VA for the immediate term. Autonomous infrastructure works best when it's layered on top of existing operations, not built as the first system.\n\nThat said, I could be wrong. If you'd like to talk this through with a human operator who can assess more precisely, reach out to miforge@milyfe.fun.\n\nNo pressure at all. This conversation was worth having either way.",
  ],
  exploring: [
    "That's perfectly fine. There's no rush here.\n\nIf it helps, you can see what an actual factory looks like at /factory/derek-adams — it's a specimen showing the kind of infrastructure MiForge builds for a novelty ecommerce business.\n\nWhenever you're ready for a deeper conversation, I'll be here. Your session is saved so you can pick up where you left off.",
  ],
};

let messageCount = 0;

export function getMockConciergeResponse(userMessage: string): string {
  messageCount++;
  const msg = userMessage.toLowerCase();

  // Pricing questions
  if (msg.includes("price") || msg.includes("cost") || msg.includes("how much")) {
    return pickRandom(mockResponses.pricing_response);
  }

  // Just exploring
  if (msg.includes("just browsing") || msg.includes("just looking") || msg.includes("just exploring")) {
    return pickRandom(mockResponses.exploring);
  }

  // Preview request
  if (msg.includes("preview") || msg.includes("show me") || msg.includes("what would mine look like")) {
    return pickRandom(mockResponses.preview_offer);
  }

  // Progress through conversation arc based on message count
  if (messageCount <= 1) return pickRandom(mockResponses.opening);
  if (messageCount <= 3) return pickRandom(mockResponses.early_drilldown);
  if (messageCount <= 6) return pickRandom(mockResponses.mid_conversation);
  if (messageCount <= 8) return pickRandom(mockResponses.synthesis);
  return pickRandom(mockResponses.recommendation);
}

export function resetMockConversation(): void {
  messageCount = 0;
}

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}
