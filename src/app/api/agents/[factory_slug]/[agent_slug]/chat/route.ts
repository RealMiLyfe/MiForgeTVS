import { NextResponse } from "next/server";
import { generateAgentResponse } from "@/lib/ai/client";
import { checkRateLimit, getRateLimitMessage } from "@/lib/ai/rate-limit";
import { mockFactories, mockAgentCatalog } from "@/lib/supabase/mocks";

export async function POST(
  request: Request,
  { params }: { params: { factory_slug: string; agent_slug: string } }
) {
  const { factory_slug, agent_slug } = params;
  const { message, session_token } = await request.json();

  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  // Rate limiting
  const identifier = session_token || "anonymous";
  const { allowed, resetIn } = checkRateLimit(identifier, "anonymous");
  if (!allowed) {
    return NextResponse.json(
      { error: getRateLimitMessage(resetIn) },
      { status: 429 }
    );
  }

  // Fetch factory context
  const factory = mockFactories.find((f) => f.slug === factory_slug);
  if (!factory) {
    return NextResponse.json({ error: "Factory not found" }, { status: 404 });
  }

  // Fetch agent catalog entry
  const agent = mockAgentCatalog.find((a) => a.slug === agent_slug);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  // Build system prompt with factory context
  const systemPrompt = `You are ${agent.name} working for ${factory.business_name}.
Business niche: ${factory.niche}
Brand voice: ${factory.brand_voice_sample || "Professional and helpful"}
Your role: ${agent.description}
Capabilities: ${agent.capabilities?.join(", ")}

Respond helpfully and stay in character. Be concise but thorough.`;

  try {
    const { text, stream } = await generateAgentResponse({
      agentSlug: agent_slug,
      systemPrompt,
      messages: [{ role: "user", content: message }],
      stream: true,
      factoryId: factory.id,
    });

    // If streaming, return SSE response
    if (stream) {
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, full_text: text })}\n\n`));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("[Chat API Error]", error);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}
