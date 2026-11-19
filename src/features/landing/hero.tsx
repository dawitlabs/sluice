import Link from "next/link";
import { TraceDemo } from "./trace-demo";

const FACTS = [
  { value: "1,310ms → 214ms", label: "fix verified on the real request" },
  { value: "0", label: "production calls re-sent by a replay" },
  { value: "1 line", label: "to start capturing every span" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-rule">
      <div aria-hidden="true" className="bp absolute inset-0 opacity-60" />

      <div className="relative mx-auto grid w-full max-w-[1200px] gap-12 px-5 pt-14 pb-16 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14 lg:pt-24 lg:pb-20">
        <div data-reveal className="reveal">
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">
            <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
            Request-level observability
          </p>

          <h1 className="display mt-5 text-[clamp(2.9rem,7.4vw,4.9rem)] text-ink">
            Watch the request
            <br />
            <em>break.</em> Replay it
            <br />
            fixed.
          </h1>

          <p className="mt-6 max-w-[38ch] text-[15px] leading-relaxed text-ink-soft sm:text-base">
            Sluice captures the exact request that failed in production — headers,
            body, and every span underneath — then replays it against your branch
            in one command.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/console"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-signal-deep"
            >
              Open the console
            </Link>
            <a
              href="#how"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-rule-strong px-5 text-sm text-ink transition-colors hover:border-ink hover:bg-paper-2"
            >
              See a replay
              <span aria-hidden="true" className="font-mono text-xs">
                ↓
              </span>
            </a>
          </div>

          <p className="mt-6 font-mono text-[10px] tracking-[0.04em] text-ink-faint">
            no agent · no sampling · payloads stay in your VPC
          </p>
        </div>

        <div data-reveal className="reveal" style={{ transitionDelay: "120ms" }}>
          <TraceDemo />
          <p className="mt-3 text-center font-mono text-[10px] tracking-[0.06em] text-ink-faint">
            live demo — hit replay
          </p>
        </div>
      </div>

      <div className="relative border-t border-rule">
        <dl className="mx-auto grid w-full max-w-[1200px] grid-cols-1 divide-y divide-rule px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          {FACTS.map((fact) => (
            <div key={fact.label} className="py-5 sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <dt className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
                {fact.label}
              </dt>
              <dd className="mt-2 font-mono text-sm text-ink tabular-nums">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
