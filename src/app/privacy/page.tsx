import type { Metadata } from "next";
import { Footer } from "@/features/landing/closing";
import { Nav } from "@/features/landing/nav";

export const metadata: Metadata = {
  title: "Privacy — Sluice",
  description:
    "What Sluice stores when you sign in and capture requests, how long it keeps it, and how to delete it.",
};

const SECTIONS = [
  {
    heading: "What we store",
    body: [
      "When you sign in with Google or GitHub, we receive your name, email address and provider account id. If you sign up with a password instead, we store your email and a scrypt hash — never the password itself.",
      "When your application sends a captured request, we store the method, path, status, duration, region, release, the request and response bodies, and the span tree. Redaction rules run before the write, so configured fields are never persisted.",
    ],
  },
  {
    heading: "Redaction and retention",
    body: [
      "Authorization headers, cookies and card fields are redacted by default. You can add or remove patterns on the project settings page.",
      "Captures are retained for the number of days set on your project — seven by default. Anything older than the window drops out of the console.",
      "Deleting your account deletes your project, its captures, spans, replays, alert rules and redaction rules by cascade. There is no soft-delete copy.",
    ],
  },
  {
    heading: "Who processes it",
    body: [
      "Vercel hosts the application and runs the server functions. Neon hosts the Postgres database. No analytics, advertising or session-replay vendors are loaded on this site, and there are no third-party tracking scripts.",
    ],
  },
  {
    heading: "What we do not do",
    body: [
      "We do not sell data, share it with advertisers, or use captured request bodies to train models. We do not log request bodies in application logs; errors are logged without payloads.",
    ],
  },
  {
    heading: "Your controls",
    body: [
      "You can delete redaction rules, replace captures by letting them age out of retention, sign out at any time, and request full account deletion by email. Requests are answered within seven days.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-[760px] px-5 py-16 sm:px-8 lg:py-24">
        <p className="font-mono text-[11px] tracking-[0.12em] text-signal uppercase">
          legal · privacy
        </p>
        <h1 className="display mt-4 text-[clamp(2.3rem,5.4vw,3.6rem)] text-ink">
          What we keep, and for <em>how long</em>.
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
              Questions or deletion requests:{" "}
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
