import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/auth-shell";
import { SocialButtons } from "@/features/auth/social-buttons";
import { configuredProviders } from "@/lib/providers";
import { safeNext } from "@/lib/redirect";

export const metadata: Metadata = {
  title: "Sign in — Sluice",
  description: "Sign in to the Sluice capture console with Google or GitHub.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function LoginFallback() {
  return (
    <div className="mt-8 space-y-2.5" aria-hidden="true">
      <div className="h-11 animate-pulse rounded-full bg-paper-3" />
      <div className="h-11 animate-pulse rounded-full bg-paper-3" />
    </div>
  );
}

async function LoginSection({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const providers = configuredProviders();

  if (providers.length === 0) {
    return (
      <p className="mt-8 rounded-lg border border-rule bg-paper-2 px-4 py-3 text-[13px] leading-relaxed text-ink-soft">
        No identity provider is configured on this deployment. Set the Google or
        GitHub client credentials to enable sign-in.
      </p>
    );
  }

  return <SocialButtons providers={providers} next={safeNext(params.next)} />;
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <AuthShell eyebrow="sign in" title="Back to the captures.">
      <Suspense fallback={<LoginFallback />}>
        <LoginSection searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}
