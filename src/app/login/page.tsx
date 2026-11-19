import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/auth-shell";
import { LoginForm } from "@/features/auth/login-form";
import { SocialButtons } from "@/features/auth/social-buttons";
import { configuredProviders } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Sign in — Sluice",
  description: "Sign in to the Sluice capture console.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function safeNext(value: string | string[] | undefined): string {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (candidate?.startsWith("/") && !candidate.startsWith("//")) {
    return candidate;
  }
  return "/console";
}

function LoginFallback() {
  return (
    <div className="mt-8 space-y-4" aria-hidden="true">
      <div className="h-16 animate-pulse rounded-lg bg-paper-3" />
      <div className="h-16 animate-pulse rounded-lg bg-paper-3" />
      <div className="h-11 animate-pulse rounded-full bg-paper-3" />
    </div>
  );
}

async function LoginSection({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = safeNext(params.next);

  return (
    <>
      <SocialButtons providers={configuredProviders()} next={next} />
      <LoginForm next={next} />
    </>
  );
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
