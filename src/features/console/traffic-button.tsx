"use client";

import { useActionState, useEffect } from "react";
import { useToast } from "@/components/toast";
import { type ActionResult, sendTrafficAction } from "@/lib/actions";

const INITIAL: ActionResult = { status: "idle" };

export function TrafficButton() {
  const { push } = useToast();
  const [state, formAction, isPending] = useActionState(
    sendTrafficAction,
    INITIAL,
  );

  useEffect(() => {
    if (state.status === "ok") push(state.message ?? "captures arrived");
    if (state.status === "error")
      push(state.message ?? "ingest failed", "error");
  }, [state, push]);

  return (
    <form action={formAction}>
      <input type="hidden" name="count" value="3" />
      <button
        type="submit"
        disabled={isPending}
        className="group inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-ink px-4 font-mono text-[10px] tracking-[0.08em] text-paper uppercase transition-colors hover:bg-signal-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          aria-hidden="true"
          className={`size-1.5 rounded-full bg-signal ${isPending ? "live-dot" : ""}`}
        />
        {isPending ? "sending…" : "send traffic"}
      </button>
    </form>
  );
}
