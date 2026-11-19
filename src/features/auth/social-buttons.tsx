"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { SocialProvider } from "@/lib/providers";

const LABELS: Record<SocialProvider, string> = {
  google: "Continue with Google",
  github: "Continue with GitHub",
};

function ProviderIcon({ provider }: { provider: SocialProvider }) {
  if (provider === "google") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.09Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-ink">
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
    </svg>
  );
}

export function SocialButtons({
  providers,
  next,
}: {
  providers: SocialProvider[];
  next: string;
}) {
  const [pending, setPending] = useState<SocialProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (providers.length === 0) return null;

  async function handleSignIn(provider: SocialProvider) {
    setPending(provider);
    setError(null);

    const result = await authClient.signIn.social({
      provider,
      callbackURL: next,
    });

    if (result?.error) {
      setError(result.error.message ?? "Could not start that sign-in.");
      setPending(null);
    }
  }

  return (
    <div className="mt-8">
      <div className="space-y-2.5">
        {providers.map((provider) => (
          <button
            key={provider}
            type="button"
            onClick={() => handleSignIn(provider)}
            disabled={pending !== null}
            className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-rule-strong bg-paper text-[13px] font-medium text-ink transition-colors hover:border-ink hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ProviderIcon provider={provider} />
            {pending === provider ? "Opening…" : LABELS[provider]}
          </button>
        ))}
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-signal/40 bg-signal-soft px-3 py-2 text-[12px] text-signal-deep"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-rule" aria-hidden="true" />
        <span className="font-mono text-[9px] tracking-[0.14em] text-ink-faint uppercase">
          or with email
        </span>
        <span className="h-px flex-1 bg-rule" aria-hidden="true" />
      </div>
    </div>
  );
}
