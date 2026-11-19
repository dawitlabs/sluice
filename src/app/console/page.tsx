import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Kbd } from "@/components/kbd";
import { CaptureTable } from "@/features/console/capture-table";
import { FilterBar } from "@/features/console/filter-bar";
import { ListKeys } from "@/features/console/list-keys";
import {
  type CaptureFilter,
  countCaptures,
  ensureProject,
  listCaptures,
  summarizeCaptures,
  type WindowKey,
} from "@/lib/data";
import { formatDuration } from "@/lib/format";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Captures — Sluice",
  description: "Every captured request in the current window.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function single(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function parseFilter(value: string): CaptureFilter {
  if (value === "errors" || value === "slow" || value === "replayed") {
    return value;
  }
  return "all";
}

function parseWindow(value: string): WindowKey {
  if (value === "5m" || value === "1h") return value;
  return "24h";
}

const SKELETON_TILES = ["tile-1", "tile-2", "tile-3", "tile-4"] as const;

function CapturesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-4">
        {SKELETON_TILES.map((tile) => (
          <div key={tile} className="bg-paper px-4 py-3">
            <span className="block h-2 w-16 animate-pulse rounded-sm bg-paper-3" />
            <span className="mt-2 block h-4 w-10 animate-pulse rounded-sm bg-paper-3" />
          </div>
        ))}
      </div>
      <p className="font-mono text-[10px] tracking-[0.08em] text-ink-faint uppercase">
        loading captures…
      </p>
    </div>
  );
}

async function Captures({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filter = parseFilter(single(params.filter));
  const windowKey = parseWindow(single(params.window));
  const query = single(params.q).slice(0, 80);

  const user = await requireUser();
  const project = await ensureProject(user.id);

  const [captures, counts, stats] = await Promise.all([
    listCaptures(project.id, { filter, query, window: windowKey }),
    countCaptures(project.id, windowKey),
    summarizeCaptures(project.id, windowKey),
  ]);

  const tiles = [
    { label: `captures · ${windowKey}`, value: String(stats.total) },
    { label: "5xx", value: String(stats.errors), tone: "text-signal" },
    { label: "p95", value: formatDuration(stats.p95Ms) },
    { label: "replayed", value: String(stats.replays) },
  ];

  return (
    <div className="space-y-0">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="bg-paper px-4 py-3">
            <p className="font-mono text-[9px] tracking-[0.1em] text-ink-faint uppercase">
              {tile.label}
            </p>
            <p
              className={`mt-1 font-mono text-lg text-ink tabular-nums ${tile.tone ?? ""}`}
            >
              {tile.value}
            </p>
          </div>
        ))}
      </div>

      <FilterBar
        counts={counts}
        filter={filter}
        windowKey={windowKey}
        query={query}
      />

      {captures.length === 0 ? (
        <div className="mt-4 rounded-xl border border-rule px-6 py-16 text-center">
          <p className="font-mono text-[11px] tracking-[0.1em] text-ink-faint uppercase">
            no captures match
          </p>
          <p className="mx-auto mt-3 max-w-[38ch] text-[13px] leading-relaxed text-ink-soft">
            Nothing landed in this window with these filters. Widen the window,
            relax the query, or replay a capture from another range.
          </p>
          <Link
            href="/console"
            className="mt-5 inline-flex h-9 items-center rounded-full border border-rule-strong px-4 font-mono text-[10px] tracking-[0.08em] text-ink uppercase transition-colors hover:border-ink"
          >
            reset filters
          </Link>
        </div>
      ) : (
        <div className="mt-4">
          <CaptureTable
            captures={captures}
            retentionDays={project.retentionDays}
          />
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] text-ink-faint">
        <span>
          showing {captures.length} of {counts.all} in the last {windowKey}
        </span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Kbd>j</Kbd>
            <Kbd>k</Kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <Kbd>/</Kbd>
            search
          </span>
        </span>
      </div>

      <ListKeys ids={captures.map((capture) => capture.id)} />
    </div>
  );
}

export default function ConsolePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<CapturesSkeleton />}>
      <Captures searchParams={searchParams} />
    </Suspense>
  );
}
