import Link from "next/link";

export type Plan = {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  cta: string;
  href: string;
  featured: boolean;
};

export const PLANS: Plan[] = [
  {
    name: "Solo",
    price: "$0",
    cadence: "forever",
    blurb: "One repo, one weekend, one stubborn bug.",
    features: [
      "10,000 captures / month",
      "50 replays / month",
      "7-day retention",
      "1 seat",
    ],
    cta: "Start free",
    href: "/sign-up",
    featured: false,
  },
  {
    name: "Team",
    price: "$49",
    cadence: "per seat / month",
    blurb: "For squads that ship every day and page someone nightly.",
    features: [
      "Unlimited captures",
      "Unlimited replays",
      "30-day retention",
      "Shared captures + Slack alerts",
      "CI replay on pull requests",
    ],
    cta: "Start 14-day trial",
    href: "/sign-up",
    featured: true,
  },
  {
    name: "Scale",
    price: "Custom",
    cadence: "annual",
    blurb: "For regulated teams and anything that cannot leave the VPC.",
    features: [
      "Self-hosted capture store",
      "13-month retention",
      "SSO / SCIM, audit log",
      "Replay inside your network",
      "Named support engineer",
    ],
    cta: "Talk to us",
    href: "/login",
    featured: false,
  },
];

export function PlanGrid() {
  return (
    <div className="overflow-hidden rounded-2xl border border-rule md:grid md:grid-cols-3 md:divide-x md:divide-rule">
      {PLANS.map((plan) => (
        <div
          key={plan.name}
          className={`flex flex-col border-t border-rule p-6 first:border-t-0 sm:p-7 md:border-t-0 ${
            plan.featured ? "bg-paper-2" : "bg-paper"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-[11px] tracking-[0.12em] text-ink uppercase">
              {plan.name}
            </h3>
            {plan.featured ? (
              <span className="rounded-full bg-signal px-2 py-0.5 font-mono text-[9px] tracking-[0.08em] text-paper uppercase">
                most teams
              </span>
            ) : null}
          </div>

          <p className="mt-6 flex items-baseline gap-1.5">
            <span className="display text-[2.6rem] leading-none text-ink">
              {plan.price}
            </span>
            <span className="font-mono text-[10px] text-ink-faint">
              {plan.cadence}
            </span>
          </p>

          <p className="mt-3 min-h-[3.5rem] text-[13.5px] leading-relaxed text-ink-soft">
            {plan.blurb}
          </p>

          <ul className="mt-6 flex-1 space-y-2.5 border-t border-rule pt-5">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex gap-2.5 text-[13px] text-ink-soft"
              >
                <span
                  className="font-mono text-[11px] text-ok"
                  aria-hidden="true"
                >
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <Link
            href={plan.href}
            className={`mt-7 inline-flex h-10 items-center justify-center rounded-full text-[13px] font-medium transition-colors ${
              plan.featured
                ? "bg-signal text-paper hover:bg-signal-deep"
                : "border border-rule-strong text-ink hover:border-ink hover:bg-paper-2"
            }`}
          >
            {plan.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-14 border-b border-rule">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">
              Pricing
            </p>
            <h2 className="display mt-4 max-w-[22ch] text-[clamp(2.1rem,4.6vw,3.3rem)] text-ink">
              Priced per engineer, not per <em>panic</em>.
            </h2>
          </div>
          <p className="max-w-[32ch] text-[14px] leading-relaxed text-ink-soft">
            Replays run in your sandbox, so they cost us almost nothing. That is
            why they are not metered, and why the bill does not spike during the
            worst week of your quarter.
          </p>
        </div>

        <div className="mt-10">
          <PlanGrid />
        </div>

        <p className="mt-5 font-mono text-[10px] tracking-[0.04em] text-ink-faint">
          every plan includes the span tree, the diff, and the same replay
          engine — retention and seats are the only levers
        </p>
        <p className="mt-2 font-mono text-[10px] tracking-[0.04em] text-ink-faint">
          <Link
            href="/pricing"
            className="text-signal-deep underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            compare every limit →
          </Link>
        </p>
      </div>
    </section>
  );
}
