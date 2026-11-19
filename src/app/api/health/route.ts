import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  const startedAt = Date.now();

  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({
      status: "ok",
      dbMs: Date.now() - startedAt,
      at: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ status: "degraded" }, { status: 503 });
  }
}
