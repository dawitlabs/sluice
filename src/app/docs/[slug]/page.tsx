import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DOCS } from "@/lib/docs";

export function generateStaticParams() {
  return DOCS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata(
  props: PageProps<"/docs/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const doc = DOCS.find((entry) => entry.slug === slug);

  if (!doc) {
    return { title: "Not found — Sluice docs" };
  }

  return {
    title: `${doc.title} — Sluice docs`,
    description: doc.description,
  };
}

export default async function DocView(props: PageProps<"/docs/[slug]">) {
  const { slug } = await props.params;
  const ordered = [...DOCS].sort((a, b) => a.order - b.order);
  const doc = ordered.find((entry) => entry.slug === slug);

  if (!doc) {
    notFound();
  }

  const index = ordered.findIndex((entry) => entry.slug === doc.slug);
  const previous = index > 0 ? ordered[index - 1] : undefined;
  const next = index < ordered.length - 1 ? ordered[index + 1] : undefined;

  return (
    <article className="max-w-[68ch]">
      <p className="font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">
        Docs · {String(doc.order).padStart(2, "0")}
      </p>
      <h1 className="display mt-4 text-[clamp(2.3rem,5.4vw,3.5rem)] text-ink">
        {doc.title}
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
        {doc.description}
      </p>

      <div className="mt-10 space-y-10">
        {doc.sections.map((section, sectionIndex) => {
          const headingId = `${doc.slug}-section-${sectionIndex}`;

          return (
            <section key={section.heading} aria-labelledby={headingId}>
              <h2
                id={headingId}
                className="text-[18px] font-medium tracking-[-0.01em] text-ink"
              >
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[14.5px] leading-relaxed text-ink-soft"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.code ? (
                <pre className="mt-4 overflow-x-auto rounded-lg border border-rule bg-paper-2 p-4 font-mono text-[12px] leading-[1.7] text-ink">
                  <code>{section.code}</code>
                </pre>
              ) : null}
            </section>
          );
        })}
      </div>

      <nav
        aria-label="Documentation pagination"
        className="mt-14 border-t border-rule pt-6"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          {previous ? (
            <Link href={`/docs/${previous.slug}`} className="group">
              <span className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
                Previous
              </span>
              <span className="mt-1 block text-[14px] text-ink-soft transition-colors group-hover:text-ink">
                ← {previous.title}
              </span>
            </Link>
          ) : null}
          {next ? (
            <Link
              href={`/docs/${next.slug}`}
              className="group sm:ml-auto sm:text-right"
            >
              <span className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
                Next
              </span>
              <span className="mt-1 block text-[14px] text-ink-soft transition-colors group-hover:text-ink">
                {next.title} →
              </span>
            </Link>
          ) : null}
        </div>
      </nav>
    </article>
  );
}
