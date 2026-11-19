import "server-only";
import { and, asc, desc, eq, gte, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import {
  alertRules,
  captures,
  projects,
  redactionRules,
  replays,
  spans,
} from "@/db/schema";

export const SLOW_THRESHOLD_MS = 400;

export const WINDOWS = { "5m": 5, "1h": 60, "24h": 1440 } as const;

export type WindowKey = keyof typeof WINDOWS;

export type CaptureFilter = "all" | "errors" | "slow" | "replayed";

export type SpanStatus = "ok" | "slow" | "error";

export type SpanRow = {
  id: string;
  name: string;
  service: string;
  startMs: number;
  durationMs: number;
  status: SpanStatus;
};

function parseSpanStatus(value: string): SpanStatus {
  if (value === "slow" || value === "error") return value;
  return "ok";
}

export type CaptureSummary = {
  id: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  at: string;
  region: string;
  release: string;
  replayed: boolean;
};

export type CaptureDetail = CaptureSummary & {
  requestBody: string;
  responseBody: string;
  spans: SpanRow[];
};

export type CaptureSummaryStats = {
  total: number;
  errors: number;
  p95Ms: number;
  replays: number;
};

export type ProjectRow = {
  id: string;
  name: string;
  slug: string;
  region: string;
  retentionDays: number;
  autoReplay: boolean;
};

const CAPTURE_COLUMNS = {
  id: captures.id,
  method: captures.method,
  path: captures.path,
  status: captures.status,
  durationMs: captures.durationMs,
  at: captures.at,
  region: captures.region,
  release: captures.release,
  replayed: captures.replayed,
};

function toSummary(row: {
  id: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  at: Date;
  region: string;
  release: string;
  replayed: boolean;
}): CaptureSummary {
  return {
    id: row.id,
    method: row.method,
    path: row.path,
    status: row.status,
    durationMs: row.durationMs,
    at: row.at.toISOString(),
    region: row.region,
    release: row.release,
    replayed: row.replayed,
  };
}

export async function ensureProject(ownerId: string): Promise<ProjectRow> {
  const existing = await db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, ownerId))
    .limit(1);

  const project =
    existing[0] ??
    (
      await db
        .insert(projects)
        .values({ ownerId, slug: "acme-api", name: "acme-api" })
        .returning()
    )[0];

  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    region: project.region,
    retentionDays: project.retentionDays,
    autoReplay: project.autoReplay,
  };
}

function windowStart(window: WindowKey): Date {
  return new Date(Date.now() - WINDOWS[window] * 60_000);
}

function filterConditions(
  projectId: string,
  filter: CaptureFilter,
  query: string,
  window: WindowKey,
) {
  const conditions = [
    eq(captures.projectId, projectId),
    gte(captures.at, windowStart(window)),
  ];

  if (filter === "errors") conditions.push(gte(captures.status, 500));
  if (filter === "slow") {
    conditions.push(gte(captures.durationMs, SLOW_THRESHOLD_MS));
  }
  if (filter === "replayed") conditions.push(eq(captures.replayed, true));

  const needle = query.trim();
  if (needle !== "") {
    const match = or(
      ilike(captures.path, `%${needle}%`),
      ilike(captures.id, `%${needle}%`),
      ilike(captures.method, needle),
    );
    if (match) conditions.push(match);
  }

  return and(...conditions);
}

export async function listCaptures(
  projectId: string,
  options: { filter: CaptureFilter; query: string; window: WindowKey },
): Promise<CaptureSummary[]> {
  const rows = await db
    .select(CAPTURE_COLUMNS)
    .from(captures)
    .where(
      filterConditions(
        projectId,
        options.filter,
        options.query,
        options.window,
      ),
    )
    .orderBy(desc(captures.at))
    .limit(100);

  return rows.map(toSummary);
}

export async function countCaptures(
  projectId: string,
  window: WindowKey,
): Promise<Record<CaptureFilter, number>> {
  const rows = await db
    .select({
      status: captures.status,
      durationMs: captures.durationMs,
      replayed: captures.replayed,
    })
    .from(captures)
    .where(
      and(
        eq(captures.projectId, projectId),
        gte(captures.at, windowStart(window)),
      ),
    );

  return {
    all: rows.length,
    errors: rows.filter((row) => row.status >= 500).length,
    slow: rows.filter((row) => row.durationMs >= SLOW_THRESHOLD_MS).length,
    replayed: rows.filter((row) => row.replayed).length,
  };
}

export async function summarizeCaptures(
  projectId: string,
  window: WindowKey,
): Promise<CaptureSummaryStats> {
  const rows = await db
    .select({
      durationMs: captures.durationMs,
      status: captures.status,
      replayed: captures.replayed,
    })
    .from(captures)
    .where(
      and(
        eq(captures.projectId, projectId),
        gte(captures.at, windowStart(window)),
      ),
    );

  const durations = rows
    .map((row) => row.durationMs)
    .sort((left, right) => left - right);
  const p95Index = Math.min(
    durations.length - 1,
    Math.floor(durations.length * 0.95),
  );

  return {
    total: rows.length,
    errors: rows.filter((row) => row.status >= 500).length,
    p95Ms: durations[Math.max(p95Index, 0)] ?? 0,
    replays: rows.filter((row) => row.replayed).length,
  };
}

export async function getCapture(
  projectId: string,
  captureId: string,
): Promise<CaptureDetail | null> {
  const [row] = await db
    .select({
      ...CAPTURE_COLUMNS,
      requestBody: captures.requestBody,
      responseBody: captures.responseBody,
    })
    .from(captures)
    .where(and(eq(captures.id, captureId), eq(captures.projectId, projectId)))
    .limit(1);

  if (!row) return null;

  const spanRows = await db
    .select({
      id: spans.id,
      name: spans.name,
      service: spans.service,
      startMs: spans.startMs,
      durationMs: spans.durationMs,
      status: spans.status,
    })
    .from(spans)
    .where(eq(spans.captureId, captureId))
    .orderBy(asc(spans.startMs));

  return {
    ...toSummary(row),
    requestBody: row.requestBody,
    responseBody: row.responseBody,
    spans: spanRows.map((span) => ({
      ...span,
      status: parseSpanStatus(span.status),
    })),
  };
}

export type ReplayRow = {
  id: string;
  captureId: string;
  path: string;
  method: string;
  status: number;
  durationMs: number;
  release: string;
  createdAt: string;
  originalStatus: number;
  originalDurationMs: number;
};

export type LatestReplay = {
  id: string;
  status: number;
  durationMs: number;
  release: string;
};

export async function getLatestReplay(
  projectId: string,
  captureId: string,
): Promise<LatestReplay | null> {
  const [row] = await db
    .select({
      id: replays.id,
      status: replays.status,
      durationMs: replays.durationMs,
      release: replays.release,
    })
    .from(replays)
    .where(
      and(eq(replays.projectId, projectId), eq(replays.captureId, captureId)),
    )
    .orderBy(desc(replays.createdAt))
    .limit(1);

  return row ?? null;
}

export async function listReplays(projectId: string): Promise<ReplayRow[]> {
  const rows = await db
    .select({
      id: replays.id,
      captureId: replays.captureId,
      status: replays.status,
      durationMs: replays.durationMs,
      release: replays.release,
      createdAt: replays.createdAt,
      path: captures.path,
      method: captures.method,
      originalStatus: captures.status,
      originalDurationMs: captures.durationMs,
    })
    .from(replays)
    .innerJoin(captures, eq(replays.captureId, captures.id))
    .where(eq(replays.projectId, projectId))
    .orderBy(desc(replays.createdAt))
    .limit(50);

  return rows.map((row) => ({
    id: row.id,
    captureId: row.captureId,
    path: row.path,
    method: row.method,
    status: row.status,
    durationMs: row.durationMs,
    release: row.release,
    createdAt: row.createdAt.toISOString(),
    originalStatus: row.originalStatus,
    originalDurationMs: row.originalDurationMs,
  }));
}

export type AlertRow = {
  id: string;
  name: string;
  condition: string;
  channel: string;
  enabled: boolean;
};

export async function listAlerts(projectId: string): Promise<AlertRow[]> {
  return db
    .select({
      id: alertRules.id,
      name: alertRules.name,
      condition: alertRules.condition,
      channel: alertRules.channel,
      enabled: alertRules.enabled,
    })
    .from(alertRules)
    .where(eq(alertRules.projectId, projectId))
    .orderBy(asc(alertRules.createdAt));
}

export type RedactionRow = {
  id: string;
  pattern: string;
  createdAt: string;
};

export async function listRedactions(
  projectId: string,
): Promise<RedactionRow[]> {
  const rows = await db
    .select({
      id: redactionRules.id,
      pattern: redactionRules.pattern,
      createdAt: redactionRules.createdAt,
    })
    .from(redactionRules)
    .where(eq(redactionRules.projectId, projectId))
    .orderBy(asc(redactionRules.createdAt));

  return rows.map((row) => ({
    id: row.id,
    pattern: row.pattern,
    createdAt: row.createdAt.toISOString(),
  }));
}
