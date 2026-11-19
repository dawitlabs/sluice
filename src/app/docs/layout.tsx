import Link from "next/link";
import { DemoNotice } from "@/components/demo-notice";
import { Footer } from "@/features/landing/closing";
import { Nav } from "@/features/landing/nav";
import { DOCS } from "@/lib/docs";
import { DocsSidebar } from "./docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = [...DOCS]
    .sort((a, b) => a.order - b.order)
    .map((doc) => ({ slug: doc.slug, title: doc.title }));

  return (
    <>
      <Nav />
      <DemoNotice />
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
          <aside className="border-b border-rule py-8 lg:sticky lg:top-14 lg:max-h-[calc(100dvh-3.5rem)] lg:self-start lg:overflow-y-auto lg:border-b-0 lg:py-14">
            <div className="max-h-64 overflow-y-auto pr-2 lg:max-h-none lg:overflow-visible lg:pr-0">
              <DocsSidebar items={items} />
            </div>
            <div className="mt-8 border-t border-rule pt-5">
              <p className="font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">
                Live
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/status"
                    className="font-mono text-[11px] text-ink-soft transition-colors hover:text-ink"
                  >
                    System status
                  </Link>
                </li>
                <li>
                  <Link
                    href="/changelog"
                    className="font-mono text-[11px] text-ink-soft transition-colors hover:text-ink"
                  >
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/console"
                    className="font-mono text-[11px] text-ink-soft transition-colors hover:text-ink"
                  >
                    Open console
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
          <main className="min-w-0 py-10 lg:py-14">{children}</main>
        </div>
      </div>
      <Footer />
    </>
  );
}
