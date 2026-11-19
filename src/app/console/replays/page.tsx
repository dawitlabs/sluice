import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { StatusPill } from "@/components/status-pill";
import { ListSkeleton } from "@/features/console/list-skeleton";
import { ensureProject, listReplays } from "@/lib/data";
import { formatClock, formatDuration } from "@/lib/format";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Replays — Sluice",
  description: "Every capture replayed against a branch.",
};

async function Replays() {
  const user = await requireUser();
  const project = await ensureProject(user.id);
  const rows = await listReplays(project.id);

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-rule px-6 py-16 text-center">
        <p className="font-mono text-[11px] tracking-[0.1em] text-ink-faint uppercase">
          no replays yet
        </p>
        <p className="mx-auto mt-3 max-w-[40ch] text-[13px] leading-relaxed text-ink-soft">
          Open any capture and hit replay. The sandbox result lands here with
          the before and after measurements.
        </p>
        <Link
          href="/console"
          className="mt-5 inline-flex h-9 items-center rounded-full border border-rule-strong px-4 font-mono text-[10px] tracking-[0.08em] text-ink uppercase transition-colors hover:border-ink"
        >
          browse captures
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-rule bg-paper">
      <div className="grid grid-cols-[minmax(0,1fr)_6.5rem_1fr_5rem] gap-3 border-b border-rule bg-paper-2 px-4 py-2 font-mono text-[9px] tracking-[0.1em] text-ink-faint uppercase sm:grid-cols-[minmax(0,1fr)_6.5rem_7rem_6rem_5rem]">
        <span>capture</span>
        <span>result</span>
        <span className="hidden sm:block">wall</span>
        <span className="hidden sm:block">release</span>
        <span className="text-right">at</span>
      </div>

      <ul className="divide-y divide-rule">
        {rows.map((replay) => {
          const delta = Math.round(
            (1 - replay.durationMs / Math.max(replay.originalDurationMs, 1)) *
              100,
          );

          return (
            <li key={replay.id}>
              <Link
                href={`/console/${replay.captureId}`}
                className="grid grid-cols-[minmax(0,1fr)_6.5rem_1fr_5rem] items-center gap-3 px-4 py-2.5 transition-colors hover:bg-paper-2 sm:grid-cols-[minmax(0,1fr)_6.5rem_7rem_6rem_5rem]"
              >
                <span className="flex min-w-0 items-baseline gap-2">
                  <span className="font-mono text-[10px] text-ink-faint">
                    {replay.method}
                  </span>
                  <span className="truncate font-mono text-[11.5px] text-ink">
                    {replay.path}
                  </span>
                </span>

                <span className="flex items-center gap-2">
                  <StatusPill status={replay.originalStatus} />
                  <span aria-hidden="true" className="text-ink-faint">
                    →
                  </span>
                  <StatusPill status={replay.status} />
                </span>

                <span className="hidden font-mono text-[10px] text-ink-soft tabular-nums sm:block">
                  {formatDuration(replay.originalDurationMs)} →{" "}
                  {formatDuration(replay.durationMs)}
                  {delta > 0 ? (
                    <span className="ml-2 text-signal-deep">−{delta}%</span>
                  ) : null}
                </span>

                <span className="hidden truncate font-mono text-[10px] text-ink-faint sm:block">
                  {replay.release}
                </span>

                <span className="text-right font-mono text-[10px] text-ink-faint tabular-nums">
                  {formatClock(new Date(replay.createdAt))}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function ReplaysPage() {
  return (
    <Suspense fallback={<ListSkeleton rows={3} label="loading replays…" />}>
      <Replays />
    </Suspense>
  );
}
