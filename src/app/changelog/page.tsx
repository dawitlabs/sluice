import type { Metadata } from "next";
import { Footer } from "@/features/landing/closing";
import { Nav } from "@/features/landing/nav";

export const metadata: Metadata = {
  title: "Changelog — Sluice",
  description:
    "Every shipped change to the capture proxy, replay sandbox, CLI and REST API.",
};

type Entry = {
  version: string;
  date: string;
  title: string;
  changes: string[];
};

const ENTRIES: Entry[] = [
  {
    version: "v0.9.4",
    date: "2026-11-12",
    title: "Diffs open where the bug is",
    changes: [
      "Replay diffs now render inside the capture view, with status, body and header changes on one screen.",
      "The CLI gained --fail-on-diff, so a pull request that changes a captured response fails the build instead of merging quietly.",
      "Header comparison ignores hop-by-hop headers such as connection and transfer-encoding by default.",
    ],
  },
  {
    version: "v0.9.0",
    date: "2026-10-28",
    title: "Replays target a branch, not a guess",
    changes: [
      "sluice replay accepts --branch and runs the original request against that branch's build in an isolated sandbox.",
      "Sandboxes snapshot the Postgres and Redis state the captured request touched, so a replay sees the same rows.",
      "Captures now record the git SHA of the deployment that produced them, visible in the record header.",
    ],
  },
  {
    version: "v0.8.2",
    date: "2026-09-30",
    title: "Redaction rules you can prove",
    changes: [
      "New sluice redact test command prints every path a rule matches before anything is stored.",
      "Default rules now cover card.number, card.cvc, card.expiry and set-cookie alongside authorization and cookie.",
      "Hashed fields use HMAC-SHA256 with a per-project key, so the same value correlates across captures without being stored.",
    ],
  },
  {
    version: "v0.8.0",
    date: "2026-08-19",
    title: "The capture store can live in your VPC",
    changes: [
      "Self-hosted capture store is available on Scale, running the same replay engine inside your network.",
      "Capture delivery retries with exponential backoff and drops after thirty seconds instead of holding the request open.",
      "Every capture read, replay and deletion now writes an audit entry with the requesting user and project.",
    ],
  },
  {
    version: "v0.7.3",
    date: "2026-07-07",
    title: "Tail mode for the terminal",
    changes: [
      "sluice captures tail streams records as they land, filtered by status, path or header value.",
      "Console search accepts request ids, route paths and exact header values in the same input.",
      "Fixed a race that could drop the final span of a request shorter than five milliseconds.",
    ],
  },
  {
    version: "v0.7.0",
    date: "2026-06-02",
    title: "First public beta",
    changes: [
      "The Next.js middleware captures headers, body and the span tree from a one-line install.",
      "Replay runs the original request against a local branch in a sandbox with no production egress.",
      "Free plan ships with seven-day retention and 10,000 captures per month.",
    ],
  },
];

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(date: string) {
  return DATE_FORMAT.format(new Date(`${date}T00:00:00Z`));
}

export default function ChangelogPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="border-b border-rule">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-8 lg:py-20">
            <p className="font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">
              Changelog
            </p>
            <h1 className="display mt-4 max-w-[22ch] text-[clamp(2.6rem,6vw,4.4rem)] text-ink">
              Every change, in <em>order</em>.
            </h1>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-ink-soft">
              Shipped work on the proxy, the sandbox, the CLI and the API. No
              roadmap promises, no versions that only exist in a draft.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1200px] px-5 py-12 sm:px-8 lg:py-16">
          <ol className="border-t border-rule">
            {ENTRIES.map((entry) => (
              <li key={entry.version} className="border-b border-rule">
                <article className="grid gap-5 py-10 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-10 lg:py-12">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.08em] text-signal-deep">
                      {entry.version}
                    </p>
                    <time
                      dateTime={entry.date}
                      className="mt-1.5 block font-mono text-[10px] tracking-[0.08em] text-ink-faint uppercase"
                    >
                      {formatDate(entry.date)}
                    </time>
                  </div>

                  <div>
                    <h2 className="display text-[clamp(1.7rem,3.2vw,2.2rem)] text-ink">
                      {entry.title}
                    </h2>
                    <ul className="mt-4 space-y-2.5">
                      {entry.changes.map((change) => (
                        <li
                          key={change}
                          className="flex gap-3 text-[14px] leading-relaxed text-ink-soft"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.6em] size-1 shrink-0 rounded-full bg-signal"
                          />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rule bg-paper-2 px-5 py-5 sm:px-6">
            <p className="max-w-[52ch] text-[13.5px] leading-relaxed text-ink-soft">
              Running an older version? The middleware is backward compatible
              across every 0.x release, and the CLI upgrades with one command.
            </p>
            <code className="font-mono text-[11px] text-ink">
              pnpm add -D @sluice/cli@latest
            </code>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
