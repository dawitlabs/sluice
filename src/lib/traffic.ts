import "server-only";
import { randomInt, randomUUID } from "node:crypto";
import { db } from "@/db";
import { captures, spans } from "@/db/schema";

type SpanSeed = {
  name: string;
  service: string;
  startMs: number;
  durationMs: number;
  status: "ok" | "slow" | "error";
};

type Template = {
  method: string;
  path: string;
  status: number;
  region: string;
  requestBody: string;
  responseBody: string;
  spans: SpanSeed[];
};

const REGIONS = ["iad1", "sfo1", "fra1"] as const;
const RELEASES = ["a41c9e2", "b7f10d4", "c02ee91"] as const;
const PATHS = [
  "/v1/catalog/search?q=lamp",
  "/v1/checkout/confirm",
  "/v1/subscriptions/sub_4191",
  "/v1/webhooks/stripe",
  "/v1/events/ingest",
  "/v1/reports/usage?month=11",
  "/v1/users/usr_2201",
  "/v1/auth/token",
  "/v1/health",
] as const;

function buildTemplate(path: string): Template {
  const edgeOk: SpanSeed[] = [
    {
      name: "edge.handler",
      service: "vercel",
      startMs: 0,
      durationMs: 120,
      status: "ok",
    },
    {
      name: "auth.session",
      service: "app",
      startMs: 3,
      durationMs: 9,
      status: "ok",
    },
    {
      name: "db.query",
      service: "postgres",
      startMs: 14,
      durationMs: 71,
      status: "ok",
    },
    {
      name: "response.serialize",
      service: "app",
      startMs: 92,
      durationMs: 21,
      status: "ok",
    },
  ];

  if (path.includes("checkout")) {
    return {
      method: "POST",
      path,
      status: 504,
      region: "iad1",
      requestBody: `{ "cart_id": "cart_${Math.floor(Math.random() * 9000) + 1000}" }`,
      responseBody: `{ "error": "upstream_timeout", "tier": "stripe" }`,
      spans: [
        {
          name: "edge.handler",
          service: "vercel",
          startMs: 0,
          durationMs: 1240,
          status: "ok",
        },
        {
          name: "auth.session",
          service: "app",
          startMs: 4,
          durationMs: 12,
          status: "ok",
        },
        {
          name: "stripe.charge",
          service: "stripe",
          startMs: 88,
          durationMs: 1102,
          status: "error",
        },
        {
          name: "response.serialize",
          service: "app",
          startMs: 1200,
          durationMs: 40,
          status: "ok",
        },
      ],
    };
  }

  if (path.includes("subscriptions")) {
    return {
      method: "GET",
      path,
      status: 500,
      region: "sfo1",
      requestBody: `GET ${path}`,
      responseBody: `{ "error": "column subscriptions.renews_at does not exist" }`,
      spans: [
        {
          name: "edge.handler",
          service: "vercel",
          startMs: 0,
          durationMs: 388,
          status: "ok",
        },
        {
          name: "db.select subscriptions",
          service: "postgres",
          startMs: 12,
          durationMs: 360,
          status: "error",
        },
        {
          name: "response.serialize",
          service: "app",
          startMs: 378,
          durationMs: 10,
          status: "ok",
        },
      ],
    };
  }

  if (path.includes("reports")) {
    return {
      method: "GET",
      path,
      status: 200,
      region: "sfo1",
      requestBody: `GET ${path}`,
      responseBody: `{ "rows": ${Math.floor(Math.random() * 40000) + 5000}, "streamed": true }`,
      spans: [
        {
          name: "edge.handler",
          service: "vercel",
          startMs: 0,
          durationMs: 1420,
          status: "ok",
        },
        {
          name: "db.aggregate usage_events",
          service: "postgres",
          startMs: 10,
          durationMs: 1180,
          status: "slow",
        },
        {
          name: "csv.stream",
          service: "app",
          startMs: 1200,
          durationMs: 210,
          status: "slow",
        },
      ],
    };
  }

  if (path.includes("webhooks")) {
    return {
      method: "POST",
      path,
      status: 200,
      region: "iad1",
      requestBody: `{ "type": "invoice.paid" }`,
      responseBody: `{ "received": true }`,
      spans: [
        {
          name: "edge.handler",
          service: "vercel",
          startMs: 0,
          durationMs: 268,
          status: "ok",
        },
        {
          name: "signature.verify",
          service: "app",
          startMs: 1,
          durationMs: 2,
          status: "ok",
        },
        {
          name: "db.upsert invoice",
          service: "postgres",
          startMs: 6,
          durationMs: 246,
          status: "slow",
        },
      ],
    };
  }

  if (path.includes("auth/token")) {
    return {
      method: "POST",
      path,
      status: 429,
      region: "fra1",
      requestBody: `{ "grant_type": "refresh_token" }`,
      responseBody: `{ "error": "rate_limited", "retry_after_ms": 900 }`,
      spans: [
        {
          name: "edge.handler",
          service: "vercel",
          startMs: 0,
          durationMs: 9,
          status: "ok",
        },
        {
          name: "rate_limit.check",
          service: "redis",
          startMs: 2,
          durationMs: 5,
          status: "slow",
        },
      ],
    };
  }

  return {
    method: path.includes("ingest") ? "POST" : "GET",
    path,
    status: path.includes("ingest") ? 202 : 200,
    region: "iad1",
    requestBody: `GET ${path}`,
    responseBody: `{ "ok": true }`,
    spans: edgeOk,
  };
}

function pick<T>(items: readonly T[]): T {
  return items[randomInt(items.length)];
}

export async function generateTraffic(
  projectId: string,
  count: number,
): Promise<number> {
  const safeCount = Math.min(Math.max(Math.round(count), 1), 5);
  const captureRows: Array<typeof captures.$inferInsert> = [];
  const spanRows: Array<typeof spans.$inferInsert> = [];

  for (let index = 0; index < safeCount; index += 1) {
    const template = buildTemplate(pick(PATHS));
    const jitter = randomInt(40);
    const totalMs =
      template.spans.reduce(
        (end, span) => Math.max(end, span.startMs + span.durationMs),
        0,
      ) + jitter;
    const id = `req_${randomUUID().slice(0, 6)}`;

    captureRows.push({
      id,
      projectId,
      method: template.method,
      path: template.path,
      status: template.status,
      durationMs: totalMs,
      at: new Date(),
      region: pick(REGIONS),
      release: pick(RELEASES),
      replayed: false,
      requestBody: template.requestBody,
      responseBody: template.responseBody,
    });

    for (const span of template.spans) {
      spanRows.push({
        captureId: id,
        name: span.name,
        service: span.service,
        startMs: span.startMs,
        durationMs: span.durationMs,
        status: span.status,
      });
    }
  }

  await db.insert(captures).values(captureRows);
  await db.insert(spans).values(spanRows);

  return safeCount;
}
