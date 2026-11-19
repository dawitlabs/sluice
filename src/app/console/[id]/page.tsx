import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StatusPill } from "@/components/status-pill";
import { ListSkeleton } from "@/features/console/list-skeleton";
import { ReplayPanel } from "@/features/console/replay-panel";
import { TraceWaterfall } from "@/features/console/trace-waterfall";
import { ensureProject, getCapture, getLatestReplay } from "@/lib/data";
import { formatClock, formatDuration } from "@/lib/format";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Capture — Sluice",
  description: "Span tree, payloads and replay for one captured request.",
};

async function Capture({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const project = await ensureProject(user.id);
  const [capture, latestReplay] = await Promise.all([
    getCapture(project.id, id),
    getLatestReplay(project.id, id),
  ]);

  if (!capture) notFound();

  const timelineEnd = capture.spans.reduce(
    (end, span) => Math.max(end, span.startMs + span.durationMs),
    0,
  );
  const bottleneck = capture.spans
    .filter((span) => span.startMs > 0)
    .reduce(
      (worst, span) => (span.durationMs > worst.durationMs ? span : worst),
      capture.spans[0],
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/console"
          className="font-mono text-[10px] tracking-[0.08em] text-ink-soft uppercase transition-colors hover:text-ink"
        >
          ← captures
        </Link>
        <span className="font-mono text-[10px] text-ink-faint">
          {capture.id}
        </span>
      </div>

      <header className="rounded-xl border border-rule bg-paper">
        <div className="flex flex-wrap items-center gap-3 border-b border-rule px-4 py-3">
          <span className="rounded-xs bg-paper-3 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-ink-soft">
            {capture.method}
          </span>
          <h2 className="min-w-0 truncate font-mono text-[13px] text-ink">
            {capture.path}
          </h2>
          <span className="ml-auto flex items-center gap-3">
            {capture.replayed ? (
              <span className="rounded-full border border-signal/40 px-2 py-0.5 font-mono text-[9px] tracking-[0.08em] text-signal-deep uppercase">
                replayed
              </span>
            ) : null}
            <StatusPill status={capture.status} />
            <span className="font-mono text-xs text-ink tabular-nums">
              {formatDuration(capture.durationMs)}
            </span>
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-4">
          {[
            {
              label: "caught at",
              value: `${formatClock(new Date(capture.at))} UTC`,
            },
            { label: "region", value: capture.region },
            { label: "release", value: capture.release },
            {
              label: "spans",
              value: String(capture.spans.length),
            },
          ].map((item) => (
            <div key={item.label} className="bg-paper px-4 py-2.5">
              <dt className="font-mono text-[9px] tracking-[0.1em] text-ink-faint uppercase">
                {item.label}
              </dt>
              <dd className="mt-1 truncate font-mono text-[11px] text-ink">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-rule bg-paper p-4">
          <h2 className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
            trace
          </h2>
          <div className="mt-4">
            <TraceWaterfall spans={capture.spans} totalMs={timelineEnd} />
          </div>

          {bottleneck ? (
            <p className="mt-4 border-t border-rule pt-3 font-mono text-[10px] text-ink-faint">
              bottleneck{" "}
              <span className="text-signal-deep">{bottleneck.name}</span> ·{" "}
              {formatDuration(bottleneck.durationMs)} of{" "}
              {formatDuration(capture.durationMs)} ·{" "}
              {Math.round(
                (bottleneck.durationMs / Math.max(capture.durationMs, 1)) * 100,
              )}
              % of wall time
            </p>
          ) : null}

          <table className="mt-5 w-full border-collapse text-left font-mono text-[10px]">
            <caption className="sr-only">Span ledger</caption>
            <thead>
              <tr className="border-y border-rule text-ink-faint">
                <th scope="col" className="py-1.5 font-normal">
                  span
                </th>
                <th scope="col" className="py-1.5 font-normal">
                  service
                </th>
                <th scope="col" className="py-1.5 text-right font-normal">
                  start
                </th>
                <th scope="col" className="py-1.5 text-right font-normal">
                  dur
                </th>
              </tr>
            </thead>
            <tbody>
              {capture.spans.map((span) => (
                <tr key={span.id} className="border-b border-rule/70">
                  <td className="max-w-[13rem] truncate py-1.5 text-ink-soft">
                    {span.name}
                  </td>
                  <td className="py-1.5 text-ink-faint">{span.service}</td>
                  <td className="py-1.5 text-right text-ink-faint tabular-nums">
                    {formatDuration(span.startMs)}
                  </td>
                  <td className="py-1.5 text-right text-ink tabular-nums">
                    {formatDuration(span.durationMs)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="space-y-4">
          <ReplayPanel
            captureId={capture.id}
            originalDurationMs={capture.durationMs}
            originalStatus={capture.status}
            latestReplay={latestReplay}
          />

          <section className="rounded-xl border border-rule bg-paper p-4">
            <h2 className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
              request body
            </h2>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-rule bg-paper-2 p-3 font-mono text-[11px] leading-relaxed text-ink-soft">
              <code>{capture.requestBody}</code>
            </pre>
            <h2 className="mt-4 font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
              response body
            </h2>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-rule bg-paper-2 p-3 font-mono text-[11px] leading-relaxed text-ink-soft">
              <code>{capture.responseBody}</code>
            </pre>
            <p className="mt-3 font-mono text-[10px] text-ink-faint">
              authorization, cookie and card fields are redacted before storage
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function CapturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<ListSkeleton rows={4} label="loading capture…" />}>
      <Capture params={params} />
    </Suspense>
  );
}
