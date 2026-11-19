import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/auth-shell";
import { SignUpForm } from "@/features/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create account — Sluice",
  description: "Create a Sluice project and start capturing requests.",
};

export default function SignUpPage() {
  return (
    <AuthShell eyebrow="create account" title="One project, five minutes.">
      <SignUpForm />
    </AuthShell>
  );
}
