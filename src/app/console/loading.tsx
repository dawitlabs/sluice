export default function ConsoleLoading() {
  return (
    <div className="min-h-dvh bg-paper">
      <div className="flex h-14 items-center justify-between border-b border-rule px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="h-5 w-16 animate-pulse rounded-sm bg-paper-3" />
          <span className="h-3 w-32 animate-pulse rounded-sm bg-paper-3" />
        </div>
        <span className="h-3 w-20 animate-pulse rounded-sm bg-paper-3" />
      </div>

      <div className="grid grid-cols-2 gap-px border-b border-rule bg-rule sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="bg-paper px-4 py-3 sm:px-6">
            <span className="block h-2 w-16 animate-pulse rounded-sm bg-paper-3" />
            <span className="mt-2 block h-4 w-10 animate-pulse rounded-sm bg-paper-3" />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-rule px-4 py-3 sm:px-6">
        <span className="h-8 w-64 animate-pulse rounded-full bg-paper-3" />
        <span className="h-9 w-full animate-pulse rounded-full bg-paper-3 sm:ml-auto sm:w-72" />
      </div>

      <div className="px-4 py-4 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-rule">
          <div className="h-8 border-b border-rule bg-paper-2" />
          <div className="divide-y divide-rule">
            {Array.from({ length: 9 }, (_, index) => (
              <div key={index} className="flex items-center gap-4 px-4 py-3">
                <span className="h-2.5 w-8 animate-pulse rounded-sm bg-paper-3" />
                <span className="h-2.5 flex-1 animate-pulse rounded-sm bg-paper-3" />
                <span className="h-2.5 w-8 animate-pulse rounded-sm bg-paper-3" />
                <span className="h-2.5 w-12 animate-pulse rounded-sm bg-paper-3" />
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 font-mono text-[10px] tracking-[0.08em] text-ink-faint uppercase">
          loading captures…
        </p>
      </div>
    </div>
  );
}
