import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  // In placeholder mode, just log and return success
  console.log("[Bespoke Submit] New request:", {
    description: data.description?.slice(0, 100),
    businessName: data.businessName,
    contactEmail: data.contactEmail,
  });

  // Would insert into bespoke_requests table in production
  const requestId = `BF-${String(Math.floor(Math.random() * 900) + 100)}`;

  return NextResponse.json({
    success: true,
    request_id: requestId,
    message: "Forge request submitted successfully",
  });
}
