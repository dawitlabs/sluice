"use client";

import { useActionState } from "react";
import { type ActionResult, toggleAlertAction } from "@/lib/actions";

const INITIAL: ActionResult = { status: "idle" };

export function AlertToggle({
  alertId,
  name,
  enabled,
}: {
  alertId: string;
  name: string;
  enabled: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    toggleAlertAction,
    INITIAL,
  );

  return (
    <div className="flex items-center gap-3">
      <form action={formAction}>
        <input type="hidden" name="alertId" value={alertId} />
        <button
          type="submit"
          role="switch"
          aria-checked={enabled}
          aria-label={`Toggle alert ${name}`}
          disabled={isPending}
          className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors disabled:opacity-60 ${
            enabled ? "border-ink bg-ink" : "border-rule-strong bg-paper-3"
          }`}
        >
          <span
            aria-hidden="true"
            className={`absolute top-[3px] size-3.5 rounded-full bg-paper transition-all ${
              enabled ? "left-[18px]" : "left-[3px]"
            }`}
          />
        </button>
      </form>
      <span
        className={`font-mono text-[10px] tracking-[0.08em] uppercase ${
          enabled ? "text-ok" : "text-ink-faint"
        }`}
      >
        {enabled ? "enabled" : "paused"}
      </span>
      {state.status === "error" ? (
        <span role="alert" className="font-mono text-[10px] text-signal">
          {state.message}
        </span>
      ) : null}
    </div>
  );
}
