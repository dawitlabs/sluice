import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureProject } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { generateTraffic } from "@/lib/traffic";

const BODY = z.object({
  count: z.number().int().min(1).max(5).default(3),
});

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => ({}));
  const parsed = BODY.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const project = await ensureProject(user.id);
  const created = await generateTraffic(project.id, parsed.data.count);

  revalidatePath("/console");
  revalidatePath("/console/replays");

  return NextResponse.json({ created });
}
