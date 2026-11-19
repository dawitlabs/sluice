import Link from "next/link";

const LINKS = [
  { href: "/console", label: "Console" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#docs", label: "Docs" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="display flex items-baseline gap-2 text-[22px] text-ink"
        >
          Sluice
          <span className="font-mono text-[9px] tracking-[0.14em] text-ink-faint">
            BETA
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] tracking-[0.1em] text-ink-soft uppercase transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/console"
          className="group inline-flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-[13px] font-medium text-paper transition-colors hover:bg-signal-deep"
        >
          Open console
          <span
            aria-hidden="true"
            className="font-mono text-[10px] text-paper/60 transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      </div>
    </header>
  );
}
