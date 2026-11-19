const ROW_KEYS = ["row-1", "row-2", "row-3", "row-4", "row-5"] as const;

export function ListSkeleton({
  rows = 3,
  label,
}: {
  rows?: number;
  label: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-rule bg-paper">
      <div className="border-b border-rule bg-paper-2 px-4 py-2.5">
        <span className="block h-2 w-24 animate-pulse rounded-sm bg-paper-3" />
      </div>
      <div className="divide-y divide-rule">
        {ROW_KEYS.slice(0, rows).map((row) => (
          <div key={row} className="flex items-center gap-4 px-4 py-4">
            <span className="h-2.5 w-10 animate-pulse rounded-sm bg-paper-3" />
            <span className="h-2.5 flex-1 animate-pulse rounded-sm bg-paper-3" />
            <span className="h-2.5 w-16 animate-pulse rounded-sm bg-paper-3" />
          </div>
        ))}
      </div>
      <p className="border-t border-rule px-4 py-2 font-mono text-[9px] tracking-[0.1em] text-ink-faint uppercase">
        {label}
      </p>
    </div>
  );
}
