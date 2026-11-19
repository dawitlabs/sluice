"use client";

import { useState } from "react";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 font-mono text-[10px] tracking-[0.06em] text-ink-faint uppercase underline decoration-rule-strong underline-offset-2 transition-colors hover:text-ink"
    >
      {isCopied ? "copied" : label}
    </button>
  );
}
