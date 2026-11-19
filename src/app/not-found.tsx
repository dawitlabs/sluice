import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-paper px-5">
      <div className="w-full max-w-lg">
        <p className="font-mono text-[10px] tracking-[0.12em] text-signal uppercase">
          404 · route not captured
        </p>
        <h1 className="display mt-4 text-[clamp(2.4rem,6vw,3.6rem)] text-ink">
          Nothing lives on this <em>path</em>.
        </h1>
        <p className="mt-4 max-w-[42ch] text-[14px] leading-relaxed text-ink-soft">
          The URL resolved to no route. If you expected a capture here, the id
          may have aged out of the seven-day window.
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition-colors hover:bg-signal-deep"
          >
            Back to site
          </Link>
          <Link
            href="/console"
            className="inline-flex h-10 items-center rounded-full border border-rule-strong px-5 text-[13px] text-ink transition-colors hover:border-ink"
          >
            Open console
          </Link>
        </div>
      </div>
    </main>
  );
}
