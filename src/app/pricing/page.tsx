import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/features/landing/closing";
import { Nav } from "@/features/landing/nav";
import { PlanGrid } from "@/features/landing/pricing";

export const metadata: Metadata = {
  title: "Pricing — Sluice",
  description:
    "Three plans, one replay engine. Compare captures, replays, retention, seats, self-hosting and SSO.",
};

type ComparisonRow = {
  label: string;
  solo: string;
  team: string;
  scale: string;
};

const ROWS: ComparisonRow[] = [
  {
    label: "Captures",
    solo: "10,000 / month",
    team: "Unlimited",
    scale: "Unlimited",
  },
  {
    label: "Replays",
    solo: "50 / month",
    team: "Unlimited",
    scale: "Unlimited",
  },
  { label: "Retention", solo: "7 days", team: "30 days", scale: "13 months" },
  { label: "Seats", solo: "1", team: "Per seat", scale: "Custom" },
  { label: "Self-hosted", solo: "No", team: "No", scale: "Included" },
  { label: "SSO", solo: "No", team: "No", scale: "SSO / SCIM" },
];

const FAQS = [
  {
    question: "What counts as a capture?",
    answer:
      "Every request that passes the matcher, including successful ones. Captures are counted once at ingest, so a request that exceeds the body limit still counts as one record with the body marked truncated.",
  },
  {
    question: "Do replays touch production?",
    answer:
      "No. A replay runs in a sandbox with copies of the datastores the original request touched. Egress to production hosts is blocked by default, and no replay can charge a customer twice.",
  },
  {
    question: "What happens when a capture ages out?",
    answer:
      "It is deleted at the retention boundary and the delete propagates to replicas within five minutes. Exported fixtures are yours and stay wherever you committed them. Solo keeps seven days, Team thirty, Scale thirteen months.",
  },
  {
    question: "Can the capture store live inside our VPC?",
    answer:
      "On Scale, yes. The capture store and replay sandbox run on your infrastructure, and the control plane only receives project metadata and audit events. Nothing with a payload leaves the network.",
  },
  {
    question: "How are seats counted?",
    answer:
      "A seat is a person with console access. CI tokens and read-only API keys do not consume seats. Adding a teammate mid-cycle prorates at the daily rate for the rest of the month.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="border-b border-rule">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-8 lg:py-20">
            <p className="font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">
              Pricing
            </p>
            <h1 className="display mt-4 max-w-[20ch] text-[clamp(2.6rem,6vw,4.4rem)] text-ink">
              Every limit, on <em>one page</em>.
            </h1>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-ink-soft">
              Captures and replays are the product. Seats and retention are the
              only levers, so the invoice does not move when an incident does.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="plans-heading"
          className="border-b border-rule"
        >
          <div className="mx-auto w-full max-w-[1200px] px-5 py-12 sm:px-8 lg:py-16">
            <h2
              id="plans-heading"
              className="font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase"
            >
              Plans
            </h2>
            <div className="mt-6">
              <PlanGrid />
            </div>
          </div>
        </section>

        <section
          aria-labelledby="compare-heading"
          className="border-b border-rule"
        >
          <div className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-8 lg:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">
                  Compare
                </p>
                <h2
                  id="compare-heading"
                  className="display mt-4 max-w-[24ch] text-[clamp(2rem,4.2vw,3rem)] text-ink"
                >
                  The full <em>table</em>.
                </h2>
              </div>
              <p className="max-w-[34ch] text-[13.5px] leading-relaxed text-ink-soft">
                Same span tree, same diff, same replay engine on every plan. The
                rows below are the only differences.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-rule">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <caption className="sr-only">
                  Captures, replays, retention, seats, self-hosting and SSO by
                  plan
                </caption>
                <thead>
                  <tr className="border-b border-rule-strong">
                    <th
                      scope="col"
                      className="px-4 py-4 font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase sm:px-5"
                    >
                      Limit
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 font-mono text-[10px] tracking-[0.1em] text-ink-soft uppercase sm:px-5"
                    >
                      Solo
                    </th>
                    <th
                      scope="col"
                      className="bg-paper-2 px-4 py-4 font-mono text-[10px] tracking-[0.1em] text-ink uppercase sm:px-5"
                    >
                      Team
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 font-mono text-[10px] tracking-[0.1em] text-ink-soft uppercase sm:px-5"
                    >
                      Scale
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-rule last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="px-4 py-3.5 font-mono text-[10px] tracking-[0.1em] text-ink-soft uppercase sm:px-5"
                      >
                        {row.label}
                      </th>
                      <td
                        className="px-4 py-3.5 text-[13px] text-ink sm:px-5"
                        data-numeric
                      >
                        {row.solo}
                      </td>
                      <td
                        className="bg-paper-2 px-4 py-3.5 text-[13px] text-ink sm:px-5"
                        data-numeric
                      >
                        {row.team}
                      </td>
                      <td
                        className="px-4 py-3.5 text-[13px] text-ink sm:px-5"
                        data-numeric
                      >
                        {row.scale}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 font-mono text-[10px] tracking-[0.04em] text-ink-faint">
              annual billing on Scale · monthly on Team · no card on Solo
            </p>
          </div>
        </section>

        <section aria-labelledby="faq-heading" className="border-b border-rule">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-8 lg:py-20">
            <div className="lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div>
                <p className="font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">
                  FAQ
                </p>
                <h2
                  id="faq-heading"
                  className="display mt-4 max-w-[18ch] text-[clamp(2rem,4.2vw,3rem)] text-ink"
                >
                  Questions that pick the <em>plan</em>.
                </h2>
                <p className="mt-4 max-w-[30ch] text-[13.5px] leading-relaxed text-ink-soft">
                  Anything else goes to a support engineer, not a ticket queue.
                </p>
              </div>

              <div className="mt-8 border-t border-rule lg:mt-0">
                {FAQS.map((faq) => (
                  <details
                    key={faq.question}
                    className="group border-b border-rule"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[15px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                      {faq.question}
                      <span
                        aria-hidden="true"
                        className="font-mono text-[13px] text-ink-faint transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-[62ch] pb-5 text-[14px] leading-relaxed text-ink-soft">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-paper-2">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-7 px-5 py-16 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:py-20">
            <div>
              <p className="font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">
                Start free
              </p>
              <h2 className="display mt-4 max-w-[22ch] text-[clamp(2.2rem,5vw,3.4rem)] text-ink">
                Ten thousand captures before you <em>decide</em>.
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-signal-deep"
              >
                Start free
              </Link>
              <Link
                href="/docs/quickstart"
                className="inline-flex h-11 items-center rounded-full border border-rule-strong px-5 text-sm text-ink transition-colors hover:border-ink hover:bg-paper"
              >
                Read the install guide
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
