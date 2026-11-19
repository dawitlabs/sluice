"use client";

import { ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Kbd } from "@/components/kbd";
import { MethodTag, StatusPill } from "@/components/status-pill";
import {
  FILTERS,
  type ConsoleFilter,
  countFilters,
  filterRequests,
} from "@/lib/console";
import {
  formatDuration,
  type ConsoleSummary,
  type RequestRecord,
} from "@/lib/requests";
import { DetailDialog } from "./detail-dialog";

const MAX_BAR_MS = 2400;

const ROW_GRID =
  "grid grid-cols-[2.8rem_minmax(0,1fr)_2.8rem_3.6rem] items-center gap-2 px-3 sm:grid-cols-[3.5rem_minmax(0,1fr)_3.5rem_5.5rem_4.5rem_4.5rem] sm:gap-3 sm:px-4 lg:grid-cols-[3.5rem_minmax(0,1fr)_3.5rem_5.5rem_4.5rem_6.5rem_4.5rem]";

export function ConsoleShell({
  records,
  summary,
}: {
  records: RequestRecord[];
  summary: ConsoleSummary;
}) {
  const [filter, setFilter] = useState<ConsoleFilter>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const visible = useMemo(
    () => filterRequests(records, filter, query),
    [records, filter, query],
  );
  const counts = useMemo(() => countFilters(records), [records]);
  const selected = visible.find((record) => record.id === selectedId) ?? null;

  function handleNavigate(step: 1 | -1) {
    setSelectedId((current) => {
      const index = visible.findIndex((record) => record.id === current);
      const nextIndex = Math.min(
        Math.max(index + step, 0),
        visible.length - 1,
      );
      return visible[nextIndex]?.id ?? current;
    });
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA");

      if (isTyping || selectedId !== null) return;

      if (event.key === "/") {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (event.key !== "j" && event.key !== "k") return;
      event.preventDefault();

      const step = event.key === "j" ? 1 : -1;
      const currentIndex = visible.findIndex(
        (record) => record.id === selectedId,
      );
      const nextIndex = Math.min(
        Math.max(currentIndex + step, 0),
        visible.length - 1,
      );
      const nextRecord = visible[nextIndex];
      if (nextRecord) setSelectedId(nextRecord.id);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, selectedId]);

  const stats = [
    { label: "captures · 5m", value: String(summary.total) },
    { label: "5xx", value: String(summary.errors), tone: "text-signal" },
    { label: "p95", value: formatDuration(summary.p95Ms) },
    { label: "replayed", value: String(summary.replays) },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="sticky top-0 z-30 border-b border-rule bg-paper">
        <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="display text-[20px] text-ink">
              Sluice
            </Link>
            <span className="text-rule-strong" aria-hidden="true">
              /
            </span>
            <h1 className="truncate font-mono text-[11px] font-normal text-ink-soft">
              acme-api · production
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.08em] text-ink-faint uppercase sm:flex">
              <span
                className="live-dot size-1.5 rounded-full bg-ok"
                aria-hidden="true"
              />
              streaming
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.08em] text-ink-soft uppercase transition-colors hover:text-ink"
            >
              site
              <ArrowUpRight aria-hidden="true" className="size-3" />
            </Link>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-px border-b border-rule bg-rule sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-paper px-4 py-3 sm:px-6">
            <p className="font-mono text-[9px] tracking-[0.1em] text-ink-faint uppercase">
              {stat.label}
            </p>
            <p
              className={`mt-1 font-mono text-lg text-ink tabular-nums ${stat.tone ?? ""}`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-rule px-4 py-3 sm:px-6">
        <div
          role="group"
          aria-label="Filter captures"
          className="flex flex-wrap gap-1 rounded-full border border-rule p-0.5"
        >
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.06em] uppercase transition-colors ${
                filter === item.id
                  ? "bg-ink text-paper"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {item.label}
              <span
                className={
                  filter === item.id ? "text-paper/55" : "text-ink-faint"
                }
              >
                {counts[item.id]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:ml-auto sm:w-72">
          <label htmlFor="capture-search" className="sr-only">
            Search captures by path, id or status
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-faint"
          />
          <input
            id="capture-search"
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="path, id, status…"
            className="h-9 w-full rounded-full border border-rule bg-paper pr-9 pl-8 font-mono text-[11px] text-ink placeholder:text-ink-faint focus-visible:border-signal"
          />
          <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2">
            <Kbd>/</Kbd>
          </span>
        </div>
      </div>

      <main className="flex-1 px-4 py-4 sm:px-6">
        <p aria-live="polite" className="sr-only">
          {visible.length} captures shown
        </p>

        <div className="overflow-hidden rounded-xl border border-rule bg-paper">
          <div
            aria-hidden="true"
            className={`hidden border-b border-rule bg-paper-2 py-2 font-mono text-[9px] tracking-[0.1em] text-ink-faint uppercase sm:grid ${ROW_GRID}`}
          >
            <span>method</span>
            <span>path</span>
            <span>status</span>
            <span className="text-right">wall</span>
            <span className="hidden lg:block">region</span>
            <span className="hidden lg:block">release</span>
            <span className="text-right">time</span>
          </div>

          {visible.length > 0 ? (
            <ul className="divide-y divide-rule">
              {visible.map((record) => (
                <li key={record.id}>
                  <button
                    type="button"
                    aria-current={selected?.id === record.id}
                    onClick={() => setSelectedId(record.id)}
                    className={`${ROW_GRID} w-full py-2.5 text-left transition-colors hover:bg-paper-2 aria-[current=true]:bg-paper-2`}
                  >
                    <MethodTag method={record.method} />
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="truncate font-mono text-[11.5px] text-ink">
                        {record.path}
                      </span>
                      {record.replayed ? (
                        <>
                          <span
                            aria-label="replayed"
                            className="shrink-0 font-mono text-[11px] text-signal-deep sm:hidden"
                          >
                            ↻
                          </span>
                          <span className="hidden shrink-0 rounded-full border border-signal/40 px-1.5 py-px font-mono text-[8px] tracking-[0.08em] text-signal-deep uppercase sm:inline">
                            replay
                          </span>
                        </>
                      ) : null}
                    </span>
                    <StatusPill status={record.status} />
                    <span className="flex items-center justify-end gap-2">
                      <span
                        aria-hidden="true"
                        className="hidden h-1 w-7 overflow-hidden rounded-full bg-paper-3 sm:block"
                      >
                        <span
                          className={`block h-1 rounded-full ${
                            record.durationMs >= 1000
                              ? "bg-signal"
                              : record.durationMs >= 400
                                ? "bg-warn"
                                : "bg-ink/45"
                          }`}
                          style={{
                            width: `${Math.min((record.durationMs / MAX_BAR_MS) * 100, 100)}%`,
                          }}
                        />
                      </span>
                      <span className="font-mono text-[10px] text-ink-soft tabular-nums">
                        {formatDuration(record.durationMs)}
                      </span>
                    </span>
                    <span className="hidden font-mono text-[10px] text-ink-faint sm:block">
                      {record.region}
                    </span>
                    <span className="hidden truncate font-mono text-[10px] text-ink-faint lg:block">
                      {record.release}
                    </span>
                    <span className="hidden text-right font-mono text-[10px] text-ink-faint tabular-nums sm:block">
                      {record.at.slice(0, 8)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-16 text-center">
              <p className="font-mono text-[11px] tracking-[0.1em] text-ink-faint uppercase">
                no captures match
              </p>
              <p className="mx-auto mt-3 max-w-[36ch] text-[13px] leading-relaxed text-ink-soft">
                {records.length === 0
                  ? "This project has not received a request yet. Install the middleware and the first capture lands within seconds."
                  : "Nothing in the last five minutes matches that filter. Widen the window or clear the search."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilter("all");
                  setQuery("");
                }}
                className="mt-5 inline-flex h-9 items-center rounded-full border border-rule-strong px-4 font-mono text-[10px] tracking-[0.08em] text-ink uppercase transition-colors hover:border-ink"
              >
                clear filters
              </button>
            </div>
          )}

          {visible.length > 0 ? (
            <div className="border-t border-rule bg-paper-2 px-4 py-2 text-center font-mono text-[9px] tracking-[0.1em] text-ink-faint uppercase">
              end of last 5 minutes · window refreshes on its own
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] text-ink-faint">
          <span>
            showing {visible.length} of {records.length} · retention 7d
          </span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Kbd>j</Kbd>
              <Kbd>k</Kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <Kbd>esc</Kbd>
              close
            </span>
            <span className="flex items-center gap-1">
              <Kbd>/</Kbd>
              search
            </span>
          </span>
        </div>
      </main>

      <DetailDialog
        record={selected}
        onClose={() => setSelectedId(null)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
