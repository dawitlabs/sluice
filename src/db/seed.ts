import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import {
  account as accountTable,
  alertRules,
  captures,
  projects,
  redactionRules,
  replays,
  spans,
  user,
} from "@/db/schema";

const DEMO_EMAIL = "demo@sluice.dev";
const DEMO_PASSWORD = "sluice-demo-2026";
const DEMO_NAME = "Demo Engineer";

type SeedStatus = "ok" | "slow" | "error";

type SeedSpan = {
  name: string;
  service: string;
  startMs: number;
  durationMs: number;
  status: SeedStatus;
};

type SeedCapture = {
  id: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  minutesAgo: number;
  region: string;
  release: string;
  replayed: boolean;
  requestBody: string;
  responseBody: string;
  spans: SeedSpan[];
};

const checkoutSpans: SeedSpan[] = [
  {
    name: "edge.handler",
    service: "vercel",
    startMs: 0,
    durationMs: 1310,
    status: "ok",
  },
  {
    name: "auth.session",
    service: "app",
    startMs: 4,
    durationMs: 11,
    status: "ok",
  },
  {
    name: "cart.revalidate",
    service: "app",
    startMs: 16,
    durationMs: 38,
    status: "ok",
  },
  {
    name: "db.select orders",
    service: "postgres",
    startMs: 55,
    durationMs: 24,
    status: "ok",
  },
  {
    name: "stripe.charge",
    service: "stripe",
    startMs: 96,
    durationMs: 1147,
    status: "error",
  },
  {
    name: "response.serialize",
    service: "app",
    startMs: 1258,
    durationMs: 52,
    status: "ok",
  },
];

const catalogSpans: SeedSpan[] = [
  {
    name: "edge.handler",
    service: "vercel",
    startMs: 0,
    durationMs: 84,
    status: "ok",
  },
  {
    name: "cache.lookup",
    service: "redis",
    startMs: 2,
    durationMs: 3,
    status: "ok",
  },
  {
    name: "db.search products",
    service: "postgres",
    startMs: 8,
    durationMs: 61,
    status: "ok",
  },
  {
    name: "response.serialize",
    service: "app",
    startMs: 71,
    durationMs: 13,
    status: "ok",
  },
];

const ingestSpans: SeedSpan[] = [
  {
    name: "edge.handler",
    service: "vercel",
    startMs: 0,
    durationMs: 12,
    status: "ok",
  },
  {
    name: "queue.publish",
    service: "kafka",
    startMs: 5,
    durationMs: 6,
    status: "ok",
  },
];

const subscriptionSpans: SeedSpan[] = [
  {
    name: "edge.handler",
    service: "vercel",
    startMs: 0,
    durationMs: 412,
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
    name: "db.select subscriptions",
    service: "postgres",
    startMs: 14,
    durationMs: 386,
    status: "error",
  },
  {
    name: "response.serialize",
    service: "app",
    startMs: 402,
    durationMs: 10,
    status: "ok",
  },
];

const usageSpans: SeedSpan[] = [
  {
    name: "edge.handler",
    service: "vercel",
    startMs: 0,
    durationMs: 2280,
    status: "ok",
  },
  {
    name: "auth.session",
    service: "app",
    startMs: 2,
    durationMs: 8,
    status: "ok",
  },
  {
    name: "db.aggregate usage_events",
    service: "postgres",
    startMs: 12,
    durationMs: 1904,
    status: "slow",
  },
  {
    name: "csv.stream",
    service: "app",
    startMs: 1924,
    durationMs: 341,
    status: "slow",
  },
];

const webhookSpans: SeedSpan[] = [
  {
    name: "edge.handler",
    service: "vercel",
    startMs: 0,
    durationMs: 311,
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
    durationMs: 288,
    status: "slow",
  },
  {
    name: "queue.publish",
    service: "kafka",
    startMs: 296,
    durationMs: 14,
    status: "ok",
  },
];

const fixedCheckoutSpans: SeedSpan[] = [
  {
    name: "edge.handler",
    service: "vercel",
    startMs: 0,
    durationMs: 214,
    status: "ok",
  },
  {
    name: "auth.session",
    service: "app",
    startMs: 3,
    durationMs: 10,
    status: "ok",
  },
  {
    name: "cart.revalidate",
    service: "app",
    startMs: 15,
    durationMs: 34,
    status: "ok",
  },
  {
    name: "db.select orders",
    service: "postgres",
    startMs: 51,
    durationMs: 21,
    status: "ok",
  },
  {
    name: "stripe.charge",
    service: "stripe",
    startMs: 74,
    durationMs: 118,
    status: "ok",
  },
  {
    name: "response.serialize",
    service: "app",
    startMs: 194,
    durationMs: 19,
    status: "ok",
  },
];

const SEED_CAPTURES: SeedCapture[] = [
  {
    id: "req_9f4c1a",
    method: "POST",
    path: "/v1/checkout/confirm",
    status: 504,
    durationMs: 1310,
    minutesAgo: 1,
    region: "iad1",
    release: "a41c9e2",
    replayed: false,
    requestBody: `{
  "cart_id": "cart_8812",
  "payment_method": "pm_1QxT2",
  "idempotency_key": "idem_7f2a"
}`,
    responseBody: `{
  "error": "upstream_timeout",
  "message": "stripe.charge did not respond within 1200ms",
  "request_id": "req_9f4c1a"
}`,
    spans: checkoutSpans,
  },
  {
    id: "req_3b7d20",
    method: "GET",
    path: "/v1/catalog/search?q=lamp",
    status: 200,
    durationMs: 84,
    minutesAgo: 2,
    region: "iad1",
    release: "a41c9e2",
    replayed: false,
    requestBody: "GET /v1/catalog/search?q=lamp&limit=24",
    responseBody: `{
  "results": 24,
  "took_ms": 61
}`,
    spans: catalogSpans,
  },
  {
    id: "req_c21e88",
    method: "POST",
    path: "/v1/events/ingest",
    status: 202,
    durationMs: 12,
    minutesAgo: 2.4,
    region: "iad1",
    release: "a41c9e2",
    replayed: false,
    requestBody: `{
  "events": [{ "name": "page_view", "path": "/pricing" }]
}`,
    responseBody: `{ "accepted": 1 }`,
    spans: ingestSpans,
  },
  {
    id: "req_77ae04",
    method: "GET",
    path: "/v1/subscriptions/sub_4191",
    status: 500,
    durationMs: 412,
    minutesAgo: 3,
    region: "sfo1",
    release: "a41c9e2",
    replayed: false,
    requestBody: "GET /v1/subscriptions/sub_4191",
    responseBody: `{
  "error": "column subscriptions.renews_at does not exist",
  "request_id": "req_77ae04"
}`,
    spans: subscriptionSpans,
  },
  {
    id: "req_5e0f31",
    method: "PATCH",
    path: "/v1/users/usr_2201",
    status: 200,
    durationMs: 96,
    minutesAgo: 3.6,
    region: "iad1",
    release: "a41c9e2",
    replayed: false,
    requestBody: `{ "name": "Dawit" }`,
    responseBody: `{ "updated": true }`,
    spans: catalogSpans,
  },
  {
    id: "req_18bb93",
    method: "POST",
    path: "/v1/webhooks/stripe",
    status: 200,
    durationMs: 311,
    minutesAgo: 4.1,
    region: "iad1",
    release: "a41c9e2",
    replayed: false,
    requestBody: `{
  "type": "invoice.paid",
  "id": "evt_51xQ"
}`,
    responseBody: `{ "received": true }`,
    spans: webhookSpans,
  },
  {
    id: "req_b402df",
    method: "GET",
    path: "/v1/health",
    status: 200,
    durationMs: 3,
    minutesAgo: 4.5,
    region: "iad1",
    release: "a41c9e2",
    replayed: false,
    requestBody: "GET /v1/health",
    responseBody: `{ "ok": true }`,
    spans: ingestSpans,
  },
  {
    id: "req_d91c47",
    method: "DELETE",
    path: "/v1/api-keys/key_5520",
    status: 204,
    durationMs: 41,
    minutesAgo: 4.8,
    region: "iad1",
    release: "a41c9e2",
    replayed: false,
    requestBody: "DELETE /v1/api-keys/key_5520",
    responseBody: "204 No Content",
    spans: ingestSpans,
  },
  {
    id: "req_e0a7c5",
    method: "POST",
    path: "/v1/auth/token",
    status: 429,
    durationMs: 8,
    minutesAgo: 26,
    region: "fra1",
    release: "a41c9e2",
    replayed: false,
    requestBody: `{ "grant_type": "refresh_token" }`,
    responseBody: `{
  "error": "rate_limited",
  "retry_after_ms": 900
}`,
    spans: ingestSpans,
  },
  {
    id: "req_a6632b",
    method: "GET",
    path: "/v1/reports/usage?month=11",
    status: 200,
    durationMs: 2280,
    minutesAgo: 47,
    region: "sfo1",
    release: "a41c9e2",
    replayed: true,
    requestBody: "GET /v1/reports/usage?month=11",
    responseBody: `{ "rows": 41206, "streamed": true }`,
    spans: usageSpans,
  },
  {
    id: "req_2c88f0",
    method: "POST",
    path: "/v1/checkout/confirm",
    status: 200,
    durationMs: 214,
    minutesAgo: 179,
    region: "iad1",
    release: "fix/charge-timeout",
    replayed: true,
    requestBody: `{
  "cart_id": "cart_8812",
  "payment_method": "pm_1QxT2",
  "idempotency_key": "idem_7f2a"
}`,
    responseBody: `{
  "order_id": "ord_1902",
  "charged": true,
  "replayed_from": "req_9f4c1a"
}`,
    spans: fixedCheckoutSpans,
  },
  {
    id: "req_f5b019",
    method: "GET",
    path: "/v1/catalog/search?q=rug",
    status: 503,
    durationMs: 61,
    minutesAgo: 400,
    region: "fra1",
    release: "a41c9e2",
    replayed: false,
    requestBody: "GET /v1/catalog/search?q=rug&limit=24",
    responseBody: `{
  "error": "read_replica_unavailable",
  "request_id": "req_f5b019"
}`,
    spans: catalogSpans,
  },
];

const SEED_REPLAYS = [
  {
    id: "rep_seed01",
    captureId: "req_a6632b",
    status: 200,
    durationMs: 365,
    release: "fix/usage-aggregate",
    minutesAgo: 45,
  },
  {
    id: "rep_seed02",
    captureId: "req_2c88f0",
    status: 200,
    durationMs: 214,
    release: "fix/charge-timeout",
    minutesAgo: 179,
  },
];

const SEED_ALERTS = [
  {
    name: "checkout 5xx rate",
    condition: "stripe.charge errors > 1% over 5m",
    channel: "slack",
    enabled: true,
  },
  {
    name: "replica failover",
    condition: "catalog read errors > 20 in 5m",
    channel: "slack",
    enabled: true,
  },
  {
    name: "usage report latency",
    condition: "p95 of /v1/reports/usage > 2s",
    channel: "email",
    enabled: false,
  },
];

const SEED_REDACTIONS = ["authorization", "cookie", "card.number"];

function minutesAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60_000);
}

async function main() {
  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, DEMO_EMAIL))
    .limit(1);

  if (!existing) {
    const userId = crypto.randomUUID();
    await db.insert(user).values({
      id: userId,
      name: DEMO_NAME,
      email: DEMO_EMAIL,
      emailVerified: true,
    });
    await db.insert(accountTable).values({
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: await hashPassword(DEMO_PASSWORD),
    });
    console.log("created demo account");
  }

  const [owner] = await db
    .select()
    .from(user)
    .where(eq(user.email, DEMO_EMAIL))
    .limit(1);

  if (!owner) throw new Error("demo account missing after insert");

  const existingProject = await db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, owner.id))
    .limit(1);

  const project =
    existingProject[0] ??
    (
      await db
        .insert(projects)
        .values({
          ownerId: owner.id,
          slug: "acme-api",
          name: "acme-api",
          region: "iad1",
        })
        .returning()
    )[0];

  const seeded = await db
    .select({ id: captures.id })
    .from(captures)
    .where(eq(captures.projectId, project.id))
    .limit(1);

  if (seeded[0]) {
    console.log("captures already seeded, nothing to do");
    return;
  }

  for (const capture of SEED_CAPTURES) {
    await db.insert(captures).values({
      id: capture.id,
      projectId: project.id,
      method: capture.method,
      path: capture.path,
      status: capture.status,
      durationMs: capture.durationMs,
      at: minutesAgo(capture.minutesAgo),
      region: capture.region,
      release: capture.release,
      replayed: capture.replayed,
      requestBody: capture.requestBody,
      responseBody: capture.responseBody,
    });

    await db.insert(spans).values(
      capture.spans.map((span) => ({
        captureId: capture.id,
        name: span.name,
        service: span.service,
        startMs: span.startMs,
        durationMs: span.durationMs,
        status: span.status,
      })),
    );
  }

  await db.insert(replays).values(
    SEED_REPLAYS.map((replay) => ({
      id: replay.id,
      projectId: project.id,
      captureId: replay.captureId,
      status: replay.status,
      durationMs: replay.durationMs,
      release: replay.release,
      createdAt: minutesAgo(replay.minutesAgo),
    })),
  );

  await db.insert(alertRules).values(
    SEED_ALERTS.map((alert) => ({
      projectId: project.id,
      name: alert.name,
      condition: alert.condition,
      channel: alert.channel,
      enabled: alert.enabled,
    })),
  );

  await db.insert(redactionRules).values(
    SEED_REDACTIONS.map((pattern) => ({
      projectId: project.id,
      pattern,
    })),
  );

  console.log(
    `seeded ${SEED_CAPTURES.length} captures, ${SEED_REPLAYS.length} replays, ${SEED_ALERTS.length} alerts, ${SEED_REDACTIONS.length} redaction rules`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
