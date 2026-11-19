"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SignOutButton({ email }: { email: string }) {
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setIsPending(true);
    await authClient.signOut();
    window.location.assign("/");
  }

  return (
    <div className="mt-4 border-t border-rule pt-3">
      <p className="truncate font-mono text-[10px] text-ink-soft">{email}</p>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className="mt-2 font-mono text-[10px] tracking-[0.08em] text-ink-faint uppercase transition-colors hover:text-signal disabled:opacity-60"
      >
        {isPending ? "signing out…" : "sign out"}
      </button>
    </div>
  );
}
