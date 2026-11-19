"use client";

import Link from "next/link";

export default function ConsoleError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-5">
      <div className="w-full max-w-md rounded-2xl border border-rule bg-paper p-7">
        <p className="font-mono text-[10px] tracking-[0.12em] text-signal uppercase">
          capture stream interrupted
        </p>
        <h1 className="display mt-3 text-[2rem] text-ink">
          The console lost the stream.
        </h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
          Retrying reconnects to the capture store. Your filters and open capture
          are restored with it.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition-colors hover:bg-signal-deep"
          >
            Retry
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-full border border-rule-strong px-5 text-[13px] text-ink transition-colors hover:border-ink"
          >
            Back to site
          </Link>
        </div>
        <p className="mt-5 border-t border-rule pt-3 font-mono text-[10px] text-ink-faint">
          {error instanceof Error ? "error logged · ref suppressed" : "unexpected state"}
        </p>
      </div>
    </div>
  );
}
