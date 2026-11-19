import { formatDuration, type Span } from "@/lib/requests";

const BAR_TONE: Record<Span["status"], string> = {
  ok: "bg-ink/55",
  slow: "bg-warn",
  error: "bg-signal",
};

const TEXT_TONE: Record<Span["status"], string> = {
  ok: "text-ink-soft",
  slow: "text-warn",
  error: "text-signal",
};

export function TraceWaterfall({
  spans,
  totalMs,
}: {
  spans: Span[];
  totalMs: number;
}) {
  const scale = Math.max(totalMs, 1);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, var(--color-rule) 0 1px, transparent 1px 25%)",
        }}
      />

      <div className="relative space-y-2.5">
        {spans.map((span) => {
          const left = (span.startMs / scale) * 100;
          const width = Math.max((span.durationMs / scale) * 100, 1);

          return (
            <div
              key={span.id}
              className="grid grid-cols-[minmax(0,1fr)_3.75rem] items-center gap-3"
            >
              <div className="min-w-0">
                <div className="mb-1 flex items-baseline gap-2">
                  <span
                    className={`truncate font-mono text-[11px] ${TEXT_TONE[span.status]}`}
                  >
                    {span.name}
                  </span>
                  <span className="shrink-0 font-mono text-[9px] tracking-[0.06em] text-ink-faint uppercase">
                    {span.service}
                  </span>
                </div>
                <div className="relative h-2 rounded-full bg-paper-3">
                  <div
                    className={`absolute inset-y-0 rounded-full ${BAR_TONE[span.status]}`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                </div>
              </div>
              <span className="text-right font-mono text-[10px] text-ink-soft tabular-nums">
                {formatDuration(span.durationMs)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-between border-t border-rule pt-2 font-mono text-[9px] text-ink-faint tabular-nums">
        <span>0</span>
        <span>{formatDuration(scale * 0.5)}</span>
        <span>{formatDuration(scale)}</span>
      </div>
    </div>
  );
}
