import Link from "next/link";

export function AuthShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_0.85fr]">
      <div className="flex flex-col px-5 py-7 sm:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="display text-[22px] text-ink">
            Sluice
          </Link>
          <Link
            href="/"
            className="font-mono text-[10px] tracking-[0.1em] text-ink-soft uppercase transition-colors hover:text-ink"
          >
            back to site
          </Link>
        </header>

        <main className="my-auto w-full max-w-sm py-10">
          <p className="font-mono text-[10px] tracking-[0.12em] text-signal uppercase">
            {eyebrow}
          </p>
          <h1 className="display mt-3 text-[clamp(2rem,5vw,2.7rem)] text-ink">
            {title}
          </h1>
          {children}
        </main>

        <footer className="font-mono text-[10px] text-ink-faint">
          © 2026 Sluice Systems · demo environment
        </footer>
      </div>

      <aside className="hidden flex-col justify-between border-l border-rule bg-paper-2 px-10 py-8 lg:flex">
        <p className="font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">
          what waits inside
        </p>

        <blockquote className="display max-w-[22ch] text-[2.1rem] text-ink">
          The request that broke, <em>kept whole</em>.
        </blockquote>

        <ul className="space-y-3 border-t border-rule pt-5 text-[13px] text-ink-soft">
          <li className="flex gap-2.5">
            <span aria-hidden="true" className="font-mono text-signal">
              →
            </span>
            every span of a failing request, not a log line
          </li>
          <li className="flex gap-2.5">
            <span aria-hidden="true" className="font-mono text-signal">
              →
            </span>
            replay it against a branch without touching production
          </li>
          <li className="flex gap-2.5">
            <span aria-hidden="true" className="font-mono text-signal">
              →
            </span>
            redaction rules that run before storage
          </li>
        </ul>

        <p className="font-mono text-[10px] text-ink-faint">
          postgres:16 · drizzle · better-auth
        </p>
      </aside>
    </div>
  );
}
