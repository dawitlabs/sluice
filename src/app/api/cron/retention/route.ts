import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { captures, projects } from "@/db/schema";

export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "cron not configured" }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const expired = sql`${captures.at} < now() - make_interval(days => (select ${projects.retentionDays} from ${projects} where ${projects.id} = ${captures.projectId}))`;

  const removed = await db
    .delete(captures)
    .where(expired)
    .returning({ id: captures.id });

  return NextResponse.json({ ok: true, removed: removed.length });
}
