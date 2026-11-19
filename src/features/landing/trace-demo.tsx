"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { StatusPill } from "@/components/status-pill";
import { formatDuration } from "@/lib/format";

type DemoStatus = "ok" | "slow" | "error";

type DemoSpan = {
  id: string;
  name: string;
  service: string;
  startMs: number;
  durationMs: number;
  status: DemoStatus;
};

type DemoMode = "original" | "replayed";

const ORIGINAL_SPANS: DemoSpan[] = [
  {
    id: "o1",
    name: "edge.handler",
    service: "vercel",
    startMs: 0,
    durationMs: 1310,
    status: "ok",
  },
  {
    id: "o2",
    name: "auth.session",
    service: "app",
    startMs: 4,
    durationMs: 11,
    status: "ok",
  },
  {
    id: "o3",
    name: "cart.revalidate",
    service: "app",
    startMs: 16,
    durationMs: 38,
    status: "ok",
  },
  {
    id: "o4",
    name: "db.select orders",
    service: "postgres",
    startMs: 55,
    durationMs: 24,
    status: "ok",
  },
  {
    id: "o5",
    name: "stripe.charge",
    service: "stripe",
    startMs: 96,
    durationMs: 1147,
    status: "error",
  },
  {
    id: "o6",
    name: "response.serialize",
    service: "app",
    startMs: 1258,
    durationMs: 52,
    status: "ok",
  },
];

const REPLAYED_SPANS: DemoSpan[] = [
  {
    id: "r1",
    name: "edge.handler",
    service: "vercel",
    startMs: 0,
    durationMs: 214,
    status: "ok",
  },
  {
    id: "r2",
    name: "auth.session",
    service: "app",
    startMs: 3,
    durationMs: 10,
    status: "ok",
  },
  {
    id: "r3",
    name: "cart.revalidate",
    service: "app",
    startMs: 15,
    durationMs: 34,
    status: "ok",
  },
  {
    id: "r4",
    name: "db.select orders",
    service: "postgres",
    startMs: 51,
    durationMs: 21,
    status: "ok",
  },
  {
    id: "r5",
    name: "stripe.charge",
    service: "stripe",
    startMs: 74,
    durationMs: 118,
    status: "ok",
  },
  {
    id: "r6",
    name: "response.serialize",
    service: "app",
    startMs: 194,
    durationMs: 19,
    status: "ok",
  },
];

const MODES: Record<
  DemoMode,
  { status: number; totalMs: number; spans: DemoSpan[]; release: string }
> = {
  original: {
    status: 504,
    totalMs: 1310,
    spans: ORIGINAL_SPANS,
    release: "main · a41c9e2",
  },
  replayed: {
    status: 200,
    totalMs: 214,
    spans: REPLAYED_SPANS,
    release: "fix/charge-timeout",
  },
};

const BAR_TONE = {
  ok: "bg-ink/70",
  slow: "bg-warn",
  error: "bg-signal",
} as const;

export function TraceDemo() {
  const [mode, setMode] = useState<DemoMode>("original");
  const [run, setRun] = useState(0);
  const active = MODES[mode];

  function handleSelect(next: DemoMode) {
    setMode(next);
    setRun((count) => count + 1);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-rule bg-paper">
      <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">
          <span
            className="live-dot size-1.5 rounded-full bg-signal"
            aria-hidden="true"
          />
          capture · live
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={active.status} />
          <span className="font-mono text-xs text-ink tabular-nums">
            {formatDuration(active.totalMs)}
          </span>
        </div>
      </div>

      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 font-mono text-[12px]">
          <span className="rounded-xs bg-paper-3 px-1.5 py-0.5 text-[10px] tracking-wide text-ink-soft">
            POST
          </span>
          <span className="truncate text-ink">/v1/checkout/confirm</span>
        </div>
        <div className="mt-1.5 flex gap-3 font-mono text-[10px] text-ink-faint">
          <span>{active.release}</span>
          <span>iad1</span>
          <span>req_9f4c1a</span>
        </div>
      </div>

      <div key={`${mode}-${run}`} className="relative px-4 pb-2">
        <div className="space-y-2.5">
          {active.spans.map((span, index) => {
            const left = (span.startMs / active.totalMs) * 100;
            const width = Math.max(
              (span.durationMs / active.totalMs) * 100,
              1.2,
            );

            return (
              <div
                key={span.id}
                className="grid grid-cols-[minmax(0,1fr)_3.75rem] items-center gap-3"
                style={{
                  animation: "rise 420ms var(--ease-expo) both",
                  animationDelay: `${index * 45}ms`,
                }}
              >
                <div className="min-w-0">
                  <div className="mb-1 flex items-baseline gap-2">
                    <span className="truncate font-mono text-[11px] text-ink">
                      {span.name}
                    </span>
                    <span className="shrink-0 font-mono text-[9px] tracking-[0.08em] text-ink-faint uppercase">
                      {span.service}
                    </span>
                  </div>
                  <div className="relative h-2.5 rounded-full bg-paper-3">
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
        <div
          aria-hidden="true"
          className="playhead pointer-events-none absolute inset-y-0 w-px bg-signal/70"
        />
      </div>

      <div className="flex items-center justify-between px-4 pb-2 font-mono text-[9px] text-ink-faint tabular-nums">
        <span>0ms</span>
        <span>{formatDuration(active.totalMs / 2)}</span>
        <span>{formatDuration(active.totalMs)}</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule px-4 py-3">
        <fieldset
          aria-label="Replay state"
          className="m-0 inline-flex min-w-0 rounded-full border border-rule p-0.5"
        >
          {(["original", "replayed"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={mode === option}
              onClick={() => handleSelect(option)}
              className={`rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.08em] uppercase transition-colors ${
                mode === option
                  ? "bg-ink text-paper"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {option}
            </button>
          ))}
        </fieldset>

        <button
          type="button"
          onClick={() => handleSelect("replayed")}
          className="group inline-flex items-center gap-1.5 rounded-full bg-signal px-3.5 py-1.5 text-[12px] font-medium text-paper transition-colors hover:bg-signal-deep"
        >
          <Play aria-hidden="true" className="size-3" strokeWidth={2.5} />
          Replay on branch
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-rule bg-paper-2 px-4 py-2 font-mono text-[10px]">
        <span className="text-ink-faint">
          {mode === "replayed"
            ? "replayed · no production traffic"
            : "captured · 14:02:11"}
        </span>
        <span
          className={
            mode === "replayed"
              ? "text-signal-deep"
              : "text-ink-faint tabular-nums"
          }
        >
          {mode === "replayed"
            ? "−84% wall time · 504 → 200"
            : "span 5 of 6 is the failure"}
        </span>
      </div>
    </div>
  );
}
