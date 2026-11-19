const TILES = ["tile-1", "tile-2", "tile-3", "tile-4"] as const;
const ROWS = [
  "row-1",
  "row-2",
  "row-3",
  "row-4",
  "row-5",
  "row-6",
  "row-7",
  "row-8",
] as const;

export default function ConsoleLoading() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-4">
        {TILES.map((tile) => (
          <div key={tile} className="bg-paper px-4 py-3">
            <span className="block h-2 w-16 animate-pulse rounded-sm bg-paper-3" />
            <span className="mt-2 block h-4 w-10 animate-pulse rounded-sm bg-paper-3" />
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-rule">
        <div className="h-8 border-b border-rule bg-paper-2" />
        <div className="divide-y divide-rule">
          {ROWS.map((row) => (
            <div key={row} className="flex items-center gap-4 px-4 py-3">
              <span className="h-2.5 w-8 animate-pulse rounded-sm bg-paper-3" />
              <span className="h-2.5 flex-1 animate-pulse rounded-sm bg-paper-3" />
              <span className="h-2.5 w-8 animate-pulse rounded-sm bg-paper-3" />
              <span className="h-2.5 w-12 animate-pulse rounded-sm bg-paper-3" />
            </div>
          ))}
        </div>
      </div>
      <p className="font-mono text-[10px] tracking-[0.08em] text-ink-faint uppercase">
        loading captures…
      </p>
    </div>
  );
}
