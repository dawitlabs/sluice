"use client";

import { useActionState, useEffect } from "react";
import { useToast } from "@/components/toast";
import { type ReplayResult, replayCaptureAction } from "@/lib/actions";
import type { LatestReplay } from "@/lib/data";
import { formatDuration } from "@/lib/format";

const INITIAL: ReplayResult = { status: "idle" };

export function ReplayPanel({
  captureId,
  originalDurationMs,
  originalStatus,
  latestReplay,
}: {
  captureId: string;
  originalDurationMs: number;
  originalStatus: number;
  latestReplay: LatestReplay | null;
}) {
  const [state, formAction, isPending] = useActionState(
    replayCaptureAction,
    INITIAL,
  );
  const { push } = useToast();

  useEffect(() => {
    if (state.status === "ok" && state.durationMs !== undefined) {
      push(`replay passed in ${formatDuration(state.durationMs)}`);
    }
    if (state.status === "error") {
      push(state.message ?? "replay failed", "error");
    }
  }, [state, push]);

  return (
    <div className="rounded-xl border border-rule bg-paper p-4">
      <h2 className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
        replay sandbox
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
        In this deployment the result below is{" "}
        <span className="font-mono text-[12px] text-ink">derived</span> from the
        capture rather than executed: no container runs your code. Production is
        never called and no row is committed.
      </p>

      <form action={formAction} className="mt-4">
        <input type="hidden" name="captureId" value={captureId} />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-signal px-5 text-[13px] font-medium text-paper transition-colors hover:bg-signal-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "replaying…"
            : latestReplay
              ? "Replay again"
              : "Replay this capture"}
        </button>
      </form>

      {state.status === "error" ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-signal/40 bg-signal-soft px-3 py-2 text-[12px] text-signal-deep"
        >
          {state.message}
        </p>
      ) : null}

      {latestReplay ? (
        <div className="mt-4 overflow-hidden rounded-lg border border-rule">
          <div className="flex items-center justify-between border-b border-rule bg-paper-2 px-3 py-2 font-mono text-[10px] text-ink-faint uppercase">
            <span>sandbox result · simulated</span>
            <span
              className={latestReplay.status < 400 ? "text-ok" : "text-signal"}
            >
              {latestReplay.status < 400 ? "pass" : "fail"}
            </span>
          </div>
          <dl className="space-y-1.5 px-3 py-3 font-mono text-[11px]">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-faint">status</dt>
              <dd>
                <span className="text-ink-soft line-through">
                  {originalStatus}
                </span>{" "}
                <span
                  className={
                    latestReplay.status < 400 ? "text-ok" : "text-signal"
                  }
                >
                  {latestReplay.status}
                </span>
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-faint">wall</dt>
              <dd className="text-ink-soft tabular-nums">
                {formatDuration(originalDurationMs)} →{" "}
                <span className="text-ink">
                  {formatDuration(latestReplay.durationMs)}
                </span>
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-faint">release</dt>
              <dd className="truncate text-ink-soft">{latestReplay.release}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-faint">replay id</dt>
              <dd className="text-ink-soft">{latestReplay.id}</dd>
            </div>
          </dl>
          <div className="border-t border-rule px-3 py-2 font-mono text-[10px]">
            <a
              href="/console/replays"
              className="text-ink-soft underline decoration-rule-strong underline-offset-2 hover:text-ink"
            >
              every replay for this project →
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
