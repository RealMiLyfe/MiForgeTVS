import { NextResponse } from "next/server";
import { getMockConciergeResponse } from "@/lib/agents/concierge/mock-conversation";

export async function POST(request: Request) {
  const { message, session_token, message_count } = await request.json();

  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  console.log(`[Concierge Chat] Session: ${session_token}, Msg #${message_count}`);

  // Generate mock response (placeholder mode)
  const responseText = getMockConciergeResponse(message);

  // Stream character-by-character via SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const chars = responseText.split("");
      for (let i = 0; i < chars.length; i++) {
        await new Promise((r) => setTimeout(r, 20 + Math.random() * 15));
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ text: chars[i] })}\n\n`)
        );
      }
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ done: true, full_text: responseText })}\n\n`
        )
      );
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
