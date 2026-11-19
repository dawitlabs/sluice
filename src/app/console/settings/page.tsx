import type { Metadata } from "next";
import { Suspense } from "react";
import { CopyButton } from "@/features/console/copy-button";
import { ListSkeleton } from "@/features/console/list-skeleton";
import { RedactionManager } from "@/features/console/redaction-manager";
import { SettingsForm } from "@/features/console/settings-form";
import { ensureProject, listRedactions } from "@/lib/data";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Settings — Sluice",
  description: "Retention, redaction and capture defaults for this project.",
};

async function Settings() {
  const user = await requireUser();
  const project = await ensureProject(user.id);
  const rules = await listRedactions(project.id);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-rule bg-paper p-5">
        <h2 className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
          capture defaults
        </h2>
        <div className="mt-4">
          <SettingsForm
            retentionDays={project.retentionDays}
            autoReplay={project.autoReplay}
          />
        </div>
      </section>

      <section className="rounded-xl border border-rule bg-paper p-5">
        <h2 className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
          redaction rules
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
          Matched fields are stripped before the capture is stored, so a replay
          never carries a live secret.
        </p>
        <div className="mt-4">
          <RedactionManager rules={rules} />
        </div>
      </section>

      <section className="rounded-xl border border-rule bg-paper p-5 lg:col-span-2">
        <h2 className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
          install
        </h2>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-rule bg-paper-2 px-3 py-2.5">
          <code className="min-w-0 truncate font-mono text-[11px] text-ink-soft">
            pnpm add @sluice/next && sluice init --project {project.slug}
          </code>
          <CopyButton
            value={`pnpm add @sluice/next && sluice init --project ${project.slug}`}
            label="copy"
          />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-4">
          {[
            { label: "project", value: project.slug },
            { label: "region", value: project.region },
            { label: "retention", value: `${project.retentionDays}d` },
            { label: "auto replay", value: project.autoReplay ? "on" : "off" },
          ].map((item) => (
            <div key={item.label} className="bg-paper px-3 py-2.5">
              <dt className="font-mono text-[9px] tracking-[0.1em] text-ink-faint uppercase">
                {item.label}
              </dt>
              <dd className="mt-1 truncate font-mono text-[11px] text-ink">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 font-mono text-[10px] text-ink-faint">
          demo environment · one project per account · data lives in postgres
        </p>
      </section>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<ListSkeleton rows={2} label="loading settings…" />}>
      <Settings />
    </Suspense>
  );
}
