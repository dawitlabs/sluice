import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AlertToggle } from "@/features/console/alert-toggle";
import { ListSkeleton } from "@/features/console/list-skeleton";
import { ensureProject, listAlerts } from "@/lib/data";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Alerts — Sluice",
  description: "Alert rules attached to captured failures.",
};

async function Alerts() {
  const user = await requireUser();
  const project = await ensureProject(user.id);
  const alerts = await listAlerts(project.id);

  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border border-rule px-6 py-16 text-center">
        <p className="font-mono text-[11px] tracking-[0.1em] text-ink-faint uppercase">
          no alert rules
        </p>
        <p className="mx-auto mt-3 max-w-[38ch] text-[13px] leading-relaxed text-ink-soft">
          This project has no rules yet. Seed one from{" "}
          <Link
            href="/console/settings"
            className="text-ink underline underline-offset-2"
          >
            settings
          </Link>{" "}
          or replay a capture to see what fires.
        </p>
      </div>
    );
  }

  return (
    <ul className="overflow-hidden rounded-xl border border-rule bg-paper">
      {alerts.map((alert, index) => (
        <li
          key={alert.id}
          className={`grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_10rem] sm:items-center ${
            index > 0 ? "border-t border-rule" : ""
          }`}
        >
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <h2 className="text-[14px] font-medium text-ink">{alert.name}</h2>
              <span className="font-mono text-[9px] tracking-[0.08em] text-ink-faint uppercase">
                {alert.channel}
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-ink-soft">
              {alert.condition}
            </p>
          </div>
          <div className="sm:justify-self-end">
            <AlertToggle
              alertId={alert.id}
              name={alert.name}
              enabled={alert.enabled}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function AlertsPage() {
  return (
    <Suspense fallback={<ListSkeleton rows={3} label="loading alerts…" />}>
      <Alerts />
    </Suspense>
  );
}
