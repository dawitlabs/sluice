import Link from "next/link";
import { Kbd } from "@/components/kbd";
import { type CaptureFilter, WINDOWS, type WindowKey } from "@/lib/data";

const FILTERS: Array<{ id: CaptureFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "errors", label: "Errors" },
  { id: "slow", label: "Slow" },
  { id: "replayed", label: "Replayed" },
];

const WINDOW_KEYS = Object.keys(WINDOWS) as WindowKey[];

function buildHref(options: {
  filter: CaptureFilter;
  window: WindowKey;
  query: string;
}): string {
  const params = new URLSearchParams();
  if (options.filter !== "all") params.set("filter", options.filter);
  if (options.window !== "24h") params.set("window", options.window);
  if (options.query.trim() !== "") params.set("q", options.query.trim());
  const suffix = params.toString();
  return suffix === "" ? "/console" : `/console?${suffix}`;
}

export function FilterBar({
  counts,
  filter,
  windowKey,
  query,
}: {
  counts: Record<CaptureFilter, number>;
  filter: CaptureFilter;
  windowKey: WindowKey;
  query: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-rule py-3">
      <fieldset
        aria-label="Filter captures"
        className="m-0 flex min-w-0 flex-wrap gap-1 rounded-full border border-rule p-0.5"
      >
        {FILTERS.map((item) => {
          const isActive = filter === item.id;
          return (
            <Link
              key={item.id}
              href={buildHref({ filter: item.id, window: windowKey, query })}
              aria-current={isActive ? "true" : undefined}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.06em] uppercase transition-colors ${
                isActive ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
              }`}
            >
              {item.label}
              <span className={isActive ? "text-paper/55" : "text-ink-faint"}>
                {counts[item.id]}
              </span>
            </Link>
          );
        })}
      </fieldset>

      <fieldset
        aria-label="Time window"
        className="m-0 flex min-w-0 items-center gap-1 rounded-full border border-rule p-0.5"
      >
        {WINDOW_KEYS.map((key) => {
          const isActive = windowKey === key;
          return (
            <Link
              key={key}
              href={buildHref({ filter, window: key, query })}
              aria-current={isActive ? "true" : undefined}
              className={`rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] uppercase transition-colors ${
                isActive
                  ? "bg-paper-3 text-ink"
                  : "text-ink-faint hover:text-ink"
              }`}
            >
              {key}
            </Link>
          );
        })}
      </fieldset>

      <form
        action="/console"
        method="get"
        className="relative w-full sm:ml-auto sm:w-72"
      >
        <label htmlFor="capture-search" className="sr-only">
          Search captures by path, id or method
        </label>
        {filter !== "all" ? (
          <input type="hidden" name="filter" value={filter} />
        ) : null}
        {windowKey !== "24h" ? (
          <input type="hidden" name="window" value={windowKey} />
        ) : null}
        <input
          id="capture-search"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="path, id, method…"
          className="h-9 w-full rounded-full border border-rule bg-paper pr-9 pl-3 font-mono text-[11px] text-ink placeholder:text-ink-faint focus-visible:border-signal"
        />
        <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2">
          <Kbd>/</Kbd>
        </span>
        <button type="submit" className="sr-only">
          Search captures
        </button>
      </form>
    </div>
  );
}
