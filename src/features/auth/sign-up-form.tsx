"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsPending(true);
    const result = await authClient.signUp.email({ name, email, password });

    if (result.error) {
      setError(result.error.message ?? "Could not create the account.");
      setIsPending(false);
      return;
    }

    window.location.assign("/console");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
      <div>
        <label
          htmlFor="name"
          className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase"
        >
          name
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-rule bg-paper px-3 font-mono text-[12px] text-ink placeholder:text-ink-faint focus-visible:border-signal"
          placeholder="Dawit"
        />
      </div>

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
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-rule bg-paper px-3 font-mono text-[12px] text-ink placeholder:text-ink-faint focus-visible:border-signal"
          placeholder="8–128 characters"
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
        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-ink text-[13px] font-medium text-paper transition-colors hover:bg-signal-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating project…" : "Create account"}
      </button>

      <p className="text-[12px] text-ink-soft">
        Already have one?{" "}
        <Link
          href="/login"
          className="text-ink underline decoration-rule-strong underline-offset-2 hover:decoration-ink"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
