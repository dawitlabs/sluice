import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/features/landing/closing";
import { Nav } from "@/features/landing/nav";

export const metadata: Metadata = {
  title: "Status — Sluice",
  description:
    "Live health of the capture API, ingest, replay sandbox, dashboard and webhooks, with 90-day uptime.",
};

type ComponentStatus = {
  name: string;
  detail: string;
  status: string;
  latency: string;
};

const COMPONENTS: ComponentStatus[] = [
  {
    name: "API",
    detail: "api.sluice.dev · eu-central-1",
    status: "Operational",
    latency: "38 ms",
  },
  {
    name: "Capture ingest",
    detail: "edge workers · 14 regions",
    status: "Operational",
    latency: "12 ms",
  },
  {
    name: "Replay sandbox",
    detail: "sandbox fleet · 6 pools",
    status: "Operational",
    latency: "840 ms",
  },
  {
    name: "Dashboard",
    detail: "app.sluice.dev",
    status: "Operational",
    latency: "96 ms",
  },
  {
    name: "Webhooks",
    detail: "delivery queue · p95 end to end",
    status: "Operational",
    latency: "1.2 s",
  },
];

const DAY_COUNT = 90;
const DEGRADED_DAYS = [7, 39, 56];
const UPTIME_CELLS = Array.from({ length: DAY_COUNT }, (_, index) => ({
  index,
  isDegraded: DEGRADED_DAYS.includes(index),
}));
const OPERATIONAL_DAYS = DAY_COUNT - DEGRADED_DAYS.length;

const INCIDENTS = [
  {
    date: "2026-10-17",
    title: "Elevated replay queue latency",
    duration: "18 min",
    detail:
      "A sandbox pool in eu-central-1 restarted twice. Queued replays drained in order and no captures were lost.",
  },
  {
    date: "2026-09-30",
    title: "Capture ingest lag in ap-southeast-1",
    duration: "11 min",
    detail:
      "A regional queue backed up during a provider failover. Records arrived late but complete, with original timestamps intact.",
  },
  {
    date: "2026-08-29",
    title: "Webhook retries delayed",
    duration: "42 min",
    detail:
      "Delivery retries backed up behind a provider incident. Every event was delivered once, in order, after the queue drained.",
  },
];

export default function StatusPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="border-b border-rule">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-8 lg:py-20">
            <p className="font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">
              Status
            </p>
            <h1 className="display mt-4 max-w-[22ch] text-[clamp(2.6rem,6vw,4.4rem)] text-ink">
              The whole capture path, on the <em>record</em>.
            </h1>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-ink-soft">
              Health is measured from outside each region, once a minute.
              Latency is p95 over the last five minutes.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1200px] px-5 py-10 sm:px-8 lg:py-14">
          <div className="rounded-2xl border border-rule bg-paper-2 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="live-dot size-2.5 rounded-full bg-ok"
                />
                <h2 className="display text-[clamp(1.8rem,3.6vw,2.5rem)] text-ink">
                  All systems normal
                </h2>
              </div>
              <p className="font-mono text-[10px] tracking-[0.08em] text-ink-faint uppercase">
                checked 19 Nov 2026 · 09:41 UTC
              </p>
            </div>
            <p className="mt-3 max-w-[56ch] text-[13.5px] leading-relaxed text-ink-soft">
              No active incidents. Capture ingest is running at 100 percent
              sample rate across all fourteen regions, and the replay queue is
              empty.
            </p>
          </div>

          <h2 className="mt-10 font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">
            Components
          </h2>
          <ul className="mt-4 divide-y divide-rule overflow-hidden rounded-2xl border border-rule">
            {COMPONENTS.map((component) => (
              <li
                key={component.name}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <h3 className="text-[14px] font-medium text-ink">
                    {component.name}
                  </h3>
                  <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
                    {component.detail}
                  </p>
                </div>
                <div className="flex items-center gap-6 font-mono text-[11px]">
                  <span className="text-ink-faint tabular-nums" data-numeric>
                    {component.latency}
                  </span>
                  <span className="flex items-center gap-2 text-ok">
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full bg-ok"
                    />
                    {component.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">
              90-day uptime
            </h2>
            <p className="font-mono text-[10px] tracking-[0.08em] text-ink-faint uppercase">
              last 90 days · 22 Aug – 19 Nov 2026
            </p>
          </div>

          <div
            aria-hidden="true"
            className="mt-4 grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1 sm:grid-cols-[repeat(30,minmax(0,1fr))]"
          >
            {UPTIME_CELLS.map((cell) => (
              <span
                key={cell.index}
                className={`aspect-square rounded-[2px] ${
                  cell.isDegraded ? "bg-warn" : "bg-ok"
                }`}
              />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] text-ink-faint">
            <p>
              {OPERATIONAL_DAYS} of 90 days fully operational ·{" "}
              {DEGRADED_DAYS.length} degraded · 0 outages
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-ok"
                />
                operational
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-warn"
                />
                degraded
              </span>
            </div>
          </div>

          <h2 className="mt-12 font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">
            Resolved incidents
          </h2>
          <ol className="mt-4 border-t border-rule">
            {INCIDENTS.map((incident) => (
              <li key={incident.title} className="border-b border-rule">
                <article className="grid gap-3 py-6 sm:grid-cols-[130px_minmax(0,1fr)] sm:gap-8">
                  <div>
                    <time
                      dateTime={incident.date}
                      className="font-mono text-[10px] tracking-[0.08em] text-ink-faint uppercase"
                    >
                      {incident.date}
                    </time>
                    <p className="mt-1 font-mono text-[10px] text-ink-faint">
                      {incident.duration}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-ink">
                      {incident.title}
                    </h3>
                    <p className="mt-1.5 max-w-[64ch] text-[13.5px] leading-relaxed text-ink-soft">
                      {incident.detail}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ol>

          <p className="mt-8 font-mono text-[10px] tracking-[0.04em] text-ink-faint">
            need the raw feed?{" "}
            <Link href="/docs/api" className="text-signal-deep hover:text-ink">
              use GET /v1/captures for capture health
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
