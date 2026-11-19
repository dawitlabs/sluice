import Link from "next/link";

const COLUMNS = [
  {
    heading: "Product",
    links: ["Console", "Replay CLI", "Span capture", "Changelog"],
  },
  {
    heading: "Docs",
    links: ["Quickstart", "Next.js middleware", "Redaction rules", "REST API"],
  },
  {
    heading: "Company",
    links: ["About", "Security", "Status", "Contact"],
  },
];

export function Closing() {
  return (
    <section id="closing" className="scroll-mt-14 bg-ink text-paper">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <p className="font-mono text-[11px] tracking-[0.12em] text-paper/50 uppercase">
          Install · capture · replay
        </p>
        <h2 className="display mt-5 max-w-[30ch] text-[clamp(2.6rem,6.6vw,4.8rem)] text-paper">
          The next incident should arrive <em className="text-signal">already solved</em>.
        </h2>
        <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-paper/70">
          Add the middleware, let it capture for a week, then watch your p1s turn
          into single-line diffs against a branch.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="/console"
            className="inline-flex h-11 items-center rounded-full bg-paper px-6 text-sm font-medium text-ink transition-colors hover:bg-white"
          >
            Open the console
          </Link>
          <a
            href="#docs"
            className="inline-flex h-11 items-center rounded-full border border-paper/25 px-5 text-sm text-paper transition-colors hover:border-paper/60"
          >
            Read the install guide
          </a>
        </div>

        <p className="mt-8 font-mono text-[11px] text-paper/45">
          <span className="text-signal">$</span> sluice init --framework next
          <span className="ml-3 text-paper/30">40 seconds, no agent</span>
        </p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-rule bg-paper">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(3,0.6fr)]">
          <div>
            <p className="display text-[22px] text-ink">Sluice</p>
            <p className="mt-3 max-w-[30ch] text-[13px] leading-relaxed text-ink-soft">
              Request-level observability for teams that would rather replay the
              bug than reproduce it.
            </p>
            <p className="mt-4 font-mono text-[10px] text-ink-faint">
              status: <span className="text-ok">all systems normal</span>
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading} id={column.heading === "Docs" ? "docs" : undefined}>
              <h2 className="font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">
                {column.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] text-ink-soft transition-colors hover:text-ink"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-6 font-mono text-[10px] text-ink-faint">
          <span>© 2026 Sluice Systems</span>
          <span className="flex items-center gap-4">
            <a href="#" className="hover:text-ink">
              Privacy
            </a>
            <a href="#" className="hover:text-ink">
              Terms
            </a>
            <span>built for the 3am page</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
