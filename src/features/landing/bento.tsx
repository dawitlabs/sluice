import { Kbd } from "@/components/kbd";

function Tile({
  title,
  body,
  children,
  className = "",
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-paper p-6 sm:p-7 ${className}`}>
      <h3 className="text-[17px] leading-snug font-medium tracking-[-0.01em] text-ink">
        {title}
      </h3>
      <p className="mt-2 max-w-[46ch] text-[13.5px] leading-relaxed text-ink-soft">
        {body}
      </p>
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

const SPAN_ROWS = [
  { name: "edge.handler", width: 92, tone: "bg-ink/20" },
  { name: "auth.session", width: 18, tone: "bg-ink/35" },
  { name: "db.select orders", width: 26, tone: "bg-ink/55" },
  { name: "stripe.charge", width: 78, tone: "bg-signal" },
];

const DOT_COUNT = 60;

function FailureGrid() {
  return (
    <div className="grid grid-cols-12 gap-1.5" aria-hidden="true">
      {Array.from({ length: DOT_COUNT }, (_, index) => {
        const isError = (index * 7) % 17 === 3 || index === 47;
        const isSlow = !isError && (index * 5) % 11 === 2;
        const tone = isError
          ? "bg-signal"
          : isSlow
            ? "bg-warn"
            : "bg-rule-strong";
        return <span key={index} className={`h-3 rounded-[2px] ${tone}`} />;
      })}
    </div>
  );
}

export function Bento() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">
              What the console gives you
            </p>
            <h2 className="display mt-4 max-w-[24ch] text-[clamp(2.1rem,4.6vw,3.3rem)] text-ink">
              Built for the <em>twenty minutes</em> after the alert.
            </h2>
          </div>
          <p className="max-w-[34ch] text-[14px] leading-relaxed text-ink-soft">
            Capture, replay and diff live in one surface, because switching tabs
            during an incident costs more than any query you run.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule lg:grid-cols-6">
          <Tile
            className="lg:col-span-3"
            title="The whole span tree, not the top line"
            body="Lanes per service, wall time per span, and the one tier that actually burned the budget."
          >
            <div className="space-y-2">
              {SPAN_ROWS.map((row) => (
                <div key={row.name} className="flex items-center gap-3">
                  <span className="w-[104px] shrink-0 truncate font-mono text-[10px] text-ink-soft">
                    {row.name}
                  </span>
                  <span className="h-2 flex-1 rounded-full bg-paper-3">
                    <span
                      className={`block h-2 rounded-full ${row.tone}`}
                      style={{ width: `${row.width}%` }}
                    />
                  </span>
                </div>
              ))}
            </div>
          </Tile>

          <Tile
            className="lg:col-span-3"
            title="Replay from the terminal you already have"
            body="The console is optional. Captures are addressable by id, so CI can turn a p1 into a regression test before standup."
          >
            <div className="rounded-lg border border-rule bg-paper-2 px-4 py-3 font-mono text-[11px] text-ink-soft">
              <span className="text-signal">$</span> sluice replay
              req_9f4c1a
              <br />
              <span className="text-ink-faint">
                {"  ✓ 6 spans replayed · 200 OK · −84%"}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-ink-faint">
              <Kbd>⏎</Kbd> reruns the last capture
              <span className="ml-2">
                <Kbd>⌘K</Kbd> opens the palette
              </span>
            </div>
          </Tile>

          <Tile
            className="lg:col-span-2"
            title="Diff responses, not vibes"
            body="Body, status and headers compared field by field. A replay that changes nothing is also an answer."
          >
            <div className="space-y-1.5 font-mono text-[11px]">
              <p className="text-signal">− 504 upstream_timeout</p>
              <p className="text-ok">+ 200 ord_1902</p>
              <p className="text-ink-faint">= 8 headers unchanged</p>
            </div>
          </Tile>

          <Tile
            className="lg:col-span-2"
            title="Failures have a shape"
            body="Sluice clusters errors by span, not by message. The blob on the right is one bug with 41 faces."
          >
            <FailureGrid />
            <div className="mt-3 flex gap-4 font-mono text-[10px] text-ink-faint">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-signal" />
                error
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-warn" />
                slow
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-rule-strong" />
                ok
              </span>
            </div>
          </Tile>

          <Tile
            className="lg:col-span-2"
            title="Redacted before it is stored"
            body="Rules run on the payload at the edge. Tokens, cookies and card fields never reach the capture store, and replay has no egress to production."
          >
            <ul className="space-y-2 font-mono text-[11px] text-ink-soft">
              <li className="flex gap-2">
                <span className="text-ok" aria-hidden="true">
                  ✓
                </span>
                authorization, cookie, cvv dropped
              </li>
              <li className="flex gap-2">
                <span className="text-ok" aria-hidden="true">
                  ✓
                </span>
                7-day retention, per-project
              </li>
              <li className="flex gap-2">
                <span className="text-ok" aria-hidden="true">
                  ✓
                </span>
                self-hosted store available
              </li>
            </ul>
          </Tile>
        </div>
      </div>
    </section>
  );
}
