import type { Metadata } from "next";
import { ConsoleShell } from "@/features/console/console-shell";
import { REQUESTS, summarizeRequests } from "@/lib/requests";

export const metadata: Metadata = {
  title: "Console — Sluice",
  description: "Captured requests, span trees and replays for acme-api.",
};

export default function ConsolePage() {
  return (
    <ConsoleShell
      records={REQUESTS}
      summary={summarizeRequests(REQUESTS)}
    />
  );
}
