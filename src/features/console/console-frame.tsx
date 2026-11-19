import Link from "next/link";
import { Suspense } from "react";
import { ConsoleNav } from "@/features/console/console-nav";
import { SignOutButton } from "@/features/console/sign-out-button";
import { ensureProject } from "@/lib/data";
import { requireUser } from "@/lib/session";

async function ConsoleFrame({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const project = await ensureProject(user.id);

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-rule lg:flex">
        <div className="flex h-14 items-center border-b border-rule px-4">
          <Link href="/" className="display text-[20px] text-ink">
            Sluice
          </Link>
        </div>

        <ConsoleNav variant="rail" />

        <div className="mt-auto border-t border-rule p-4">
          <p className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
            project
          </p>
          <p className="mt-1 truncate font-mono text-[11px] text-ink">
            {project.name}
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
            {project.region} · {project.retentionDays}d retention
          </p>
          <SignOutButton email={user.email} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-rule">
          <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="/" className="display text-[19px] text-ink lg:hidden">
                Sluice
              </Link>
              <span
                className="hidden text-rule-strong lg:inline"
                aria-hidden="true"
              >
                /
              </span>
              <h1 className="truncate font-mono text-[11px] font-normal text-ink-soft">
                {project.name} · production
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.08em] text-ink-faint uppercase sm:flex">
                <span
                  className="live-dot size-1.5 rounded-full bg-ok"
                  aria-hidden="true"
                />
                streaming
              </span>
              <Link
                href="/"
                className="font-mono text-[10px] tracking-[0.08em] text-ink-soft uppercase transition-colors hover:text-ink"
              >
                site
              </Link>
            </div>
          </div>
          <ConsoleNav variant="bar" />
        </header>

        <main className="flex-1 px-4 py-4 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

export function ConsoleLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-paper">
          <div className="h-14 border-b border-rule" />
          <p className="px-6 py-10 font-mono text-[10px] tracking-[0.08em] text-ink-faint uppercase">
            checking session…
          </p>
        </div>
      }
    >
      <ConsoleFrame>{children}</ConsoleFrame>
    </Suspense>
  );
}
