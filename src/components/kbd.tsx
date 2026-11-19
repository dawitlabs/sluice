export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-xs border border-rule-strong bg-paper px-1.5 font-mono text-[10px] leading-none text-ink-soft">
      {children}
    </kbd>
  );
}
