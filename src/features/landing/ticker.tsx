const FEED = [
  { method: "POST", path: "/v1/checkout/confirm", status: 504, ms: "1.31s" },
  { method: "GET", path: "/v1/catalog/search", status: 200, ms: "84ms" },
  { method: "POST", path: "/v1/webhooks/stripe", status: 200, ms: "311ms" },
  { method: "GET", path: "/v1/subscriptions/sub_4191", status: 500, ms: "412ms" },
  { method: "POST", path: "/v1/events/ingest", status: 202, ms: "12ms" },
  { method: "GET", path: "/v1/reports/usage", status: 200, ms: "2.28s" },
  { method: "PATCH", path: "/v1/users/usr_2201", status: 200, ms: "96ms" },
  { method: "POST", path: "/v1/auth/token", status: 429, ms: "8ms" },
  { method: "GET", path: "/v1/health", status: 200, ms: "3ms" },
];

function statusTone(status: number): string {
  if (status >= 500) return "text-signal";
  if (status >= 400) return "text-warn";
  return "text-ink-faint";
}

function Row({ item }: { item: (typeof FEED)[number] }) {
  return (
    <span className="flex items-center gap-2 font-mono text-[11px] whitespace-nowrap">
      <span className="text-ink-faint">{item.method}</span>
      <span className="text-ink-soft">{item.path}</span>
      <span className={`tabular-nums ${statusTone(item.status)}`}>
        {item.status}
      </span>
      <span className="text-ink-faint tabular-nums">{item.ms}</span>
      <span className="ml-2 text-rule-strong" aria-hidden="true">
        /
      </span>
    </span>
  );
}

export function Ticker() {
  return (
    <section
      aria-label="Recent captures"
      className="ticker overflow-hidden border-b border-rule bg-paper-2 py-3"
    >
      <div className="ticker-track flex w-max gap-6">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex gap-6 pl-6"
          >
            {FEED.map((item) => (
              <Row key={`${copy}-${item.path}-${item.status}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
