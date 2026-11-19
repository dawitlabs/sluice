"use client";

import { useActionState } from "react";
import {
  type ActionResult,
  addRedactionAction,
  removeRedactionAction,
} from "@/lib/actions";
import type { RedactionRow } from "@/lib/data";

const INITIAL: ActionResult = { status: "idle" };

function RemoveRule({ ruleId, pattern }: { ruleId: string; pattern: string }) {
  const [state, formAction, isPending] = useActionState(
    removeRedactionAction,
    INITIAL,
  );

  return (
    <form action={formAction} className="shrink-0">
      <input type="hidden" name="ruleId" value={ruleId} />
      <button
        type="submit"
        disabled={isPending}
        aria-label={`Remove redaction rule ${pattern}`}
        className="font-mono text-[10px] tracking-[0.06em] text-ink-faint uppercase transition-colors hover:text-signal disabled:opacity-60"
      >
        {isPending ? "removing" : "remove"}
      </button>
      {state.status === "error" ? (
        <span role="alert" className="ml-2 font-mono text-[10px] text-signal">
          {state.message}
        </span>
      ) : null}
    </form>
  );
}

export function RedactionManager({ rules }: { rules: RedactionRow[] }) {
  const [state, formAction, isPending] = useActionState(
    addRedactionAction,
    INITIAL,
  );

  return (
    <div>
      <form action={formAction} className="flex flex-wrap items-end gap-2">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="pattern"
            className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase"
          >
            new pattern
          </label>
          <input
            id="pattern"
            name="pattern"
            placeholder="card.number"
            required
            minLength={2}
            maxLength={64}
            className="mt-2 h-10 w-full rounded-lg border border-rule bg-paper px-3 font-mono text-[12px] text-ink placeholder:text-ink-faint focus-visible:border-signal"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center rounded-full border border-rule-strong px-4 font-mono text-[10px] tracking-[0.08em] text-ink uppercase transition-colors hover:border-ink disabled:opacity-60"
        >
          {isPending ? "adding…" : "add rule"}
        </button>
      </form>

      {state.status === "ok" ? (
        <output className="mt-2 block font-mono text-[10px] text-ok">
          {state.message}
        </output>
      ) : null}
      {state.status === "error" ? (
        <p role="alert" className="mt-2 font-mono text-[10px] text-signal">
          {state.message}
        </p>
      ) : null}

      <ul className="mt-4 divide-y divide-rule border-y border-rule">
        {rules.length === 0 ? (
          <li className="py-4 font-mono text-[11px] text-ink-faint">
            no rules — every header and field is stored as captured
          </li>
        ) : null}
        {rules.map((rule) => (
          <li
            key={rule.id}
            className="flex items-center justify-between gap-3 py-2.5"
          >
            <span className="min-w-0 truncate font-mono text-[11px] text-ink">
              {rule.pattern}
            </span>
            <RemoveRule ruleId={rule.id} pattern={rule.pattern} />
          </li>
        ))}
      </ul>
    </div>
  );
}
