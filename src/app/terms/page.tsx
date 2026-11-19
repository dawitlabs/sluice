import type { Metadata } from "next";
import { Footer } from "@/features/landing/closing";
import { Nav } from "@/features/landing/nav";

export const metadata: Metadata = {
  title: "Terms — Sluice",
  description:
    "Terms for using the Sluice demo: acceptable use, accounts, replay behaviour and liability.",
};

const SECTIONS = [
  {
    heading: "The service",
    body: [
      "Sluice records HTTP requests from applications you control, stores the span tree alongside the payload, and lets you run a replay against a branch. This deployment is a demo: it is provided as-is, without an uptime commitment, and data may be reset during development.",
    ],
  },
  {
    heading: "Accounts",
    body: [
      "You may sign in with Google, GitHub or an email address and password. You are responsible for activity under your account and for keeping your credentials and OAuth sessions secure.",
      "One project is provisioned per account. Accounts that sign in with a provider and later add a password, or the reverse, are linked by verified email address rather than duplicated.",
    ],
  },
  {
    heading: "Acceptable use",
    body: [
      "Send only requests you own or are authorised to capture. Do not use the service to store credentials, payment card data or personal data you have no lawful basis to process. Do not attempt to break the isolation of the replay sandbox or to access another account's captures.",
    ],
  },
  {
    heading: "Replays",
    body: [
      "A replay in this deployment records a result derived from the original capture; it does not execute your application inside a container. Treat replay output as a demonstration of the interface, not as a guarantee about production behaviour.",
    ],
  },
  {
    heading: "Liability",
    body: [
      "The service is provided without warranties. To the extent permitted by law, the operator is not liable for indirect or consequential loss arising from use of the demo, including lost revenue or missed incidents.",
    ],
  },
  {
    heading: "Changes",
    body: [
      "These terms may change as the product does. Material changes will be reflected on this page with an updated date. Continued use after a change constitutes acceptance.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-[760px] px-5 py-16 sm:px-8 lg:py-24">
        <p className="font-mono text-[11px] tracking-[0.12em] text-signal uppercase">
          legal · terms
        </p>
        <h1 className="display mt-4 text-[clamp(2.3rem,5.4vw,3.6rem)] text-ink">
          The rules for using <em>Sluice</em>.
        </h1>
        <p className="mt-4 font-mono text-[10px] tracking-[0.08em] text-ink-faint uppercase">
          last updated 19 november 2026
        </p>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((section) => (
            <section
              key={section.heading}
              className="border-t border-rule pt-6"
            >
              <h2 className="text-[17px] font-medium text-ink">
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="mt-3 text-[14px] leading-relaxed text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section className="border-t border-rule pt-6">
            <h2 className="text-[17px] font-medium text-ink">Contact</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
              <a
                href="mailto:dawit.dev.gg@gmail.com"
                className="text-ink underline decoration-rule-strong underline-offset-2"
              >
                dawit.dev.gg@gmail.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
