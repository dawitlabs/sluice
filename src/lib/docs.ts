export type DocSection = {
  heading: string;
  body: string[];
  code?: string;
};

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  sections: DocSection[];
  order: number;
};

export const DOCS: DocPage[] = [
  {
    slug: "quickstart",
    title: "Quickstart",
    description:
      "Capture a real production request and replay it against a branch in under ten minutes.",
    order: 1,
    sections: [
      {
        heading: "Install the package",
        body: [
          "Sluice ships as one Next.js package with no native dependencies. Installing it and initializing the project takes about forty seconds.",
          "The init command detects your framework version, writes src/proxy.ts, and adds the environment keys the capture proxy reads.",
        ],
        code: "pnpm add @sluice/next\nsluice init --framework next",
      },
      {
        heading: "Set the project key",
        body: [
          "Copy the project key from Console, Settings, Keys. It stays on the server: the capture proxy never ships to the browser and never appears in a client bundle. SLUICE_PROJECT names the environment the captures belong to, so a staging deploy cannot mix records with production.",
        ],
        code: "SLUICE_KEY=sluice_live_7c1e9a2f4b\nSLUICE_PROJECT=acme-api",
      },
      {
        heading: "Send one request through",
        body: [
          "Start the app and call any route behind the matcher. The proxy records the request after the response resolves, so capture adds no latency to the user-facing path.",
          "The first capture is usually queryable within two seconds of the response.",
        ],
        code: "pnpm dev\ncurl -s localhost:3000/api/orders/ord_1902",
      },
      {
        heading: "Replay it against a branch",
        body: [
          "Every capture has an id. Replay boots a sandbox with the datastores the original request touched, runs the request against your branch, and prints the diff.",
          "Production is never contacted, and no customer is charged twice.",
        ],
        code: "sluice replay req_9f4c1a --branch fix/charge-timeout",
      },
      {
        heading: "Where to go next",
        body: [
          "The middleware guide covers matchers, sampling and self-hosted stores. Redaction explains what is stripped before storage. The CLI and REST API references cover everything scriptable.",
        ],
      },
    ],
  },
  {
    slug: "middleware",
    title: "Next.js middleware",
    description:
      "Mount the capture proxy, scope it to the routes that matter, and keep it off the hot path.",
    order: 2,
    sections: [
      {
        heading: "What the proxy does",
        body: [
          "The proxy clones the incoming request, buffers the body up to a size limit, applies redaction, and queues the record for delivery after the response has been sent.",
          "Delivery is fire-and-forget with a thirty-second deadline. A capture store outage degrades observability, never the request.",
        ],
      },
      {
        heading: "Mount it",
        body: [
          "On Next.js 16 the file is src/proxy.ts and the export is named proxy. The matcher keeps static assets and image optimization out of the capture path.",
        ],
        code: `import { withSluice } from "@sluice/next";

export const proxy = withSluice({
  project: "acme-api",
  capture: { sampleRate: 1 },
  replay: { allow: ["fix/*", "perf/*"] },
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};`,
      },
      {
        heading: "Choose what is captured",
        body: [
          "Sampling is per route, not global. Keep checkout and payment routes at 100 percent and let read-heavy endpoints run at a quarter.",
          "maxBodyBytes guards against uploads. Requests above the limit are captured without a body and marked truncated.",
        ],
        code: `capture: {
  sampleRate: 0.25,
  include: ["/api/*", "/checkout/*"],
  exclude: ["/health", "/metrics"],
  maxBodyBytes: 262144,
},`,
      },
      {
        heading: "Use a self-hosted store",
        body: [
          "Point store.url at an endpoint you control and pass the same project key. Capture writes go over HTTPS directly to that host, and the Sluice control plane only sees metadata.",
        ],
        code: `store: {
  url: "https://captures.internal.acme.dev",
  region: "eu-central",
},`,
      },
      {
        heading: "When nothing appears",
        body: [
          "Run sluice doctor from the project root. It checks the key, the matcher, the framework version and the egress rules, then prints the exact reason the last request was skipped.",
          "Streaming and long-lived responses are recorded by status and timing only. Buffering them would mean holding the connection open on your server.",
        ],
      },
    ],
  },
  {
    slug: "redaction",
    title: "Redaction rules",
    description:
      "Strip credentials and card data before a capture ever leaves the process.",
    order: 3,
    sections: [
      {
        heading: "What is removed by default",
        body: [
          "Headers are matched case-insensitively. Body fields are matched as JSON paths, where * matches any array index or object key.",
          "The default set covers authorization, cookie, set-cookie, x-api-key, password, card.number, card.cvc and card.expiry.",
        ],
        code: `authorization
cookie
set-cookie
x-api-key
password
card.number
card.cvc
card.expiry`,
      },
      {
        heading: "Add project rules",
        body: [
          "Rules live in sluice.config.ts next to the project root. Header rules replace the whole value; body rules replace the value at that path and keep the shape intact.",
        ],
        code: `import { defineConfig } from "@sluice/next";

export default defineConfig({
  redact: {
    headers: ["x-internal-token", "x-forwarded-authorization"],
    body: ["customer.ssn", "bank.account.*.iban", "shipping.phone"],
    hash: ["customer.email"],
  },
});`,
      },
      {
        heading: "Redact without losing correlation",
        body: [
          "Hashed fields become an HMAC-SHA256 digest with a per-project key. The same email produces the same digest across captures, so you can follow one user through a trace without storing the address.",
          "Replaced fields become the literal string [redacted]. Replay sends the redacted payload, which is why a captured request can never replay a live credential.",
        ],
      },
      {
        heading: "Test a rule before shipping it",
        body: [
          "The test command runs the full rule set against a fixture and prints every path it matched, the rule that caught it, and the value that would be stored.",
          "It exits non-zero when a credential-shaped field survives, so it belongs in CI next to your schema checks.",
        ],
        code: "pnpm dlx @sluice/cli redact test --file fixtures/checkout.json",
      },
      {
        heading: "If something leaks",
        body: [
          "Rotate the project key first, then purge the affected records by rule. Deletion is immediate and propagates to replicas within five minutes.",
          "Every purge writes an audit entry with the requesting user, the rule and the record ids.",
        ],
        code: "pnpm dlx @sluice/cli captures purge --matching card.number --before 2026-11-19",
      },
    ],
  },
  {
    slug: "cli",
    title: "CLI reference",
    description:
      "Authenticate, list captures, replay against a branch and export fixtures from the terminal.",
    order: 4,
    sections: [
      {
        heading: "Install and authenticate",
        body: [
          "The CLI is a dev dependency. The login command opens a browser, waits for the callback, and stores a scoped token in your config directory.",
          "In CI, skip login and set SLUICE_TOKEN from the project secrets instead.",
        ],
        code: "pnpm add -D @sluice/cli\npnpm dlx @sluice/cli auth login",
      },
      {
        heading: "List captures",
        body: [
          "Filters combine. The table prints capture id, method, path, status, wall time and whether the record can be replayed.",
          "Use --json for scripts. The payload is the same shape as the REST list endpoint, cursor included.",
        ],
        code: "sluice captures list --since 1h --status 5xx --limit 20",
      },
      {
        heading: "Replay a capture",
        body: [
          "Replay resolves the capture id, checks that the branch is allowed by project policy, and boots a sandbox with a copy of the datastores the request touched.",
          "The command prints the response diff and exits zero when the status and body match the original. Use --no-diff when you only want the replay id.",
        ],
        code: "sluice replay req_9f4c1a --branch fix/charge-timeout --timeout 30s",
      },
      {
        heading: "Export a fixture",
        body: [
          "Export writes a portable JSON file with the redacted request, the expected response and the span tree. It is stable enough to commit as an integration test input.",
        ],
        code: "sluice export req_9f4c1a --out fixtures/charge-timeout.json --scrub",
      },
      {
        heading: "Fail a pull request on a diff",
        body: [
          "In CI, replay the capture that paged someone and flag any change to status or body. The step fails the build so the regression cannot merge silently.",
        ],
        code: `sluice replay req_9f4c1a \\
  --branch "$GITHUB_HEAD_REF" \\
  --fail-on-diff`,
      },
    ],
  },
  {
    slug: "api",
    title: "REST API",
    description:
      "Read captures and trigger replays over HTTPS. Every endpoint is scoped to a project key.",
    order: 5,
    sections: [
      {
        heading: "Authentication",
        body: [
          "Send a project token as a bearer credential. Read-only keys can list and retrieve captures but cannot start a replay.",
          "Keys are scoped to one project. A token from staging returns 403 against a production project id.",
        ],
        code: 'curl https://api.sluice.dev/v1/captures -H "Authorization: Bearer $SLUICE_TOKEN"',
      },
      {
        heading: "List captures",
        body: [
          "Query parameters: since, until, status, method, path, cursor and limit. Limit defaults to 25 and caps at 100.",
          "Responses are cursor-paginated. Pass the next_cursor value back as cursor until it is null.",
        ],
        code: `GET /v1/captures?since=2026-11-18T00:00:00Z&status=5xx&limit=50
200 OK`,
      },
      {
        heading: "Retrieve one capture",
        body: [
          "The record includes the request, the response, the span tree and the list of redaction rules that ran. Redacted values are already replaced.",
          "A capture that has aged out of its retention window returns 404, even if you have the id.",
        ],
        code: `GET /v1/captures/req_9f4c1a
200 OK
404 Not Found`,
      },
      {
        heading: "Replay a capture",
        body: [
          "Replay accepts a branch and an optional environment. It returns 202 with a replay id; poll GET /v1/replays/:id for the diff.",
          "409 means a replay for that branch is already running. 422 means the branch is outside the project allowlist.",
        ],
        code: `POST /v1/captures/req_9f4c1a/replay
Content-Type: application/json

{ "branch": "fix/charge-timeout", "env": "sandbox" }

202 Accepted
404 Not Found
409 Conflict
422 Unprocessable Entity`,
      },
      {
        heading: "Errors",
        body: [
          "Every error uses the same envelope. Codes are stable; messages are for humans and may change. Rate limit is 600 requests per minute per key; when exceeded, the response carries Retry-After in seconds.",
        ],
        code: `{
  "error": {
    "code": "capture_not_found",
    "message": "No capture with id req_9f4c1a in acme-api."
  }
}`,
      },
    ],
  },
];
