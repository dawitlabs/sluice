"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const DEMO_EMAIL = "demo@sluice.dev";
const DEMO_PASSWORD = "sluice-demo-2026";

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const result = await authClient.signIn.email({ email, password });

    if (result.error) {
      setError(result.error.message ?? "Could not sign in.");
      setIsPending(false);
      return;
    }

    window.location.assign(next);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
      <div>
        <label
          htmlFor="email"
          className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase"
        >
          work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-rule bg-paper px-3 font-mono text-[12px] text-ink placeholder:text-ink-faint focus-visible:border-signal"
          placeholder="you@company.dev"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase"
        >
          password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-rule bg-paper px-3 font-mono text-[12px] text-ink placeholder:text-ink-faint focus-visible:border-signal"
          placeholder="min 8 characters"
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-signal/40 bg-signal-soft px-3 py-2 text-[12px] text-signal-deep"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-signal text-[13px] font-medium text-paper transition-colors hover:bg-signal-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-[12px] text-ink-soft">
        No account yet?{" "}
        <Link
          href="/sign-up"
          className="text-ink underline decoration-rule-strong underline-offset-2 hover:decoration-ink"
        >
          Create one
        </Link>
      </p>

      <div className="rounded-lg border border-rule bg-paper-2 px-3 py-2.5">
        <p className="font-mono text-[9px] tracking-[0.1em] text-ink-faint uppercase">
          seeded demo account
        </p>
        <p className="mt-1 font-mono text-[11px] text-ink-soft">
          {DEMO_EMAIL} · {DEMO_PASSWORD}
        </p>
      </div>
    </form>
  );
}
