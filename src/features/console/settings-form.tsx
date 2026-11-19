"use client";

import { useActionState } from "react";
import { type ActionResult, updateSettingsAction } from "@/lib/actions";

const INITIAL: ActionResult = { status: "idle" };

export function SettingsForm({
  retentionDays,
  autoReplay,
}: {
  retentionDays: number;
  autoReplay: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    updateSettingsAction,
    INITIAL,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="retentionDays"
          className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase"
        >
          retention · days
        </label>
        <input
          id="retentionDays"
          name="retentionDays"
          type="number"
          min={1}
          max={365}
          step={1}
          defaultValue={retentionDays}
          className="mt-2 h-10 w-32 rounded-lg border border-rule bg-paper px-3 font-mono text-[12px] text-ink tabular-nums focus-visible:border-signal"
        />
        <p className="mt-1.5 font-mono text-[10px] text-ink-faint">
          captures older than this drop out of the window
        </p>
      </div>

      <label className="flex items-start gap-2.5">
        <input
          type="checkbox"
          name="autoReplay"
          defaultChecked={autoReplay}
          className="mt-0.5 size-4 rounded-xs accent-signal"
        />
        <span className="text-[13px] leading-relaxed text-ink-soft">
          Replay every new 5xx automatically against the latest release
          <span className="mt-0.5 block font-mono text-[10px] text-ink-faint">
            results land in replays, nothing is committed
          </span>
        </span>
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition-colors hover:bg-signal-deep disabled:opacity-60"
        >
          {isPending ? "saving…" : "Save settings"}
        </button>
        {state.status === "ok" ? (
          <output className="font-mono text-[10px] text-ok">
            {state.message}
          </output>
        ) : null}
        {state.status === "error" ? (
          <span role="alert" className="font-mono text-[10px] text-signal">
            {state.message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
