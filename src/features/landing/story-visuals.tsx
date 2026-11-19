const CAPTURE_LINES = [
  { glyph: "├─", name: "edge.handler", ms: "1310ms", tone: "muted" },
  { glyph: "├─", name: "auth.session", ms: "11ms", tone: "muted" },
  { glyph: "├─", name: "db.select orders", ms: "24ms", tone: "muted" },
  { glyph: "└─", name: "stripe.charge", ms: "1147ms", tone: "error" },
] as const;

export function CaptureVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-rule bg-paper-2">
      <div className="flex items-center justify-between border-b border-rule px-4 py-2.5 font-mono text-[10px] text-ink-faint">
        <span>req_9f4c1a</span>
        <span>14:02:11.842 · iad1</span>
      </div>
      <div className="px-4 py-3 font-mono text-[11px]">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-ink">
            <span className="text-ink-faint">POST </span>/v1/checkout/confirm
          </span>
          <span className="text-signal">504</span>
        </div>
        <div className="mt-3 space-y-1.5 border-l border-rule pl-3">
          {CAPTURE_LINES.map((line) => (
            <div
              key={line.name}
              className="flex items-baseline justify-between gap-4"
            >
              <span
                className={
                  line.tone === "error" ? "text-signal" : "text-ink-soft"
                }
              >
                <span className="text-ink-faint">{line.glyph} </span>
                {line.name}
              </span>
              <span className="text-ink-faint tabular-nums">{line.ms}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 border-t border-rule pt-2 text-[10px] text-ink-faint">
          body 1.4kb · 8 headers · idempotency key kept
        </p>
      </div>
    </div>
  );
}

export function ReplayVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-rule bg-ink">
      <div className="flex items-center gap-1.5 border-b border-paper/10 px-4 py-2.5">
        <span className="size-2 rounded-full bg-paper/25" aria-hidden="true" />
        <span className="size-2 rounded-full bg-paper/25" aria-hidden="true" />
        <span className="size-2 rounded-full bg-signal" aria-hidden="true" />
        <span className="ml-2 font-mono text-[10px] text-paper/45">
          ~/apps/checkout
        </span>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[11px] leading-relaxed text-paper/80">
        <code>
          <span className="text-signal">$</span> sluice replay req_9f4c1a
          {" --branch fix/charge-timeout\n"}
          <span className="text-paper/40">{"  capture "}</span>
          {" 6 spans · 1.4kb · 8 headers\n"}
          <span className="text-paper/40">{"  sandbox "}</span>
          {" postgres:16 · redis:7 · stripe:mock\n"}
          <span className="text-paper/40">{"  run     "}</span>
          {" 6 spans, identical bytes\n\n"}
          <span className="text-paper/40">{"  ✓ stripe.charge "}</span>
          {" 1147ms → 118ms (retry once)\n"}
          <span className="text-paper">{"  200 OK "}</span>
          {"  total 214ms · "}
          <span className="text-signal">−84%</span>
        </code>
      </pre>
    </div>
  );
}

const DIFF_ROWS = [
  { label: "status", before: "504", after: "200", fixed: true },
  { label: "wall", before: "1,310ms", after: "214ms", fixed: true },
  { label: "stripe.charge", before: "timeout", after: "118ms", fixed: true },
  { label: "order row", before: "—", after: "ord_1902", fixed: false },
];

export function DiffVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-rule">
      <div className="grid grid-cols-[1fr_1fr] divide-x divide-rule">
        <div className="bg-paper px-4 py-2.5 font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
          original
        </div>
        <div className="bg-paper-2 px-4 py-2.5 font-mono text-[10px] tracking-[0.1em] text-signal-deep uppercase">
          replayed
        </div>
      </div>
      {DIFF_ROWS.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[1fr_1fr] divide-x divide-rule border-t border-rule font-mono text-[11px]"
        >
          <div className="flex items-baseline gap-2 px-4 py-2">
            <span aria-hidden="true" className="text-signal">
              −
            </span>
            <span className="text-ink-faint">{row.label}</span>
            <span className="ml-auto text-ink-soft tabular-nums">
              {row.before}
            </span>
          </div>
          <div className="flex items-baseline gap-2 bg-paper-2 px-4 py-2">
            <span aria-hidden="true" className="text-ok">
              +
            </span>
            <span className="text-ink-faint">{row.label}</span>
            <span
              className={`ml-auto tabular-nums ${row.fixed ? "text-ink" : "text-ink-soft"}`}
            >
              {row.after}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
