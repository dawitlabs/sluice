import Link from "next/link";
import { MethodTag, StatusPill } from "@/components/status-pill";
import type { CaptureSummary } from "@/lib/data";
import { formatClock, formatDuration } from "@/lib/format";

const MAX_BAR_MS = 2400;

const ROW_GRID =
  "grid grid-cols-[2.8rem_minmax(0,1fr)_2.8rem_3.6rem] items-center gap-2 px-3 sm:grid-cols-[3.5rem_minmax(0,1fr)_3.5rem_5.5rem_4.5rem_6.5rem_4.5rem] sm:gap-3 sm:px-4";

export function CaptureTable({
  captures,
  activeId,
  retentionDays,
}: {
  captures: CaptureSummary[];
  activeId?: string;
  retentionDays: number;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-rule bg-paper">
      <div
        aria-hidden="true"
        className={`hidden border-b border-rule bg-paper-2 py-2 font-mono text-[9px] tracking-[0.1em] text-ink-faint uppercase sm:grid ${ROW_GRID}`}
      >
        <span>method</span>
        <span>path</span>
        <span>status</span>
        <span className="text-right">wall</span>
        <span className="hidden lg:block">region</span>
        <span className="hidden lg:block">release</span>
        <span className="text-right">time</span>
      </div>

      <ul className="divide-y divide-rule">
        {captures.map((capture) => (
          <li key={capture.id}>
            <Link
              href={`/console/${capture.id}`}
              aria-current={activeId === capture.id ? "page" : undefined}
              className={`${ROW_GRID} w-full py-2.5 transition-colors hover:bg-paper-2 aria-[current=page]:bg-paper-2`}
            >
              <MethodTag method={capture.method} />
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate font-mono text-[11.5px] text-ink">
                  {capture.path}
                </span>
                {capture.replayed ? (
                  <span className="hidden shrink-0 rounded-full border border-signal/40 px-1.5 py-px font-mono text-[8px] tracking-[0.08em] text-signal-deep uppercase sm:inline">
                    replay
                  </span>
                ) : null}
              </span>
              <StatusPill status={capture.status} />
              <span className="flex items-center justify-end gap-2">
                <span
                  aria-hidden="true"
                  className="hidden h-1 w-7 overflow-hidden rounded-full bg-paper-3 sm:block"
                >
                  <span
                    className={`block h-1 rounded-full ${
                      capture.durationMs >= 1000
                        ? "bg-signal"
                        : capture.durationMs >= 400
                          ? "bg-warn"
                          : "bg-ink/45"
                    }`}
                    style={{
                      width: `${Math.min((capture.durationMs / MAX_BAR_MS) * 100, 100)}%`,
                    }}
                  />
                </span>
                <span className="font-mono text-[10px] text-ink-soft tabular-nums">
                  {formatDuration(capture.durationMs)}
                </span>
              </span>
              <span className="hidden font-mono text-[10px] text-ink-faint lg:block">
                {capture.region}
              </span>
              <span className="hidden truncate font-mono text-[10px] text-ink-faint lg:block">
                {capture.release}
              </span>
              <span className="hidden text-right font-mono text-[10px] text-ink-faint tabular-nums sm:block">
                {formatClock(new Date(capture.at))}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="border-t border-rule bg-paper-2 px-4 py-2 text-center font-mono text-[9px] tracking-[0.1em] text-ink-faint uppercase">
        end of window · retention {retentionDays}d
      </div>
    </div>
  );
}
