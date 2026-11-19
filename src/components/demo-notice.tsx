export function DemoNotice() {
  return (
    <div className="border-b border-rule bg-paper-2">
      <p className="mx-auto w-full max-w-[1200px] px-5 py-2 font-mono text-[10px] tracking-[0.06em] text-ink-soft sm:px-8">
        <span className="text-signal-deep">demo deployment</span> · captures are
        real · replays are simulated · no code is executed
      </p>
    </div>
  );
}
