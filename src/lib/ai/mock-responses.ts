// Pre-written mock responses for placeholder mode
// Streams character-by-character to simulate real AI

const responses: Record<string, string[]> = {
  customer_service: [
    "I'd be happy to help you with that! Let me look into your order status. Based on what I can see, your order #4521 shipped yesterday and should arrive within 2-3 business days. I've sent you a tracking link to your email. Is there anything else I can assist you with?",
    "I understand your frustration with the delayed delivery. I've escalated this to our fulfillment team and added a priority flag. You should receive an updated tracking notification within the next few hours. As a gesture of goodwill, I've also applied a 15% discount code to your account for your next order.",
    "Thank you for reaching out! I can see your return request has been approved. You'll receive a prepaid shipping label at your email address within the next 30 minutes. Once we receive the item, your refund will be processed within 3-5 business days.",
  ],
  email_reactivation: [
    "Here's a win-back email sequence I've drafted for the churned segment:\n\n**Subject: We miss you (and we made something new)**\n\nHey {{first_name}},\n\nIt's been a while since your last order, and honestly? We noticed. Not in a creepy way — in a 'we genuinely hope you're doing well' way.\n\nSince you've been gone, we launched 3 new products that match your previous purchases perfectly. Here's a quick peek:\n\n• [Product 1] — 20% off for returning customers\n• [Product 2] — New arrival, limited edition\n\nNo pressure. Just wanted you to know the door's open.\n\n[Come back and browse →]",
    "I've analyzed your churned customer segment and here's my recommendation:\n\n**Segment size:** 847 customers\n**Last active:** 60-90 days ago\n**Avg. previous LTV:** $127\n\n**Recommended approach:** 3-email sequence over 10 days\n- Email 1 (Day 1): Soft re-engagement, no offer\n- Email 2 (Day 4): Product showcase + social proof\n- Email 3 (Day 10): Exclusive offer, urgency element\n\nShall I draft all three emails?",
  ],
  social_content: [
    "Here's your TikTok content calendar for this week:\n\n**Monday:** Behind-the-scenes packaging video — hook: 'POV: You ordered from a small business that actually cares'\n\n**Wednesday:** Product feature with trending audio — showcase the new collection with that viral 'before/after' transition\n\n**Friday:** Customer testimonial + UGC reshare — pair with engagement question: 'Tell us your favorite way to use [product]'\n\nAll formatted for vertical video. Want me to write the full scripts?",
    "I've created 5 Instagram carousel posts for your upcoming launch:\n\n**Post 1:** Problem → Solution format\n- Slide 1: Bold statement about the problem\n- Slides 2-4: How your product solves it\n- Slide 5: CTA with launch date\n\nCaption: \"Everyone said [pain point] was just part of the job. We said no. 🫡 Launching [date] — link in bio to get early access.\"\n\nHashtags: #smallbusiness #newlaunch #entrepreneurlife",
  ],
  seo_refresh: [
    "I've completed an SEO audit of your top 10 pages. Here's the summary:\n\n**Pages needing immediate attention:**\n1. /products/main-collection — Missing H1, thin content (320 words)\n2. /about — No internal links, missing meta description\n3. /blog/starter-guide — Keyword cannibalization with /faq\n\n**Quick wins (implement today):**\n- Add schema markup to product pages (+15-20% CTR potential)\n- Merge /blog/starter-guide into /faq (eliminate cannibalization)\n- Update title tags on top 5 pages with 2024 modifiers\n\nShall I rewrite the content for page #1?",
  ],
  fulfillment_monitor: [
    "⚠️ **Fulfillment Alert — 2 Issues Detected**\n\n1. **Order #8842** — Carrier scan shows 'exception' status. Package appears stuck at regional hub for 48+ hours. I've proactively sent the customer a notification with an updated ETA and offered free expedited reshipping if it doesn't move by tomorrow.\n\n2. **Order #8856** — Address validation failed. Customer entered incomplete zip code. I've sent a friendly email requesting the correct address before we ship.\n\nAll other 34 orders from today are on track. Next carrier pickup in 2 hours.",
  ],
  ops_reporting: [
    "📊 **Daily Operations Report — June 15, 2025**\n\n**Revenue:** $4,280 (+8% vs. last week)\n**Orders:** 47 (avg. order value: $91)\n**Customer Service:** 12 tickets resolved, 0 escalations\n**Email:** Win-back campaign sent to 45 contacts (32% open rate)\n**Social:** 3 posts published, 2.4K total impressions\n**Fulfillment:** 41/47 orders shipped same-day (87% rate)\n\n**Anomaly detected:** Cart abandonment rate spiked to 72% between 2-4pm. Possible site performance issue. Recommend investigating.\n\n**Action items generated:** 3\nShall I break these down?",
  ],
  default: [
    "I'm here to help! Based on your factory's configuration, I can assist with a variety of tasks. Could you tell me more about what you'd like me to work on? I can handle anything from content creation to operational analysis, customer communications, or process automation.",
    "Great question! Let me analyze that for you. Based on the data I have access to, here's what I recommend:\n\n1. Focus on the highest-impact area first\n2. Set up automated monitoring for key metrics\n3. Create a feedback loop to track improvements\n\nWould you like me to elaborate on any of these points or take action on one of them?",
  ],
};

export function getMockResponse(agentSlug: string, _message: string): string {
  const pool = responses[agentSlug] || responses.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function* streamMockResponse(text: string): AsyncGenerator<string> {
  const chars = text.split("");
  for (const char of chars) {
    await new Promise((resolve) => setTimeout(resolve, 25 + Math.random() * 15));
    yield char;
  }
}
