import { NextResponse } from "next/server";
import { z } from "zod";

const PAYLOAD = z.object({
  message: z.string().min(1).max(500),
  path: z.string().max(200).optional(),
  digest: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  const parsed = PAYLOAD.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  console.error(
    JSON.stringify({
      event: "client.error",
      message: parsed.data.message,
      path: parsed.data.path,
      digest: parsed.data.digest,
      at: new Date().toISOString(),
    }),
  );

  return NextResponse.json({ ok: true });
}
