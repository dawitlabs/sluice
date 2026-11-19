const TONES = {
  ok: "text-ok",
  warn: "text-warn",
  error: "text-signal",
} as const;

function toneForStatus(status: number): keyof typeof TONES {
  if (status >= 500) return "error";
  if (status >= 400) return "warn";
  return "ok";
}

const DOTS = {
  ok: "bg-ok",
  warn: "bg-warn",
  error: "bg-signal",
} as const;

export function StatusPill({ status }: { status: number }) {
  const tone = toneForStatus(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-xs tabular-nums ${TONES[tone]}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${DOTS[tone]}`}
      />
      <span className="sr-only">status </span>
      {status}
    </span>
  );
}

export function MethodTag({ method }: { method: string }) {
  return (
    <span className="inline-flex shrink-0 items-center font-mono text-[10px] font-medium tracking-[0.08em] text-ink-soft">
      {method}
    </span>
  );
}
